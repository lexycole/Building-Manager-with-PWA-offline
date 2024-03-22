import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Feather } from "@expo/vector-icons";
import CleansInProgressCard from "../../components/CleansInProgressCard";
import RecentlyViewedBuildingCard from "../../components/RecentlyViewedBuildingCard";
import ViewBuildingCard from "../../components/ViewBuildingCard";
import styles from "./styles";
import { buildingListActions } from "../../store/building-slice";
import { getFirestore, doc, getDoc, enableIndexedDbPersistence } from "firebase/firestore";
import { firebaseApp } from "../../firebase/config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';


export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const db = getFirestore(firebaseApp);

  
  const accountsAccess = useSelector(
    (state) => state.buildingList.allBuildings
  );

  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredList, setFilteredList] = useState([]);
  const [searchedBuilding, setSearchedBuilding] = useState("");
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (!state.isConnected) {
        // Network is offline
        Alert.alert(
          "Network Offline",
          "You are currently offline. Please check your internet connection.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
      } else {
        // Network is online
        Alert.alert(
          "Network Online",
          "You are back online. Enjoy the app!",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
      }
    });

    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (!accountsAccess.length) {
      setLoading(false);
      return;
    }
    setAllBuildings();
  }, [accountsAccess?.length]);

  useEffect(() => {
    if (searchedBuilding) {
      filterList();
    } else {
      setFilteredList([]);
    }
  }, [searchedBuilding]);


  const setAllBuildings = async () => {
    try {
      // Array to store all buildings
      let buildingsArray = [];
  
      // Iterate through each account to fetch buildings
      for (const account of accountsAccess) {
        // Array to store promises for buildings of each account
        const accountPromises = account.sites.map(async (site) => {
          // Check if the site has dropmarking
          const hasDropmarking = await siteHasDropmarking(site.site_id);
  
          if (hasDropmarking) {
            // If the site has dropmarking, fetch building image
            const img = await getBuildingImage(site.site_id);
            return {
              accountName: account.account_name,
              buildingImage: img,
              ...site,
            };
          }
          return null;
        });
  
        // Fetch buildings for the current account
        const buildings = await Promise.all(accountPromises);
  
        // Filter out null values (sites without dropmarking)
        const filteredBuildings = buildings.filter((building) => building !== null);
  
        // Append buildings to the main array
        buildingsArray = [...buildingsArray, ...filteredBuildings];
      }
      await AsyncStorage.setItem('buildingData', JSON.stringify(buildingsArray));
  
      // Update state with buildingsArray
      setBuildings(buildingsArray);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching building data:', error);
      setLoading(false);
    }
  };
  

  const siteHasDropmarking = async (siteId) => {
    try {

      const siteRef = doc(db, "BuildingsX", siteId);
      const siteData = await getDoc(siteRef);

      if (!siteData.exists()) {
        throw new Error("No data was found.");
      }

      return siteData.data().has_dropmarking;
    } catch (error) {
      console.log(error);
    }
  };

const getBuildingImage = async (siteId) => {
  try {

    // If not cached, fetch the data from Firestore
    const buildingPrivateDocRef = doc(db, "BuildingsX", siteId, "private_data", "private");
    const buildingPrivateData = await getDoc(buildingPrivateDocRef);

    if (!buildingPrivateData.exists()) {
      throw new Error("No data was found.");
    }
    return buildingPrivateData.data().buildingImage;
  } catch (error) {
    console.log(error);
  }
};
  
  const buildingHandler = (building) => {
    dispatch(buildingListActions.setSelectedBuilding({ name: building }));
    navigation.navigate("Category");
  };

  const filterList = () => {
    const buildingsClone = [...buildings];
    const filtered = buildingsClone.filter((building) =>
      building.site_name.toLowerCase().includes(searchedBuilding.toLowerCase())
    );
    setFilteredList(filtered);
  };

  if (loading)
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#5e99fa" />
    );

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
          placeholderTextColor="white"
          onChangeText={setSearchedBuilding}
        />
        <TouchableOpacity>
          <Feather name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView>

        <View style={styles.allBuildingsBox}>
          <Text style={styles.recentlyViewText}>All Buildings</Text>
          {!!searchedBuilding ? (
            filteredList.length ? (
              filteredList.map((item, index) => {
                return (
                  <ViewBuildingCard
                    key={index}
                    contractName={item.accountName}
                    buildingName={item.site_name}
                    buildingImage={item.buildingImage}
                    goToBuilding={() => buildingHandler(item.site_id)}
                  />
                );
              })
            ) : (
              <Text style={styles.footerText}>No buildings found</Text>
            )
          ) : (
            buildings.map((item, index) => {
              return (
                <ViewBuildingCard
                  key={index}
                  contractName={item.accountName}
                  buildingName={item.site_name}
                  buildingImage={item.buildingImage}
                  goToBuilding={() => buildingHandler(item.site_id)}
                />
              );
            })
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Principle WC</Text>
        </View>
      </ScrollView>
    </View>
  );
    }

