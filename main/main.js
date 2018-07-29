const datbase = require('./datbase.js');
const LoadPromotions = datbase.loadPromotions()
const LoadAllItems = datbase.loadAllItems()


module.exports = function printInventory(inputs) {
    var allItems = getInput(inputs)
    var priceAndAmount  = genetateData(allItems)
    const log = '***<没钱赚商店>购物清单***\n'+generateLogs(priceAndAmount.AllItem.list,false)+ `----------------------
挥泪赠送商品：\n`+generateLogs(priceAndAmount.Presents.list,true)+ `----------------------\n`+
        `总计：${priceAndAmount.AllItem.total.toFixed(2)}(元)\n`+
        `节省：${priceAndAmount.Presents.total.toFixed(2)}(元)\n`+ `**********************`
         console.log(log);
};

function getInput(inputs){
    let list = {};
    inputs.forEach(element=>{
        let arr = element.split('-');
        if(arr.length==1) pushItem(arr[0],1);
        else pushItem(arr[0],Number(arr[1]))
    })
    function pushItem(code,number){
        if(list[code]==undefined) list[code]=number ;
        else list[code]+=number;
    }
    return list
}

function genetateData(getInputs){
    let presents={list:[],total:0},
        allItem={list:[],total:0};
    for (const code in getInputs) {
        if (getInputs.hasOwnProperty(code)) {
            let Item = genetateItems(code);
            let total = (getInputs[code])*Item.price;
            let newItem={
                name:Item.name,
                number:getInputs[code],
                unit: Item.unit,
                price: Item.price,
            }
            if(LoadPromotions[0].barcodes.indexOf(code)!=-1&&getInputs[code]>1){
                let total = (getInputs[code]-1)*Item.price;
                presents.list.push({...newItem,number:1,total:newItem.price});
                presents.total+=newItem.price;
                allItem.list.push({...newItem,number:newItem.number,total:total})
                allItem.total+=total;
            }else{
                newItem['total']=total;
                allItem.list.push(newItem);
                allItem.total+=total;
            }
        }
    }
    return {Presents:presents,AllItem:allItem}
}

function generateLogs(items,presentJudge){
    let logString=""
    items.forEach(item=>{
        if(presentJudge) logString +=`名称：${item.name}，数量：${item.number}${item.unit}`+'\n' ;
        else logString +=`名称：${item.name}，数量：${item.number}${item.unit}，
        单价：${item.price.toFixed(2)}(元)，小计：${item.total.toFixed(2)}(元)`+'\n'
    })
    return logString
}

function genetateItems(code){
    return LoadAllItems.filter(ellen=>ellen.barcode==code)[0]
}
