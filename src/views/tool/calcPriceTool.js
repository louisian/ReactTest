import React, {Component} from 'react';
import {Route, withRouter, Link} from 'react-router-dom';
import ProductDetail from '../../components/productDetail.js';
import './calcPriceTool.scss';
import {Input, Button, Table} from 'antd';
// import calcWorker from '';
// let MyWorker=require('./worker.js')
class CalcPriceTool extends Component {
  constructor(props) {
	super(props)

	this.worker = new Worker(window.location.origin+'/calcWorker.js');
	this.worker.onmessage = (data) => {
	  console.log(data.data)
	  if(data.data.success){
	    this.setState({
		  isLoading:false
		})
	  }
	  if(data.data.result){
		let {resultArray}= this.state;
		this.setState({
		  // shouldCalc: false,
		  // productArray: productArray,
		  resultArray: data.data.result
		})
	  }


	  // console.log('onMessageMain',data.resultArray)

	}
	this.worker.onerror=(data)=>{
	  console.log(data)
	}
	let ProductDetailList = [];
	ProductDetailList.push(this.productDetailTemp(0));
	//constructor里不能使用setState 直接this.state
	this.state = {
	  ticketFull: 0,
	  ticketMinus: 0,
	  ticketFloat: 0,
	  ticketString: '',
	  productPrice: 0,//abandon
	  productNum: 0,//abandon
	  totalPrice: 0,
	  lockPrice: 0,
	  pid: 0,
	  isLoading:false,
	  productArray: [],
	  resultArray: [],
	  ProductDetailList: ProductDetailList,
	  shouldCalc: false,

	}
  }

  render() {

	// console.log(this.worker);
	const expandedRowRender = (record) => {
	  console.log('record', record)
	  const Tcolumns = [
		{title: '价格', dataIndex: 'price', key: 'price'},
		{title: '折后价', dataIndex: 'discountPrice', key: 'discountPrice'},
		{title: '数量', key: 'num', dataIndex: 'num'},
		// { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
	  ];


	  return (
		<Table
		  columns={Tcolumns}
		  dataSource={record.priceListArray}
		  pagination={false}
		/>
	  );
	};
	const columns = [
	  {
		title: 'id',
		dataIndex: 'id',
		key: 'id'
	  },
	  {
		title: '锁定',
		dataIndex: 'isLock',
		key: 'isLock',
		render: (text, record) => (
		  <span>{record.isLock ? '是' : '否'}</span>
		)
	  },
	  {
		title: '价格',
		dataIndex: 'price',
		key: 'price'
	  },
	  {
		title: '最大数量',
		dataIndex: 'maxNum',
		key: 'maxNum'
	  },
	  {
		title: '数量',
		dataIndex: 'num',
		key: 'num'
	  },
	  {
		title: '最小数量',
		dataIndex: 'minNum',
		key: 'minNum'
	  },
	  {
		title: '总价',
		dataIndex: 'total',
		key: 'total'
	  }

	]
	const rstColumns = [
	  {
		title: '总价',
		dataIndex: 'total',
		key: 'total'
	  },
	  {
		title: '券后价',
		dataIndex: 'discountTotal',
		key: 'discountTotal'
	  },
	  {
		title: '折扣',
		dataIndex: 'discount',
		key: 'discount'
	  }
	]
	return (
	  <div className="calc-price__container">
		<div className={'ticket input-group'}>
		  <p
			className={'inner-label'}>券满{this.state.ticketFull}减{this.state.ticketMinus},约{((this.state.ticketFull - this.state.ticketMinus) / this.state.ticketFull * 10 || 0).toFixed(2)}折</p>
		  <Input onChange={this.handleTicketChange} value={this.state.ticketString}
				 className={'inner-input'}/>
		</div>
		{/*<div className={'product input-group'}>*/}
		{/*<p className={'inner-label'}>商品单价</p>*/}
		{/*<Input onChange={this.handleProductDetailChange} value={this.state.productPrice} className={'inner-input'}/>*/}
		{/*</div>*/}
		<div className={'products-detail__container'}>
		  {this.state.ProductDetailList}

		</div>
		<div className={'action-list'}>
		  <Button loading={this.state.isLoading} onClick={this.handleAddProductDetail}>+</Button>
		  <Button loading={this.state.isLoading} type={'primary'} className={'calc-button'} onClick={this.executeWorker}>计算</Button>
		  <Button loading={this.state.isLoading} type={'primary'} className={'calc-button'} onClick={this.saveProduct}>保存</Button>
		  <Button loading={this.state.isLoading} type={'primary'} className={'calc-button'} onClick={this.loadProduct}>读取</Button>
		  <Button loading={this.state.isLoading} type={'primary'} className={'calc-button'} onClick={this.clearProduct}>清空</Button>
		</div>

		<div className={'result'}>

		  <p>浮动价格：{this.state.ticketFloat}</p>
		  <div>
			商品列表
			<Table dataSource={this.state.productArray} columns={columns}>

			</Table>
		  </div>
		  <div>
			结果列表
			<Table expandedRowRender={expandedRowRender} dataSource={this.state.resultArray}
				   columns={rstColumns} pagination={'bottom'}>

			</Table>
		  </div>
		  {/*<p>最后总价{this.state.totalPrice}</p>*/}
		  {/*<p>最后单价{(this.state.totalPrice / this.state.productNum).toFixed(2)}</p>*/}
		  {/*<p className={'error-text'}>ERROR:</p>*/}
		</div>
	  </div>

	);
  }

  componentWillMount() {


  }
  saveProduct=()=>{
	  let {productArray,ticketString}=this.state;
	  localStorage.setItem('productArray',JSON.stringify(productArray));
	  localStorage.setItem('ticketString',ticketString);
  }
  loadProduct=()=>{
	    let productArray,ticketString,productDetailList=[];
	    ticketString=localStorage.getItem('ticketString')
		productArray=localStorage.getItem('productArray')
		if(ticketString&&productArray){
		  productArray=JSON.parse(productArray);

		  productArray.forEach(v=>{
			console.log(productArray,v)
		    productDetailList.push(this.productDetailTemp(v.id,v))

		  })
		  this.handleTicketChange(null,ticketString)
		  this.setState({
			pid:productDetailList.length-1,
			shouldCalc:true,
			productArray:productArray,
			ProductDetailList:productDetailList
		  })
		}

  }
  clearProduct=()=>{
	  this.setState({
		ticketFull: 0,
		ticketMinus: 0,
		ticketFloat: 0,
		ticketString: '',
		productPrice: 0,//abandon
		productNum: 0,//abandon
		totalPrice: 0,
		lockPrice: 0,
		pid: -1,
		isLoading:false,
		productArray: [],
		resultArray: [],
		ProductDetailList: [],
		shouldCalc: false,
	  })
  }
  handleTicketChange = (e,ticketLoad) => {
	let ticketString = (e&&e.target.value)||ticketLoad;
	this.setState({
	  ticketString: ticketString,
	  ticketFull: +ticketString.split('-')[0],
	  ticketMinus: +(ticketString.split('-')[1] || 0),


	})
	// this.calcPrice();
	// console.log(e.target.value)
  }
  executeWorker = () => {
	let {productArray, ticketFull, ticketMinus} = this.state
	this.setState({
	  isLoading:true
	})
	this.worker.postMessage({
	  productArray: productArray,
	  ticketFull: ticketFull,
	  ticketMinus: ticketMinus
	})
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
	// console.log(state)
	let {productArray, lockPrice} = this.state, obj;
	let singleTotal = (state.price * state.num)
	obj = {
	  ...state,
	  total: state.isLock ? singleTotal : 0,
	  minTotal: state.isLock ? 0 : singleTotal,
	  minNum: state.num,
	  maxNum: state.isLock ? state.num : 0,

	}
	lockPrice += singleTotal;
	// console.log(obj);
	productArray[state.id] = obj;
	productArray=JSON.parse(JSON.stringify(productArray));
	// console.log(productArray);
	this.setState({
	  productArray: productArray,
	  lockPrice: lockPrice,
	  shouldCalc: true,
	})
	// console.log(state)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
	if (this.state.shouldCalc && !prevState.shouldCalc) {//需要进行计算
	  // console.log('？')
	  let {productArray, ticketFull} = this.state, ticketFloat = ticketFull;
	  // console.log(productArray);
	  productArray.forEach((element) => {
		ticketFloat -= element.minNum * element.price;
	  })
	  ticketFloat = ticketFloat < 0 ? 0 : ticketFloat
	  productArray = productArray.map((product) => {
		product.isLock ? product.maxNum = product.num : product.maxNum = Math.ceil(ticketFloat / product.price) + product.minNum;
		return product;
	  })
	  this.setState({
		productArray: productArray,
		ticketFloat: ticketFloat,
		shouldCalc: false
	  })
	  // this.calcTotal();
	}

  }

  calcPrice = (priceArray, numArray) => {
	let res = 0;
	priceArray.forEach((currentValue, index) => {
	  // console.log(currentValue,numArray,index)
	  res += currentValue * numArray[index]

	})
	return res
  }
  calcNum = (numArray, maxNumArray, minNumArray, index) => {
	if (index === numArray.length) {
	  return false
	}
	numArray[index]++
	if (numArray[index] > maxNumArray[index]) {

	  numArray[index] = minNumArray[index]
	  numArray = this.calcNum(numArray, maxNumArray, minNumArray, ++index);
	}
	return numArray
  }
  calcTotal = () => {

	// console.log('calc')
	let {productArray, ticketFull, ticketMinus} = this.state, resultArray = [];
	// productArray = productArray.map((product) => {
	//     product.isLock ? product.maxNum = product.num : product.maxNum = Math.ceil(ticketFull / product.price);
	//     return product;
	// })
	let priceArray = productArray.map((product) => {
	  return product.price;
	})
	let minNumArray = productArray.map((product) => {
	  return product.minNum
	})
	let numArray = productArray.map((product) => {
	  return product.minNum
	})
	let maxNumArray = productArray.map((product) => {
	  return product.maxNum
	})
	// let ArrayIndex=0;
	let price = 0
	let setExit = true

	while (true) {

	  let arrayIndex = 0;
	  numArray = this.calcNum(numArray, maxNumArray, minNumArray, 0);
	  // console.log(numArray);
	  if (!numArray) {
		break;
	  }
	  price = this.calcPrice(priceArray, numArray);
	  // console.log(price);
	  if (price >= ticketFull) {
		let discount = (price - ticketMinus) / price * 10;
		resultArray.push({
		  // numArray: numArray,
		  priceListArray: priceArray.map((value, index) => {
			return {
			  price: value,
			  discountPrice: (value * (discount / 10)).toFixed(2),
			  num: numArray[index]
			}
		  }),
		  total: price,
		  discountTotal: price - ticketMinus,
		  discount: discount.toFixed(2)
		})
	  }
	}
	this.setState({
	  // shouldCalc: false,
	  // productArray: productArray,
	  resultArray: resultArray.sort((a, b) => {
		return a.total - b.total;
	  }),
	})

  }

  /**
   * 循环渲染
   * @param pid
   * @returns {*}
   */
  productDetailTemp(pid,product={}) {
    // console.log(pid,product)
	return (
	  <ProductDetail key={pid} callback={this.handleProductDetailChange} productData={product} id={pid}></ProductDetail>
	)
  }

  handleAddProductDetail = () => {
	let {pid, ProductDetailList} = this.state;
	pid++;
	ProductDetailList = ProductDetailList.concat(this.productDetailTemp(pid));
	this.setState({
	  pid: pid,
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
  // calcPrice = () => {
  // // console.log('start?')
  // let {productPrice, ticketFull, ticketMinus} = this.state
  // let totalPrice = 0, productNum = 0;
  // productPrice = parseFloat(productPrice);
  // // console.log(productPrice||ticketFull||ticketMinus)
  // if (!productPrice || !ticketFull || !ticketMinus) {
  //   return;
  // }
  // productNum = Math.ceil(ticketFull / productPrice)
  // totalPrice = productPrice * productNum - ticketMinus;
  // // console.log(productNum)
  // this.setState({
  //   productNum: productNum,
  //   totalPrice: totalPrice,
  // })
  // }
}

export default withRouter(CalcPriceTool)
