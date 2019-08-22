import {UserTypeEnum} from "../enums/user-type.enum";

export class UserModel {
    _id: string;
    type: UserTypeEnum;
    username: string;
    picture: Blob;
    email: string;
    bio: string;

    constructor(
        id: string,
        type: UserTypeEnum,
        handle: string,
        picture: Blob,
        email: string,
        bio: string
    ) {
        this._id = id;
        this.type = type;
        this.username = handle;
        this.picture = picture;
        this.email = email;
        this.bio = bio;
    }

    setPassword(password: string) {
        // TODO: Chris - Implement
    }

    update(user: UserModel) {
        // TODO: Chris - Implement
    }
}
