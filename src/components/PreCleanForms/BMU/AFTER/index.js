import React, { useState } from "react";

import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { firebaseApp } from "../../../../firebase/config";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { buildingListActions } from "../../../../store/building-slice";
import { getFirestore, doc } from "firebase/firestore";

import styles from "./styles";

const AfterBMUForm = () => {
  const db = getFirestore(firebaseApp);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const buildingName = useSelector((state) => state.buildingList.buildingName);

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
    "Cradle is in authorised parking position",
    "Cradle disconnected from the power supply ",
    "Storm clamp attached (if applicable)",
    "Cradle cover correctly installed",
    "All tools, equipment, and waste removed",
    "Any defects that occurred during use",
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
    if (preUseChecks) {
      // Mark weather Form as true

      // set inProgress to true
      cleanRef
        .collection("forms")
        .add({
          report: comment,
          date: dateTimestamp,
          machine: "BMU",
          name: bmuNameSelected,
          afterUseChecks: preUseChecks === "Yes" ? true : false,
          type: "Access Equipment",
          accessFormType: "After-Use",
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
          onValueChange={(itemValue, itemIndex) => {
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
          onValueChange={(itemValue) => {
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

export default AfterBMUForm;
