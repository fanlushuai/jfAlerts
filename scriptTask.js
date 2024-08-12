const { Robot } = require("./robot");
const { AutojsUtil } = require("./autojsUtil");
const { Config } = require("./config");

AutojsUtil.keepScreen();

AutojsUtil.configConsole("积分助手");

Config.loadConfig();

AutojsUtil.onChildStop(() => {
  log("scriptTask停止所有子线程")
  threads.shutDownAll()

  engines.myEngine().forceStop();
})

AutojsUtil.AddFloatContrlButton(function () {
  Robot.start()
});



