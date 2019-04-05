import "./style.scss";
import { h, render } from "preact";
import Container from "./components";

class Gitting {
  constructor(options = {}) {
    this.options = Object.assign({}, Gitting.DEFAULT, options);
    this.$root = null;
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
    this.$container = el instanceof Element ? el : document.querySelector(el);
    this.$container.classList.add("gitting-container");
    this.$container.classList.add(`gitting-theme-${this.options.theme}`);
    this.$root = render(<Container options={this.options} />, this.$container);
  }

  destroy() {
    render(null, this.$container, this.$root);
  }
}

window.Gitting = Gitting;
export default Gitting;
