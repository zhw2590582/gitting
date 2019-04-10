import { h, Component } from 'preact';
import Enhanced from './Enhanced';

class Load extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  async loadMore(e) {
    e.preventDefault();
    const { config, issue, page, setComments } = this.props;
    this.setState(() => ({ loading: true }));
    const comments = await config.api.getComments(issue.number, page);
    this.setState(() => ({ loading: false, loadEnd: comments.length === 0 }));
    setComments(comments);
  }

  render({ options, config, comments }, { loading }) {
    if (loading) {
      return <span class="gitting-load">{config.i18n('loading')}</span>;
    }

    return comments.length ? (
      <a href="#" class="gitting-load" onClick={e => this.loadMore(e)}>
        {config.i18n('loadMore')}
      </a>
    ) : null;
  }
}

export default Enhanced(Load);
