import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from '../api/axios';
import {getAccessToken} from '../api/authHelper';
import Contacts from 'react-native-contacts';
import {PERMISSIONS, request, check} from 'react-native-permissions';

const AddContactScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contactsModalVisible, setContactsModalVisible] = useState(false);
  const [contactsList, setContactsList] = useState([]);

  const handleCreateContact = async () => {
    try {
      const token = await getAccessToken();

      if (!token) {
        Alert.alert(
          'Authentication Error',
          'You need to be logged in to create a contact.',
        );
        return;
      }

      const payload = {
        name,
        phone_number: phoneNumber,
      };

      const response = await axios.post('/contacts/', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Contact created successfully:', response.data);
      Alert.alert('Success', 'Contact created successfully!');
      navigation.navigate('ContactList');
    } catch (error) {
      console.error(
        'Error creating contact:',
        error.response?.data || error.message,
      );
      Alert.alert('Error', 'Failed to create contact');
    }
  };

  const handleSelectContact = async () => {
    try {
      const permissionStatus = await checkContactsPermission();

      if (permissionStatus === 'granted') {
        const allContacts = await Contacts.getAll();
        setContactsList(allContacts);
        setContactsModalVisible(true);
      } else {
        await requestContactsPermission();
      }
    } catch (error) {
      console.log('Error accessing contacts:', error);
    }
  };

  const checkContactsPermission = async () => {
    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.READ_CONTACTS
        : PERMISSIONS.IOS.CONTACTS;
    return await check(permission);
  };

  const requestContactsPermission = async () => {
    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.READ_CONTACTS
        : PERMISSIONS.IOS.CONTACTS;
    const status = await request(permission);

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Contact access is required to select a contact.',
      );
    }
    return status;
  };

  const handleContactSelect = contact => {
    setName(contact.givenName || contact.familyName);
    setPhoneNumber(contact.phoneNumbers[0]?.number || '');
    setContactsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Emergency Contact</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        onChangeText={setName}
        value={name}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        onChangeText={setPhoneNumber}
        value={phoneNumber}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Create Contact"
          onPress={handleCreateContact}
          color="#47B8B8"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Select from Device"
          onPress={handleSelectContact}
          color="#81B947"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Back to List"
          onPress={() => navigation.goBack()}
          color="#A29FA5"
        />
      </View>

      <Modal
        visible={contactsModalVisible}
        animationType="slide"
        onRequestClose={() => setContactsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select a Contact</Text>
          <FlatList
            data={contactsList}
            keyExtractor={item => item.recordID}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => handleContactSelect(item)}>
                <Text style={styles.contactName}>
                  {item.givenName} {item.familyName}
                </Text>
                <Text style={styles.contactPhone}>
                  {item.phoneNumbers[0]?.number}
                </Text>
              </TouchableOpacity>
            )}
          />
          <Button
            title="Close"
            onPress={() => setContactsModalVisible(false)}
          />
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  contactItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  contactName: {
    fontSize: 18,
  },
  contactPhone: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    width: '80%',
    marginVertical: 10,
    borderRadius: 25,
    overflow: 'hidden',
  },
});

export default AddContactScreen;
