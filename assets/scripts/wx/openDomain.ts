
const {ccclass, property} = cc._decorator;

@ccclass
export default class OpenDomain {

    public static postMessage(type: string, value: string): void {
        let openDataContext = wx.getOpenDataContext()
        openDataContext.postMessage({
            type: type,
            value: value,
        })
    }

    //隐藏排行榜（子域无法被自己关闭并且【可穿透】）
    public static hideRank(): void {
        this.postMessage('hide','');
    }

    //打开好友排行
    public static openFriendRank() {
        this.postMessage('friend','');
    }

    //开启世界排行
    public static openWorldRank(data) {
        this.postMessage('World', data);
    }

    //主动转发
    public static shareAppMessage(): void {
        wx.shareAppMessage({
            title: "share title",
            imageUrl: cc.url.raw(""),
            query: 'openid=110',
        });
    }
}
