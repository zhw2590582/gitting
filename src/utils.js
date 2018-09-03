// 请求
export const request = (method, url, body) => {
  method = method.toUpperCase();
  body = body && JSON.stringify(body);
  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json"
  };
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

// 查询url参数
export const getQueryString = name => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};

// 从参数生成url
export const queryStringify = query => {
  const queryString = Object.keys(query)
    .map(key => `${key}=${encodeURIComponent(query[key] || '')}`)
    .join('&')
  return queryString
}

export const errorHandle = (condition, err, callback) => {
  if (!condition) return;
  this.container.insertAdjacentHTML('afterbegin', `<div class="gt-error">${err}</div>`);
  callback && callback();
  throw new TypeError(err);
}