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
