import { h, Component } from 'preact';
import Enhanced from './Enhanced';
import { getURLParameters, setStorage, getStorage, throwError } from '../utils';
import Header from './Header';
import Editor from './Editor';
import Comments from './Comments';
import Loading from './Loading';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      init: false
    };
  }

  async componentDidMount() {
    this.setState(() => ({ loading: true }));
    const { options, config, setUserInfo, setIssue } = this.props;
    const { code } = getURLParameters();
    if (code) {
      const data = await config.api.getToken(code);
      throwError(data.access_token, config.i18n('loginAgainForToken'));
      setStorage('token', data.access_token);
      const userInfo = await config.api.getUserInfo(data.access_token);
      throwError(userInfo.id, config.i18n('loginAgainForUser'));
      setStorage('userInfo', userInfo);
      const redirect_uri = getStorage('redirect_uri');
      throwError(redirect_uri, config.i18n('loginAgainForRedirect'));
      window.history.replaceState(null, '', redirect_uri);
    }

    setUserInfo(getStorage('userInfo'));

    if (Number(options.number) > 0) {
      const issue = await config.api.getIssueById(options.number);
      throwError(issue && issue.number, config.i18n('getIssueFail'), () => {
        this.setState(() => ({ init: true }));
        this.setState(() => ({ loading: false }));
      });
      setIssue(issue);
    } else {
      const labels = options.labels.concat(options.id).join(',');
      const result = await config.api.getIssueByLabel(labels);
      const issue = Array.isArray(result) && result.length ? result[0] : null;
      throwError(issue && issue.number, config.i18n('getIssueFail'), () => {
        this.setState(() => ({ init: true }));
        this.setState(() => ({ loading: false }));
      });
      setIssue(issue);
    }
    this.setState(() => ({ loading: false }));
  }

  async onInit() {
    const { options, config, userInfo, isLogin, login } = this.props;
    if (!isLogin()) {
      login(options);
      return;
    }

    throwError(
      options.admin.includes(userInfo.login),
      config.i18n('permissionFail')
    );
    const detail = {
      title: document.title,
      body: `${document.title}\n${window.location.href}`,
      labels: options.labels.concat(options.id)
    };
    const issue = await config.api.creatIssues(detail);
    throwError(issue && issue.number, config.i18n('initFail'));
    window.location.reload();
  }

  render({ options, config }, { loading, init }) {
    return (
      <div class={`gitting-container gitting-theme-${options.theme}`}>
        {loading ? (
          <Loading loading={loading} />
        ) : (
          <div>
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
