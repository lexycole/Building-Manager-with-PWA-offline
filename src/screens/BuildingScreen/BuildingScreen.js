import React, { useState, useEffect } from "react";
import { Text, View, Platform, ActivityIndicator, ScrollView, Alert } from "react-native";
import styles from "./styles";
import { firebaseApp } from "../../firebase/config";
import CurrentCleanCard from "../../components/CurrentCleanCard";
import LastCleanCard from "../../components/LastCleanCard";
import FormCard from "../../components/FormCard";
import CleanNowCard from "../../components/CleanNowCard";
import Building3D from "../../components/3DBuilding/3DBuilding";
import { useSelector, useDispatch } from "react-redux";
import { buildingListActions } from "../../store/building-slice";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  where,
  query,
  orderBy,
  limit,
  getDocs,
  getCountFromServer
} from "firebase/firestore";

export default function BuildingScreen({ navigation }) {
  const db = getFirestore(firebaseApp);
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  const dispatch = useDispatch();
  const selectedBuilding = useSelector(
    (state) => state.buildingList.selectedBuilding
  );
  const buildingData = useSelector((state) => state.buildingList.buildingData);
  const buildingName = useSelector((state) => state.buildingList.buildingName);
  const currentClean = useSelector((state) => state.buildingList.currentClean);
  const refreshVersion = useSelector((state) => state.buildingList.refreshBuildingVersion);
  const buildingRef = doc(db, 'BuildingsX', selectedBuilding)

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getBuildingData();

    return () => {
      dispatch(
        buildingListActions.setBuilding({
          name: "",
          data: null,
          currentClean: null,
          currentCleanData: null,
          drops: null,
        })
      );
      dispatch(
        buildingListActions.setWeatherForm({
          weatherForm: false,
        })
      );
      dispatch(
        buildingListActions.setCurrentDrop({
          drop: null,
        })
      );
      dispatch(
        buildingListActions.setLatestWeatherInfo({
          latestWeather: null,
        })
      );
      dispatch(
        buildingListActions.setEquipmentForm({
          equipmentForm: false,
        })
      );
    }
  }, [selectedBuilding, refreshVersion]);

  useEffect(() => {
    if (currentClean && buildingData) {
      async function getAndSetDrops() {
        try {
          const drops = await getBuildingDrops("currentYear", currentClean)
          dispatch(
            buildingListActions.setDrops({
              drops: drops,
            })
          );
          setLoading(false);
        } catch (error) {
          console.log(error)
          setLoading(false);
        }
      }

      getAndSetDrops()

    }
  }, [currentClean]);

  const getBuildingData = async () => {
    try {
      const selectedBuildingPrivateDataRef = doc(buildingRef, 'private_data', 'private')
      const buildingData = await getDoc(buildingRef);
      const buildingAddress = await getDoc(selectedBuildingPrivateDataRef)

      const data = buildingData.data();
      data.lastCleaned = buildingData.data().lastCleaned ? new Date(buildingData.data().lastCleaned.toDate()).toUTCString() : ''
      data.currentCleanData = (await getDoc(data.currentCleanRef)).data();
      data.address = buildingAddress.data().address ? buildingAddress.data().address : ''
      data.weatherForm = await checkIfTodaysFormExist("Weather Report", data.currentClean)
      data.equipmentForm = await checkIfTodaysFormExist("Access Equipment", data.currentClean)
      const drops = await getBuildingDrops('currentYear', data.currentClean)

      const currentCleanQuery = query(collection(buildingRef, 'currentYear', data.currentClean, 'drops'), where("cleanStatus", "==", "Cleaned"))
      const countSnapshot = await getCountFromServer(currentCleanQuery)
      data.currentCleanPercentageCompleted = Number(countSnapshot.data().count / data.noDrops).toFixed(2)

      dispatch(
        buildingListActions.setBuilding({
          name: selectedBuilding,
          data: data,
          currentClean: data.currentClean,
          currentCleanData: data.currentCleanData,
          drops: drops,
        })
      );
      setLoading(false);

    } catch (error) {
      console.log(error)
    }
  };

  const getBuildingDrops = async (year, clean) => {
    const dropsRef = collection(
      buildingRef,
      year,
      clean,
      "drops"
    )
    const drops = await getDocs(dropsRef)
    const dropsArray = []
    drops.forEach(drop => {
      dropsArray.push({
        ...drop.data(),
        singleWindows: drop.data().singleWindows || [],
        currentDate: drop.data().date ? new Date(drop.data().date.toDate()).toLocaleDateString("en-GB") : ''
      })
    })
    dropsArray.sort((a, b) => (a.num > b.num ? 1 : -1));
    return dropsArray
  }

  const checkIfTodaysFormExist = async (formType, clean) => {
    const q = query(
      collection(
        buildingRef,
        "windowCleaningForms",
      ),
      where("type", "==", formType),
      where("date", ">", date),
      orderBy("date", "desc"),
      limit(1)
    );
    const accessEquipmentQuery = query(
      collection(
        buildingRef,
        "windowCleaningForms"
      ),
      where("type", "==", formType),
      where("accessFormType", "==", "pre"),
      where("date", ">", date),
      orderBy("date", "desc"),
      limit(1)
    );

    const result = await getDocs(formType === "Access Equipment" ? accessEquipmentQuery : q)
    if (result.empty) {
      return false
    }
    let formData;
    result.forEach(d => {
      formData = d.data()
    })
    return formData
  }

  const goToCleanAndDropSelection = () => {
    if (!buildingData.weatherForm || !buildingData.equipmentForm) {
      const alertMessage = "Weather and Pre Equipment forms need to be completed before continuing."
      if (Platform.OS === 'web') {
        return alert(alertMessage)
      }
      return Alert.alert('Oops', alertMessage)
    } else if (buildingData.weatherForm) {
      if (buildingData.weatherForm.weatherCondition !== "Acceptable") {
        const weatherNotAcceptableMessage = 'Current weather report shows it is unacceptable to continue. Please submit a new weather form if weather conditions have improved.'
        if (Platform.OS === 'web') {
          return alert(weatherNotAcceptableMessage)
        }
        return Alert.alert('Oops', weatherNotAcceptableMessage)
      }
    }
    navigation.navigate('CleanAndDropSelection')
  }

  const openForm = (form) => {
    navigation.navigate(form, { formType: 'pre', siteId: buildingName })
  }

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size='large' color='#5e99fa' />

  return (

    <View style={styles.container}>
      <View style={styles.buildingDetailsBox}>
        <Text style={styles.buildingName}>{buildingName}</Text>
        <Text style={styles.buildingAddress}>{buildingData && buildingData.address}</Text>
      </View>

      <View style={styles.threeDModelBox} >
        {Platform.OS === 'web' &&
          <Building3D name={buildingName} />
        }
      </View>

      <View style={styles.infoBox}>
        <CurrentCleanCard name={currentClean} progress={buildingData && buildingData.currentCleanPercentageCompleted} />

        <LastCleanCard
          dropName={buildingData && buildingData.lastDropCleaned}
          date={buildingData && buildingData.lastCleaned}
        />

        <ScrollView>
          <FormCard name='Access Equipment Checklist Form' openForm={() => openForm('Equipment')} />
          <FormCard name='Defect Form' openForm={() => openForm('Defects')} />
          <FormCard name='Scheduled Tasks Form' openForm={() => openForm('Schedules')} />
          <FormCard name="Weather Report Form" openForm={() => openForm('Weather')} />
          <FormCard name="PPE Form" openForm={() => openForm('PPE')} />

          <CleanNowCard cleanNow={goToCleanAndDropSelection} />
        </ScrollView>

      </View>
    </View>

  );
}
