import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../const/color';

const ButtonCircle = ({ iconName, color, onPress, label, coloricon = COLORS.white }) => {
    return (
        <TouchableOpacity onPress={onPress} >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.iconContainer(color)}>
                    <Icon name={iconName} size={30} color={coloricon} />
                    <Text style={styles.label} numberOfLines={2}>
                        {label}
                    </Text>
                </View>
                <View style={styles.labelContainer}>
                    {/* <Text style={styles.label} numberOfLines={2}>
                        {label}
                    </Text> */}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    iconContainer: (color) => ({
        marginLeft: 10,
        marginRight: 10,
        marginBottom:10,
        width: 70,
        height: 70,
        borderRadius: 10,
        backgroundColor: color,
        alignItems: 'center',
        justifyContent: 'center',
    }),
    labelContainer: {
        maxWidth: 65, // Set max width for wrapping
        alignItems: 'center', // Center align text
    },
    label: {
        fontSize: 12,
        color: COLORS.white,
        textAlign: 'center',
        fontWeight:'bold'
    },
});

export default ButtonCircle;
