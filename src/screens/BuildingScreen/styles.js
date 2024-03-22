import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 542,
    marginHorizontal: 'auto',
    overflow: 'hidden'
  },
  threeDModelBox: {
    height: 250,
    display: Platform.OS === 'web' ? 'block' : 'none'
  },
  infoBox: {
    flex: 1,
    marginHorizontal: 30,
    position: 'relative',
    top: Platform.OS === 'web' ? -30 : 30
  },
  buildingDetailsBox: {
    marginTop: 20,
    marginHorizontal: 40
  },
  buildingName: {
    fontSize: 25,
    fontWeight: '700'
  },
  buildingAddress: {
    fontWeight: '500'
  }
});
