const storageName = "gitting_settings";

export function getStorage(key) {
  const storage = JSON.parse(window.localStorage.getItem(storageName)) || {};
  return key ? storage[key] : storage;
}

export function setStorage(key, value) {
  const storage = Object.assign({}, getStorage(), {
    [key]: value
  });
  return window.localStorage.setItem(storageName, JSON.stringify(storage));
}

export function cleanStorage() {
  return window.localStorage.removeItem(storageName);
}

export function queryStringify(query) {
  const queryString = Object.keys(query)
    .map(key => `${key}=${window.encodeURIComponent(query[key] || "")}`)
    .join("&");
  return queryString;
}

export function getURLParameters() {
  var url = window.location.href;
  return (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(function(a, v) {
    return (a[v.slice(0, v.indexOf("="))] = v.slice(v.indexOf("=") + 1)), a;
  }, {});
}

export function smoothScroll(element, offset = 0) {
  window.scroll({
    behavior: "smooth",
    left: 0,
    top: element.getBoundingClientRect().top + window.scrollY + offset
  });
  return element;
}
