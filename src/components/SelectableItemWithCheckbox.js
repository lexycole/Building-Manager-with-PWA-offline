import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { AntDesign } from '@expo/vector-icons';

const SelectableItemWithCheckbox = ({ name, selectItem, isSelected, isCleaned }) => {
    return (
        <TouchableOpacity
            style={name === isSelected ?
                styles.selectedItemBox :
                isCleaned ?
                    styles.cleanedItemBox :
                    styles.unselectedItemBox}
            onPress={selectItem}>
            <Text style={styles.selectableItemText}>{name}</Text>
            <View style={styles.radioButton}>
                {isSelected === name && <AntDesign name="check" size={20} color="white" style={{ alignSelf: 'center' }} />}
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    unselectedItemBox: {
        marginTop: 10, // remove later
        backgroundColor: '#5e99fa',
        height: 40,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    selectedItemBox: {
        marginTop: 10, // remove later
        backgroundColor: '#6f6f6f',
        height: 40,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    cleanedItemBox: {
        marginTop: 10, // remove later
        backgroundColor: '#00cc00',
        height: 40,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    selectableItemText: {
        color: '#fff',
        fontWeight: '500'
    },
    radioButton: {
        height: 20,
        width: 20,
        borderRadius: 20 / 2,
        borderWidth: 1,
        borderColor: '#fff',
        justifyContent: 'flex-start'
    }
})

export default SelectableItemWithCheckbox