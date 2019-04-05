const storageName = 'gitting_settings';

export function getStorage(key) {
  const storage = JSON.parse(localStorage.getItem(storageName)) || {};
  return key ? storage[key] : storage;
}

export function setStorage(key, value) {
  const storage = Object.assign({}, getStorage(), {
    [key]: value,
  });
  return localStorage.setItem(storageName, JSON.stringify(storage));
}

export function cleanStorage() {
  return localStorage.removeItem(storageName);
}

export function queryStringify(query) {
  const queryString = Object.keys(query)
    .map(key => `${key}=${encodeURIComponent(query[key] || '')}`)
    .join('&')
  return queryString
}

export function getURLParameters() {
  var url = window.location.href;
  return (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(function (a, v) {
    return (a[v.slice(0, v.indexOf("="))] = v.slice(v.indexOf("=") + 1)), a;
  }, {});
}

export function request(method, url, body, header) {
  method = method.toUpperCase();
  body = body && JSON.stringify(body);
  let headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  if (header) {
    headers = Object.assign({}, headers, header);
  }

  const token = getStorage('token')
  if (token) {
    headers.Authorization = `token ${token}`;
  }

  return fetch(url, {
    method,
    headers,
    body
  }).then(res => {
    if (res.status === 404) {
      return Promise.reject("Unauthorized.");
    } else if (res.status === 401) {
      cleanStorage();
      window.location.reload();
    } else {
      if (headers.Accept === 'text/html') {
        return res.text();
      } else {
        return res.json();
      }
    }
  });
}
