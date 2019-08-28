import * as express from "express";
import {JsonResponse} from "../global/models/json-response.model";
import {CategoryModel} from "./models/category.model";
import {CategoriesGateway} from "./gateways/categories.gateway";
import {Request, Response} from "firebase-functions";

export const router = express.Router();
const categoriesGateway: CategoriesGateway = new CategoriesGateway();
// var usersGateway = new Gate

/**
 * Get a single category or a list of all categories
 *
 * @param(optional) {string} categoryId               The ID of the category to retrieve
 */
router.get('/', (request: Request, response: Response) => {
    try {
        const categoryId = request.params.categoryId;

        // Return single question
        if (categoryId) {
            categoriesGateway.getSpecificCategory(categoryId)
                .then((category: CategoryModel) => {
                    response.send(
                        new JsonResponse(category)
                    );
                });
        }

        // Return multiple questions
        const pageSize: number = parseInt(request.params.pageSize);
        const pageNo: number = parseInt(request.params.pageNo);
        const startItemNo = (pageNo * pageSize) - (pageSize + 1);

        categoriesGateway.getCategories(startItemNo, pageSize)
            .then((questions: CategoryModel[] | void) => {
                response.send(
                    new JsonResponse(questions)
                );
            });
    } catch (e) {
        response.send(
            new JsonResponse(e)
        );
    }
});

/**
 * Add a new category to the DB for Quizzes
 *
 * @param {string} name                The name of the new category
 * @param {string} description         The description of the new category
 */
router.post('/', (request: Request, response: Response) => {
    try {
        const name = request.body.name;
        const description = request.body.description;
        const createdBy = request.body.userId;

        const newDocumentSpace = categoriesGateway.getNewDocumentReference();
        const mappedCategory = new CategoryModel(newDocumentSpace.id, name, description);

        if (newDocumentSpace && mappedCategory) {
            mappedCategory.modifyCreated(createdBy);

            CategoriesGateway.setCategory(newDocumentSpace, mappedCategory)
                .then(() => {
                    response.send(
                        new JsonResponse(mappedCategory._id)
                    );
                });
        }
    } catch (e) {
        response.send(
            new JsonResponse(e)
        );
    }
});
