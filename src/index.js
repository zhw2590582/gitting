import "./index.scss";
import "./primer-markdown.css";
import i18n from "./i18n";
import * as api from "./api";
import * as utils from "./utils";

class Gitting {
  constructor(option) {
    this.option = Object.assign({}, Gitting.DEFAULTS, option);
    this.isLogin = false;
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
    this.container = el instanceof Element ? el : utils.query(el);
    this.creatGitting()
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
    this.isLogin = false;
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
    this.container.insertAdjacentHTML('beforeend', `
      <div class="gt-header clearfix">
          <a href="#" class="gt-counts fl">900 条评论</a>
          <div class="gt-mate fr clearfix">
              <a href="#" class="fl">注销</a>
              <a href="#" class="fl" target="_blank">Gitting 1.0.0</a>
          </div>
      </div>
      <div class="gt-body">
        <div class="gt-avatar">
            <img src="https://avatars0.githubusercontent.com/u/5907357?s=88&v=4" alt="avatar">
        </div>
        <div class="gt-editor gt-mode-load">
            <div class="gt-textarea-preview markdown-body">Leave a comment</div>
            <textarea placeholder="Leave a comment" class="gt-textarea" maxlength="300"></textarea>
            <div class="gt-tip clearfix">
                <a class="fl" href="https://guides.github.com/features/mastering-markdown/" target="_blank">Styling
                    with Markdown is supported</a>
                <span class="fr">123 / 300</span>
            </div>
            <div class="gt-tool clearfix">
                <div class="gt-switch fl clearfix">
                    <span class="gt-write gt-btn fl active">Write</span>
                    <span class="gt-preview gt-btn fl">Preview</span>
                </div>
                <button class="gt-send fr">Submit</button>
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
            <img src="https://avatars0.githubusercontent.com/u/5907357?s=88&v=4" alt="avatar">
          </div>
          <div class="gt-comment-content caret">
            <div class="gt-comment-body markdown-body">
              markdown-body
            </div>
            <div class="gt-comment-mate clearfix">
              <a class="gt-comment-name fl" href="#" target="_blank">Harvey Zhao</a>
              <span class="gt-comment-time fl">发表于3 天前</span>
              <a class="gt-comment-reply fr" href="#" target="_blank">Reply</a>
            </div>
          </div>
        </div>
      </div>
      <div class="gt-comments-load">
          <a class="gt-load-state gt-load-more" href="#">加载更多</a>
          <div class="gt-load-state gt-load-ing">
              <div class="lds-ellipsis">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
              </div>
          </div>
          <div class="gt-load-state gt-load-end">加载完毕</div>
      </div>
    `);
  }

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
