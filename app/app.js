import React, { PropTypes, Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingText: {
    fontWeight: '500',
    fontSize: 18,
    color: 'rgb(38, 38, 38)',
    marginTop: 20,
    marginBottom: 12,
  },
  facebookLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 260,
    height: 42,
    backgroundColor: 'rgb(59, 90, 150)',
    borderRadius: 4,
    paddingVertical: 15,
    paddingHorizontal: 32,
  },
  facebookLoginButtonText: {
    fontWeight: 'normal',
    fontSize: 17,
    color: 'rgb(255, 255, 255)',
  },
  googleLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 260,
    height: 42,
    backgroundColor: 'rgb(234, 67, 53)',
    borderRadius: 4,
    marginTop: 10,
    paddingVertical: 15,
    paddingHorizontal: 32,
  },
  googleLoginButtonText: {
    fontWeight: 'normal',
    fontSize: 17,
    color: 'rgb(255, 255, 255)',
    marginLeft: 10,
  },
});

class App extends Component {
  handleLogin = (type) => {
    console.log('login', type);
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        <Text style={styles.headingText}>React-Native Cognito Example</Text>

        <TouchableOpacity onPress={() => this.handleLogin('facebook')} style={styles.facebookLoginButton}>
          <Text style={styles.facebookLoginButtonText}>Login with Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleLogin('google')} style={styles.googleLoginButton}>
          <Text style={styles.googleLoginButtonText}>Login with Google</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default App;
