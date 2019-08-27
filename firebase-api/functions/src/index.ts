import * as functions from 'firebase-functions';
import * as connection from './connection';
import * as express from 'express';
import * as bodyParser from "body-parser";
import * as admin from 'firebase-admin';
import { router } from './questions/questions.routes';

admin.firestore().settings({timestampsInSnapshots: true});

const adminLocal = connection;
const app = express();
const main = express();

console.log(adminLocal);

app.use('/questions', router);

main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

// webApi is your functions name, and you will pass main as
// a parameter
export const webApi = functions.https.onRequest(main);
