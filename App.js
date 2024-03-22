import React, { useEffect, useState } from "react";
import * as serviceWorkerRegistration from "./src/serviceWorkerRegistration";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen, HomeScreen } from "./src/screens";
import { Alert, Platform } from "react-native";
import { decode, encode } from "base-64";
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}
import { firebaseApp } from "./src/firebase/config";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDoc,
  doc,
  enablePersistence,
} from "firebase/firestore";
import { ActivityIndicator, Text, SafeAreaView } from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./src/store/index";
import { buildingListActions } from "./src/store/building-slice";
import BuildingScreen from "./src/screens/BuildingScreen/BuildingScreen";
import CleanScreen from "./src/screens/CleanScreen/CleanScreen";
import CleanAndDropSelectionScreen from "./src/screens/CleanAndDropSelectionScreen/CleanAndDropSelectionScreen";
import BuildingDashboard from "./src/screens/BuildingDashboard";
import WeatherForm from "./src/screens/WeatherForm";
import EquipmentForm from "./src/screens/EquipmentForm";
import WelcomeBackHeader from "./src/components/WelcomeBackHeader";
import DefectReportingFormScreen from "./src/screens/DefectReportingForm/DefectReportingFormScreen";
import ScheduledTasksForm from "./src/screens/ScheduledTasksForm/ScheduledTasksForm";
import SubmitScreen from "./src/screens/SubmitScreen/SubmitScreen";
import ThankYouScreen from "./src/screens/ThankYouScreen/ThankYouScreen";
import ResetPasswordScreen from "./src/screens/ResetPasswordScreen";
import SingleWindowDefectReportScreen from "./src/screens/SingleWindowDefectReportScreen";
import PPEFormScreen from "./src/screens/PPEFormScreen";
import CategoryScreen from "./src/screens/CategoryScreen/CategoryScreen";
import QualityControlScreen from "./src/screens/QualityControlScreen/QualityControlScreen";
import QualityControlWizardForm from "./src/screens/QualityControlWizardForm/QualityControlWizardForm";
import { authActions } from "./src/store/auth-slice";
import { getAccess } from "./src/utils/helpers/roles";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

const Stack = createNativeStackNavigator();

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const isAuth = useSelector((state) => state.auth.isAuth);
  const db = getFirestore(firebaseApp);

  useEffect(() => {
    const auth = getAuth(firebaseApp);

    onAuthStateChanged(auth, async (userF) => {
      if (!userF) {
        setLoading(false);
        return;
      }
      const userRef = doc(db, "UsersX", userF.uid);
      getData(userRef);
    });
  }, []);

  const getData = async (userRef) => {
    try {
      const res = await getDoc(userRef);
      const userData = res.data();

      if (!res.exists()) {
        throw new Error("No data found for user.");
      }

      if (!getAccess(userData.role)) {
        setLoading(false);
        throw new Error("Oops, you don't have permission to access this app.");
      }

      const data = {
        name: userData.name,
        profile_img: userData.profile_img,
        uid: res.id,
        role: userData.role,
        buildings: userData.access,
      };

      dispatch(authActions.authenticate({ isAuth: true }));

      dispatch(
        authActions.userData({
          name: data.name,
          roles: data.role,
          profile_img: data.profile_img,
          uid: data.uid,
        })
      );
      dispatch(
        buildingListActions.buildingsList({ buildings: data.buildings })
      );
      setLoading(false);
    } catch (error) {
      dispatch(authActions.authenticate({ isAuth: false }));
      if (Platform.OS === "web") {
        return alert(error);
      }
      return Alert.alert("Oops", error.message, [
        {
          text: "OK",
          onPress: onLogoutPress,
        },
      ]);
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      console.log("load");
      navigator.serviceWorker
        .register("./service-worker.js")

        .then((registration) => {
          console.log("Service Worker registered!", registration);
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;

            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  showUpdateNotification();
                } else {
                  console.log("Service Worker initialized for the first time.");
                }
              }
            };
          };
        })
        .catch((error) => {
          console.log("Service Worker registration failed:", error);
        });
    });
  }

  console.log();
  function showUpdateNotification() {
    const options = {
      body: "A new version of the app is available. Click to update!",
      icon: "/assests/icon.png",
    };

    if (Notification.permission === "granted") {
      new Notification("App Update", options);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("App Update", options);
        }
      });
    }
  }

  function reloadPage() {
    window.location.reload();
  }

  const onLogoutPress = () => {
    const auth = getAuth(firebaseApp);
    signOut(auth).then((r) => {
      setUser(null);
      dispatch(authActions.authenticate({ isAuth: false }));
    });
  };

  const BLUE_HEADER_OPTIONS = {
    title: "",
    headerTintColor: "#fff",
    headerStyle: {
      backgroundColor: "#5e99fa",
    },
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuth ? (
          <>
            <Stack.Screen name="Home" options={{ header: WelcomeBackHeader }}>
              {(props) => <HomeScreen {...props} extraData={user} />}
            </Stack.Screen>

            <Stack.Screen
              name="Building"
              component={BuildingScreen}
              options={BLUE_HEADER_OPTIONS}
            />
            <Stack.Screen
              name="Category"
              component={CategoryScreen}
              options={BLUE_HEADER_OPTIONS}
            />
            <Stack.Screen
              name="QualityControlScreen"
              component={QualityControlScreen}
              options={{ ...BLUE_HEADER_OPTIONS, title: "Quality Control" }}
              initialParams={{ path: "/qualityControl" }}
            />
            <Stack.Screen
              name="QualityControlWizardForm"
              component={QualityControlWizardForm}
              options={{
                ...BLUE_HEADER_OPTIONS,
                title: "Quality Control Form",
              }}
            />
            <Stack.Screen
              name="CleanAndDropSelection"
              component={CleanAndDropSelectionScreen}
              options={BLUE_HEADER_OPTIONS}
            />
            <Stack.Screen name="Dashboard" component={BuildingDashboard} />
            <Stack.Screen
              name="Weather"
              component={WeatherForm}
              options={{ ...BLUE_HEADER_OPTIONS, title: "Weather Form" }}
            />
            <Stack.Screen
              name="Equipment"
              component={EquipmentForm}
              options={{ ...BLUE_HEADER_OPTIONS, title: "Equipment Form" }}
            />
            <Stack.Screen
              name="Defects"
              component={DefectReportingFormScreen}
              options={{
                ...BLUE_HEADER_OPTIONS,
                title: "Defect Reporting Form",
              }}
            />
            <Stack.Screen
              name="SingleWindowDefect"
              component={SingleWindowDefectReportScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Schedules"
              component={ScheduledTasksForm}
              options={{
                ...BLUE_HEADER_OPTIONS,
                title: "Scheduled Tasks Form",
              }}
            />
            <Stack.Screen
              name="PPE"
              component={PPEFormScreen}
              options={{ ...BLUE_HEADER_OPTIONS, title: "PPE Checklist" }}
            />
            <Stack.Screen
              name="Clean"
              component={CleanScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Submit"
              component={SubmitScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Thanks"
              component={ThankYouScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPasswordScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppWrapper;

serviceWorkerRegistration.register();
