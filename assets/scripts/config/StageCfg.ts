import CloudFunc from "../wx/cloudFunc"

export default class StageCfg {

    /**
     * 全局维一单例
     */
    public static instance: StageCfg;

    public static getInstance(): StageCfg{
        if(this.instance == null){
         this.instance = new StageCfg();
     }
     return this.instance;
    }

    public async init(src): Promise<any> {
        await this.getStageData();
        console.log(src);
    }

    /**
     * 获取所有关卡配置数据
     */
    public async getStageData(): Promise<Array<any>> {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.stageData = await CloudFunc.instance.getStageCfg();
        }
        return this.stageData;
    }

    /**
     * 关卡配置数据
     */
    public stageData: any = {
        0: {
            curectAnswer: "才高八斗",
            answerPinyin: ["cai","gao","ba","dou"],
            options: ["c","ai","g","ao","b","a","d","ou"],
            tipsPinyinCnt: 6,
            tipsChinese: [],
            description: "形容人文才高超。出自南朝·宋·无名氏《释常谈·斗之才》"
        },

        1: {
            curectAnswer: "天高地厚",
            answerPinyin: ["tian","gao","di","hou"],
            options: ["t","ian","g","ao","d","i","h","ou"],
            tipsPinyinCnt: 3,
            tipsChinese: [],
            description: "原形容天地的广大，后形容恩德极深厚。也比喻事情的艰巨、严重，关系的重大。出自《诗经·小雅·正月》"
        },

        2: {
            curectAnswer: "随遇而安",
            answerPinyin: ["sui","yu","er","an"],
            options: ["s","ui","y","u","*","er","*","an"],
            tipsPinyinCnt: 5,
            tipsChinese: [],
            description: "指处于各种环境都能安心自在。出自清·刘献廷《广阳杂记》一。"
        },
    }
   
}
