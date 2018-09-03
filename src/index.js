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
    this.creatInit();
  }

  getCode() {
    return utils.getQueryString('code');
  }

  async getUserInfo(code, callback) {
    const query = {
      client_id: this.option.clientID,
      client_secret: this.option.clientSecret,
      code: code,
      redirect_uri: location.href
    }
    const data = await api.getToken(`${this.option.proxy}?${utils.queryStringify(query)}`);
    utils.errorHandle(!data.access_token, 'Can not get token, Please login again!', this.logout);
    const userInfo = await api.getUserInfo(data.access_token);
    utils.errorHandle(!userInfo.id, 'Can not get user info, Please login again!', this.logout);
  }

  logout() {
    //
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
            href="http://github.com/login/oauth/authorize?client_id=${utils.queryStringify(query)}">
            ${this.i('init')}
          </a>
      </div>
    `)
  }

  creatGitting() {

  }

}

window.Gitting = Gitting;
export default Gitting;
