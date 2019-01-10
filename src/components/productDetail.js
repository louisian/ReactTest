import {Button, Input, Switch} from 'antd';
import React, {Component} from 'react';
import './productDetail.scss';

class ProductDetail extends Component {
  constructor(props) {
	super(props);
	this. state = {
	  id: this.props.id,
	  // data:{},
	  isLock: false,
	  price: 0,
	  num: 0
	}
  }
  componentWillReceiveProps(nextProps, nextContext) {
    console.log('rev',this.props,nextProps)
  	if(Object.keys(this.props.productData).length===0&&Object.keys(nextProps.productData).length>0){
  	  console.log('?')
  	  this.setState({
		price:nextProps.productData.price,
		num:nextProps.productData.num,
	  })
	}
  }

  render() {
	return (
	  <div className={'product-detail__container'}>
		<Switch onChange={this.switchChange} className={'lock-switch'} checkedChildren="锁" unCheckedChildren="解"/>
		<Input value={this.state.price} onChange={(e) => {
		  this.handleInputChange(e, 'price')
		}} className={'price-input'} placeholder="单价"/>
		<Input value={this.state.num} onChange={(e) => {
		  this.handleInputChange(e, 'num')
		}} className={'num-input'} placeholder="数量"/>
		{/*<Button className={'emit-button'} onClick={this.handleInput}>输入</Button>*/}
	  </div>
	)

  }


  switchChange = (e) => {
	this.setState({
	  isLock: e
	})
	// this.props.callback(this.state);
	// console.log(e)
  }
  handleInputChange = (e, state) => {
	let obj = {}
	obj[state] = state==='num'?parseInt(e.target.value)||0:parseFloat(e.target.value);
	this.setState(obj)

  }
  componentDidUpdate(prevProps, prevState, snapshot) {
	this.props.callback(this.state);
  }

  // handleInput = (e) => {
	//
  // }

}

export default ProductDetail;