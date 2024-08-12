const { AutojsUtil } = require("./autojsUtil");


const SelfService={

    intoReputationList:function(){
        log("进入声誉积分")
        AutojsUtil.clickSelectorWithAutoRefresh(text("声誉积分"))
    },

    intoPropList:function(){
        log("进入道具流水")
        AutojsUtil.clickSelectorWithAutoRefresh(text("道具流水"))
    },

}

module.exports={SelfService};