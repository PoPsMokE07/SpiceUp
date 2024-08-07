import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db } from '../backend/firebaseConfig.js';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../backend/AuthContext.js';

const ManualAddScreen = ({ navigation }) => {
  const [newItem, setNewItem] = useState('');
  const { currentUser } = useAuth();

  const handleAddItem = async () => {
    if (!newItem.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const currentIngredients = userDoc.data().ingredients || [];
        const updatedIngredients = [...currentIngredients, newItem.trim()];
        
        await updateDoc(userRef, { ingredients: updatedIngredients });
        Alert.alert('Success', 'Item added to your pantry');
        setNewItem('');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'Failed to add item. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Item Manually</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter item name"
        value={newItem}
        onChangeText={setNewItem}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddItem}>
        <Text style={styles.buttonText}>Add Item</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFAF1',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'KumbhSans-Bold'
  },
  input: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'KumbhSans-Regular'
  },
  button: {
    backgroundColor: '#82A36E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'KumbhSans-Bold'
  },
});

export default ManualAddScreen;