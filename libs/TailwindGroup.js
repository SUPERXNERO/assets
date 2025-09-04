class TailwindGroup {
  constructor(e = "text/tailwindcss-groups") {
    this.scriptType = e;
    this.rules = new Map();
    this.observer = null;
    this.observerScope = "deep";
  }

  init() {
    this.findAndParseGroups();
    this.applyClasses(document.documentElement, "deep");
  }

  findAndParseGroups() {
    const e = document.querySelectorAll(`script[type="${this.scriptType}"]`);
    e.forEach((e) => {
      const t = e.innerHTML;
      let s;
      for (
        ;
        null !==
        (s =
          /([^{]+)\s*\{\s*@apply\s+([^}]+);?\s*}/g.exec(t));

      ) {
        const e = s[1].trim(),
          t = s[2].trim().split(/\s+/).filter(Boolean);

        if (e && t.length > 0) {
          if (this.rules.has(e)) {
            const s = this.rules.get(e);
            this.rules.set(e, [...new Set([...s, ...t])]);
          } else {
            this.rules.set(e, t);
          }
        }
      }
    });
  }

  applyClasses(e, t = "deep") {
    this.rules.forEach((s, n) => {
      try {
        if (e.matches && e.matches(n)) {
          e.classList.add(...s);
        }
        if (t === "deep") {
          e.querySelectorAll(n).forEach((el) => {
            el.classList.add(...s);
          });
        }
      } catch (err) {
        console.error(`TailwindGroup: Invalid selector "${n}".`, err);
      }
    });
  }

  reapplyAll() {
    this.applyClasses(document.documentElement, "deep");
  }

  reapplyFor(e, t = { scope: "deep" }) {
    if (!e || !(e instanceof HTMLElement)) {
      return void console.error(
        'TailwindGroup: "reapplyFor" requires a valid HTML element.'
      );
    }
    const s = t.scope || "deep";
    this.applyClasses(e, s);
  }

  observe(e = document.body, t = { scope: "deep" }) {
    this.observerScope = t.scope || "deep";
    const s = { childList: true, subtree: true },
      n = (mutations) => {
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

    this.observer = new MutationObserver(n);
    this.observer.observe(e, s);
    console.log(
      `TailwindGroup: Observing with scope: "${this.observerScope}" in`,
      e
    );
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      console.log("TailwindGroup: Observer disconnected.");
    }
  }
}