// 立即执行函数 https://segmentfault.com/a/1190000003902899  .前面加分号。因为前面如果是函数，就是认为，这个是个函数调用。而不是立即执行函数。防止污染变量。
(function () {
  let request = http.request;
  // 覆盖http关键函数request，其他http返回最终会调用这个函数
  http.request = function () {
    try {
      // 捕捉所有异常
      return request.apply(http, arguments);
    } catch (e) {
      // 出现异常返回null
      console.error("请求异常 %s", e);
      return null;
    }
  };
  http.__okhttp__.setTimeout(5000);
  http.__okhttp__.setMaxRetries(3);
})();

const pushplus = {
  push: function (title, content, token, webhookId) {
    log("推送内容 %s %s", title, content);
    if (token) {
      let r = http.postJson("https://www.pushplus.plus/send", {
        //   token: "aa2534a208ad4782a0888d03139b846b",
        token: token,
        title: title,
        content: content,
        // template: "txt",
        template: "markdown",
        channel: "webhook",
        webhook: webhookId,
      });
      if (r && r.statusCode == 200) {
        log(r.body.json());
        log("推送成功");
      } else {
        console.warn("推送失败");
      }
    } else {
      log("未配置推送token");
    }
  },
  pushX: function (title, content) {
    // https://pushplus.apifox.cn/api-107787114
    // https://www.pushplus.plus/send

    log("推送内容 %s %s", title, content);
    let s = storages.create("msgpush-autojsxxxxxxx");
    let token = s.get("pushToken");
    let webhookId = s.get("webhookId");
    this.push(title, content, token, webhookId);
  },
  // 截图转化为base64太大了。先放弃了
  // pushFailCapture: function (title, content, picUrl) {
  //   // https://pushplus.apifox.cn/api-107787114
  //   // https://www.pushplus.plus/send
  //   log("推送失败内容 %s %s", title, content)
  //   let s = storages.create("msgpush-autojsx123455");
  //   let token = s.get("pushToken");
  //   if (token) {

  //     function getHtmlContent(content, picUrl) {
  //       let template = '<!DOCTYPE html> <html> <head> <meta charset="utf-8"> </head> <body> <p><h2>#content#</h2></p> <img src="#image#"  style="max-width: 100%"> </body> </html>'
  //       return template.replace("#content#", content).replace("#image#", picUrl)
  //     }

  //     contentHtml = getHtmlContent(content, picUrl)

  //     log(contentHtml)

  //     let r = http.postJson("https://www.pushplus.plus/send", {
  //       //   token: "aa2534a208ad4782a0888d03139b846b",
  //       token: token,
  //       title: title,
  //       content: contentHtml,
  //       template: "html",
  //       channel: "webhook",
  //       webhook: "111",
  //     });
  //     if (r && r.statusCode == 200) {
  //       //   log(r.body.json());
  //       log("推送成功");
  //     } else {
  //       console.warn("推送失败");
  //     }
  //   } else {
  //     log("未配置推送token");
  //   }
  // },
};

// push("测22试", "发现问dff题");

module.exports = {
  pushplus,
};
