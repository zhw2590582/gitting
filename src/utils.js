// 查询url参数
export const getURLParameters = () => {
  var url = window.location.href;
  return (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(function(a, v) {
    return (a[v.slice(0, v.indexOf("="))] = v.slice(v.indexOf("=") + 1)), a;
  }, {});
}

// 从参数生成url
export const queryStringify = query => {
  const queryString = Object.keys(query)
    .map(key => `${key}=${encodeURIComponent(query[key] || '')}`)
    .join('&')
  return queryString
}

// 保存storage
export const setStorage = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val));
}

// 获取storage
export const getStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
}

// 删除storage
export const delStorage = (key) => {
  localStorage.removeItem(key)
}

// 选择元素
export const query = (doc = document, selector) => {
  return doc.querySelector(selector);
}

// 删除dom元素
export const removeElement = selector => {
  const el = document.querySelector(selector);
  el && el.parentNode && el.parentNode.removeChild(el);
}

// 创建loading
export const loading = selector => {
  const el = selector instanceof Element ? selector : document.querySelector(selector);
  const loadingEl = document.createElement('div');
  loadingEl.classList.add('gt-loading');
  loadingEl.innerHTML = `
    <div class="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  `;
  el.appendChild(loadingEl);
  return () => el.removeChild(loadingEl);
}

// 请求
export const request = (method, url, body, header) => {
  method = method.toUpperCase();
  body = body && JSON.stringify(body);
  let headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  if (header) {
    headers = Object.assign({}, headers, header);
  }

  const token = getStorage('gitting-token')
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
    } else {
      return res.json();
    }
  });
}