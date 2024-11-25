import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyAmy-AmnZBwZKsRL7ds8PysyPo4Wahzo1A",
  authDomain: "todo-app-588f7.firebaseapp.com",
  projectId: "todo-app-588f7",
  storageBucket: "todo-app-588f7.firebasestorage.app",
  messagingSenderId: "10350077228",
  appId: "1:10350077228:web:1ac7b5ad6976f54b577889"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
