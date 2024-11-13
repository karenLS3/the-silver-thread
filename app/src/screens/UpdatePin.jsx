import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Alert,
  TextInput,
  Image,
  View,
  Button,
} from 'react-native';
import GradientBackground from '../components/GradientBackground';
import FloatingLabelInput from '../components/FloatingLabelInput';
//import axios from 'axios';
import axios from '../api/axios'
import logoHorizontal from '../assets/images/appLogoH.png';

function UpdatePinScreen({route, navigation}) {
  const [newPin, setNewPin] = useState('');
  const {email} = route.params;

  const handleUpdatePin = async () => {
    try {
      axios.post('/users/update-pin/', {
        email,
        new_pin: newPin,
      });
      Alert.alert(
        'Success',
        'PIN updated successfully! You can now log in with your new PIN.',
      );
      navigation.navigate('SignIn');
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Error',
        error.response?.data?.detail || 'Failed to update PIN',
      );
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <Image style={styles.logo} source={logoHorizontal} />
        <Text style={styles.title}>Please enter the new PIN Code</Text>
        <View style={styles.containerInput}>
          <Text style={styles.label}>Email</Text>
          <TextInput value={email} editable={false} style={styles.input} />
        </View>

        <FloatingLabelInput
          label="NEW PIN CODE*"
          value={newPin}
          onChangeText={setNewPin}
          keyboardType="numeric"
        />
        <View style={styles.buttonContainer}>
          <Button title="Update" onPress={handleUpdatePin}/>
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
  containerInput: {
    width: '80%',
    marginVertical: 10,
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
  label: {
    left: 10,
    top: 0,
    color: 'purple',
    marginVertical: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: 'purple',
    padding: 10,
    fontSize: 15,
    color: 'gray',
    backgroundColor: '#FAEEEE',
  },
});

export default UpdatePinScreen;
