import React, {Component} from 'react';
import {Route, withRouter,Link} from 'react-router-dom';

class DefaultTool extends Component {
  constructor(props) {
	super(props)
  }

  render() {
	return (
	  <div>
		tool 1 page

	  </div>
	);
  }
}

export default withRouter(DefaultTool)