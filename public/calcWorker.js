calcPrice = (priceArray, numArray) => {
  let res = 0;
  priceArray.forEach((currentValue, index) => {
	// console.log(currentValue,numArray,index)
	res += currentValue * numArray[index]

  })
  return res
}
calcNum = (numArray, maxNumArray, minNumArray, index) => {
  let res=[], isCarry = false,end=false;
  numArray.forEach((element, index) => {
	if (isCarry || index === 0) {
	  element++
	  isCarry = false;
	}
	if (element > maxNumArray[index]) {
	  if(index===numArray.length-1){
	    console.log('exit')
	   	end=true

	  }
	  element = minNumArray[index];
	  isCarry = true;
	}

	res[index] = element;

  })
  if(end){
    return false
  }
  return res;
}
sendMessage=(resultArray)=>{
  self.postMessage({
	// shouldCalc: false,
	// productArray: productArray,
	success: true,
	result: resultArray.sort((a, b) => {
	  return a.total - b.total;
	}),
  });
}
calcTotal = (productArray, ticketFull, ticketMinus) => {

  // console.log('calc')
  let resultArray = [];
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

	price = calcPrice(priceArray, numArray);
	// console.log(price);

	if (price >= ticketFull) {
	  let discount = (price - ticketMinus) / price * 10;
	  // numArray: numArray,
	  resultArray.push({
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
	numArray = calcNum(numArray, maxNumArray, minNumArray, 0);
	// console.log(numArray);
	if (!numArray) {
	  sendMessage(resultArray)
	  break;
	}

  }


  // _this.setState({
  // shouldCalc: false,
  // productArray: productArray,
  // resultArray: resultArray.sort((a, b) => {
  //   return a.total - b.total;
  // }),
  // })


}
self.onmessage = (event) => {
  // console.log('onMessage',event)
  let {productArray, ticketFull, ticketMinus} = event.data;
  calcTotal(productArray, ticketFull, ticketMinus);
}