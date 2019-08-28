import {AnswerModel} from "../../questions/models/answer.model";

export class PlayerResultsModel {
    userId: string;
    answers: AnswerModel[] = [];
    totalScore: number = 0;

    constructor(userId: string) {
        this.userId = userId;
    }

    calculateTotal(): void {
        this.totalScore = this.answers.filter(answer => answer.correct).length;
    }
}
