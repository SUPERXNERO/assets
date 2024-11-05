// https://superxnero.github.io/assets/libs/GestureController.js
class GestureController {
  constructor(element, handlers = {}) {
    this.element = element;
    this.handlers = handlers;
    
    // Bind events
    this.initEvents();
  }
  
  initEvents() {
    this.element.addEventListener('mousedown', this.onMouseDown);
    this.element.addEventListener('mouseup', this.onMouseUp);
    this.element.addEventListener('mousemove', this.onMouseMove);

    this.element.addEventListener('touchstart', this.onTouchStart);
    this.element.addEventListener('touchend', this.onTouchEnd);
    this.element.addEventListener('touchmove', this.onTouchMove);
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




/*
- test using -

const GestureController = new GestureController(element, handlers);
*/