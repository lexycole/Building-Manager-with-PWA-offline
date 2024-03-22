import { View, Text } from "react-native"
import Checkbox from "./Checkbox"

export const ItemWithRadioButton = ({ isChecked, text, onClick }) => {
    return (
        <View style={{ flexDirection: 'row', marginTop: 5, flexWrap: 'wrap' }} onClick={onClick}>
            <Checkbox
                onClick={onClick}
                isChecked={isChecked}
            />
            <View style={{ flex: 1, alignItems: 'flex-start', textAlign: 'left' }}>
                <Text style={{ paddingLeft: 5 }}>{text}</Text>
            </View>
        </View>
    )
}