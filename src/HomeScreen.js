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
  const [isConnected, setIsConnected] = useState(false);

  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener(state => {
  //     setIsConnected(state.isConnected);
  //   });
  //   console.log('connection');
  //   return () => unsubscribe();
  // }, []);

  // useEffect(() => {
  //   if (!isConnected && !buildings.length) {
  //     // Handle offline scenario
  //     loadCachedBuildings();
  //   } else {
  //     // Fetch data from Firebase when online
  //     setAllBuildings();
  //   }
  // }, [isConnected]);


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


  // const loadCachedBuildings = async () => {
  //   try {
  //     const cachedBuildings = window.localStorage.getItem('buildingData');
  //     console.log(cachedBuildings, 'cachedBuildings');
  //     if (cachedBuildings) {
  //       setBuildings(JSON.parse(cachedBuildings));
  //     }
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error loading cached buildings:", error);
  //     setLoading(false);
  //   }
  // };


  const setAllBuildings = async () => {
    try {

        // const isConnected = await checkInternetConnection();

        // if (!isConnected) {
          // const storedDataString = window.localStorage.getItem('buildingData');
          // console.log(storedDataString, 'stored DataString')

          // const storedData = JSON.parse(storedDataString);
          // console.log(storedData, 'stored Data')

          // if (storedData && storedData.length > 0) {
          //   setBuildings(storedData);
          //   setLoading(false);
          //   return;  
          // }
        // }
      
      const promises = accountsAccess.map(async (account) => {
        const accountPromises = account.sites.map(async (site) => {
          const hasDropmarking = await siteHasDropmarking(site.site_id);
          if (hasDropmarking) {
            const img = await getBuildingImage(site.site_id);
            return {
              accountName: account.account_name,
              buildingImage: img,
              ...site,
            };
          }
          return null;
        });
        const buildings = await Promise.all(accountPromises);
        return buildings.filter((building) => building !== null);
      });

      const buildingsArray = (await Promise.all(promises)).flat();

      // Check if the user is not connected and buildingsArray is empty
    // if (!navigator.onLine && buildingsArray.length === 0) {
    //   const cachedBuildingsString = window.localStorage.getItem('buildingData');
    //   console.log(cachedBuildingsString, 'cachedBuildingsString');
    //   if (cachedBuildingsString) {
    //     const cachedBuildingsArray = JSON.parse(cachedBuildingsString);
    //     setBuildings(cachedBuildingsArray);
    //     setLoading(false);
    //     return;
    //   }
    // }

      // if (typeof window !== 'undefined' && window.localStorage) {
      //   localStorage.setItem('buildingData', JSON.stringify(buildingsArray));
      //   console.log('Building data saved to local Storage', buildingsArray);
      // }

      setBuildings(buildingsArray);
      setLoading(false);
    } catch (error) {
      console.log(error, "error");
    //   if (navigator.serviceWorker.controller) {
    //     const messageChannel = new MessageChannel();
    //     messageChannel.port1.onmessage = (event) => {
    //         const cachedData = event.data;
    //         setBuildings(cachedData);
    //         setLoading(false);
    //     };
    //     navigator.serviceWorker.controller.postMessage({ type: 'GET_CACHED_BUILDINGS' }, [messageChannel.port2]);
    // }
      setLoading(false);
    }
  };

  // const checkInternetConnection = async () => {
  //   const netInfoState = await NetInfo.fetch();
  //   return netInfoState.isConnected;
  // };

  const siteHasDropmarking = async (siteId) => {
    try {

    // // Check if siteData is already cached in localStorage
    // const cachedData = window.localStorage.getItem(`siteData_${siteId}`);
    // console.log(cachedData, 'cachedData');
    // if (cachedData) {
    //   // If cached data exists, parse and return it
    //   const parsedData = JSON.parse(cachedData);
    //   console.log(parsedData.has_dropmarking, 'parsedData.has_dropmarking')
    //   // return parsedData.has_dropmarking;
    // }

      const siteRef = doc(db, "BuildingsX", siteId);
      const siteData = await getDoc(siteRef);

      if (!siteData.exists()) {
        throw new Error("No data was found.");
      }
      // Cache the fetched data in localStorage
      // window.localStorage.setItem(`siteData_${siteId}`, JSON.stringify(siteData.data()));

      return siteData.data().has_dropmarking;
    } catch (error) {
      console.log(error);
    }
  };

const getBuildingImage = async (siteId) => {
  try {
    // // Check if building images data is already cached in localStorage
    // const cachedData = window.localStorage.getItem(`buildingImages_${siteId}`);
    // if (cachedData) {
    //   // If cached data exists, parse and return it
    //   const parsedData = JSON.parse(cachedData);
    //   return parsedData;
    // }

    // If not cached, fetch the data from Firestore
    const buildingPrivateDocRef = doc(db, "BuildingsX", siteId, "private_data", "private");
    const buildingPrivateData = await getDoc(buildingPrivateDocRef);

    if (!buildingPrivateData.exists()) {
      throw new Error("No data was found.");
    }
    return buildingPrivateData.data().buildingImage;
    // Extract building image data from the fetched document
    // const buildingImage = buildingPrivateData.data().buildingImage;

    // Cache the fetched data in localStorage
    // window.localStorage.setItem(`buildingImages_${siteId}`, JSON.stringify(buildingImage));

    // return buildingImage;
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

