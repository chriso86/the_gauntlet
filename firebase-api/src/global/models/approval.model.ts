import {UserModel} from "../../users/models/user.model";
import {LoggerService} from "../services/logger.service";
import {UserTypeEnum} from "../../users/enums/user-type.enum";

export class ApprovalModel {
    private _loggerService: LoggerService = new LoggerService();

    requestedOn: Date;
    requestedBy: string;
    approvedOn: Date;
    approvedBy: string;
    approved: boolean;

    constructor(
        requestedOn: Date = new Date(),
        requestedBy: string = '',
        approvedOn: Date = new Date(),
        approvedBy: string = '',
        approved: boolean = false
    ) {
        this.requestedOn = requestedOn;
        this.requestedBy = requestedBy;
        this.approvedOn = approvedOn;
        this.approvedBy = approvedBy;
        this.approved = approved;
    }

    request(user: UserModel) {
        this.requestedBy = user._id || 'NODATA';
        this.requestedOn = new Date();

        this._loggerService.logEvent('ApprovalModel Request', user._id);
    }

    approve(user: UserModel) {
        if (this.requestedBy === 'NODATA') {
            throw new Error('You cannot approve an invalid request');
        }

        if (user.type !== UserTypeEnum.MasterVampire) {
            throw new Error('You do not have the permissions to approve this request');
        }

        this.approved = true;
        this.approvedBy = user._id || 'NODATA';
        this.approvedOn = new Date();

        this._loggerService.logEvent('ApprovalModel Granted', user._id);
    }
}
