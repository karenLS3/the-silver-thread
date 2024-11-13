import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import axios from '../api/axios';
import {getAccessToken} from '../api/authHelper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Card} from 'react-native-elements';

const ContactListScreen = () => {
  const navigation = useNavigation();
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);

  const fetchContacts = async () => {
    try {
      const token = await getAccessToken();
      const response = await axios.get('/contacts/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContacts(response.data.results); // Update with paginated results
      setError(null);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Unauthorized. Please log in.');
      } else {
        console.error('Error fetching contacts:', error);
        setError('Error fetching contacts');
      }
    }
  };

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = await getAccessToken();
        const response = await axios.get('/contacts/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setContacts(response.data.results); // Update to fetch paginated results
        setError(null);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError('Unauthorized. Please log in.');
        } else {
          console.error('Error fetching contacts:', error);
          setError('Error fetching contacts');
        }
      }
    };
    fetchContacts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchContacts(); // Fetch contacts every time screen is focused
    }, []),
  );

  const handleDeleteContact = async id => {
    try {
      const token = await getAccessToken();
      await axios.delete(`/contacts/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContacts(contacts.filter(c => c.id !== id));
      Alert.alert('Deleted', 'Contact has been deleted');
    } catch (error) {
      console.error('Error deleting contact:', error);
      Alert.alert('Error', 'Failed to delete contact');
    }
  };

  const handleEditContact = contact => {
    navigation.navigate('ContactDetails', {contact});
  };

  return (
    <View style={styles.container}>
      <Card containerStyle={[styles.card, {backgroundColor: '#E57373'}]}>
        <Card.Title style={styles.cardTitle}>Trusted Contacts</Card.Title>
        <Card.Divider />
        <Text style={styles.cardDescription}>
          Choose and add your trusted contacts to be notified in case of an
          emergency
        </Text>
      </Card>
      {error && <Text style={{color: 'red'}}>{error}</Text>}
      <TouchableOpacity
        style={styles.buttonAdd}
        onPress={() => navigation.navigate('AddContact')}>
        <Icon name="add" size={24} color="#fff" />
      </TouchableOpacity>
      <FlatList
        data={contacts}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.contactItem}>
            <TouchableOpacity onPress={() => handleEditContact(item)}>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactPhone}>{item.phone_number}</Text>
            </TouchableOpacity>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => handleEditContact(item)}>
                <Icon name="edit" size={24} color="#47B8B8" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteContact(item.id)}>
                <Icon name="delete" size={24} color="#5A575E" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactPhone: {
    fontSize: 16,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginHorizontal: 10,
  },
  card: {
    borderRadius: 10,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // Text color for better contrast
  },
  cardDescription: {
    marginBottom: 8,
    color: '#fff', // Text color for better contrast
  },
  buttonAdd: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF', // Customize the color as desired
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // For shadow effect on Android
    shadowColor: '#000', // For shadow on iOS
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 3,
  },
});

export default ContactListScreen;
