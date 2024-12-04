import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchableSelect = ({ 
  label, 
  apiEndpoint, 
  onSelect, 
  selectedValue, 
  placeholder, 
  labelKey = 'name', 
  valueKey = 'id' 
}) => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let userInfo = await AsyncStorage.getItem('userInfo');
        userInfo = JSON.parse(userInfo);
        let token = userInfo.access_token.split('|')[1];

        let toko_id = await AsyncStorage.getItem('TokoInfo');
        toko_id = JSON.parse(toko_id);
        let param = '';

        if (toko_id && toko_id.toko_id) {
          param = `?toko_id=${toko_id.toko_id}`;
        }
        
        console.log(apiEndpoint+param)
        const response = await axios.get(apiEndpoint+param, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setData(response.data.data);
        setFilteredData(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [apiEndpoint]);

  useEffect(() => {
    if (query) {
      const filtered = data.filter(item =>
        item[labelKey]?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [query, data, labelKey]);

  const handleSelect = (item) => {
    onSelect({ id: item[valueKey], label: item[labelKey] });
    setQuery(item[labelKey]);
    setDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          setDropdownVisible(true);
        }}
        onFocus={() => setDropdownVisible(true)}
      />
      {isDropdownVisible && (
        <FlatList
          style={styles.dropdown}
          data={filteredData}
          keyExtractor={(item) => item[valueKey].toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelect(item)}>
              <Text style={styles.item}>{item[labelKey]}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    maxHeight: 150,
    backgroundColor: '#fff',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default SearchableSelect;
