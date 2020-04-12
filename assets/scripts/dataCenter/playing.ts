
import StageCfg from "../config/StageCfg"
import UserData from "../dataCenter/userData"

export default class Playing {

    private stageData: object = {};
    public levelData: any = {}
    public currentLevel: number = 1;
    public pointerIndex: number = 0; 

    public indexList = [];
    public answer = [];
    public optionsDisplay = [];
    private mapping = {};
    public callbackIndexList = [];
    public tipsIndex: number = 0;

    /*levelData:
    *curectAnswer: "才高八斗",
    *answerPinyin: ["cai","gao","ba","dou"],
    *options: ["c","ai","g","ao","b","a","d","ou"],
    *tipsPinyinCnt: 6,
    *tipsChinese: [],
    *description: "形容人文才高超。出自南朝·宋·无名氏《释常谈·斗之才》"
    */

    /**
     * 全局维一单例
     */
    public static instance: Playing;

    public static getInstance(): Playing{
        if(this.instance == null){
         this.instance = new Playing();
     }
     return this.instance;
    }

    public init(src): void {
        this.getStageData();
        console.log(src);
    }

    /**
     * 获取所有关卡配置数据
     */
    private getStageData(): void {
        this.stageData = StageCfg.instance.stageData;
    }

    /**
     * 获取当前进行的关卡
     */
    private getCurrentLevel(): void {
        let userData = UserData.getInstance();
        let uMaxLevel = userData.getUserMaxLevel();
        this.currentLevel = uMaxLevel + 1;
    }

    /*
    * 获取当前关卡数据
    */
    private getLevelCfg(): void {
        this.levelData = this.stageData[this.currentLevel - 1];
    }

    /**
     * 初始化indexList/answer/mapping
     */
    private gameDataInit(): void {
        let list = [0, 1, 2, 3, 4, 5, 6, 7];
        list.sort((a, b)=> {return Math.random() > 0.5 ? 1 : -1})
        this.indexList = list;
        this.answer = [[null,null],[null,null],[null,null],[null,null]];
        this.optionsDisplay = [0, 1, 2, 3, 4, 5, 6, 7];
        this.mapping = {
            0: {0: null, 1: null},
            1: {0: null, 1: null},
            2: {0: null, 1: null},
            3: {0: null, 1: null},
        }
    }

    /**
     * 开始一局新的游戏
     */
    public startNewGame(): void {
        this.getCurrentLevel();
        this.getLevelCfg();
        this.gameDataInit();
        this.sysTips();
        this.pointerIndex = 0;
        this.getPointerNextIndex();
        
    }

    /**
     * 玩家点击选项操作
     * @param index 被点击节点的位置索引
     */
    public onOptionClick(index: number): void {
        this.callbackIndexList = [];
        let options = this.levelData.options;
        let letter = options[this.indexList[index]];
        let typeIndex = this.indexList[index] % 2 == 0 ? 0 : 1; 
        let value = this.mapping[this.pointerIndex][typeIndex];
        if(value !== null){
            this.callbackIndexList.push(value);
            this.optionsDisplay.push(value);
        }       
        this.answer[this.pointerIndex][typeIndex] = letter;
        this.mapping[this.pointerIndex][typeIndex] = index;
        this.optionsDisplay.splice(this.optionsDisplay.indexOf(index), 1);
    }

    /**
     * 答案区点击操作
     * @param index 选项区索引
     */
    public onAnswerClick(index: number): void {
        this.pointerIndex = index;
        if(this.answer[index][0] == null || this.answer[index][1] == null){
            return;
        }
        this.callbackIndexList = [];        
        this.callbackIndexList.push(this.mapping[index][0]);
        this.callbackIndexList.push(this.mapping[index][1]);
        this.optionsDisplay.push(this.mapping[index][0]);
        this.optionsDisplay.push(this.mapping[index][1]);
        this.answer[index][0] = null;
        this.answer[index][1] = null;
        this.mapping[index][0] = null;
        this.mapping[index][1] = null;
        
    }

    /**
     * 系统初始提示
     */
    private sysTips(): void {
        let arr = [0, 1, 2, 3, 4, 5, 6, 7];
        arr.sort((a, b)=>{return Math.random() > 0.5 ? 1 : -1});
        arr.length = this.levelData.tipsPinyinCnt;
        for(let i = 0; i < arr.length; i++){
            let ansIndex = Math.floor(this.indexList[arr[i]] / 2);
            let ansType = this.indexList[arr[i]] % 2;
            this.answer[ansIndex][ansType] = this.levelData.options[this.indexList[arr[i]]];
            this.mapping[ansIndex][ansType] = arr[i];
            this.optionsDisplay.splice(this.optionsDisplay.indexOf(arr[i]), 1);
        }
    }

    /**
     * 玩家点击提示tips
     */
    public playerTips(): void {       
        if(this.optionsDisplay.length == 0) {
            this.tipsIndex = -1;
            return;
        }
        let randomIndex = Math.floor(Math.random() * this.optionsDisplay.length);
        this.tipsIndex = this.optionsDisplay[randomIndex];
        this.pointerIndex = Math.floor(this.indexList[this.tipsIndex] / 2);
    }

    /**
     * 指针寻址
     */
    public getPointerNextIndex(): void {
        let startIndex = this.pointerIndex;
        let searchCnt = 0;
        for(let i = startIndex; i < 4; i++){
            if(this.answer[i][0] == null || this.answer[i][1] == null){
                this.pointerIndex = i;
                break;
            }
            if(i == 3){
                i = -1;
            }
            searchCnt ++;
            if(searchCnt > 4){
                return;
            }
        }
    }

    /**
     * 结果校验
     */
    public answerAssert(): boolean {
        let result: boolean = true;
        let answerPinyin = this.levelData.answerPinyin;
        for(let i = 0; i < 4; i++){
            let initails = this.answer[i][0];
            let finals = this.answer[i][1]
            initails = initails == null || initails == "*" ? "" : initails;
            finals = finals == null || finals == "*" ? "" : finals;
            let answerStr = initails + finals;
            if(answerStr !== answerPinyin[i]){
                result = false;
            }
        }
        if(result){
            this.gemaOver();
        }
        return result;
    }

    /**
     * 单局游戏结束，更新用户数据
     */
    private gemaOver(): void {
        let userData = UserData.getInstance();
        userData.uDataLocalStorage(this.currentLevel);
    }
  
}