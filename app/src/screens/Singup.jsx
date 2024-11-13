import React, {useState} from 'react';
import {
  Text,
  Button,
  Alert,
  SafeAreaView,
  StyleSheet,
  Image,
  View,
} from 'react-native';
import GradientBackground from '../components/GradientBackground';
import FloatingLabelInput from '../components/FloatingLabelInput'; // Ensure the path is correct
//import axios from 'axios';
import axios from '../api/axios'
import logoHorizontal from '../assets/images/appLogoH.png';

function SignUpScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSignUp = async () => {
    try {
      const response = await axios.post(
        '/users/register/',
        {
          email,
          name,
          last_name: lastName,
          phone_number: phone,
        },
      );
      console.log();
      Alert.alert(
        'Success',
        'Account created! Please check your email for verification.',
        [{text: 'OK', onPress: () => navigation.navigate('Init')}],
      );
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Failed to sign up. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <Image style={styles.logo} source={logoHorizontal} />
        <Text style={styles.title}>Create Your Account</Text>
        <Text style={styles.subtitle}>All fields are required</Text>

        <FloatingLabelInput
          label="First Name"
          value={name}
          onChangeText={setName}
          keyboardType="default"
        />
        <FloatingLabelInput
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
          keyboardType="default"
        />
        <FloatingLabelInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <FloatingLabelInput
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <View style={styles.buttonContainer}>
          <Button title="Sign Up" onPress={handleSignUp} />
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
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: 'white',
    fontSize: 14,
    marginBottom: 20,
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginVertical: 0,
  },
  buttonContainer: {
    width: '60%',
    marginVertical: 10,
    borderRadius: 25,
    overflow: 'hidden',
  },
});

export default SignUpScreen;
