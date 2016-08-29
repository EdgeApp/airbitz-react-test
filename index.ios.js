/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

class ReactTest extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('ReactTest', () => ReactTest);

var abcTests = require("./abc-react-tests.js")

abcTests.BeginTests()

//var a = require('./abc-react.js');
//
//var abc = new a.AirbitzCore
//
//console.log("Initializing...")
//
//function makeID()
//{
//  var text = "";
//  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//
//  for( var i=0; i < 12; i++ )
//    text += possible.charAt(Math.floor(Math.random() * possible.length));
//
//  return text;
//}
//
//var myusername = "tester" + makeID()
//
//abc.init('572d3e23e632ebfcd5c4ad6390b83a01a5d4007b', 'hbits', () => {
//  console.log("ABC Initialized")
//  createAccountTest()
//}, (error) => {
//  if (error.code == 23) { // ABC Already initialized. Create account anyway
//    createAccountTest()
//  }
//});
//
//function createAccountTest () {
//  abc.createAccount(myusername, "helloPW001", "1234", (account) => {
//    console.log("account created")
//    logoutTest(account)
//    loginTest(myusername, "helloPW001")
//  }, (error) => {
//    console.log("createAccount test failed")
//  })
//}
//
//function logoutTest (account) {
//  account.logout(() => {
//    console.log("Logged out")
//  })
//}
//
//function loginTest (username, password) {
//  abc.passwordLogin(username, password, "", (account) => {
//    changePasswordTest(account)
//  }, (rtcerror) => {
//    console.log("Password login test FAILED")
//  })
//}
//
//function changePasswordTest(account) {
//  account.changePassword("helloPW002", () => {
//    console.log("Change password PASSED")
//    account.logout(() => {
//      abc.passwordLogin(myusername, "helloPW001","", (account) => {
//        account.logout(() => {
//          console.log("Change password relogin PASSED")
//          pinLoginTest()
//        })
//      }, (rtcerror) => {
//        console.log("Change password relogin FAILED")
//      })
//    })
//
//  }, () => {
//    console.log("Change password FAILED")
//  })
//
//}
//
//function pinLoginTest () {
//  abc.pinLogin(myusername, "1234", (account) => {
//    console.log("pinLogin test PASSED")
//
//  }, (rtcerror) => {
//    console.log("pinLogin test FAILED")
//
//  })
//}
//
//function changePinTest(account) {
//  account.changePIN("4321", () => {
//    console.log("changePIN test PASSED")
//    account.logout(() => {
//      abc.pinLogin(myusername, "4321", (account) => {
//        console.log("Change pin relogin PASSED")
//        disablePinLoginTest(account)
//      }, (rtcerror) => {
//        console.log("Change pin relogin FAILED")
//      })
//    })
//
//  }, () => {
//    console.log("changePIN test FAILED")
//  })
//}
//
//
//function disablePinLoginTest(account)
//{
//  account.pinLoginSetup(false)
//  account.logout(() => {
//    abc.pinLogin(myusername, "4321", (account) => {
//      console.log("Change pin relogin FAILED")
//    }, (rtcerror) => {
//      console.log("Change pin relogin PASSED")
//    })
//
//  })
//}