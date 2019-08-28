import {BaseGateway} from "../../global/gateways/base.gateway";
import {DocumentReference, QueryDocumentSnapshot, QuerySnapshot} from "@google-cloud/firestore";
import {ScoresModel} from "../models/scores.model";
import * as admin from "firebase-admin";
import WriteResult = admin.firestore.WriteResult;
import {parseJsonModel} from "../../global/helpers/json-parser";
import {PointsMultiplierModel} from "../../global/models/points-multiplier.model";

export class ScoresGateway extends BaseGateway {
    constructor() {
        super();

        this._collection = this._db.collection('score');
    }

    // READ
    getScoresForPlayer(userId: string, startItemNo: number = 1, pageSize: number = 10): Promise<ScoresModel[]> {
        return this._collection
            .where('userId', '==', userId)
            .orderBy('createdOn', 'desc')
            .startAt(startItemNo)
            .limit(pageSize)
            .get()
            .then((snapshot: QuerySnapshot) => {
                // Load all questions from DB
                return snapshot.docs.map((doc: QueryDocumentSnapshot) => {
                    const userScores = doc.data();

                    return new ScoresModel(
                        userScores._id,
                        userScores.quizId,
                        userScores.quizName,
                        userScores.userId,
                        userScores.totalScore,
                        userScores.numberOfQuestions,
                        userScores.createdOn,
                        userScores.createdBy,
                        userScores.updatedOn,
                        userScores.updatedBy
                    );
                });
            });
    }

    getLatestScoreForPlayer(userId: string): Promise<number> {
        return this._collection
            .where('userId', '==', userId)
            .get()
            .then((snapshot: QuerySnapshot) => {
                // Load all questions from DB
                const totalUserCorrectAnswers = snapshot.docs.reduce((memo: number, scores: QueryDocumentSnapshot) => {
                    const userScores = scores.data();

                    return memo + userScores.totalScore;
                }, 0);

                return PointsMultiplierModel.calculate(totalUserCorrectAnswers);
            });
    }

    // WRITE
    static setScores(documentReference: DocumentReference, score: ScoresModel): Promise<WriteResult> {
        if (!documentReference) {
            throw new Error('You can only add a score to an existing document reference');
        }

        if (!score) {
            throw new Error('There was no \'score\' object passed in to add to the database');
        }

        score._id = documentReference.id;

        const jsonifiedScore = parseJsonModel(score);

        return documentReference
            .set(jsonifiedScore);
    }
}
