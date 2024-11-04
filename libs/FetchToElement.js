// https://superxnero.github.io/assets/libs/another.js
class FetchToElement() {
  constructor() {
    this.elements = this.reloadScanningElements(true);
  }
  
  async reloadFetching(elements) {
    elements.forEach(async function(element) {
      
    });
  }
  reloadScanningElements(justReturn = false) {
    const elements = Array.from(document.querySelectorAll(`[data-fetch]`)).filter(
      (e) => e.dataset["fetch"]
    );
    if (!justReturn) {
      this.elements = elements;
    }
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