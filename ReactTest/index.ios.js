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

var a = require('./abc-react.js');

var abc = new a.AirbitzCore

console.log("Initializing...")

abc.init('572d3e23e632ebfcd5c4ad6390b83a01a5d4007b', 'hbits', () => {
  console.log("ABC Initialized")
  createAccount()
}, (error) => {
  if (error.code == 23) { // ABC Already initialized
    createAccount()
  }
});

function createAccount () {
  abc.createAccount("helloman008", "helloPW001", "1234", (account) => {
    console.log("account created")
    logout(account)
  }, (error) => {
    console.log("account create failed")
  })
}

function logout (account) {
  account.logout(() => {
    console.log("Logged out")
  })
}