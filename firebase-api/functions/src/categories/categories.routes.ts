import * as express from "express";
import {JsonResponse} from "../global/models/json-response.model";
import {CategoryModel} from "./models/category.model";
import {CategoriesGateway} from "./gateways/categories.gateway";
import {Request, Response} from "firebase-functions";
import {PAGING} from "../global/constants";
import {calculatePagingStart} from "../global/helpers/paging";

export const categoryRouter = express.Router();
const categoriesGateway: CategoriesGateway = new CategoriesGateway();
// var usersGateway = new Gate

/**
 * Get a single category
 *
 * @param(optional) {string} categoryId               The ID of the category to retrieve
 */
categoryRouter.get('/GetCategory', (request: Request, response: Response) => {
    const categoryId = request.query.categoryId;

    // Return single question
    if (categoryId) {
        categoriesGateway.getSpecificCategory(categoryId)
            .then((category: CategoryModel) => {
                response.send(
                    new JsonResponse(category)
                );
            });
    }
});

/**
 * Get a list of categories
 *
 * @param {string} pageSize                 The number of items on a page
 * @param {string} pageNo                   The page number to get
 */
categoryRouter.get('/GetAllCategories', (request: Request, response: Response) => {
    // Return multiple questions
    const pageSize: number = parseInt(request.query.pageSize|| PAGING.pageSize);
    const pageNo: number = parseInt(request.query.pageNo || PAGING.firstPageDefault);
    const startItemNo = calculatePagingStart(pageSize, pageNo);

    categoriesGateway.getCategories(startItemNo, pageSize)
        .then((questions: CategoryModel[] | void) => {
            response.send(
                new JsonResponse(questions)
            );
        });
});

/**
 * Add a new category to the DB for Quizzes
 *
 * @param {string} name                The name of the new category
 * @param {string} description         The description of the new category
 */
categoryRouter.post('/AddCategory', (request: Request, response: Response) => {
    const name = request.body.name;
    const description = request.body.description;
    const createdBy = request.body.userId;

    const newDocumentSpace = categoriesGateway.getNewDocumentReference();
    const mappedCategory = new CategoryModel(newDocumentSpace.id, name, description);

    if (newDocumentSpace && mappedCategory) {
        mappedCategory.modifyCreated(createdBy);

        categoriesGateway.setCategory(newDocumentSpace, mappedCategory)
            .then(() => {
                response.send(
                    new JsonResponse(mappedCategory._id)
                );
            });
    }
});
