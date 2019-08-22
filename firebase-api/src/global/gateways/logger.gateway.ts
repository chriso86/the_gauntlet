import { CollectionReference } from "@google-cloud/firestore";
import {db} from "../db";
import {LogEventModel} from "../models/log-event.model";

export class LoggerGateway {
    private _collection: CollectionReference = db.collection('log');

    logEvent(logEvent: LogEventModel) {
        this._collection.add(logEvent);
    }
}
