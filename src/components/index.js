import { h, Component } from "preact";
import { Provider } from "unistore/preact";
import { store } from "../store";
import Header from "./Header";

export default class extends Component {
  render({ options, config }) {
    return (
      <Provider store={store}>
        <Header options={options} config={config} />
      </Provider>
    );
  }
}
