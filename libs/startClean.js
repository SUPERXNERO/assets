// https://superxnero.github.io/assets/libs/startClean.js

const q = (e)=> document.querySelector(e);
const qA = (e)=> document.querySelectorAll(e);
const root = document.documentElement;
const head = document.head;
const body = document.body;
const realPage = q("#realPage");

function deepClean(element) {
  if (element.contains(realPage) && element !== realPage) {
    element.removeAttribute("class");
    element.removeAttribute("id");
    element.removeAttribute("style");
    return;
  }
  if (realPage.contains(element) || element === realPage) {
    return;
  }
  element.remove();
}

function deleteStyles_Scripts() {
  const scripts = qA("script");
  scripts.forEach(script => {
    if (!script.classList.contains("realScript")) {
      script.remove();
    }
  });
  const styles = qA("style");
  styles.forEach(style => {
    if (!style.classList.contains("realStyle")) {
      style.remove();
    }
  });
}

function deleteElements() {
  let allElements = Array.from(body.querySelectorAll("*"));
  allElements.splice(allElements.length-1, 0, body);
  allElements.splice(allElements.length-1, 0, root);
  allElements.forEach(deepClean);
}

function startClean() {
  return new Promise((resolve, rejected)=> {
    deleteStyles_Scripts();
    body.classList.add("ds-none");
    setTimeout(function() {
      deleteStyles_Scripts();
      setTimeout(function() {
        deleteElements();
        body.classList.remove("ds-none");
        body.removeAttribute("dir");
        body.removeAttribute("lang");
        const metaCharset = document.createElement("meta");
        metaCharset.setAttribute("charset", "UTF-8");
        head.appendChild(metaCharset);
        resolve();
      },
        100);
    }, 0);
  });
}
export {
  startClean
}