import * as an from "https://superxnero.github.io/assets/libs/another.js";

const q = (e)=> document.querySelector(e);
const qA = (e)=> document.querySelectorAll(e);

class SxSelect {
  constructor(element, fun) {
    this.element = element;
    this.fun = fun;
    this.init(element);
  }
  init(element = this.element, fun = this.fun) {
    const current = element.querySelector(".current");
    const list = element.querySelector(".list");
    const items = element.querySelectorAll(".list .item");
    current.onclick = function() {
      list.classList.add("show");
      list.offclick(()=> {
        list.classList.remove("show");
      });
    }
    items.forEach((item)=> {
      item.onclick = function() {
        list.classList.remove("show");
        const id = item.dataset.id;
        fun(id, {
          select: element,
          current: current,
          list: list
        });
      }
    });
    function maxHeight() {
      const height = window.innerHeight;
      const rect = current.getBoundingClientRect().toJSON();
      const top = rect.top;
      const calcBottom = height - top;
      let result = calcBottom - 20;
      if (result < 50) {
        const bottom = rect.bottom;
        const calcTop = height - (height - bottom);
        result = calcTop - 20;
        list.style.bottom = "0";
        list.style.top = "auto";
      } else {
        list.style.bottom = "auto";
        list.style.top = "0";
      }
      list.style.maxHeight = `${result}px`;
    }
    maxHeight();
    window.addEventListener("resize", maxHeight);
  }
}

Element.prototype.allChildren = function(includeSelf = false) {
  let children = Array.from(this.children);
  children.forEach(child => {
    children.push(...child.allChildren());
  });
  return includeSelf ? [this,
    ...children]: children;
};
Element.prototype.offclick = function (fun,
  other = {}) {
  let element = this;

  if (other == true) other = {
    elementPlus: true
  }
  let conditon = other.conditon || 'true',
  lockEvents = other.lockEvents || false,
  elementPlus = other.elementPlus,
  notLock = other.notLock,
  clearEvent = other.clearEvent;
  document.addEventListener('mouseup',
    offClick);

  let elements = [element];
  if (elementPlus && elementPlus.v) {
    if (an.isOneElement(elementPlus)) elements = [element,
      elementPlus];
    else elements = [element,
      ...elementPlus];
  }

  if (lockEvents) {
    if (!notLock) notLock = elements;
    element.lockEvents('lock', notLock);
  }

  function offClick(events) {
    let event = events || events.changedTouches[0];

    if (elementPlus == true) {
      removeEvent(event);
      return;
    }

    let isNoClick = elements.length;
    elements.forEach(element => {
      if (event.target !== element) isNoClick--;
      if (element.children) {
        isNoClick += element.allChildren().length;
        element.allChildren().forEach(child=> {
          if (event.target !== child) isNoClick--;
        });
      }
    });
    var cond = typeof conditon == 'function' ? conditon(event): typeof conditon == 'boolean' ? conditon: '';
    if (isNoClick === 0 && cond !== false || cond === true) removeEvent(event);
  }
  function removeEvent(event) {
    document.removeEventListener('mouseup', offClick);
    if (lockEvents) element.lockEvents('unlock', notLock);
    if (typeof fun == 'function') fun(event);
  }
}

export {
  SxSelect
}