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

var a = require('./abc-react.js');

var abc

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

var myusername = ""

function BeginTests()
{
  abc = new a.AirbitzCore
  myusername = "tester" + makeID()

  console.log("Initializing...")

  abc.init('572d3e23e632ebfcd5c4ad6390b83a01a5d4007b', 'hbits', () => {
    console.log("ABC Initialized")
    createAccountTest()
  }, (error) => {
    if (error.code == 23) { // ABC Already initialized. Create account anyway
      createAccountTest()
    }
  });

}


function createAccountTest () {
  abc.createAccount(myusername, "helloPW001", "1234", (account) => {
    console.log("createAccount test PASSED")
    logoutTest(account)
  }, (error) => {
    console.log("createAccount test FAILED")
  })
}

function logoutTest (account) {
  account.logout(() => {
    console.log("Logout test PASSED")
    loginTest(myusername, "helloPW001")
  })
}

function loginTest (username, password) {
  abc.passwordLogin(username, password, "", (account) => {
    changePasswordTest(account)
  }, (rtcerror) => {
    console.log("Password login test FAILED")
  })
}

function changePasswordTest(account) {
  account.changePassword("helloPW002", () => {
    console.log("Change password PASSED")
    account.logout(() => {
      abc.passwordLogin(myusername, "helloPW002","", (account) => {
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
  abc.pinLogin(myusername, "1234", (account) => {
    console.log("pinLogin test PASSED")
    changePinTest(account)

  }, (rtcerror) => {
    console.log("pinLogin test FAILED")
    if (redo) {
      redo--;
      sleep(1000)
      pinLoginTest(false)
    }

  })
}

function changePinTest(account) {
  account.changePIN("4321", () => {
    console.log("changePIN test PASSED")
    account.logout(() => {
      abc.pinLogin(myusername, "4321", (account) => {
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
      abc.pinLogin(myusername, "4321", (account) => {
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
  abc.createAccount(myusername + "pinonly", "", "1234", (account) => {
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
  abc.pinLogin(myusername + "pinonly", "1234", (account) => {
    console.log("PIN only Login test PASSED")
    console.log("*** ALL TESTS PASSED ***")
  }, (rtcerror) => {
    console.log("PIN only Login test FAILED")
    if (redo) {
      redo--;
      sleep(1000)
      pinOnlyLoginTest(false)
    }
  })
}


module.exports.BeginTests = BeginTests