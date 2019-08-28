import {BaseGateway} from "../../global/gateways/base.gateway";
import {QuizModel} from "../models/quiz.model";
import {DocumentReference, QuerySnapshot, WriteResult} from "@google-cloud/firestore";
import {parseJsonModel} from "../../global/helpers/json-parser";

export class QuizGateway extends BaseGateway {
    constructor() {
        super();

        this._collection = this._db.collection('quiz');
    }

    // READ
    getQuiz(id: string): Promise<QuizModel> {
        return this._collection
            .where('_id', '==', id)
            .get()
            .then((snapshot: QuerySnapshot) => {
                if (!snapshot || !snapshot.size) {
                    throw new Error('Could not find quiz with ID: ' + id);
                }

                const quiz = snapshot.docs[0].data();

                return new QuizModel(
                    quiz._id,
                    quiz.name,
                    quiz.hostedBy,
                    quiz.hostedOn,
                    quiz.categoryId,
                    quiz.participantIds,
                    quiz.closed,
                    quiz.createdOn,
                    quiz.createdBy,
                    quiz.updatedOn,
                    quiz.updatedBy
                );
            });
    }

    // WRITE
    static setQuiz(documentReference: DocumentReference, quiz: QuizModel): Promise<WriteResult> {
        if (!documentReference) {
            throw new Error('You can only add a quiz to an existing document reference');
        }

        if (!quiz) {
            throw new Error('There was no \'quiz\' object passed in to add to the database');
        }

        quiz._id = documentReference.id;

        const jsonifiedQuiz = parseJsonModel(quiz);

        return documentReference
            .set(jsonifiedQuiz);
    }
}
