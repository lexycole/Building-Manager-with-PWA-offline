import React, { useState } from "react";

import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { firebaseApp } from "../../../../firebase/config";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { buildingListActions } from "../../../../store/building-slice";
import { getFirestore, doc } from "firebase/firestore";

import styles from "./styles";

const PreBMUForm = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const buildingName = useSelector((state) => state.buildingList.buildingName);
  const db = getFirestore(firebaseApp);

  const currentClean = useSelector((state) => state.buildingList.currentClean);

  const cleanRef = doc(
    db,
    "BuildingsX",
    buildingName,
    "currentYear",
    currentClean
  );
  const dateTimestamp = new Date();

  const [bmuNameSelected, setBmuNameSelected] = useState("");
  const [preUseChecks, setPreUseChecks] = useState("");
  const [comment, setComment] = useState("");

  const bmuPreCheckPoints = [
    "Are the operatives trained to access and use the equipment",
    "Is the cradle inspection tag in date and in it's designated space",
    "Barriers/signs placed below the work area",
    "Weather forecast checked ",
    "Lanyards and harnesses have been checked and no issues found",
    "Cradle track is clear of debris and obstacles",
    "Power cable shows no signs of damage or exposed wiring",
    "Transporter is in good working order",
    "Storm clamp is in good working order (if applicable)",
    "Power supply is on",
    "Emergency stop buttons are in correct position and not damaged",
    "The cradle functions are in good working order",
    "Limit and safety switches are in good working order",
    " All tools/radios/equipment are tethered",
  ];

  const bmuNames = [
    "BMU 1",
    "BMU 2",
    "BMU 3",
    "BMU 4",
    "BMU 5",
    "BMU 6",
    "BMU 7",
  ];
  const preUseChecksOptions = ["Yes", "No"];

  const submitFormHandler = () => {
    if (bmuNameSelected && preUseChecks) {
      cleanRef
        .collection("forms")
        .add({
          report: comment,
          date: dateTimestamp,
          machine: "BMU",
          name: bmuNameSelected,
          preUseChecks: preUseChecks === "Yes" ? true : false,
          type: "Access Equipment",
          accessFormType: "Pre-Use",
        })
        .then(() => {
          dispatch(
            buildingListActions.setEquipmentForm({ equipmentForm: true })
          );
          navigation.navigate("Building");
        });
    }
  };

  return (
    <View style={styles.container}>
      <ul>
        {bmuPreCheckPoints.map((point) => (
          <li>{point}</li>
        ))}
      </ul>

      <View style={styles.section}>
        <Text style={styles.text}>Pelase select the name of your BMU</Text>

        <Picker
          style={styles.picker}
          selectedValue={bmuNameSelected}
          onValueChange={(itemValue) => {
            setBmuNameSelected(itemValue);
          }}
        >
          <Picker.Item label="Please select" value="" />

          {bmuNames.map((d) => {
            return <Picker.Item key={d} label={d} value={d} />;
          })}
        </Picker>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>Everything checked?</Text>

        <Picker
          style={styles.picker}
          selectedValue={preUseChecks}
          onValueChange={(itemValue, itemIndex) => {
            setPreUseChecks(itemValue);
          }}
        >
          <Picker.Item label="Please select" value="" />
          {preUseChecksOptions.map((d) => {
            return <Picker.Item key={d} label={d} value={d} />;
          })}
        </Picker>
      </View>
      <TextInput
        numberOfLines={2}
        style={styles.commentInput}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Enter a comment..."
      />

      <View style={styles.submitBox}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={submitFormHandler}
        >
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PreBMUForm;
