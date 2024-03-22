import React, { useState } from "react";

import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useSelector } from "react-redux";
import { firebaseApp } from "../../../../firebase/config";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { buildingListActions } from "../../../../store/building-slice";
import { getFirestore, doc } from "firebase/firestore";

import styles from "./styles";

const AfterMEWPForm = () => {
  const db = getFirestore(firebaseApp);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const buildingName = useSelector((state) => state.buildingList.buildingName);

  const currentClean = useSelector((state) => state.buildingList.currentClean);

  const cleanRef = doc(
    db,
    "BuilsingsX",
    buildingName,
    "currentYear",
    currentClean
  );
  const dateTimestamp = new Date();
  const [preUseChecks, setPreUseChecks] = useState("");
  const [comment, setComment] = useState("");

  const bmuPreCheckPoints = [
    "Equipment is returned to correct storage location",
    "Rubbish is removed",
    "Any defects that occurred during use have been highlighted to correct personnel and report filed in site pack",
  ];

  const preUseChecksOptions = ["Yes", "No"];

  const submitFormHandler = () => {
    if (preUseChecks) {
      cleanRef
        .collection("forms")
        .add({
          report: comment,
          date: dateTimestamp,
          machine: "MEWP",
          preUseChecks: preUseChecks === "Yes" ? true : false,
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

export default AfterMEWPForm;
