import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

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
        console.log(apiEndpoint)
        const response = await axios.get(apiEndpoint);
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
