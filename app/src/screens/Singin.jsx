import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Button,
  Text,
  Alert,
  Image,
  View,
} from 'react-native';
import GradientBackground from '../components/GradientBackground';
import FloatingLabelInput from '../components/FloatingLabelInput';
//import axios from 'axios';
import axios from '../api/axios';
import logoHorizontal from '../assets/images/appLogoH.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

function SignInScreen({navigation}) {
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('');

  const handleSignIn = async () => {
    try {
      const response = await axios.post('/users/login/', {
        email,
        pin_code: pin,
      });
      if (
        response.data.message ===
        'First login successful. Please update your PIN.'
      ) {
        navigation.navigate('UpdatePin', {email});
      } else {
        Alert.alert('Success', 'Logged in successfully!');
        const {access, refresh, user} = response.data;
        await AsyncStorage.setItem('accessToken', access);
        await AsyncStorage.setItem('refreshToken', refresh);
        await AsyncStorage.setItem('user_data', JSON.stringify(user));

        navigation.reset({
          index: 0,
          routes: [{name: 'Home', params: { userData: user }}],
        });
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.detail || 'Failed to sign in');
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <Image style={styles.logo} source={logoHorizontal} />
        <Text style={styles.title}>Welcome to Aegis</Text>

        <FloatingLabelInput
          label="Email*"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <FloatingLabelInput
          label="PIN CODE*"
          value={pin}
          onChangeText={setPin}
          keyboardType="numeric"
        />
        <View style={styles.buttonContainer}>
          <Button title="Sign In" onPress={handleSignIn} />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 5,
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginVertical: 0,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  subtitle: {
    color: 'white',
    fontSize: 14,
    marginVertical: 10,
  },
  buttonContainer: {
    width: '60%',
    marginVertical: 10,
    borderRadius: 25,
    overflow: 'hidden',
  },
});

export default SignInScreen;
