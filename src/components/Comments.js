import { h, Component } from 'preact';
import Enhanced from './Enhanced';
import { smoothScroll } from '../utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
dayjs.extend(relativeTime);
import Loading from './Loading';

const CommentItem = Enhanced(({ options, config, item, reply }) => {
  return (
    <div className="gitting-comment-item" key={item.id}>
      <div className="gitting-avatar">
        <a href={item.user.html_url} target="_blank">
          <img src={item.user.avatar_url} alt={`@${item.user.login}`} />
        </a>
      </div>
      <div className="gitting-content gitting-caret">
        <div
          className="gitting-content-body markdown-body"
          dangerouslySetInnerHTML={{
            __html: item.body_html
          }}
        />
        <div className="gitting-content-mate">
          <span>
            <a
              className="gitting-content-name"
              href={item.user.html_url}
              target="_blank"
            >
              {item.user.login}
            </a>
            <span className="gitting-content-time" data-time={item.created_at}>
              {config.i18n('published')} {dayjs(item.created_at).fromNow()}
            </span>
          </span>
          <a
            className="gitting-content-reply"
            href="#"
            onClick={e => reply(item, e)}
          >
            {config.i18n('reply')}
          </a>
        </div>
      </div>
    </div>
  );
});

class Comments extends Component {
  constructor(props) {
    super(props);
    dayjs.locale(props.options.language);
    this.state = {
      loading: false
    };
    this.reply = this.reply.bind(this);
  }

  async componentDidMount() {
    this.setState(() => ({ loading: true }));
    const { config, setComments, issue, page } = this.props;
    if (issue.number) {
      const comments = await config.api.getComments(issue.number, page);
      setComments(comments);
    }
    this.setState(() => ({ loading: false }));
  }

  reply(comment, e) {
    e.preventDefault();
    const { input, setInput, config } = this.props;
    const markdowm = `${input ? '\n' : ''}> @${comment.user.login}\n> ${
      comment.body
    }\n`;
    setInput(input + markdowm);
    smoothScroll(config.$container);
  }

  render({ options, config, comments }, { loading }) {
    return (
      <div className="gitting-comments">
        {comments.map(item => {
          return (
            <CommentItem
              options={options}
              config={config}
              item={item}
              key={item.id}
              reply={this.reply}
            />
          );
        })}
        <Loading loading={loading} />
      </div>
    );
  }
}

export default Enhanced(Comments);
