// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const tasks = db.collection('Tasks');
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  console.log("云函数uptata:"+event.taskId)
  let updatetask = await tasks.doc(event.taskId).update({
    // data 传入需要局部更新的数据
    data: {
      status: "end"
    }
  });
 return updatetask;

}