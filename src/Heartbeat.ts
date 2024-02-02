import { Disposable } from "vscode";

export class Heartbeat implements Disposable {

    private interval: number;
    private callback: Function;
    private timer?: NodeJS.Timeout;

    constructor(interval: number, callback: Function) {
        this.interval = interval;
        this.callback = callback;
    }

    start(): void {
        this.stop();
        this.timer = setInterval(() => this.callback(), this.interval);
    }

    stop(): void {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }

    dispose(): void {
        this.stop();
    }

    get running(): boolean {
        return !!this.timer;
    }

}
