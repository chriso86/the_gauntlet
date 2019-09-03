import {QuestionModel} from "../models/question.model";
import {
    DocumentReference,
    DocumentSnapshot,
    QueryDocumentSnapshot,
    QuerySnapshot,
    WriteResult
} from "@google-cloud/firestore";
import {DifficultyEnum} from "../enums/difficulty.enum";
import {BaseGateway} from "../../global/gateways/base.gateway";
import {parseJsonModel} from "../../global/helpers/json-parser";
import {Response} from 'firebase-functions';

export class QuestionsGateway extends BaseGateway {
    constructor() {
        super();

        this._collection = this._db.collection('question');
    }

    // READ
    getQuestions(
        categoryIds: string[],
        difficulty: DifficultyEnum = DifficultyEnum.Easy,
        startItemNo: number = 1,
        pageSize: number = 10
    ): Promise<QuestionModel[]> {
        let query = null;

        if (!categoryIds || !categoryIds.length) {
            throw new Error('You cannot fetch questions without specifying at least one category ID');
        }

        if (Array.isArray(categoryIds)) {
            categoryIds.forEach(categoryId => {
                query = this._collection
                    .where('categoryId', '==', categoryId);
            });
        } else {
            query = this._collection
                .where('categoryId', '==', categoryIds);
        }

        return (query || this._collection)
            .where('difficulty', '==', difficulty)
            .orderBy('_id')
            .startAt(startItemNo)
            .limit(pageSize)
            .get()
            .then((questions: QuerySnapshot) => {
                // Load all questions from DB
                return questions.docs.map((doc: QueryDocumentSnapshot) => {
                    const question = doc.data();

                    return new QuestionModel(
                        question._id,
                        question.question,
                        question.categoryId,
                        question.difficulty,
                        question.possibleAnswers,
                        question.correctAnswer,
                        question.approval,
                        question.createdOn,
                        question.createdBy,
                        question.updatedOn,
                        question.updatedBy
                    );
                });
            });
    }

    getMultipleQuestionsById(documentReferences: DocumentReference[]) {
        if (!documentReferences || !documentReferences.length) {
            throw new Error('No document references were provided, and therefore no documents can be found');
        }

        return this._collection.firestore.getAll(...documentReferences)
            .then((questions: DocumentSnapshot[]) => {
                return questions.map((doc: DocumentSnapshot) => {
                    const question = doc.data();

                    if (!question) {
                        return new QuestionModel('NA', '', 'NA');
                    }

                    return new QuestionModel(
                        question._id,
                        question.question,
                        question.categoryId,
                        question.difficulty,
                        question.possibleAnswers,
                        question.correctAnswer,
                        question.approval,
                        question.createdOn,
                        question.createdBy,
                        question.updatedOn,
                        question.updatedBy
                    );
                });
            })
    }

    getSpecificQuestion(id: string, response: Response): Promise<QuestionModel> {
        return this._collection
            .where('_id', '==', id)
            .get()
            .then((snapshot: QuerySnapshot) => {
                if (!snapshot || !snapshot.size) {
                    throw new Error('Could not find question with ID: ' + id);
                }

                const question = snapshot.docs[0].data();

                return new QuestionModel(
                    question._id,
                    question.question,
                    question.categoryId,
                    question.difficulty,
                    question.possibleAnswers,
                    question.correctAnswer,
                    question.approval,
                    question.createdOn,
                    question.createdBy,
                    question.updatedOn,
                    question.updatedBy
                );
            });
    }

    // WRITE
    setQuestion(documentReference: DocumentReference, question: QuestionModel): Promise<WriteResult> {
        if (!documentReference) {
            throw new Error('You can only add a question to an existing document reference');
        }

        if (!question) {
            throw new Error('There was no \'question\' object passed in to add to the database');
        }

        question._id = documentReference.id;

        const jsonifiedQuestion = parseJsonModel(question);

        return documentReference
            .set(jsonifiedQuestion);
    }
}
