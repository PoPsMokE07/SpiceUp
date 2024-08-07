import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native';

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(key="GOOGLE_API_KEY");

const { width } = Dimensions.get('window');

const RecipeGenerationScreen = ({ route, navigation }) => {
  const { myIngredients } = route.params;
  const [textResult, setResult] = useState(null);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    getRecipes(myIngredients);
  }, [myIngredients]);

  const getRecipes = async (ingredients) => {
    if (ingredients.length === 0) {
      setResult("No ingredients provided");
      setRecipes([]);
      return;
    }
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const prompt = `Given these ingredients: ${ingredients.join(', ')}, suggest 7 possible recipes. For each recipe, provide:
      1. Recipe name
      2. Brief description (max 50 words)
      3. Step-by-step procedure (5-7 steps)
      4. List of ingredients needed
      Format the output as: Recipe Name | Description | Ingredients: ingredient1, ingredient2, ... | Step 1; Step 2; Step 3; ...
      Separate each recipe with ||`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      setResult(text);
      const parsedRecipes = parseRecipes(text);
      setRecipes(parsedRecipes);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert('Generation Error', 'Failed to generate recipes. Please try again.');
    }
  }

  const parseRecipes = (resultString) => {
    const recipeStrings = resultString.split("||");
    return recipeStrings.map(recipeString => {
      const [name, description, ingredients, steps] = recipeString.split("|").map(s => s.trim());
      return { 
        name, 
        description,
        steps: steps.split(';').map(step => step.trim()),
        ingredients: ingredients.replace('Ingredients:', '').split(',').map(ingredient => ingredient.trim())
      };
    }).filter(recipe => recipe.name);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.boxContainer}>
        <Text style={styles.header}>Recipe Suggestions</Text>
        {recipes.length > 0 ? (
          recipes.map((recipe, index) => (
            <View key={index} style={styles.recipeCard}>
              <Text style={styles.recipeButtonText}>{recipe.name}</Text>
              <Text style={styles.recipeDescription}>{recipe.description}</Text>
              <View style={styles.ingredientsContainer}>
                <Text style={styles.ingredientsHeader}>Ingredients Needed:</Text>
                {recipe.ingredients.map((ingredient, idx) => (
                  <Text key={idx} style={styles.ingredientText}>• {ingredient}</Text>
                ))}
              </View>
              <View style={styles.stepsContainer}>
                <Text style={styles.stepsHeader}>Steps:</Text>
                {recipe.steps.map((step, idx) => (
                  <Text key={idx} style={styles.stepText}>• {step}</Text>
                ))}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.recipeNameContainer}>
            <Text style={styles.recipeName}>{textResult || 'Analyzing...'}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Upload')}
      >
        <Text style={styles.buttonTextPhoto}>New Photo</Text>
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
    fontSize: 28,
    color: '#333',
    fontWeight: 'bold',
    marginVertical: 20,
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
    color: '#219653',
    textAlign: 'center',
    fontFamily: 'KumbhSans-Bold',
  },
  recipeCard: {
    backgroundColor: '#82A36E',
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
    width: width * 0.8,
  },
  recipeButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'KumbhSans-Bold',
    marginBottom: 5,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'KumbhSans-Regular',
    marginBottom: 10,
  },
  ingredientsContainer: {
    marginVertical: 10,
  },
  ingredientsHeader: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'KumbhSans-Bold',
    marginBottom: 5,
  },
  ingredientText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'KumbhSans-Regular',
  },
  stepsContainer: {
    marginVertical: 10,
  },
  stepsHeader: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'KumbhSans-Bold',
    marginBottom: 5,
  },
  stepText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'KumbhSans-Regular',
  },
  button: {
    backgroundColor: '#82A36E',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 30,
    shadowColor: '#82A36E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonTextPhoto: {
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
    width: width * 0.9,
  },
});

export default RecipeGenerationScreen;
