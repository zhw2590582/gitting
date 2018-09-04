import "./index.scss";
import "./primer-markdown.css";
import i18n from "./i18n";
import * as api from "./api";
import * as utils from "./utils";
import { version } from "../package.json";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
dayjs.extend(relativeTime);

class Gitting {
  constructor(option) {
    this.option = Object.assign({}, Gitting.DEFAULTS, option);
    this.page = 1;
    this.issue = {};
    this.token = utils.getStorage("gitting-token");
    this.userInfo = utils.getStorage("gitting-userInfo");
    this.isLogin = !!this.token && !!this.userInfo;
    this.i = i18n(this.option.language);
    dayjs.locale(this.option.language);
    this.creatInit = this.creatInit.bind(this);
    this.logout = this.logout.bind(this);
  }

  // 默认配置
  static get DEFAULTS() {
    return {
      clientID: "",
      clientSecret: "",
      repo: "",
      owner: "",
      admin: [],
      id: location.href,
      number: -1,
      labels: ["Gitting"],
      title: document.title,
      body: "",
      language: "zh-cn",
      perPage: 10,
      maxlength: 500,
      avatar: "https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png",
      proxy: "https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token"
    };
  }

  // 挂载
  async render(el) {
    this.$container = el instanceof Element ? el : utils.query(document, el);

    // 初始化开始
    const loadend = utils.loading(el);

    // 检查是否需要登录
    const { code } = utils.getURLParameters();
    if (code) {
      await this.getUserInfo(code);
    }

    const query = {
      client_id: this.option.clientID,
      client_secret: this.option.clientSecret,
      t: new Date().getTime()
    };

    // 获取 issue
    if (this.option.number > 0) {
      this.issue = await api.getIssueById(this.option.owner, this.option.repo, this.option.number, utils.queryStringify(query));
      this.errorHandle(!this.issue || !this.issue.number, `Failed to get issue by id [${this.option.number}] , please check the configuration!`);
    } else {
      const labels = (this.option.labels.push(location.href), this.option.labels.join(","));
      const labelsQuery = Object.assign({}, query, { labels });
      this.issue = (await api.getIssueByLabel(this.option.owner, this.option.repo, utils.queryStringify(labelsQuery)))[0];
      this.errorHandle(!this.issue || !this.issue.number, `Failed to get issue by labels [${labels}] , Do you want to initialize an new issue?`, this.creatInit);
    }

    // 初始化结束
    loadend();

    // 创建结构
    this.creatGitting();
    this.creatComment();

    console.log(this);
  }

  // 获取并保存用户信息
  async getUserInfo(code) {
    // 移除code参数
    const parameters = utils.getURLParameters();
    delete parameters.code;
    const newUrl = location.href.split("?")[0] + (Object.keys(parameters) > 0 ? "?" : "") + utils.queryStringify(parameters);
    history.replaceState(null, "", newUrl);

    const query = {
      client_id: this.option.clientID,
      client_secret: this.option.clientSecret,
      code: code,
      redirect_uri: location.href
    };

    // 获取token
    const data = await api.getToken(`${this.option.proxy}?${utils.queryStringify(query)}`);
    this.errorHandle(!data.access_token, "Can not get token, Please login again!", this.logout);
    utils.setStorage("gitting-token", data.access_token);
    this.token = data.access_token;

    // 获取用户信息
    const userInfo = await api.getUserInfo(data.access_token);
    this.errorHandle(!userInfo.id, "Can not get user info, Please login again!", this.logout);
    utils.setStorage("gitting-userInfo", userInfo);
    this.userInfo = userInfo;

    // 修改登录状态
    this.isLogin = true;

    return userInfo;
  }

  // 登出
  logout() {
    this.page = 1;
    this.issue = {};
    this.isLogin = false;
    utils.delStorage("gitting-token");
    utils.delStorage("gitting-userInfo");
    this.creatInit();
  }

  // 初始化评论
  creatInit() {
    const query = {
      state: "Gitting",
      client_id: this.option.clientID,
      redirect_uri: location.href,
      scope: "public_repo"
    };
    this.$container.insertAdjacentHTML("beforeend",
      `
        <div class="gt-init">
            <a
              class="gt-init-btn"
              href="http://github.com/login/oauth/authorize?client_id=${utils.queryStringify(query)}"
            >
              ${this.i("init")}
            </a>
        </div>
      `
    );
  }

  // 读取评论
  creatGitting() {
    const query = {
      state: "Gitting",
      client_id: this.option.clientID,
      redirect_uri: location.href,
      scope: "public_repo"
    };

    this.$container.innerHTML = ``;
    this.$container.insertAdjacentHTML("beforeend",
      `
      <div class="gt-header clearfix">
        <a href="${this.issue.html_url}" class="gt-counts fl" target="_blank">
          ${this.issue.comments} ${this.i("counts")}
        </a>
        <div class="gt-mate fr clearfix">
          ${
            this.isLogin
              ? `<a href="#" class="gt-logout fl">${this.i("logout")}</a>`
              : `<a href="http://github.com/login/oauth/authorize?client_id=${utils.queryStringify(query)}" class="gt-login fl">${this.i("login")}</a>`
          }
          <a href="https://github.com/zhw2590582/gitting" class="fl" target="_blank">Gitting ${version}</a>
        </div>
      </div>
      <div class="gt-body">
        <div class="gt-avatar">
          <img src="${this.isLogin ? this.userInfo.avatar_url : this.option.avatar}" alt="avatar">
        </div>
        <div class="gt-editor">
            <div class="gt-markdown markdown-body"></div>
            <textarea placeholder="${this.i("leave")}" class="gt-textarea" maxlength="${this.option.maxlength}"></textarea>
            <div class="gt-tip clearfix">
                <a class="fl" href="https://guides.github.com/features/mastering-markdown/" target="_blank">${this.i("styling")}</a>
                <div class="fr">
                  <span class="counts">0</span> / ${this.option.maxlength}
                </div>
            </div>
            <div class="gt-tool clearfix">
                <div class="gt-switch fl clearfix">
                    <span class="gt-write gt-btn fl active">${this.i("write")}</span>
                    <span class="gt-preview gt-btn fl">${this.i("preview")}</span>
                </div>
                <button class="gt-send fr">${this.i("submit")}</button>
            </div>
          </div>
      </div>
      <div class="gt-comments"></div>
      <div class="gt-comments-load">
          <a class="gt-load-state gt-load-more" href="#">${this.i("loadMore")}</a>
          <div class="gt-load-state gt-load-end">${this.i("loadEnd")}</div>
      </div>
    `
    );

    this.$logout = utils.query(this.$container, '.gt-logout');
    this.$markdown = utils.query(this.$container, '.gt-markdown');
    this.$textarea = utils.query(this.$container, '.gt-textarea');
    this.$counts = utils.query(this.$container, '.counts');
    this.$write = utils.query(this.$container, '.gt-write');
    this.$preview = utils.query(this.$container, '.gt-preview');
    this.$send = utils.query(this.$container, '.gt-send');
    this.$comments = utils.query(this.$container, '.gt-comments');
    this.$load = utils.query(this.$container, '.gt-comments-load');
  }

  async creatComment() {
    const query = {
      client_id: this.option.clientID,
      client_secret: this.option.clientSecret,
      per_page: this.option.perPage,
      page: this.page
    };

    const comments = await api.getComments(this.option.owner, this.option.repo, this.issue.number, utils.queryStringify(query));
    console.log(comments)
    this.page += 1;
    const commentHtml = comments.map(item => {
      return `
      <div class="comments-item">
        <div class="gt-avatar">
          <img src="${item.user.avatar_url}" alt="avatar">
        </div>
        <div class="gt-comment-content caret">
          <div class="gt-comment-body markdown-body">
            ${item.body_html}
          </div>
          <div class="gt-comment-mate clearfix">
            <a class="gt-comment-name fl" href="${item.user.html_url}" target="_blank">${item.user.login}</a>
            <span class="gt-comment-time fl" data-time="${item.created_at}">${this.i("published")} ${dayjs(item.created_at).fromNow()}</span>
            <a class="gt-comment-reply fr" href="#" target="_blank">${this.i("reply")}</a>
          </div>
        </div>
      </div>
    `
    }).join('');

    this.$comments.insertAdjacentHTML("beforeend", commentHtml);
  }

  // 错误处理
  errorHandle(condition, err, callback) {
    if (!condition) return;
    utils.removeElement(".gt-error");
    utils.removeElement(".gt-loading");
    this.$container.insertAdjacentHTML("afterbegin", `<div class="gt-error">${err}</div>`);
    callback && callback();
    throw new TypeError(err);
  }
}

window.Gitting = Gitting;
export default Gitting;
