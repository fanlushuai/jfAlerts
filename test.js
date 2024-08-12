const { AutojsUtil } = require("./autojsUtil");
const { WeiXin } = require("./weixin");

// WeiXin.back2Settings()

// // let ok = AutojsUtil.testAndBack(
// //     function () {
// //       // return id("title").text("设置").findOnce() != null

// //       // return text("发现").findOnce() != null
// //       // return id("ouv").findOnce() != null
// //       sleep(800);
// let  ok=!desc("返回").visibleToUser(true).exists() && !text("个人信息与权限").visibleToUser(true).exists()
// return ok
//     },
//     10,
//     WeiXin.backTab
//   );

// log(!desc("返回").visibleToUser(true).exists() && !text("个人信息与权限").visibleToUser(true).exists())
// // log(text("收藏").visibleToUser(true).findOnce() != null)
// log()

let Config = {};
Config.disableAccounts = "1#3";
let accArr = ["aaa", "bbb", "ccc", "ddd"];

let willDisableAccs = [];

// 排除禁闭账号
if (Config.disableAccounts != null && Config.disableAccounts != "") {
  disableAccs = Config.disableAccounts.split("#");

  for (let i = 0; i < accArr.length; i++) {
    let currentLocation = i + 1;
    log(currentLocation)
    for (a of disableAccs) {
      if (currentLocation + "" == a.trim()) {
        willDisableAccs.push(accArr[i]);
      }
    }
  }
}

let ne = accArr.filter((a) => !willDisableAccs.some((b) => a === b));
log(ne);
