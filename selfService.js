const { AutojsUtil } = require("./autojsUtil");
const { pushplus } = require("./msgPush");

const oldData = {};

const SelfService = {
  intoReputationList: function () {
    log("进入信誉积分");
    while (1) {
      if (text("信誉积分").exists()) {
        break;
      }
      sleep(800);
    }
    log("找到信誉积分");

    let e = text("信誉积分").findOne();
    log("点击");
    AutojsUtil.clickEle(e);
    sleep(1 * 1000);
  },
  pushxy: function () {
    sleep(1000 * 4);
    log("等待页面加载");
    while (1) {
      if (text("加载中...").exists()) {
        sleep(1000 * 1);
      } else {
        break;
      }
    }
    log("开始抓取内容");
    let vs = className("android.view.View").find();

    let msg = "";
    let i = 0;
    for (v of vs) {
      if (
        v.getText() == "时间" ||
        v.getText() == "变化量" ||
        v.getText() == "当前积分" ||
        v.getText() == "原因" ||
        v.getText() == "" ||
        v.getText() == null ||
        v.getText() == "点击加载更多" ||
        v.getText() == "已加载全部"
      ) {
        continue;
      }
      log(v.getText());

      if (i == 0) {
        msg += "\r";
      }
      if (i == 0) {
        msg += v.getText() + " 变化 ";
      }
      if (i == 1) {
        msg += v.getText() + " 分 " + "\r";
      }
      if (i == 2) {
        msg += "    总积分：" + v.getText();
      }
      if (i == 3) {
        msg += " 原因：" + v.getText();
      }

      i++;
      if (i == 4) {
        i = 0;
      }
    }

    log(msg);
    pushplus.pushX("积分变化", msg);
  },
  intoPropList: function () {
    log("进入道具流水");
    while (1) {
      if (text("道具流水").exists()) {
        break;
      }
      sleep(800);
    }
    log("找到道具流水");

    let e = text("道具流水").findOne();
    log("点击 道具流水");
    AutojsUtil.clickEle(e);
    sleep(1 * 1000);
  },
  pushdj: function () {
    sleep(1000 * 4);
    log("等待页面加载");
    while (1) {
      if (text("加载中...").exists()) {
        sleep(1000 * 1);
      } else {
        break;
      }
    }
    log("开始抓取内容");
    let vs = className("android.view.View").find();

    let msg = "";
    let i = 0;
    for (v of vs) {
      if (
        v.getText() == "时间" ||
        v.getText() == "物品" ||
        v.getText() == "变化量" ||
        v.getText() == "剩余" ||
        v.getText() == "原因" ||
        v.getText() == "" ||
        v.getText() == null ||
        v.getText() == "点击加载更多" ||
        v.getText() == "已加载全部"
      ) {
        continue;
      }
      log(v.getText());

      if (i == 0) {
        msg += "\r";
      }
      if (i == 0) {
        msg += v.getText() + "  ";
      }
      if (i == 1) {
        msg += "物品- " + v.getText() + " ";
      }
      if (i == 2) {
        msg += v.getText() + " " + "\r";
      }
      if (i == 3) {
        msg += "    剩余：" + v.getText();
      }
      if (i == 4) {
        msg += " 原因：" + v.getText();
      }

      i++;
      if (i == 5) {
        i = 0;
      }
    }

    log(msg);
    pushplus.pushX("积分变化", msg);
  },
};

module.exports = { SelfService };
