import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyB0d2SXzgSMINnRBjpJQzPHxVv15JtD2HM',
  authDomain: 'vambe-auth.firebaseapp.com',
  projectId: 'vambe-auth',
  storageBucket: 'vambe-auth.appspot.com',
  messagingSenderId: '552578267253',
  appId: '1:552578267253:web:9e6f584f2c224255c2a03c',
  measurementId: 'G-C343RPLD13',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// let auth; 

// try {
//   auth = getAuth(app);
// } catch (error) {
//     console.error(error);
// };



export { auth };
