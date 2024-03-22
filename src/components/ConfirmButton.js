import { TouchableOpacity, Text, StyleSheet } from "react-native"

const ConfirmButton = ({ confirmSelection }) => {
    return (
        <TouchableOpacity style={styles.confirmButton} onPress={confirmSelection}>
            <Text style={styles.confirmText}>CONFIRM</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    confirmButton: {
        marginVertical: 20,
        alignSelf: 'center',
        height: 40,
        width: 200,
        backgroundColor: '#6f6f6f',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    confirmText: {
        color: '#fff'
    }
})

export default ConfirmButton