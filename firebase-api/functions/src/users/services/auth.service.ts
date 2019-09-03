import * as firebase from 'firebase';
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;

export class AuthService {
    provider: GoogleAuthProvider;

    constructor() {
        this.provider = new GoogleAuthProvider();

        this.provider.addScope('email');
        this.provider.addScope('profile');
    }
}
