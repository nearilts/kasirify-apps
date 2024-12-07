// CategoryItem.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../const/styles'; // Sesuaikan dengan path file styles Anda
import COLORS from '../const/color';

const CategoryItem = ({ item, selectedCategory, onSelect }) => {
  return (
    <View style={{ marginBottom: 20 }}>
        <TouchableOpacity onPress={() => onSelect(item.id)}>
        <View
        style={[
          styles.card90,
          {
            height: 60,
            marginHorizontal: 10,
            backgroundColor: selectedCategory === item.id ? COLORS.primary2 : COLORS.primary,
            borderRadius: 5,
          },
        ]}
      >
          <View style={styles.flexRowBetween}>
            <Text style={[styles.text15, { fontWeight: 'bold', color: COLORS.white }]}>{item?.name}</Text>
          </View>
      </View>
        </TouchableOpacity>
        </View>
  );
};

export default CategoryItem;
