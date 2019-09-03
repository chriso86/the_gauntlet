import * as express from "express";
import {JsonResponse} from "../global/models/json-response.model";
import {ScoresGateway} from "./gateways/scores.gateway";
import {ScoresModel} from "./models/scores.model";
import {Request, Response} from "firebase-functions";
import {PAGING} from "../global/constants";
import {calculatePagingStart} from "../global/helpers/paging";

export const scoreRouter = express.Router();
const scoresGateway: ScoresGateway = new ScoresGateway();

/**
 * Get scores for a player
 *
 * @param {string} userId                   The ID of the user
 * @param {string} pageSize                 The number of items on a page
 * @param {string} pageNo                   The page number to get
 */
scoreRouter.get('/GetScores', (request: Request, response: Response) => {
    const userId = request.query.userId;
    const pageSize: number = parseInt(request.query.pageSize || PAGING.pageSize);
    const pageNo: number = parseInt(request.query.pageNo || PAGING.firstPageDefault);
    const startItemNo = calculatePagingStart(pageSize, pageNo);

    scoresGateway.getScoresForPlayer(userId, startItemNo, pageSize)
        .then((scores: ScoresModel[]) => {
            response.send(
                new JsonResponse(scores)
            );
        });
});
