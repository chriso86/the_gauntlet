import {CollectionReference, DocumentReference} from "@google-cloud/firestore";
import * as admin from "firebase-admin";

export class BaseGateway {
    _db = admin.firestore();
    _collection: CollectionReference = this._db.collection('questions');

    getDocumentReference(id: string) {
        return this._collection.doc(id);
    }

    getNewDocumentReference(): DocumentReference {
        return this._collection.doc();
    }
}
