class TailwindGroup {
  constructor(scriptType = "text/tailwindcss-groups") {
    this.scriptType = scriptType;
    this.rules = new Map();
    this.observer = null;
    this.observerScope = "deep";
  }

  init() {
    this.findAndParseGroups();
    this.applyClasses(document.documentElement, "deep");
  }

  findAndParseGroups() {
    const scripts = document.querySelectorAll(`script[type="${this.scriptType}"]`);

    scripts.forEach((script) => {
      const content = script.innerHTML;
      let match;

      const regex = /([^{]+)\s*\{\s*@apply\s+([^}]+);?\s*}/g;

      while ((match = regex.exec(content)) !== null) {
        const selector = match[1].trim();
        const classes = match[2].trim().split(/\s+/).filter(Boolean);

        if (selector && classes.length > 0) {
          if (this.rules.has(selector)) {
            const existing = this.rules.get(selector);
            this.rules.set(selector, [...new Set([...existing, ...classes])]);
          } else {
            this.rules.set(selector, classes);
          }
        }
      }
    });
  }

  applyClasses(element, scope = "deep") {
    this.rules.forEach((classes, selector) => {
      try {
        if (element.matches && element.matches(selector)) {
          element.classList.add(...classes);
        }

        if (scope === "deep") {
          element.querySelectorAll(selector).forEach((el) => {
            el.classList.add(...classes);
          });
        }
      } catch (err) {
        console.error(`TailwindGroup: Invalid selector "${selector}".`, err);
      }
    });
  }

  reapplyAll() {
    this.applyClasses(document.documentElement, "deep");
  }

  reapplyFor(element, options = { scope: "deep" }) {
    if (!element || !(element instanceof HTMLElement)) {
      console.error('TailwindGroup: "reapplyFor" requires a valid HTML element.');
      return;
    }

    const scope = options.scope || "deep";
    this.applyClasses(element, scope);
  }

  observe(target = document.body, options = { scope: "deep" }) {
    this.observerScope = options.scope || "deep";

    const config = { childList: true, subtree: true };

    const callback = (mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) {
              this.applyClasses(node, this.observerScope);
            }
          }
        }
      }
    };

    this.observer = new MutationObserver(callback);
    this.observer.observe(target, config);

    console.log(
      `TailwindGroup: Observing with scope: "${this.observerScope}" in`,
      target
    );
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      console.log("TailwindGroup: Observer disconnected.");
    }
  }
}