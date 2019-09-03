import {Request, Response} from "firebase-functions";
import * as express from 'express';
import {JsonResponse} from "../global/models/json-response.model";
import {UsersGateway} from "./gateways/users.gateway";
import {UserModel} from "./models/user.model";
import {UserTypeEnum} from "./enums/user-type.enum";
import {calculatePagingStart} from "../global/helpers/paging";

export const userRouter = express.Router();
const usersGateway: UsersGateway = new UsersGateway();

/**
 * Get users information
 *
 * @param(optional) {string[]} userIds               The Quiz that the request is referring to
 */
userRouter.post('/GetUsers', (request: Request, response: Response) => {
    const userIds = request.body.userIds;
    const userId = userIds && userIds && userIds.length === 1 ? userIds[0] : null;

    // Return single user
    if (userId) {
        usersGateway.getSpecificUser(userId)
            .then((user: UserModel | void) => {
                response.send(
                    new JsonResponse(user)
                );
            });
    }

    // Return multiple users
    const pageSize: number = parseInt(request.body.pageSize);
    const pageNo: number = parseInt(request.body.pageNo);
    const startItemNo = calculatePagingStart(pageSize, pageNo);

    usersGateway.getUsers(userIds, startItemNo, pageSize)
        .then((users: UserModel[] | void) => {
            response.send(
                new JsonResponse(users)
            );
        });
});

/**
 * Add a new user to the DB
 *
 * @param {string} username                The new users username or handle
 * @param {Blob} picture                   The image blob selected by the user
 * @param {string} email                   The email address of the new user
 * @param {string} bio                     The bio of the new user
 */
userRouter.post('/AddUser', (request: Request, response: Response) => {
    const username = request.body.username;
    const picture = request.body.picture;
    const email = request.body.email;
    const bio = request.body.bio;

    const newDocumentSpace = usersGateway.getNewDocumentReference();
    const mappedUser = new UserModel(
        newDocumentSpace.id,
        UserTypeEnum.Prey,
        username,
        picture,
        email,
        bio
    );

    if (newDocumentSpace && mappedUser) {
        usersGateway.setUser(newDocumentSpace, mappedUser)
            .then(() => {
                response.send(
                    new JsonResponse(mappedUser._id)
                );
            });
    }
});
