import UIControl from '../managers/UIControl'
import Energy from '../dataCenter/energy';
// import ResManager from '../managers/resManager'
// import Animation from "../utills/animation"

const { ccclass, property } = cc._decorator;

@ccclass
export default class homeUI_ctrl extends UIControl {

    onLoad(): void {
        super.onLoad();
        this.add_button_listen("startBt", this, this.startGame);
       // this.add_button_listen("buttons/ranking", this, this.anmationPlay)
    }

    start(): void {
        this.homeAnimation();
    }

    update(dt: number): void {
        const cnt = this.view["props/energy/Article/cnt"];
        const time = this.view["props/energy/leftTime"]
        this.setEnergyDisplay(cnt, time);
    }

    /**
     * 首页播放动画
     */
    private homeAnimation(): void {
        const logo: cc.Node = this.view["BG/logo"];
        logo.active = true;
        logo.scale = 1;
        cc.tween(logo)
            .repeatForever(
                cc.tween()
                    .to(3, { scale: 1.1 })
                    .to(3, { scale: 0.9 })
                    .delay(1.5)
            )
            .start();
    }


    /**
     * 开始游戏过渡动画
     */
    private startGameTransition(time: number): void {
        const startBt: cc.Node = this.view["startBt"];
        const logo: cc.Node = this.view["BG/logo"];
        cc.tween(startBt)
            .to(time, { scaleY: 0, opacity: 0 })
            .start();
        cc.tween(logo)
            .to(time, { scale: 3, opacity: 0 })
            .start();
    }

    /**
     * 开始游戏
     */
    private startGame(): void {
        Energy.instance.energyChange(-5);
        let time = 0.4;
        this.startGameTransition(time);
        this.scheduleOnce(() => {
            this.gameMain.enterScene("gameScene");
        }, time);
    }

    //测试祯动画播放组件
    // private anmationPlay(): void {
    //     const node = this.view["animaTest"];
    //     const duration = 0.1;
    //     const isLoop: boolean = true;
    //     const atlas: cc.SpriteAtlas = ResManager.instance.get_res("animation/cowlist", cc.SpriteAtlas);
    //     const texture1 = atlas.getSpriteFrame("cow1_2");
    //     const texture2 = atlas.getSpriteFrame("cow1_3");
    //     const texture3 = atlas.getSpriteFrame("cow1_1");
    //     Animation.instance.animationPlay(node, duration, isLoop, texture1, texture2, texture3);
    // }

}
