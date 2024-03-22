import React, { useState, useEffect } from "react";
import { View, Text, ActionSheetIOS, Platform, TouchableOpacity, TextInput, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { getFirestore, doc, collection, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseApp } from "../../firebase/config";
import UploadPhotoBox from "../../components/UploadPhotoBox";

const DefectReportingFormScreen = ({ route, navigation }) => {
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [summary, setSummary] = useState('')
  const [isOutOfService, setIsOutOfService] = useState(false)
  const [allEquipment, setAllEquipment] = useState([])
  const [image, setImage] = useState("")
  const [loading, setLoading] = useState(true)

  const userUid = useSelector((state) => state.auth.uid);

  const storage = getStorage();
  const { siteId } = route.params
  const date = new Date()
  const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

  const db = getFirestore(firebaseApp);
  const siteRef = doc(db, "BuildingsX", siteId,)

  const equipmentRef = collection(siteRef, "equipment");
  const defectsRef = collection(siteRef, "defects");

  useEffect(() => {
    getDefectOptions()
  }, [])

  const getDefectOptions = async () => {
    try {
      const allEquipment = await getDocs(equipmentRef)
      const equipmentArray = []
      const buildingDefectOption = {
        id: 'building',
        name: 'Building',
        type: 'building'
      }
      if (!allEquipment.empty) {
        allEquipment.forEach(eq => {
          equipmentArray.push({ id: eq.id, ...eq.data() })
        })
      }

      setAllEquipment([...equipmentArray, buildingDefectOption])
      setLoading(false)

    } catch (error) {
      console.log(error)
    }

  }

  const openFormMenuOnIos = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', ...allEquipment.map(e => e.name)],
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          return setSelectedEquipment('')
        }
        setSelectedEquipment(allEquipment[buttonIndex - 1].id)
      },
    );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri)
    }
  };

  const submitFormHandler = async () => {
    try {
      if (!selectedEquipment || !summary || !image) {
        throw new Error('Please make sure all fields are provided.')
      }
      const selectedEquipmentData = allEquipment.find(eq => eq.id === selectedEquipment)

      if (!selectedEquipmentData.inService && isOutOfService) {
        throw new Error('This equipment current status is out of service. If it is back to service, please untick the out of service box.')
      }

      setLoading(true)

      const uploadedImageUrl = await uploadImage(selectedEquipmentData.id)
      const documentToAdd = {
        defectReportDate: date,
        fixDate: null,
        defectType: selectedEquipmentData.type,
        inService: !isOutOfService,
        summary: summary,
        images: [uploadedImageUrl],
        completedBy: userUid,
        equipmentId: selectedEquipmentData.id === 'building' ? "" : selectedEquipmentData.id
      }
      const docRef = doc(defectsRef)

      await setDoc(docRef, documentToAdd)

      if (selectedEquipmentData.type !== "building") {
        await updateDoc(doc(equipmentRef, selectedEquipmentData.id), {
          inService: !isOutOfService,
          lastReportId: docRef.id
        })
      }

      setImage("")
      setIsOutOfService(false)
      setSelectedEquipment("")
      setSummary('')
      setLoading(false)

      const alertMessage = 'Thanks, report has been successfully submitted.'

      if (Platform.OS === 'web') {
        alert(alertMessage)
        navigation.navigate("Building");
      } else {
        Alert.alert('Thanks', alertMessage, [{ title: 'OK', onPress: navigation.navigate("Building") }])
      }

    } catch (error) {
      if (Platform.OS === 'web') {
        alert(error.message)
      } else {
        Alert.alert('Oops', error.message)
      }
    }

  };

  const uploadImage = async (equipmentId) => {
    try {
      const response = await fetch(image)
      const blob = await response.blob()

      const imageRef = ref(storage, "window-cleaning/defects" + equipmentId)

      const snapshot = await uploadBytes(imageRef, blob)
      const imageUrl = await getDownloadURL(snapshot.ref)
      return imageUrl
    } catch (error) {
      console.log(error)
    }

  }

  function isValid() {
    if (selectedEquipment !== "" && summary !== "" && image !== "") return true
    return false
  }

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size='large' color='#5e99fa' />

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      enableOnAndroid={true}
      automaticallyAdjustContentInsets={true}
      enableAutomaticScroll={(Platform.OS === 'ios')}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{siteId}</Text>
        <Text style={styles.date}>{dateString}</Text>

        <View style={styles.section}>
          <Text style={styles.text}>Please select:</Text>

          {Platform.OS === 'ios' ?
            <TouchableOpacity onPress={openFormMenuOnIos} style={styles.iosButton}>
              <Text style={styles.iosButtonText}>{selectedEquipment ? selectedEquipment : 'Please select'}</Text>
            </TouchableOpacity>

            :
            <Picker
              style={styles.picker}
              selectedValue={selectedEquipment}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedEquipment(itemValue);
              }}
            >
              <Picker.Item label="Please select" value="" />
              {allEquipment.map((d) => {
                return <Picker.Item key={d.id} label={d.name} value={d.id} />;
              })}
            </Picker>
          }

        </View>

        <View style={styles.outOfServiceBox}>
          <Text>Out of service?</Text>
          <TouchableOpacity style={styles.radioButton} onPress={() => setIsOutOfService(!isOutOfService)}>
            {isOutOfService && <AntDesign name="check" size={20} color="black" style={{ alignSelf: 'center' }} />}
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.summaryInput}
          placeholder="Summary"
          value={summary}
          numberOfLines={12}
          multiline
          textAlignVertical="top"
          returnKeyType="done"
          onChangeText={setSummary}
        />

        <UploadPhotoBox pickImage={pickImage} selectedImage={image} />


        <TouchableOpacity
          style={{ ...styles.submitButton, backgroundColor: isValid() ? "#5e99fa" : 'grey' }}
          disabled={!isValid()}
          onPress={submitFormHandler}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>


      </View>
    </ KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
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
  summaryInput: {
    width: 300,
    height: 100,
    borderRadius: 10,
    backgroundColor: "white",
    marginTop: 10,
    borderColor: "#E8EAE6",
    borderWidth: 1,
    padding: 10,
    alignSelf: 'center'
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 20 / 2,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'flex-start'
  },
  outOfServiceBox: {
    width: 290,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10
  }
})

export default DefectReportingFormScreen;
