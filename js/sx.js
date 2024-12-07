import * as an from "/storage/5A67-DF85/GitHub/assets/libs/another.js";

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

export {
  SxSelect
}