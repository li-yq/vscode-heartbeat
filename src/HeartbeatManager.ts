import { Heartbeat } from './Heartbeat';
import { Disposable, WindowState, window } from "vscode";

export class HeartbeatManager implements Disposable {

    private readonly heartbeat: Heartbeat;
    private readonly disposables: Disposable[];

    constructor() {
        this.disposables = [];
        this.heartbeat = new Heartbeat();
        this.disposables.push(this.heartbeat);
        window.onDidChangeWindowState(this.windowStateListener, this, this.disposables);
    }

    private windowStateListener(e: WindowState) {
        console.log(new Date().toISOString(), "Window state changed:", JSON.stringify(e));
        if (e.active) {
            this.heartbeat.start();
        } else {
            this.heartbeat.stop();
        }
    }

    dispose() {
        this.disposables.forEach(d => d.dispose());
    }
}
