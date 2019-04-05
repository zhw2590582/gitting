import "./style.scss";
import { h, render } from "preact";
import Container from "./components";
import creatApi from './api';
import creatI18n from './i18n';

class Gitting {
  constructor(options = {}) {
    this.options = Object.assign({}, Gitting.DEFAULT, options);
    this.$root = null;
    this.config = {
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
      id: location.pathname,
      number: -1,
      labels: ["Gitting"],
      title: document.title,
      body: `${document.title}\n${location.href}`,
      language: "zh-cn",
      perPage: 10,
      maxlength: 500,
      avatar: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      proxy: "https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token",
    };
  }

  render(el) {
    this.config.$container = this.$container = el instanceof Element ? el : document.querySelector(el);
    this.$root = render(<Container options={this.options} config={this.config} />, this.$container);
  }

  destroy() {
    render(null, this.$container, this.$root);
  }
}

window.Gitting = Gitting;
export default Gitting;
