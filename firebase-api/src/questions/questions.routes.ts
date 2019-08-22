import * as express from 'express';
import {QuestionsGateway} from "./gateways/questions.gateway";
import {QuestionModel} from "./models/question.model";
import {Request, Response} from "express-serve-static-core";
import {JsonResponse} from "../global/models/json-response.model";
import {AnswerModel} from "./models/answer.model";
import {DifficultyEnum} from "./enums/difficulty.enum";

var router = express.Router();
var questionsGateway = new QuestionsGateway();
// var usersGateway = new Gate

// Get all questions (Just in case the query params don't work: :questionId/:pageSize/:pageNo)
router.get('/', (request: Request, response: Response) => {
    try {
        const questionId = request.params.questionId;
        const categoryId = request.params.categoryId;
        const difficulty = parseInt(request.params.difficulty);

        // Return single question
        if (questionId) {
            questionsGateway.getSpecificQuestion(questionId)
                .then((question: QuestionModel) => {
                    response.send(
                        new JsonResponse(question)
                    );
                });
        }

        // Return multiple questions
        const pageSize: number = parseInt(request.params.pageSize);
        const pageNo: number = parseInt(request.params.pageNo);
        const startItemNo = (pageNo * pageSize) - (pageSize + 1);

        questionsGateway.getQuestions(categoryId, difficulty, startItemNo, pageSize)
            .then((questions: QuestionModel[]) => {
                response.send(
                    new JsonResponse(questions)
                );
            });
    } catch (e) {
        response.send(
            new JsonResponse(e)
        );
    }
});

router.post('/checkAnswers', (request: Request, response: Response) => {
    const answers: AnswerModel[] = request.body.answers;
    const questionsDocs = answers.map((answer: AnswerModel) => {
        return questionsGateway.getDocumentReference(answer.questionId);
    });

    questionsGateway.getMultipleQuestionsById(questionsDocs)
        .then((questions: QuestionModel[]) => {
            if (answers && answers.length) {
                answers.forEach((answer: AnswerModel) => {
                    const filteredQuestions = questions.filter((question: QuestionModel) => {
                        return question._id === answer.questionId;
                    });

                    answer.correct = filteredQuestions[0].isCorrectAnswer(answer.answer);
                })
            }
        });

    response.send(
        new JsonResponse(answers)
    );
});

router.post('/', (request: Request, response: Response) => {
    try {
        const question = request.body.question;
        const categoryId = request.body.categoryId;
        const difficulty = request.body.difficulty;
        const newDocumentSpace = questionsGateway.getNewDocumentReference();
        const mappedQuestion = new QuestionModel(newDocumentSpace.id, question, categoryId, difficulty);
        const possibleAnswers = request.body.possibleAnswers;

        if (newDocumentSpace && mappedQuestion) {
            question.setPossibleAnswers(possibleAnswers);

            QuestionsGateway.setQuestion(newDocumentSpace, mappedQuestion)
                .then(() => response.send(
                    new JsonResponse(question)
                ));
        }
    } catch (e) {
        response.send(
            new JsonResponse(e)
        );
    }
});
