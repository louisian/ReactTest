import React, {Component} from 'react';
import {Route, withRouter,Link} from 'react-router-dom';
import DefaultTool from './defaultTool'
class Tool extends Component {
  constructor(props) {
	super(props)
  }

  render() {
	return (
		<div>
		  tool page
		  <Link to="/tool/111">Tool 1</Link>
		  <div className="container">
			<Route path="/tool/111" component={DefaultTool}></Route>

		  </div>

		</div>
	);
  }
}

export default withRouter(Tool)