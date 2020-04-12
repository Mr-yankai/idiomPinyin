// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  //const wxContext = cloud.getWXContext()

  let share_switch = "off";

  try {
    const queryResult = await db.collection("switch").get();
    share_switch = queryResult.data[0].share;
  }
  catch (err) {
    console.log(err);
  }

  return share_switch;
}