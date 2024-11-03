class LangaugeManager {
  #changeEventsKeys = ["language",
    "baseUrl",
    "saveAll",
    "defaultLanguage",
    "changeToDefaultLanguage",
    "elements",
    "languagesContent",
    "textid",
    "textclass",
    "subtextid",
    "textupdatemethod"];
  constructor(settings = {}) {
    this.settings = settings;
    this.languagesContent = {};
    this.changeEvents = {};
    this.elements = this.reloadScanningElements(true);
    if (typeof settings.saveAll !== "boolean") {
      this.setSaveAll(false);
    }
    if (typeof settings.baseUrl !== "string") {
      this.setBaseUrl(null);
    }
    if (typeof settings.changeToDefaultLanguage !== "boolean") {
      if (typeof settings.defaultLanguage === "string" && settings.defaultLanguage.length > 0) {
        this.setChangeToDefaultLanguage(true);
      } else {
        this.setChangeToDefaultLanguage(false);
      }
    }
    if (typeof settings.defaultLanguage !== "string" || settings.defaultLanguage.length < 1) {
      this.setDefaultLanguage(navigator.language.split("-")[0] || "en");
    }
    if (typeof settings.textOptionsName !== "string" || settings.textOptionsName.length < 1) {
      this.setTextOptionsName("textoptions");
    }
    this.setLanguage(this.settings.defaultLanguage);
    if (this.settings.baseUrl) {
      this.setLangContentByUrl(this.settings.baseUrl + this.language + ".json");
    }
  }

  async setLangContentByUrl(url, dontRemove = false) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        this.setLangContent(json, dontRemove);
      } else {
        console.error("Failed to fetch language content.");
      }
    } catch (error) {
      console.error("Error fetching language content:", error);
    }
  }

  getLangContent(language = this.language) {
    return this.languagesContent[language];
  }

  setLangContent(obj, dontRemove = false) {
    if (!obj || !obj.settings || !obj.settings.languageCode) {
      console.error("Invalid language content object.");
      return;
    }
    const languageCode = obj.settings.languageCode;
    obj.settings.dontRemove = obj.settings.dontRemove ?? dontRemove;

    if (!this.settings.saveAll) {
      this.languagesContent = Object.fromEntries(
        Object.entries(this.languagesContent).filter(
          ([, content]) => content.settings.dontRemove
        )
      );
    }
    this.languagesContent[languageCode] = obj;
    this.#callChangeEvent("languagesContent", {
      "languagesContent": this.languagesContent,
      "addedRecently": languageCode
    });
  }

  getLanguage() {
    return this.language;
  }

  async setLanguage(language) {
    let languages = Object.keys(this.languagesContent);
    if (this.settings.baseUrl && !languages.includes(language)) {
      await this.setLangContentByUrl(this.settings.baseUrl + language + ".json");
    }
    languages = Object.keys(this.languagesContent);
    if (!languages.includes(language) && this.settings.defaultLanguage && this.settings.changeToDefaultLanguage === true && languages.includes(this.defaultLanguage)) {
      language = this.defaultLanguage;
    }
    if (!languages.includes(language) && languages.length > 0) {
      console.warn("Selected language not available, First add language content, Then change language");
    }
    this.language = language;
    this.updateElements();
    this.#callChangeEvent("language", language);
  }

  stringifyTextOptions(textoptions) {
    if (textoptions.constructor === Array) {
      textoptions = {
        textid: textoptions[0],
        isclass: textoptions[1],
        subtextid: textoptions[2],
        textupdatemethod: textoptions[3]
      };
    }
    if (textoptions.constructor !== Object) {
      // error
      return;
    }
    const {
      textid,
      isclass,
      subtextid,
      textupdatemethod
    } = textoptions;
    return `${textid || ""},${isclass || ""},${subtextid || ""},${textupdatemethod || ""}`;
  }

  parseTextOptions(textoptions) {
    const [textid,
      isclass,
      subtextid,
      textupdatemethod] = textoptions.split(",");
    return {
      textid: textid || undefined,
      isclass: isclass || undefined,
      subtextid: subtextid || undefined,
      textupdatemethod: textupdatemethod || "textContent"
    };
  }

  getTextOptionsByElement(element) {
    return this.parseTextOptions(element.dataset[this.settings.textOptionsName]);
  }

  getText(textid, isclass, subtextid, variableValue) {
    const langContent = this.getLangContent().content;
    if (!langContent) {
      // error
      return;
    }
    let result = langContent[textid];
    if (!subtextid && isclass !== true) {
      const element = this.getElementById(textid);
      subtextid = this.getTextOptionsByElement(element).subtextid;
    }
    if (subtextid) {
      result = result[subtextid];
    }
    if (variableValue) {
      result = result.replace(/\$\{(.*?)\}/g, (_, variable) => {
        const keys = variable.split('.');
        return keys.reduce((acc, key) => acc && acc[key], {
          variableValue
        });
      });
    }
    return result;
  }

  getTextById(textid, subtextid, variableValue) {
    return this.getText(textid, false, subtextid, variableValue);
  }

  getTextByClass(textclass, subtextid, variableValue) {
    return this.getText(textclass, true, subtextid, variableValue);
  }

  getTextByOptions(textoptions) {
    if (textoptions.constructor === Array) {
      textoptions = textoptions.join(",");
    }
    if (textoptions.constructor === String) {
      textoptions = this.parseTextOptions(textoptions);
    }
    if (textoptions.constructor !== Object) {
      // error
      return;
    }
    return this.getTextByClass(textoptions.textid, textoptions.subtextid);
  }

  getTextByElement(element) {
    return this.getTextByOptions(this.getTextOptionsByElement(element));
  }

  setTextId(textid, newtextid) {
    const elements = this.reloadScanningElements(true);
    const element = elements.filter((element) => this.parseTextOptions(element.dataset[this.settings.textOptionsName]).textid === textid)[0];
    let textoptions = this.getTextOptionsByElement(element);
    let previous = textoptions;
    textoptions["textid"] = newtextid;
    this.setTextOptions(textid, textoptions);
    this.#callChangeEvent("textid", {
      "previous": previous,
      "textoptions": textoptions
    });
  }

  setIsClass(textid, newisclass) {
    const elements = this.reloadScanningElements(true);
    const element = elements.filter((element) => this.parseTextOptions(element.dataset[this.settings.textOptionsName]).textid === textid)[0];
    let textoptions = this.getTextOptionsByElement(element);
    let previous = textoptions;
    if (textoptions["isclass"] === newisclass) {
      // error
      return;
    }
    if (!["false", "true"].includes(newisclass)) {
      // error
      return;
    }
    textoptions["isclass"] = newisclass;
    this.setTextOptions(textid, textoptions);
    this.#callChangeEvent("isclass", {
      "previous": previous,
      "textoptions": textoptions
    });
  }

  setSubTextId(textid, newsubtextid) {
    const elements = this.reloadScanningElements(true);
    const element = elements.filter((element) => this.parseTextOptions(element.dataset[this.settings.textOptionsName]).textid === textid)[0];
    let textoptions = this.getTextOptionsByElement(element);
    let previous = textoptions;
    textoptions["subtextid"] = newsubtextid;
    this.setTextOptions(textid, textoptions);
    this.#callChangeEvent("subtextid", {
      "previous": previous,
      "textoptions": textoptions
    });
  }

  setTextUpdateMethod(textid, newtextupdatemethod) {
    const elements = this.reloadScanningElements(true);
    const element = elements.filter((element) => this.parseTextOptions(element.dataset[this.settings.textOptionsName]).textid === textid)[0];
    let textoptions = this.getTextOptionsByElement(element);
    let previous = textoptions;
    if (!element[newtextupdatemethod]) {
      // error
      return;
    }
    textoptions["textupdatemethod"] = newtextupdatemethod;
    this.setTextOptions(textid, textoptions);
    this.#callChangeEvent("textupdatemethod", {
      "previous": previous,
      "textoptions": textoptions
    });
  }

  setTextOptions(textid, newtextoptions) {
    const elements = this.reloadScanningElements(true);
    const element = elements.filter((element) => this.parseTextOptions(element.dataset[this.settings.textOptionsName]).textid === textid)[0];
    element.dataset[this.settings.textOptionsName] = this.stringifyTextOptions(newtextoptions);
    this.reloadScanningElements();
  }

  getElementById(textid) {
    const elements = this.reloadScanningElements();
    return elements.filter((element) => this.parseTextOptions(element.dataset[this.settings.textOptionsName]).textid === textid)[0];
  }

  updateElement(textid) {
    const elements = this.reloadScanningElements();
    const element = elements.filter((element) => this.parseTextOptions(element.dataset[this.settings.textOptionsName]).textid === textid)[0];
    const textupdatemethod = this.parseTextOptions(element.dataset[this.settings.textOptionsName]).textupdatemethod;
    if (!element[textupdatemethod]) {
      textupdatemethod = "textContent";
    }
    element[textupdatemethod] = this.getTextByElement(element);
    this.reloadScanningElements();
  }

  updateElements(textclass) {
    let elements = this.reloadScanningElements();
    if (textclass) {
      elements = elements.filter(function(element) {
        const textoptions = this.parseTextOptions(element.dataset[this.settings.textOptionsName]);
        return textoptions.isclass === "true" && textoptions.textid === textclass;
      }, this);
    }
    elements.forEach((element) => {
      const textupdatemethod = this.parseTextOptions(element.dataset[this.settings.textOptionsName]).textupdatemethod;
      if (!element[textupdatemethod]) {
        textupdatemethod = "textContent";
      }
      element[textupdatemethod] = this.getTextByElement(element);
    });
    this.reloadScanningElements();
  }

  setSaveAll(saveAll) {
    if (typeof saveAll === "boolean") {
      this.settings.saveAll = saveAll;
      this.#callChangeEvent("saveAll", saveAll);
    } else {
      console.error("Invalid value for saveAll setting.");
    }
  }

  setBaseUrl(baseUrl) {
    if (typeof baseUrl !== "string" && baseUrl !== null) {
      console.error("Invalid value for baseUrl: Not string!");
      return;
    }
    if (baseUrl?.length < 1 && baseUrl !== null) {
      console.error("Invalid value for baseUrl: Empty value!");
      return;
    }
    this.settings.baseUrl = baseUrl;
    this.#callChangeEvent("baseUrl", baseUrl);
  }

  setChangeToDefaultLanguage(changeToDefaultLanguage) {
    if (typeof changeToDefaultLanguage === "boolean") {
      this.settings.changeToDefaultLanguage = changeToDefaultLanguage;
      this.#callChangeEvent("changeToDefaultLanguage", changeToDefaultLanguage);
    } else {
      console.error("Invalid value for changeToDefaultLanguage setting.");
    }
  }

  setDefaultLanguage(defaultLanguage) {
    if (typeof defaultLanguage !== "string" || defaultLanguage.length < 1) {
      // error
      return;
    }
    this.settings.defaultLanguage = defaultLanguage;
    this.#callChangeEvent("defaultLanguage", defaultLanguage);
  }

  setTextOptionsName(textOptionsName) {
    let reg = /^[a-z]+$/g;
    if (!reg.test(textOptionsName)) {
      // error
      return;
    }
    this.settings.textOptionsName = textOptionsName;
    this.reloadScanningElements();
  }

  #callChangeEvent(key, changeData) {
    if (!this.changeEvents[key]) {
      // error
      return;
    }
    this.changeEvents[key](changeData);
  }

  getChangeEventsKeys() {
    return [...this.#changeEventsKeys];
  }

  setChangeEvent(key, fun) {
    if (!this.#changeEventsKeys.includes(key)) {
      // error
      return;
    }
    this.changeEvents[key] = fun;
  }

  reloadScanningElements(justReturn = false) {
    const elements = Array.from(document.querySelectorAll(`[data-${this.settings.textOptionsName}]`)).filter(
      (e) => e.dataset[this.settings.textOptionsName]
    );
    if (!justReturn) {
      this.elements = elements;
    }
    this.#callChangeEvent("elements", elements);
    return elements;
  }
}
export {
  LangaugeManager
}