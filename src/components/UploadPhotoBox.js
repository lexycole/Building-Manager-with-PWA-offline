import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import { AntDesign } from '@expo/vector-icons';

const UploadPhotoBox = ({ pickImage, selectedImage }) => {
    return (
        <TouchableOpacity style={styles.uploadPhotoBox} onPress={pickImage}>
            <Text style={styles.uploadPhotoText}>Upload a photo: {selectedImage && '1 Selected'}</Text>
            <AntDesign name="pluscircle" size={20} color="blue" />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    uploadPhotoBox: {
        marginTop: 10, // remove later
        backgroundColor: '#fff',
        height: 40,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    uploadPhotoText: {
        color: '#000',
        fontWeight: '700'
    },
})

export default UploadPhotoBox