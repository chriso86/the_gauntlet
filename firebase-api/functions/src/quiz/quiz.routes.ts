import {AnswerModel} from "../questions/models/answer.model";
import {QuestionModel} from "../questions/models/question.model";
import {ResultsSummaryModel} from "./models/results-summary.model";
import {JsonResponse} from "../global/models/json-response.model";
import * as express from "express";
import {QuestionsGateway} from "../questions/gateways/questions.gateway";
import {Request, Response} from "firebase-functions";
import {QuizGateway} from "./gateways/quiz.gateway";
import {ScoresModel} from "../scores/models/scores.model";
import {QuizModel} from "./models/quiz.model";
import {ScoresGateway} from "../scores/gateways/scores.gateway";

export const quizRouter = express.Router();
const questionsGateway: QuestionsGateway = new QuestionsGateway();
const quizGateway: QuizGateway = new QuizGateway();
const scoresGateway: ScoresGateway = new ScoresGateway();

/**
 * Create a new quiz for people to join
 *
 * @param {string} name                 The name of the quiz specified by the host
 * @param {string} userId               The ID of the user that created the quiz
 * @param {string} categoryIds          The categories selected for the quiz
 * @param {string} numberOfQuestions    The number of questions to include in the quiz
 * @return {string} New Quiz ID
 */
quizRouter.post('/CreateQuiz', (request: Request, response: Response) => {
    const name = request.body.name;
    const userId = request.body.userId;
    const categoryIds = request.body.categoryIds;
    const numberOfQuestions = request.body.numberOfQuestions;
    const newDocumentSpace = quizGateway.getNewDocumentReference();
    const quiz = new QuizModel(
        newDocumentSpace.id,
        name,
        categoryIds,
        numberOfQuestions,
        userId
    );

    quiz.addParticipant(userId);

    quizGateway.setQuiz(newDocumentSpace, quiz)
        .then(() => {
            response.send(quiz._id);
        });
});

/**
 * User joins an active Quiz
 *
 * @param {string} quizId               The Quiz that the request is referring to
 * @param {string} userId               The ID of the User that wants to join the Quiz
 */
quizRouter.post('/JoinQuiz', (request: Request, response: Response) => {
    const quizId = request.body.quizId;
    const userId = request.body.userId;

    quizGateway.getQuiz(quizId)
        .then((quiz: QuizModel) => {
            const existingQuizReference = quizGateway.getDocumentReference(quizId);

            if (quiz.closed) {
                response.send(new JsonResponse(new Error('This quiz has been closed, maybe try another one?')));
            }

            quiz.addParticipant(userId);

            quizGateway.setQuiz(existingQuizReference, quiz)
                .then(() => {
                    response.send(new JsonResponse(quiz._id));
                });
        });
});

/**
 * User leaves an active Quiz - TODO: If two users leave at the same time, a user should not be re-added by the other's update
 *
 * @param {string} quizId               The Quiz that the request is referring to
 * @param {string} userId               The ID of the User that wants to join the Quiz
 */
quizRouter.post('/LeaveQuiz', (request: Request, response: Response) => {
    const quizId = request.body.quizId;
    const userId = request.body.userId;

    quizGateway.getQuiz(quizId)
        .then((quiz: QuizModel) => {
            const existingQuizReference = quizGateway.getDocumentReference(quizId);

            if (quiz.closed) {
                response.send(new JsonResponse(new Error('This quiz has been closed, maybe try another one?')));
            }

            quiz.removeParticipant(userId);

            quizGateway.setQuiz(existingQuizReference, quiz)
                .then(() => {
                    response.send(new JsonResponse(quiz._id));
                });
        });
});

/**
 * Get a Quiz matching an ID
 *
 * @param {string} quizId               The Quiz that the request is referring to
 */
quizRouter.get('/GetQuiz', (request: Request, response: Response) => {
    try {
        const quizId = request.query.quizId;

        quizGateway.getQuiz(quizId)
            .then((quiz: QuizModel) => {
                response.send(quiz);
            });
    } catch (e) {
        response.send(new JsonResponse(e));
    }
});

/**
 * Get the result summary of the completed quiz
 *
 * @param {string} quizId               The Quiz that the request is referring to
 * @param {AnswerModel[]} answers       The answers submitted by the server - References question and user IDs
 */
quizRouter.post('/CloseQuiz', (request: Request, response: Response) => {
    const quizId = request.body.quizId;
    const answers: AnswerModel[] = request.body.answers;
    const questionsDocs = answers.map((answer: AnswerModel) => {
        return questionsGateway.getDocumentReference(answer.questionId);
    });

    // First get quiz
    quizGateway.getQuiz(quizId)
        .then((quiz: QuizModel) => {
            const existingQuizReference = quizGateway.getDocumentReference(quiz._id);

            // Then get questions
            questionsGateway.getMultipleQuestionsById(questionsDocs)
                .then((questions: QuestionModel[]) => {
                    if (answers && answers.length) {
                        answers.forEach((answer: AnswerModel) => {
                            const filteredQuestions = questions.filter((question: QuestionModel) => {
                                return question._id === answer.questionId;
                            });
                            const firstFilteredQuestion = filteredQuestions[0];

                            if (firstFilteredQuestion) {
                                answer.questionName = firstFilteredQuestion.question;
                                answer.correct = firstFilteredQuestion.isCorrectAnswer(answer.answer);
                            }
                        });
                    }

                    // Construct the results summary for response
                    const resultsSummary = new ResultsSummaryModel(answers);
                    let numberOfScoresAdded = 0;

                    // Store scores in DB
                    resultsSummary.userScores.forEach(userScore => {
                        const newDocumentSpace = scoresGateway.getNewDocumentReference();
                        const scores = new ScoresModel(
                            newDocumentSpace.id,
                            quiz._id,
                            quiz.name,
                            userScore.userId,
                            userScore.totalScore,
                            quiz.numberOfQuestions
                        );

                        // Close quiz and return the results only once all scores are saved (Async)
                        scoresGateway.setScores(newDocumentSpace, scores)
                            .then(() => {
                                numberOfScoresAdded += 1;

                                if (numberOfScoresAdded === resultsSummary.userScores.length) {
                                    // Close the Quiz
                                    quiz.closeQuiz();

                                    quizGateway.setQuiz(existingQuizReference, quiz)
                                        .then(() => {
                                            response.send(
                                                new JsonResponse(resultsSummary)
                                            );
                                        });
                                }
                            });
                    });
                });
        });
});
