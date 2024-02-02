import { Disposable, StatusBarItem, window } from "vscode";

export class Heartbeat implements Disposable {
    private clock: HeartbeatClock;
    private icon: HeartbeatIcon;
    private status: HeartbeatIcon.Status;

    constructor() {
        this.icon = new HeartbeatIcon();
        this.clock = new HeartbeatClock(3000, () => this.beat());
        this.status = HeartbeatIcon.Status.Inactive;
    }

    private beat(): void {
        console.log(new Date().toISOString(), "Heartbeat");
    }

    start(): void {
        this.clock.start();
        this.icon.setStatus(HeartbeatIcon.Status.Active);
    }

    stop(): void {
        this.clock.stop();
        this.icon.setStatus(HeartbeatIcon.Status.Inactive);
    }

    get running(): boolean {
        return this.clock.running;
    }

    dispose(): void {
        this.clock.dispose();
        this.icon.dispose();
    }
}

class HeartbeatClock implements Disposable {

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

class HeartbeatIcon implements Disposable {
    private item: StatusBarItem;
    private status: HeartbeatIcon.Status;

    constructor() {
        this.item = window.createStatusBarItem("heartbeat");
        this.status = HeartbeatIcon.Status.Inactive;
    }

    setStatus(status: HeartbeatIcon.Status): void {
        this.status = status;
        switch (status) {
            case HeartbeatIcon.Status.Active:
                this.item.text = "$(heart) Active";
                this.item.tooltip = "Heartbeat is active";
                this.item.show();
                break;
            case HeartbeatIcon.Status.Inactive:
                this.item.text = "$(heart) Inactive";
                this.item.tooltip = "Heartbeat is inactive";
                this.item.show();
                break;
            case HeartbeatIcon.Status.Disabled:
                this.item.text = "$(heart) Disabled";
                this.item.tooltip = "Heartbeat is disabled";
                this.item.hide();
                break;
        }
    }

    dispose(): void {
        this.item.dispose();
    }
}

namespace HeartbeatIcon {
    export enum Status {
        Active = "active",
        Inactive = "inactive",
        Disabled = "disabled"
    }
}

