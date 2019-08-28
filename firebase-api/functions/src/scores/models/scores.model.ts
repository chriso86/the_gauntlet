import {IAuditable} from "../../global/interfaces/auditable.interface";

export class ScoresModel implements IAuditable {
    _id: string;
    quizId: string;
    quizName: string;
    userId: string;
    totalScore: number;
    numberOfQuestions: number;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;

    constructor(
        id: string,
        quizId: string,
        quizName: string,
        userId: string,
        totalScore: number,
        numberOfQuestions: number,
        createdOn: Date = new Date(),
        createdBy: string = 'System',
        updatedOn: Date = new Date(),
        updatedBy: string = ''
    ) {
        this._id = id;
        this.quizId = quizId;
        this.quizName = quizName;
        this.userId = userId;
        this.totalScore = totalScore;
        this.numberOfQuestions = numberOfQuestions;
        this.createdOn = createdOn;
        this.createdBy = createdBy;
        this.updatedOn = updatedOn;
        this.updatedBy = updatedBy;
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
