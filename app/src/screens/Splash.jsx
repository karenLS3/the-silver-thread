import React from 'react';
import { Text, SafeAreaView, StatusBar, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import logoVertical from '../assets/images/appLogoV.png'

function Splash(props) {
    return (
        <LinearGradient
            colors={['#7932B8', '#B78DEC', '#7932B8',]}
            start={{ x: 0.3, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-start'
            }}
        >
            <StatusBar barStyle='light-content'></StatusBar>
            <Image style={{
                width: 500,
                height: 500,
                resizeMode: 'contain'
            }} source={logoVertical} />


        </LinearGradient>

    );
}

export default Splash;