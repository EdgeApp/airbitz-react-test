
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

/**
 * ABCAccount Class
 */
class ABCAccount {
  constructor(name) {
    this.name = name
  }

  /**
   * logout
   * @param complete
   */
  logout (complete) {
    AirbitzCoreRCT.logout(() => {
      complete()
    })

  }

  /**
   * passwordLogin
   *
   * @param username
   * @param password
   * @param otp
   * @param complete
   * @param error
   */
  passwordLogin(username, password, otp, complete, error) {
    AirbitzCoreRCT.passwordLogin(username, password, otp, (response) => {
      complete(new ABCAccount(response))
    }, (rtcerror) => {
      error(new ABCError(rtcerror['code'], rtcerror['message']))
    })
  }
}

/**
 * AirbitzCore class
 */
class AirbitzCore {

  /**
   * init
   *
   * @param apikey
   * @param hbits
   * @param complete
   * @param error
   */
  init (apikey, hbits, complete, error) {
    AirbitzCoreRCT.init(apikey, hbits, (response) => {
      console.log("ABC Initialized")
      account = new ABCAccount(response)
      complete(account)
    }, (rcterror) => {
      error(makeABCError(rcterror))
    })
  }

  /**
   * createAccount
   *
   * @param username
   * @param password
   * @param pin
   * @param complete
   * @param error
   */
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