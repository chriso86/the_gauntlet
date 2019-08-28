export class AnswerModel {
    userId: string;
    questionId: string;
    questionName: string = '';
    answer: string;
    correct: boolean = false;

    constructor(userId: string, questionId: string, answer: string) {
        this.userId = userId;
        this.questionId = questionId;
        this.answer = answer;
    }
}
