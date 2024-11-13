import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import logoApp from '../assets/images/appLogo.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientBackground from '../components/GradientBackground';
import call from 'react-native-phone-call';

const HomeScreen = ({route}) => {
  const {userData} = route.params;
  const navigation = useNavigation();

  // State for SOS Call
  const [isSOSCountingDown, setIsSOSCountingDown] = useState(false);
  const [sosCountdown, setSOSCountdown] = useState(5);

  // State for Panic Alert
  const [isPanicCountingDown, setIsPanicCountingDown] = useState(false);
  const [panicCountdown, setPanicCountdown] = useState(5);

  // Separate countdown handlers
  let sosCountdownTimer;
  let panicCountdownTimer;

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      navigation.reset({
        index: 0,
        routes: [{name: 'Init'}],
      });
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleSOSPress = () => {
    setIsSOSCountingDown(true);
    setSOSCountdown(5);
  };

  useEffect(() => {
    if (isSOSCountingDown && sosCountdown > 0) {
      sosCountdownTimer = setTimeout(
        () => setSOSCountdown(sosCountdown - 1),
        1000,
      );
    } else if (isSOSCountingDown && sosCountdown === 0) {
      initiateSOSCall();
    }
    return () => clearTimeout(sosCountdownTimer);
  }, [sosCountdown, isSOSCountingDown]);

  const initiateSOSCall = () => {
    setIsSOSCountingDown(false);
    call({number: '911', prompt: false}).catch(console.error);
  };

  const handleSOSCancel = () => {
    setIsSOSCountingDown(false);
    setSOSCountdown(5);
  };

  // Panic Alert handlers
  const handlePanicAlertPress = () => {
    setIsPanicCountingDown(true);
    setPanicCountdown(5);
  };

  useEffect(() => {
    if (isPanicCountingDown && panicCountdown > 0) {
      panicCountdownTimer = setTimeout(
        () => setPanicCountdown(panicCountdown - 1),
        1000,
      );
    } else if (isPanicCountingDown && panicCountdown === 0) {
      initiatePanicAlert();
    }
    return () => clearTimeout(panicCountdownTimer);
  }, [panicCountdown, isPanicCountingDown]);

  const initiatePanicAlert = () => {
    setIsPanicCountingDown(false);
    navigation.navigate('PanicAlertActive', {userData});
  };

  const handlePanicAlertCancel = () => {
    setIsPanicCountingDown(false);
    setPanicCountdown(5);
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.topNav}>
          <TouchableOpacity onPress={handleLogout}>
            <Icon name="logout" size={24} color="#000" />
          </TouchableOpacity>
          <Image source={logoApp} style={styles.logo} />
          <TouchableOpacity
            onPress={() => navigation.navigate('AccountSettings')}>
            <Icon name="account-circle" size={24} />
          </TouchableOpacity>
        </View>

        <Text style={styles.welcomeText}>Welcome, {userData.name}</Text>

        <View style={styles.mainContent}>
          <TouchableOpacity
            style={[styles.button, styles.alertButton]}
            onPress={handlePanicAlertPress}>
            <Icon
              name="warning"
              size={20}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Panic Alert</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.sosButton]}
            onPress={handleSOSPress}>
            <Icon
              name="phone"
              size={20}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>SOS Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate({name: 'ContactList'})}>
            <Icon
              name="person-add"
              size={20}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Add Emergency Contact</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.resourcesButton]}
            onPress={() => navigation.navigate('Resources')}>
            <Icon
              name="info"
              size={20}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Resources</Text>
          </TouchableOpacity>
        </View>

        {/* SOS Countdown Overlay */}
        {isSOSCountingDown && (
          <View style={styles.countdownOverlay}>
            <Text style={styles.countdownText}>
              Calling 911 in {sosCountdown} seconds...
            </Text>
            <Button title="Cancel" onPress={handleSOSCancel} color="red" />
          </View>
        )}

        {/* Panic Alert Countdown Overlay */}
        {isPanicCountingDown && (
          <View style={styles.countdownOverlay}>
            <Text style={styles.countdownText}>
              Sending alert in {panicCountdown} seconds...
            </Text>
            <Button
              title="Cancel"
              onPress={handlePanicAlertCancel}
              color="red"
            />
          </View>
        )}

        <View style={styles.bottomNav}>
          <TouchableOpacity onPress={() => navigation.navigate('ContactList')}>
            <Text>Emergency Contacts</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Resources')}>
            <Text>Resources</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#F2EDFC',
    height: 50,
  },
  logo: {width: 40, height: 40},
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    backgroundColor: '#F2EDFC',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  button: {
    width: '80%',
    height: 130,
    padding: 16,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    flexDirection: 'row',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {color: '#fff', fontSize: 16},
  resourcesButton: {backgroundColor: '#81B947'},
  alertButton: {backgroundColor: '#dc3545'},
  sosButton: {backgroundColor: '#792223'},
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#F2EDFC',
    height: 50,
  },
  countdownOverlay: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    backgroundColor: '#F0EFF0',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  countdownText: {color: '#000000', fontSize: 18, marginBottom: 10},
});

export default HomeScreen;
