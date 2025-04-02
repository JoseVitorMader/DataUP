import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCLEL9RdqRoop0n2Dc2c0bqzsKagv4ZaCU",
  authDomain: "tanamedida-2e7a3.firebaseapp.com",
  databaseURL: "https://tanamedida-2e7a3-default-rtdb.firebaseio.com",
  projectId: "tanamedida-2e7a3",
  storageBucket: "tanamedida-2e7a3.appspot.com",
  messagingSenderId: "490709823146",
  appId: "1:490709823146:web:a3c389cab4954757f5aad3",
  measurementId: "G-QP4XP50HGR"
};

// Inicializa o Firebase apenas uma vez
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };