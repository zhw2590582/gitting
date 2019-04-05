import { h, Component } from "preact";
import Enhanced from "./Enhanced";
import { queryStringify, setStorage } from "../utils";

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
      markdown = config.i("noPreview");
    }

    this.setState(() => {
      return {
        markdown: markdown
      };
    });
  }

  onSubmit(e) {
    
  }

  login(e) {
    e.preventDefault();
    const { options } = this.props;
    setStorage("redirect_uri", window.location.href);
    window.location.href = `http://github.com/login/oauth/authorize?${queryStringify(
      {
        state: "Gitting",
        client_id: options.clientID,
        redirect_uri: window.location.href,
        scope: "public_repo"
      }
    )}`;
  }

  render(props, state) {
    const { options, config, userInfo } = props;
    const { input, preview, markdown } = state;
    return (
      <div class="gitting-body">
        <div class="gitting-avatar">
          <img
            src={config.login ? userInfo.avatar_url : options.avatar}
            alt={`@${config.login ? userInfo.login : "github"}`}
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
            placeholder={config.i("leave")}
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
              {config.i("styling")}
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
                {config.i("write")}
              </span>
              <span
                class={preview ? "active" : ""}
                onClick={e => this.onPreview(e)}
              >
                {config.i("preview")}
              </span>
            </div>
            {config.login ? (
              <button class="gitting-send" onClick={e => this.onSubmit(e)}>
                {config.i("submit")}
              </button>
            ) : (
              <a class="gitting-send" href="#" onClick={e => this.login(e)}>
                {config.i("login")}
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Enhanced(Editor);
