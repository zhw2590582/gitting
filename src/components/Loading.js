import { h, Component } from 'preact';
import Enhanced from './Enhanced';

class Loading extends Component {
  render({ loading }) {
    return loading ? (
      <div class="gitting-loading">
        <div class="lds-ellipsis">
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    ) : null;
  }
}

export default Enhanced(Loading);
