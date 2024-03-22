import { initializeApp } from "firebase/app";

import { isInProductionEnvironment } from "../utils/helpers/environment";

const firebaseConfig = isInProductionEnvironment()
  ? {
      apiKey: "",
      authDomain: "",
      databaseURL: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: "",
      measurementId: "",
    }
  : {
      apiKey: "",
      authDomain: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: "",
    };

const firebaseApp = initializeApp(firebaseConfig, {
  persistence: true,
});

export { firebaseApp };
