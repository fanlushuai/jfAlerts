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
// storages.remove("xxxxx");
// SelfService.pushxy();

// pushplus.push("", "## 设备ID \n- 12121,sdfsf,fdsf \n- 12121,sdfsf,fdsf ");
// pushplus.push(
//   "TEST",
//   "## 设备ID \n- 12121,sdfsf,fdsf \n- 12121,sdfsf,fdsf ",
//   "aa2534a208ad4782a0888d03139b846b",
//   "111"
// );

let newmsg = [];
for (let i = 0; i < 10; i++) {
  newmsg.push({
    time: "2024-08-12 21:01:25",
    change: "1",
    current: "" + random(1, 100),
    reason: "结算通过增加信誉积分",
  });
}
if (newmsg.length > 0) {
  let finalMsg = "## 事件：喇叭使用\n ### 设备ID：" + "31" + "\n";
  for (m of newmsg) {
    finalMsg +=
      "- " +
      m.time +
      " 当前积分：**" +
      m.current +
      "** 变化: **" +
      m.change +
      "** \n" +
      "原因：**" +
      m.reason +
      "** \n";
  }
  // 2024-08-12 21:01:25当前积分：95 变化:1原因：结算通过增加信誉积分
  //   pushplus.pushX("信誉积分变化", finalMsg);

  pushplus.push(
    "信誉积分变化",
    finalMsg,
    "aa2534a208ad4782a0888d03139b846b",
    "111"
  );
}
