// https://superxnero.github.io/assets/libs/GestureController.js
class GestureController {
  constructor(element, handlers = {}) {
    this.element = element;
    this.handlers = handlers;
    this.element.addEventListener()
  }
  
  initEvents() {
    this.element.addEventListener('mousedown', GestureCallbacks.onMouseDown);
    this.element.addEventListener('mouseup', GestureCallbacks.onMouseUp);
    this.element.addEventListener('mousemove', GestureCallbacks.onMouseMove);

    this.element.addEventListener('touchstart', GestureCallbacks.onTouchStart);
    this.element.addEventListener('touchend', GestureCallbacks.onTouchEnd);
    this.element.addEventListener('touchmove', GestureCallbacks.onTouchMove);
  }
}
export {
  GestureController
}




const GestureCallbacks = {
  onMouseDown: function(event) {
    console.log('Mouse down:', event);
    // التعامل مع حدث الضغط على الفأرة
  },
  onMouseUp: function(event) {
    console.log('Mouse up:', event);
    // التعامل مع حدث رفع الضغط على الفأرة
  },
  onMouseMove: function(event) {
    console.log('Mouse move:', event);
    // التعامل مع حدث حركة الفأرة
  },
  onTouchStart: function(event) {
    console.log('Touch start:', event);
    // التعامل مع حدث لمس الشاشة
  },
  onTouchEnd: function(event) {
    console.log('Touch end:', event);
    // التعامل مع حدث إنهاء اللمس
  },
  onTouchMove: function(event) {
    console.log('Touch move:', event);
    // التعامل مع حدث حركة اللمس
  }
};

class GestureController {
  constructor(element) {
    this.element = element;

    // Bind events
    this.initEvents();
  }
}




/*
- test using -

const GestureController = new GestureController(element, handlers);
*/