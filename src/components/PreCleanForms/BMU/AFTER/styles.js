import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    alignContent: "center",
  },
  picker: {
    width: 300,
    height: 50,
    borderRadius: 10,
    marginTop: 20,
    color: "black",
  },
  commentInput: {
    backgroundColor: "#E1E5EA",
    width: 300,
    height: 50,
    borderRadius: 10,
    marginTop: 10,
  },
  submitBox: {
    marginTop: 15,
  },
  submitButton: {
    height: 59,
    backgroundColor: "rgba(21,105,255,1)",
    borderRadius: 10,
    justifyContent: "center",
    width: 200,
    marginTop: 20,
  },
  submitText: {
    color: "rgba(255,255,255,1)",
    alignSelf: "center",
  },
  section: {
    marginTop: 20,
    alignItems: "center",
  },
  text: {
    fontSize: 17,
  },
});
