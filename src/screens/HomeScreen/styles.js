import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5e99fa',

  },
  searchBox: {
    height: 50,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },

  recentlyViewBox: {
    height: 200,
    marginHorizontal: 20,
    marginBottom: 20
  },
  allBuildingsBox: {
    flex: 1,
    marginHorizontal: 20
  },
  searchInput: {
    color: '#fff',
    flex: 1
  },
  recentlyViewText: {
    color: '#fff',
    fontSize: 25,
    marginBottom: 20
  },
  footer: {
    height: 30,
    margin: 20
  },
  footerText: {
    textAlign: 'center',
    color: '#fff'
  }
});
