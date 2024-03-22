import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, ActionSheetIOS, Platform, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { buildingListActions } from "../../store/building-slice";
import { firebaseApp } from "../../firebase/config";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import styles from "./styles";

import { useSelector, useDispatch } from "react-redux";

const LOCATION_OPTIONS = ['Cancel', 'Roof Top', 'Working Position']
const WEATHER_CONDITION_OPTIONS = ['Cancel', 'Acceptable', 'Heavy Rain', 'Strong Winds', 'Storm/Thunderstorm', 'Snow / Freezing Temp']

const WeatherForm = ({ route, navigation }) => {
  const db = getFirestore(firebaseApp);

  const dispatch = useDispatch();
  const date = new Date()
  const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

  const [location, setLocation] = useState('')
  const [speed, setSpeed] = useState('')
  const [condition, setCondition] = useState('')
  const [comment, setComment] = useState('')

  const currentClean = useSelector((state) => state.buildingList.currentClean);
  const userUid = useSelector((state) => state.auth.uid);

  const buildingName = useSelector((state) => state.buildingList.buildingName);

  const submitFormHandler = async () => {
    const documentToAdd = {
      comments: comment,
      date: date,
      weatherCondition: condition,
      windMeasurementLocation: location,
      windSpeed: speed,
      type: "Weather Report",
      completedBy: userUid
    }
    try {
      if (!location && !speed && !condition) {
        throw new Error('Please fill in all the required fields.')
      }
      await addDoc(
        collection(
          db,
          "BuildingsX",
          buildingName,
          "windowCleaningForms"
        ),
        documentToAdd
      )

      const alertMessage = 'Thanks, form successfully submitted.'
      dispatch(buildingListActions.setWeatherForm(documentToAdd));
      if (Platform.OS === 'web') {
        alert(alertMessage)
        navigation.navigate("Building", { name: buildingName })
      } else {
        Alert.alert('Thanks', alertMessage, [{ title: 'OK', onPress: navigation.navigate("Building", { name: buildingName }) }])
      }


    } catch (error) {
      if (Platform.OS === 'web') {
        alert(error.message)
      } else {
        Alert.alert('Oops', error.message)
      }
    }

  };

  const openLocationOptionsOnIos = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: LOCATION_OPTIONS,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          return setLocation('')
        }
        setLocation(LOCATION_OPTIONS[buttonIndex])
      },
    );

  const openCondtionOptionsOnIos = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: WEATHER_CONDITION_OPTIONS,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          return setCondition('')
        }
        setCondition(WEATHER_CONDITION_OPTIONS[buttonIndex])
      },
    );

  function isValid() {
    if (location !== "" && condition !== "" && speed !== "") return true
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
        <Text style={styles.title}>{buildingName}</Text>
        <Text style={styles.date}>{dateString}</Text>

        <View style={styles.section}>
          <Text style={styles.text}>Location of wind speed measurement</Text>

          {Platform.OS === 'ios' ?
            <TouchableOpacity onPress={openLocationOptionsOnIos} style={styles.iosButton}>
              <Text style={styles.iosButtonText}>{location ? location : 'Please select'}</Text>
            </TouchableOpacity>
            :
            <Picker
              style={styles.picker}
              selectedValue={location}
              itemStyle={{ justifyContent: 'flex-start' }}
              onValueChange={(itemValue, itemIndex) => setLocation(itemValue)}
            >
              <Picker.Item label="Please select" value="" enabled={false} />
              {LOCATION_OPTIONS.filter(loc => loc !== 'Cancel').map(loc => {
                return <Picker.Item key={loc} label={loc} value={loc} />
              })}

            </Picker>
          }

        </View>

        <View style={styles.section}>
          <Text style={styles.text}>Wind Speed (mph)</Text>

          <TextInput
            style={styles.input}
            placeholder="eg. 20"
            value={speed}
            onChangeText={setSpeed}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>Weather Condition</Text>

          {Platform.OS === 'ios' ?
            <TouchableOpacity onPress={openCondtionOptionsOnIos} style={styles.iosButton}>
              <Text style={styles.iosButtonText}>{condition ? condition : 'Please select'}</Text>
            </TouchableOpacity>
            :
            <Picker
              style={styles.picker}
              selectedValue={condition}
              itemStyle={{ justifyContent: 'flex-start' }}
              onValueChange={(itemValue, itemIndex) => setCondition(itemValue)}
            >
              <Picker.Item label="Please select" value="" enabled={false} />
              {WEATHER_CONDITION_OPTIONS.filter(loc => loc !== 'Cancel').map(loc => {
                return <Picker.Item key={loc} label={loc} value={loc} />
              })}

            </Picker>
          }
        </View>

        <View>
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
        </View>


        <TouchableOpacity onPress={submitFormHandler} style={{ ...styles.button1, backgroundColor: isValid() ? '#5e99fa' : 'grey' }} disabled={!isValid()}>
          <Text style={styles.start1}>Submit</Text>
        </TouchableOpacity>


      </View>
    </KeyboardAwareScrollView>
  );
};

export default WeatherForm;
