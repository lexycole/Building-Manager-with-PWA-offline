import React, { useEffect, useState } from "react";
import { View, Text, ActionSheetIOS, Platform, TouchableOpacity, ScrollView, TextInput, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSelector, useDispatch } from "react-redux";
import { getFormNames, getFormCheckpoints } from "../../utils/helpers/equipmentForms";
import { getFirestore, doc, collection, addDoc } from "firebase/firestore";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "../../components/Checkbox";
import { firebaseApp } from "../../firebase/config";
import { buildingListActions } from "../../store/building-slice";
import styles from "./styles";

const EquipmentForm = ({ route, navigation }) => {
  const [selectedForm, setSelectedForm] = useState("");
  const [selectedFormCheckpoints, setSelectedFormCheckpoints] = useState([])
  const [confirmCheckpoints, setConfirmCheckpoints] = useState(false)
  const [selectedFormType, setSelectedFormType] = useState('')
  const [comment, setComment] = useState('')
  const formNames = getFormNames()
  const { siteId } = route.params
  const date = new Date()
  const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
  const userUid = useSelector((state) => state.auth.uid);
  const db = getFirestore(firebaseApp);
  const dispatch = useDispatch();

  const siteRef = doc(
    db,
    "BuildingsX",
    siteId
  );

  useEffect(() => {
    if (!selectedForm || !selectedFormType) {
      return
    }
    setSelectedFormCheckpoints(getFormCheckpoints(selectedForm, selectedFormType.toLocaleLowerCase()))
  }, [selectedForm, selectedFormType])

  const openFormMenuOnIos = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', ...formNames],
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          return setSelectedForm('')
        }
        setSelectedForm(formNames[buttonIndex - 1])
      },
    );

  const submitFormHandler = async () => {
    const documentToAdd = {
      report: comment,
      date: date,
      machine: selectedForm,
      preUseChecks: true,
      type: "Access Equipment",
      accessFormType: selectedFormType.toLocaleLowerCase(),
      completedBy: userUid
    }
    try {
      if (!selectedForm || !selectedFormType) {
        throw new Error('No form selected.')
      }
      await addDoc(collection(siteRef, 'windowCleaningForms'), documentToAdd)
      const alertMessage = 'Thanks, form successfully submitted.'

      if (selectedFormType === 'Pre') {
        dispatch(
          buildingListActions.setEquipmentForm(true)
        );
      }
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

  function isValid() {
    if (confirmCheckpoints) return true
    return false
  }


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
          <Text style={styles.text}>Select form:</Text>

          {Platform.OS === 'ios' ?
            <TouchableOpacity onPress={openFormMenuOnIos} style={styles.iosButton}>
              <Text style={styles.iosButtonText}>{selectedForm ? selectedForm : 'Please select'}</Text>
            </TouchableOpacity>

            :
            <Picker
              style={styles.picker}
              selectedValue={selectedForm}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedForm(itemValue);
              }}
            >
              <Picker.Item label="Please select" value="" />
              {formNames.map((d) => {
                return <Picker.Item key={d} label={d} value={d} />;
              })}
            </Picker>
          }

        </View>

        {!!selectedForm && (
          <View style={styles.section}>
            <Text style={styles.text}>Select form type:</Text>
            <Picker
              style={styles.picker}
              selectedValue={selectedFormType}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedFormType(itemValue);
              }}
            >
              <Picker.Item label="Please select" value="" />
              {['Pre', 'Post'].map((d) => {
                return <Picker.Item key={d} label={d} value={d} />;
              })}
            </Picker>
          </View>
        )}

        {!!selectedFormCheckpoints.length &&
          <ScrollView>
            {selectedFormCheckpoints.map((checkpoint, index) => <Text key={index} style={styles.checkpoint}>{`\u2022 ${checkpoint}`}</Text>)}

            <TextInput
              style={styles.commentInput}
              placeholder="Comments"
              value={comment}
              numberOfLines={12}
              multiline
              textAlignVertical="top"
              returnKeyType="done"
              onChangeText={setComment}
            />

            <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
              <Checkbox
                onClick={() => setConfirmCheckpoints(!confirmCheckpoints)}
                isChecked={confirmCheckpoints}
              />
              <Text style={{ paddingLeft: 5 }}>I have read and confirm the above</Text>
            </View>

            <TouchableOpacity
              style={{ ...styles.submitButton, backgroundColor: isValid() ? '#5e99fa' : 'grey' }}
              disabled={!isValid()}
              onPress={submitFormHandler}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>

          </ScrollView>
        }
      </View>
    </KeyboardAwareScrollView>
  );
};

export default EquipmentForm;
