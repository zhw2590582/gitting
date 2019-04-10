import { h, Component } from "preact";
import { connect } from "unistore/preact";
import { state, actions } from "../store";

export default function Enhanced(WrappedComponent) {
  return connect(
    Object.keys(state).join(','),
    actions
  )(
    class extends Component {
      render(props) {
        return <WrappedComponent {...props} />;
      }
    }
  );
}
