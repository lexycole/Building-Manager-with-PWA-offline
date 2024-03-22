import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
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

});
