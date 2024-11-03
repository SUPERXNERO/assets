class OnChange {
  constructor(fun,
    value,
    runInStart) {
    this.fun = fun;
    this.value = value;
    this.runInStart = runInStart;
    if (this.runInStart) {
      this.fun(this.value);
    }
  }
  change(value) {
    this.value = value;
    if (this.fun) {
      this.fun(value);
    }
  }
  changeFun(fun) {
    this.fun = fun;
  }
  changeRunInStart(value) {
    this.runInStart = value;
  }
}