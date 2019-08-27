import {CategoryModel} from "../models/category.model";
import {
    DocumentReference,
    CollectionReference,
    QueryDocumentSnapshot,
    QuerySnapshot,
    DocumentSnapshot,
    WriteResult
} from "@google-cloud/firestore";
import * as admin from "firebase-admin";

export class CategoriesGateway {
    private _db = admin.firestore();
    private _collection: CollectionReference = this._db.collection('categories');

    // READ
    getDocumentReference(id: string) {
        return this._collection.doc(id);
    }

    getNewDocumentReference(): DocumentReference {
        return this._collection.doc();
    }

    getCategories(startItemNo: number = 1, pageSize: number = 10): Promise<void | CategoryModel[]> {
        return this._collection
            .orderBy('name')
            .startAt(startItemNo)
            .limit(pageSize)
            .get()
            .then((categories: QuerySnapshot) => {
                // Load all categories from DB
                return categories.docs.map((doc: QueryDocumentSnapshot) => {
                    const category = doc.data();

                    return new CategoryModel(doc.id, category.name, category.description);
                });
            });
    }

    getMultipleCategoriesById(documentReferences: DocumentReference[]) {
        if (!documentReferences || !documentReferences.length) {
            throw new Error('No document references were provided, and therefore no documents can be found');
        }

        return this._collection.firestore.getAll(...documentReferences)
            .then((categories: DocumentSnapshot[]) => {
                return categories.map((doc: DocumentSnapshot) => {
                    const category = doc.data();
                    const name = category && category.name;
                    const description = category && category.description;

                    return new CategoryModel(doc.id, name, description);
                });
            })
    }

    getSpecificCategory(id: string): Promise<void | CategoryModel> {
        return this._collection
            .where('_id', '==', id)
            .get()
            .then((category: QuerySnapshot) => {
                if (!category || !category.size) {
                    throw new Error('Could not find category with ID: ' + id);
                }

                const doc = category.docs[0].data();
                return new CategoryModel(
                    category.docs[0].id,
                    doc.name,
                    doc.description
                );
            });
    }

    // WRITE
    static setCategory(documentReference: DocumentReference, category: CategoryModel): Promise<WriteResult> {
        if (!documentReference) {
            throw new Error('You can only add a category to an existing document reference');
        }

        if (!category) {
            throw new Error('There was no \'category\' object passed in to add to the database');
        }

        return documentReference
            .set(category);
    }
}
