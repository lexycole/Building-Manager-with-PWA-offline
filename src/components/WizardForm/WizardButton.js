import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function WizardButton({ title, value, disabled = false, onPress }) {
    return (
        <TouchableOpacity
        disabled={disabled}
        style={{ ...styles.container, backgroundColor: value === title ? 'green' : disabled ? 'lightgrey' : '#fff' }} 
        onPress={onPress} >
            <Text style={{ ...styles.text, color: value === title ? '#fff' : '#000' }}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '70px',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        border: '1px solid grey',
        padding: 2,
        margin: 1
    },
    text: {
        color: '#000'
    }
})