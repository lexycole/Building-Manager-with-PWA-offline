import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    textAlign: "center",
    paddingVertical: 10
  },
  section: {
    backgroundColor: "#FFFFFF",
    marginVertical: 15,
  },
  title: {
    fontSize: 30,
  },
  date: {
    fontSize: 20,
    fontStyle: "italic",
  },
  picker: {
    width: 350,
    height: 50,
    borderRadius: 10,
    marginTop: 5,
    color: "black",
    backgroundColor: "#F6F6F6",
  },
  input: {
    width: 350,
    height: 40,
    borderRadius: 10,
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#E8EAE6",
    borderWidth: 1,
    paddingHorizontal: 10
  },
  commentInput: {
    width: 350,
    height: 100,
    borderRadius: 10,
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#E8EAE6",
    borderWidth: 1,
    padding: 10
  },
  text: {
    fontSize: 20,
  },
  button1: {
    height: 59,
    borderRadius: 10,
    justifyContent: "center",
    width: 200,
    marginTop: 20,
  },
  start1: {
    color: "rgba(255,255,255,1)",
    alignSelf: "center",
  },
  iosButton: {
    width: 350,
    height: 50,
    borderRadius: 10,
    marginTop: 5,
    backgroundColor: "#F6F6F6",
    justifyContent: 'center'
  },
  iosButtonText: {
    color: 'black',
    paddingHorizontal: 10
  }
});
