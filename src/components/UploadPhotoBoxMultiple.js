import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

const UploadPhotoBoxMultiple = ({
  pickImage,
  selectedImages,
  onImagesUpload,
}) => {
  const handleUploadImages = async () => {
    const selectedFiles = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      multiple: true,
    });
    if (!selectedFiles.canceled) {
      onImagesUpload(selectedFiles);
    }
  };

  return (
    <View style={styles.container}>
      {selectedImages.map((imageUri, imageIndex) => (
        <Image
          key={imageIndex}
          source={{ uri: imageUri }}
          style={styles.uploadedImage}
        />
      ))}
      <TouchableOpacity style={styles.button} onPress={() => pickImage()}>
        <Text>Select Images</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleUploadImages}>
        <Text>Upload Images</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  uploadedImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  button: {
    backgroundColor: "#DDDDDD",
    padding: 10,
    marginRight: 10,
  },
});

export default UploadPhotoBoxMultiple;
