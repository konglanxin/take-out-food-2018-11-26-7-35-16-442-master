function splitInput(selectedItems) {
  //根据“ x ”对输入进行分割
  let iteminfo = [];
  for (item in selectedItems) {
    let code = selectedItems[item].split(" x ")[0];
    let count = selectedItems[item].split(" x ")[1];
    iteminfo.push({code: code, count: count});
  }
  return iteminfo;
}

function computePrice(iteminfo, items) {
  //匹配商品id获取商品信息，计算商品价格
  let priceinfo = [];
  iteminfo.forEach((foods) => {
    let entry = items.find((item) => {
      return item.id === foods.code;
    });

    priceinfo.push({
      id:entry.id,name:entry.name,price:entry.price,
      count:foods.count,money:entry.price * foods.count
    });
  });
  return priceinfo;
}

function promotionOne(promotions, priceinfo) {
  //优惠1：满30减6
  let price = 0;
  let promotion_price = 0;
  for(item in priceinfo){
    price += priceinfo[item].money;
  }
  let promotioninfo = {};
  if(price >= 30){
    promotion_price = 6;
    promotioninfo = {type:promotions[0].type,promotion_price:promotion_price};
    return promotioninfo;
  }else{
    return "None";
  }
}

function promotionTwo(promotions, priceinfo) {
  //优惠2：指定商品半价
  let info = [];

  priceinfo.forEach((promotions_half) => {
    if(promotions[1].items.indexOf(promotions_half.id) > -1){
      info.push({
        name:promotions_half.name,half_price:promotions_half.price * promotions_half.count / 2
      })
    }
  })
  if(info.length != 0){
    let type = promotions[1].type + "(";
    let promotion_price = 0;
    for(let index = 0; index < info.length - 1; index++){
      type += info[index].name + "，";
      promotion_price += info[index].half_price;
    }
    type  += info[info.length - 1].name + ")";
    promotion_price += info[info.length - 1].half_price;
    let promotioninfo = {type:type,promotion_price:promotion_price};
    return promotioninfo;
  }else{
    return "None";
  }
}

function promotionNone(promotions, priceinfo) {
  //不使用优惠
  let promotioninfo = {type:"None",promotion_price:0};
  return promotioninfo;
}

function judgePromotion(promotions, priceinfo) {
  //根据商品信息和优惠信息判断使用哪种优惠，若两种优惠得到的价格一样，则使用第一种优惠：满30减6
  let promotioninfo = "";
  let promotioninfoOne = promotionOne(promotions, priceinfo);
  let promotioninfoTwo = promotionTwo(promotions, priceinfo);
  if (promotioninfoOne == "None" && promotioninfoTwo == "None") {
    promotioninfo = promotionNone(promotions, priceinfo);
  } else if(promotioninfoOne == "None"){
    promotioninfo = promotioninfoTwo;
  }else if(promotioninfoTwo == "None"){
    promotioninfo = promotioninfoOne;
  }else {
    promotioninfo = promotioninfoOne.promotion_price >= promotioninfoTwo.promotion_price ? promotioninfoOne : promotioninfoTwo;
  }
  return promotioninfo;
}

function getSummary(priceinfo, promotioinfo) {
  let total = 0;
  for (item in priceinfo) {
    total += priceinfo[item].money;
  }
  total = total - promotioinfo.promotion_price;

  let summaryinfo = {total:total};
  return summaryinfo;
}

function printResult(priceinfo, promotioninfo, summary) {
  let result = "============= 订餐明细 =============\n";
  for (item in priceinfo) {
    result += priceinfo[item].name + " x " + priceinfo[item].count + " = " + priceinfo[item].money + "元" + "\n";
  }
  result += "-----------------------------------\n";
  if(promotioninfo.type != "None"){
    result += "使用优惠:\n";
    result += promotioninfo.type + "，省" + promotioninfo.promotion_price + "元" + "\n";
    result += "-----------------------------------\n";
  }
  result += "总计：" + summary.total + "元" + "\n";
  result += "===================================";
  return result;
}

function bestCharge(selectedItems){
  //将用户输入进行分割，得到商品id和输入数量
  let iteminfo = splitInput(selectedItems);
  //获得全部商品信息
  let items = loadAllItems();
  //获得优惠信息
  let promotions = loadPromotions();
  //根据用户输入和商品信息计算商品总价
  let priceinfo = computePrice(iteminfo, items);
  //根据优惠信息和商品价格判断使用哪种优惠，得到优惠情况
  let promotioninfo = judgePromotion(promotions, priceinfo);
  //根据商品价格和优惠情况计算优惠后的信息
  let summary = getSummary(priceinfo, promotioninfo);
  //按照格式输出
  let result = printResult(priceinfo, promotioninfo, summary);
  return result;
}

