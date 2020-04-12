
const {ccclass, property} = cc._decorator;

@ccclass
export default class Login extends cc.Component {

    // public static userInfo;
    // public static auth;

    //获取用户信息
    public static get_user_info(): object {
        let info = cc.sys.localStorage.getItem("userInfo");
        if(!info){
            info = JSON.parse(info);
        }
        else{
            info = {}
        }
        return info;
    }

    //获取用户授权状态
    public static get_auth_status(): number {
        let status = cc.sys.localStorage.getItem("auth");
        if(!status){
            return parseInt(status);
        }
        else{
            return 0;
        }
    }

    //新版本判断(保证用户使用版本为最新版本)  基础库 1.9.90 
    public static async updateManage(): Promise<boolean> {
        let self = this;
        return new Promise((resolve,reject)=>{
            if (typeof wx.getUpdateManager === 'function') {
                const updateManager = wx.getUpdateManager();
                updateManager.onCheckForUpdate(function (res) {
                    // 请求完新版本信息的回调
                    // 有新版本更新游戏
                    if (res.hasUpdate) {
                        wx.showModal({
                            title: '更新提示',
                            content: '有新版本正在下载中！',
                        });
                    } else {
                        //没有新版本 直接进行游戏
                        console.log("没有新版本 直接进入游戏")
                        self.init();
                        resolve(true)
                    }
                });
                updateManager.onUpdateReady(function () {
                    wx.showModal({
                        title: '更新提示',
                        content: '新版本已经准备好，是否重启应用？',
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                updateManager.applyUpdate();
                                //更新成功 进入游戏
                                self.init();
                                resolve(true)
                            }
                        }
                    })
                });
                updateManager.onUpdateFailed(function () {
                    wx.showModal({
                        title: '更新提示',
                        content: '新版本下载失败，请删除图标重新搜索或',
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                // 应用更新失败退出游戏
                                wx.exitMiniProgram({});
                            }
                        }
                    })
                });
            } else {
                wx.showModal({
                    title: '更新提示',
                    content: '为了游戏正常运行，建议您先升级至微信最高版本！',
                    showCancel: false,
                    success: function (res) {
                        if (res.confirm) {
                            // 微信版本过低退出游戏
                            wx.exitMiniProgram({});
                        }
                        resolve(false)
                    }
                })
            }
        })       
    }

    public static login(): void {
        
        let self = this;
        // let exportJson = {};
        let sysInfo = wx.getSystemInfoSync();
        //获取微信界面大小
        let width = sysInfo.screenWidth;
        let height = sysInfo.screenHeight;
        wx.getSetting({
           success (res) {
               console.log(res.authSetting);
               if (res.authSetting["scope.userInfo"]) {
                   console.log("用户已授权");
                   wx.getUserInfo({
                       withCredentials: false,    //必填？
                       success: function(res){
                           cc.sys.localStorage.setItem("userInfo",JSON.stringify(res.userInfo))
                       }
                   });
               }else {
                   console.log("用户未授权");
                   let button = wx.createUserInfoButton({
                       type: 'text',
                       text: '',
                       style: {
                           left: 0,
                           top: 0,
                           width: width,
                           height: height,
                           backgroundColor: '#00000000',//最后两位为透明度
                           color: '#ffffff',
                           fontSize: 20,
                           textAlign: "center",
                           lineHeight: height,
                       }
                   });
                   button.onTap((res) => {
                       if (res.userInfo) {
                           console.log("用户授权:", res);
                           cc.sys.localStorage.setItem("userInfo",JSON.stringify(res.userInfo));
                           cc.sys.localStorage.setItem("auth",1);
                           //此时可进行登录操作
                           button.destroy();
                       }else {
                           console.log("用户拒绝授权:", res);
                       }
                   });
               }
           }
        })
    }

    //初始化接口
    private static init(): void {
        let self = this;
        //初始化右上角分享
        wx.showShareMenu({
            withShareTicket: true
        });
        wx.onShareAppMessage(function () {
            return {
                title: "this share title",
                //转发显示图片的链接,图片长宽比是 5:4
                //网路图片=>'https://...'
                imageUrl: cc.url.raw(""),
            }
        });

        //开启监听 返回小程序启动参数（只有第一次激活生效）
        let launchOption = wx.getLaunchOptionsSync();
        console.log('首次开启 launchOption')
        console.log(launchOption);

        //开启监听小游戏回到前台的事件 (分享返回，下拉框返回)
        wx.onShow(function (dt) {
            if (launchOption.scene == "1044") {
                //判断是否从群分享链接进入  打开群排行
                //self.open.getComponent('openDomain').openCrowdRank(launchOption.shareTicket);
                //console.log("launchOption.scene == 1044 打开群排行")
            } else if (dt.scene == 1044) {
                //self.open.getComponent('openDomain').openCrowdRank(dt.shareTicket);
                //console.log("dt.scene == 1044 打开群排行")
            } else if (launchOption.scene == "1007") {
                //判断是否为分享页进入
                //console.log('分享好友开启' + launchOption.query.openid);
            } else if (dt.scene == 1007) {
                //console.log('分享好友开启' + dt.query.openid);
            }
        })        
    }
}
