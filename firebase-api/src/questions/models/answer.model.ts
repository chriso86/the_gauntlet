export class AnswerModel {
    userId: string;
    questionId: string;
    answer: string;
    correct: boolean;

    constructor(userId: string, questionId: string, answer: string) {
        this.userId = userId;
        this.questionId = questionId;
        this.answer = answer;
    }
}
