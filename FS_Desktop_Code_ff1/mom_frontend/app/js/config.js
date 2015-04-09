/*
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 */
/**
 * Application configuration.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */

//global config can be accessed by non-angular files
var GlobalConfig = {
    LINKEDIN_APP_ID: '75bfedn3v85xvw',
    FACEBOOK_APP_ID: '435002143324161',
    TWITTER_CONSUMER_KEY: 'HCXijRV8yZLry5pTS24FQ',
    SHARE_THIS_PUBLISHER_KEY: '',
    OAUTH_PUBLIC_KEY: 'SGfONjUkyc91aZpcpFUB07WCkCM'
};

angular.module("app")
    .constant('config', {
        REST_SERVICE_BASE_URL: 'http://localhost:4040',
        FRIEND_INVITATION_MESSAGE_TEMPLATE: '',
        SESSION_TOKEN_REFRESH_PERIOD: 1800,

        LINKEDIN_APP_ID: GlobalConfig.LINKEDIN_APP_ID,
        FACEBOOK_APP_ID: GlobalConfig.FACEBOOK_APP_ID,
        TWITTER_CONSUMER_KEY: GlobalConfig.TWITTER_CONSUMER_KEY,
        SHARE_THIS_PUBLISHER_KEY: '',
        OAUTH_PUBLIC_KEY: GlobalConfig.OAUTH_PUBLIC_KEY
    })
    .constant('roles', {
        BUSINESS_ADMIN: "BUSINESS_ADMIN"
    });