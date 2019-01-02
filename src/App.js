import React, {Component} from 'react';
import {Redirect,Route,withRouter} from 'react-router-dom';
import './App.css';
import {Menu, Icon} from 'antd';
import Tool from './views/tool/index.js'
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class App extends Component {
  constructor(props) {
	super(props);

  }

  render() {
	return (
	  <div className="container-div">
		<Menu
		  className="header-menu"
		  onClick={this.handleClick}
		  selectedKeys={[this.state.current]}
		  mode="horizontal">
		  <Menu.Item key="tool">
			<Icon type="tool" />工具
		  </Menu.Item>
		  <Menu.Item key="vpn">
			<Icon type="wifi" />VPN
		  </Menu.Item>

		</Menu>
		<div className="app-container">
		  <Redirect to="/tool"/>
		  <Route path="/tool" component={Tool}></Route>
		</div>
	  </div>

	);
  };
  state = {
	current: 'tool',
  }
  handleClick=(params)=>{
    // console.log(this);
    this.setState({
	  current:params.key
	})
	console.log(this.props);
	this.props.history.push(`/${params.key}`)
  }
}

export default withRouter(App);
