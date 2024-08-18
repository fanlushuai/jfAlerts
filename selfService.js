const { AutojsUtil } = require("./autojsUtil");
const { Config } = require("./config");
const { pushplus } = require("./msgPush");

let s = storages.create("xxxxx");
let timeoutTimes = 0;
let timeoutTimesLimit = 2;

const SelfService = {
  intoReputationList: function () {
    log("进入信誉积分");

    let timeout = 30 * 1000;
    let hasFound = false;
    while (1) {
      let time = 0;
      if (hasFound) {
        break;
      }
      while (1) {
        if (text("信誉积分").exists()) {
          hasFound = true;
          break;
        }
        sleep(800);
        time = time + 800;
        log(time);
        if (time > timeout) {
          log("超时刷新");

          id("com.tencent.mm:id/coz").findOne().click();
          sleep(1.5 * 1000);
          id("com.tencent.mm:id/h5n").findOne().click();
          sleep(1.5 * 1000);
          break;
        }
      }
    }

    log("找到信誉积分");

    let e = text("信誉积分").findOne();
    log("点击");
    AutojsUtil.clickEle(e);
    if (this.tryLogin()) {
      this.intoReputationList();
    }
  },
  tryLogin: function () {
    let reloginAlert = text("未登录，请先登录").findOne(8000);
    if (reloginAlert) {
      log("重新登录");
      log("点击确定");

      AutojsUtil.clickEle(text("确定").findOne());

      sleep(800);
      AutojsUtil.clickEle(desc("【登录】").findOne());
      sleep(2 * 1000);
      AutojsUtil.clickEle(text("微信用户登录").findOne());
      sleep(5 * 1000);
      log("登录操作完成");
      return true;
    }
  },
  reGetAcess: function () {
    log("重新获取access");
    desc("【切换大区】").findOne().click();
    sleep(500);
    idMatches("channelContentId").findOne().click();
    sleep(500);
    className("CheckedTextView").text("微信-安卓(android)").findOne().click();
    sleep(500);
    idMatches("areaContentId").findOne().click();
    sleep(500);
    className("CheckedTextView").text("微信2区-国士无双").findOne().click();
    // let loginSure = idMatches(
    //   /(.*mm_alert_cancel_btn|.*mm_alert_ok_btn)/
    // ).findOne();
    // AutojsUtil.clickEle(loginSure);

    while (1) {
      if (
        idMatches(/(.*mm_alert_cancel_btn|.*mm_alert_ok_btn|.*ffp)/).exists()
      ) {
        log("发现弹窗");

        sleep(1000);
        AutojsUtil.clickEle(text("确定").findOne());
        break;
      }
      sleep(500);
    }

    className("android.view.View")
      .clickable()
      .desc("javascript:;")
      .depth("21")
      .findOne()
      .click();
    sleep(500);
    log("登录");
    desc("【登录】").findOne().click();
    sleep(500);
    text("微信用户登录").findOne().click();
    sleep(2000);
  },
  pushxy: function () {
    sleep(1000 * 4);
    log("等待页面加载");

    let loadTimeout = 30 * 1000;
    let loadTime = 0;
    while (1) {
      if (text("加载中...").exists()) {
        sleep(1000 * 1);
        loadTime += 1000;
        if (loadTime > loadTimeout) {
          log("加载超时30s");
          timeoutTimes++;
          if (timeoutTimes >= timeoutTimesLimit) {
            timeoutTimes = -7; //第一次提醒之后，多次之后再提醒。10次以后。
            pushplus.pushX(
              "授权已掉" + Config.deviceId,
              "## 多次加载超时30s（授权已掉？）\n ## 设备ID: " + Config.deviceId
            );

            return 9;
          }
          return;
        }
      } else {
        timeoutTimes = 0;
        break;
      }

      if (text("确定").exists()) {
        log("发现乱码弹窗");
        AutojsUtil.clickEle(text("确定").findOne());
        sleep(1000 * 2);
      }
    }

    text("时间").waitFor();
    sleep(2 * 1000);

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
      //   log(v.getText());

      if (i == 0) {
        msg += v.getText() + "#";
      }
      if (i == 1) {
        msg += v.getText() + "#";
      }
      if (i == 2) {
        msg += v.getText() + "#";
      }
      if (i == 3) {
        msg += v.getText() + "#";
      }

      i++;
      if (i == 4) {
        msg += "---";
        i = 0;
      }
    }

    let arr = msg.split("---");

    let targetArr = [];
    for (a of arr) {
      if (a.indexOf("扣") == -1) {
        continue;
      }

      let brr = a.split("#");
      targetArr.push({
        time: brr[0],
        change: brr[1],
        current: brr[2],
        reason: brr[3],
      });
    }

    let lastTargetArr = s.get("lastTargetArr", []);

    let newmsg = [];
    for (t of targetArr) {
      let newOne = true;
      for (lt of lastTargetArr) {
        if (t.time == lt.time) {
          newOne = false;
        }
      }
      if (newOne) {
        log("发现新记录 %j", t);
        newmsg.push(t);
      }
    }

    s.put("lastTargetArr", targetArr);

    if (newmsg.length > 0) {
      let finalMsg = "## 事件：扣分 \n ### 设备ID：" + Config.deviceId + "\n";
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

      pushplus.pushX("信誉积分变化", finalMsg);
    } else {
      log("没有扣分变化");
    }
  },
  intoPropList: function () {
    log("进入道具流水");
    let timeout = 30 * 1000;
    let hasFound = false;
    while (1) {
      let time = 0;
      if (hasFound) {
        break;
      }
      while (1) {
        if (text("道具流水").exists()) {
          hasFound = true;
          break;
        }
        sleep(800);
        time = time + 800;
        log(time);
        if (time > timeout) {
          log("超时刷新");

          id("com.tencent.mm:id/coz").findOne().click();
          sleep(1.5 * 1000);
          id("com.tencent.mm:id/h5n").findOne().click();
          sleep(1.5 * 1000);
          break;
        }
      }
    }
    log("找到道具流水");

    let e = text("道具流水").findOne();
    log("点击 道具流水");
    AutojsUtil.clickEle(e);
    if (this.tryLogin()) {
      this.intoPropList();
    }
  },
  pushdj: function () {
    sleep(1000 * 4);
    log("等待页面加载");

    let loadTimeout = 30 * 1000;
    let loadTime = 0;
    while (1) {
      if (text("加载中...").exists()) {
        sleep(1000 * 1);
        loadTime += 1000;
        if (loadTime > loadTimeout) {
          log("加载超时30s");
          timeoutTimes++;
          if (timeoutTimes >= timeoutTimesLimit) {
            timeoutTimes = -7; //第一次提醒之后，多次之后再提醒。10次以后。
            pushplus.pushX(
              "授权已掉" + Config.deviceId,
              "## 多次加载超时30s（授权已掉？）\n ## 设备ID: " + Config.deviceId
            );
            return 9;
          }
          return;
        }
      } else {
        timeoutTimes = 0;
        break;
      }

      if (text("确定").exists()) {
        log("发现乱码弹窗");
        AutojsUtil.clickEle(text("确定").findOne());
        sleep(1000 * 2);
      }
    }

    text("时间").waitFor();
    sleep(2 * 1000);
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
      //   log(v.getText());

      if (i == 0) {
        msg += v.getText() + "#";
      }
      if (i == 1) {
        msg += v.getText() + "#";
      }
      if (i == 2) {
        msg += v.getText() + "#";
      }
      if (i == 3) {
        msg += v.getText() + "#";
      }

      i++;
      if (i == 4) {
        msg += v.getText();

        msg += "---";
        i = 0;
      }
    }

    let arr = msg.split("---");

    let targetArr = [];
    for (a of arr) {
      if (a.indexOf("喇叭") == -1) {
        continue;
      }

      let brr = a.split("#");
      targetArr.push({
        time: brr[0],
        thing: brr[1],
        change: brr[2],
        current: brr[3],
        reason: brr[4],
      });
    }

    let lastTargetArr = s.get("lastTargetArr2", []);

    let newmsg = [];
    for (t of targetArr) {
      let newOne = true;
      for (lt of lastTargetArr) {
        if (t.time == lt.time) {
          newOne = false;
        }
      }
      if (newOne) {
        log("发现新记录 %j", t);
        newmsg.push(t);
      }
    }

    s.put("lastTargetArr2", targetArr);

    if (newmsg.length > 0) {
      let finalMsg =
        "## 事件：喇叭使用 \n ### 设备ID：" + Config.deviceId + "\n";
      for (m of newmsg) {
        finalMsg +=
          "- " +
          m.time +
          " **" +
          m.thing +
          "** " +
          (m.reason == "物品使用" ? "使用" : m.reason) +
          " **" +
          m.change +
          "** 剩余 **" +
          m.current +
          "** \n";
      }

      pushplus.pushX("喇叭使用提醒", finalMsg);
    } else {
      log("没有喇叭变化");
    }
  },
};

module.exports = { SelfService };
