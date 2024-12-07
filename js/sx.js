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
  }
}

export {
  SxSelect
}