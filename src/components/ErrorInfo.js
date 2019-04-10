import { h, Component } from "preact";
import Enhanced from "./Enhanced";

class ErrorInfo extends Component {
  componentDidMount() {
    if (this.props.error) {
      throw new Error(this.props.error);
    }
  }

  componentDidUpdate() {
    if (this.props.error) {
      throw new Error(this.props.error);
    }
  }

  render(props) {
    const { error } = props;
    if (!error) {
      return null;
    }
    return <div class="gitting-error">{error}</div>;
  }
}

export default Enhanced(ErrorInfo);
