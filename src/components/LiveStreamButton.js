import { TouchableOpacity, Text, StyleSheet, Platform } from "react-native"

const LiveStreamButton = ({ startStopLiveStream, isLiveStreaming }) => {
    return (
        <TouchableOpacity style={{ ...styles.liveStreamButton, backgroundColor: !isLiveStreaming ? '#4BCD99' : '#f67575' }} onPress={startStopLiveStream}>
            <Text style={styles.liveStreamButtonText}>{!isLiveStreaming ? 'Go Live' : 'Stop Live Streaming'}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    liveStreamButton: {
        marginTop: 20,
        marginBottom: Platform.OS === 'web' ? 0 : 20,
        alignSelf: 'center',
        height: 40,
        width: 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    liveStreamButtonText: {
        color: '#fff',
        fontWeight: '700'
    }
})

export default LiveStreamButton