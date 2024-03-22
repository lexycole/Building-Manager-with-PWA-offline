import { View } from 'react-native';
import * as Progress from 'react-native-progress';

const ProgressBar = ({progress}) => {
    return <View style={{flex: 1, marginRight: 5, alignSelf: 'center'}}>
        <Progress.Bar progress={progress} width={null} color='#fff' />
    </View>
}

export default ProgressBar