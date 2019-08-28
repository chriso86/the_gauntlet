import * as express from 'express';
import {QuestionsGateway} from "./gateways/questions.gateway";
import {QuestionModel} from "./models/question.model";
import {JsonResponse} from "../global/models/json-response.model";
import {Request, Response} from "firebase-functions";

export const router = express.Router();
const questionsGateway: QuestionsGateway = new QuestionsGateway();

/**
 * Get a single question or a list of questions
 *
 * @param(optional) {string} questionId               The ID of the question to retrieve
 * @param(optional) {string[]} categoryIds            The category IDs of the questions that you want to retrieve
 * @param(optional) {string} difficulty               The difficulty of the questions that you want to retrieve
 */
router.post('/GetQuestions', (request: Request, response: Response) => {
    try {
        const questionId = request.body.questionId;
        const categoryIds = request.body.categoryIds;
        const difficulty = parseInt(request.body.difficulty);

        // Return single question
        if (questionId) {
            questionsGateway.getSpecificQuestion(questionId)
                .then((question: QuestionModel | void) => {
                    response.send(
                        new JsonResponse(question)
                    );
                });
        }

        // Return multiple questions
        const pageSize: number = parseInt(request.body.pageSize);
        const pageNo: number = parseInt(request.body.pageNo);
        const startItemNo = (pageNo * pageSize) - (pageSize + 1);

        questionsGateway.getQuestions(categoryIds, difficulty, startItemNo, pageSize)
            .then((questions: QuestionModel[] | void) => {
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

/**
 * Add a new question to the DB for Quizzes
 *
 * @param {string} question                The question itself
 * @param {string} categoryId              The category ID of the new question
 * @param {string} difficulty              The difficulty level of the new question
 * @param {string[]} possibleAnswers       The possible answers for the question
 * @param {string} correctAnswer           The correct answer for the question (Should be one of the possible answers)
 */
router.post('/AddQuestion', (request: Request, response: Response) => {
    try {
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

            QuestionsGateway.setQuestion(newDocumentSpace, mappedQuestion)
                .then(() => {
                    response.send(
                        new JsonResponse(mappedQuestion._id)
                    );
                });
        }
    } catch (e) {
        response.send(
            new JsonResponse(e)
        );
    }
});
