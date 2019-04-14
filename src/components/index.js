import { h, Component } from "preact";
import createStore from 'unistore';
import { Provider } from "unistore/preact";
import { state } from "../store";
import App from "./App";

export default class extends Component {
  constructor(props) {
    super(props);
    this.store = createStore(state);
  }

  render({ options, config }) {
    return (
      <Provider store={this.store}>
        <App options={options} config={config} />
      </Provider>
    );
  }
}
