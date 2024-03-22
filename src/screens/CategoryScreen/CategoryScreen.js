import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

const CategoryScreen = ({ building, navigation }) => {
  const handleQualityControlPress = () => {
    navigation.navigate("QualityControlScreen");
  };

  const handleDropMarkingPress = () => {
    navigation.navigate("Building"); // Navigate back to HomeScreen
  };
  return (
    <View>
      <TouchableOpacity
        style={{
          backgroundColor: "grey",
          padding: 10,
          borderRadius: 5,
          margin: 10,
        }}
        onPress={handleQualityControlPress}
      >
        <Text style={{ color: "white" }}>Quality Control</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "grey",
          padding: 10,
          borderRadius: 5,
          margin: 10,
        }}
        onPress={handleDropMarkingPress}
      >
        <Text style={{ color: "white" }}>Drop Marking</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CategoryScreen;
