import React from 'react';
import {
  NavigationContainer,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import InitScreen from './src/screens/Init';
import SignInScreen from './src/screens/Singin';
import SignUpScreen from './src/screens/Singup';
import UpdatePinScreen from './src/screens/UpdatePin';
import HomeScreen from './src/screens/Home';
import ContactListScreen from './src/screens/ContactList';
import AddContactScreen from './src/screens/AddContact';
import ContactDetailsScreen from './src/screens/ContactDetails';
import ResourcesScreen from './src/screens/Resources';
import PanicAlertScreen from './src/screens/PanicAlert';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Init" screenOptions={StackStyle}>
        <Stack.Screen
          name="Init"
          component={InitScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{title: 'Sign Up'}}
        />
        <Stack.Screen
          name="UpdatePin"
          component={UpdatePinScreen}
          options={{title: 'Update PIN Code'}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ContactList"
          component={ContactListScreen}
          options={{title: 'Emergency Contacts'}}
        />
        <Stack.Screen
          name="AddContact"
          component={AddContactScreen}
          options={{title: 'Add Contacts'}}
        />
        <Stack.Screen
          name="ContactDetails"
          component={ContactDetailsScreen}
          options={{title: 'Edit Contact'}}
        />
        <Stack.Screen name="Resources" component={ResourcesScreen} />
        <Stack.Screen
          name="PanicAlertActive"
          component={PanicAlertScreen}
          options={{title: 'Panic Alert'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const StackStyle = {
  headerStyle: {
    backgroundColor: '#D3BEF4',
  },
  headerTitleStyle: {fontWeight: 'bold', fontSize: 30},
  headerTintColor: '#B78DEC',
  headerBackButtonDisplayMode: 'minimal',
  headerTitleAlign: 'center',
};

export default App;
