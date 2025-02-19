import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Dimensions, TouchableOpacity, Alert, ScrollView } from 'react-native';

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("GOOGLE_API_KEY");

import { db, auth } from '../backend/firebaseConfig';
import { doc, getDoc, updateDoc } from "firebase/firestore"; 

const { width } = Dimensions.get('window');

const PantryIdentificationTest = ({ route, navigation }) => {
  const { imgBase64 } = route.params;
  const [classificationResult, setClassificationResult] = useState(null);
  const [mimeType] = useState('image/jpeg');
  const [myIngredients, setIngredients] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    classifyImage(imgBase64);
  }, [imgBase64]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (classificationResult && user) {
      const newIngredients = parseIngredients(classificationResult);
      setIngredients(newIngredients);
    }
  }, [classificationResult]);

  const classifyImage = async (imageUri) => {
    if (!imageUri) {
      Alert.alert('Error', 'No image selected.');
      return null;
    }

    try {
      setLoading(true);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = "Output a list of all food items you see in the image, unless there are no food items. Format it as a comma-delimited string like this: 'Item 1, Item 2, Item 3' without the quotations. If there are no food items, output 'no ingredients' without the quotations.";
      const imagePart = {
        inlineData: {
          data: imageUri.replace(/^data:image\/[a-z]+;base64,/, ""),
          mimeType: "image/jpeg"
        }
      };

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      console.log(text);
      setClassificationResult(text);
      setLoading(false);
      return text;

    } catch (error) {
      console.error("Error:", error);
      Alert.alert('Classification Error', 'Failed to classify the image. Please try again.');
      setLoading(false);
      return null;
    }
  }

  const writeUserPantry = async (uid, newIngredients) => {
    const userRef = doc(db, 'users', uid);
    try {
      await updateDoc(userRef, { ingredients: newIngredients });
    } catch (error) {
      console.error("Error updating user ingredients:", error);
    }
  };

  const appendUserPantry = async (uid, newIngredients) => {
    const userRef = doc(db, 'users', uid);
    try {
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      allIngredients = userData.ingredients || [];
      allIngredients = allIngredients.concat(newIngredients);
      await updateDoc(userRef, { ingredients: allIngredients });
    }
    catch (error) {
      console.error("Error appending user ingredients", error);
    }
  };

  const parseIngredients = (resultString) => {
    if (resultString.endsWith("no ingredients")) {
      return [];
    }
    const allIngredients = resultString.split(",").map(item => item.trim().toLowerCase());
    return allIngredients;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.boxContainer}>
        <Text style={styles.header}>Ingredients</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#82A36E" style={styles.spinner} />
        ) : myIngredients.length > 0 ? (
          myIngredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientBox}>
              <Text style={styles.ingredientText}>{ingredient}</Text>
            </View>
          ))
        ) : (
          <View style={styles.recipeNameContainer}>
            <Text style={styles.recipeName}>{classificationResult || 'Analyzing...'}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          writeUserPantry(user.uid, myIngredients);
          navigation.navigate('Upload');
        }}
      >
        <Text style={styles.buttonText}>Create New Pantry</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          appendUserPantry(user.uid, myIngredients);
          navigation.navigate('Pantry');
        }}
      >
        <Text style={styles.buttonText}>Add to Pantry</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Upload')}
      >
        <Text style={styles.buttonText}>New Photo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFAF1',
    alignItems: 'center',
    paddingVertical: 20,
  },
  header: {
    fontSize: 30,
    color: '#82A36E',
    fontWeight: 'bold',
    marginTop: 20,
    fontFamily: 'KumbhSans-Bold',
  },
  recipeNameContainer: {
    backgroundColor: 'transparent',
    borderColor: "#82A36E",
    borderWidth: 2,
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 15,
    marginTop: 20,
  },
  recipeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#82A36E',
    textAlign: 'center',
    fontFamily: 'KumbhSans-Bold',
  },
  ingredientBox: {
    backgroundColor: '#82A36E',
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  ingredientText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'KumbhSans-Bold',
  },
  button: {
    backgroundColor: '#82A36E',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'KumbhSans-Bold',
  },
  boxContainer: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderRadius: 15,
    marginVertical: 10,
    width: '90%',
  },
  spinner: {
    marginTop: 20,
  },
});

export default PantryIdentificationTest;