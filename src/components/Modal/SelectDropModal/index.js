import React, { useEffect, useState } from "react";
import {
  View,
  Modal,
  TextInput,
  Pressable,
  Text,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import styles from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { buildingListActions } from "../../../store/building-slice";
import { firebaseApp } from "../../../firebase/config";
import { getFirestore, doc, updateDoc, Timestamp } from "firebase/firestore";

const SelectDropModal = (props) => {
  const db = getFirestore(firebaseApp);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const cleanNames = useSelector((state) => state.buildingList.cleanNames);
  const currentClean = useSelector((state) => state.buildingList.currentClean);

  const [dateModal, showDateModal] = useState(false);
  const [editDate, setEditDate] = useState(null);

  const currentDrop = useSelector((state) => state.buildingList.currentDrop);
  const selectDropModal = useSelector(
    (state) => state.buildingList.selectDropModal
  );

  let _dropInformation = "";

  const cNames = [
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
  ];

  useEffect(() => {
    setLoading(true);
    const cleNames = [];
    for (let i = 0; i < props.cleans; i++) {
      cleNames.push(`clean${cNames[i]}`);
    }
    if (cleNames) {
      dispatch(buildingListActions.setCleanNames({ names: cleNames }));
      setLoading(false);
    }
  }, []);

  const saveEditDate = () => {
    setLoading(true);
    const dateToconvert = editDate.split("/");
    const newDate = new Date(
      dateToconvert[2],
      dateToconvert[1] - 1,
      dateToconvert[0]
    );
    const frmDa = Timestamp.fromDate(newDate);
    const dropRef = doc(
      db,
      "BuildingsX",
      props.name,
      "currentYear",
      currentClean,
      "drops",
      currentDrop.name
    );

    return updateDoc(dropRef, { date: frmDa })
      .then((res) => {
        showDateModal(false);
        setLoading(false);

        setEditDate(null);
      })
      .catch((err) => alert(err));
  };

  // No Clean or Schedule | Show start clean button
  if (currentDrop && currentDrop.status === "") {
    _dropInformation = (
      <TouchableOpacity
        onPress={props.startCleanHandler}
        style={styles.button1}
      >
        <Text style={styles.start1}>START</Text>
      </TouchableOpacity>
    );
  }

  // Has been Scheduled | Show Date and Start Button
  if (currentDrop && currentDrop.status === "Scheduled") {
    _dropInformation = (
      <View style={styles.cleanedDropBox}>
        <Text style={styles.cleanedDrop}>
          {currentDrop.name} is scheduled to be cleaned on:
          {currentDrop.currentDate ? currentDrop.currentDate : "No date"}
        </Text>

        <TouchableOpacity
          onPress={props.startCleanHandler}
          style={styles.button1}
        >
          <Text style={styles.start1}>START</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Has been cleaned! | Show Date and Change Date Button
  if (
    currentDrop &&
    (currentDrop.status === "Cleaned" || currentDrop.status === "Faulty")
  ) {
    _dropInformation = (
      <View style={styles.cleanedDropBox}>
        <Text style={styles.cleanedDrop}>
          Has been cleaned on :{" "}
          {currentDrop.currentDate ? currentDrop.currentDate : "No date yet"}
        </Text>

        <Text style={styles.cleanedDrop}>Thank you</Text>

        <TouchableOpacity
          onPress={() => {
            setEditDate(currentDrop ? currentDrop.currentDate : "");
            showDateModal(true);
          }}
          style={styles.button1}
        >
          <Text style={styles.start1}>Change date</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={selectDropModal}
        onRequestClose={() =>
          dispatch(buildingListActions.setSelectDropModal())
        }
      >
        {!loading && cleanNames ? (
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text>Select Clean and Drop</Text>

              {/* Cleans */}
              <Picker
                style={styles.picker}
                selectedValue={currentClean}
                onValueChange={(itemValue, itemIndex) => {
                  dispatch(
                    buildingListActions.setCurrentClean({ clean: itemValue })
                  );
                }}
              >
                <Picker.Item label="Please select" value="" />
                {cleanNames.map((d) => {
                  return <Picker.Item key={d} label={d} value={d} />;
                })}
              </Picker>

              {/* Drops */}
              <Picker
                style={styles.picker}
                selectedValue={currentDrop && currentDrop.name}
                onValueChange={(itemValue, itemIndex) => {
                  dispatch(
                    buildingListActions.setCurrentDrop({
                      drop: props.drops[itemIndex - 1],
                    })
                  );
                }}
              >
                <Picker.Item label="Please select" value="" />
                {props.drops.map((d) => {
                  return (
                    <Picker.Item key={d.name} label={d.name} value={d.name} />
                  );
                })}
              </Picker>

              {_dropInformation}
              <div style={{ display: "flex" }}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    dispatch(
                      buildingListActions.setCurrentDrop({ drop: null })
                    );
                    dispatch(buildingListActions.setSelectDropModal());
                  }}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </Pressable>
              </div>
            </View>
          </View>
        ) : (
          <Text>Loading</Text>
        )}
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={dateModal}
        onRequestClose={() => {
          showDateModal(!dateModal);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.modalText}
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
            />

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={saveEditDate}
            >
              <Text style={styles.textStyle}>Save</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SelectDropModal;
