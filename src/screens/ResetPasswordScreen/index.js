import React, { useState } from "react";
import {
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Platform,
    Alert,
    StyleSheet
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { AntDesign } from "@expo/vector-icons";
import logo from '../../assets/images/wc-logo.png'
import ScreenImageBackground from "../../components/ScreenImageBackground";

const ResetPasswordScreen = ({ navigation }) => {
    const auth = getAuth();

    const [email, setEmail] = useState("");

    const resetPasswordHandler = async () => {
        try {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!regex.test(email)) {
                throw new Error('Please enter a valid email address.')
            }
            await sendPasswordResetEmail(auth, email)
            onSuccess()
            backToSignIn()
        } catch (error) {
            if (Platform.OS === 'web') {
                alert(error.message)
              } else {
                Alert.alert('Oops', error.message)
              }
        }
    }

    const onSuccess = () => {
        const successMessage = 'Success! Please check your inbox to reset your password.'
        if (Platform.OS === 'web') {
            alert(successMessage)
          } else {
            Alert.alert('Success', successMessage)
          }
    }

    const backToSignIn = () => navigation.navigate('Login')

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{ flex: 1 }}
            enableOnAndroid={true}
            automaticallyAdjustContentInsets={true}
            enableAutomaticScroll={(Platform.OS === 'ios')}
        >
            <View style={styles.container}>

                <ScreenImageBackground>
                    <View style={styles.logoContainer}>
                        <Image source={logo} style={styles.logo} />
                    </View>

                    <View style={styles.loginContainer}>
                        <View style={styles.loginForm}>
                            <Text style={styles.loginTitle}>RESET PASSWORD</Text>
                            <Text style={styles.loginSubTitle}></Text>

                            <Text style={styles.inputLabel}>PLEASE ENTER YOUR EMAIL</Text>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(text) => setEmail(text)}
                                value={email}
                                autoCapitalize="none"
                            />

                            <TouchableOpacity style={styles.loginButton} onPress={resetPasswordHandler}>
                                <Text style={styles.loginText}>Reset</Text>
                                <AntDesign name="arrowright" size={24} color="white" />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={backToSignIn}>
                                <Text style={styles.inputLabel}>Sign In</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </ScreenImageBackground>
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logoContainer: {
        height: 200,
        justifyContent: 'flex-end',
        marginHorizontal: 40,
    },
    loginContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        marginHorizontal: 40
    },
    logo: {
        width: 90,
        height: 90,
        resizeMode: 'contain',
    },
    loginForm: {
        height: 500,
        justifyContent: 'flex-end',
        marginBottom: 50
    },
    loginTitle: {
        color: '#fff',
        fontSize: 30,
        fontWeight: '700',
        marginBottom: 1
    },
    loginSubTitle: {
        color: '#fff',
        fontSize: 25,
        marginBottom: 25
    },
    inputLabel: {
        color: '#fff',
        fontSize: 10,
        letterSpacing: 2,
        marginBottom: 10,
    },
    textInput: {
        backgroundColor: '#fff',
        height: 50,
        borderRadius: 10,
        marginBottom: 10,
        padding: 10
    },
    loginButton: {
        backgroundColor: 'grey',
        height: 60,
        marginVertical: 20,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'center'
    },
    loginText: {
        color: '#fff',
    },
})

export default ResetPasswordScreen