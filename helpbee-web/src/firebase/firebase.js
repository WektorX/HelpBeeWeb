import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { firebaseConfig } from "./firebaseConfig"
//eslint-disable-next-line
let app;

if (firebase.apps.length === 0) {
    //eslint-disable-next-line
    app = firebase.initializeApp(firebaseConfig);
} else {
    //eslint-disable-next-line
    app = firebase.app();
}

const auth = firebase.auth();


export { auth };