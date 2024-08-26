const { AutojsUtil } = require("./autojsUtil.js");
const { Config } = require("./config.js");
const { SelfService } = require("./selfService.js");
const { WeiXin } = require("./weixin");

let beginRuntime = new Date().getTime();

const Robot = {
  currentAccount: "",

  start: function () {
    beginRuntime = new Date().getTime();
    WeiXin.boot();
    log("开始任务");

    // 判断当前处于的位置。
    if (desc("【注销】").findOne(3000)) {
      log("发现处于，自助服务页面");
      sleep(1500);
    } else {
      // Robot.currentAccount = WeiXin.wo();
      log("重新加载到，自助服务页面");
      // log("当前微信账号 %s", Robot.currentAccount);
      WeiXin.wo();
      log("进入自助服务");
      sleep(2 * 1000);
      WeiXin.intoStarDir();
      sleep(3 * 1000);

      text("链接").waitFor();
      // WeiXin.searchByTag("自助服务");
      // WeiXin.chooseFirst();
      log("点击自助服务");
      AutojsUtil.clickEle(text("自助服务").findOne());
      sleep(15 * 1000);
    }

    let lastPushXyTime = 0;
    let lastPushDjTime = 0;

    // let refreshTokenTime = new Date().getTime();
    while (1) {
      // if (new Date().getTime() - refreshTokenTime > 1000 * 120) {
      //   log("刷新token");
      //   sleep(3 * 1000);
      //   back();
      //   sleep(3 * 1000);
      //   AutojsUtil.clickEle(text("自助服务").findOne());
      //   sleep(15 * 1000);
      //   refreshTokenTime = new Date().getTime();
      // }

      if (
        new Date().getTime() - lastPushXyTime >
        1000 * parseInt(Config.stepSizeSec)
      ) {
        SelfService.intoReputationList();
        let r = SelfService.pushxy();
        lastPushXyTime = new Date().getTime();
        sleep(5 * 1000);
        back();

        sleep(5 * 1000);
        if (r && r == 9) {
          SelfService.reGetAcess();
          sleep(2 * 1000);
        }
      }

      if (
        new Date().getTime() - lastPushDjTime >
        1000 * parseInt(Config.stepSizeSec)
      ) {
        SelfService.intoPropList();
        let r = SelfService.pushdj();
        lastPushDjTime = new Date().getTime();
        sleep(5 * 1000);
        back();
        sleep(5 * 1000);
        if (r && r == 9) {
          SelfService.reGetAcess();
          sleep(2 * 1000);
        }
      }

      if (
        new Date().getTime() - beginRuntime >
        Config.rebootWxMinute * 60 * 1000
      ) {
        log("重启服务");
        AutojsUtil.reloadApp("微信");
        log("重新进入");
        this.start();
      }
    }
  },
};

module.exports = {
  Robot,
};
