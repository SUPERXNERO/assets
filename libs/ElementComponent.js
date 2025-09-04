class ElementComponent {
  static components = new Map();
  static instances = new Map();
  static #uniqueId = 0;
  static observer = null;

  static define(e, t) {
    if (this.components.has(e)) {
      console.warn(`ElementComponent with name "${e}" is being redefined.`);
    }
    this.components.set(e, t);
    this._setupObserver();
  }

  static use(e, t, s = {}) {
    const n = this.components.get(e);
    if (!n) {
      console.error(`Component "${e}" is not defined.`);
      return null;
    }

    const { data: o = {}, mode: a = "append" } = s;
    const c = this.get(e, { data: o });
    if (c === null) return null;

    const i = parseInt(c.match(/data-component-id="(\d+)"/)[1]);

    switch (a) {
      case "replace":
        t.outerHTML = c;
        break;
      case "update":
        t.innerHTML = c;
        break;
      case "append":
      default:
        t.insertAdjacentHTML("beforeend", c);
    }

    const r = this.instances.get(i);
    if (r) {
      r.element = document.querySelector(`[data-component-id="${i}"]`);
      this._initializeJS(i);
    }
    return i;
  }

  static get(e, t = {}) {
    const s = this.components.get(e);
    if (!s) {
      console.error(`Component "${e}" is not defined.`);
      return null;
    }

    const { data: n = {} } = t;
    const o = ++this.#uniqueId;
    const a = { ...s.initialData, ...n };
    const c = {
      id: o,
      name: e,
      config: s,
      interactiveData: a,
      element: null,
      jsReady: false,
    };

    this.instances.set(o, c);
    this._applyCSS(o, e, s.css);

    return `<div data-component-id="${o}" data-component-name="${e}">
              ${this._processTemplate(s.html, c)}
            </div>`;
  }

  static run(e, t, s = {}) {
    const n = this.instances.get(e);
    if (!n || !n.config.functions[t]) {
      console.error(`Function "${t}" or instance "${e}" not found.`);
      return;
    }
    const o = {
      interactiveData: n.interactiveData,
      runTimeData: s,
      instance: n,
    };
    n.config.functions[t].call(n.config.functions, o);
  }

  static _processTemplate(e, t) {
    let s = e;
    const n = t.interactiveData;

    s = s.replace(
      /--{if\s+(.*?)}--([\s\S]*?)--{\/if}--/g,
      (match, cond, body) => {
        try {
          return new Function("object", `return !!(${cond})`)(n) ? body : "";
        } catch (err) {
          console.error(`Error evaluating condition "${cond}":`, err);
          return "";
        }
      }
    );

    s = s.replace(
      /--{ElementComponent.get\("([^"]+)"\s*,\s*({.*?})\)}--/g,
      (match, name, dataStr) => {
        try {
          const o = new Function("object", `return ${dataStr}`)(n);
          return this.get(name, { data: o });
        } catch (err) {
          console.error(`Error parsing nested component data for "${name}":`, err);
          return "";
        }
      }
    );

    s = s.replace(/--{object\.([^}]+)}--/g, (match, keyPath) => {
      const val = keyPath.split(".").reduce((obj, k) => (obj || {})[k], n);
      return val !== undefined ? val : "";
    });

    return s;
  }

  static _applyCSS(e, t, s) {
    if (!s || document.querySelector(`style[data-component-style-for="${t}"]`)) {
      return;
    }
    const n = document.createElement("style");
    n.setAttribute("data-component-style-for", t);
    n.textContent = s.replace(/&/g, `[data-component-name="${t}"]`);
    document.head.appendChild(n);
  }

  static _setupObserver() {
    if (this.observer) return;

    this.observer = new MutationObserver((mutations) => {
      for (const t of mutations) {
        if (t.type === "childList") {
          t.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              if (node.matches("[data-component-id]")) {
                this._initializeJS(parseInt(node.dataset.componentId));
              }
              node
                .querySelectorAll("[data-component-id]")
                .forEach((el) =>
                  this._initializeJS(parseInt(el.dataset.componentId))
                );
            }
          });

          t.removedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              if (node.matches("[data-component-id]")) {
                this._destroyInstance(parseInt(node.dataset.componentId));
              }
              node
                .querySelectorAll("[data-component-id]")
                .forEach((el) =>
                  this._destroyInstance(parseInt(el.dataset.componentId))
                );
            }
          });
        }
      }
    });

    this.observer.observe(document.body, { childList: true, subtree: true });
  }

  static _initializeJS(e) {
    const t = this.instances.get(e);
    if (!t || t.jsReady) return;

    const s = document.querySelector(`[data-component-id="${e}"]`);
    if (!s) return;

    t.element = s;
    const n = t.config;

    if (n.events && Array.isArray(n.events)) {
      n.events.forEach((ev) => {
        const o = ev.element;
        const target = o === "&" ? s : s.querySelector(o);
        if (target) {
          target.addEventListener(ev.event, (event) => {
            const fn = n.functions[ev.function];
            if (fn) {
              fn.call(n.functions, {
                interactiveData: t.interactiveData,
                instance: t,
                event,
                eventData: ev.data || {},
              });
            }
          });
        }
      });
    }

    if (n.functions && n.functions.onReady) {
      const ctx = { instance: t, interactiveData: t.interactiveData };
      n.functions.onReady.call(n.functions, ctx);
    }

    t.jsReady = true;
  }

  static _destroyInstance(e) {
    const t = this.instances.get(e);
    if (t) {
      const s = t.config;
      if (s.functions && s.functions.onDestroy) {
        s.functions.onDestroy.call(s.functions, {
          instance: t,
          interactiveData: t.interactiveData,
        });
      }
      this.instances.delete(e);
    }
  }
}