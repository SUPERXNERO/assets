// https://superxnero.github.io/assets/libs/another.js
class FetchToElement() {
  constructor() {
    this.elements = reloadScanningElements();
  }
  
  reloadFetching() {
    
  }
  reloadScanningElements(justReturn = false) {
    const elements = Array.from(document.querySelectorAll(`[data-fetch]`)).filter(
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
  FetchToElement
}
/*
- test using -

const fetchToElement = new FetchToElement();
*/