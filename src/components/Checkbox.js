import { TouchableOpacity, StyleSheet } from "react-native"
import { AntDesign } from '@expo/vector-icons';

const Checkbox = ({isChecked = false, onClick}) => {
    return (
        <TouchableOpacity style={styles.radioButton} onPress={onClick} >
            {isChecked &&
                <AntDesign name="check" size={20} color="blue" style={{ alignSelf: 'center' }} />
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    radioButton: {
        height: 20,
        width: 20,
        borderRadius: 20 / 2,
        borderWidth: 1,
        borderColor: 'blue',
        justifyContent: 'flex-start'
    }
})

export default Checkbox