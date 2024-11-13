import React from 'react';
import {Text, View, StatusBar, Image, StyleSheet} from 'react-native';
import logoVertical from '../assets/images/appLogoV.png';
import {Button} from 'react-native';
import GradientBackground from '../components/GradientBackground';

function Init({navigation}) {
  return (
    <GradientBackground>
      <StatusBar barStyle="light-content"></StatusBar>
      <Image
        style={{
          width: 500,
          height: 500,
          resizeMode: 'contain',
        }}
        source={logoVertical}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Sign In"
          onPress={() => navigation.navigate('SignIn')}
          color="#F2CBCB"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Sign Up"
          onPress={() => navigation.navigate('SignUp')}
          color="#B78DEC"
        />
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: '80%',
    marginVertical: 10,
    borderRadius: 25,
    overflow: 'hidden',
  },
});

export default Init;
