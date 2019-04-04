import "./style.scss";
import optionValidator from 'option-validator';
import scheme from './scheme';
import preact from "preact";

class Gitting {
  constructor(options) {
    this.options = Object.assign({}, options, Gitting.DEFAULT);
    optionValidator(this.options, scheme);
  }

  static DEFAULT() {
    return {}
  }
}

window.Gitting = Gitting;
export default Gitting;
