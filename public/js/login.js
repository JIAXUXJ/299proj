/*
 * Login module - translates login data from a form to
 * a JSON object.
 *
 * Written by Charlie Friend <cdfriend@uvic.ca>
 */

const SIGN_UP_FORM_ID = 'sign-up';
const SIGN_UP_BUTTON_ID = 'sign-up-button';
const LOGIN_FORM_ID = 'sign-in';
const LOGIN_BUTTON_ID = 'sign-in-button';

function login() {

    // get login info
    var info = {
        username : $("#" + LOGIN_FORM_ID + " input[name=userName]").val(),
        password : $("#" + LOGIN_FORM_ID + " input[name=pw]").val()
    };

    console.log(info);

    //TODO transmit to auth and process response

}

function signUp() {

    var password = $("#" + LOGIN_FORM_ID + " input[name=pw]").val();
    var retypedPwd = $("#" + LOGIN_FORM_ID + " input[name=re_pw]").val();

    if (password !== retypedPwd) {
        alert("Password and retyped password don't match.");
    }

    // get login info
    var info = {
        username : $("#" + LOGIN_FORM_ID + " input[name=userName]").val(),
        password : password
    };

    console.log(info);

    //TODO transmit to auth and process response

}

$(SIGN_UP_BUTTON_ID).click(signUp);
$(LOGIN_BUTTON_ID).click(login);