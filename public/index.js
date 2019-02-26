var itemList =  document.getElementById('items'),
  itemTmp = ['<div id="itemInfo">',
    '<span class="item" id="foodId">{id}&nbsp;</span>',
    '<span class="item" id="foodName">{name}&nbsp;</span>',
    '<span class="item" id="foodPrice">{price}元&nbsp;</span>',
    '数量：<input id="foodCount"></input>',
    '</div>'
  ].join('')

var promotionList =  document.getElementById('promotions'),
  promotionTmp = ['<div class="promotionInfo">',
    '<span id="type">{type}&nbsp;</span>',
    '<span id="items">{items}</span>',
    '</div>'
  ].join('')

function render(data,divId,tmpName){
  var _dom = document.createElement( 'div' );
  _dom.innerHTML = tmpName.replace( /(\{.+?\})/g, function($1){ return data[ $1.slice( 1, $1.length-1 ) ] } );
  document.getElementById(divId).appendChild( _dom );
}

function renderAll(datas,divId,tmpName){
  var data;
  while( data = datas.shift() ){
    render(data,divId,tmpName);
  }
}

function fetchData(datas,divId,tmpName){
  renderAll(datas,divId,tmpName);
}

function getName(promotion, items) {
  let allitems= loadAllItems();
  let promotions = loadPromotions();
  promotions[0].items = "";

  for(let index = 0; index < promotions[1].items.length; index++){
    let entry = allitems.find((e) => {
      return promotions[1].items[index] === e.id;
    });
    if(entry){
      promotions[1].items[index] = entry.name;
    }
  }
  return promotions;
}

window.onload = function(){
  //获取商品信息
  var itemData = loadAllItems();
  //获取优惠信息
  var promotionData= loadPromotions();
  //将优惠信息的中的商品id替换为商品名称
  var promotionNew = getName(promotionData,itemData);
  //加载显示商品信息
  fetchData(itemData,"items",itemTmp);
  //加载显示优惠信息
  fetchData(promotionNew,"promotions",promotionTmp);
}

function  combineInput(id,count) {
  var input = id + " x " + count + "";
  return input;
}

function calculatePrice() {
  // 想办法调用`bestCharge`并且把返回的字符串
  // 显示在html页面的`message`中

  //获取显示在页面中的商品信息
  var itemSpan = document.getElementById("items").getElementsByTagName("span");
  //获取用户输入的商品数量
  var userInput = document.getElementById("items").getElementsByTagName("input");

  //对商品id和商品数量按输入格式进行格式化，输入格式如：["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
  let inputCollection = [];
  var itemData = loadAllItems();
  for(let index = 0; index < itemData.length; index++){
    let foodIndex = index * 3;
    let countIndex = index;
    let foodId = itemSpan[foodIndex].textContent.trim();
    let foodCount = userInput[countIndex].value;

    if(foodCount > 0){
      let input = combineInput(foodId,foodCount);
      inputCollection.push(input);
    }else{
      continue;
    }
  }

  //调用bestCharge
  let result = bestCharge(inputCollection);
  //在html页面的`message`中显示订单信息
  document.getElementById("message").innerHTML = result;
}

function Clear() {
  // 清除页面显示的信息
  document.getElementById("message").innerHTML="";
  //清除用户的选择
  var userInput = document.getElementById("items").getElementsByTagName("input");
  var itemData = loadAllItems();
  for(let index = 0; index < itemData.length; index++){
    userInput[index].value="";
  }
}
