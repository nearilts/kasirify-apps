import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../const/color';
import styles from '../const/styles';

export const FloatingButton = ({ iconName, onPress, buttonText }) => {
  return (
    <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
      <Icon name={iconName} size={24} color={COLORS.white} />
      <Text style={styles.floatingButtonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
};



export const ButtonLong = ({ iconName, onPress, buttonText }) => {
    return (
      <TouchableOpacity style={styles.ButtonLong} onPress={onPress}>
        <Icon name={iconName} size={24} color={COLORS.white} />
        <Text style={styles.ButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    );
  };