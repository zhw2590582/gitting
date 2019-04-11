import { h, Component } from 'preact';
import Enhanced from './Enhanced';
import Loading from './Loading';
import { smoothScroll, throwError, tip } from '../utils';

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      preview: false,
      markdown: ''
    };
  }

  onWrite(e) {
    this.setState(() => {
      return {
        preview: false
      };
    });
  }

  async onPreview(e) {
    const { config, input } = this.props;
    const value = input.trim();
    this.setState(() => {
      return {
        preview: true,
        markdown: ''
      };
    });

    let markdown = '';
    if (value) {
      this.setState(() => ({ loading: true }));
      markdown = await config.api.mdToHtml(value);
      this.setState(() => ({ loading: false }));
    } else {
      markdown = config.i18n('noPreview');
    }

    this.setState(() => {
      return {
        markdown: markdown
      };
    });
  }

  async onSubmit(e) {
    const { options, input, config, issue, setInput } = this.props;
    const value = input.trim();
    throwError(value, config.i18n('commentEmpty'));
    throwError(value.length <= options.maxlength, config.i18n('wordsExceeds'));
    this.setState(() => ({ loading: true }));
    const item = await config.api.creatComments(issue.number, value);
    throwError(item && item.id, config.i18n('commentFail'), () => {
      this.setState(() => ({ loading: false }));
    });
    this.setState(() => {
      return {
        loading: false,
        markdown: ''
      };
    });
    if (item.id) {
      setInput('');
      tip(config.i18n('commentSuccess'));
      setTimeout(() => {
        smoothScroll(config.$container.querySelector('.gitting-load')).click();
      }, 100);
    }
  }

  render(props, state) {
    const {
      options,
      input,
      setInput,
      config,
      userInfo,
      login,
      isLogin
    } = props;
    const { preview, markdown, loading } = state;
    return (
      <div class="gitting-body">
        <div class="gitting-avatar">
          <img
            src={isLogin() ? userInfo.avatar_url : options.avatar}
            alt={`@${isLogin() ? userInfo.login : 'github'}`}
          />
        </div>
        <div class="gitting-editor">
          <div
            style={{
              display: preview ? '' : 'none'
            }}
            class="gitting-markdown markdown-body"
            dangerouslySetInnerHTML={{
              __html: markdown
            }}
          />
          <textarea
            style={{
              display: preview ? 'none' : ''
            }}
            class="gitting-textarea"
            placeholder={config.i18n('leave')}
            maxlength={options.maxlength}
            spellcheck={false}
            value={input}
            onInput={e => setInput(e.target.value)}
          />
          <div
            class="gitting-tip"
            style={{
              display: preview ? 'none' : ''
            }}
          >
            <a
              href="https://guides.github.com/features/mastering-markdown/"
              target="_blank"
            >
              {config.i18n('styling')}
            </a>
            <span class="gitting-counts">
              {options.maxlength - input.length} / {options.maxlength}
            </span>
          </div>
          <div class="gitting-tool">
            <div class="gitting-switch">
              <span
                class={preview ? '' : 'active'}
                onClick={e => this.onWrite(e)}
              >
                {config.i18n('write')}
              </span>
              <span
                class={preview ? 'active' : ''}
                onClick={e => this.onPreview(e)}
              >
                {config.i18n('preview')}
              </span>
            </div>
            {isLogin() ? (
              <button class="gitting-send" onClick={e => this.onSubmit(e)}>
                {config.i18n('submit')}
              </button>
            ) : (
              <a class="gitting-send" href="#" onClick={e => login(options, e)}>
                {config.i18n('login')}
              </a>
            )}
          </div>
        </div>
        <Loading loading={loading} />
      </div>
    );
  }
}

export default Enhanced(Editor);
