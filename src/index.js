import "./index.scss";
import "./primer-markdown.css";
import i18n from "./i18n";
import creatApi from "./creatApi";
import * as utils from "./utils";
import { version } from "../package.json";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
dayjs.extend(relativeTime);

class Gitting {
  constructor(option) {
    this.option = Object.assign({}, Gitting.DEFAULTS, option);
    this.api = creatApi(this.option);
    this.page = 1;
    this.issue = {};
    this.token = utils.getStorage("gitting-token");
    this.userInfo = utils.getStorage("gitting-userInfo");
    this.isLogin = !!this.token && !!this.userInfo;
    this.i = i18n(this.option.language);
    this.creatInit = this.creatInit.bind(this);
    this.logout = this.logout.bind(this);
    dayjs.locale(this.option.language);
  }

  // 默认配置
  static get DEFAULTS() {
    return {
      clientID: "",
      clientSecret: "",
      repo: "",
      owner: "",
      admin: [],
      id: location.pathname,
      number: -1,
      labels: ["Gitting"],
      title: document.title,
      body: `${document.title}\n${location.href}`,
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
    this.$container.innerHTML = '';

    // 初始化开始
    const loadend = utils.loading(el);

    // 检查是否需要登录
    const { code } = utils.getURLParameters();
    if (code) {
      await this.getUserInfo(code);
    }

    // 获取 issue
    if (this.option.number > 0) {
      this.issue = await this.api.getIssueById(this.option.number);
      this.errorHandle(!this.issue || !this.issue.number, `Failed to get issue by id [${this.option.number}] , Do you want to initialize an new issue?`, this.creatInit);
    } else {
      const labelsArr = this.option.labels.slice();
      labelsArr.push(this.option.id);
      const labels = labelsArr.join(",");
      this.issue = (await this.api.getIssueByLabel(labels))[0];
      this.errorHandle(!this.issue || !this.issue.number, `Failed to get issue by labels [${labels}] , Do you want to initialize an new issue?`, this.creatInit);
    }

    // 创建结构
    await this.creatGitting();
    await this.creatComment();
    await this.eventBind();

    // 初始化结束
    loadend();

    console.log(this);
  }

  // 获取并保存用户信息
  async getUserInfo(code) {
    // 移除code参数
    const parameters = utils.getURLParameters();
    delete parameters.code;
    const newUrl = location.href.split("?")[0] + (Object.keys(parameters) > 0 ? "?" : "") + utils.queryStringify(parameters);
    history.replaceState(null, "", newUrl);

    // 获取token
    const data = await this.api.getToken(code);
    this.errorHandle(!data.access_token, "Can not get token, Please login again!", this.logout);
    utils.setStorage("gitting-token", data.access_token);
    this.token = data.access_token;

    // 获取用户信息
    const userInfo = await this.api.getUserInfo(data.access_token);
    this.errorHandle(!userInfo.id, "Can not get user info, Please login again!", this.logout);
    utils.setStorage("gitting-userInfo", userInfo);
    this.userInfo = userInfo;

    // 修改登录状态
    this.isLogin = true;

    return userInfo;
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
                ${
                  this.isLogin
                    ? `<button class="gt-send fr">${this.i("submit")}</button>`
                    : `<a class="gt-send fr" href="http://github.com/login/oauth/authorize?client_id=${utils.queryStringify(query)}">${this.i("login")}</a>`
                }
            </div>
          </div>
      </div>
      <div class="gt-comments"></div>
      <div class="gt-comments-load">
          <a class="gt-load-more" href="#">${this.i("loadMore")}</a>
          <div class="gt-load-end">${this.i("loadEnd")}</div>
      </div>
    `
    );

    this.$logout = utils.query(this.$container, '.gt-logout');
    this.$editor = utils.query(this.$container, '.gt-editor');
    this.$markdown = utils.query(this.$container, '.gt-markdown');
    this.$textarea = utils.query(this.$container, '.gt-textarea');
    this.$counts = utils.query(this.$container, '.counts');
    this.$write = utils.query(this.$container, '.gt-write');
    this.$preview = utils.query(this.$container, '.gt-preview');
    this.$send = utils.query(this.$container, '.gt-send');
    this.$comments = utils.query(this.$container, '.gt-comments');
    this.$commentsLoad = utils.query(this.$container, '.gt-comments-load');
  }

  async creatComment() {
    const comments = await this.api.getComments(this.issue.number, this.page++);
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
    this.$commentsLoad.classList[comments.length < this.option.perPage ? 'add' : 'remove']('end');
    return comments;
  }

  // 绑定事件
  eventBind() {
    this.$container.addEventListener('click', e => {
      const target = e.target;
      
      // 注销
      if (target.classList.contains('gt-logout')) {
        e.preventDefault();
        this.logout();
      }

      // 编写
      if (target.classList.contains('gt-write')) {
        this.$editor.classList.remove('gt-mode-preview');
      }

      // 预览
      if (target.classList.contains('gt-preview')) {
        this.$editor.classList.add('gt-mode-preview');
      }

      // 发送
      if (target.classList.contains('gt-send')) {
        console.log('gt-send')
      }

      // 回复
      if (target.classList.contains('gt-comment-reply')) {
        e.preventDefault();
        console.log('gt-comment-reply')
      }

      // 加载
      if (target.classList.contains('gt-load-more')) {
        e.preventDefault();
        console.log('gt-load-more')
      }

    });
  }

  // 登出
  logout() {
    this.page = 1;
    this.isLogin = false;
    utils.delStorage("gitting-token");
    utils.delStorage("gitting-userInfo");
    this.render(this.$container);
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
