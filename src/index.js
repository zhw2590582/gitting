import "./style.scss";
import { h, render } from "preact";
import Container from "./components";
import creatApi from './creatApi';
import creatI18n from './creatI18n';

export default class Gitting {
  constructor(options = {}) {
    this.options = Object.assign({}, Gitting.DEFAULT, options);
    ['clientID', 'clientSecret', 'repo', 'owner'].forEach(item => {
      if (!this.options[item].trim()) {
        throw new Error(`The options.${item} can not be empty`);
      }
    });
    this.config = {
      $root: null,
      $container: null,
      api: creatApi(this.options),
      i18n: creatI18n(this.options.language),
    }
  }

  static get DEFAULT() {
    return {
      clientID: "",
      clientSecret: "",
      repo: "",
      owner: "",
      admin: [],
      theme: "white",
      id: window.location.pathname,
      number: -1,
      labels: ["Gitting"],
      language: "zh-cn",
      perPage: 10,
      maxlength: 500,
      avatar: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      proxy: "https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token",
    };
  }

  render(el) {
    this.config.$container = el instanceof Element ? el : document.querySelector(el);
    this.config.$root = render(<Container options={this.options} config={this.config} />, this.config.$container);
    return this;
  }

  destroy() {
    render(null, this.config.$container, this.config.$root);
    this.config.api.destroy();
  }
}
