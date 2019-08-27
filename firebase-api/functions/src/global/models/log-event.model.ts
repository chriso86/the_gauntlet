export class LogEventModel {
    actionOn: Date;
    actionBy: string;
    action: string;

    constructor(actionOn: Date, actionBy: string, action: string) {
        this.actionOn = actionOn;
        this.actionBy = actionBy;
        this.action = action;
    }
}
