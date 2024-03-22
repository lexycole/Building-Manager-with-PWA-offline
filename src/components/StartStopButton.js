import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';


const StartStopButton = ({ inProgress, startStopHandler }) => {
    return (
        <View style={styles.buttonBox}>
            <View style={styles.whiteCircle}>
                <TouchableOpacity onPress={startStopHandler} style={inProgress ? styles.stopButton : styles.startButton}>
                    {inProgress ?
                        <FontAwesome name="stop" size={80} color="white" />
                        : <AntDesign name="caretright" size={90} color="white" />
                    }
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonBox: {
        height: 350,
        marginTop: 10,
        margin: Platform.OS === 'web' ? 'auto' : 0
    },
    whiteCircle: {
        height: 350,
        width: 350,
        borderRadius: 350 / 2,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        right: Platform.OS === 'web' ? 0 : -50
    },
    startButton: {
        height: 150,
        width: 150,
        borderRadius: 150 / 2,
        backgroundColor: '#67c48f',
        justifyContent: 'center',
        alignItems: 'center'
    },
    stopButton: {
        height: 150,
        width: 150,
        borderRadius: 150 / 2,
        backgroundColor: '#f67575',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default StartStopButton