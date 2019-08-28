import {UserTypeEnum} from "../enums/user-type.enum";
import {IAuditable} from "../../global/interfaces/auditable.interface";

export class UserModel implements IAuditable {
    _id: string;
    type: UserTypeEnum;
    username: string;
    picture: Blob;
    email: string;
    bio: string;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;

    constructor(
        id: string,
        type: UserTypeEnum,
        username: string,
        picture: Blob,
        email: string,
        bio: string,
        createdBy: string = 'System',
        createdOn: Date = new Date(),
        updatedBy: string = 'System',
        updatedOn: Date = new Date()
    ) {
        this._id = id;
        this.type = type;
        this.username = username;
        this.picture = picture;
        this.email = email;
        this.bio = bio;
        this.createdBy = createdBy;
        this.createdOn = createdOn;
        this.updatedBy = updatedBy;
        this.updatedOn = updatedOn;
    }

    setPassword(password: string) {
        // TODO: Chris - Implement
    }

    update(user: UserModel) {
        // TODO: Chris - Implement
    }

    modifyCreated(createdBy?: string): void {
        this.createdBy = createdBy || 'System';
        this.createdOn = new Date();
    }

    modifyUpdated(updatedBy?: string): void {
        this.updatedBy = updatedBy || 'System';
        this.updatedOn = new Date();
    }
}
