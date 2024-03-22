import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  Platform,
  StyleSheet,
  ScrollView,
  Picker,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import UploadPhotoBox from "../../components/UploadPhotoBox";
import { firebaseApp } from "../../firebase/config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  doc,
  collection,
  getFirestore,
  addDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { SelectList } from "react-native-dropdown-select-list";
import NetInfo from '@react-native-community/netinfo';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';


const QualityControlWizardForm = ({ route }) => {

  const { selectedArea, selectedFloor, auditFormToComplete, selectedBuilding } =
    route.params;

  const [auditId, setAuditId] = useState(auditFormToComplete.doc_id);
  const [loading, setLoading] = useState(false);

  const userUid = useSelector((state) => state.auth.uid);

  const [areaBeingAuditted, setAreaBeingAuditted] = useState(
    auditFormToComplete.areas
      .find((area) => area.areaName === selectedArea)
      .items.map((item) => ({
        itemName: item,
        score: "",
        comment: "",
        imageUrls: "",
      }))
  );

  const db = getFirestore(firebaseApp);
  const storage = getStorage();
  const buildingRef = doc(db, "BuildingsX", selectedBuilding);
  const auditRef = collection(buildingRef, "audit", auditId, "responses");
  const [allScoresFilled, setAllScoresFilled] = useState(false);

  const pickerStyles = StyleSheet.create({
    pickerContainer: {
      borderColor: "lightgrey",
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor: "#fff",
      paddingHorizontal: 10,
      height: 40,
    },
    picker: {
      flex: 1,
    },
    pickerItem: {
      fontSize: 16,
    },
  });


  useEffect(() => {
    const areAllScoresFilled = areaBeingAuditted.every(
      (item) => item.score !== ""
    );
    setAllScoresFilled(areAllScoresFilled);
  }, [areaBeingAuditted]);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry");
        }
      }
    })();
  }, []);

  const filteredArea = auditFormToComplete.areas.find(
    (area) => area.areaName === selectedArea
  );
  const filteredFloor = filteredArea.floors.includes(selectedFloor)
    ? selectedFloor
    : null;


  const handleQuestionChange = (index, property, value) => {
    const updatedAreaBeingAuditted = [...areaBeingAuditted];
    updatedAreaBeingAuditted[index][property] = value;
    setAreaBeingAuditted(updatedAreaBeingAuditted);
  };

  const handleImageChange = (index, newImages) => {
    const updatedAreaBeingAuditted = [...areaBeingAuditted];
    updatedAreaBeingAuditted[index].image = newImages;
    setAreaBeingAuditted(updatedAreaBeingAuditted);
  };

  const pickImage = async (index) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.canceled) {
      handleImageChange(index, result.uri);
    }
  };

  const submitHandler = async () => {
    try {
      setLoading(true);
      const netInfoState = await NetInfo.fetch();
      
      if (!netInfoState.isConnected) {
        setLoading(false);
  
        const responseData = {
          areaName: selectedArea,
          floor: selectedFloor,
          createdAt: Timestamp.fromDate(new Date()),
          items: await Promise.all(
            areaBeingAuditted.map(async (question) => {
              let imageDownloadUrl = null;
  
              if (question.image) {
                imageDownloadUrl = await uploadImageAndGetDownloadUrl(
                  question.image,
                  question.itemName
                );
              }
  
              const score =
                question.score === null || question.score === "N/A"
                  ? question.score
                  : parseFloat(question.score);
  
              return {
                itemName: question.itemName,
                score: score,
                comment: question.comment,
                imageUrls: imageDownloadUrl ? [imageDownloadUrl] : [],
              };
            })
          ),
          uid: userUid,
          doc_id: null,
        };
        nsole.log(responseData, 'responseData4')
        await AsyncStorage.setItem('auditData', JSON.stringify(responseData));
  
        if (Platform.OS === 'web') {
          alert('You are offline but your data is saved. Please reconnect and refresh to submit your data online.')
          navigation.navigate("Building");
        } else {
          Alert.alert('You are offline but your data is saved. Please reconnect and refresh to submit your data online.', alertMessage, [{ title: 'OK', onPress: navigation.navigate("Building", { name: buildingName }) }])
        }
      } else {
        setLoading(true);
        const responseData = {
          areaName: selectedArea,
          floor: selectedFloor,
          createdAt: Timestamp.fromDate(new Date()),
          items: await Promise.all(
            areaBeingAuditted.map(async (question) => {
              let imageDownloadUrl = null;
  
              if (question.image) {
                imageDownloadUrl = await uploadImageAndGetDownloadUrl(
                  question.image,
                  question.itemName
                );
              }
  
              const score =
                question.score === null || question.score === "N/A"
                  ? question.score
                  : parseFloat(question.score);
  
              return {
                itemName: question.itemName,
                score: score,
                comment: question.comment,
                imageUrls: imageDownloadUrl ? [imageDownloadUrl] : [],
              };
            })
          ),
          uid: userUid,
          doc_id: null,
        }
  
        // Synchronize form data with Firebase
        const docRef = await addDoc(auditRef, responseData);
        await updateDoc(docRef, { doc_id: docRef.id });
        submitted(); 
        await AsyncStorage.removeItem('auditData'); 
      
      }
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  

  const submitted = () => {
    const alertMessage = `Thank You! Your Audit Has Been Submitted`;

    if (Platform.OS === "web") {
      alert(alertMessage);
      setLoading(false);
      navigation.navigate("Building");
    } else {
      Alert.alert("Done", alertMessage, [
        {
          text: "OK",
          onPress: () => {
            setLoading(false);
            navigation.navigate("Building");
          },
        },
      ]);
    }
  };

  const uploadImageAndGetDownloadUrl = async (image, itemName) => {
    const response = await fetch(image);
    const blob = await response.blob();

    const imageRef = ref(
      storage,
      `quality-control/${selectedBuilding}/${selectedFloor}/${selectedArea}/${itemName}`
    );

    const snapshot = await uploadBytes(imageRef, blob);
    const imageUrl = await getDownloadURL(snapshot.ref);

    return imageUrl;
  };



  if (loading)
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#5e99fa" />
    );

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      enableOnAndroid={true}
      automaticallyAdjustContentInsets={true}
      enableAutomaticScroll={Platform.OS === "ios"}
    >
      <ScrollView>
        {filteredFloor &&
          areaBeingAuditted.map((question, index) => {
            return (
              <View key={index} style={styles.container}>
                <Text style={styles.questionLabel}>{question.itemName}</Text>
                <Text style={{ marginTop: 16, marginBottom: 8 }}>
                  Score: (Required*)
                </Text>

                <View style={styles.buttonsContainer}>
                  <Picker
                    selectedValue={question.score}
                    onValueChange={(value) =>
                      handleQuestionChange(index, "score", value)
                    }
                    style={pickerStyles.pickerContainer}
                  >
                    <Picker.Item label="Select Score" value={null} />
                    {Array.from(
                      { length: auditFormToComplete.itemsScoredOutOf },
                      (_, i) => i + 1
                    ).map((score) => (
                      <Picker.Item
                        key={score}
                        label={score.toString()}
                        value={score}
                      />
                    ))}
                    <Picker.Item label="N/A" value="N/A" />
                  </Picker>
                </View>
                <TextInput
                  placeholder="Comment..."
                  multiline
                  style={styles.textInput}
                  value={question.comment}
                  onChangeText={(value) =>
                    handleQuestionChange(index, "comment", value)
                  }
                />

                <UploadPhotoBox
                  pickImage={() => pickImage(index)}
                  selectedImage={question.image}
                />
              </View>
            );
          })}

        <TouchableOpacity
          style={StyleSheet.compose(
            allScoresFilled
              ? dynamicStyles.enabledButtonBox
              : dynamicStyles.disabledButtonBox,
            styles.submitButtonBox
          )}
          onPress={submitHandler}
          disabled={!allScoresFilled}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

const dynamicStyles = StyleSheet.create({
  enabledButtonBox: {
    backgroundColor: "#5e99fa",
  },
  disabledButtonBox: {
    backgroundColor: "rgba(94, 153, 250, 0.5)",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 20,
  },
  questionLabel: {
    fontSize: 20,
    marginBottom: 15,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "lightgrey",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    height: 150,
  },

  submitButtonBox: {
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default QualityControlWizardForm;
