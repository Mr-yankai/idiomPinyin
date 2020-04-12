import EventManager from "./eventManager"

const {ccclass, property} = cc._decorator;

@ccclass
export default class NetManager extends cc.Component {

    private State = {
        Disconnected: 0, // 断开连接
        Connecting: 1, // 正在连接
        Connected: 2, // 已经连接;
    }

    private state : number

    private url: string =  "ws://127.0.0.1:6081/ws"

    private sock 

    // 发起连接;
    public connect_to_server(): void {
        if (this.state != this.State.Disconnected) {
            return;
        }

        this.state = this.State.Connecting;
        this.sock = new WebSocket(this.url); // H5标准，底层做好了;
        this.sock.binaryType = "arraybuffer";

        this.sock.onopen = this._on_opened.bind(this);
        this.sock.onmessage = this._on_recv_data.bind(this);
        this.sock.onclose = this._on_socket_close.bind(this);
        this.sock.onerror = this._on_socket_err.bind(this);
    }

    //发送数据
    public send_data(data_arraybuf): void {
        if (this.state == this.State.Connected && this.sock) {
            this.sock.send(data_arraybuf);
        }
    }

    //关闭连接
    public close_socket(): void {
        if (this.state == this.State.Connected) {
            if (this.sock !== null) {
                this.sock.close();
                this.sock = null;
            }
            EventManager.dispatch_event("net_disconnect", null);
        }
        
        this.state = this.State.Disconnected;
    }

    private _on_opened(event): void {
        this.state = this.State.Connected;
        cc.log("connect to server: " + this.url + " sucess!");
        EventManager.dispatch_event("net_connect", null);
    }

    private _on_recv_data(event): void {
        EventManager.dispatch_event("net_message", event.data);
    }

    private _on_socket_close(event): void {
        this.close_socket();
    }

    private _on_socket_err(event): void {
        this.close_socket();
    }

    protected onLoad (): void {
        this.state = this.State.Disconnected;
    }

    protected start (): void {

    }

    protected update (dt): void {
        if (this.state != this.State.Disconnected) {
            return;
        }

        this.connect_to_server();
    }
}
