import ResManager from "./resManager"

export default class UIManager {

    public static show_ui_at(parent: cc.Node, ui_name: string): cc.Node {
        var prefab: cc.Prefab = ResManager.instance.get_res("ui_prefabs/" + ui_name);
        var item: cc.Node = null;
        if (prefab) {
            item = cc.instantiate(prefab);
            parent.addChild(item);
            item.addComponent(ui_name + "_ctrl");
        }

        return item;
    }

}
