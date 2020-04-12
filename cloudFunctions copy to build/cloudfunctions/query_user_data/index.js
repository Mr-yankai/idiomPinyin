// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  // //const wxContext = cloud.getWXContext()

let udata = ""

  try {
    const queryResult = await db.collection("user_data").limit(50).orderBy("star", "desc").get();
    udata = queryResult.data;
  }
  catch(err){
    console.log(err);
  }

  return udata;
}