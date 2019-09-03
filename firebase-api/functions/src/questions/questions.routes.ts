import * as express from 'express';
import {QuestionsGateway} from "./gateways/questions.gateway";
import {QuestionModel} from "./models/question.model";
import {JsonResponse} from "../global/models/json-response.model";
import {Request, Response} from "firebase-functions";
import {PAGING} from "../global/constants";
import {calculatePagingStart} from "../global/helpers/paging";

export const questionRouter = express.Router();
const questionsGateway: QuestionsGateway = new QuestionsGateway();

/**
 * Get a single question
 *
 * @param(optional) {string} questionId               The ID of the question to retrieve
 */
questionRouter.get('/GetQuestion', (request: Request, response: Response) => {
    const questionId = request.query.questionId;

    questionsGateway.getSpecificQuestion(questionId, response)
        .then((question: QuestionModel) => {
            response.send(
                new JsonResponse(question)
            );
        });
});

/**
 * Get a list of questions
 *
 * @param {string[]} categoryIds            The category IDs of the questions that you want to retrieve
 * @param {string} difficulty               The difficulty of the questions that you want to retrieve
 * @param {string} pageSize                 The number of items on a page
 * @param {string} pageNo                   The page number to get
 */
questionRouter.get('/GetQuestions', (request: Request, response: Response) => {
    const categoryIds = request.query.categoryIds;
    const difficulty = request.query.difficulty;
    const pageSize: number = parseInt(request.query.pageSize|| PAGING.pageSize);
    const pageNo: number = parseInt(request.query.pageNo || PAGING.firstPageDefault);
    const startItemNo = calculatePagingStart(pageSize, pageNo);

    questionsGateway.getQuestions(categoryIds, difficulty, startItemNo, pageSize)
        .then((questions: QuestionModel[] | void) => {
            response.send(
                new JsonResponse(questions)
            );
        });
});

/**
 * Add a new question to the DB for Quizzes
 *
 * @param {string} question                The question itself
 * @param {string} categoryId              The category ID of the new question
 * @param {string} difficulty              The difficulty level of the new question
 * @param {string[]} possibleAnswers       The possible answers for the question
 * @param {string} correctAnswer           The correct answer for the question (Should be one of the possible answers)
 */
questionRouter.post('/AddQuestion', (request: Request, response: Response) => {
    const question = request.body.question;
    const categoryId = request.body.categoryId;
    const difficulty = request.body.difficulty;
    const createdBy = request.body.userId;
    const possibleAnswers = request.body.possibleAnswers;
    const correctAnswer = request.body.correctAnswer;

    const newDocumentSpace = questionsGateway.getNewDocumentReference();
    const mappedQuestion = new QuestionModel(newDocumentSpace.id, question, categoryId, difficulty);

    if (newDocumentSpace && mappedQuestion) {
        mappedQuestion.setPossibleAnswers(possibleAnswers);
        mappedQuestion.setCorrectAnswer(correctAnswer);
        mappedQuestion.modifyCreated(createdBy);

        questionsGateway.setQuestion(newDocumentSpace, mappedQuestion)
            .then(() => {
                response.send(
                    new JsonResponse(mappedQuestion._id)
                );
            });
    }
});
