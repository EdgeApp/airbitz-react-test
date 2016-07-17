
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { NativeModules } from 'react-native';
var AirbitzCoreRCT = NativeModules.AirbitzCoreRCT;

class ABCError {
  constructor(code, message) {
    this.code = code
    this.message = message
    console.log("ABCError:" + code + ": " + message)

  }
}

function makeABCError(rcterror) {
  var code = rcterror['code'].replace("EABCERRORDOMAIN","")
  var err = new ABCError(code, rcterror['message'])
  return err
}

class ABCAccount {
  constructor(name) {
    this.name = name
  }

  logout (complete) {
    AirbitzCoreRCT.logout(() => {
      complete()
    })

  }
}

class AirbitzCore {
  init (apikey, hbits, complete, error) {
    AirbitzCoreRCT.init(apikey, hbits, (response) => {
      console.log("ABC Initialized")
      account = new ABCAccount(response)
      complete(account)
    }, (rcterror) => {
      error(makeABCError(rcterror))
    })
  }

  createAccount (username, password, pin, complete, error) {
    AirbitzCoreRCT.createAccount(username, password, pin, (response) => {
      console.log("account created")
      complete(new ABCAccount(response))
    }, (rcterror) => {
      error(makeABCError(rcterror))
    })
  }
}


module.exports.AirbitzCore = AirbitzCore