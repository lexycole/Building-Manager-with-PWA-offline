import React, { useState } from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { firebaseApp } from "../../firebase/config";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import logo from '../../assets/images/wc-logo.png'
import ScreenImageBackground from "../../components/ScreenImageBackground";
import { authActions } from "../../store/auth-slice";
import styles from "./styles";

export default function LoginScreen({ navigation }) {
  const auth = getAuth(firebaseApp);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onLoginPress = () => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        dispatch(authActions.authenticate({ isAuth: true }));
        navigation.navigate("Home");
        setLoading(false);
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      enableOnAndroid={true}
      automaticallyAdjustContentInsets={true}
      enableAutomaticScroll={(Platform.OS === 'ios')}
    // style={{width: Platform.OS === 'web' ? '50%' : '100%', margin: 'auto'}}
    >
      <View style={styles.container}>

        <ScreenImageBackground>
          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} />
          </View>

          <View style={styles.loginContainer}>
            <View style={styles.loginForm}>
              <Text style={styles.loginTitle}>LOGIN</Text>
              <Text style={styles.loginSubTitle}>Sign in to continue</Text>

              <Text style={styles.inputLabel}>PLEASE ENTER YOUR EMAIL</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => setEmail(text)}
                value={email}
                autoCapitalize="none"
              />

              <Text style={styles.inputLabel}>PLEASE ENTER YOUR PASSWORD</Text>
              <TextInput
                style={styles.textInput} secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
                value={password}
                autoCapitalize="none"
              />

              <TouchableOpacity style={styles.loginButton} onPress={() => onLoginPress()}>
                <Text style={styles.loginText}>Login</Text>
                <AntDesign name="arrowright" size={24} color="white" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("ResetPassword")} >
                <Text style={styles.inputLabel}>FORGOT PASSWORD?</Text>
              </TouchableOpacity>

            </View>
          </View>
        </ScreenImageBackground>
      </View>
    </KeyboardAwareScrollView>
  );
}
