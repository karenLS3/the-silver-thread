import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from '../api/axios';
import {getAccessToken} from '../api/authHelper';

const ContactDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {contact} = route.params;
  const [name, setName] = useState(contact.name);
  const [phoneNumber, setPhoneNumber] = useState(contact.phone_number);

  const handleSaveChanges = async () => {
    try {
      const token = await getAccessToken();
      const payload = {
        name,
        phone_number: phoneNumber,
      };

      await axios.put(`/contacts/${contact.id}/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Success', 'Contact updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating contact:', error);
      Alert.alert('Error', 'Failed to update contact');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Contact</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Save Changes"
          onPress={handleSaveChanges}
          color="#47B8B8"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          color="#A29FA5"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    width: '80%',
    marginVertical: 10,
    borderRadius: 25,
    overflow: 'hidden',
  },
});

export default ContactDetailsScreen;
