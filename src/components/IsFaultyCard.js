import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { AntDesign } from '@expo/vector-icons';

const IsFaultyCard = ({ selectItem, isFaulty }) => {
    return (
        <View style={styles.isFaultyBox} >
            <Text style={styles.selectableItemText}>Is anything faulty?</Text>
            <TouchableOpacity style={styles.radioButton} onPress={selectItem} >
                {isFaulty &&
                    <AntDesign name="check" size={20} color="blue" style={{ alignSelf: 'center' }} />
                }
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    isFaultyBox: {
        marginTop: 10, // remove later
        backgroundColor: '#fff',
        height: 40,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    selectableItemText: {
        color: '#000',
        fontWeight: '500'
    },
    radioButton: {
        height: 20,
        width: 20,
        borderRadius: 20 / 2,
        borderWidth: 1,
        borderColor: 'blue',
        justifyContent: 'flex-start'
    }
})

export default IsFaultyCard