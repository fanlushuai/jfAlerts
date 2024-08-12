const DailyStorage = {
  currentAccount: "",
  yesterdayGlobalStorage: function () {
    var today = new Date();
    var yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000));
    return storages.create(
      yesterday.getMonth() +
      "" +
      yesterday.getDate() +
      "ds" +
      "global"
    );
  },
  localGlobalStorage: function () {
    return storages.create(
      new Date().getMonth() +
      "" +
      new Date().getDate() +
      "ds" +
      "global"
    );
  },
  localStorage: function () {
    // 每个账号，每天一个存储
    return storages.create(
      new Date().getMonth() +
      "" +
      new Date().getDate() +
      "ds" +
      DailyStorage.currentAccount
    );
  },
  localStorage2: function () {
    // 每个账号，每天一个存储
    return storages.create("ds" + DailyStorage.currentAccount);
  },
  setSignToday: function () {
    log("设置 已经签到 标记");
    this.localStorage().put("sign", true);
  },
  yetSignToday: function () {
    return this.localStorage().get("sign", false);
  },
  setReportYesterday: function () {
    log("设置 已经报告 标记");
    this.localGlobalStorage().put("hasReport", true);
  },
  yetReportYesterday: function () {
    return this.localGlobalStorage().get("hasReport", false);
  },
  // setWithdrawToday: function () {
  //   log("设置 已经提现 标记");
  //   this.localStorage().put("Withdraw", true);
  // },
  // yetWithdrawToday: function () {
  //   return this.localStorage().get("Withdraw", false);
  // },
  setTransferScoreToday: function () {
    log("设置 转移积分 标记");
    this.localStorage().put("TransferScore", true);
  },
  yetTransferScoreToday: function () {
    // 6点之前，全部返回，已经转移了。
    let now = new Date();
    let sixHours = 6 * 1000 * 60 * 60;
    let nowHours =
      now.getHours() * 1000 * 60 * 60 + now.getMinutes() * 1000 * 60;
    if (nowHours < sixHours) {
      // log("6点之前不转移");
      return true;
    }
    return this.localStorage().get("TransferScore", false);
  },

  setReadNextTime: function (futureTime) {
    // 剩余54分钟
    // 剩余1小时15分钟
    log("设置，下次阅读时间%s", futureTime);
    this.localStorage2().put("readNextTime", futureTime);
  },
  canReadNow: function () {
    let readNextTime = this.localStorage2().get("readNextTime");
    if (readNextTime) {
      // todo 格式化一下数据。判断一下时间
      if (new Date().getTime() > readNextTime) {
        // log("过了限制时间");
        return true;
      } else {
        // log("还没有过限制时间");
        return false;
      }
    }

    // log("没有发现限制时间");
    return true;
  },
  canDoAccounts: function (accountArr) {
    log("开始寻找可执行动作账号");
    let canA = [];
    while (1) {
      for (let accont of accountArr) {
        DailyStorage.currentAccount = accont;
        if (
          !DailyStorage.yetSignToday() ||
          DailyStorage.canReadNow() ||
          !DailyStorage.yetTransferScoreToday()
        ) {
          // 没有签到。可以读。没有转移积分
          canA.push(accont);
        }
      }

      if (canA.length > 0) {
        break;
      }

      sleep(2000);
    }

    log("找到有效动作账号： %s", canA);

    return canA;
  },
};

module.exports = {
  DailyStorage,
};
