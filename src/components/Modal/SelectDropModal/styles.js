import { StyleSheet } from "react-native";

export default StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    flex: 1,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    marginTop: 15,
    backgroundColor: "#395B64",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  picker: {
    width: 300,
    height: 50,
    borderRadius: 10,
    marginTop: 20,
    color: "black",
  },
  cleanedDropBox: {
    marginTop: 15,
    alignItems: "center",
  },
  cleanedDrop: {
    fontSize: 20,
    textAlign: "center",
  },
  button1: {
    height: 59,
    backgroundColor: "rgba(21,105,255,1)",
    borderRadius: 10,
    justifyContent: "center",
    width: 200,
    marginTop: 20,
  },
  completedButton: {
    height: 59,
    backgroundColor: "rgba(0,255,82,0.79)",
    borderRadius: 10,
    justifyContent: "center",
    width: 200,
    marginTop: 20,
  },
  start1: {
    color: "rgba(255,255,255,1)",
    alignSelf: "center",
  },
});
