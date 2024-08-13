const { AutojsUtil } = require("./autojsUtil");
const { pushplus } = require("./msgPush");
const { SelfService } = require("./selfService");
const { WeiXin } = require("./weixin");

// pushplus.push("TEST","fsdfsdfsdfsdfsdfsdfdfsdfffffffffffffffffffffffffffffffff","aa2534a208ad4782a0888d03139b846b","111")
// SelfService.pushdj();
// SelfService.pushjf();

// SelfService.intoPropList();

// SelfService.pushdj();
// back();

// SelfService.intoReputationList();

// SelfService.pushxy();
// back();

// 查看一下不同的查找方式哪种方式最快

// let e = textMatches("信誉积分").findOne();
// log(e.getText());

// log("进入道具流水");
// let ele = text("道具流水").findOne();
// if (ele) {
//   AutojsUtil.clickEle(ele);
// }

// 添加上去，重试。如果实在找不到的话
storages.remove("xxxxx");
SelfService.pushxy();
