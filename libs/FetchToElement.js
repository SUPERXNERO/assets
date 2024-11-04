// https://superxnero.github.io/assets/libs/FetchToElement.js
class FetchToElement() {
  constructor() {
    this.elements = this.reloadScanningElements(true);
  }
  reloadFetching(elements) {
    if (!elements) {
      elements = this.reloadScanningElements();
    }
    elements.forEach(async function(element) {
      const fetchData = element.dataset["fetch"].split(",");
      const fetchUrl = fetchData[0];
      const fetchInsertMethod = fetchData[1] || "innerHTML";
      const response = await fetch(fetchUrl);
      const text = await response.text();
      element[fetchInsertMethod] = text;
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