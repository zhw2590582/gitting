import { queryStringify, cleanStorage, getStorage } from './utils';

function creatRequest(controller) {
  return function request(method, url, body, header) {
    method = method.toUpperCase();
    body = body && JSON.stringify(body);
    let headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };

    if (header) {
      headers = Object.assign({}, headers, header);
    }

    const token = getStorage('token');
    if (token) {
      headers.Authorization = `token ${token}`;
    }

    return fetch(url, {
      method,
      headers,
      body,
      signal: controller.signal
    }).then(res => {
      if (res.status === 404) {
        return Promise.reject('Unauthorized.');
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
    }).catch(err => {
      console.warn(err, url);
    });
  };
}

export default function creatApi(option) {
  const controller = new AbortController();
  const request = creatRequest(controller);
  const issuesApi = `https://api.github.com/repos/${option.owner}/${
    option.repo
  }/issues`;

  const baseQuery = {
    client_id: option.clientID,
    client_secret: option.clientSecret
  };

  return {
    // 获取token
    getToken(code) {
      const query = Object.assign({}, baseQuery, {
        code: code,
        redirect_uri: location.href
      });
      return request('get', `${option.proxy}?${queryStringify(query)}`);
    },

    // 获取用户信息
    getUserInfo(token) {
      return request(
        'get',
        `https://api.github.com/user?access_token=${token}`
      );
    },

    // 通过标签获取issue
    getIssueByLabel(labels) {
      const query = Object.assign({}, baseQuery, {
        labels: labels,
        t: Date.now()
      });
      return request('get', `${issuesApi}?${queryStringify(query)}`);
    },

    // 通过id获取issues
    getIssueById(id) {
      const query = Object.assign({}, baseQuery, {
        t: Date.now()
      });
      return request('get', `${issuesApi}/${id}?${queryStringify(query)}`);
    },

    // 获取某条issues下的评论
    getComments(id, page) {
      const query = Object.assign({}, baseQuery, {
        per_page: option.perPage,
        page: page,
        t: Date.now()
      });
      return request(
        'get',
        `${issuesApi}/${id}/comments?${queryStringify(query)}`,
        null,
        {
          Accept: 'application/vnd.github.v3.full+json'
        }
      );
    },

    // 创建一条issues
    creatIssues(issue) {
      const query = Object.assign({}, baseQuery, issue, {
        t: Date.now()
      });
      return request('post', issuesApi, query);
    },

    // 创建一条评论
    creatComments(id, body) {
      const query = Object.assign({}, baseQuery, {
        body,
        t: Date.now()
      });
      return request('post', `${issuesApi}/${id}/comments`, query, {
        Accept: 'application/vnd.github.v3.full+json'
      });
    },

    // 解析markdown
    mdToHtml(text) {
      const query = Object.assign({}, baseQuery, {
        text,
        t: Date.now()
      });
      return request('post', `https://api.github.com/markdown`, query, {
        Accept: 'text/html'
      });
    },

    // 销毁
    abort() {
      controller && controller.abort && controller.abort();
    }
  };
}
