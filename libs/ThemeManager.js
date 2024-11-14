// https://superxnero.github.io/assets/libs/ThemeManager.js

const root = document.documentElement;

class ThemeManager {
  #changeEventsKeys = ["theme",
    "baseUrl",
    "saveAll",
    "defaultTheme",
    "changeToDefaultTheme",
    "themesContent"];
  constructor(settings = {}) {
    this.settings = settings;
    this.themesContent = {};
    this.changeEvents = {};

    if (settings.changeEvents?.constructor === Object) {
      this.changeEvents = settings.changeEvents;
    }
    if (settings.themesContent?.constructor === Object) {
      const themesContent = Object.values(settings.themesContent);
      themesContent.forEach((theme)=> {
        this.setThemeContent(theme);
      });
    }
    if (typeof settings.saveAll !== "boolean") {
      this.setSaveAll(true);
    }
    if (typeof settings.baseUrl !== "string") {
      this.setBaseUrl(null);
    }
    if (typeof settings.changeToDefaultTheme !== "boolean") {
      if (typeof settings.defaultTheme === "string" && settings.defaultTheme.length > 0) {
        this.setChangeToDefaultTheme(true);
      } else {
        this.setChangeToDefaultTheme(false);
      }
    }
    if (typeof settings.defaultTheme !== "string" || settings.defaultTheme.length < 1) {
      this.setDefaultTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark': 'light');
    }
    this.setTheme(this.settings.defaultTheme);
  }

  async setThemeContentByUrl(url, dontRemove = false) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        this.setThemeContent(json, dontRemove);
      } else {
        console.error("Failed to fetch theme content. Status code:", response.status);
      }
    } catch (error) {
      console.error("Error fetching theme content:", error);
    }
  }

  getAvailableThemes() {
    return Object.keys(this.themesContent);
  }

  getThemeContent(theme = this.theme) {
    return this.themesContent[theme];
  }

  setThemeContent(obj, dontRemove = false) {
    if (!obj || !obj.settings || !obj.settings.themeCode) {
      console.error("Invalid theme content object. Missing 'settings' or 'themeCode'.");
      return;
    }
    const themeCode = obj.settings.themeCode;
    obj.settings.dontRemove = obj.settings.dontRemove ?? dontRemove;

    if (!this.settings.saveAll) {
      this.themesContent = Object.fromEntries(
        Object.entries(this.themesContent).filter(
          ([, content]) => content.settings.dontRemove
        )
      );
    }
    this.themesContent[themeCode] = obj;
    this.#callChangeEvent("themesContent", {
      "themesContent": this.themesContent,
      "addedRecently": themeCode
    });
  }

  getTheme() {
    return this.theme;
  }

  async setTheme(theme) {
    let themes = Object.keys(this.themesContent);
    if (typeof this.settings.baseUrl === "string" && !themes.includes(theme)) {
      this.theme = theme;
      await this.setThemeContentByUrl(this.settings.baseUrl + theme + ".json");
    }
    themes = Object.keys(this.themesContent);
    if (!themes.includes(theme) && this.settings.defaultTheme && this.settings.changeToDefaultTheme === true && themes.includes(this.defaultTheme)) {
      theme = this.defaultTheme;
    }
    if (!themes.includes(theme) && themes.length > 0) {
      console.warn("Selected theme not available. Add theme content, to get changes.");
    }
    this.theme = theme;
    if (themes.includes(theme)) {
      this.updateTheme(theme);
    }
    this.#callChangeEvent("theme", theme);
  }

  updateTheme(theme) {
    if (!this.themesContent[theme]) {
      return;
    }
    var themeContent = this.themesContent[theme];
    Object.keys(themeContent.content).forEach((key, index) => {
      const value = Object.values(themeContent.content)[index];
      if (value) {
        root.style.setProperty(`--theme-${key}`, value);
      }
    });
    const dir = themeContent.settings["dir"];
    const fontFamily = themeContent.settings["fontFamily"];
    const className = themeContent.settings["className"];
    if (root) {
      if (dir) {
        root.dir = dir;
      }
      if (fontFamily) {
        root.style.fontFamily = fontFamily;
      }
      if (className) {
        if (className === "{theme}") {
          root.className += ` ${this.theme}Theme`;
        } else {
          root.className += ` ${className}`;
        }
        root.className = Object.values(root.classList).join(" ");
      }
      root.dataset.theme = theme;
    }
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

  setChangeToDefaultTheme(changeToDefaultTheme) {
    if (typeof changeToDefaultTheme === "boolean") {
      this.settings.changeToDefaultTheme = changeToDefaultTheme;
      this.#callChangeEvent("changeToDefaultTheme", changeToDefaultTheme);
    } else {
      console.error("Invalid value for changeToDefaultTheme setting. Expected 'true' or 'false'.");
    }
  }

  setDefaultTheme(defaultTheme) {
    if (typeof defaultTheme !== "string" || defaultTheme.length < 1) {
      console.error("Invalid default theme value. It must be a non-empty string.");
      return;
    }
    this.settings.defaultTheme = defaultTheme;
    this.#callChangeEvent("defaultTheme", defaultTheme);
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
}

export {
  ThemeManager
}
/*
- test using -

const themeManager = new ThemeManager();
*/