// src/components/GradientBackground.js
import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

function GradientBackground({ children }) {
    return (
        <LinearGradient
            colors={['#7932B8', '#B78DEC', '#7932B8']}
            start={{ x: 0.3, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-start'
            }}
        >
            <StatusBar barStyle="light-content" />
            {children}
        </LinearGradient>
    );
}

export default GradientBackground;
