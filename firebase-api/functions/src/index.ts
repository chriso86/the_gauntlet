import * as functions from 'firebase-functions';
import * as connection from './connection';
import * as express from 'express';
import * as bodyParser from "body-parser";
import * as admin from 'firebase-admin';
import {questionRouter} from './questions/questions.routes';
import {userRouter} from './users/users.routes';
import {categoryRouter} from "./categories/categories.routes";
import {quizRouter} from "./quiz/quiz.routes";
import {scoreRouter} from "./scores/scores.routes";

admin.firestore().settings({timestampsInSnapshots: true});

const adminLocal = connection;
const app = express();
const main = express();

console.log(adminLocal);

app.use('/Category', categoryRouter);
app.use('/Question', questionRouter);
app.use('/Quiz', quizRouter);
app.use('/Score', scoreRouter);
app.use('/User', userRouter);

main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({extended: false}));

// webApi is your functions name, and you will pass main as
// a parameter
export const webApi = functions.https.onRequest(main);
