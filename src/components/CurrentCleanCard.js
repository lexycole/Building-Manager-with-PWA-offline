import { View, Text, StyleSheet } from "react-native"
import ProgressBar from "./ProgressBar"

const CurrentCleanCard = ({ name, progress = 0 }) => {
    return (
        <View style={styles.currentCleanBox}>
            <Text style={styles.currentCleanTitle}>Current Clean</Text>
            <Text style={styles.currentCleanName}>{name}</Text>

            <View style={styles.percentageBox}>
                <ProgressBar progress={Number(progress)} />
                <Text style={styles.percentageText}>{`${progress * 100}%`}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    currentCleanBox: {
        height: 90,
        backgroundColor: '#f67575',
        borderRadius: 10,
        marginBottom: 10,
        padding: 15
    },
    currentCleanTitle: {
        fontSize: 20,
        color: '#fff',
        fontWeight: '500'
    },
    currentCleanName: {
        fontSize: 11,
        color: '#fff'
    },
    percentageBox: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    percentageText: {
        color: '#fff'
    }
})

export default CurrentCleanCard