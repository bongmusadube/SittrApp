import React, {Suspense, useEffect} from 'react';
import {StatusBar, Text, View} from 'react-native';
import Navigation from './src/components/Navigation';
import {AuthProvider} from './src/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {

  return (

    <AuthProvider>
     
        <Navigation />
      
    </AuthProvider>

  );
};

export default App;
