import "./index.scss";
import "./primer-markdown.css";
import i18n from "./i18n";
import * as api from "./api";
import * as utils from "./utils";

class Gitting {
  constructor(option) {
    this.option = Object.assign({}, Gitting.DEFAULTS, option);
    console.log(ENV);
  }

  static get DEFAULTS() {
    return {};
  }

  render(el) {
    this.container = el instanceof Element ? el : document.querySelector(el);
  }
}

window.Gitting = Gitting;
export default Gitting;
