
export default class Energy extends cc.Component {

    /**
     * 配置信息：初始能量值/能量自动增长一点的时间间隔/最大能量值
     */
    private initCnt: number = 20;
    private timeInterval: number = 300;
    private maxCnt: number = 20;

    /**
     * 当前能量值/当前倒计时时间
     */
    public currentCnt: number = 0;
    public countdownTime: number = 0;

    /**
     * 倒计时启动状态
     */
    public timerStatus: boolean = false;

    /**
     * 全局维一单例
     */
    public static instance: Energy;

    public static getInstance(): Energy{
        if(this.instance == null){
         this.instance = new Energy();
     }
     return this.instance;
    }

    public init(src): void {
        this.updataEnergy();
        this.startEventListen();
        console.log(src);
    }


    private getLeftCnt(): number {
        let leftCnt = cc.sys.localStorage.getItem("leftCnt");
        if(!leftCnt){
            leftCnt = this.initCnt;
        }else{
            leftCnt = parseFloat(leftCnt);           
        }
        return leftCnt;
    }

    private getLeftTime(): number {
        let leftTime = cc.sys.localStorage.getItem("leftTime");
        if(!leftTime){
            leftTime = new Date().getTime();           
        }else{
            leftTime = parseFloat(leftTime);
        }
        return leftTime;
    }

    /**
     * 进入/回到游戏时，更新能量状态
     */
    private updataEnergy(): void {
        let leftCnt = this.getLeftCnt();
        let leftTime = this.getLeftTime();
        let nowTime = new Date().getTime();
        let timeOffset = (nowTime - leftTime) / 1000;
        let energyOffset = timeOffset / this.timeInterval;
        let energy = leftCnt + energyOffset;        
        if(energy >= this.maxCnt){
            this.currentCnt = this.maxCnt;
            this.countdownTime = this.timeInterval;
            return;
        }
        this.currentCnt = Math.floor(energy);
        let time = 1 - (energy - this.currentCnt);
        this.countdownTime = Math.floor(time * this.timeInterval);
        this.startTimer();
    }

    /**
     * 离开游戏时 储存能量状态
     * @param leftCnt 能量值
     * @param remainderTime 倒计时时间
     * @param leftTime 时间戳
     */
    private saveEnergy(): void {
        let cnt = 1 - (this.countdownTime / this.timeInterval);
        let leftCnt = this.currentCnt + cnt;
        let leftTime = new Date().getTime();;
        cc.sys.localStorage.setItem("leftCnt", leftCnt.toString());
        cc.sys.localStorage.setItem("leftTime", leftTime.toString());
        this.stopTimer();
    }

    /**
     * 开启能量倒时计
     */
    private startTimer(): void {
        if(this.currentCnt >= this.maxCnt){
            this.countdownTime = this.timeInterval;
            return;
        }
        if(this.timerStatus){
            return;
        }
        this.timerStatus = true;
        this.schedule(()=>{
            if(this.countdownTime == 0){
                this.currentCnt ++;
                if(this.currentCnt == this.maxCnt){
                    this.stopTimer();
                    return;
                }
                this.countdownTime = this.timeInterval;
            }
            this.countdownTime --;
        }, 1, cc.macro.REPEAT_FOREVER, 0)
    }

    /**
     * 取消能量倒时计
     */
    private stopTimer(): void {
        this.unscheduleAllCallbacks();
        this.countdownTime = this.timeInterval;
        this.timerStatus = false;
    }

    /**
     * 能量增加/扣减
     * @param data 能量变化数值，正数为增加，负数为扣减
     */
    public energyChange(data: number): void {
        this.currentCnt += data;
        if(data < 0){
            this.startTimer();
        }
    }

    /**
     * 开启事件监听
     */
    private startEventListen(): void {
        cc.game.on(cc.game.EVENT_HIDE, this.saveEnergy, this);
        cc.game.on(cc.game.EVENT_SHOW, this.updataEnergy, this);
    }

}