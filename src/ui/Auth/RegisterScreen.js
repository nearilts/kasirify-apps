import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import COLORS from '../../const/color';
import { AuthContext } from '../../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';

const RegisterScreen = ({ navigation }) => {

  
    
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [name, setname] = useState(null);
  const [phone, setphone] = useState(null);
  const [city, setcity] = useState(null);
  const [address, setaddress] = useState(null);
  
  
  const {isLoading,registers} = useContext(AuthContext);


  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Register</Text>
        <Spinner visible={isLoading} />

        <TextInput
        placeholderTextColor={COLORS.dark}
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={text => setname(text)}
        />
        <TextInput
        placeholderTextColor={COLORS.dark}
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={text => setEmail(text)}
        />

        <TextInput
        placeholderTextColor={COLORS.dark}
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password} 
          onChangeText={text => setPassword(text)}
        />
        
        <TextInput
        placeholderTextColor={COLORS.dark}
          style={styles.input}
          placeholder="Phone (628*********)"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={text => setphone(text)}
        />
        
        <TextInput
        placeholderTextColor={COLORS.dark}
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={text => setcity(text)}
        />
        
        <TextInput
        placeholderTextColor={COLORS.dark}
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={text => setaddress(text)}
        />
        <Button title="Register" onPress={() => {registers(name,email,phone,city, password,address,navigation)}} />

        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}>Already have an account? Login here</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color:COLORS.dark
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.secondgrey,
    color:COLORS.dark,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  link: {
    marginTop: 16,
    color: 'blue',
    textAlign: 'center',
  },
});

export default RegisterScreen;
