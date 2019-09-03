import {CategoryModel} from "../models/category.model";
import {
    DocumentReference,
    QueryDocumentSnapshot,
    QuerySnapshot,
    WriteResult
} from "@google-cloud/firestore";
import {BaseGateway} from "../../global/gateways/base.gateway";
import {parseJsonModel} from "../../global/helpers/json-parser";

export class CategoriesGateway extends BaseGateway {
    constructor() {
        super();

        this._collection = this._db.collection('category');
    }

    // READ
    getCategories(startItemNo: number = 1, pageSize: number = 10): Promise<CategoryModel[]> {
        return this._collection
            .orderBy('name')
            .startAt(startItemNo)
            .limit(pageSize)
            .get()
            .then((categories: QuerySnapshot) => {
                // Load all categories from DB
                return categories.docs.map((doc: QueryDocumentSnapshot) => {
                    const category = doc.data();

                    return new CategoryModel(category._id, category.name, category.description);
                });
            });
    }

    getSpecificCategory(id: string): Promise<CategoryModel> {
        return this._collection
            .where('_id', '==', id)
            .get()
            .then((snapshot: QuerySnapshot) => {
                if (!snapshot || !snapshot.size) {
                    throw new Error('Could not find category with ID: ' + id);
                }

                const question = snapshot.docs[0].data();

                return new CategoryModel(
                    question._id,
                    question.name,
                    question.description
                );
            });
    }

    // WRITE
    setCategory(documentReference: DocumentReference, category: CategoryModel): Promise<WriteResult> {
        if (!documentReference) {
            throw new Error('You can only add a category to an existing document reference');
        }

        if (!category) {
            throw new Error('There was no \'category\' object passed in to add to the database');
        }

        const jsonifiedCategory = parseJsonModel(category);

        return documentReference
            .set(jsonifiedCategory);
    }
}
