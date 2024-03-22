import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    flex: 1,
    marginLeft: 20,
    marginVertical: 50,
    overflow: 'hidden'
  },
  textArea: {
    flex: 1,
    alignItems: 'center',
    padding: 50,
    marginRight: 20,
    marginBottom: 10
  },
  clickHereText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15
  },
  cleanNameText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff'
  }
});
