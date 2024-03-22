import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    textAlign: "center",
    paddingVertical: 10,
    paddingHorizontal: 30
  },
  title: {
    fontSize: 30,
  },
  date: {
    fontSize: 20,
    fontStyle: "italic",
  },
  section: {
    marginVertical: 10,
    marginHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  picker: {
    width: 200,
    height: 50,
    borderRadius: 10,
    marginTop: 5,
    color: "black",
    backgroundColor: "#F6F6F6",
  },
  iosButton: {
    width: 200,
    height: 50,
    borderRadius: 10,
    marginTop: 5,
    backgroundColor: "#F6F6F6",
    justifyContent: 'center'
  },
  iosButtonText: {
    color: 'black',
    paddingHorizontal: 10
  },
  checkpoint: {
    textAlign: 'left',
    fontSize: 18,
    marginBottom: 5
  },
  submitButton: {
    height: 59,
    borderRadius: 10,
    justifyContent: "center",
    width: 200,
    marginTop: 20,
    alignSelf: 'center'
  },
  submitButtonText: {
    color: '#fff',
    alignSelf: 'center'
  },
  commentInput: {
    width: 300,
    height: 100,
    borderRadius: 10,
    backgroundColor: "white",
    marginTop: 10,
    borderColor: "#E8EAE6",
    borderWidth: 1,
    padding: 10,
    alignSelf: 'center'
  }
});
