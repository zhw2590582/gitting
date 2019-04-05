import { h, Component } from "preact";
import { Provider } from "unistore/preact";
import { store } from "../store";
import App from "./App";

export default class extends Component {
  render({ options }) {
    return (
      <Provider store={store}>
        <App options={options} />
      </Provider>
    );
  }
}
