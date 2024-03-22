import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import ScreenImageBackground from "../../components/ScreenImageBackground";
import logo from '../../assets/images/wc-logo.png'
import { buildingListActions } from "../../store/building-slice";
import { useDispatch } from "react-redux";

const ThankYouScreen = ({navigation}) => {
    const dispatch = useDispatch()
    return (
        <View style={styles.container}>
            <ScreenImageBackground>
                <View style={styles.contentContainer}>
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Image source={logo} style={styles.logo} />
                        </View>

                        <TouchableOpacity onPress={() => {
                            navigation.navigate('Building')
                            dispatch(buildingListActions.setRefreshBuildingVersion())
                            }}>
                            <AntDesign name="close" size={30} color="white" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.thankYouText}>
                        Thank you
                    </Text>
                </View>
            </ScreenImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
        marginHorizontal: 40,
        marginVertical: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 100,
    },
    logoContainer: {
        height: 200,
    },
    logo: {
        width: 90,
        height: 90,
        resizeMode: 'contain'
    },
    thankYouText: {
        color: '#fff',
        fontSize: 40,
        fontWeight: '700',
    }
})

export default ThankYouScreen