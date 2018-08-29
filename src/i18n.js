import get from "get-value";
import objToString from "obj-to-string";

const i18n = {
  zh: {
    name: "中文"
  },
  en: {
    name: "English"
  }
};

export default function(lang) {
  const langObj = i18n[lang] || i18n["zh"];
  return function(key) {
    const val = get(langObj, key, {
      default: `unmatch: ${key}`
    });
    return objToString(val);
  };
}
