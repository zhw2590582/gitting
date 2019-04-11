import { h, Component } from 'preact';
import Enhanced from './Enhanced';
import { getURLParameters, setStorage, getStorage } from '../utils';
import ErrorInfo from './ErrorInfo';
import Header from './Header';
import Editor from './Editor';
import Comments from './Comments';
import Loading from './Loading';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      init: false,
    };
  }

  async componentDidMount() {
    this.setState(() => ({ loading: true }));
    const { options, config, throwError, setUserInfo, setIssue } = this.props;
    const { code } = getURLParameters();
    if (code) {
      const data = await config.api.getToken(code);
      throwError(!data.access_token, 'Can not get token, Please login again!');
      setStorage('token', data.access_token);
      const userInfo = await config.api.getUserInfo(data.access_token);
      throwError(!userInfo.id, 'Can not get user info, Please login again!');
      setStorage('userInfo', userInfo);
      const redirect_uri = getStorage('redirect_uri');
      throwError(
        !redirect_uri,
        'Can not get redirect url, Please login again!'
      );
      window.history.replaceState(null, '', redirect_uri);
    }

    setUserInfo(getStorage('userInfo'));

    if (Number(options.number) > 0) {
      let issue = null;
      try {
        issue = await config.api.getIssueById(options.number);
        setIssue(issue);
      } catch (error) {
        if (!issue || !issue.number) {
          this.setState(() => ({ init: true }));
          throwError(
            true,
            `Failed to get issue by number: ${
              options.number
            }, Do you want to initialize an new issue?`
          );
        }
      }
    } else {
      const labels = options.labels.concat(options.id).join(',');
      const result = await config.api.getIssueByLabel(labels);
      const issue = Array.isArray(result) && result.length ? result[0] : null;
      if (!issue || !issue.number) {
        this.setState(() => ({ init: true }));
        throwError(
          true,
          `Failed to get issue by labels: ${labels}, Do you want to initialize an new issue?`
        );
      }
      setIssue(issue);
    }
    this.setState(() => ({ loading: false }));
  }

  async onInit() {
    const { options, config, userInfo, isLogin, throwError, login } = this.props;
    if (!isLogin()) {
      login(options);
      return;
    }
    throwError(
      !options.admin.includes(userInfo.login),
      `You have no permission to initialize this issue`
    );
    const detail = {
      title: document.title,
      body: `${document.title}\n${window.location.href}`,
      labels: options.labels.concat(options.id)
    };
    const issue = await config.api.creatIssues(detail);
    throwError(
      !issue || !issue.number,
      `Initialize issue failed: ${JSON.stringify(detail)}`
    );
    window.location.reload();
  }

  render({ options, config }, { loading, init }) {
    return (
      <div class={`gitting-container gitting-theme-${options.theme}`}>
        {loading ? (
          <Loading loading={loading} />
        ) : (
          <div>
            <ErrorInfo options={options} config={config} />
            {init ? (
              <button className="gitting-init" onClick={e => this.onInit(e)}>
                {config.i18n('init')}
              </button>
            ) : (
              <div>
                <Header options={options} config={config} />
                <Editor options={options} config={config} />
                <Comments options={options} config={config} />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Enhanced(App);
