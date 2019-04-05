import { h, Component } from "preact";
import { connect } from "unistore/preact";
import { actions } from "../store";

export default function Enhanced(WrappedComponent) {
  return connect(
    "issue,comments",
    actions
  )(
    class extends Component {
      render(props) {
        return <WrappedComponent {...props} />;
      }
    }
  );
}
