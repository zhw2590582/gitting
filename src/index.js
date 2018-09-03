import "./index.scss";
import "./primer-markdown.css";
import i18n from "./i18n";
import * as api from "./api";
import * as utils from "./utils";

class Gitting {
  constructor(option) {
    this.option = Object.assign({}, Gitting.DEFAULTS, option);
    this.i = i18n(this.option.language);
  }

  static get DEFAULTS() {
    return {
      clientID: '',
      clientSecret: '',
      repo: '',
      owner: '',
      admin: [],
      id: location.href,
      number: -1,
      labels: ['Gitting'],
      title: document.title,
      body: '',
      language: 'zh-CN',
      perPage: 10,
      proxy: 'https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token'
    };
  }

  render(el) {
    this.container = el instanceof Element ? el : document.querySelector(el);
    // this.getUserInfo(utils.getQueryString('code'))
  }

  async getUserInfo(code, callback) {
    const query = {
      client_id: this.option.clientID,
      client_secret: this.option.clientSecret,
      code: code,
      redirect_uri: location.href
    }
    const data = await api.getToken(`${this.option.proxy}?${utils.queryStringify(query)}`);
    this.errorHandle(!data.access_token, 'Can not get token, Please login again!', this.logout);
    utils.setStorage('gitting-token', data.access_token);
    const userInfo = await api.getUserInfo(data.access_token);
    this.errorHandle(!userInfo.id, 'Can not get user info, Please login again!', this.logout);
    utils.setStorage('gitting-userInfo', userInfo);
    callback && callback();
  }

  logout() {
    utils.delStorage('gitting-token');
    utils.delStorage('gitting-userInfo');
  }

  creatInit() {
    const query = {
      state: "Gitting",
      client_id: this.option.clientID,
      redirect_uri: location.href,
      scope: "public_repo"
    }
    this.container.insertAdjacentHTML('beforeend', `
      <div class="gt-init">
          <a
            class="gt-init-btn"
            href="http://github.com/login/oauth/authorize?client_id=${utils.queryStringify(query)}"
          >
            ${this.i('init')}
          </a>
      </div>
    `)
  }

  creatGitting() {

  }

  errorHandle(condition, err, callback) {
    if (!condition) return;
    this.container.insertAdjacentHTML('afterbegin', `<div class="gt-error">${err}</div>`);
    callback && callback();
    throw new TypeError(err);
  }

}

window.Gitting = Gitting;
export default Gitting;
