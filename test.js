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

log(msg);
