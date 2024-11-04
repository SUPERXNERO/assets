// https://superxnero.github.io/assets/libs/another.js
class FetchToElement() {
  constructor() {
    this.elements = this.reloadScanningElements(true);
  }
  
  reloadFetching(elements) {
    elements.forEach(async function(element) {
      const fetchData = element.dataset["fetch"].split(",");
      
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