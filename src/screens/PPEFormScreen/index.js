import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { collection, getFirestore, addDoc } from "firebase/firestore";
import { firebaseApp } from "../../firebase/config";
import WizardForm from "../../components/WizardForm";

export default function PPEFormScreen({ navigation }) {

    const date = new Date();
    const buildingName = useSelector((state) => state.buildingList.buildingName);
    const userUid = useSelector((state) => state.auth.uid);

    const db = getFirestore(firebaseApp)

    const formsRef = collection(db, 'BuildingsX', buildingName, 'windowCleaningForms')

    const submitForm = async (questions) => {
        try {
            const cleanedQuestions = questions.map(q => {
                return {
                    question: q.question,
                    value: q.value
                }
            })
            const docToSave = {
                response: cleanedQuestions,
                completedBy: userUid,
                date: date,
                type: 'PPE'
            }

            await addDoc(formsRef, docToSave)

            alert('Thanks. Form has been saved.')
            navigation.navigate('Building')

        } catch (error) {
            alert(error)
            console.log(error)
        }

    }

    return (
        <View style={styles.container}>
            <WizardForm submitForm={submitForm} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff'
    }
})