import React, { PropTypes, Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import * as AuthUtils from './utils/auth';

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
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
  logoutButton: {
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
  logoutButtonText: {
    fontWeight: 'normal',
    fontSize: 17,
    color: 'rgb(255, 255, 255)',
    marginLeft: 10,
  },
  welcome: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
  },
});


class App extends Component {
  state = {
    loggedIn: false,
    profile: {},
  };

  componentWillMount() {
    AuthUtils.init();
  }

  handleLogin = async (type) => {
    let result = {};

    this.setState({
      isLoading: true,
    });

    try {
      if (type === 'facebook') {
        result = AuthUtils.loginFB().catch(() => {
          this.setState({
            isLoading: false,
          });
        });
      } else if (type === 'google') {
        result = await AuthUtils.loginGoogle();
      }
    } catch (err) {
      this.setState({
        isLoading: false,
      });
    }

    if (result) {
      const profile = await AuthUtils.register();

      this.setState({
        loggedIn: true,
        isLoading: false,
        profile,
      });
    } else {
      this.setState({
        isLoading: false,
        profile: {},
      });
    }
  }

  handleLogout = () => {
    AuthUtils.logout();

    this.setState({
      loggedIn: false,
      profile: {},
    });
  }

  render() {
    const { isLoading, loggedIn, profile } = this.state;

    return (
      <View style={styles.containerStyle}>
        <Text style={styles.headingText}>React-Native Cognito Login Example</Text>

        {loggedIn && <View style={styles.welcome}>
            <Text style={styles.welcomeText}>
              Hello {profile.name}!{"\n"}
              You're logged in!
            </Text>

            <TouchableOpacity onPress={() => this.handleLogout()} style={styles.logoutButton}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>}

        <Spinner
          visible={isLoading}
          textContent={"Logging in..."}
          overlayColor={"rgba(0, 0, 0, 0.8)"}
          textStyle={{color: '#FFF'}}
        />

        {!loggedIn && <View>
            <TouchableOpacity onPress={() => this.handleLogin('facebook')} style={styles.facebookLoginButton}>
              <Text style={styles.facebookLoginButtonText}>Login with Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.handleLogin('google')} style={styles.googleLoginButton}>
              <Text style={styles.googleLoginButtonText}>Login with Google</Text>
            </TouchableOpacity>
          </View>}
      </View>
    );
  }
}

export default App;
