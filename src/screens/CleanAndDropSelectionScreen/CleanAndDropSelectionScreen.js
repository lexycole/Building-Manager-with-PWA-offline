import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Alert, Platform, ActivityIndicator } from "react-native";
import SelectableItemWithCheckbox from '../../components/SelectableItemWithCheckbox'
import ConfirmButton from "../../components/ConfirmButton";
import { getCleanNames, getCleanNameFromId, getCleanIdFromName } from "../../utils/helpers/helpers";
import { useSelector, useDispatch } from "react-redux";
import { buildingListActions } from "../../store/building-slice";
import { firebaseApp } from "../../firebase/config";
import {
    getFirestore,
    doc,
    getDoc,
} from "firebase/firestore";

const CleanAndDropSelectionScreen = ({ navigation }) => {
    const [selectedDrop, setSelectedDrop] = useState(null)
    const [cleanNames, setCleanNames] = useState([])

    const selectedSite = useSelector((state) => state.buildingList.selectedBuilding);
    const building = useSelector((state) => state.buildingList.buildingData);
    const currentClean = useSelector((state) => state.buildingList.currentClean);
    const drops = useSelector((state) => state.buildingList.drops);
    const dispatch = useDispatch()

    const db = getFirestore(firebaseApp)

    useEffect(() => {
        if (building) {
            setCleanNames(getCleanNames(building.cleans))
        }
    }, [building])

    const selectItem = (item, type) => {
        if (type === 'clean') {
            dispatch(
                buildingListActions.setCurrentClean({ clean: getCleanIdFromName(item) })
            );
        }
        if (type === 'drop') {
            if (item.isComplete) {
                const alertMessage = `${item.name} is already cleaned!`
                setSelectedDrop(null)
                return Platform.OS === 'web' ? alert(alertMessage) : Alert.alert('Sorry', alertMessage)
            }
            setSelectedDrop(item)
        }
    }

    const confirmSelection = async () => {
        try {
            if (selectedDrop.equipmentId) {
                const equipmentStatus = await getEquipmentStatus(selectedDrop.equipmentId)
                if (!equipmentStatus) {
                    throw new Error('Equipment is currenly out of service. Please fill a defect form.')
                }
            }
            dispatch(
                buildingListActions.setCurrentDrop({
                    drop: selectedDrop,
                })
            );
            navigation.navigate('Clean')
        } catch (error) {
            alert(error)
            console.log(error)
        }
    }

    const getEquipmentStatus = async (equipmentId) => {
        const equipmentRef = doc(db, 'BuildingsX', selectedSite, 'equipment', equipmentId)
        const equipmentSnapshot = await getDoc(equipmentRef);
        return equipmentSnapshot.data().inService
    };


    if (!drops.length && !cleanNames.length) return <ActivityIndicator style={{ flex: 1 }} size='large' color='#5e99fa' />

    return (
        <View style={styles.container}>
            <View style={styles.buildingNameBox}>
                <Text style={styles.buildingNameText}>{building.name}</Text>
            </View>

            <View style={styles.cleansBox}>
                <Text style={styles.sectionTitle}>Select Clean</Text>
                <FlatList
                    data={cleanNames}
                    renderItem={({ item }) => (
                        <SelectableItemWithCheckbox
                            name={item}
                            selectItem={() => selectItem(item, 'clean')}
                            isSelected={getCleanNameFromId(currentClean)}
                        />)
                    }
                    keyExtractor={(item, index) => `${item}-${index}`}
                    nestedScrollEnabled
                />
            </View>

            <View style={styles.dropsBox}>
                <Text style={styles.sectionTitle}>Select Drop</Text>
                <FlatList
                    data={drops && drops}
                    renderItem={({ item }) => (
                        <SelectableItemWithCheckbox
                            name={item.name}
                            selectItem={() => selectItem(item, 'drop')}
                            isSelected={selectedDrop && selectedDrop.name}
                            isCleaned={item.isComplete}
                        />
                    )}
                    keyExtractor={(item, index) => index}
                    nestedScrollEnabled
                />
            </View>

            {selectedDrop &&
                <ConfirmButton confirmSelection={confirmSelection} />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 20,
        marginHorizontal: 20
    },
    buildingNameBox: {
        backgroundColor: '#5e99fa',
        borderRadius: 10,
        justifyContent: 'center',
        paddingLeft: 10,
        flex: 0.5
    },
    buildingNameText: {
        color: '#fff',
        fontWeight: '600'
    },
    cleansBox: {
        marginVertical: 20,
        flex: 2
    },
    dropsBox: {
        marginTop: 10,
        flex: 3
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        paddingBottom: 10
    },
})

export default CleanAndDropSelectionScreen