import * as an from './another.js';
let c = (...e)=>e.length > 1 ? console.log(e.join(' | ')): console.log(e[0]);

// Variables
let menuPosI = 0;

/* functions date
١- تحويل من الفورمات الى البيانات والعكس
٢- تعديل الفورمات وارجاع المعدل
٣- حساب الوقت المتبقي بين تاريخين كبيانات او فورمات او كتابة مثل (متبقي ١ يوم) مع امكانية تحديد الكمية المطلوبة مثل اريد الفارق بينهم بالايام او الساعات وغيرها
٤- حساب تاريخ الان كبيانات او فورمات
٥- حساب العمر
٦- تحويل الوقت من صيغة ٢٤ الى ١٢ والعكس
*/
/*
كتابة ما تفعله في يومك من سوء وحسنaahiijjnnn!nnnnnnnnnjnkp00l000  00
*/

/*
كتابة الجدول اليوميnoiio
*/
  
// Variables elements
let body = document.body;

function all() {
  string();
  number();
  object();
  array();
  element();
  moreOne();
}

function moreOne() {}

function string() {
  String.prototype.l = function () {
    return this.length;
  }

  String.prototype.reg = function(option) {
    return new RegExp(this, option || "");
  }

  String.prototype.indexsOf = function(value, isMatches) {
    let str = this;
    if (typeof value === "string") {
      value = new RegExp(value, "g");
    }
    let matches = [...str.matchAll(value)];
    if (matches.length === 0) {
      return -1;
    }
    if (isMatches) return matches;
    let indexes = [];
    for (let match of matches) {
      indexes.push(match.index);
    }
    return indexes;
  }

  String.prototype.open = function (fun) {
    let ret = [];
    fetch(this).then(res => {
      ret[0] = res;
      if (res.ok) res.blob().then(blob => {
        ret[1] = blob;
        blob.text().then(text => {
          if (typeof fun == 'function') fun(text, {
            blob: ret[1],
            res: ret[0],
            size: ret[1].size
          });
        })})});
  }

  String.prototype.download = function (name = new Date()) {
    let link = document.createElement('a');
    link.download = name;
    link.href = this;
    link.click();
    link.remove();
  }

  String.prototype.blob = function(type) {
    return new Blob([this], {
      type: type || 'text/plain'
    });
  }

  String.prototype.file = function(name, type) {
    return new File([this], name, {
      type: type || 'text/plain'
    });
  }

  String.prototype.link = function () {
    let link = document.createElement('a');
    link.href = this;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  String.prototype.n = function (isFloat) {
    return Number[isFloat ? 'parseFloat': 'parseInt'](this);
  }

  String.prototype.data = function(value) {
    let str = this;
    if (!value) return JSON.parse(localStorage.getItem(str));
    if (typeof value != 'string') value = JSON.stringify(value);

    localStorage.setItem(str, value);
  }

  String.prototype.a = function(item, index, place) {
    let str = this;
    if (!'before,after'.split(',').includes(place)) place = 'after';

    if (typeof index == 'string') {
      let indexOf = str.indexOf(index);
      if (place == 'before') index = indexOf;
      else index = indexOf + index.length;
    }

    if (typeof index != 'number') index = str.length;

    let ret = str.slice(0, index) + item + str.slice(index);

    return ret;
  }

  String.prototype.get = function(from, to) {
    let str = this,
    froms,
    tos,
    ret = [];

    if (typeof from == "string") from = new RegExp(from, "g");

    froms = str.indexsOf(from, true);

    if (froms === -1) return false;

    froms = froms.map(obj=>obj.index + obj[0].length);
    tos = str.indexsOf(to);

    let length = froms.length > tos.length ? tos.length: froms.length;

    for (var i = 0; i < length; i++) ret[i] = str.slice(froms[i], tos[i]);
    return ret;
  }

  String.prototype.getItem = function(parent) {
    var str = this,
    ret = str.split(":");
    if (ret[0] == "") ret = ret.slice(1);
    if (!parent) return ret;
    let retValue = parent;
    ret.forEach(values=> {
      let value = Number.isNaN(values.n()) ? values: values.n();
      retValue = retValue[value];
    });
    return retValue;
  }

  String.prototype.replaceVar = function(data) {
    let str = this,
    ret = [],
    html = str;
    data.forEach(item=> {
      item.family().all.forEach(_=> {
        var reg = /--\{(.*?)\}--/g,
        matches = [...html.matchAll(reg)];
        if (matches.l() == 0) return;
        var match = matches[0][0],
        str = match.slice(3);
        str = str.slice(0, str.length-3);
        var result = str.getItem(item);
        html = html.replace(match, result);
      });
      ret.push(html);
      html = str;
    });
    return ret;
  }

  String.prototype.dateAsObj = function(asAll, asUndefined) {
    let str = this.split(" "),
    date = (str[0].indexOf("-") != -1 ? str[0].split("-"): str[0].split("/")).map(num=>num.n()),
    hour = str[1] ? str[1].split(":").map(num=>num.n()): asUndefined ? [undefined, undefined]: [0, 0],
    AM_PM = str[2];
    if (asAll) {
      return {
        year: date[0],
        month: date[1],
        day: date[2],
        hour: hour[0],
        minute: hour[1],
        AM_PM: AM_PM
      };
    }
    return {
      date: date,
      hour: hour,
      AM_PM: AM_PM
    };
  }

  String.prototype.age = function(time) {
    var str = this.dateAsObj(),
    dates = str.date,
    hours = str.hour,
    AM_PM = str.AM_PM;

    if (AM_PM == "AM") {
      if (hours[0] == 12) hours[0] = 0;
    } else if (AM_PM == "PM") {
      if (hours[0] < 12) hours[0] += 12;
    }

    let births = {
      "year": dates[0],
      "month": dates[1],
      "day": dates[2],
      "hour": hours[0],
      "minute": hours[1]
    },
    currents = {},
    results = {},
    as = {},
    times = births.k(),
    minDay = 24*60,
    values = [365*minDay,
      30*minDay,
      minDay,
      60,
      1].toObj(times);

    times.forEach(time=> {
      currents[time] = time.date().num;
      results[time] = currents[time] - births[time];
    });
    var result = results.year.equalTo(values.year, [results.month, values.month], [results.day, minDay], [results.hour, 60], results.minute);

    times.forEach(time=>as[time] = (result/values[time]).toFixed(2));
    as.week = (as.day/7).toFixed(2);

    if ([...times, "week"].includes(time)) return as[time];

    return results;
  }

  String.prototype.date = function(lang) {
    let wanted = this,
    date = new Date(),
    wantedObj = {
      "year": "getFullYear",
      "month": "getMonth",
      "week": "getDate",
      "day": "getDate",
      "weekDay": "getDay",
      "hour": "getHours",
      "minute": "getMinutes",
      "second": "getSeconds",
      "millisecond": "getMilliseconds",
      "AM_PM": "getHours"
    },
    weekDays = {
      ar: ["الاحد",
        "الاثنين",
        "الثلاثاء",
        "الإربعاء",
        "الخميس",
        "الجمعة",
        "السبت"],
      en: ["sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"]
    },
    months = {
      ar: ["يناير",
        "فبراير",
        "مارس",
        "ابريل",
        "مايو",
        "يونيو",
        "يوليو",
        "اغسطس",
        "سبتمبر",
        "اكتوبر",
        "نوفمبر",
        "ديسمبر"],
      en: ["january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december"]
    };

    if (wanted == "all") {
      let types = ["year",
        "month",
        "day",
        "hour",
        "minute",
        "second"],
      results = types.map(item=>"").toObj(types);
      results.forEach((v, i, k)=> {
        let date = k.date().num;
        results[k] = date;
      });
      return results;
    }

    let result = {
      num: date[wantedObj[wanted]](),
      text: ""
    },
    number = result.num,
    text = result.text;

    if (!["ar", "en"].includes(lang)) lang = "en";
    if (["month", "weekDay"].includes(wanted)) {
      number++;
      result.text = eval(wanted+"s")[lang][number-1];
    }
    if (wanted == "week") number = (number/7).int();
    if (wanted == "AM_PM") {
      if (number > 12) text = "PM";
      else text = "AM";
    }
    result.num = number;
    result.text = text;
    return result;
  }

  String.prototype.capitalize = function(allWords) {
    let text = this;
    if (!text || !text.match(/[a-zA-Z]/)) {
      return text;
    }
    if (allWords) {
      let words = text.split(/(\s+|\p{P}+)/u);
      let capitalizedWords = [];
      for (let word of words) {
        capitalizedWords.push(word[0].toUpperCase() + word.slice(1));
      }
      return capitalizedWords.join("");
    } else {
      return text[0].toUpperCase() + text.slice(1);
    }
  }

  String.prototype.s = function() {
    return this;
  }

  String.prototype.formatDate = function(data, newValue) {
    let str = this,
    types = ["year",
      "month",
      "day",
      "hour",
      "minute",
      "AM_PM"],
    ret;
    if (typeof data == "object") {
      let newData = data.v();
      newData = newData.map((item, i)=>item == undefined && i != newData.l()-1 ? 0: item);
      newData = newData.toObj(types);
      ret = createFromat(newData);
    } else if (typeof data == "string") {
      if (![...types, "edit", "now"].includes(data)) return;
      /*if (data == "now") {
      }*/
      if (!newValue) return str.dateAsObj(true, true)[data];
      if (typeof newValue != "object") newValue = [newValue].toObj([data]);
      var newData = str.dateAsObj(true);
      newValue.forEach((value, i, key)=> {
        newData[key] = value;
      });
      ret = createFromat(newData);
    }
    function createFromat(data) {
      let result = `${data.year}/${data.month}/${data.day}`;
      data.hour = (typeof data.hour != "number" ? data.hour.n(): data.hour).len(2);
      data.minute = (typeof data.minute != "number" ? data.minute.n(): data.minute).len(2);
      if (data.hour.n() > 0) result = result + ` ${data.hour}:${data.minute}`;
      if (data.AM_PM) result = result + ` ${data.AM_PM}`;
      return result;
    }
    return ret;
  }
  String.prototype.copy = function() {
    try {
      navigator.clipboard.writeText(this);
      return true;
    } catch {
      return false;
    }
  }
  String.prototype.linkType = function(type) {
    var str = this,
    words = str.split(" "),
    ret;
    if (type == "under") {
      ret = words.join("_");
    } else {
      var firstWord = words[0];
      words = words.slice(1);
      ret = words.join(" ");
      ret = ret.capitalize(true);
      ret = ret.split(" ").join("");
      ret = firstWord + ret;
    }
    return ret;
  }
  String.prototype.hexToRgba = function() {
    var hexColor = this;
    if (hexColor.startsWith("#")) {
      hexColor = hexColor.slice(1);
    }
    if ([3, 4, 6, 8].indexOf(hexColor.length) === -1) {
      throw new Error("Invalid hex color");
    }
    let r,
    g,
    b,
    a;
    if (hexColor.length === 3) {
      r = parseInt(hexColor[0] + hexColor[0], 16);
      g = parseInt(hexColor[1] + hexColor[1], 16);
      b = parseInt(hexColor[2] + hexColor[2], 16);
      a = 255;
    } else if (hexColor.length === 4) {
      r = parseInt(hexColor[0] + hexColor[0], 16);
      g = parseInt(hexColor[1] + hexColor[1], 16);
      b = parseInt(hexColor[2] + hexColor[2], 16);
      a = parseInt(hexColor[3] + hexColor[3], 16);
    } else if (hexColor.length === 6) {
      r = parseInt(hexColor.slice(0, 2), 16);
      g = parseInt(hexColor.slice(2, 4), 16);
      b = parseInt(hexColor.slice(4), 16);
      a = 255;
    } else {
      r = parseInt(hexColor.slice(0, 2), 16);
      g = parseInt(hexColor.slice(2, 4), 16);
      b = parseInt(hexColor.slice(4, 6), 16);
      a = parseInt(hexColor.slice(6), 16);
    }
    return [`rgba(${r},${g},${b}, ${a})`,
      {
        r: r,
        g: g,
        b: b,
        a: a
      }];
  }

  String.prototype.isColor = function() {
    var color = this;
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    if (ctx.fillStyle === "#000000") {
      ctx.fillStyle = "#ff0000";
      ctx.fillStyle = color;
      if (ctx.fillStyle === "#ff0000") {
        canvas.remove();
        return false;
      }
    }
    canvas.remove();
    return true;
  }

  String.prototype.toHex = function() {
    var color = this;
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    if (color.isColor() === false) return false;
    ctx.fillStyle = color;
    return ctx.fillStyle;
  }
}

let num = 2500;

function number() {
  Number.prototype.percent = function(percent, isNotPercent) {
    if (isNotPercent == true) return percent / (100 / this);
    return percent * (100 / this);
  }
  Number.prototype.s = function () {
    return `${this}`;
  }
  Number.prototype.arr = function (start = 0) {
    let num = this,
    ret = [];
    for (let i = 0; i < num; i++) ret[ret.length] = start+i;
    return ret;
  }
  Number.prototype.int = function() {
    return Number.parseInt(this);
  }
  Number.prototype.float = function() {
    return Number.parseFloat(this);
  }
  Number.prototype.len = function(len) {
    let num = this,
    ret = num.s();
    if (len == -1) return num;
    if (ret.length < len) {
      while (len > ret.length) ret = '0' + ret;
    }
    return ret;
  }
  Number.prototype.upperThan = function(than) {
    let num = this,
    two = 0;
    while (num >= than) {
      two++;
      num -= than;
    }
    return [num,
      two];
  }
  Number.prototype.equalTo = function(value1, ...array) {
    let num = this,
    ret = 0;
    array = array.a([num, value1], 0);
    array.forEach(item=> {
      if (typeof item == "object") {
        var values = item.v(),
        value = values[0],
        as = values[1];
        ret += (value * as);
      } else if (typeof item == "number") ret += item;
    });
    return ret;
  }

  Number.prototype.betweenTwo = function(end,
    count = 1) {
    var start = this;
    var range = end - start;
    var gap = range / (count + 1);
    var result = [];
    for (let i = 0; i < count; i++) {
      result[i] = start + (gap * (i+1));
    }
    return result;
  }
}

let obj = {
  name: "ibrahim",
  age: 16,
  country: "algnoob"
}

function object() {
  Object.prototype.l = function(plus = 0) {
    return Object.keys(this).length + plus;
  }

  Object.prototype.k = function(i = 'i') {
    if (isNaN(i)) return Object.keys(this);
    return Object.keys(this)[i];
  }

  Object.prototype.v = function(i = 'i') {
    if (isNaN(i)) return Object.values(this);
    return Object.values(this)[i];
  }

  /*Object.prototype.v = function(...indexes) {
    if (!indexes) return Object.values(this);
    indexes = indexes.map(index=>Object.values(this)[index]);
    return indexes.first(true);
  }*/

  Object.prototype.a = function(name, value) {
    let ret = this;
    ret[name] = value;
    return ret;
  }

  Object.prototype.r = function(name, type) {
    let ret = {};
    for (let i = 0; i < this.l(); i++) {
      let isName = this.k(i) == name,
      isValue = this.v(i) == name;
      if (isName || isValue) {
        if (type) {
          if (type == 'key' && isName || type == 'value' && isValue) continue;
          else {
            ret[this.k(i)] = this.v(i);
          }
        } else continue;
      } else {
        ret[this.k(i)] = this.v(i);
      }
    }
    return ret;
  }

  Object.prototype.c = function() {
    return {};
  }

  Object.prototype.forEach = function (fun) {
    if (typeof fun != 'function') return;
    for (let i = 0; i < this.l(); i++) fun(this.v(i), i, this.k(i));
  }

  Object.prototype.family = function(asObj, numFloor, argChain) {
    var obj = this,
    all = [],
    tree = [],
    paper = [],
    len = obj.l();
    for (var i = 0; i < len; i++) {
      var key = obj.k(i),
      value = obj.v(i),
      chain = (argChain || []).push(key),
      floor = chain.l() - 2,
      item = {
        key: key,
        value: value,
        chain: chain,
        floor: floor
      };
      all.push(item);
      if (typeof value === "object") {
        tree.push(item);
        if (numFloor != -1 && numFloor-1 == floor) continue;
        var ret = value.family(asObj, numFloor, `${chain}:`);
        all = all.concat(ret.all);
        tree = tree.concat(ret.tree);
        paper = paper.concat(ret.paper);
      } else paper.push(item);
    }

    var keysA = all.map(item=>item.key),
    valuesA = all.map(item=>item.value),
    allObj = valuesA.toObj(keysA),
    keysT = tree.map(item=>item.key),
    valuesT = tree.map(item=>item.value),
    treeObj = valuesT.toObj(keysT),
    keysP = paper.map(item=>item.key),
    valuesP = paper.map(item=>item.value),
    paperObj = valuesP.toObj(keysP);

    if (asObj == true) {
      all = allObj;
      tree = treeObj;
      paper = paperObj;
    }

    return {
      all: all,
      tree: tree,
      paper: paper
    };
  }

  Object.prototype.search = function(text, other) {
    let data = this,
    ret = [],
    type = other.type,
    inside = other.inside,
    except = other.except,
    include = other.include,
    types = ["piece",
      "arranged pieces",
      "random pieces",
      "arranged letters"],
    searchPower = ["low",
      "medium",
      "high",
      "very high"];
    text = text.s().toLowerCase().trim();

    var arrText = text.split(" "),
    indexType = searchPower.indexOf(type);
    if (indexType != -1) type = types[indexType];

    if (!types.includes(type)) type = "low";
    if (typeof inside != "number") inside = -1;
    data.forEach((value, index, key)=> {
      let family = value.family(true, inside).paper;
      for (let i = 0; i < family.l(); i++) {
        var v = family.v(i).s().toLowerCase().trim();
        if (search(v, type)) {
          ret.push(value);
          break;
        }
      }
    });
    function search(value, type) {
      let arrValue = value.split(" "),
      index = 0;
      if (type == "piece") {
        if (value.includes(text)) return true;
      } else if (type == "arranged pieces") {
        for (let i = 0; i < arrValue.l(); i++) {
          if (arrText[index] == arrValue[i]) index++;
          if (index == arrText.l() || value.includes(arrText.last())) return true;
        }
      } else if (type == "random pieces") {
        let noRepeat = [];
        arrText.forEach(word=> {
          for (let i = 0; i < arrValue.l(); i++) {
            if (!noRepeat.includes(i) && word == arrValue[i]) {
              noRepeat.push(i);
              index++;
              break;
            }
          }
        });
        if (index == arrText.l() || value.includes(arrText.last())) return true;
      } else {}
      return false;
    }
    return ret;
  }

  Object.prototype.format24 = function(to) {
    var date = this,
    type;
    if (typeof date == "string") {
      date = date.dateAsObj(true);
      type = "string";
    } else type = "object";
    if (!["string", "number"].includes(typeof to)) to = "";
    var hour = date.hour;
    var AM_PM = date.AM_PM;
    if (AM_PM && !["12", "24"].includes(to.s())) to = "24";
    if (!AM_PM && !["12", "24"].includes(to.s())) to = "12";
    if (to == "12") {
      if (hour > 12) {
        hour = hour - 12;
        AM_PM = "PM";
      } else if (hour == 0) {
        hour = 12;
        AM_PM = "AM";
      } else AM_PM = "AM";
    } else {
      if (AM_PM) {
        if (AM_PM == "PM" && hour != 12) hour = hour + 12;
        if (hour == 12 && AM_PM == "AM") hour = 0;
        AM_PM = undefined;
      }
    }

    date.hour = hour;
    date.AM_PM = AM_PM;
    if (!AM_PM) date = date.r("AM_PM");
    if (type == "string") date = "create".formatDate(date);
    return date;
  }

  Object.prototype.getByChain = function(originalChain) {
    var object = this;
    if (originalChain.length === 1) return object;
    originalChain = originalChain.slice(1);
    var ret = object;
    originalChain.forEach(chainPart=>{
      ret = ret[chainPart];
    });
    return ret;
  }

  Object.prototype.editByChain = function(originalChain, newValue, newKey) {
    var object = this;
    if (originalChain.length === 1) return newValue;
    originalChain = originalChain.slice(1);
    function edit(obj, chain) {
      if (chain.length > 1) {
        obj[chain[0]] = edit(obj[chain[0]], chain.slice(1));
      } else {
        obj = obj.r(chain[0]);
        obj[newKey || chain[0]] = newValue;
      }
      return obj;
    }
    object = edit(object, originalChain);
    return object;
  }
}

let arr = 'ibrahim,salah,hello,sayed'.split(','),
arr2 = 'name1,name2,name3,name4'.split(','),
arr3 = 'ibrahim,ibrahim,salah,ibrahim'.split(','),
arr4 = [7, 3, 8, 5, 9, 2, 7, 0, 4];

function array() {
  Array.prototype.indexs = function () {
    let ret = [];
    for (let i = 0; i < this.length; i++) ret[i] = i;
    return ret;
  }

  Array.prototype.last = function() {
    return this[this.length-1];
  }

  Array.prototype.toObj = function (keys) {
    let ret = {};
    for (let i = 0; i < this.length; i++) ret[keys?keys[i]: i] = this[i];
    return ret;
  }

  Array.prototype.indexsOf = function (item) {
    let ret = [];

    for (let i = 0; i < this.length; i++) {
      if (this[i] == item) ret[ret.length] = i;
    }
    return ret;
  }

  Array.prototype.selectItems = function (...ind) {
    let ret = [];

    for (let i = 0; i < ind.length; i++) ret[i] = this[ind[i]];
    return ret;
  }

  Array.prototype.rand = function (isOne) {
    let array = this,
    ret = [];

    for (let i = 0; i < array.length; i++) ret[i] = randomize();

    function randomize() {
      let r = Math.floor(Math.random() * array.length);

      if (ret.includes(r)) r = randomize();
      return r;
    }

    for (let i = 0; i < array.length; i++) ret[i] = array[ret[i]];

    return isOne ? ret[0]: ret;
  }

  Array.prototype.a = function (item, index) {
    let ret = [],
    len = this.length + 1;
    index = typeof index == 'number' ? index: len-1;

    if (index > this.length) return;

    for (let i = 0; i < len; i++) {
      if (i == index) {
        ret = [...ret,
          item];
        if (this[i]) ret[ret.length] = this[i];
      } else {
        if (this[i]) ret[ret.length] = this[i];
      }
    }
    return ret;
  }

  Array.prototype.r = function (index) {
    let ret = [];
    for (let i = 0; i < this.length; i++) {
      if (index == i) continue;
      ret[ret.length] = this[i];
    }
    return ret;
  }

  Array.prototype.lenObj = function (key, value) {
    let ret = 0;
    for (let i = 0; i < this.length; i++) {
      if (this[i][key] == value) ret++;
    }
    return ret;
  }

  Array.prototype.retObj = function (key, value) {
    let ret = [];
    for (let i = 0; i < this.length; i++) {
      if (this[i][key] == value) ret[ret.length] = [this[i],
        i];
    }
    return ret;
  }

  Array.prototype.retArr = function (index) {
    let ret = [];
    for (let i = 0; i < this.length; i++) ret[i] = this[i][index];
    return ret;
  }

  Array.prototype.blob = function (obj) {
    let array = this,
    type = obj.type || 'text/plain',
    link = obj.link,
    download = obj.download;
    let blob = new Blob(array, {
      type: type
    }),
    url = URL.createObjectURL(blob);

    if (typeof download == 'string') {
      try {
        link.addEventListener('click', function () {
          url.download(download);
        });
      } catch {
        url.download(download);
      }
    }
    return blob;
  }

  Array.prototype.deepSearch = function (fun, other = {}) {
    let data = this,
    types;

    if (typeof fun != 'function') return;

    if (other.types && an.isArr(other.types) && other.types.length > 0) {
      types = other.types;
    }


    function filterData() {
      let value = element.value,
      newData = [];

      isObj(data);

      function isObj(obj) {
        let keys = !an.isArr(obj) ? obj.k(): obj.map(item => ''),
        values = !an.isArr(obj) ? obj.v(): obj;
        forLoop(keys, values);
      }

      function forLoop(keys, values, isNext) {
        for (let i = 0; i < values.length; i++) {

          if (typeof values[i] == 'string') {} else if (typeof values[i] == 'number') {} else if (typeof values[i] == 'object') {
            isObj(values[i]);
          }
        }
      }
    }
  }

  Array.prototype.noRepeat = function () {
    let ret = [];
    for (let i = 0; i < this.length; i++) {
      if (ret.includes(this[i])) continue;
      ret[ret.length] = this[i];
    }
    return ret;
  }
  /* one road:  //
  1- types = all types in other.types if (isNot = false) else types = all types except other.types
  2- change key to the grandfather / father / son = key,
  3- do types contains key
    two road:  //
  1- change key to the grandfather / father / son = key,
  2- do types contains key if (isNot = false) else do not types contains key
  */

  Array.prototype.first = function(ret) {
    if (this.length === 1) return this[0];
    if (ret === true) return this;
    return false;
  }

  Array.prototype.rgbaToHex = function() {
    var rgba = this;
    let r = rgba[0].toString(16);
    let g = rgba[1].toString(16);
    let b = rgba[2].toString(16);
    let a = rgba[3].toString(16);
    if (r.length == 1) r = "0" + r;
    if (g.length == 1) g = "0" + g;
    if (b.length == 1) b = "0" + b;
    if (a.length == 1) a = "0" + a;
    return "#" + r + g + b + a;
  }

  Array.prototype.withOthers = function(count = 2, isLength) {
    var array = this;
    if (count > array.length) return false;
    if (isLength) {
      var length = array.length ** count;
      return length;
    }
    var result = [];
    array.forEach(addItem);
    function addItem(item) {
      if (item.constructor !== Array) {
        item = [item];
      }
      if (count === item.length) {
        result.push(item);
        return;
      }
      array.forEach(function(other) {
        addItem([...item, other]);
      });
    }
    return result;
    // resultLength = array.length ** count;
  }

  Array.prototype.order = function(key) {
    var array = this;
    var result = array.sort(function(a, b) {
      if (typeof a[key] === 'string' && typeof b[key] === 'string') {
        return a[key].localeCompare(b[key]);
      } else {
        return a[key] - b[key];
      }
    });
    return result;
  }
}

function element() {
  let q = e=>document.querySelectorAll(e).length < 2?document.querySelector(e): document.querySelectorAll(e),
  qA = e=>document.querySelectorAll(e),
  e = e=>document.getElementById(e);

  Element.prototype.css = function(nameProperty,
    valueProperty) {
    let element = this;

    if (typeof nameProperty != "string") return;

    if (typeof valueProperty == "string") return element.style.setProperty(nameProperty, valueProperty);
    else return window.getComputedStyle(element).getPropertyValue(nameProperty);
  }

  Element.prototype.ca = function (additive = false) {
    let element = this;
    additive = an.isArr(additive) ? additive: typeof additive == 'string' ? additive.split(' '): false;
    if (!additive) return;
    additive.forEach(add => element.classList.add(add));
  }

  Element.prototype.cd = function (deleted) {
    let element = this;
    deleted = an.isArr(deleted) ? deleted: typeof deleted == 'string' ? deleted.split(' '): false;
    if (!deleted) return;
    deleted.forEach(del => element.classList.remove(del));
  }

  Element.prototype.cr = function (deleted, additive) {
    this.ca(additive);
    this.cd(deleted);
  }

  Element.prototype.cc = function (existing, isOne) {
    if (!existing) return;
    let element = this;
    existing = an.isArr(existing) ? existing: typeof existing == 'string' ? existing.split(' '): false;
    if (!existing) return;
    let length = isOne ? 1: existing.length;
    existing.forEach(exi => {
      if (element.classList.contains(exi)) length--;
    });
    if (length < 1) return true;
    return false;
  }

  Element.prototype.ct = function (toggleing) {
    let element = this;
    toggleing = an.isArr(toggleing) ? toggleing: typeof toggleing == 'string' ? toggleing.split(' '): false;
    if (!toggleing) return;
    toggleing.forEach(tog => element.classList.toggle(tog));
  }

  Element.prototype.c = function (i) {
    if (typeof i == 'number') {
      return this.classList[i];
    } else return this.classList;
  }

  Element.prototype.menuPos = function(options, fun, selected, returns) {
    let element = this;

    if (options == '') options = ['nothing'];

    if (!an.isArr(options)) {
      returns = options.k();
      options = options.v();
    } else returns = options;

    element.innerHTML += `
    <div class="showMenuPos">${selected ? selected: options[0]}</div>
    <i class="fas fa-xmark clsOtpsMenu"></i>
    <input type="text" id="srchMenuPos" placeholder="search" />
    <div class="optsMenuPos">
    </div>`;

    element.classList.add(`menuPos${menuPosI}`);

    let optsMenuPos = q(`.menuPos${menuPosI} .optsMenuPos`);

    for (let i = 0; i < options.length; i++) optsMenuPos.innerHTML += `<div class="optMenuPos">${options[i]}</div>`;

    let contentStyle = qA('style')[0].innerHTML;

    q('head').innerHTML += '<link rel="stylesheet" href="../modules/css/all.min.css"/>';

    qA('style')[0].innerHTML = `
    .menuPos${menuPosI} {
    position: relative;
    font-size: 17px;
    color: #000;
    background: #eee;
    }
    .menuPos${menuPosI} .optsMenuPos {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 60px;
    width: fit-content;
    opacity: 0;
    background: inherit;
    color: inherit;
    font-size: inherit;
    max-height: 60vh;
    overflow: scroll;
    pointer-events: none;
    z-index: 999999999;
    transition: .4s;
    }
    .menuPos${menuPosI}.show .optsMenuPos {
    opacity: 1;
    pointer-events: auto;
    }
    .menuPos${menuPosI} #srchMenuPos {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    height: 100%;
    width: 100%;
    pointer-events: none;
    outline: none;
    padding: 4px;
    background: inherit;
    border: none;
    font-size: inherit;
    color: inherit;
    border-bottom: 2px solid #57E0FF;
    transition: .4s opacity;
    color: inherit;
    }
    .menuPos${menuPosI} .clsOtpsMenu {
    position: absolute;
    left: calc(100% + 2.5px);
    top: 50%;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: #fff;
    transform: translateY(-50%);
    color: #f00;
    font-size: 16px;
    opacity: 0;
    pointer-events: none;
    z-index: 999999999;
    transition: .4s opacity;
    }
    .menuPos${menuPosI} .clsOtpsMenu:hover {
    background: #ddd;
    }
    .menuPos${menuPosI}.show #srchMenuPos,
    .menuPos${menuPosI}.show .clsOtpsMenu {
    opacity: 1;
    pointer-events: auto;
    }
    .menuPos${menuPosI} .showMenuPos,
    .menuPos${menuPosI} .optMenuPos {
    padding: 4px;
    background: inherit;
    text-align: center;
    display: block;
    border: 2px solid transparent;
    font-size: inherit;
    color: inherit;
    transition: .4s opacity;
    }
    .menuPos${menuPosI} .optMenuPos:hover,
    .menuPos${menuPosI} .showMenuPos {
    border-color: #57E0FF;
    }
    .menuPos${menuPosI}.show .showMenuPos {
    opacity: 0;
    pointer-events: none;
    }
    .menuPos${menuPosI} .optMenuPos.none {
    display: none;
    }
    ${contentStyle}`;

    element.style.width = `${optsMenuPos.offsetWidth}px`;
    optsMenuPos.style.width = `${optsMenuPos.offsetWidth}px`;

    let show = q(`.menuPos${menuPosI} .showMenuPos`),
    srchMenuPos = q(`.menuPos${menuPosI} #srchMenuPos`);

    show.addEventListener('click', function() {
      element.classList.add('show');
    });

    q(`.menuPos${menuPosI} .clsOtpsMenu`).addEventListener('click', function() {
      element.classList.remove('show');
      srchMenuPos.value = '';
      search();
    });

    srchMenuPos.on('input', search);

    function search() {
      for (let i = 0; i < optsMenuPos.children.length; i++) {
        let reg = new RegExp(`${srchMenuPos.value}`, 'ig');

        if (reg.test(optsMenuPos.children[i].innerText)) optsMenuPos.children[i].classList.remove('none');
        else optsMenuPos.children[i].classList.add('none');
      }
    }

    qA(`.menuPos${menuPosI} .optMenuPos`).forEach(e=>e.addEventListener('click', function() {
      element.classList.remove('show');

      show.innerText = e.innerText;

      srchMenuPos.value = '';

      qA(`.menuPos${menuPosI} .optMenuPos`).forEach(e=>e.classList.remove('none'));

      let ind = 0;
      for (let i = 0; i < optsMenuPos.children.l(); i++) {
        if (optsMenuPos.children[i].innerText == e.innerText) {
          ind = i;
          break;
        }
      }

      try {
        fun(returns[ind]);
      } catch {}
    }));

    menuPosI++;
  }

  Element.prototype.dimensional = function(selectedParent) {
    let element = this;
    if (element.parentElement == undefined) return;
    let translateX = 0,
    translateY = 0;
    if (window.getComputedStyle(element).transform != 'none') {
      translateX = Number.parseInt(window.getComputedStyle(element).transform.split(',')[4]);
      translateY = Number.parseInt(window.getComputedStyle(element).transform.split(',')[5]);
    }

    selectedParent = selectedParent || document.body;

    let Y_X = [element.offsetLeft + translateX,
      0,
      element.offsetTop + translateY,
      0],
    parentElement = element.parentElement;

    for (let i = 0; i < 1;) {
      if (parentElement == selectedParent || !parentElement.parentElement) break;
      if (window.getComputedStyle(parentElement).transform != 'none') {
        translateX = Number.parseInt(window.getComputedStyle(parentElement).transform.split(',')[4]);
        translateY = Number.parseInt(window.getComputedStyle(parentElement).transform.split(',')[5]);
      }
      Y_X[0] += parentElement.offsetLeft + translateX;
      Y_X[2] += parentElement.offsetTop + translateY;
      parentElement = parentElement.parentElement;
    }

    Y_X[1] = Y_X[0] + element.offsetWidth;
    Y_X[3] = Y_X[2] + element.offsetHeight;
    return Y_X;
  }

  Element.prototype.numberParents = function() {
    let element = this,
    numParents = 0,
    parentElement = element.parentElement;
    for (let i = 0; i < 1;) {
      if (parentElement == document.querySelector('body')) break;
      numParents++;
      parentElement = parentElement.parentElement;
    }
    return numParents;
  }

  Element.prototype.hover = function(classList = 'hover', fun2) {
    let element = this;

    try {
      element.forEach(e=>e);
    } catch {
      element = [element];
    }

    element.forEach(e=>e.addEventListener('touchstart', function () {
      if (typeof classList == 'string') element.classList.add(classList);
      else classList();
    }));

    element.forEach(e=>e.addEventListener('touchend',
      function () {
        if (typeof classList == 'string') element.classList.remove(classList);
        else fun2();
      }));

    element.forEach(e=>e.addEventListener('mouseover',
      function () {
        if (typeof classList == 'string') element.classList.add(classList);
        else classList();
      }));

    element.forEach(e=>e.addEventListener('mouseout',
      function () {
        if (typeof classList == 'string') element.classList.remove(classList);
        else fun2();
      }));

    element.forEach(e=>e.addEventListener('mouseup',
      function () {
        if (typeof classList == 'string') element.classList.remove(classList);
        else fun2();
      }));
  }

  Element.prototype.parentX_Y = function(touches) {
    let selectedTarget = this;
    if (!selectedTarget) selectedTarget = touches.changedTouches[0].target || touches.toElement;
    let x = (touches.changedTouches[0].pageX || touches.pageX) - dimensional(selectedTarget)[0],
    y = (touches.changedTouches[0].pageY || touches.pageY) - dimensional(selectedTarget)[2];
    return [x,
      y];
  }

  Element.prototype.selectChild = function (fun, onclick) {
    let element = this;
    if (!element.children) return;

    let children = element.children.v();

    children.forEach(child => {
      if (onclick) child.onclick = click;
      else child.addEventListener('click', click);
      function click() {
        if (typeof fun == 'function') fun(child.innerText, child, act);
        else act();

        function act() {
          children.forEach(child => child.classList.remove('act'));
          child.classList.add('act');
        }
      }
    });
  }

  Element.prototype.translatePage = function (other = {}) {
    let element = this,
    homeLang = other.homeLang || navigator.language.split('-')[0],
    file = other.file,
    fun = other.fun,
    items = other.items;

    function translate(selectLang) {
      if (typeof fun == 'function') fun(selectLang);
      an.translate(selectLang);
    }
    translate(homeLang);

    if (items) element.menuPos(items, translate, items[selectLang]);
    else {
      if (element.tagName == 'SELECT') {
        element.onchange = function () {
          translate(this.value);
        }
      } else {
        element.selectChild(function (text, child) {
          translate(child.dataset.value || text);
        });
      }
    }
  }

  Element.prototype.onlongclick = function (fun, other = {}) {
    let element = this,
    setTime,
    time = other.time || 300,
    onEnd = other.onEnd || false,
    notScroll = other.notScroll || false,
    onclick = other.onclick || false;

    function start(e) {
      setTime = setTimeout(function () {
        try {
          fun(element, {
            e: e,
            changedTouches: e.changedTouches[0],
            target: e.changedTouches[0].target
          });
        } catch {
          element.classList.add('longclick');
        }
      }, time);
    }

    if (onclick) {
      element.onmousedown = start;
      element.ontouchstart = start;
      element.onmouseup = end;
      element.ontouchend = end;
    } else {
      element.on('mousedown', start);
      element.on('touchstart', start);
      element.on('mouseup', end);
      element.on('touchend', end);
    }

    if (notScroll == true) window.addEventListener('scroll', noScroll);
    else if (typeof notScroll == "object" && notScroll.classList != undefined) notMove(notScroll);
    else if (notScroll.length != undefined) {
      notScroll.v().forEach(element=>notMove(element));
    }

    function notMove(e) {
      e.move({
        fun: function(obj) {
          if (!obj.isStart && !obj.isEnd) noScroll();
        }
      });
    }

    function noScroll() {
      clearTimeout(setTime);
    }

    function end(e) {
      clearTimeout(setTime);
      if (typeof onEnd == 'function') onEnd(element);
    }
  }

  Element.prototype.allChildren = function(includeSelf = false) {
    let children = Array.from(this.children);
    children.forEach(child => {
        children.push(...child.allChildren());
    });
    return includeSelf ? [this, ...children] : children;
  };

  Element.prototype.lockEvents = function (type = 'lock', notLock) {
    if (!['lock', 'unlock'].includes(type)) return;
    let element = this,
    elements = [element];

    if (!notLock) notLock = {};

    if (notLock.v) elements = [...elements,
      ...notLock.v()];

    let elementsLock = elements['map'](e=>e.allChildren(true)),
    allElements = body.allChildren(true),
    withOther = [];

    elementsLock.forEach(e=> {
      e.forEach(e2=>withOther[withOther.length] = e2);
    });

    elementsLock = withOther;
    withOther = null;

    allElements.forEach(e=> {
      if (!elementsLock.includes(e)) e[type == 'lock' ? 'ca': 'cd']('noEvents');
    });
  }

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

  Element.prototype.searchBox = function (fun,
    other = {}) {
    this.parentElement.classList.add('parentSearch');
    this.classList.add('searchBox');

    this.innerHTML = `
    <input type="text"/>
    <div class="parentIcons">
    <i class="fas fa-search"></i>
    <i class="fas fa-xmark"></i>
    </div>`;

    let search = this,
    inputSearch = q('.searchBox input'),
    contentStyle = qA('style')[qA('style').length-1].v(),
    time = other.time || 300,
    notOffclick = typeof other.notOffclick != 'boolean' ? true: other.notOffclick,
    closeByFun = typeof other.closeByFun != 'boolean' ? true: other.closeByFun,
    closeFun = closeByFun ? fun: other.closeFun || false;

    [...qA('.parentSearch .searchBox i'),
      q(".parentSearch .searchBox input")].forEach(i=>i.css("transition", `${time}ms`))

    q('.searchBox .parentIcons').addEventListener('click',
      function () {
        search.classList.toggle('show');
        if (!search.classList.contains('show')) {
          if (typeof closeFun == 'function') {
            closeFun(new RegExp(`${inputSearch.value}`, 'ig'), '', inputSearch.value);
          }
          inputSearch.value = '';
        } else {
          if (!notOffclick) {
            search.offclick(function() {
              search.classList.remove('show');
              inputSearch.value = '';
              if (typeof closeFun == 'function') {
                closeFun(new RegExp(`${inputSearch.value}`, 'ig'), inputSearch.value);
              }
            });
          }
        }
      });

    inputSearch.addEventListener('transitionend',
      function (e) {
        if (e.propertyName == 'width') {
          if (search.classList.contains('show')) this.focus();
        }
      });

    if (typeof fun == 'function') {
      inputSearch.addEventListener('input',
        function () {
          try {
            fun(new RegExp(`${this.value}`, 'ig'), this.value);
          } catch {}
        });
    }
  }

  /*
  1- HTMLCollection
  2- NodeList
  */

  Element.prototype.noScroll = function () {
    for (let i = 0; i < 3; i++) {
      setTimeout(_=> {
        let fontSize = Number.parseInt(window.getComputedStyle(this)['font-size']) - ((this.scrollWidth - this.offsetWidth) / ((this.scrollWidth - this.offsetWidth) / 105));

        if (fontSize < 0) fontSize = 2;

        if (this.scrollWidth > this.offsetWidth) {
          this.style.fontSize = `${fontSize}px`;
        }
      },
        2);
    }
  }

  Element.prototype.tripleDot = function(countLines, options = {}) {
    let element = this,
        width = element.offsetWidth,
        fontSize = window.getComputedStyle(element).getPropertyValue('font-size'),
        padding = [
            window.getComputedStyle(element).getPropertyValue('padding-top'),
            window.getComputedStyle(element).getPropertyValue('padding-right'),
            window.getComputedStyle(element).getPropertyValue('padding-bottom'),
            window.getComputedStyle(element).getPropertyValue('padding-left')
        ],
        text = element.textContent.trim();

    // إعداد الخيارات الافتراضية
    const {
        notBreak = false,
        notShow = false,
        style = '',
        classes = [],
        callback = null,
        notOffclick = false
    } = options;

    // استخدام canvas لحساب عرض النص
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = `${fontSize} ${window.getComputedStyle(element).getPropertyValue('font-family')}`;

    let lines = [],
        start = 0,
        end = 1,
        lineHeight = parseFloat(fontSize);

    // حساب عرض النص باستخدام canvas
    for (let i = 0; i < text.length; i++) {
        const slice = text.slice(start, end);
        const sliceWidth = context.measureText(slice).width;

        if (sliceWidth > width) {
            lines.push(text.slice(start, end - 1));
            start = end - 1;
        }

        end++;
    }

    lines.push(text.slice(start));

    if (lines.slice(0, countLines).join('') === text) return;

    function truncateText() {
        const visibleLines = lines.slice(0, countLines).join('').slice(0, -3);
        element.innerHTML = `${visibleLines}<mark style="${style}" class="${classes.join(' ')}">...</mark>`;
        if (!notBreak) element.style.wordBreak = 'break-all';
        if (callback) callback(false);
    }

    truncateText();

    if (!notShow) {
        element.addEventListener('click', function expandText() {
            element.innerText = text;
            element.style.wordBreak = '';
            if (!notOffclick) element.offclick(truncateText, true);
            if (callback) callback(true);
        });
    }

    return lines.length;
  };

  Element.prototype.getChild = function(obj = {}) {
    let element = this,
    ret = [],
    Class = an.isArr(obj.class) ? obj.class: typeof obj.class == 'string' ? obj.class.split(' '): [],
    id = typeof obj.id == 'string' ? obj.id: '',
    tag = typeof obj.tag == 'string' ? obj.tag: '',
    isOne = obj.isOne || false,
    children = (obj.isAll ? element.allChildren(): element.children).v(),
    length = Class.length + (id != '' ? 1: 0) + (tag != '' ? 1: 0),
    len;

    if (length == 0) return;

    children.forEach(child => {
      len = isOne ? 1: length;
      Class.forEach(c => {
        if (child.cc(c)) len--;
      });
      if (id != '' && child.id == id) len--;
      if (tag != '' && child.tagName.toLowerCase() == tag) len--;
      if (len < 1) ret[ret.length] = child;
    });
    return ret;
  }

  Element.prototype.getByClass = function (Class,
    isAll,
    isOne) {
    return this.getChild({
      class: Class,
      isAll: isAll,
      isOne: isOne
    });
  }

  Element.prototype.p = function (numberParents = 0) {
    if (typeof numberParents != 'number') return;
    let element = this,
    parentElement = element.parentElement;
    for (let i = 0; i < numberParents; i++) parentElement = parentElement.parentElement;
    return parentElement;
  }

  Element.prototype.d = function (names, values) {
    let element = this,
    ret = [];
    names = an.isArr(names) ? names: typeof names == 'string' ? [names]: [],
    values = an.isArr(values) ? values: typeof values == 'string' ? [values]: [];
    if (names == []) return;
    names.forEach((name, i) => {
      if (values[i]) element.dataset[name] = values[i];
      else ret[ret.length] = element.dataset[name];
    });
    return ret.length == 1 ? ret[0]: ret;
  }

  Element.prototype.isScroll = function (dir) {
    if (!"xy".split('').includes(dir)) dir = 'y';
    if (dir == 'y') {
      if (this.scrollHeight > this.offsetHeight) return true;
      return false;
    } else {
      if (this.scrollWidth > this.offsetWidth) return true;
      return false;
    }
  }

  Element.prototype.v = function (text, type = "innerHTML") {
    let element = this;

    if (["string", "number"].includes(typeof text)) {
      text = text.s();
      let value = text.startsWith("+") ? element.v() + text.slice(1): text.startsWith("-") ? text.slice(1) + element.v(): text;
      if (element.value != undefined) element.value = value;
      else element[type] = value;
    } else {
      if (element.value != undefined) return element.value;
      else return element[type];
    }
  }

  Element.prototype.on = function (nameEvent, fun, on = false) {
    if (!on) this.addEventListener(nameEvent, fun);
    else this[`on${nameEvent}`] = fun;
  }

  Element.prototype.scroll = function (fun, dir) {
    let body = document.body,
    element = this || body;
    if (element.parentElement == undefined && element != window) return;
    if (element == body) {
      element.on('scroll', scrolling, true);
    } else {
      element.on('scroll', scrolling);
    }

    function scrolling() {
      let currentScroll = element.scrollTop != undefined ? element.scrollTop: element.scrollY,
      allScroll = element.scrollHeight || body.scrollHeight,
      size = element.clientHeight || body.clientHeight;
      if (dir == 'h') {
        currentScroll = element.scrollLeft != undefined ? element.scrollLeft: element.scrollX;
        allScroll = element.scrollWidth || body.scrollWidth;
        size = element.clientWidth || body.clientWidth;
      }


      let percent = (allScroll - size).percent(currentScroll);
      if (typeof fun == 'function') fun(percent, currentScroll);
    }
  }

  Element.prototype.q = function (e) {
    return this.querySelectorAll(e).length < 2 ? this.querySelector(e): this.querySelectorAll(e);
  }

  Element.prototype.qA = function (e) {
    return this.querySelectorAll(e);
  }

  Element.prototype.move = function (obj = {}) {
    var element = this;
    if (typeof obj == 'function') {
      obj = {
        fun: obj
      }
    } else if (obj == false || obj == undefined) {
      element.removeEventListener('touchstart', touchstart);
      element.removeEventListener('touchmove', touchmove);
      element.removeEventListener('touchend', touchend);
      return;
    }

    let fun = obj.fun,
    place = obj.place || {},
    notPlace = obj.notPlace || false,
    d,
    xS,
    yS,
    x,
    y,
    agree,
    ret;

    if (place.p != undefined) {
      d = place.dimensional();
    } else if (an.isArr(place) && place.length == 4) {
      d = place;
    } else {
      d = element.dimensional();
    }

    element.on('touchstart', touchstart);
    element.on('touchmove', touchmove);
    element.on('touchend', touchend);

    function touchstart(event) {
      xS = event.changedTouches[0].pageX;
      yS = event.changedTouches[0].pageY;
      if (xS > d[0] && xS < d[1] && yS > d[2] && yS < d[3]) {
        if (notPlace == true) agree = false;
        else agree = true;
      } else {
        if (notPlace == true) agree = true;
        else agree = false;
      }
      c(agree);
      if (agree) {
        retFun(event, 'start');
      }
    }

    function touchmove(event) {
      if (agree) {
        x = event.changedTouches[0].pageX;
        y = event.changedTouches[0].pageY;
        retFun(event);
      }
    }

    function touchend(event) {
      if (agree) {
        x = event.changedTouches[0].pageX;
        y = event.changedTouches[0].pageY;
        retFun(event, 'end');
      }
    }

    function retFun(event, type = 'move') {
      let valueMoveW = x - xS,
      percentMoveW = (d[1] - d[0]).percent(valueMoveW),
      valueW = x - d[0],
      percentW = (d[1] - d[0]).percent(valueW),
      valueMoveH = y - yS,
      percentMoveH = (d[3] - d[2]).percent(valueMoveH),
      valueH = y - d[2],
      percentH = (d[3] - d[2]).percent(valueH);

      ret = {
        event: event,
        valueMoveW: valueMoveW,
        percentMoveW: percentMoveW,
        valueW: valueW,
        percentW: percentW,
        valueMoveH: valueMoveH,
        percentMoveH: percentMoveH,
        valueH: valueH,
        percentH: percentH,
        isStart: type == 'start'?true: false,
        isEnd: type == 'end'?true: false
      };

      if (typeof fun == 'function') fun(ret);
    }
  }

  Element.prototype.getCss = function (property) {
    return window.getComputedStyle(this).getPropertyValue(property);
  }

  Element.prototype.for = function (content, obj = {}) {
    let element = this,
    count = obj.count,
    tag = obj.tag || 'div',
    Class = obj.class,
    id = obj.id,
    d = obj.d;
    if (content.join !== undefined && count === undefined) count = content.length;
    if (count === undefined) count = 1;
    for (let i = 0; i < count; i++) {
      var child = document.createElement(tag);
      child.ca(Class);
      if (typeof id == "string") child.id = id;
      child.v(typeof content == "string" ? content: content[i]);
      element.appendChild(child);
    }
  }

  Element.prototype.smooth = function(obj = {}) {
    let element = this;
    if (typeof obj == 'number') obj = {
      transition: 400,
      padding: obj,
      persent: obj/20
    };

    let transition = obj.transition,
    padding = obj.padding,
    persent = obj.persent,
    scrollLeft = 0,
    scrollTop = 0,
    paddingStart = `${element.css('padding-top')} ${element.css('padding-right')} ${element.css('padding-bottom')} ${element.css('padding-left')}`.split(' ').map(item=>item.n());

    if (typeof transition != 'number') transition = 400;
    if (typeof padding != 'number') padding = 60;
    if (typeof persent != 'number') persent = 3;

    element.css('overflow', 'scroll');
    element.move({
      fun: smooth
    });

    function smooth(event) {
      let x = element.scrollLeft.int(),
      y = element.scrollTop.int(),
      restWidth = (element.scrollWidth - element.offsetWidth).int(),
      restHeight = (element.scrollHeight - element.offsetHeight).int();

      if (event.isStart) {
        element.css('transition', '');
        return;
      }

      if (event.isEnd) {
        element.css('transition', element.css('transition') + `, padding ${transition}ms`);
        element.css('padding', paddingStart.map(item=>item + 'px').join(' '));
        return;
      }

      function addPadding(direction) {
        let padStart = paddingStart[direction == 'top' ? 0: direction == 'right' ? 1: direction == 'bottom' ? 2: 3],
        pad = element.css(`padding-${direction}`).n(true);
        if (pad < (padStart + padding)) {
          element.css(`padding-${direction}`, `${pad+persent}px`);
        }
      }

      if (restWidth > 0) {
        if (x == 0) addPadding('left');
        else if (x == restWidth) addPadding('right');
      }

      if (restHeight > 0) {
        if (y == 0) addPadding('top');
        else if (y == restHeight) addPadding('bottom');
      }

    }
  }

  Element.prototype.chain = function() {
    let element = this,
    parent = element.parentElement,
    ret = {};
    while (true) {
      var keys = ret.k(),
      key = parent.tagName.toLowerCase(),
      value = parent,
      i = 1;
      function notExist() {
        if (keys.includes(key)) key = key + `_${i}`;
        if (keys.includes(key)) {
          i++;
          key = key.slice(0, key.l()-2);
          notExist();
        }
      }
      notExist();
      ret[key] = value;
      if (parent == body) break;
      parent = parent.parentElement;
    }
    return ret;
  }

  Element.prototype.holder = function(text) {
    var element = this,
    style = `<style>
    .parentPlaceholder.showPlaceholder::before {
    content: attr(data-placeholder);
    position: absolute;
    top: 0;
    left: 0;
    color: gray;
    padding: inherit;
    margin: inherit;
    font-size: inherit;
    pointer-events: none;
    }</style>`;
    q("head").insertAdjacentHTML("afterbegin", style);
    if (element.css("position") == "static") element.css("position", "relative");
    element.ca("parentPlaceholder");
    element.dataset.placeholder = text.s();
    function checkEmpty() {
      var value = element.v().trim();
      if (value == "") element.ca("showPlaceholder");
      else element.cd("showPlaceholder");
    }
    checkEmpty();
    element.on("input", checkEmpty);
  }

  Element.prototype.slider = function(margin) {
    var element = this,
    firstDiv = element.qA("&>div")[0];
    if (typeof margin != "number") margin = 0;
    element.ca("slider");
    element.css("--mr-slider", `${margin}px`);

    let isDragStart = false,
    isDragging = false,
    prevPageX,
    prevScrollLeft,
    positionDiff;

    const autoSlide = () => {
      if (element.scrollLeft - (element.scrollWidth - element.clientWidth) > -1 || element.scrollLeft <= 0) return;

      positionDiff = Math.abs(positionDiff);
      let firstImgWidth = firstDiv.clientWidth + margin;
      let valDifference = firstImgWidth - positionDiff;

      if (element.scrollLeft > prevScrollLeft) {
        return element.scrollLeft += positionDiff > firstImgWidth / 3 ? valDifference: -positionDiff;
      }
      element.scrollLeft -= positionDiff > firstImgWidth / 3 ? valDifference: -positionDiff;
    }
    const dragStart = (e) => {
      isDragStart = true;
      prevPageX = e.pageX || e.touches[0].pageX;
      prevScrollLeft = element.scrollLeft;
    }
    const dragging = (e) => {
      if (!isDragStart) return;
      e.preventDefault();
      isDragging = true;
      element.ca("dragging");
      positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
      element.scrollLeft = prevScrollLeft - positionDiff;
    }
    const dragStop = () => {
      isDragStart = false;
      element.cd("dragging");
      if (!isDragging) return;
      isDragging = false;
      autoSlide();
    }

    element.on("mousedown", dragStart);
    element.on("touchstart", dragStart);

    document.addEventListener("mousemove", dragging);
    element.on("touchmove", dragging);

    document.addEventListener("mouseup", dragStop);
    element.on("touchend", dragStop);
  }

  Element.prototype.check = function(fun) {
    var checkbox = this;
    checkbox.ca("checkbox");
    checkbox.v(`-<i class="check fas fa-check shdIconH"></i>`);
    if (checkbox.css("--check") === "") checkbox.css("--check", "#0085f7");
    checkbox.on("click", function(e) {
      var newValue = !eval(checkbox.d("check"));
      checkbox.dataset.check = newValue;
      if (typeof fun === "function") fun(newValue);
    });
  }

  Element.prototype.videoPlayer = function(videos,
    control = {}) {
    var element = this,
    html = `
    <video></video>
    <div class="volume">
    <i class="icon fas fa-music"></i>
    </div>
    <div class="timeline">
    <div class="preview">
    <img/>
    </div>
    </div>
    <div class="control">
    <i class="previous fas fa-moon shdIconH changeVideo"></i>
    <div class="play shdIconH">
    <i class="fas fa-play"></i>
    <i class="fas fa-pause"></i>
    </div>
    <i class="next fas fa-sun shdIconH changeVideo"></i>
    </div>
    <div class="loader"></div>
    `;
    element.v(html);
    // elements
    var video = element.q("video");
    var volume = q(".volume");
    var timeline = q(".timeline");
    var control = q(".control");
    var play = q(".play");
    var changeVideo = qA(".changeVideo");
    var loader = q(".loader");
    // Variables
    var widthElement = element.offsetWidth;
    var index = 0;
    var posters = [];
    var srcs = [];

    video.volume = .65;
    function main(data) {
      element.cd("loaded");
      loader.css("animation",
        "loader 1s linear infinite");
      play.dataset.type = "pause";
      var src = data.src;
      video.src = src;
      //srcs.push(src);
      video.on("loadeddata",
        loadeddata);
      async function loadeddata() {
        var duration = video.duration;
        var rect = timeline.getBoundingClientRect();
        var poster = data.poster || await getVideoPoster(video);
        video.poster = poster;
        //posters.push(poster);
        element.ca("loaded");
        function timeControl() {
          element.cd("controls");
        }
        an.newSetTime(timeControl,
          "controls");
        setTimeout(function() {
          loader.css("animation", "none");
        },
          300);
        function getVideoPoster(videoElement) {
          return new Promise((resolve, reject) => {
            if (videoElement instanceof HTMLVideoElement) {
              const poster = videoElement.poster;
              if (poster) {
                resolve(poster);
              } else {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                canvas.remove();
                resolve(canvas.toDataURL());
              }
            } else {
              reject(new Error("Not an HTMLVideoElement"));
            }
          });
        }
        play.on("click",
          function() {
            togglePlay(video);
          });
        video.on("pause",
          function() {
            play.dataset.type = "pause";
          });
        video.on("play",
          function() {
            play.dataset.type = "play";
          });
        element.on("click",
          function(e) {
            if (!control.allChildren(true).v().includes(e.target) && !timeline.allChildren(true).v().includes(e.target)) {
              element.ct("controls");
            };
            an.newSetTime(timeControl, "controls", 2500);
          });
        video.on("timeupdate",
          timeupdate);
        function timeupdate() {
          var current = video.currentTime;
          var result = duration.percent(current);
          updateLine(result);
        }
        timeline.move({
          fun: function(data) {
            if (!data.isEnd) {
              var percent = data.percentMoveW;
              var result = duration.percent(percent);
              video.currentTime = result;
              updateLine(percent);
            }
          }
        });
        function updateLine(value) {
          timeline.css("--line",
            `${value}%`);
          var left = widthElement.percent(value,
            true);
          if (left > 55 && left < (widthElement - 55)) {
            timeline.css("--preview", `${value}%`);
          }
        }
      }
      var videoVolume = video.volume * 100;
      element.move({
        fun: function(data) {
          if (!data.isStart && !data.isEnd) {
            var value = (data.valueMoveH * -1) / 3;
            if (value > 10 || value < -10 || volume.cc("show")) {
              value = value + videoVolume;
              volume.ca("show");
              an.newSetTime(function() {
                volume.cd("show");
              }, "volume", 2500);
              setVideoVolume(video, value, volume);
            }
          } else if (data.isEnd) {
            videoVolume = video.volume * 100;
          }
        }
      });
      let playbackRate = 1;
      element.onlongclick(function() {
        video.playbackRate = 2;
      },
        {
          onEnd: function() {
            video.playbackRate = playbackRate;
          }
        });
      element.on("dblclick",
        function(e) {
          var rect = element.getBoundingClientRect();
          var x = e.offsetX;
          if (x < (rect.width/2)) {
            video.currentTime = video.currentTime - 5;
          } else {
            video.currentTime = video.currentTime + 5;
          }
        });
      /*createThumbnails(video,
        function(images) {
          images.forEach(function(image, i) {
            var html = `+
            <div>
            <img src="${image}"/>
            </div>`;
            slider.v(html);
          });
          slider.slider(2);
        });*/
    }
    main(videos[index]);

    changeVideo.forEach(item=>item.onclick = function() {
      var type = item.c(0);
      if (type == "previous" && index !== 0) index--;
      else if (type == "next" && index !== videos.length-1) index++;
      main(videos[index]);
    });

    function createThumbnails(video, callback, size = [200,
      150],
      interval = 1000) {
      /*var newVideo = document.createElement("video");
      body.appendChild(newVideo);
      newVideo.src = video.src;*/
      video.on('loadeddata',
        loadeddata);
      function loadeddata() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        var width = size[0];
        var height = size[1];
        //canvas.width = width;
        //canvas.height = height;

        const fps = 1; // frames per second
        const interval = 1000 / fps;

        let currentTime = 0;
        let images = [];

        video.currentTime = currentTime;
        video.on("seeked",
          seeked);
        function seeked() {
          context.drawImage(video,
            0,
            0,
            canvas.width,
            canvas.height);
          const imageData = canvas.toDataURL('image/png');
          images.push(imageData);

          currentTime += interval / 1000;

          if (currentTime <= video.duration) {
            video.currentTime = currentTime;
          } else {
            callback(images);
            canvas.remove();
            //newVideo.remove();
          }
        }
      }
    }

    /*var video = document.getElementById('video');
    video.src = 'video.mp4';
    var showThumbnails = function(thumbnails) {
      var range = document.getElementById('range');
      var image = document.getElementById('image');
      range.max = thumbnails.length - 1;
      range.min = 0;
      range.value = 0;
      image.src = thumbnails[0];
      range.addEventListener('input', function() {
        var value = range.value;
        var thumbnail = thumbnails[value];
        image.src = thumbnail;
      });
    };
    createThumbnails(video, showThumbnails);*/





    /*var videoElement;
    var isLink;
    function createThumbnails(video, callback, size = [200, 150], interval = 1000) {
      if (typeof video === 'string') {
        videoElement = document.createElement('video');
        videoElement.style.display = 'none';
        document.body.appendChild(videoElement);
        videoElement.src = video;
        isLink = true;
      } else {
        videoElement = video;
        isLink = false;
      }
      // the rest
      if (isLink) {
        document.body.removeChild(videoElement);
      }
    }*/

    /*var text = "Some text";
    var url = "http://localhost:5000/api/splitText";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: text
      })
    })
    .then(response => response.json())
    .then(data => {
      var chars = data.result;
      console.log(chars);
    })
    .catch(error => {
      console.error(error);
    });*/

    function getVideoTime(video) {
      function secondsToArray(seconds) {
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds % 3600) / 60);
        var seconds = Math.floor(seconds % 60);
        var milliseconds = Math.round((seconds % 1) * 1000);
        return [hours,
          minutes,
          seconds,
          milliseconds];
      }
      var duration = video.duration;
      var currentTime = video.currentTime;
      var durationArray = secondsToArray(duration);
      var currentTimeArray = secondsToArray(currentTime);
      return {
        total: durationArray,
        current: currentTimeArray
      };
    }

    function togglePlay(video, play) {
      if (play === true) video.play();
      else if (play === false) video.pause();
      else {
        if (video.paused === true) video.play();
        else video.pause();
      }
      return video.paused;
    }

    function setVideoVolume(video, volume, level) {
      var value = volume / 100;
      if (value > 1) value = 1;
      else if (value < 0) value = 0;
      if (level.p !== undefined) {
        level.css("--level", `${value*100}%`);
      }
      video.volume = value;
    }

    function setVideoSpeed(video, speed) {
      if (speed < 0.25 || speed > 4) {
        return;
      }
      video.playbackRate = speed;
    }

    function toggleFullScreen(element, fullScreen) {
      function isFullScreenSupported() {
        return document.fullscreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.msFullscreenEnabled;
      }
      if (isFullScreenSupported()) {
        if (fullScreen) {
          if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        }
      }
    }

    function togglePIP(element, pip) {
      if ('pictureInPictureEnabled' in document) {
        if (pip) {
          element.requestPictureInPicture();
        } else {
          document.exitPictureInPicture();
        }
      }
    }
  }

  Element.prototype.rect = function() {
    return this.getBoundingClientRect().toJSON();
  }
}



export {
  all,
  moreOne,
  string,
  number,
  object,
  array,
  element
}

/*
let data = [{},{}]; // example data

1-- arguments = (data, function(){
}, {
  submit: q('.categorys'), // element
  types: ['name'], // array contains objects
  isNot: false // true or false
});


2-- search about the data which is equal value input

3-- if data = object or array , enter to inside of the array or object

4-- Return the object that is equal to the input value
*/