import {BaseGateway} from "../../global/gateways/base.gateway";
import {DocumentReference, QueryDocumentSnapshot, QuerySnapshot, WriteResult} from "@google-cloud/firestore";
import {UserModel} from "../models/user.model";

export class UsersGateway extends BaseGateway {
    constructor() {
        super();

        this._collection = this._db.collection('user');
    }

    // READ
    getUsers(userIds: string[], startItemNo: number = 1, pageSize: number = 10): Promise<UserModel[]> {
        let query = null;

        if (!userIds || !userIds.length) {
            throw new Error('You cannot fetch users without specifying at least one user ID');
        }

        userIds.forEach(userId => {
            query = this._collection
                .where('_id', '==', userId);
        });

        return (query || this._collection)
            .orderBy('handle')
            .startAt(startItemNo)
            .limit(pageSize)
            .get()
            .then((snapshot: QuerySnapshot) => {
                // Load all users from DB
                return snapshot.docs.map((doc: QueryDocumentSnapshot) => {
                    const user = doc.data();

                    return new UserModel(
                        user._id,
                        user.type,
                        user.handle,
                        user.picture,
                        user.email,
                        user.bio,
                        user.createdBy,
                        user.createdOn,
                        user.updatedBy,
                        user.updatedOn
                    );
                });
            });
    }

    getSpecificUser(id: string): Promise<UserModel> {
        return this._collection
            .where('_id', '==', id)
            .get()
            .then((snapshot: QuerySnapshot) => {
                if (!snapshot || !snapshot.size) {
                    throw new Error('Could not find category with ID: ' + id);
                }

                const user = snapshot.docs[0].data();

                return new UserModel(
                    user._id,
                    user.type,
                    user.handle,
                    user.picture,
                    user.email,
                    user.bio,
                    user.createdBy,
                    user.createdOn,
                    user.updatedBy,
                    user.updatedOn
                );
            });
    }

    static setUser(documentReference: DocumentReference, user: UserModel): Promise<WriteResult> {
        if (!documentReference) {
            throw new Error('You can only add a user to an existing document reference');
        }

        if (!user) {
            throw new Error('There was no \'user\' object passed in to add to the database');
        }

        return documentReference
            .set(user);
    }
}
