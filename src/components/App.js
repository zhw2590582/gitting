import { h, Component } from 'preact';
import Enhanced from './Enhanced';
import { getURLParameters, setStorage, getStorage } from '../utils';
import ErrorInfo from './ErrorInfo';
import Header from './Header';
import Editor from './Editor';
import Comments from './Comments';
import Load from './Load';
import Loading from './Loading';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
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
      setUserInfo(userInfo);
      const redirect_uri = getStorage('redirect_uri');
      throwError(
        !redirect_uri,
        'Can not get redirect url, Please login again!'
      );
      window.history.replaceState(null, '', redirect_uri);
    }

    let issue = null;
    if (Number(options.number) > 0) {
      try {
        issue = await config.api.getIssueById(options.number);
        setIssue(issue);
      } catch (error) {
        throwError(
          !issue || !issue.number,
          `Failed to get issue by id: ${
            options.number
          }, Do you want to initialize an new issue?`
        );
      }
    } else {
      const labels = options.labels.concat(options.id).join(',');
      issue = (await config.api.getIssueByLabel(labels))[0];
      setIssue(issue);
      throwError(
        !issue || !issue.number,
        `Failed to get issue by labels: ${labels}, Do you want to initialize an new issue?`
      );
    }
    this.setState(() => ({ loading: false }));
  }

  render({ options, config }, { loading }) {
    return (
      <div class={`gitting-container gitting-theme-${options.theme}`}>
        {loading ? (
          <Loading loading={loading} />
        ) : (
          <div>
            <ErrorInfo options={options} config={config} />
            <Header options={options} config={config} />
            <Editor options={options} config={config} />
            <Comments options={options} config={config} />
            <Load options={options} config={config} />
          </div>
        )}
      </div>
    );
  }
}

export default Enhanced(App);
