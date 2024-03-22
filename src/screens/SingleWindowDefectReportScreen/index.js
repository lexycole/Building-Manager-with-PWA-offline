import { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, Alert, ActionSheetIOS, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getCleanNameFromId } from "../../utils/helpers/helpers";
import { useSelector } from "react-redux";
import { firebaseApp } from "../../firebase/config";
import BackgroundWithImage from "../../components/ScreenImageBackground";
import UploadPhotoBox from '../../components/UploadPhotoBox'
import { doc, collection, getFirestore, updateDoc, addDoc, arrayUnion } from "firebase/firestore";
import { AntDesign } from '@expo/vector-icons';

const SingleWindowDefectReportScreen = ({ navigation }) => {
    const [comment, setComment] = useState('')
    const [level, setLevel] = useState('')
    const [selectedWindow, setSelectedWindow] = useState('')

    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState(null)

    const currentClean = useSelector((state) => state.buildingList.currentClean);
    const currentDrop = useSelector((state) => state.buildingList.currentDrop);
    const buildingName = useSelector((state) => state.buildingList.buildingName);

    const userUid = useSelector((state) => state.auth.uid);
    const date = new Date();

    const db = getFirestore(firebaseApp);
    const storage = getStorage();
    const buildingRef = doc(db, "BuildingsX", buildingName);

    const dropRef = doc(
        buildingRef,
        "currentYear",
        currentClean,
        "drops",
        currentDrop.name
    );

    const defectsRef = collection(buildingRef, 'defects')

    useEffect(() => {
        (async () => {
            if (Platform.OS !== "web") {
                const { status } =
                    await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== "granted") {
                    alert("Sorry, we need camera roll permissions to make this work!");
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri)
        }
    };

    const submitHandler = async () => {
        try {
            setLoading(true)

            if(currentDrop.singleWindows.length && selectedWindow === '') {
                throw new Error('Please select a window.')
            }

            if (!image || !level || !comment) {
                throw new Error('Please make sure to fill every field.')
            }

            const dropNamePath = `${currentDrop.name}_Level_${level}`
            const singleWindowPath = `${dropNamePath}_${selectedWindow}`

            const docToSave = {
                name: currentDrop.singleWindows.length ? singleWindowPath : dropNamePath,
                dropId: currentDrop.name,
                fixDate: null,
                defectReportDate: date,
                defectType: 'building',
                inService: "",
                summary: comment,
                images: [await uploadImage(image)],
                equipmentId: "",
                completedBy: userUid
            }

            const defectDoc = await addDoc(defectsRef, docToSave)

            await updateDoc(dropRef, {
                isFaulty: true,
                cleanStatus: 'Faulty',
                faultyWindows: arrayUnion(defectDoc.id)
            })
            setLoading(false)
            submitted()

        } catch (error) {
            console.log(error)
        }
    }

    const submitted = () => {
        const alertMessage = `${currentDrop.name} just completed. Thank you`

        if (Platform.OS === 'web') {
            alert(alertMessage)
            navigation.goBack()
        } else {
            Alert.alert('Done', alertMessage, [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack()
                }
            ])
        }
    }

    const uploadImage = async () => {
        try {
            const response = await fetch(image)
            const blob = await response.blob()

            const imageRef = ref(storage, "window-cleaning/" + currentDrop.name)

            const snapshot = await uploadBytes(imageRef, blob)
            const imageUrl = await getDownloadURL(snapshot.ref)
            return imageUrl
        } catch (error) {
            console.log(error)
        }

    }

    const openFormMenuOnIos = () =>
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Cancel', ['L', 'R'].map(e => e)],
                cancelButtonIndex: 0,
                userInterfaceStyle: 'dark',
            },
            buttonIndex => {
                if (buttonIndex === 0) {
                    return setSelectedWindow('')
                }
                setSelectedWindow('L') // @todo - Will return to this once web is working.
            },
        );

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{ flex: 1 }}
            enableOnAndroid={true}
            automaticallyAdjustContentInsets={true}
            enableAutomaticScroll={(Platform.OS === 'ios')}
        >

            <BackgroundWithImage>
                <View style={styles.contentContainer}>
                    <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => navigation.goBack()}>
                        <AntDesign name="close" size={30} color="white" />
                    </TouchableOpacity>

                    <Text style={styles.infoText}>Clean: {getCleanNameFromId(currentClean)}</Text>
                    <Text style={styles.infoText}>Drop: {currentDrop.name}</Text>

                    <View style={styles.reportingBox}>

                        <TextInput
                            value={level}
                            placeholder="Level"
                            numberOfLines={1}
                            multiline
                            textAlignVertical="top"
                            returnKeyType="done"
                            onChangeText={(text) => setLevel(text)}
                            style={{ ...styles.commentsInput, height: 40, overflow: 'hidden' }}
                        />

                        {Platform.OS === 'ios' ?
                            <TouchableOpacity onPress={openFormMenuOnIos} style={styles.iosButton}>
                                <Text style={styles.iosButtonText}>{selectedWindow ? selectedWindow : 'Please select'}</Text>
                            </TouchableOpacity>

                            :
                            !!currentDrop.singleWindows.length && (
                                <Picker
                                    style={styles.picker}
                                    selectedValue={selectedWindow}
                                    onValueChange={(itemValue, itemIndex) => {
                                        setSelectedWindow(itemValue);
                                    }}
                                >
                                    <Picker.Item label="Please select" value="" />
                                    {currentDrop.singleWindows.map((d) => {
                                        return <Picker.Item key={d} label={d} value={d} />;
                                    })}
                                </Picker>
                            )
                        }

                        <TextInput
                            value={comment}
                            placeholder="Enter a comment..."
                            numberOfLines={12}
                            multiline
                            textAlignVertical="top"
                            returnKeyType="done"
                            onChangeText={(text) => setComment(text)}
                            style={styles.commentsInput}
                        />

                        <UploadPhotoBox pickImage={pickImage} selectedImage={image} />
                    </View>

                    <TouchableOpacity style={styles.submitButtonBox} onPress={submitHandler}>
                        {loading ? <ActivityIndicator /> : <Text style={styles.submitButtonText}>Submit</Text>}
                    </TouchableOpacity>
                </View>
            </BackgroundWithImage>

        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    contentContainer: {
        marginHorizontal: 30,
        marginVertical: 50,
        textAlign: 'center'
    },
    almostThereText: {
        color: '#fff',
        fontSize: 40,
        fontWeight: '700',
        marginVertical: 20
    },
    infoText: {
        color: '#fff',
        fontSize: 20
    },
    reportingBox: {
        marginVertical: 50,
        height: 350
    },
    commentsInput: {
        backgroundColor: '#fff',
        marginVertical: 10,
        padding: 10,
        borderRadius: 10,
        height: 240
    },
    submitButtonBox: {
        alignItems: 'center'
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 30,
        fontWeight: '700'
    },
    imagePickerContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'white',
        zIndex: 9,
    },
    picker: {
        // width: 150,
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
})

export default SingleWindowDefectReportScreen