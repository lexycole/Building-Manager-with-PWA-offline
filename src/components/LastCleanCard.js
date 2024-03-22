import { View, Text, StyleSheet } from 'react-native'

const LastCleanCard = ({date, dropName}) => {
    return (
        <View style={styles.lastCleanBox}>
            <Text style={styles.lastCleanTitle}>Last Clean - {dropName}</Text>
            <Text style={styles.lastCleanText}>{date}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    lastCleanBox: {
        height: 70,
        backgroundColor: '#67c48f',
        borderRadius: 10,
        marginBottom: 10,
        padding: 15
    },
    lastCleanTitle: {
        fontSize: 20,
        color: '#fff',
        fontWeight: '500'
    },
    lastCleanText: {
        fontSize: 11,
        color: '#fff'
    }
})

export default LastCleanCard