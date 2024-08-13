const { AutojsUtil } = require("./autojsUtil.js");
const { Config } = require("./config.js");
const { pushplus } = require("./msgPush.js");
const { SelfService } = require("./selfService.js");
const { WeiXin } = require("./weixin");

const Robot = {
  currentAccount: "",
  useWholeService: function () {
    log("完整服务是否存在");
    let ele = textMatches(/(使用完整服务|允许)/).findOne(5000);
    if (ele !== null) {
      log("存在完整服务");
      AutojsUtil.clickEle(ele);
      sleep(5000);
      if (ele.getText() == "使用完整服务") {
        log("进一步点击 允许");
        let ele = text("允许").findOne(5000);
        AutojsUtil.clickEle(ele);
      }
    }
  },

  start: function () {
    WeiXin.boot();
    log("开始任务");
    Robot.currentAccount = WeiXin.wo();

    log("当前微信账号 %s", Robot.currentAccount);

    log("进入自助服务");
    WeiXin.intoStarDir();
    WeiXin.searchByTag("自助服务");
    WeiXin.chooseFirst();
    let lastPushXyTime = 0;
    let lastPushDjTime = 0;
    while (1) {
      if (
        new Date().getTime() - lastPushXyTime >
        1000 * parseInt(Config.stepSizeSec)
      ) {
        SelfService.intoReputationList();
        SelfService.pushxy();
        lastPushXyTime = new Date().getTime();
        sleep(5 * 1000);
        back();
        sleep(5 * 1000);
      }

      if (
        new Date().getTime() - lastPushDjTime >
        1000 * parseInt(Config.stepSizeSec)
      ) {
        SelfService.intoPropList();
        SelfService.pushdj();
        lastPushDjTime = new Date().getTime();
        sleep(5 * 1000);
        back();
        sleep(5 * 1000);
      }
    }
  },
};

module.exports = {
  Robot,
};
