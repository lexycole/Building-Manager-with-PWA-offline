import React, { useState } from "react";

import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { firebaseApp } from "../../../../firebase/config";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { buildingListActions } from "../../../../store/building-slice";
import { getFirestore, doc } from "firebase/firestore";

import styles from "./styles";

const PreMEWPForm = () => {
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
  const [preUseChecks, setPreUseChecks] = useState("");
  const [comment, setComment] = useState("");

  const bmuPreCheckPoints = [
    "LOLER and Insurance",
    "Operative is trained to use equipment",
    "Wheels/tyres",
    "Engine/power source",
    "Hydraulics",
    "Hoses and cables",
    "Outtriggers, stabilisers",
    "Chassi, boom, and scissor pack",
    "Platform or cage",
    "Decals and signage",
    "Using Ground and Platform controls",
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

      <View>
        <Text>Eveything checked?</Text>

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

export default PreMEWPForm;
