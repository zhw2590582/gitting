import { h, Component } from "preact";
import Enhanced from "./Enhanced";

class Header extends Component {
  render(props) {
    const { issue, options, config, userInfo, isLogin, logout, login, comments } = props;
    return (
      <header class="gitting-header">
        <a
          href={`https://github.com/${options.owner}/${options.repo}/issues/${
            issue.number
          }`}
          class="gitting-number"
        >
          {comments.length} {config.i18n("counts")}
        </a>
        <div class="gitting-mate">
          {isLogin ? (
            <span>
              <a href="#">{userInfo.login}</a>
              <a href="#" onClick={e => logout(e)}>
                {config.i18n("logout")}
              </a>
            </span>
          ) : (
            <a href="#" onClick={e => login(options, e)}>
              {config.i18n("login")}
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
