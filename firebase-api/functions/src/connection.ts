import * as admin from "firebase-admin";

var serviceAccount = require('../private/service-account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export default admin;
