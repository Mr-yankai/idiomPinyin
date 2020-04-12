// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => { //发布数据
  const wxContext = cloud.getWXContext();
  await db.collection("user_data").where({
    userid: wxContext.OPENID
  }).remove()

  await db.collection("user_data").add({
    data: {
      userid: wxContext.OPENID,//获取操作者_openid的方法
      img: event.img,
      nickname: event.nickname,
      star: event.star
    },
  })
}