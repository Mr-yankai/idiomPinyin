
export default class UserData {

    /**
     * 全局维一单例
     */
    public static instance: UserData;

    public static getInstance(): UserData{
        if(this.instance == null){
         this.instance = new UserData();
     }
     return this.instance;
    }

    public init(src): void {
        console.log(src);
    }

    /**
     * 获取玩家已完成的最大关卡数
     */
    public getUserMaxLevel(): number {
        let uMaxLevel = cc.sys.localStorage.getItem("uMaxLevel");
        if(!uMaxLevel){
            uMaxLevel = 0;
        }
        else{
            uMaxLevel = parseInt(uMaxLevel);
        }
        return uMaxLevel;       
    }

    /**
     * 玩家数据存储
     */
    public uDataLocalStorage(uMaxLevel: number): void {
        cc.sys.localStorage.setItem("uMaxLevel", uMaxLevel);
    }
}
