import { h, Component } from "preact";
import Enhanced from "./Enhanced";
import { queryStringify, setStorage } from "../utils";

class Header extends Component {
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

  render(props) {
    const { issue, options, config, userInfo, logout, login } = props;
    return (
      <header class="gitting-header">
        <a
          href={`https://github.com/${options.owner}/${options.repo}/issues/${
            issue.number
          }`}
          class="gitting-number"
        >
          {issue.comments || 0} {config.i("counts")}
        </a>
        <div class="gitting-mate">
          {config.login ? (
            <span>
              <a href="#">{userInfo.login}</a>
              <a href="#" onClick={e => logout(e)}>
                {config.i("logout")}
              </a>
            </span>
          ) : (
            <a href="#" onClick={e => login(options, e)}>
              {config.i("login")}
            </a>
          )}
          <a href={`https://github.com/zhw2590582/gitting`}>
            Gitting __VERSION__
          </a>
        </div>
      </header>
    );
  }
}

export default Enhanced(Header);
