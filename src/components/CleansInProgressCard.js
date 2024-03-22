import { View, Text, Image, ImageBackground, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import cleanIcon from '../assets/images/clean-in-progress-icon-white.png'
import kingsCrossImage from '../assets/images/kings-cross-image.png'

const CleansInProgressCard = () => {
    return (
        <ImageBackground source={kingsCrossImage} resizeMode="cover" style={styles.cleansInProgressBox}>
            <LinearGradient
                colors={["rgba(101, 102, 102, 0.8)", "rgba(101, 102, 102, 0.8)",]}
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0,
                }}
            />
            <View>
                <Text style={styles.cleansInProgressNumber}>129</Text>
                <Text style={styles.cleansInProgressText}>Cleans in {"\n"}progress today!</Text>
            </View>
            <Image source={cleanIcon} style={styles.cleanImage} />
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    cleansInProgressBox: {
        height: 200,
        backgroundColor: 'grey',
        borderRadius: 10,
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 20,
    },
    cleansInProgressNumber: {
        fontSize: 35,
        fontWeight: '700',
        color: '#fff'
    },
    cleansInProgressText: {
        fontSize: 25,
        fontWeight: '600',
        color: '#fff'
    },
    cleanImage: {
        height: 80,
        width: 80,
        resizeMode: 'contain'
    },
})

export default CleansInProgressCard