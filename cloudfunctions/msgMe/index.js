// 云函数入口文件
const cloud = require('wx-server-sdk')
const {
  WXMINIUser,
  WXMINIMessage
} = require('wx-js-utils');

const appId = 'wxf6a993c3ffcd50ea'; // 小程序 appId
const secret = '6186930557b6cd72f187e754a922f814'; // 小程序 secret
const template_id = '1UhfkwnTvuPj7v4C8F8rzXcI-1_Bqluz3co_gQxr5Io'; // 小程序模板消息模板 id
cloud.init();
const db=cloud.database();
const tasks = db.collection('Tasks');
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
  // 获取 access_token
  let wXMINIUser = new WXMINIUser({
    appId,
    secret
  });

  let access_token = await wXMINIUser.getAccessToken();

  const touser = wxContext.OPENID; // 小程序用户 openId，从用户端传过来，指明发送消息的用户
  const form_id = event.formId; // 小程序表单的 form_id，或者是小程序微信支付的 prepay_id
  let task= await tasks.doc(event.taskId).get();
//  return task;

  // 发送模板消息
  let wXMINIMessage = new WXMINIMessage();
  let result = await wXMINIMessage.sendMessage({
    access_token,
    touser,
    form_id,
    template_id,
    data: {
      keyword1: {
        value: task.data.title // keyword1 的值
      },
      keyword2: {
        value: task.data.yaoqiu // keyword2 的值
      }
    },
    page: 'pages/index/index' // 点击模板消息后，跳转的页面
  });
return result
}