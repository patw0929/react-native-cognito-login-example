import { AWSCognitoCredentials } from 'aws-sdk-react-native-core';
import { FBLoginManager } from 'react-native-facebook-login';
import { GoogleSignin } from 'react-native-google-signin';

const IDENTITY_POOL_ID = 'ap-northeast-1:4e86b831-da7f-47d5-8382-3d800cd28a25';
const REGION = 'ap-northeast-1';
const GOOGLE_SIGNIN_IOS_CLIENT_ID = '469382905985-0ho9t3lc0g6ig7l69du9971vijdgv6fn.apps.googleusercontent.com';
const GOOGLE_SIGNIN_WEBCLIENT_ID = '841323845806-so8dm9ue5bhc419etsk7f9eg0tadff3h.apps.googleusercontent.com';

let identityId = null;
let currentLoginMethod;
let global_supplyLogin = false;
let global_accessToken = '';

const providers = {
  'graph.facebook.com': 'FacebookProvider',
  'accounts.google.com': 'GoogleProvider',
};

let openIdResolve;
let openIdTokenPromise = new Promise(resolve => {
  openIdResolve = resolve;
});

console.log(AWSCognitoCredentials);

function getCredentials() {
  console.log(GOOGLE_SIGNIN_IOS_CLIENT_ID);
  return new Promise((resolve, reject) => {
    FBLoginManager.getCredentials((err, data) => {
      if (
        data &&
        typeof data.credentials === 'object' &&
        typeof data.credentials.token === 'string' &&
        data.credentials.token.length > 0
      ) {
        resolve(data.credentials.token);
      } else {
        reject(err || data.message);
      }
    });

    GoogleSignin.hasPlayServices({ autoResolve: true })
      .then(() => {
        GoogleSignin.configure({
          iosClientId: GOOGLE_SIGNIN_IOS_CLIENT_ID,
          webClientId: GOOGLE_SIGNIN_WEBCLIENT_ID,
        }).then(() => {
          GoogleSignin.currentUserAsync()
            .then(user => {
              if (user && user.idToken) {
                resolve(user.idToken);
              }
            })
            .catch(err => {
              console.log(err);
              reject(err);
            });
        });
      })
      .catch(err => {
        console.log('Play services error', err.code, err.message);
      });
  });
}

// Should after onLoginInvoked
async function getIdentityId() {
  try {
    await AWSCognitoCredentials.getCredentialsAsync();
    const identity = await AWSCognitoCredentials.getIdentityIDAsync();
    // https://github.com/awslabs/aws-sdk-react-native/search?utf8=%E2%9C%93&q=identityid
    // aws-sdk-react-native return `identity.identityId` for ios, `identity.identityid` for android
    const _identityId = identity.identityId || identity.identityid;

    return _identityId;
  } catch (e) {
    console.log('Error: ', e);
  }
}

function cleanLoginStatus() {
  AWSCognitoCredentials.clearCredentials();
  AWSCognitoCredentials.clear(); // clear keychain

  identityId = null;
  global_supplyLogin = false;
  global_accessToken = '';

  openIdTokenPromise = new Promise(resolve => {
    openIdResolve = resolve;
  });
}

function logout() {
  FBLoginManager.logout(error => {
    if (!error) {
      cleanLoginStatus();
    }
  });

  GoogleSignin.signOut().then(() => {
    cleanLoginStatus();
  });
}

async function getOpenIdToken(accessToken) {
  const payload = {
    IdentityId: identityId,
    Logins: {
      [currentLoginMethod]: accessToken,
    },
  };

  try {
    const rsp = await fetch('https://cognito-identity.ap-northeast-1.amazonaws.com/', {
      method: 'POST',
      headers: new Headers({
        'X-Amz-Target': 'AWSCognitoIdentityService.GetOpenIdToken',
        'Content-Type': 'application/x-amz-json-1.1',
        random: new Date().valueOf(),
        'cache-control': 'no-cache',
      }),
      body: JSON.stringify(payload),
    });

    if (!rsp.ok) {
      // rsp.status === 400, ok: false
      // message: "Invalid login token. Token is expired."
      logout();
    } else {
      const json = await rsp.json();

      openIdResolve(json.Token);

      return json.Token;
    }
  } catch (e) {
    console.log('Error of getOpenIdToken: ', e);
  }
}

async function onLoginInvoked(isLoggingIn, accessToken) {
  if (isLoggingIn) {
    // this.setState({ accessToken });
    global_supplyLogin = true;
    global_accessToken = accessToken;
    const map = {};

    map[providers[currentLoginMethod]] = accessToken;
    AWSCognitoCredentials.setLogins(map); // ignored for iOS
    identityId = await getIdentityId();
    getOpenIdToken(accessToken);
  } else {
    global_supplyLogin = false;
    global_accessToken = '';
  }
}

function init() {
  AWSCognitoCredentials.getLogins = () => {
    if (global_supplyLogin) {
      const map = {};

      map[providers[currentLoginMethod]] = global_accessToken;

      return map;
    }

    return '';
  };

  AWSCognitoCredentials.initWithOptions({
    REGION,
    IDENTITY_POOL_ID,
  });

  getCredentials()
    .then(token => {
      console.log(token);
      onLoginInvoked(true, token);
    })
    .catch(message => {
      console.log('message', message);
    });
}

function loginFB() {
  FBLoginManager.loginWithPermissions(['email', 'user_birthday'], (error, data) => {
    if (!error) {
      const token = data.credentials.token;

      currentLoginMethod = 'graph.facebook.com';
      onLoginInvoked(true, token);
    } else {
      currentLoginMethod = null;
    }
  });
}

function loginGoogle() {
  GoogleSignin.signIn()
    .then(user => {
      currentLoginMethod = 'accounts.google.com';
      onLoginInvoked(true, user.idToken);
    })
    .catch(err => {
      console.log('WRONG SIGNIN', err);
      currentLoginMethod = null;
    });
}

async function refreshToken() {
  const token = await getCredentials();
  const openIdToken = await getOpenIdToken(token);

  openIdTokenPromise = Promise.resolve(openIdToken);

  return openIdToken;
}

export {
  init,
  loginFB,
  loginGoogle,
  logout,
};
