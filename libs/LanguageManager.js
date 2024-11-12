// https://superxnero.github.io/assets/libs/LanguageManager.js
// make settings private, and create a function to get settings
const root = document.documentElement;

class LanguageManager {
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
    if (settings.changeEvents?.constructor === Object) {
      this.changeEvents = settings.changeEvents;
    }
    if (settings.languagesContent?.constructor === Object) {
      const languagesContent = Object.values(settings.languagesContent);
      languagesContent.forEach((languageContent)=>{
        this.setLangContent(languageContent);
      });
    }
    if (typeof settings.saveAll !== "boolean") {
      this.setSaveAll(true);
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
  }

  async setLangContentByUrl(url, dontRemove = false) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        this.setLangContent(json, dontRemove);
      } else {
        console.error("Failed to fetch language content. Status code:", response.status);
      }
    } catch (error) {
      console.error("Error fetching language content:", error);
    }
  }

  getAvailableLanguages() {
    return Object.keys(this.languagesContent);
  }

  getLangContent(language = this.language) {
    return this.languagesContent[language];
  }

  setLangContent(obj, dontRemove = false) {
    if (!obj || !obj.settings || !obj.settings.languageCode) {
      console.error("Invalid language content object. Missing 'settings' or 'languageCode'.");
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
    if (typeof this.settings.baseUrl === "string" && !languages.includes(language)) {
      await this.setLangContentByUrl(this.settings.baseUrl + language + ".json");
    }
    languages = Object.keys(this.languagesContent);
    if (!languages.includes(language) && this.settings.defaultLanguage && this.settings.changeToDefaultLanguage === true && languages.includes(this.defaultLanguage)) {
      language = this.defaultLanguage;
    }
    if (!languages.includes(language) && languages.length > 0) {
      console.warn("Selected language not available. Add language content first, then change language.");
    }
    this.language = language;
    const langContent = this.getLangContent();
    if (langContent && langContent.settings) {
      const dir = langContent.settings["dir"];
      const fontFamily = langContent.settings["fontFamily"];
      const className = langContent.settings["className"];
      if (dir) {
        const elements = this.reloadScanningElements(true);
        elements.forEach((element)=> {
          element.dir = dir;
        });
      }
      if (root) {
        if (fontFamily) {
          root.style.fontFamily = fontFamily;
        }
        if (className) {
          if (className === "{language}") {
            root.className += ` ${this.language}Language`;
          } else {
            root.className += ` ${className}`;
          }
          root.className = Object.values(root.classList).join(" ");
        }
      }
    }
    if (languages.includes(language)) {
      this.updateElements();
    }
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
    } else if (typeof textoptions === "string") {
      textoptions = parseTextOptions(textoptions);
    }
    if (textoptions.constructor !== Object) {
      console.error("Invalid textoptions format. Expected an object or array.");
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
    const langContent = this.getLangContent()?.content;
    if (!langContent) {
      console.error("Language content not loaded. Unable to retrieve text.");
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
      console.error("Invalid textoptions format. Expected an object, string, or array.");
      return;
    }
    return this.getTextByClass(textoptions.textid, textoptions.subtextid);
  }

  getTextByElement(element) {
    return this.getTextByOptions(this.getTextOptionsByElement(element));
  }

  setTextId(textid, newtextid) {
    const elements = this.reloadScanningElements(true);
    const element = elements.find((element) => this.parseTextOptions(element.dataset[this.settings.textOptionsName]).textid === textid);
    if (!element) {
      console.warn(`Element with text ID '${textid}' not found.`);
      return;
    }
    let textoptions = this.getTextOptionsByElement(element);
    let previous = {
      ...textoptions
    };
    if (textoptions["textid"] === newtextid) {
      console.warn("The textid value is already set to the new value.");
      return;
    }
    textoptions["textid"] = newtextid;
    this.setTextOptions(textid, textoptions);
    this.#callChangeEvent("textid", {
      "previous": previous,
      "textoptions": textoptions
    });
  }

  setIsClass(textid, newisclass) {
    const elements = this.reloadScanningElements(true);
    const element = elements.find((element) => this.parseTextOptions(element.dataset[this.settings.textOptionsName]).textid === textid);
    if (!element) {
      console.warn(`Element with text ID '${textid}' not found.`);
      return;
    }
    let textoptions = this.getTextOptionsByElement(element);
    let previous = {
      ...textoptions
    };
    if (textoptions["isclass"] === newisclass) {
      console.warn("The isclass value is already set to the new value.");
      return;
    }
    if (!["false", "true"].includes(newisclass)) {
      console.error("Invalid isclass value. Expected 'true' or 'false'.");
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
    const element = elements.find((element) => this.parseTextOptions(element.dataset[this.settings.textOptionsName]).textid === textid);
    if (!element) {
      console.warn(`Element with text ID '${textid}' not found.`);
      return;
    }
    let textoptions = this.getTextOptionsByElement(element);
    let previous = {
      ...textoptions
    };
    textoptions["subtextid"] = newsubtextid;
    this.setTextOptions(textid, textoptions);
    this.#callChangeEvent("subtextid", {
      "previous": previous,
      "textoptions": textoptions
    });
  }

  setTextUpdateMethod(textid, newtextupdatemethod) {
    const elements = this.reloadScanningElements(true);
    const element = elements.find((element) => this.parseTextOptions(element.dataset[this.settings.textOptionsName]).textid === textid);
    let textoptions = this.getTextOptionsByElement(element);
    let previous = {
      ...textoptions
    };

    if (!element) {
      console.warn(`Element with text ID '${textid}' not found.`);
      return;
    }

    if (element[newtextupdatemethod] === undefined) {
      console.error(`Invalid update method '${newtextupdatemethod}' for the element. Update method does not exist.`);
      return;
    }

    textoptions["textupdatemethod"] = newtextupdatemethod;
    this.setTextOptions(textid, textoptions);
    this.#callChangeEvent("textupdatemethod", {
      "previous": previous,
      "textoptions": textoptions
    });
  }

  setTextOptions(textid, newtextoptions, update=true) {
    if (typeof newtextoptions === "string") {
      newtextoptions = this.parseTextOptions(newtextoptions);
    }

    const elements = this.reloadScanningElements(true);
    const element = elements.find((element) => this.parseTextOptions(element.dataset[this.settings.textOptionsName]).textid === textid);

    if (!element) {
      console.warn(`Element with text ID '${textid}' not found. Unable to set text options.`);
      return;
    }
    let textoptions = this.getTextOptionsByElement(element);
    newtextoptions.textid = newtextoptions.textid !== undefined ? newtextoptions.textid: textoptions.textid;
    newtextoptions.isclass = newtextoptions.isclass !== undefined ? newtextoptions.isclass: textoptions.isclass;
    newtextoptions.subtextid = newtextoptions.subtextid !== undefined ? newtextoptions.subtextid: textoptions.subtextid;
    newtextoptions.textupdatemethod = newtextoptions.textupdatemethod !== undefined ? newtextoptions.textupdatemethod: textoptions.textupdatemethod;

    element.dataset[this.settings.textOptionsName] = this.stringifyTextOptions(newtextoptions);
    this.reloadScanningElements();
    if (update) {
      this.updateElement(textid);
    }
  }

  getElementById(textid) {
    const elements = this.reloadScanningElements();
    const element = elements.find((element) => this.parseTextOptions(element.dataset[this.settings.textOptionsName]).textid === textid);

    if (!element) {
      console.warn(`No element found with text ID '${textid}'.`);
    }

    return element;
  }

  updateElement(textid, variableValue) {
    const elements = this.reloadScanningElements(true);
    const element = elements.find((element) => this.parseTextOptions(element.dataset[this.settings.textOptionsName]).textid === textid);

    if (!element) {
      console.warn(`Element with text ID '${textid}' not found. Update skipped.`);
      return;
    }

    let textupdatemethod = this.parseTextOptions(element.dataset[this.settings.textOptionsName]).textupdatemethod;
    if (element[textupdatemethod] === undefined) {
      console.warn(`Invalid update method '${textupdatemethod}' for element. Using 'textContent' as fallback.`);
      textupdatemethod = "textContent";
    }
    
    const textoptions = this.getTextOptionsByElement(element);
    element[textupdatemethod] = this.getText(textoptions.textid, textoptions.isclass, textoptions.subtextid, variableValue);
    this.reloadScanningElements();
  }

  updateElements(textclass) {
    let elements = this.reloadScanningElements(true);
    if (textclass) {
      elements = elements.filter((element) => {
        const textoptions = this.parseTextOptions(element.dataset[this.settings.textOptionsName]);
        return textoptions.isclass === "true" && textoptions.textid === textclass;
      });
    }
    elements.forEach((element) => {
      let textupdatemethod = this.parseTextOptions(element.dataset[this.settings.textOptionsName]).textupdatemethod;
      if (element[textupdatemethod] === undefined) {
        console.warn(`Invalid update method '${textupdatemethod}' for element. Using 'textContent' as fallback.`);
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
      console.error("Invalid value for baseUrl");
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
      console.error("Invalid value for changeToDefaultLanguage setting. Expected 'true' or 'false'.");
    }
  }

  setDefaultLanguage(defaultLanguage) {
    if (typeof defaultLanguage !== "string" || defaultLanguage.length < 1) {
      console.error("Invalid default language value. It must be a non-empty string.");
      return;
    }
    this.settings.defaultLanguage = defaultLanguage;
    this.#callChangeEvent("defaultLanguage", defaultLanguage);
  }

  setTextOptionsName(textOptionsName, changeToNewName) {
    const reg = /^[a-z]+$/g;
    if (!reg.test(textOptionsName)) {
      console.error("Invalid text options name. It must contain only lowercase letters.");
      return;
    }
    if (changeToNewName) {
      const elements = this.reloadScanningElements(true);
      elements.forEach((element)=> {
        const textoptions = element.dataset[this.settings.textOptionsName];
        element.removeAttribute(`data-${this.settings.textOptionsName}`);
        element.dataset[textOptionsName] = textoptions;
      });
    }
    this.settings.textOptionsName = textOptionsName;
    this.reloadScanningElements();
  }

  #callChangeEvent(key, changeData) {
    if (!this.changeEvents[key]) {
      return;
    }
    this.changeEvents[key](changeData);
  }

  getChangeEventsKeys() {
    return [...this.#changeEventsKeys];
  }

  setChangeEvent(key, fun) {
    if (!this.#changeEventsKeys.includes(key)) {
      console.error(`Invalid key: ${key}. Cannot set change event.`);
      return;
    }

    if (typeof fun !== 'function') {
      console.error(`Provided value for key ${key} is not a function.`);
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
  LanguageManager
}
/*
- test using -

const languageManager = new LanguageManager();
*/