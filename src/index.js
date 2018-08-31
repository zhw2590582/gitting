import './index.scss';
import i18n from "./i18n";
import * as api from "./api";
import * as utils from "./utils";

class Comment {
    constructor(option) {
        this.option = Object.assign({}, Comment.DEFAULTS, option);
        console.log(isProd);
    }

    static get DEFAULTS() {
        return {
            
        };
    }

    render(el) {
        this.container = el instanceof Element ? el : document.querySelector(el);
    }
}

window.Comment = Comment;
export default Comment;