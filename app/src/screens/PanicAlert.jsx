import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import BackgroundTimer from 'react-native-background-timer';
import axios from '../api/axios';
import {getAccessToken} from '../api/authHelper';
import Sms from 'react-native-sms';
import PushNotification from 'react-native-push-notification';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {PERMISSIONS, check} from 'react-native-permissions';

const PanicAlertActive = ({route, navigation}) => {
  const {userData} = route.params;
  const [autoStartTimer, setAutoStartTimer] = useState(30);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [intervalMinutes, setIntervalMinutes] = useState(10);
  const [tempInterval, setTempInterval] = useState(10);
  const [contacts, setContacts] = useState([]);
  const [isSendingLocation, setIsSendingLocation] = useState(false);
  const [error, setError] = useState(null);
  const locationUpdateTimer = useRef(null);

  const fetchContacts = async () => {
    try {
      const token = await getAccessToken();
      const response = await axios.get('/contacts/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContacts(response.data.results);
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
  useFocusEffect(
    useCallback(() => {
      fetchContacts();
    }, []),
  );

  useEffect(() => {
    requestLocationPermission();
    createNotificationChannel();

    const autoStartCountdown = setInterval(() => {
      setAutoStartTimer(prev => {
        if (prev <= 1) {
          clearInterval(autoStartCountdown);
          startSendingLocation();
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(autoStartCountdown);
  }, []);

  const checkLocationPermission = async () => {
    const permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    return await check(permission);
  };

  const requestLocationPermission = async () => {
    try {
      const permissionStatus = await checkLocationPermission();

      if (permissionStatus === 'granted') {
        console.log('Location permission granted');
      } else {
        console.log('Location permission denied');
        navigation.goBack();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    setTempInterval(intervalMinutes);
  };

  const handleSaveChanges = () => {
    setIntervalMinutes(tempInterval);
    toggleModal();
  };

  const createNotificationChannel = () => {
    PushNotification.createChannel(
      {
        channelId: 'panic_channel',
        channelName: 'Panic Alerts',
        channelDescription: 'Channel for panic alerts',
        importance: 4,
        vibrate: true,
      },
      created => console.log(`createChannel returned '${created}'`),
    );
  };

  const startSendingLocation = () => {
    setIsSendingLocation(true);

    if (locationUpdateTimer.current) {
      BackgroundTimer.clearInterval(locationUpdateTimer.current);
    }

    locationUpdateTimer.current = BackgroundTimer.setInterval(() => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          const message = `Emergency! ${userData.name} needs help. Location: https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
          contacts.forEach(contact =>
            sendMessage(contact, message, latitude, longitude),
          );
        },
        error => console.error('Error getting location:', error),
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }, intervalMinutes * 60000);
  };

  const sendMessage = async (contact, message) => {
    try {
      const result = await Sms.send({
        body: message,
        recipients: [contact.phone_number],
        successTypes: ['sent', 'queued'],
      });
      console.log('SMS sent successfully:', result);

      PushNotification.localNotification({
        channelId: 'panic_channel',
        title: 'Panic Alert Sent',
        message: `Message sent to ${contact.name}`,
      });
    } catch (error) {
      console.error('Failed to send SMS:', error);
      Alert.alert('Error', 'Failed to send panic alert. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panic Alert Active</Text>
      <View style={styles.statusContainer}>
        {isSendingLocation ? (
          <Text style={styles.sendingText}>
            <Icon name="location-on" size={20} color="red" /> Sending
            Location...
          </Text>
        ) : (
          <Text style={styles.timerText}>
            <Icon name="timer" size={20} color="gray" /> Starting in{' '}
            {autoStartTimer} seconds
          </Text>
        )}
      </View>
      <View style={styles.contactsContainer}>
        <Text style={styles.contactHeader}>
          <Icon name="people" size={20} /> Emergency Contacts:
        </Text>
        <FlatList
          data={contacts}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.contactItem}>
              <Text>{item.name}</Text>
              <Text>{item.phone}</Text>
            </View>
          )}
        />
      </View>
      <TouchableOpacity
        style={styles.stopButton}
        onPress={() => navigation.goBack()}>
        <Icon name="stop" size={24} color="white" />
        <Text style={styles.stopButtonText}>Stop Alert</Text>
      </TouchableOpacity>
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Settings</Text>
          <Text>Location Update Interval (minutes):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={tempInterval.toString()}
            onChangeText={text => setTempInterval(parseInt(text, 10) || 0)}
          />
          <Button title="Save Changes" onPress={handleSaveChanges} />
          <Button title="Cancel" onPress={toggleModal} color="red" />
        </View>
      </Modal>
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
    textAlign: 'center',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sendingText: {
    color: 'red',
    fontSize: 18,
  },
  settingsContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  stopButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 20,
  },
  stopButtonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
});
export default PanicAlertActive;
