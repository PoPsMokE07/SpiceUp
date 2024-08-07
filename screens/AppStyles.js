import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  headline: {
    fontSize: 32,
    color: '#2C3E50',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subheadline: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 10,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 20,
    fontSize: 16,
    color: '#34495E',
  },
  button: {
    backgroundColor: '#3498DB',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    alignSelf: 'center',
    marginTop: 30,
    borderRadius: 20,
  },
});