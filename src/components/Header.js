import { h, Component } from "preact";
import Enhanced from "./Enhanced";

class Header extends Component {
  render(props) {
    const { isLogin, issue, options, config, increment } = props;
    return (
      <header class="gitting-header" onClick={increment}>
        <a
          href={`https://github.com/${options.owner}/${options.repo}/issues/${
            issue.id
          }`}
          class="gitting-number"
        >
          {issue.comments || 0} {config.i("counts")}
        </a>
        <div class="gitting-mate">
          {isLogin ? (
            <span>
              <a href="#">用户名</a>
              <a href="#">{config.i("logout")}</a>
            </span>
          ) : (
            <a href="#">{config.i("login")}</a>
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
