import { Text, StyleSheet, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons';

const CleanNowCard = ({cleanNow}) => {
    return (
        <TouchableOpacity style={styles.cleanNowBox} onPress={cleanNow}>
            <Text style={styles.cleanNowText}>CLEAN NOW</Text>
            <AntDesign name="arrowright" size={24} color="white" />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cleanNowBox: {
        height: 40,
        backgroundColor: '#5e99fa',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 10
    },
    cleanNowText: {
        color: '#fff',
        fontWeight: '700'
    }
})

export default CleanNowCard