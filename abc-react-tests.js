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
var noexistusername
var otpTimeout = 60 * 60 * 24 * 7
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
  noexistusername = "noexist" + makeID()

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
    .then(checkAccountDoesntExist).then(testPass)
    .then(oldAccountCheckBitIDSignature).then(testPass)
    .then(oldAccountNewDeviceLoginTest).then(testPass)
    .then(oldAccountNewDevicePINLoginTest).then(testPass)
    .then(oldAccountOTPLoginWithoutOTPToken).then(testPass)
    .then(oldAccountOTPLoginWithOTPToken).then(testPass)
    .then(accountCreateChangePINAndLoginTest).then(testPass)
    .then(accountCreateChangePasswordAndLoginTest).then(testPass)
    .then(accountCreateChangeOTPTest).then(testPass)
    .then(oldAccountDataStoreTest).then(testPass)
    .then(allTestsPass,testFail)
}

function makeABCContextTest() {
  return new Promise(function(resolve, reject) {
    var funcname = "makeABCContextTest"
    abc.makeABCContext({'apikey': '572d3e23e632ebfcd5c4ad6390b83a01a5d4007b',
                        'accountType': 'account:repo:co.airbitz.reacttest',
                        'hbits': ''},
                        function (error, context) {
      if (error && error.code != abcc.ABCConditionCodeReinitialization) {
        reject(funcname)
      } else {
        abcContext = context
        resolve(funcname)
      }
    })
  })
}

function checkAccountDoesntExist () {
  var funcname = "checkAccountDoesntExist"
  return new Promise(function(resolve, reject) {
    abcContext.usernameAvailable(noexistusername, function (error, available) {
      if (error || !available) reject(funcname)
      else {
        abcContext.listUsernames(function (error, usernames) {
          if (error) reject(funcname)
          else {
            if (usernames.indexOf(noexistusername) >= 0) reject(funcname)
            else {
              abcContext.usernameAvailable(oldAccountName, function (error, available) {
                if (error || available) reject(funcname)
                else {
                  resolve(funcname)
                }
              })
            }
          }
        })
      }
    })
  })
}

var bitIDUrl = "bitid://airbitz.co/developer?nonce=12345"
var bitIDAddress = "1KUNirYYijbgYJnBEtPNePibkCHswzjXjN"
var bitIDSig = "H76W1HRnB1XsdQOFvDbAkWMq3vqxdWL9BbaIumQwgGLzN9D+PuEQ8/xr0CNx8vlRQ4bvEXrPMc8hvl80DzcdY4M="

function oldAccountCheckBitIDSignature () {
  var funcname = "oldAccountCheckBitIDSignature"
  return new Promise(function(resolve, reject) {
    abcContext.loginWithPassword(oldAccountName, oldAccountPassword, null, callbacks, function (error, account) {
      if (error) {
        reject(funcname)
      } else {
        account.signBitIDRequest(bitIDUrl, "Hello World", function (error, abcSignature) {
          if (error) reject(funcname)
          else {
            if (abcSignature.address !== bitIDAddress || abcSignature.signature !== bitIDSig)
              reject(funcname)
            else
              account.logout(function () {
                resolve(funcname)
              })
          }
        })
      }
    })
  })
}

function oldAccountNewDeviceLoginTest () {
  var funcname = "oldAccountNewDeviceLoginTest"
  return new Promise(function(resolve, reject) {
      abcContext.deleteLocalAccount(oldAccountName, function (error) {
        if (error && (error.code != abcc.ABCConditionCodeFileDoesNotExist)) {
          reject(funcname, "deleteLocalAccount")
        } else {
          abcContext.loginWithPassword(oldAccountName, oldAccountPassword, null, callbacks, function (error, account) {
            if (error) {
              reject(funcname, "loginWithPassword: " + error.message)
            } else if((oldAccountName != account.username)) {
              reject(funcname, "mismatch account names")
            } else {
              abcContext.listUsernames(function (error, usernames) {
                if (error) {
                  reject(funcname, "listUsernames error")
                } else {
                  if (usernames.indexOf(oldAccountName) < 0) {
                    reject(funcname, "oldAccountName not in device")
                  } else {
                    account.logout(function () {
                      resolve(funcname)
                    })
                  }
                }
              })
            }
          })
        }
      })
  })
}

function oldAccountNewDevicePINLoginTest () {
    return new Promise(function(resolve, reject) {
    var funcname = "oldAccountNewDevicePINLoginTest"
    abcContext.deleteLocalAccount(oldAccountName, function (error) {
      abcContext.loginWithPassword(oldAccountName, oldAccountPassword, "", callbacks, function (error, account) {
        if (error) reject(funcname)
        else {
          sleep(5000)
          account.changePIN('1234', function (error) {
            account.logout(() => {
              abcContext.loginWithPIN(oldAccountName, oldAccountPIN, callbacks, function (error, account) {
                if (error) reject(funcname)
                else {
                  account.logout(function () {
                    resolve(funcname)
                  })
                }
              })
            })
          })
        }
      })
    })
  })
}

function oldAccountOTPLoginWithoutOTPToken () {
  return new Promise(function(resolve, reject) {
    var funcname = "oldAccountOTPLoginWithoutOTPToken"
    abcContext.deleteLocalAccount(otpAccountName, function (error) {
      abcContext.loginWithPassword(otpAccountName, otpAccountPassword, null, callbacks, function (error, account) {
        if (error) {
          account.logout(function () {
            resolve(funcname)
          })
        } // This is expected to error
        else reject(funcname)
      })
    })
  })
}

function oldAccountOTPLoginWithOTPToken () {
  return new Promise(function(resolve, reject) {
    var funcname = "oldAccountOTPLoginWithOTPToken"
    abcContext.deleteLocalAccount(otpAccountName, function (error) {
      abcContext.loginWithPassword(otpAccountName, otpAccountPassword, otpAccountOTPToken, callbacks, function (error, account) {
        if (error || (account.username != otpAccountName))
          reject(funcname) // This is expected to error
        else
          account.logout(function () {
            resolve(funcname)
          })
      })
    })
  })
}

var dataStoreTestFolder = "testFolder"
var dataStoreTestKey = "testFolderKey"
var dataStoreTestKey2 = "testFolderKey2"
var dataStoreTestValue = "testFolderValue"

function oldAccountDataStoreTest () {
  var funcname = "oldAccountDataStoreTest"
  return new Promise(function(resolve, reject) {
    abcContext.deleteLocalAccount(oldAccountName, function (error) {
      if (error && (error.code != abcc.ABCConditionCodeFileDoesNotExist)) reject(funcname)
      else {
        abcContext.loginWithPassword(oldAccountName, oldAccountPassword, null, callbacks, function (error, account) {
          if (error || (oldAccountName != account.username)) {
            reject(funcname)
          } else {
            abcAccount = account
            abcAccount.dataStore.removeDataFolder(dataStoreTestFolder, function (error) {
              if (error) reject(funcname)
              else {
                abcAccount.dataStore.writeData(dataStoreTestFolder, dataStoreTestKey, dataStoreTestValue, function (error) {
                  if (error) reject(funcname)
                  else {
                    abcAccount.dataStore.readData(dataStoreTestFolder, dataStoreTestKey, function (error, data) {
                      if (error || (data != dataStoreTestValue)) reject(funcname)
                      else {
                        abcAccount.dataStore.writeData(dataStoreTestFolder, dataStoreTestKey2, dataStoreTestValue, function (error) {
                          if (error) reject(funcname)
                          else {
                            // abcAccount.dataStore.listDataKeys(dataStoreTestFolder, function (error, keys) {
                            //   if (error) reject(funcname)
                            //   else {
                            //     if (keys.length != 2)
                            //       reject(funcname)
                            //     else if (keys.indexOf(dataStoreTestKey) < 0)
                            //       reject(funcname)
                            //     else if (keys.indexOf(dataStoreTestKey2) < 0)
                            //       reject(funcname)
                            //     else
                                  account.logout(function () {
                                    resolve(funcname)
                                  })
                              // }
                            // })
                          }
                        })
                      }
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
}


function accountCreateChangePasswordAndLoginTest () {
  return new Promise(function(resolve, reject) {
    var funcname = "accountCreateChangePasswordAndLoginTest"
    abcContext.createAccount(myusername, "helloPW001", "1234", callbacks, (error, account) => {
      if (error || (myusername != account.username)) {
        reject(funcname)
      } else {
        account.logout(() => {
          abcContext.loginWithPassword(myusername, "helloPW001", null, callbacks, (error, account) => {
            if (error) {
              reject(funcname)
            } else {
              account.changePassword("helloPW002", (error) => {
                if (error) reject(funcname)
                else {
                  account.logout(() => {
                    abcContext.loginWithPassword(myusername, "helloPW002", null, callbacks, (error, account) => {
                      if (error) {
                        reject(funcname)
                      } else {
                        account.logout(function () {
                          resolve(funcname)
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
}

function accountCreateChangePINAndLoginTest () {
  return new Promise(function(resolve, reject) {
    var funcname = "accountCreateChangePINAndLoginTest"
    var mypinusername = myusername + "-pin"
    abcContext.createAccount(mypinusername, "helloPW001", "1234", callbacks, (error, account) => {
      if (error || (mypinusername != account.username)) {
        reject(funcname)
      } else {
        account.logout(() => {
          abcContext.loginWithPIN(mypinusername, "1234", callbacks, (error, account) => {
            if (error) {
              reject(funcname)
            } else {
              account.changePIN("4321", (error) => {
                if (error) reject(funcname)
                else {
                  account.logout(() => {
                    abcContext.loginWithPIN(mypinusername, "1234", callbacks, (error, account) => {
                      if (!error) {
                        reject(funcname) // This should have failed
                      } else {
                        abcContext.loginWithPIN(mypinusername, "4321", callbacks, (error, account) => {
                          if (error) {
                            reject(funcname) // This should have failed
                          } else {
                            account.logout(function () {
                              resolve(funcname)
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
        })
      }
    })
  })
}

function accountCreateChangeOTPTest () {
  return new Promise(function(resolve, reject) {
    var funcname = "accountCreateChangeOTPTest"
    var myOTPusername = myusername + "-otp"
    abcContext.createAccount(myOTPusername, "helloPW001", "1234", callbacks, (error, account) => {
      if (error || (myOTPusername != account.username)) {
        reject(funcname)
      } else {
        account.enableOTP(otpTimeout, (error) => {
          if (error) reject(funcname)
          else {
            account.getOTPDetails((error, otpEnabled, timeout) => {
              if (error) reject(funcname)
              else if (!(otpEnabled === true)) reject(funcname)
              else {
                account.getOTPLocalKey((error, otpKey) => {
                  if (error) reject(funcname)
                  else {
                    myotpKey = otpKey
                    account.logout(() => {
                      abcContext.deleteLocalAccount(myOTPusername, function (error) {
                        if (error) reject(funcname)
                        else {
                          abcContext.loginWithPassword(myOTPusername, "helloPW001", null, callbacks, (error, account) => {
                            if (!error || (error.code != abcc.ABCConditionCodeInvalidOTP)) {
                              reject(funcname)
                            } else {
                              abcContext.loginWithPassword(myOTPusername, "helloPW001", myotpKey, callbacks, (error, account) => {
                                if (error || (myOTPusername != account.username)) {
                                  reject(funcname)
                                } else {
                                  account.logout(function () {
                                    resolve(funcname)
                                  })
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
}

module.exports.BeginTests = BeginTests