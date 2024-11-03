let q = e=>document.querySelectorAll(e).length < 2?document.querySelector(e): document.querySelectorAll(e),
qA = e=>document.querySelectorAll(e),
e = e=>document.getElementById(e),
c = (...e)=>e.length > 1 ? console.log(e.join(' | ')): console.log(e[0]),
html = q("html"),
body = q("body");

function isArr(array) {
  if (itsClass(array) === Array) {
    return true;
  } else {
    return false;
  }
}

function isOneElement(element) {
  if (element instanceof Elementt) {
    return true;
  } else {
    return false;
  }
}

function itsClass(element) {
  return element.constructor;
}

function hexToRgba(hexColor) {
  // إزالة الحرف # إذا كان موجودا
  if (hexColor.startsWith("#")) {
    hexColor = hexColor.slice(1);
  }
  // التحقق من صحة طول اللون السادس عشر
  if ([3, 4, 6, 8].indexOf(hexColor.length) === -1) {
    throw new Error("Invalid hex color");
  }
  // تحويل اللون السادس عشر إلى قيم عشرية
  let r,
  g,
  b,
  a;
  if (hexColor.length === 3) {
    // مثل fff
    r = parseInt(hexColor[0] + hexColor[0], 16);
    g = parseInt(hexColor[1] + hexColor[1], 16);
    b = parseInt(hexColor[2] + hexColor[2], 16);
    a = 255;
  } else if (hexColor.length === 4) {
    // مثل ffff
    r = parseInt(hexColor[0] + hexColor[0], 16);
    g = parseInt(hexColor[1] + hexColor[1], 16);
    b = parseInt(hexColor[2] + hexColor[2], 16);
    a = parseInt(hexColor[3] + hexColor[3], 16);
  } else if (hexColor.length === 6) {
    // مثل ffffff
    r = parseInt(hexColor.slice(0, 2), 16);
    g = parseInt(hexColor.slice(2, 4), 16);
    b = parseInt(hexColor.slice(4), 16);
    a = 255;
  } else {
    // مثل ffffffff
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

function toArNums(num, to) {
  var str = num.s().split(""),
  arNums = "٠١٢٣٤٥٦٧٨٩".split(""),
  enNums = "0123456789".split(""),
  result = "";
  str.forEach(item=> {
    let indexAr = arNums.indexOf(item),
    indexEn = enNums.indexOf(item);
    if (indexAr != -1 && to != "ar") result += enNums[indexAr];
    else if (indexEn != -1 && to != "en") result += arNums[indexEn];
    else result += item;
  });
  return result;
}

let setTimes = {};

function newSetTime(fun, id, time) {
  if (typeof fun != "function" || typeof id != "string") return;
  clearTimeout(setTimes[id]);
  if (typeof time === "number") setTimes[id] = setTimeout(fun, time);
}

let themes = {};

async function changeTheme(selected) {
  let data;
  if (!themes.k().includes(selected)) {
    var res = await fetch(`json/themes/${selected}.json`);
    data = await res.json();
    themes = themes.a(selected, data);
  } else {
    data = themes[selected];
  }
  var variables = data.variables || {};
  var classes = data.classes || {};
  var datasets = data.datasets || {};
  variables.forEach((value, i, key)=> {
    key = "--" + key;
    html.css(key, value);
  });
  classes.forEach((value, i, key)=> {
    if (value.join !== undefined) {
      value = value.toObj(["add", "remove"]);
    }
    qA(key).forEach(e=> {
      if (value.add !== "") e.ca(value.add);
      if (value.remove !== "") e.cd(value.remove);
    });
  });
  datasets.forEach((value,
    i,
    key)=> {
    qA(key).forEach(e=> {
      value.forEach((value, i, key)=> {
        e.dataset[key] = value;
      });
    });
  });
  html.dataset.theme = selected;
}

let languages = {},
selectLang;
async function translate(lang, file) {
  if (lang) selectLang = lang;
  if (!languages.k().includes(selectLang)) {
    file = file || "json/languages";
    file = `${file}/${selectLang}.json`;
    var res = await fetch(file);
    var json = await res.json();
    languages[selectLang] = json;
  }
  var dataLang = languages[selectLang];
  if (dataLang) {
    translateItems(dataLang);
  }
}

function translateItems(dataLang) {
  for (let i = 0; i < dataLang.l(); i++) {
    var element = q(`[data-lang=${dataLang.k(i)}]`);
    if (!element) continue;
    if (typeof dataLang.v(i) == 'object' && !an.isArr(dataLang.v(i))) {
      element.innerHTML = `${dataLang.v(i)[element.dataset.typelang]}`;
    } else {
      c(dataLang.v(i));
      element.innerHTML = `${dataLang.v(i)}`;
    }
  }
}

export {
  isArr,
  isOneElement,
  itsClass,
  hexToRgba,
  newSetTime,
  toArNums,
  changeTheme,
  translate
}