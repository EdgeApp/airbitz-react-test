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

var a = require('./abc-react.js');

var abc
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
  abc = new a.AirbitzCore
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
    abc.makeABCContext('572d3e23e632ebfcd5c4ad6390b83a01a5d4007b', 'hbits', function (error) {
      if (error && error.code != 23) {
        reject(funcname)
      } else {
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
      abc.localAccountDelete(oldAccountName, function (error) {
        if (error) reject(funcname)
        else {
          abc.passwordLogin(oldAccountName, oldAccountPassword, "", callbacks, function (error, account) {
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
      abc.localAccountDelete(oldAccountName, function (error) {
        abc.passwordLogin(oldAccountName, oldAccountPassword, "", callbacks, function (error, account) {
          if (error) reject(funcname)
          else {
            sleep(5000)
            account.logout(() => {
              abc.pinLogin(oldAccountName, oldAccountPIN, callbacks, function (error, account) {
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
      abc.localAccountDelete(otpAccountName, function (error) {
        abc.passwordLogin(otpAccountName, otpAccountPassword, "", callbacks, function (error, account) {
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
      abc.localAccountDelete(otpAccountName, function (error) {
        abc.passwordLogin(otpAccountName, otpAccountPassword, otpAccountOTPToken, callbacks, function (error, account) {
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
    var funcname = "accountCreateAndLoginTest"
    if (abcAccount) abcAccount.logout(() => {
      abcAccount = dummyAccount
      abc.accountCreate(myusername, "helloPW001", "1234", callbacks, (error, account) => {
        if (error || (myusername != account)) {
          reject(funcname)
        } else {
          account.logout(() => {
            abc.passwordLogin(myusername, "helloPW001", "", callbacks, (error, account) => {
              if (error) {
                reject(funcname)
              } else {
                account.passwordSet("helloPW002", (error) => {
                  if (error) reject(funcname)
                  else {
                    account.logout(() => {
                      abc.passwordLogin(myusername, "helloPW002", "", callbacks, (error, account) => {
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
    var funcname = "accountCreateAndLoginTest"
    if (abcAccount) abcAccount.logout(() => {
      abcAccount = dummyAccount
      var mypinusername = myusername + "-pin"
      abc.accountCreate(mypinusername, "helloPW001", "1234", callbacks, (error, account) => {
        if (error || (mypinusername != account.username)) {
          reject(funcname)
        } else {
          account.logout(() => {
            abc.pinLogin(mypinusername, "1234", callbacks, (error, account) => {
              if (error) {
                reject(funcname)
              } else {
                account.pinSet("4321", (error) => {
                  if (error) reject(funcname)
                  else {
                    account.logout(() => {
                      abc.pinLogin(mypinusername, "1234", callbacks, (error, account) => {
                        if (!error) {
                          reject(funcname) // This should have failed
                        } else {
                          abc.pinLogin(mypinusername, "4321", callbacks, (error, account) => {
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
    var funcname = "accountCreateAndLoginTest"
    if (abcAccount) abcAccount.logout(() => {
      abcAccount = dummyAccount
      var myOTPusername = myusername + "-otp"
      abc.accountCreate(myOTPusername, "helloPW001", "1234", callbacks, (error, account) => {
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
                        abc.localAccountDelete(myOTPusername, function (error) {
                          if (error) reject(funcname)
                          else {
                            abc.passwordLogin(myOTPusername, "helloPW001", "", callbacks, (error, account) => {
                              if (!error || (error.code != 37)) {
                                reject(funcname)
                              } else {
                                abc.passwordLogin(myOTPusername, "helloPW001", myotpKey, callbacks, (error, account) => {
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


function otpEnableTest (account) {
  abc.otpEnable(otpTimeout, () => {
    console.log("OTP enable test PASSED")

    abc.otpDetailsGet((otpEnabled, timeout) => {
      if (timeout === otpTimeout && otpEnabled === true) {
        console.log("OTP details get test PASSED")
        abc.otpLocalKeyGet((otpKey) => {
          console.log("OTP local key get test PASSED")
          myotpKey = otpKey
          logoutTest(account)
        }, (rtcerror) => {
          console.log("OTP local key get test FAILED")
        })
      } else {
        console.log("OTP details get test FAILED: bad return values")
      }
    }, (rtcerror) => {
      console.log("OTP local key get test FAILED")
    })
  }, (rtcerror) => {
    console.log("OTP enable test FAILED")
  })
}

// function callbacksTest() {
//   for (var i = 0; i < 30; i++) {
//     if (walletsLoadedCallbackOccurred && walletChangedCallbackOccurred) {
//       console.log("Callbacks test PASSED")
//       return;
//     }
//     sleep(1000)
//   }
//   console.log("Callbacks test FAILED")
// }

function logoutTest (account) {
  account.logout(() => {
    console.log("Logout test PASSED")
    // otpLoginWithoutOTPTest()
  })
}




function accountCreateTest () {
  abc.accountCreate(myusername, "helloPW001", "1234", callbacks, (error, account) => {
    if (account.username === myusername) {
      account.logout(() => {
      })
    } else {
      console.log("accountCreate test FAILED. Wrong name on create")
    }
  }, (error) => {
    console.log("accountCreate test FAILED")
  })
}

function loginTest (username, password) {
  abc.passwordLogin(username, password, "", callbacks, (account) => {
    changePasswordTest(account)
  }, (rtcerror) => {
    console.log("Password login test FAILED")
  })
}

function changePasswordTest(account) {
  account.changePassword("helloPW002", () => {
    console.log("Change password PASSED")
    account.logout(() => {
      abc.passwordLogin(myusername, "helloPW002","", callbacks, (account) => {
        account.logout(() => {
          console.log("Change password relogin PASSED")
          pinLoginTest()
        })
      }, (rtcerror) => {
        console.log("Change password relogin FAILED")
      })
    })

  }, () => {
    console.log("Change password FAILED")
  })

}

function pinLoginTest (redo=5) {
  abc.pinLogin(myusername, "1234", callbacks, (account) => {
    console.log("pinLogin test PASSED")
    changePinTest(account)

  }, (rtcerror) => {
    console.log("pinLogin test FAILED")
    if (redo) {
      redo--;
      sleep(3000)
      pinLoginTest(redo)
    }

  })
}

function changePinTest(account) {
  account.changePIN("4321", () => {
    console.log("changePIN test PASSED")
    account.logout(() => {
      abc.pinLogin(myusername, "4321", callbacks, (account) => {
        console.log("Change pin relogin PASSED")
        checkPasswordTest(account)
      }, (rtcerror) => {
        console.log("Change pin relogin FAILED")
      })
    })

  }, () => {
    console.log("changePIN test FAILED")
  })
}

function checkPasswordTest(account) {
  account.checkPassword("helloPW002", (check) => {
    if (check) {
      console.log("checkPasswordTest test PASSED")
      checkWrongPasswordTest(account)
    } else {
      console.log("checkPasswordTest test FAILED")
    }
  }, (rtcerror) => {
    console.log("Error: checkPasswordTest test FAILED")
  })

}

function checkWrongPasswordTest(account) {
  account.checkPassword("helloPW002wrong", (check) => {
    if (check) {
      console.log("checkWrongPasswordTest test FAILED")
    } else {
      console.log("checkWrongPasswordTest test PASSED")
      disablePinLoginTest(account)
    }
  }, (rtcerror) => {
    console.log("Error: checkWrongPasswordTest test FAILED")
  })

}


function disablePinLoginTest(account)
{
  account.pinLoginSetup(false, () => {
    account.logout(() => {
      abc.pinLogin(myusername, "4321", callbacks, (account) => {
        console.log("Disable pin relogin FAILED")
      }, (rtcerror) => {
        console.log("Disable pin relogin PASSED")
        createPINOnlyAccountTest()
      })
    })
  }, (rtcerror) => {
    console.log("changePIN test FAILED")
  })
}


function createPINOnlyAccountTest() {
  abc.createAccount(myusername + "pinonly", "", "1234", callbacks, (account) => {
    console.log("createAccount PIN Only test PASSED")
    account.logout(() => {
      hasPasswordTest()
    })
  }, (error) => {
    console.log("createAccount PIN Only test FAILED")
  })
}

function hasPasswordTest() {
  abc.accountHasPassword(myusername, (hasPassword) => {
    if (hasPassword) {
      console.log("hasPasswordTest test PASSED")
      hasNoPasswordTest()
    } else {
      console.log("hasPasswordTest test FAILED")
    }
  }, (rtcerror) => {
    console.log("Error: hasPasswordTest test FAILED")
  })
}

function hasNoPasswordTest() {
  abc.accountHasPassword(myusername + "pinonly", (hasPassword) => {
    if (hasPassword) {
      console.log("hasNoPasswordTest test FAILED")
    } else {
      console.log("hasNoPasswordTest test PASSED")
      pinOnlyLoginTest()
    }
  }, (rtcerror) => {
    console.log("Error: hasNoPasswordTest test FAILED")
  })
}


function pinOnlyLoginTest(redo=5) {
  abc.pinLogin(myusername + "pinonly", "1234", callbacks, (account) => {
    console.log("PIN only Login test PASSED")
  }, (rtcerror) => {
    console.log("PIN only Login test FAILED")
    if (redo) {
      redo--;
      sleep(3000)
      pinOnlyLoginTest(redo)
    }
  })
}



module.exports.BeginTests = BeginTests