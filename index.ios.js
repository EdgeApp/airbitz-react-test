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

var abcTests = require("./abc-react-tests.js")

AppRegistry.registerComponent('airbitzreacttest', () => abcTests.airbitzreacttest);

