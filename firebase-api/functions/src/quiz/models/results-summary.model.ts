import {PlayerResultsModel} from "./player-results.model";
import {AnswerModel} from "../../questions/models/answer.model";
import * as _ from 'lodash';

export class ResultsSummaryModel {
    numberOfQuestions: number;
    userScores: PlayerResultsModel[];

    constructor(answers: AnswerModel[]) {
        const usersWithAnswers: PlayerResultsModel[] = []; // Dictionary for storing users
        const questions = _.uniq(answers.map(answer => answer.questionId));

        answers.forEach(answer => {
            let existingUser = usersWithAnswers.find(item => item.userId === answer.userId);

            if (!existingUser) {
                existingUser = new PlayerResultsModel(answer.userId);

                usersWithAnswers.push(existingUser);
            }

            existingUser.answers.push(answer);
            existingUser.calculateTotal();
        });

        this.numberOfQuestions = questions.length;
        this.userScores = usersWithAnswers;
    }
}
