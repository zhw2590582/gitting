const storageName = 'gitting_settings';

function getStorage(key) {
  const storage = JSON.parse(localStorage.getItem(storageName)) || {};
  return key ? storage[key] : {};
}

function setStorage(key, value) {
  localStorage.setItem(storageName, JSON.stringify(Object.assign({}, getStorage(), {
    [key]: value,
  })));
}
