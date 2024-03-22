import { Image, Text, StyleSheet, TouchableOpacity } from "react-native"
import wcLogo from '../assets/images/Principle_Window_Cleaning.png'

const RecentlyViewedBuildingCard = ({name, buildingImage, goToBuilding}) => {
    return (
        <TouchableOpacity style={styles.recentlyViewBuilding} onPress={goToBuilding}>
            <Image source={ buildingImage ? {uri: buildingImage } : wcLogo} style={styles.recentlyViewBuildingImage} />
            <Text style={styles.recentlyViewBuildingName}>{name}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    recentlyViewBuilding: {
        backgroundColor: '#fff',
        padding: 13,
        width: 160,
        height: 150,
        justifyContent: 'space-between',
        borderRadius: 10,
        marginRight: 10
    },
    recentlyViewBuildingImage: {
        resizeMode: 'contain',
        height: '90%',
        width: '100%'
    },
    recentlyViewBuildingName: {
        color: '#000',
    }
})

export default RecentlyViewedBuildingCard