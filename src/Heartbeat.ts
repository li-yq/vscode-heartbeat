import { ensureFile, utimes } from "fs-extra";
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

    private async beat(): Promise<void> {
        console.log(new Date().toISOString(), "Heartbeat");

        const HEARTBEAT_FILE = "/tmp/vscode-heartbeat";
        const now = new Date();
        await ensureFile(HEARTBEAT_FILE);
        await utimes(HEARTBEAT_FILE, now, now);
    }

    start(): void {
        if (this.status === HeartbeatIcon.Status.Active) {
            return;
        }
        this.status = HeartbeatIcon.Status.Active;
        this.clock.start();
        this.icon.setStatus(HeartbeatIcon.Status.Active);
    }

    stop(): void {
        if (this.status === HeartbeatIcon.Status.Inactive) {
            return;
        }
        this.status = HeartbeatIcon.Status.Inactive;
        this.clock.stop();
        this.icon.setStatus(HeartbeatIcon.Status.Inactive);
    }

    get isActive(): boolean {
        return this.status === HeartbeatIcon.Status.Active;
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

}

class HeartbeatIcon implements Disposable {
    private item: StatusBarItem;

    constructor() {
        this.item = window.createStatusBarItem("heartbeat");
        this.setStatus(HeartbeatIcon.Status.Inactive);
    }

    setStatus(status: HeartbeatIcon.Status): void {
        switch (status) {
            case HeartbeatIcon.Status.Active:
                this.item.text = "$(pulse)";
                this.item.tooltip = "Heartbeat is active";
                this.item.show();
                break;
            case HeartbeatIcon.Status.Inactive:
                this.item.text = "$(heart)";
                this.item.tooltip = "Heartbeat is inactive";
                this.item.show();
                break;
            case HeartbeatIcon.Status.Disabled:
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

