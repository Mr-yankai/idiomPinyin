const {ccclass, property} = cc._decorator;

import UIControl from '../managers/UIControl'
import Playing from "../dataCenter/playing"
 
@ccclass
export default class gameUI_ctrl extends UIControl {
 
  //  private allowOperat: boolean = true;
 
    onLoad(): void {
        super.onLoad();
        this.onButtonsClick();       
    }

    start(): void {
        this.startNewGame();
    }

    update (dt) {
        let cnt = this.view["props/energy/Article/cnt"];
        let time = this.view["props/energy/leftTime"]
        this.setEnergyDisplay(cnt, time);
    }

    /**
     * 给所有按钮绑定回调函数
     */
    private onButtonsClick(): void {
        this.add_button_listen("buttons/back", this, this.onBackClick);
        this.add_button_listen("buttons/tips", this, this.playerTips);
        this.add_button_listen("buttons/next", this, this.startNewGame);
    }

    /**
     * 开始一局新的游戏
     */
    private startNewGame(): void {
        Playing.instance.startNewGame();
        this.setLevelDisplay(); 
     //   this.allowOperat = true;
        this.setOptionsContent();
        this.setAnswerInitUI();
      //  this.sysTips();
        this.setResultDisplay(false);
        this.bottomButtonDisplay(false);
    }

    /**
     * 关卡名称展示
     */
    private setLevelDisplay(): void {
        let level = this.view["levelDisplay/levelNum"];
        level.getComponent(cc.Label).string = Playing.instance.currentLevel;
    }
 
    /**
     * 正确答案展示
     */
    private setResultDisplay(answer: boolean): void {
        let answerNode = this.view["curectAnswer"];
        if(!answer){
            answerNode.active = false;
            return;
        }       
        answerNode.active = true;
        let curectAnswer = Playing.instance.levelData.curectAnswer; 
        answerNode.getComponent(cc.Label).string = curectAnswer;

    }

    /**
     * 绘制选项节点
     */
    private createOptionNode(node: cc.Node, index: number) {
        let options = Playing.instance.levelData.options;
        let letter = options[Playing.instance.indexList[index]];
        
        let letterType = Playing.instance.indexList[index] % 2 == 0 ? 0 : 1;
        let color = letterType == 0 ? cc.Color.YELLOW : cc.Color.WHITE;
        node.getChildByName("letter").getComponent(cc.Label).string = letter;
        node.getChildByName("letter").color = color;
        node.scale = Playing.instance.optionsDisplay.indexOf(index) < 0 ? 0 : 1;
        
    }

    /**
     * 绘制答题节点
     */
    private createAnswerNode(node: cc.Node, index: number){
        let particle = node.getChildByName("content").getComponent(cc.ParticleSystem);
        particle.resetSystem();
        let initialsLetter = Playing.instance.answer[index][0];
        let finalsLetter = Playing.instance.answer[index][1];
        let initials = node.getChildByName("content").getChildByName("initials");
        let finals = node.getChildByName("content").getChildByName("finals");
        initials.color = cc.Color.YELLOW;
        finals.color = cc.Color.WHITE;
        initials.getComponent(cc.Label).string = initialsLetter == null ? "" : initialsLetter;
        finals.getComponent(cc.Label).string = finalsLetter == null ? "" : finalsLetter;
        node.runAction(cc.sequence([cc.scaleTo(0.2, 1.2), cc.scaleTo(0.2, 1)]));
    }

    /**
     * 设置指针位置
     */
    private setPointer(): void {
        let pointNode = this.view["pointer"];
        let items = this.view["userAnswer/layout"].children;
        let wpos = items[Playing.instance.pointerIndex].convertToWorldSpaceAR(cc.v2(0, 0));
        let pos = this.node.convertToNodeSpaceAR(wpos);
        pointNode.x = pos.x;
    }
 
    /**
     * 选项区域初始状态
     */
    private setOptionsContent(): void {
        const items = this.view["options/layout"].children;          
        for (let i = 0; i < items.length; i++){          
            this.createOptionNode(items[i], i);
            items[i].on(cc.Node.EventType.TOUCH_START, ()=>{                
                items[i].runAction(cc.scaleTo(0.1, 1.2));                
            }, this);
            items[i].on(cc.Node.EventType.TOUCH_CANCEL, ()=>{                
                items[i].runAction(cc.scaleTo(0.1, 1));                
            }, this);
            items[i].on(cc.Node.EventType.TOUCH_END, ()=>{                
                Playing.instance.onOptionClick(i);
                this.optionClickCallback(items[i]);                
            }, this);
        }
    }

    /**
     * 选项点击回调
     * @param node 被点击节点
     */
    private optionClickCallback(node: cc.Node): void {
        let ansItems = this.view["userAnswer/layout"].children;
        node.runAction(cc.scaleTo(0.2, 0));
        this.createAnswerNode(ansItems[Playing.instance.pointerIndex], Playing.instance.pointerIndex);
        this.undoOption(Playing.instance.callbackIndexList[0]);
        this.undoOption(Playing.instance.callbackIndexList[1]);
        let result = Playing.instance.answerAssert();
        if(result){
            this.setResultDisplay(true);
            this.bottomButtonDisplay(true);
            return;
        }
        Playing.instance.getPointerNextIndex();
        this.setPointer();
    }
 
    /**
     * 答题区域初始状态
     */
    private setAnswerInitUI(): void {
        let items = this.view["userAnswer/layout"].children;
        for (let i = 0; i < items.length; i++){
            this.createAnswerNode(items[i], i); 
            items[i].on(cc.Node.EventType.TOUCH_END, ()=>{
                Playing.instance.onAnswerClick(i);
                this.answerClickCallback(items[i]);
            }, this)
        }
        Playing.instance.getPointerNextIndex();
        this.setPointer();       
    }

    /**
     * 答案节点点击回调
     * @param node 被点击节点
     */
    private answerClickCallback(node: cc.Node): void {
        this.createAnswerNode(node, Playing.instance.pointerIndex);
        let list = Playing.instance.callbackIndexList;
        for(let i = 0; i < list.length; i++){
            this.undoOption(Playing.instance.callbackIndexList[i]);
        }
        this.setPointer();
    }

    /**
     * 选项被撤回
     * @param index 选项节点的位置索引
     */
    private undoOption(index: number): void {
        if(index == null){
            return;
        }
        let items = this.view["options/layout"].children;
        items[index].runAction(cc.scaleTo(0.2, 1));
    }

    /**
     * 玩家点击提示按钮事件回调
     */
    private playerTips(): void {
        Playing.instance.playerTips();
        if(Playing.instance.tipsIndex == -1) return;
        Playing.instance.onOptionClick(Playing.instance.tipsIndex)       
        let node = this.view["options/layout"].children[Playing.instance.tipsIndex];
        this.optionClickCallback(node);

    }

    /**
     * 底部按钮显示与隐藏
     * @param status 显隐状态
     */
    private bottomButtonDisplay(status: boolean): void {
        let next = this.view["buttons/next"];
        let share = this.view["buttons/share"];                 
        if(status){  
            next.active = status;
            share.active = status;       
            let actNext = cc.moveBy(0.5, cc.v2(0, 200)).easing(cc.easeBackOut()); 
            next.runAction(actNext);
            let actShare = cc.moveBy(0.5, cc.v2(0, 200)).easing(cc.easeBackOut());
            share.runAction(actShare);
        }else{
            let actNext = cc.moveBy(0.5, cc.v2(0, -200)).easing(cc.easeBackIn()); 
            next.runAction(actNext);
            let actShare = cc.moveBy(0.5, cc.v2(0, -200)).easing(cc.easeBackIn());
            share.runAction(actShare);
            this.scheduleOnce(()=>{
                next.active = status;
                share.active = status; 
            },0.5)
        }
    }

    /**
     * 返回主页
     */
    private onBackClick(): void {
        this.gameMain.enterScene("homeScene");
    }
 
}