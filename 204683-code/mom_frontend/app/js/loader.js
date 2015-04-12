/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * This file loads the javascript sdk's for various social networks
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

// facebook sdk
window.fbAsyncInit = function () {
    FB.init({
        appId: GlobalConfig.FACEBOOK_APP_ID,
        xfbml: true,
        version: 'v2.2'
    });
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

$(document).ready(function () {
    // initialize linkedin library
    $.getScript("http://platform.linkedin.com/in.js?async=true", function success() {
        IN.init({
            api_key: GlobalConfig.LINKEDIN_APP_ID,
            authorize: true
        });
    });
    // initialize oath.io library
    OAuth.initialize(GlobalConfig.OAUTH_PUBLIC_KEY);
});