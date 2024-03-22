import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { AntDesign } from '@expo/vector-icons';

const FormCard = ({name, openForm}) => {
    return (
        <TouchableOpacity style={styles.formBox} onPress={openForm}>
            <Text style={styles.formText}>{name}</Text>
            <AntDesign name="arrowright" size={24} color="white" />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    formBox: {
        height: 30,
        backgroundColor: 'grey',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 7
    },
    formText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 12
    }
})

export default FormCard