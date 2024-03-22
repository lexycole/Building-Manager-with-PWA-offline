import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  Alert
} from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { useSelector, useDispatch } from "react-redux";
import {
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { firebaseApp } from "../../firebase/config";
import ScreenImageBackground from "../../components/ScreenImageBackground";
import StartStopButton from "../../components/StartStopButton";
import { buildingListActions } from "../../store/building-slice";
import { getCleanNameFromId } from "../../utils/helpers/helpers";
import LiveStreamButton from "../../components/LiveStreamButton";
import styles from "./styles";

export default function CleanScreen({ route, navigation }) {
  const db = getFirestore(firebaseApp);
  const dispatch = useDispatch();
  const currentClean = useSelector((state) => state.buildingList.currentClean);
  const currentDrop = useSelector((state) => state.buildingList.currentDrop);
  const buildingName = useSelector((state) => state.buildingList.buildingName);
  const buildingData = useSelector((state) => state.buildingList.buildingData);
  const [isLiveStreaming, setIsLiveStreaming] = useState(false)

  const buildingRef = doc(db, "BuildingsX", buildingName);

  const canReportSingleWindowDefects = buildingName === '20 Fenchurch Street' ?  true : false

  useEffect(() => {
    if (!buildingData) return
    setIsLiveStreaming(buildingData.isLiveStreaming)

  }, [])

  const dropRef = doc(
    buildingRef,
    "currentYear",
    currentClean,
    "drops",
    currentDrop.name
  );

  const startStopHandler = () => {
    if (currentDrop) {
      if (!currentDrop.inProgress) {
        startHandler();
      } else {
        stopHandler();
      }
    }
  };

  const startHandler = async () => {
    try {
      await updateDoc(dropRef, { inProgress: true })
      dispatch(buildingListActions.setCurrentDrop({ drop: { ...currentDrop, inProgress: true } }));
      dispatch(buildingListActions.setFetchNewData({ fetchData: true }));
    } catch (error) {
      if (Platform.OS === 'web') {
        alert(error.message)
      } else {
        Alert.alert('Oops', error.message)
      }
    }

  };

  const stopHandler = async () => {
    try {
      await updateDoc(dropRef, { inProgress: false, isComplete: true })
      dispatch(buildingListActions.setCurrentDrop({ drop: { ...currentDrop, inProgress: false, isComplete: true } }));
      navigation.navigate('Submit')
    } catch (error) {
      if (Platform.OS === 'web') {
        alert(error.message)
      } else {
        Alert.alert('Oops', error.message)
      }
    }

  };

  const startStopLiveStream = async () => {
    try {
      await updateDoc(buildingRef, { isLiveStreaming: !isLiveStreaming })
      dispatch(buildingListActions.setLiveStreaming(!isLiveStreaming))
      setIsLiveStreaming(!isLiveStreaming)
    } catch (error) {
      const errorMessage = 'An error has occurred. Please try again or contact us if the error persists.'
      if (Platform.OS === 'web') {
        alert(errorMessage)
      } else {
        Alert.alert('Oops', errorMessage)
      }
    }
  }

  return (
    <View style={styles.container}>
      <ScreenImageBackground>
        <View style={styles.contentContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="close" size={30} color="white" />
          </TouchableOpacity>

          <StartStopButton inProgress={currentDrop.inProgress} startStopHandler={startStopHandler} />

          <View style={styles.textArea}>
            <Text style={styles.clickHereText}>CLICK HERE{"\n"}TO {currentDrop.inProgress ? 'STOP' : 'START'}</Text>

            {canReportSingleWindowDefects &&
              <TouchableOpacity style={{ marginBottom: '10px' }} onPress={() => navigation.navigate('SingleWindowDefect')}>
                <Text style={{ color: '#fff' }}>
                  Something wrong?
                </Text>
              </TouchableOpacity>
            }

            <Text style={styles.cleanNameText}>Clean: {currentClean && getCleanNameFromId(currentClean)}</Text>
            <Text style={styles.cleanNameText}>Drop: {currentDrop && currentDrop.name}</Text>
          </View>

          {!!buildingData.liveStreamLink && <LiveStreamButton
            startStopLiveStream={startStopLiveStream}
            isLiveStreaming={isLiveStreaming}
          />
          }

        </View>
      </ScreenImageBackground>
    </View>
  );
}
