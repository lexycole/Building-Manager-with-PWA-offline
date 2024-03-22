import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { AntDesign } from '@expo/vector-icons';

const defaultWCLogo = '../assets/images/Principle_Window_Cleaning.png'

const ViewBuildingCard = ({ contractName, buildingName, goToBuilding, buildingImage }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={goToBuilding}>
            <View style={styles.buildingImageContainer}>
                <Image source={buildingImage ? { uri: buildingImage } : defaultWCLogo} style={styles.buildingImage} />

            </View>
            <View style={styles.nameContainer}>
                <Text style={styles.contractName}>{contractName}</Text>
                <View style={styles.nameAndArrow}>
                    <Text style={styles.buildingName}>{buildingName}</Text>
                    <AntDesign name="arrowright" size={24} color="black" />
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 100,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingHorizontal: 10
    },
    buildingImageContainer: {
        flex: 1,
    },
    buildingImage: {
        height: '100%',
        width: '100%',
        resizeMode: 'contain'
    },
    nameContainer: {
        flex: 2,
        justifyContent: 'center',
        paddingLeft: 10
    },
    nameAndArrow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    contractName: {
        fontWeight: '400'
    },
    buildingName: {
        fontWeight: '700'
    }
})

export default ViewBuildingCard