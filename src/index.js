import "./index.scss";
import "./primer-markdown.css";
import i18n from "./i18n";
import * as api from "./api";
import * as utils from "./utils";
import { version } from "../package.json";

class Gitting {
  constructor(option) {
    this.option = Object.assign({}, Gitting.DEFAULTS, option);
    this.issue = {};
    this.comments = [];
    this.token = utils.getStorage('gitting-token');
    this.userInfo = utils.getStorage('gitting-userInfo');
    this.isLogin = !!this.token && !!this.userInfo;
    this.i = i18n(this.option.language);
    this.creatInit = this.creatInit.bind(this);
    this.logout = this.logout.bind(this);
  }

  // 默认配置
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
      maxlength: 500,
      avatar: "https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png",
      proxy: 'https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token'
    };
  }

  // 挂载
  async render(el) {
    this.container = el instanceof Element ? el : utils.query(el);
    const loadend = utils.loading(el);

    // 检查是否需要登录
    const { code } = utils.getURLParameters();
    if (code) {
      await this.getUserInfo(code);
    }

    // 获取 issue
    const query = {
      client_id: this.option.clientID,
      client_secret: this.option.clientSecret,
      t: new Date().getTime()
    }

    if (this.option.number > 0) {
      this.issue = await api.getIssueById(this.option.owner, this.option.repo, this.option.number, utils.queryStringify(query));
      this.errorHandle(!this.issue || !this.issue.number, `Failed to get issue by id [${this.option.number}] , please check the configuration!`);
    } else {
      const labels = (this.option.labels.push(location.href), this.option.labels.join(','));
      const labelsQuery = Object.assign({}, query, { labels });
      this.issue = (await api.getIssueByLabel(this.option.owner, this.option.repo, utils.queryStringify(labelsQuery)))[0];
      this.errorHandle(!this.issue || !this.issue.number, `Failed to get issue by labels [${labels}] , Do you want to initialize an new issue?`, this.creatInit);
    }

    // 获取 comments
    this.comments = await api.getComments(this.option.owner, this.option.repo, this.issue.number, utils.queryStringify(query));

    loadend();

    // 创建结构
    this.creatGitting();

    console.log(this);
  }

  // 获取并保存用户信息
  async getUserInfo(code) {

    // 移除code参数
    const parameters = utils.getURLParameters();
    delete parameters.code;
    const newUrl = location.href.split('?')[0] + (Object.keys(parameters) > 0 ? '?' : '') + utils.queryStringify(parameters);
    history.replaceState(null, '', newUrl);

    const query = {
      client_id: this.option.clientID,
      client_secret: this.option.clientSecret,
      code: code,
      redirect_uri: location.href
    }

    // 获取token
    const data = await api.getToken(`${this.option.proxy}?${utils.queryStringify(query)}`);
    this.errorHandle(!data.access_token, 'Can not get token, Please login again!', this.logout);

    // 获取用户信息
    const userInfo = await api.getUserInfo(data.access_token);
    this.errorHandle(!userInfo.id, 'Can not get user info, Please login again!', this.logout);

    // 保存登录信息
    this.isLogin = true;
    utils.setStorage('gitting-token', data.access_token);
    utils.setStorage('gitting-userInfo', userInfo);

    return userInfo;
  }

  // 登出
  logout() {
    this.isLogin = false;
    utils.delStorage('gitting-token');
    utils.delStorage('gitting-userInfo');
  }

  // 初始化评论
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

  // 读取评论
  creatGitting() {
    this.container.insertAdjacentHTML('beforeend', `
      <div class="gt-header clearfix">
        <a href="#" class="gt-counts fl">
          <span class="counts">${this.issue.comments}</span> ${this.i('counts')}
        </a>
        <div class="gt-mate fr clearfix">
          ${this.isLogin ? `<a href="#" class="logout fl">${this.i('logout')}</a>` : `<a href="#" class="login fl">${this.i('login')}</a>`}
          <a href="https://github.com/zhw2590582/gitting" class="fl" target="_blank">Gitting ${version}</a>
        </div>
      </div>
      <div class="gt-body">
        <div class="gt-avatar">
          <img src="${this.isLogin ? this.userInfo.avatar_url : this.option.avatar}" alt="avatar">
        </div>
        <div class="gt-editor">
            <div class="gt-textarea-preview markdown-body"></div>
            <textarea placeholder="${this.i('leave')}" class="gt-textarea" maxlength="${this.option.maxlength}"></textarea>
            <div class="gt-tip clearfix">
                <a class="fl" href="https://guides.github.com/features/mastering-markdown/" target="_blank">${this.i('styling')}</a>
                <span class="fr"><span class="counts">0</span> / ${this.option.maxlength}</span>
            </div>
            <div class="gt-tool clearfix">
                <div class="gt-switch fl clearfix">
                    <span class="gt-write gt-btn fl active">${this.i('write')}</span>
                    <span class="gt-preview gt-btn fl">${this.i('preview')}</span>
                </div>
                <button class="gt-send fr">${this.i('submit')}</button>
            </div>
            <div class="gt-ajax-load">
                <div class="lds-ellipsis">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
          </div>
      </div>
      <div class="gt-comments">
        <div class="comments-item">
          <div class="gt-avatar">
            <img src="${this.option.avatar}" alt="avatar">
          </div>
          <div class="gt-comment-content caret">
            <div class="gt-comment-body markdown-body">
              markdown-body
            </div>
            <div class="gt-comment-mate clearfix">
              <a class="gt-comment-name fl" href="#" target="_blank">Harvey Zhao</a>
              <span class="gt-comment-time fl">${this.i('published')} 3 天前</span>
              <a class="gt-comment-reply fr" href="#" target="_blank">${this.i('reply')}</a>
            </div>
          </div>
        </div>
      </div>
      <div class="gt-comments-load">
          <a class="gt-load-state gt-load-more" href="#">${this.i('loadMore')}</a>
          <div class="gt-load-state gt-load-ing">
              <div class="lds-ellipsis">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
              </div>
          </div>
          <div class="gt-load-state gt-load-end">${this.i('loadEnd')}</div>
      </div>
    `);
  }

  // 错误处理
  errorHandle(condition, err, callback) {
    if (!condition) return;
    utils.removeElement('.gt-error');
    this.container.insertAdjacentHTML('afterbegin', `<div class="gt-error">${err}</div>`);
    callback && callback();
    throw new TypeError(err);
  }

}

window.Gitting = Gitting;
export default Gitting;
