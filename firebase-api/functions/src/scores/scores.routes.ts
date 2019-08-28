import * as express from "express";
import {JsonResponse} from "../global/models/json-response.model";
import {ScoresGateway} from "./gateways/scores.gateway";
import {ScoresModel} from "./models/scores.model";
import {Request, Response} from "firebase-functions";

export const router = express.Router();
const scoresGateway: ScoresGateway = new ScoresGateway();

router.get('/', (request: Request, response: Response) => {
    try {
        const userId = request.params.userId;
        const pageSize: number = parseInt(request.params.pageSize);
        const pageNo: number = parseInt(request.params.pageNo);
        const startItemNo = (pageNo * pageSize) - (pageSize + 1);

        scoresGateway.getScoresForPlayer(userId, startItemNo, pageSize)
            .then((scores: ScoresModel[] | void) => {
                response.send(
                    new JsonResponse(scores)
                );
            });
    } catch (e) {
        response.send(
            new JsonResponse(e)
        );
    }
});
