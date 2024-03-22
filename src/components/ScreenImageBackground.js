import { ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import londonImage from '../assets/images/london.jpg'

const ScreenImageBackground = ({children}) => {
    return (
        <ImageBackground source={londonImage} resizeMode="cover" style={{flex: 1}}>
            <LinearGradient
                colors={["rgba(94, 153, 250, 0.6)", "rgba(94, 153, 250, 0.6)",]}
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0,
                }}
            />
            {children}
        </ImageBackground>
    )
}

export default ScreenImageBackground