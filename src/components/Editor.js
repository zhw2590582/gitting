import { h, Component } from "preact";
import Enhanced from "./Enhanced";

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      preview: false,
      markdown: ""
    };
  }

  onInput(e) {
    this.setState(() => {
      return {
        input: e.target.value
      };
    });
  }

  onWrite(e) {
    this.setState(() => {
      return {
        preview: false
      };
    });
  }

  async onPreview(e) {
    const { config } = this.props;
    const value = this.state.input.trim();
    this.setState(() => {
      return {
        preview: true,
        markdown: ""
      };
    });

    let markdown = "";
    if (value) {
      markdown = await config.api.mdToHtml(value);
    } else {
      markdown = config.i18n("noPreview");
    }

    this.setState(() => {
      return {
        markdown: markdown
      };
    });
  }

  async onSubmit(e) {
    const { options, config, issue, throwError } = this.props;
    const value = this.state.input.trim();
    if (!value) return;
    throwError(value.length <= options.maxlength, `Too many words: ${value.length}`);
    const item = await config.api.creatComments(issue.number, value);
    throwError(!item || !item.id, `Comment failed!`);
    this.setState(() => {
      return {
        input: "",
        markdown: ""
      };
    });
  }

  render(props, state) {
    const { options, config, userInfo, login, isLogin } = props;
    const { input, preview, markdown } = state;
    return (
      <div class="gitting-body">
        <div class="gitting-avatar">
          <img
            src={isLogin ? userInfo.avatar_url : options.avatar}
            alt={`@${isLogin ? userInfo.login : "github"}`}
          />
        </div>
        <div class="gitting-editor">
          <div
            style={{
              display: preview ? "" : "none"
            }}
            class="gitting-markdown markdown-body"
            dangerouslySetInnerHTML={{
              __html: markdown
            }}
          />
          <textarea
            style={{
              display: preview ? "none" : ""
            }}
            class="gitting-textarea"
            placeholder={config.i18n("leave")}
            maxlength={options.maxlength}
            spellcheck={false}
            value={input}
            onInput={e => this.onInput(e)}
          />
          <div
            class="gitting-tip"
            style={{
              display: preview ? "none" : ""
            }}
          >
            <a
              href="https://guides.github.com/features/mastering-markdown/"
              target="_blank"
            >
              {config.i18n("styling")}
            </a>
            <span class="gitting-counts">
              {options.maxlength - input.length} / {options.maxlength}
            </span>
          </div>
          <div class="gitting-tool">
            <div class="gitting-switch">
              <span
                class={preview ? "" : "active"}
                onClick={e => this.onWrite(e)}
              >
                {config.i18n("write")}
              </span>
              <span
                class={preview ? "active" : ""}
                onClick={e => this.onPreview(e)}
              >
                {config.i18n("preview")}
              </span>
            </div>
            {isLogin ? (
              <button class="gitting-send" onClick={e => this.onSubmit(e)}>
                {config.i18n("submit")}
              </button>
            ) : (
              <a class="gitting-send" href="#" onClick={e => login(options, e)}>
                {config.i18n("login")}
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Enhanced(Editor);
