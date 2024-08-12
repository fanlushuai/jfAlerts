const Config = {
  deviceId: "",
  pushToken: "",
  stepSizeSec: "",
  webhookId: "",
  save: function (json) {
    if (json == null) {
      return;
    }
    let path = "/storage/emulated/0/mtz/config.json";
    if (!files.exists(path)) {
      log("创建配置文件");
      files.createWithDirs(path);
      files.write(path, JSON.stringify(json), (encoding = "utf-8"));
    } else {
      let content = files.read(path, (encoding = "utf-8"));
      if (content != "" || content != null) {
        jsonContent = JSON.parse(content);

        // 注意，这里需要添加
        if (
          jsonContent.pushToken != json.pushToken ||
          jsonContent.webhookId != json.webhookId ||
          jsonContent.deviceId != json.deviceId ||
          jsonContent.stepSizeSec != json.stepSizeSec
        ) {
          log("更新配置");
          files.write(path, JSON.stringify(json), (encoding = "utf-8"));
        }
      }
    }
  },
  read: function () {
    let path = "/storage/emulated/0/mtz/config.json";
    if (!files.exists(path)) {
      log("配置文件不存在");
      return;
    }

    log("读取文件配置");

    let content = files.read(path, (encoding = "utf-8"));
    if (content != "" || content != null) {
      jsonContent = JSON.parse(content);
      return jsonContent;
    }
  },
  setLSConfig2UI: function () {
    log("配置 本地->UI");

    let lS = this.localStorage();

    let deviceId = lS.get("deviceId", "");
    this.deviceId = deviceId;

    let pushToken = lS.get("pushToken", "");
    this.pushToken = pushToken;
    let webhookId = lS.get("webhookId", "");
    this.webhookId = webhookId;

    let stepSizeSec = lS.get("stepSizeSec", "");
    this.stepSizeSec = stepSizeSec;

    ui.deviceId.setText(deviceId + "");
    ui.pushToken.setText(pushToken + "");
    ui.webhookId.setText(webhookId + "");
    ui.stepSizeSec.setText(stepSizeSec + "");
  },
  setUI2LSConfig: function () {
    log("配置 UI->本地");
    let lS = this.localStorage();

    let deviceId = ui.deviceId.getText();
    if (deviceId == null) {
      deviceId = "";
    }
    this.deviceId = deviceId;
    log(deviceId);
    lS.put("deviceId", deviceId + "");

    let pushToken = ui.pushToken.getText();
    if (pushToken == null) {
      pushToken = "";
    }
    this.pushToken = pushToken;
    log(pushToken);
    lS.put("pushToken", pushToken + "");

    let webhookId = ui.webhookId.getText();
    if (webhookId == null) {
      webhookId = "";
    }
    this.webhookId = webhookId;
    log(webhookId);
    lS.put("webhookId", webhookId + "");

    let stepSizeSec = ui.stepSizeSec.getText();
    if (stepSizeSec == null) {
      stepSizeSec = "";
    }
    this.stepSizeSec = stepSizeSec;
    log(stepSizeSec);
    lS.put("stepSizeSec", stepSizeSec + "");

    let s = storages.create("msgpush-autojsxxxxxxx");
    s.put("pushToken", pushToken + "");
    s.put("webhookId", webhookId + "");
  },
  loadConfig: function () {
    log("配置 本地->内存");

    let lS = this.localStorage();

    let deviceId = lS.get("deviceId", "");
    this.deviceId = deviceId;
    log("设备ID" + deviceId);

    let webhookId = lS.get("webhookId", "");
    this.webhookId = webhookId;
    log("webhookId" + webhookId);

    let pushToken = lS.get("pushToken", "");
    this.pushToken = pushToken;
    log("pushToken" + pushToken);

    let stepSizeSec = lS.get("stepSizeSec", "");
    this.stepSizeSec = stepSizeSec;
    log("stepSizeSec" + stepSizeSec);
  },
  lsByFile: function () {
    let json = this.read();
    return {
      get: function (key, defalut) {
        let value = null;

        if (json == null) {
          log("未读取到配置");
          return defalut;
        }
        let script =
          "value= json." +
          key +
          " == null ? " +
          (defalut == null || defalut == "" ? '""' : defalut) +
          " : json." +
          key +
          ";";

        log(script);
        eval(script);
        return value;
      },
      put: function (key, value) {
        if (json == null) {
          json = {};
        }

        let scritp = "json." + key + ' ="' + value + '";';
        eval(scritp);
        Config.save(json);
      },
    };
  },
  localStorage: function () {
    return this.lsByFile();
  },
};

module.exports = {
  Config,
};
