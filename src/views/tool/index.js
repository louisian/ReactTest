import React, {Component} from 'react';
import {Redirect,Route, withRouter,Link} from 'react-router-dom';
import calcPriceTool from './calcPriceTool'
import { Menu, Icon } from 'antd';
import './index.css';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
class Tool extends Component {
  constructor(props) {
	super(props)
  }

  render() {
	return (
		<div className="inner-container__div tool-container">
		  <Menu
			className="tool-menu"
			onClick={this.handleClick}
			selectedKeys={[this.state.current]}
			style={{ width: 256 }}
			mode="inline">
			<SubMenu key="toolGroup" title={<span><Icon type="tool" /><span>工具组</span></span>}>
			  <MenuItemGroup key="toolGroup1" title="工具组1">
				<Menu.Item key="calc-price">计算优惠后单价</Menu.Item>
				<Menu.Item key="2">Option 2</Menu.Item>
			  </MenuItemGroup>
			  <MenuItemGroup key="g2" title="Item 2">
				<Menu.Item key="3">Option 3</Menu.Item>
				<Menu.Item key="4">Option 4</Menu.Item>
			  </MenuItemGroup>
			</SubMenu>
			<SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
			  <Menu.Item key="5">Option 5</Menu.Item>
			  <Menu.Item key="6">Option 6</Menu.Item>
			  <SubMenu key="sub3" title="Submenu">
				<Menu.Item key="7">Option 7</Menu.Item>
				<Menu.Item key="8">Option 8</Menu.Item>
			  </SubMenu>
			</SubMenu>
			<SubMenu key="sub4" title={<span><Icon type="setting" /><span>Navigation Three</span></span>}>
			  <Menu.Item key="9">Option 9</Menu.Item>
			  <Menu.Item key="10">Option 10</Menu.Item>
			  <Menu.Item key="11">Option 11</Menu.Item>
			  <Menu.Item key="12">Option 12</Menu.Item>
			</SubMenu>
		  </Menu>
		  <div className="tool-container s-inner-container">
			<Route path="/tool/calc-price" component={calcPriceTool}></Route>
			<Redirect to="/tool/calc-price"/>
		  </div>

		</div>
	);
  }
  state={
    current:'calc-price'
  }
  handleClick=(e)=>{
    console.log(e);
    this.setState({
	  current:e.key
	})
	console.log(this.props.history);
    let pathName=this.props.history.location.pathname;
	this.props.history.push(`/tool/${e.key}`)
  }
}

export default withRouter(Tool)