const { AutojsUtil } = require("./autojsUtil");

const WeiXin = {
  name: "微信",
  boot: function () {
    log("打开微信");
    app.launchApp("微信");
  },
  wo: function () {
    AutojsUtil.clickSelectorWithAutoRefresh(text("我"), "我", 10, this.name);
    // let ele = AutojsUtil.getEleBySelectorWithAutoRefresh(
    //   id("ouv"),
    //   "微信号",
    //   10,
    //   this.name
    // );
    // return ele.getText().replace("微信号：", "");
    return "";
  },
  intoStarDir: function () {
    AutojsUtil.clickSelectorWithAutoRefresh(
      text("收藏"),
      "收藏",
      10,
      this.name
    );
  },
  searchByTag: function (tagName) {
    let tName = tagName || "";
    AutojsUtil.clickSelectorWithAutoRefresh(id("du4"), "小三角", 10, this.name);
    sleep(1000);
    AutojsUtil.clickSelectorWithAutoRefresh(
      id("ci2").text(tName),
      tName,
      10,
      this.name
    );
    sleep(1500);
  },
  chooseFirst: function () {
    let dateEle = AutojsUtil.getEleBySelectorWithAutoRefresh(
      id("dwo"),
      "日期",
      10,
      this.name
    );
    let b = dateEle.bounds();

    press(device.width / 3, b.top - 100, 2);

    sleep(1500);
  },
  longPressPic: function (x, y) {
    // todo
    // 长安设备的，
    // press(device.width / 2, device.height / 2, 1000)
    sleep(1000); //等待那个滑动特效结束
    log("长按 %s,%s", x, y);
    press(x, y, 1500); //600以上，为长按。
    sleep(1.5 * 1000); //等待那个滑动特效结束
  },
  jumpByqrCode: function (func) {
    // fix 卡住
    sleep(1.5 * 1000);
    let ele;
    while (1) {
      ele = AutojsUtil.getEleBySelectorWithAutoRefresh(
        text("识别图中的二维码"),
        "识别图中的二维码",
        10,
        this.name,
        func
      );

      if (ele) {
        break;
      }
    }

    let b = ele.bounds();
    log("点 识别图中的二维码");
    press(b.centerX(), b.centerY(), 100);
  },

  settings: function () {
    AutojsUtil.clickSelectorWithAutoRefresh(
      text("设置"),
      "设置",
      10,
      this.name
    );
  },
  cilckChangeAccount: function () {
    // AutojsUtil.pageDownBySwipe()
    sleep(1000);
    AutojsUtil.pageDownBySwipe();
    sleep(1000);
    AutojsUtil.clickSelectorWithAutoRefresh(
      text("切换账号"),
      "切换账号",
      10,
      this.name
    );
    sleep(500);

    // 切换到哪个
  },
  getCurrentAccount: function () {
    let e = AutojsUtil.getEleBySelectorWithAutoRefresh(
      id("co1"),
      "当前账号",
      10,
      this.name,
      () => {
        AutojsUtil.refreshUI("微信");
        AutojsUtil.pageDownBySwipe();
      }
    );

    let accountEle = e.parent().parent().findOne(id("dy"));
    // log(accountEle)
    if (accountEle) {
      return accountEle.text();
    }
  },
  getAllAccount: function () {
    // 账号可能很多，还需要滚动屏幕
    log("开始获取所有账号");
    sleep(1000);
    let acArr = [];
    while (1) {
      AutojsUtil.pageDownBySwipe();
      sleep(1500);

      AutojsUtil.refreshUI("微信");
      sleep(2000);

      let allAccountEles = id("dy").find();

      for (let aE of allAccountEles) {
        acArr.push(aE.text());
      }

      if (acArr.length >= 1) {
        // 至少有一个账号，才说明获取到了
        break;
      }
    }

    log("所有账号：%s", acArr);

    return acArr;
  },
  changeAccTo: function (name) {
    // fix 点击闪退
    AutojsUtil.clickEle(text(name).findOne());
    // 如果点击的就是当前账。。不会的，前面拦截了

    sleep(1000);

    // 可能出现登陆失效
    let logniExpired = AutojsUtil.waitFor(text("登录"), 30);
    if (logniExpired) {
      log("登陆失效 %s", name);
      sleep(1000);
      back(); //后退一下
      sleep(1000);
      return false;
    }

    // 找通讯录的方式，不靠谱。在没有登陆界面，依然可以看到
    AutojsUtil.waitFor(id("icon_tv").text("通讯录").visibleToUser(true), 30);

    let ele = text("轻触头像以切换账号").findOne(2000);
    if (ele != null) {
      log("没有登陆成功");
      return false;
    }

    log("到达首页，切换成功");

    sleep(2000);
    return true;
  },
  backTab: function () {
    // AutojsUtil.clickEle(id("actionbar_up_indicator_btn"))
    log("左上返回");
    AutojsUtil.clickEle(desc("返回").findOne().parent());
    sleep(1000);
  },
  back2Settings: function () {
    let ok = AutojsUtil.testAndBack(
      function () {
        // return id("title").text("设置").findOnce() != null

        // return text("发现").findOnce() != null
        // return id("ouv").findOnce() != null
        sleep(800);
        let ok =
          !desc("返回").visibleToUser(true).exists() &&
          !text("个人信息与权限").visibleToUser(true).exists();
        return ok;
        // return !desc("返回").visibleToUser(true).exists() || text("收藏").visibleToUser(true).findOnce() != null;
      },
      10,
      WeiXin.backTab
    );

    sleep(1000);

    if (!ok) {
      log("刷新再试试");
      AutojsUtil.refreshUI("微信");

      AutojsUtil.testAndBack(
        function () {
          // return id("title").text("设置").findOnce() != null

          // return text("发现").findOnce() != null
          // return id("ouv").findOnce() != null
          sleep(800);
          return !desc("返回").exists();
        },
        3,
        function () {
          AutojsUtil.refreshUI("微信");

          WeiXin.backTab();
        }
      );
    }
  },
  refreshWeb: function () {
    log("刷新网页");
    AutojsUtil.clickSelectorWithAutoRefresh(id("coz"), "。。。", 10, this.name);
    sleep(1.5 * 1000);
    AutojsUtil.clickSelectorWithAutoRefresh(
      id("obc").text("刷新"),
      "刷新",
      10,
      this.name
    );

    sleep(4 * 1000);

    AutojsUtil.refreshUI("微信");
    sleep(1 * 1000);
  },
};

module.exports = {
  WeiXin,
};
