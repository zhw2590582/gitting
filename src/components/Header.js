import { h, Component } from "preact";
import Enhanced from './Enhanced';

class Header extends Component {
  render(props) {
    const { issue, options, increment } = props;
    return (
      <header class="gitting-header" onClick={increment}>
        <a
          href={`https://github.com/${options.owner}/${options.repo}/issues/${issue.id}`}
          class="gitting-number"
        >
          0 条评论
        </a>
      </header>
    );
  }
}

export default Enhanced(Header);
