import app from 'firebase/app'
import 'firebase/auth'

import { firebaseConfig as config } from '../config'

class FirebaseApi {
    constructor() {
        app.initializeApp(config)
        this.auth = app.auth()
    }

    signUp = (email, password) => {
        return this.auth.createUserWithEmailAndPassword(email, password)
    }

    signIn = (email, password) => {
        return this.auth.signInWithEmailAndPassword(email, password)
    }

    signOut = () => {
        return this.auth.signOut()
    }
}

const firebaseApi = new FirebaseApi()

export default firebaseApi