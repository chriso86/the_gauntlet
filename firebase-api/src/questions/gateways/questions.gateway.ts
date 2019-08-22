import {QuestionModel} from "../models/question.model";
import {db} from "../../global/db";
import {
    DocumentReference,
    CollectionReference,
    QueryDocumentSnapshot,
    QuerySnapshot,
    DocumentSnapshot,
    WriteResult
} from "@google-cloud/firestore";
import {DifficultyEnum} from "../enums/difficulty.enum";

export class QuestionsGateway {
    private _collection: CollectionReference = db.collection('questions');

    // READ
    getDocumentReference(id: string) {
        return this._collection.doc(id);
    }

    getNewDocumentReference(): DocumentReference {
        return this._collection.doc();
    }

    getQuestions(categoryId: string, difficulty: DifficultyEnum, startItemNo: number = 1, pageSize: number = 10): Promise<void | QuestionModel[]> {
        return this._collection
            .where('categoryId', '==', categoryId)
            .where('difficulty', '==', difficulty)
            .orderBy('_id')
            .startAt(startItemNo)
            .limit(pageSize)
            .get()
            .then((questions: QuerySnapshot) => {
                // Load all questions from DB
                return questions.docs.map((doc: QueryDocumentSnapshot) => {
                    const question = doc.data();

                    return new QuestionModel(doc.id, question.question, question.possibleAnswers);
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

                    return new QuestionModel(doc.id, question.question, question.possibleAnswers);
                });
            })
    }

    getSpecificQuestion(id: string): Promise<void | QuestionModel> {
        return this._collection
            .where('_id', '==', id)
            .get()
            .then((question: QuerySnapshot) => {
                if (!question || !question.size) {
                    throw new Error('Could not find question with ID: ' + id);
                }

                const doc = question.docs[0].data();
                return new QuestionModel(
                    question.docs[0].id,
                    doc.question,
                    doc.possibleAnswers
                );
            });
    }

    // WRITE
    static setQuestion(documentReference: DocumentReference, question: QuestionModel): Promise<WriteResult> {
        if (!documentReference) {
            throw new Error('You can only add a question to an existing document reference');
        }

        if (!question) {
            throw new Error('There was no \'question\' object passed in to add to the database');
        }

        return documentReference
            .set(question);
    }
}
