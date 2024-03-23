                                                                // PART1 : Initialize App

// we have to initialize a instance of firebase here...

import { initializeApp } from "firebase/app";


const firebaseConfig = {                                    // configuration given by firebase to our account 
    apiKey: import.meta.env.VITE_APP_API_KEY,
    authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_APP_PROJECT_ID,
    storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
                                                                // PART2 : Create a key

// will be using authentication service of firebase(SDK) here...which is in auth module of firebase
import { getAuth} from "firebase/auth";

const auth = getAuth(); // auth is a key ( authentication is encapsulated in it)

                                                                // PART3: Google auth
import { GoogleAuthProvider } from "firebase/auth";
const provider = new GoogleAuthProvider();
                                                                // PART4: Connection With Database
import { getFirestore } from "firebase/firestore";

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { auth , provider , db }; // exporting all the keys to be used in other files