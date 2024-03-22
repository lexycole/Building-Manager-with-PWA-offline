import { View, Image, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import { useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import defaultProfileImg from '../assets/images/blank-profile-picture.png'
import { getAuth, signOut } from "firebase/auth";
import { firebaseApp } from '../firebase/config';
import { authActions } from '../store/auth-slice';
import { useDispatch } from 'react-redux';

const WelcomeBackHeader = () => {
    const userName = useSelector((state) => state.auth.name);
    const profileImg = useSelector((state) => state.auth.profile_img);
    const dispatch = useDispatch()

    const auth = getAuth(firebaseApp);

    const onLogoutPress = async () => {
        try {
            await signOut(auth)
            dispatch(authActions.authenticate({ isAuth: false }));
        } catch (error) {
            console.log(error)
        }
    };
    return (
        <View style={styles.container}>
            <View style={styles.topNavBox}>
                <View style={styles.person}>
                    <Image style={styles.profilePic} source={profileImg ? profileImg : defaultProfileImg} />
                    <View style={{ marginLeft: 8 }}>
                        <Text style={styles.welcomeBackText}>Welcome Back</Text>
                        <Text style={styles.personName}>{userName}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={onLogoutPress}>
                    <MaterialCommunityIcons name="logout" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 100,
        backgroundColor: '#5e99fa',
        justifyContent: 'flex-end',
        // alignSelf: 'center',
        paddingBottom: 10
    },
    topNavBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,

    },
    person: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    profilePic: {
        height: 50,
        width: 50,
        borderRadius: 50,
    },
    welcomeBackText: {
        color: '#fff',
        fontSize: 16
    },
    personName: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16
    }
})

export default WelcomeBackHeader