import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "white",
    textAlign: "center",
  },
  dashboard: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  cleanNowButton: {
    height: 59,
    backgroundColor: "rgba(21,105,255,1)",
    borderRadius: 10,
    justifyContent: "center",
    width: 200,
    marginTop: 20,
  },
  buildingName: {
    fontSize: 25,
    marginBottom: 15,
  },
  cleanNowText: {
    color: "rgba(255,255,255,1)",
    alignSelf: "center",
  },
});
