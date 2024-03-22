import React, { useState, useEffect } from "react";
import { View, Text, ActionSheetIOS, Platform, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Picker } from "@react-native-picker/picker";
import { useSelector } from "react-redux";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { firebaseApp } from "../../firebase/config";
import { ItemWithRadioButton } from "../../components/ItemWithRadioButton";

const ScheduledTasksForm = ({ route, navigation }) => {
    const [selectedSchedule, setSelectedSchedule] = useState("");
    const [selectedTask, setSelectedTask] = useState("");
    const [loading, setLoading] = useState(true)
    const [allSchedules, setAllSchedules] = useState([])
    const userUid = useSelector((state) => state.auth.uid);

    const { siteId } = route.params
    const date = new Date()
    const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    const db = getFirestore(firebaseApp);

    const windowCleaningScheduleRef = collection(
        db,
        "BuildingsX",
        siteId,
        "windowCleaningSchedule",
    );

    useEffect(() => {
        getSchedules()
    }, [])

    const getSchedules = async () => {
        try {
            const schedules = await getDocs(windowCleaningScheduleRef)
            const schedulesArray = []

            if (schedules.empty) {
                throw new Error('Sorry, No equipment has been added yet.')
            }
            schedules.forEach(eq => {
                schedulesArray.push({ id: eq.id, ...eq.data() })
            })

            setAllSchedules(schedulesArray)
            setLoading(false)

        } catch (error) {
            setLoading(false)
            console.log(error)
        }

    }

    const openFormMenuOnIos = () =>
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Cancel', ...allSchedules.map(e => e.name)],
                cancelButtonIndex: 0,
                userInterfaceStyle: 'dark',
            },
            buttonIndex => {
                if (buttonIndex === 0) {
                    return setSelectedSchedule('')
                }
                setSelectedSchedule(allSchedules[buttonIndex - 1].id)
            },
        );

    const submitFormHandler = async () => {
        try {
            if (!selectedSchedule || !selectedTask) {
                throw new Error('Please make sure a schedule and a task is selected.')
            }
            const schedulesRef = collection(windowCleaningScheduleRef, selectedSchedule.id, 'responses')
            const documentToAdd = {
                date: date,
                task: selectedTask,
                operatives: [userUid]
            }

            await addDoc(schedulesRef, documentToAdd)
            setSelectedSchedule("")

            const alertMessage = 'Thanks, scheduled has been successfully reported.'

            if (Platform.OS === 'web') {
                alert(alertMessage)
                navigation.navigate("Building");
            } else {
                Alert.alert('Thanks', alertMessage, [{ title: 'OK', onPress: navigation.navigate("Building") }])
            }

        } catch (error) {
            if (Platform.OS === 'web') {
                alert(error.message)
            } else {
                Alert.alert('Oops', error.message)
            }
        }

    };

    function isValid() {
        if (selectedSchedule !== "" && selectedTask !== "") return true
        return false
    }

    if (loading) return <ActivityIndicator size={24} color='blue' />

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{ flex: 1 }}
            enableOnAndroid={true}
            automaticallyAdjustContentInsets={true}
            enableAutomaticScroll={(Platform.OS === 'ios')}
        >
            <View style={styles.container}>
                <Text style={styles.title}>{siteId}</Text>
                <Text style={styles.date}>{dateString}</Text>

                {!allSchedules.length ?
                    <Text style={{ fontSize: 20, marginTop: 10 }}>No schedules have been added to this site.</Text>
                    :
                    <>
                        <View style={styles.section}>

                            {Platform.OS === 'ios' ?
                                <TouchableOpacity onPress={openFormMenuOnIos} style={styles.iosButton}>
                                    <Text style={styles.iosButtonText}>{selectedSchedule ? selectedSchedule : 'Please select'}</Text>
                                </TouchableOpacity>

                                :
                                <Picker
                                    style={styles.picker}
                                    selectedValue={selectedSchedule}
                                    onValueChange={(itemValue, itemIndex) => {
                                        setSelectedSchedule(allSchedules[itemIndex - 1]);
                                    }}
                                >
                                    <Picker.Item label="Please select" value="" />
                                    {allSchedules.map((d) => {
                                        return <Picker.Item key={d.id} label={d.name} value={d} />;
                                    })}
                                </Picker>
                            }
                            {!!selectedSchedule && (
                                <FlatList
                                    style={{ marginTop: 5 }}
                                    data={selectedSchedule.tasks}
                                    keyExtractor={item => item}
                                    renderItem={({ item }) => (
                                        <ItemWithRadioButton onClick={() => setSelectedTask(item)} text={item} isChecked={selectedTask === item ? true : false} />
                                    )}
                                />
                            )}
                        </View>

                        <TouchableOpacity
                            style={{ ...styles.submitButton, backgroundColor: isValid() ? "#5e99fa" : "grey" }}
                            disabled={!isValid()}
                            onPress={submitFormHandler}
                        >
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </>
                }
            </View>
        </ KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#fff",
        textAlign: "center",
        paddingVertical: 10,
        paddingHorizontal: 30
    },
    title: {
        fontSize: 30,
    },
    date: {
        fontSize: 20,
        fontStyle: "italic",
    },
    section: {
        marginVertical: 10,
        marginHorizontal: 20,
        alignItems: 'center'
    },
    picker: {
        width: 200,
        height: 50,
        borderRadius: 10,
        marginTop: 5,
        color: "black",
        backgroundColor: "#F6F6F6",
    },
    iosButton: {
        width: 200,
        height: 50,
        borderRadius: 10,
        marginTop: 5,
        backgroundColor: "#F6F6F6",
        justifyContent: 'center'
    },
    iosButtonText: {
        color: 'black',
        paddingHorizontal: 10
    },
    submitButton: {
        height: 59,
        borderRadius: 10,
        justifyContent: "center",
        width: 200,
        marginTop: 20,
        alignSelf: 'center'
    },
    submitButtonText: {
        color: '#fff',
        alignSelf: 'center'
    },
})

export default ScheduledTasksForm;
