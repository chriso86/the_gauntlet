import { CollectionReference } from "@google-cloud/firestore";
import {LogEventModel} from "../models/log-event.model";
import * as admin from "firebase-admin";

export class LoggerGateway {
    private _db = admin.firestore();
    private _collection: CollectionReference = this._db.collection('log');

    logEvent(logEvent: LogEventModel) {
        this._collection.add(logEvent);
    }
}
