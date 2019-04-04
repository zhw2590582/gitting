import "./style.scss";
import {
  h,
  render
} from "preact";

class Gitting {
  constructor(optinos) {
    this.optinos = Object.assign({}, optinos, Gitting.DEFAULT);
  }

  static DEFAULT() {
    return {}
  }
}

window.Gitting = Gitting;
export default Gitting;
