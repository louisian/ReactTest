import {Button,Input,Switch} from 'antd';
import React, {Component} from 'react';
import './productDetail.scss';
class ProductDetail extends Component{
  render(){
    return(
  		<div className={'product-detail__container'}>
		  <Switch className={'lock-switch'} checkedChildren="锁" unCheckedChildren="解"/>
		  <Input className={'price-input'} placeholder="单价" />
		  <Input className={'num-input'} placeholder="数量" />
		</div>
	);
  }
  
}
export default ProductDetail;