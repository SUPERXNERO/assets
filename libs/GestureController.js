// https://superxnero.github.io/assets/libs/GestureController.js
class GestureController {
  constructor(element, handlers = {}) {
    this.element = element;
    this.handlers = handlers;
    
    this.initEvents();
  }
  
  initEvents() {
    this.element.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.element.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.element.addEventListener('mousemove', this.onMouseMove.bind(this));

    this.element.addEventListener('touchstart', this.onTouchStart.bind(this));
    this.element.addEventListener('touchend', this.onTouchEnd.bind(this));
    this.element.addEventListener('touchmove', this.onTouchMove.bind(this));
  }
  
  onMouseDown(event) {
    if (typeof this.handlers.onMouseDown === 'function') {
      this.handlers.onMouseDown(event);
    }
  }

  onMouseUp(event) {
    if (typeof this.handlers.onMouseUp === 'function') {
      this.handlers.onMouseUp(event);
    }
  }

  onMouseMove(event) {
    if (typeof this.handlers.onMouseMove === 'function') {
      this.handlers.onMouseMove(event);
    }
  }

  onTouchStart(event) {
    if (typeof this.handlers.onTouchStart === 'function') {
      this.handlers.onTouchStart(event);
    }
  }

  onTouchEnd(event) {
    if (typeof this.handlers.onTouchEnd === 'function') {
      this.handlers.onTouchEnd(event);
    }
  }

  onTouchMove(event) {
    if (typeof this.handlers.onTouchMove === 'function') {
      this.handlers.onTouchMove(event);
    }
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