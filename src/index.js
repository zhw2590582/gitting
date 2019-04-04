import "./styles/index.scss";
import { h, render } from "preact";
//@jsx h

render(
  <div id="foo">
    <span>Hello, world!</span>
    <button onClick={e => alert("hi!")}>Click Me</button>
  </div>,
  document.querySelector('.gitting')
);
