import {UserModel} from "./user.model";
import {UserTypeEnum} from "../enums/user-type.enum";

export class PlayerModel extends UserModel {
    firstname: string;
    lastname: string;
    level: number;
    experience: number;

    constructor(
        id: string,
        type: UserTypeEnum,
        handle: string,
        picture: Blob,
        email: string,
        bio: string,
        firstname: string,
        lastname: string,
        level: number,
        experience: number
    ) {

        super(id, type, handle, picture, email, bio);

        this.level = level;
        this.experience = experience;
        this.firstname = firstname;
        this.lastname = lastname;
    }

    addExperience(exp: number) {
        this.experience += exp;

        // TODO: Chris - Implement Levels
    }
}
