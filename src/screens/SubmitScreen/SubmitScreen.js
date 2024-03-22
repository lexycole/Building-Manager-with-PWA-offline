import { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, Alert, ActivityIndicator } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getCleanNameFromId } from "../../utils/helpers/helpers";
import { useSelector } from "react-redux";
import { firebaseApp } from "../../firebase/config";
import BackgroundWithImage from "../../components/ScreenImageBackground";
import IsFaultyCard from "../../components/IsFaultyCard";
import UploadPhotoBox from '../../components/UploadPhotoBox'
import { doc, collection, getCountFromServer, getFirestore, updateDoc, query, where, setDoc } from "firebase/firestore";

const SubmitScreen = ({ navigation }) => {
    const [isFaulty, setIsFaulty] = useState(false)
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState(null)
    let imageDownloadUrl = null;
    const currentClean = useSelector((state) => state.buildingList.currentClean);
    const currentDrop = useSelector((state) => state.buildingList.currentDrop);
    const buildingName = useSelector((state) => state.buildingList.buildingName);
    const currentCleanData = useSelector(
        (state) => state.buildingList.currentCleanData
    );
    const userUid = useSelector((state) => state.auth.uid);
    const building = useSelector((state) => state.buildingList.buildingData);
    const date = new Date();

    const db = getFirestore(firebaseApp);
    const storage = getStorage();
    const buildingRef = doc(db, "BuildingsX", buildingName);

    const dropRef = doc(buildingRef, "currentYear", currentClean, "drops", currentDrop.name);

    const cleanRef = doc(buildingRef, "currentYear", currentClean);
    const defectsRef = collection(buildingRef, "defects");

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

    const selectItem = () => {
        setIsFaulty(!isFaulty)
    }

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

            if (isFaulty && !image) {
                throw new Error("You must upload an image if reporting a fault.")
            }

            if (image) {
                await uploadImage()
            }
            updateDoc(dropRef, {
                cleanStatus: !isFaulty ? "Cleaned" : "Faulty",
                date: date,
                comments: comment,
                isFaulty: isFaulty,
                image_url: imageDownloadUrl ? imageDownloadUrl : ''
            })

            updateDoc(buildingRef, {
                currentClean: currentClean,
                currentCleanRef: cleanRef,
                lastCleaned: date,
                lastDropCleaned: currentDrop.name
            })

            if (isFaulty) {
                const documentToAdd = {
                    defectReportDate: date,
                    fixDate: null,
                    defectType: 'building',
                    inService: "",
                    summary: comment,
                    images: [imageDownloadUrl],
                    completedBy: userUid,
                    equipmentId: "",
                    dropId: currentDrop.name
                }
                await setDoc(doc(defectsRef), documentToAdd)
            }

            if (currentCleanData) {
                const dropsCol = collection(cleanRef, "drops");
                const q = query(dropsCol, where("isComplete", "==", true));
                const snapshot = await getCountFromServer(q);
                const noOfDropsCleaned = snapshot.data().count;

                if (noOfDropsCleaned === 0) {
                    updateDoc(cleanRef, { startDate: date })
                } else if (noOfDropsCleaned === building.noDrops - 1) {
                    updateDoc(cleanRef, { finishDate: date })
                }
            }

            submitted()

        } catch (error) {
            alert(error.message)
            console.log(error)
        }
    }

    const submitted = () => {
        const alertMessage = `${currentDrop.name} just completed. Remember to fill your "After Clean form". Thank you.`

        if (Platform.OS === 'web') {
            alert(alertMessage)
            setLoading(false)
            navigation.navigate('Thanks')
        } else {
            Alert.alert('Done', alertMessage, [
                {
                    text: 'OK',
                    onPress: () => {
                        setLoading(false)
                        navigation.navigate('Thanks')

                    }
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
            imageDownloadUrl = imageUrl
        } catch (error) {
            console.log(error)
        }

    }

    if (loading) return <ActivityIndicator style={{ flex: 1 }} size='large' color='#5e99fa' />

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{ flex: 1 }}
            enableOnAndroid={true}
            automaticallyAdjustContentInsets={true}
            enableAutomaticScroll={(Platform.OS === 'ios')}
        >

            <BackgroundWithImage>
                <View style={styles.contentContainer}>
                    <Text style={styles.almostThereText}>Almost there...</Text>

                    <Text style={styles.infoText}>Clean: {getCleanNameFromId(currentClean)}</Text>
                    <Text style={styles.infoText}>Drop: {currentDrop.name}</Text>

                    <View style={styles.reportingBox}>
                        <IsFaultyCard isFaulty={isFaulty} selectItem={selectItem} />

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
                        <Text style={styles.submitButtonText}>Submit</Text>
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
        marginVertical: 50
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
    }
})

export default SubmitScreen