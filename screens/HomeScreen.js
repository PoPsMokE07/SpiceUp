import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { db, auth } from '../backend/firebaseConfig';
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged} from '@firebase/auth';

const AuthScreen = ({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication, navigation }) => {
    return (
      <View style={styles.authContainer}>
        <Text style={styles.title}>{isLogin ? 'Login' : 'Create Account'}</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />
        <TouchableOpacity style={styles.buttonContainer} onPress={handleAuthentication}>
          <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
        </TouchableOpacity>
        <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Don’t have an account? Sign up' : 'Already have an account? Sign in'}
        </Text>
      </View>
    );
  };

export default HomeScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        navigation.replace('Pantry');
      }
    });
    return () => unsubscribe();
  }, []);

  const createUserDocument = async (user) => {
    try {
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        profilePic: null,
        ingredients: [],
        images: [],
      });
      console.log('New user document created successfully:', user.uid);
    } catch (error) {
      console.error('Error creating user document: ', error);
    }
  };

  const handleAuthentication = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in successfully!');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('User created successfully!');
        await createUserDocument(userCredential.user);
      }
      navigation.replace('Pantry');
    } catch (error) {
      console.error('Authentication error:', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AuthScreen
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        handleAuthentication={handleAuthentication}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#FFFAF1',
    },
    authContainer: {
      width: '90%',
      maxWidth: 400,
      backgroundColor: '#FFFAF1',
      padding: 16,
      borderRadius: 8,
    },
    topRightGraphic: {
      width: '50%',
      height: '50%',
      position: 'absolute',
      left: 220,
      bottom: 510,
      resizeMode: 'contain',
      transform: [{ rotate: '10deg' }],
    },
    title: {
      fontSize: 36,
      position: 'relative',
      marginBottom: 16,
      textAlign: 'center',
      fontFamily: 'KumbhSans-Bold',
      color: '#333333',
    },
    input: {
      height: 46,
      borderColor: '#DDDDDD',
      borderWidth: 1.2,
      marginBottom: 16,
      padding: 7,
      borderRadius: 10,
      fontFamily: 'KumbhSans-Regular',
      backgroundColor: '#FCFCFC',
    },
    buttonContainer: {
      backgroundColor: '#82A36E',
      borderRadius: 25,
      paddingVertical: 14,
      alignItems: 'center',
      marginVertical: 10,
    },
    buttonText: {
      color: '#FFFFFF',
      fontFamily: 'KumbhSans-Bold',
      fontSize: 16,
    },
    toggleText: {
      color: '#82A36E',
      textAlign: 'center',
      fontFamily: 'KumbhSans-Regular',
      marginTop: 16,
    },
  });