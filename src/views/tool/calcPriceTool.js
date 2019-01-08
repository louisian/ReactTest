import React, {Component} from 'react';
import {Route, withRouter, Link} from 'react-router-dom';
import ProductDetail from '../../components/productDetail.js';
import './calcPriceTool.scss';
import {Input, Button} from 'antd';

class CalcPriceTool extends Component {
  constructor(props) {
	super(props)

	let ProductDetailList = [];
	ProductDetailList.push(this.productDetailTemp(0));
	//constructor里不能使用setState 直接this.state
	this.state = {
	  ticketFull: 0,
	  ticketMinus: 0,
	  ticketString: '',
	  productPrice: 0,
	  productNum: 0,
	  totalPrice: 0,
	  pid: 0,
	  productArray:[],
	  ProductDetailList: ProductDetailList

	}
  }

  render() {
	return (
	  <div className="calc-price__container">
		<div className={'ticket input-group'}>
		  <p className={'inner-label'}>券满{this.state.ticketFull}减{this.state.ticketMinus}</p>
		  <Input onChange={this.handleTicketChange} value={this.state.ticketString} className={'inner-input'}/>
		</div>
		{/*<div className={'product input-group'}>*/}
		  {/*<p className={'inner-label'}>商品单价</p>*/}
		  {/*<Input onChange={this.handleProductDetailChange} value={this.state.productPrice} className={'inner-input'}/>*/}
		{/*</div>*/}
		<div className={'products-detail__container'}>
		  {this.state.ProductDetailList}
		  <Button onClick={this.handleAddProductDetail}>+</Button>
		</div>
		<Button onClick={this.calcPrice}>计算</Button>
		<div className={'result'}>
		  <p>最少购买数量{this.state.productNum}</p>
		  <p>最后总价{this.state.totalPrice}</p>
		  <p>最后单价{(this.state.totalPrice / this.state.productNum).toFixed(2)}</p>
		  <p className={'error-text'}>ERROR:</p>
		</div>
	  </div>

	);
  }


  handleTicketChange = (e) => {
	let ticketString = e.target.value;
	this.setState({
	  ticketString: ticketString,
	  ticketFull: +ticketString.split('-')[0],
	  ticketMinus: +(ticketString.split('-')[1] || 0),


	})
	// this.calcPrice();
	console.log(e.target.value)
  }
  handleProductChange = (e) => {
	let price = e.target.value;

	this.setState({
	  productPrice: price,
	})
	// this.calcPrice();
  }
  handleProductDetailChange = (state) => {
	//todo debounce
	let {productArray}=this.state,obj;
	obj={
	  ...state,
	  total:state.isLock?(state.price*state.num):0,
	  minTotal:state.isLock?0:(state.price*state.num)
	}
	// console.log(obj);
	productArray[state.id]=obj;
	console.log(productArray);
	this.setState({
	  productArray:productArray
	})
		  // console.log(state)
  }

  /**
   * 循环渲染
   * @param pid
   * @returns {*}
   */
  productDetailTemp(pid) {
	return (
	  <ProductDetail key={pid} callback={this.handleProductDetailChange} id={pid}></ProductDetail>
	)
  }

  handleAddProductDetail = () => {
	let {pid,ProductDetailList}=this.state;
	pid++;
	ProductDetailList=ProductDetailList.concat(this.productDetailTemp(pid));
	this.setState({
	  pid:pid,
	  ProductDetailList: ProductDetailList
	})

  }
  // ProductDetailList(){
  //   let list;
  //   list.push(this.productDetailTemp(this.state.pid));
  //   return (
  // 	{list}
  //   )
  // }
  calcPrice = () => {
	// console.log('start?')
	let {productPrice, ticketFull, ticketMinus} = this.state
	let totalPrice = 0, productNum = 0;
	productPrice = parseFloat(productPrice);
	// console.log(productPrice||ticketFull||ticketMinus)
	if (!productPrice || !ticketFull || !ticketMinus) {
	  return;
	}
	productNum = Math.ceil(ticketFull / productPrice)
	totalPrice = productPrice * productNum - ticketMinus;
	// console.log(productNum)
	this.setState({
	  productNum: productNum,
	  totalPrice: totalPrice,
	})
  }
}

export default withRouter(CalcPriceTool)