/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

"use strict"

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

var abc = require('./abc-react.js');

var callbacks

var oldAccountName = "hello21"
var oldAccountPassword = "Hello12345"
var oldAccountPIN = "1234"

var otpAccountName = "otptest"
var otpAccountPassword = "Test123456"
var otpAccountOTPToken = "RFC3SA2TKX2RJM5F"

// callbacks.abcAccountAccountChanged = abcAccountAccountChanged
// callbacks.abcAccountWalletChanged = abcAccountWalletChanged
// callbacks.abcAccountWalletsLoaded = abcAccountWalletsLoaded
//
// var accountChangedCallbackOccurred = 0
// var walletChangedCallbackOccurred = 0
// var walletsLoadedCallbackOccurred = 0
//
// function abcAccountAccountChanged(account) {
//   accountChangedCallbackOccurred = 1;
//   console.log("accountChangedCallbackOccurred")
// }
// function abcAccountWalletChanged(account, uuid) {
//   walletChangedCallbackOccurred = 1;
//
//   console.log("walletChangedCallbackOccurred")
// }
// function abcAccountWalletsLoaded(account) {
//   walletsLoadedCallbackOccurred = 1;
//   console.log("walletsLoadedCallbackOccurred")
// }

function sleep( sleepDuration ){
  var now = new Date().getTime();
  while(new Date().getTime() < now + sleepDuration){ /* do nothing */ }
}

function makeID()
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 12; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

class DummyAccount {
  logout (callback) {
    callback()
  }
}

var myusername = ""
var otpTimeout = 10
var myotpKey

var dummyAccount = new DummyAccount()

var abcAccount = dummyAccount
var abcc = abc.ABCConditionCode
var abcContext

function testEval (name, passed) {
  if (passed) {
    console.log(name + " test PASSED")
  } else {
    console.log(name + " test FAILED")
  }
  return passed
}

function BeginTests()
{
  myusername = "tester" + makeID()

  console.log("Initializing...")

  runTestsAsync()
}

function allTestsPass() {
  console.log(`*** ALL TESTS PASSED ***`)
  return true
}

function testPass(funcname) {
  console.log(funcname + " PASSED")
  return true
}

function testFail(funcname, message) {
  if (message)
    console.log(funcname + " FAILED. " + message)
  else
    console.log(funcname + " FAILED")

  return false
}

function runTestsAsync () {
  makeABCContextTest().then(testPass)
    .then(oldAccountNewDeviceLoginTest).then(testPass)
    .then(oldAccountNewDevicePINLoginTest).then(testPass)
    .then(oldAccountOTPLoginWithoutOTPToken).then(testPass)
    .then(oldAccountOTPLoginWithOTPToken).then(testPass)
    .then(accountCreateChangePINAndLoginTest).then(testPass)
    .then(accountCreateChangePasswordAndLoginTest).then(testPass)
    .then(accountCreateChangeOTPTest).then(testPass)
    .then(allTestsPass,testFail)
}

function makeABCContextTest() {
  return new Promise(function(resolve, reject) {
    var funcname = "makeABCContextTest"
    abc.makeABCContext('572d3e23e632ebfcd5c4ad6390b83a01a5d4007b', 'hbits', function (error, context) {
      if (error && error.code != abcc.ABCConditionCodeReinitialization) {
        reject(funcname)
      } else {
        abcContext = context
        resolve(funcname)
      }
    })
  })
}

function oldAccountNewDeviceLoginTest () {
  var funcname = "oldAccountNewDeviceLoginTest"
  return new Promise(function(resolve, reject) {
    if (abcAccount) abcAccount.logout(() => {
      abcAccount = dummyAccount
      abcContext.localAccountDelete(oldAccountName, function (error) {
        if (error && (error.code != abcc.ABCConditionCodeFileDoesNotExist)) reject(funcname)
        else {
          abcContext.passwordLogin(oldAccountName, oldAccountPassword, "", callbacks, function (error, account) {
            if (error || (oldAccountName != account.username)) {
              reject(funcname)
            } else {
              abcAccount = account
              resolve(funcname)
            }
          })
        }
      })
    })
  })
}

function oldAccountNewDevicePINLoginTest () {
  return new Promise(function(resolve, reject) {
    var funcname = "oldAccountNewDevicePINLoginTest"
    if (abcAccount) abcAccount.logout(() => {
      abcAccount = dummyAccount
      abcContext.localAccountDelete(oldAccountName, function (error) {
        abcContext.passwordLogin(oldAccountName, oldAccountPassword, "", callbacks, function (error, account) {
          if (error) reject(funcname)
          else {
            sleep(5000)
            account.logout(() => {
              abcContext.pinLogin(oldAccountName, oldAccountPIN, callbacks, function (error, account) {
                if (error) reject(funcname)
                else {
                  abcAccount = account
                  resolve(funcname)
                }
              })
            })
          }
        })
      })
    })
  })
}

function oldAccountOTPLoginWithoutOTPToken () {
  return new Promise(function(resolve, reject) {
    var funcname = "oldAccountOTPLoginWithoutOTPToken"
    if (abcAccount) abcAccount.logout(() => {
      abcAccount = dummyAccount
      abcContext.localAccountDelete(otpAccountName, function (error) {
        abcContext.passwordLogin(otpAccountName, otpAccountPassword, "", callbacks, function (error, account) {
          if (error) {
            abcAccount = account
            resolve(funcname)
          } // This is expected to error
          else reject(funcname)
        })
      })
    })
  })
}

function oldAccountOTPLoginWithOTPToken () {
  return new Promise(function(resolve, reject) {
    var funcname = "oldAccountOTPLoginWithOTPToken"
    if (abcAccount) abcAccount.logout(() => {
      abcAccount = dummyAccount
      abcContext.localAccountDelete(otpAccountName, function (error) {
        abcContext.passwordLogin(otpAccountName, otpAccountPassword, otpAccountOTPToken, callbacks, function (error, account) {
          if (error || (account.username != otpAccountName))
            reject(funcname) // This is expected to error
          else
            abcAccount = account
            resolve(funcname)
        })
      })
    })
  })
}

function accountCreateChangePasswordAndLoginTest () {
  return new Promise(function(resolve, reject) {
    var funcname = "accountCreateChangePasswordAndLoginTest"
    if (abcAccount) abcAccount.logout(() => {
      abcAccount = dummyAccount
      abcContext.accountCreate(myusername, "helloPW001", "1234", callbacks, (error, account) => {
        if (error || (myusername != account.username)) {
          reject(funcname)
        } else {
          account.logout(() => {
            abcContext.passwordLogin(myusername, "helloPW001", "", callbacks, (error, account) => {
              if (error) {
                reject(funcname)
              } else {
                account.passwordSet("helloPW002", (error) => {
                  if (error) reject(funcname)
                  else {
                    account.logout(() => {
                      abcContext.passwordLogin(myusername, "helloPW002", "", callbacks, (error, account) => {
                        if (error) {
                          reject(funcname)
                        } else {
                          abcAccount = account
                          resolve(funcname)
                        }
                      })
                    })
                  }
                })
              }
            })
          })
        }
      })
    })
  })
}

function accountCreateChangePINAndLoginTest () {
  return new Promise(function(resolve, reject) {
    var funcname = "accountCreateChangePINAndLoginTest"
    if (abcAccount) abcAccount.logout(() => {
      abcAccount = dummyAccount
      var mypinusername = myusername + "-pin"
      abcContext.accountCreate(mypinusername, "helloPW001", "1234", callbacks, (error, account) => {
        if (error || (mypinusername != account.username)) {
          reject(funcname)
        } else {
          account.logout(() => {
            abcContext.pinLogin(mypinusername, "1234", callbacks, (error, account) => {
              if (error) {
                reject(funcname)
              } else {
                account.pinSet("4321", (error) => {
                  if (error) reject(funcname)
                  else {
                    account.logout(() => {
                      abcContext.pinLogin(mypinusername, "1234", callbacks, (error, account) => {
                        if (!error) {
                          reject(funcname) // This should have failed
                        } else {
                          abcContext.pinLogin(mypinusername, "4321", callbacks, (error, account) => {
                            if (error) {
                              reject(funcname) // This should have failed
                            } else {
                              abcAccount = account
                              resolve(funcname)
                            }
                          })
                        }
                      })
                    })
                  }
                })
              }
            })
          })
        }
      })
    })
  })
}

function accountCreateChangeOTPTest () {
  return new Promise(function(resolve, reject) {
    var funcname = "accountCreateChangeOTPTest"
    if (abcAccount) abcAccount.logout(() => {
      abcAccount = dummyAccount
      var myOTPusername = myusername + "-otp"
      abcContext.accountCreate(myOTPusername, "helloPW001", "1234", callbacks, (error, account) => {
        if (error || (myOTPusername != account.username)) {
          reject(funcname)
        } else {
          account.otpEnable(otpTimeout, (error) => {
            if (error) reject(funcname)
            else {
              account.otpDetailsGet((error, otpEnabled, timeout) => {
                if (error) reject(funcname)
                else if (!(timeout === otpTimeout && otpEnabled === true)) reject(funcname)
                else {
                  account.otpLocalKeyGet((error, otpKey) => {
                    if (error) reject(funcname)
                    else {
                      myotpKey = otpKey
                      account.logout(() => {
                        abcContext.localAccountDelete(myOTPusername, function (error) {
                          if (error) reject(funcname)
                          else {
                            abcContext.passwordLogin(myOTPusername, "helloPW001", "", callbacks, (error, account) => {
                              if (!error || (error.code != abcc.ABCConditionCodeInvalidOTP)) {
                                reject(funcname)
                              } else {
                                abcContext.passwordLogin(myOTPusername, "helloPW001", myotpKey, callbacks, (error, account) => {
                                  if (error || (myOTPusername != account.username)) {
                                    reject(funcname)
                                  } else {
                                    abcAccount = account
                                    resolve(funcname)
                                  }
                                })
                              }
                            })
                          }
                        })
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    })
  })
}

module.exports.BeginTests = BeginTests