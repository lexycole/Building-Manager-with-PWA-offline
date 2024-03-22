import { useState } from "react"
import { Text, View, TextInput, Platform, StyleSheet } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import WizardButton from "./WizardButton"
import { getPPEFormQuestions } from "../../utils/helpers/equipmentForms"

export default function WizardForm({ submitForm }) {
    const [questions, setQuestions] = useState(getPPEFormQuestions())
    const [questionStep, setQuestionStep] = useState(0)

    const currentQuestion = questions[questionStep]

    const selectCheckpoint = (value) => {
        const clonedQuestions = [...questions]
        clonedQuestions[questionStep].value = value
        setQuestions(clonedQuestions)
    }

    const onChangeText = (e) => {
        const clonedQuestions = [...questions]
        clonedQuestions[questionStep].value = e
        setQuestions(clonedQuestions)
    }

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{ flex: 1 }}
            enableOnAndroid={true}
            automaticallyAdjustContentInsets={true}
            enableAutomaticScroll={(Platform.OS === 'ios')}
        >
            <View style={styles.container}>

                <View style={styles.questionContainer}>
                    <Text style={styles.questionLabel}>{currentQuestion.question}</Text>

                    {currentQuestion.multipleChoice ? (
                        <View style={styles.buttonsContainer}>
                            <WizardButton
                                title="All Good"
                                value={currentQuestion.value}
                                onPress={() => selectCheckpoint("All Good")}
                            />
                            <WizardButton
                                title="Damaged"
                                value={currentQuestion.value}
                                onPress={() => selectCheckpoint("Damaged")}
                            />
                            <WizardButton
                                title="Missing"
                                value={currentQuestion.value}
                                onPress={() => selectCheckpoint("Missing")}
                            />
                        </View>
                    ) : (
                        <View>
                            <TextInput
                                placeholder="..."
                                numberOfLines={12}
                                multiline
                                textAlignVertical="top"
                                returnKeyType="done"
                                style={styles.textInput}
                                value={currentQuestion.value}
                                onChangeText={onChangeText}
                            />
                        </View>
                    )}

                </View>


                <View style={styles.buttonsContainer}>
                    {questionStep > 0 ?
                        <WizardButton title="Back" onPress={() => setQuestionStep(questionStep - 1)} />
                        : <View />
                    }
                    {questionStep < questions.length - 1 ?
                        <WizardButton
                            title="Next"
                            disabled={currentQuestion.value === "" ? true : false}
                            onPress={() => setQuestionStep(questionStep + 1)}
                        />
                        :
                        <WizardButton title="Submit" onPress={() => submitForm(questions)} />
                    }
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 15,
        marginVertical: 20
    },
    questionLabel: {
        fontSize: 20,
        marginBottom: 15
    },
    questionContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    buttonsContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    textInput: {
        border: '1px solid lightgrey',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        height: 150
    }
})