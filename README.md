# App


## frontend

1. Install packages

    `npm install`

2. Run frontend

    `npm run serve`

## backoffice

1. Run backoffice only

    `npm run server:run`

2. Run fresh build of frontend + backoffice [testing]

    `npm run server:build`

## Deploy backoffice

1. Install serverless package

    `npm install -g serverless`

2. Configure AWS credentials

    ```
    sls config credentials \
        --provider aws \
        --key PUBLIC_KEY \
        --secret SECRET_KEY
    ```

3. Ready to deploy

    `sls deploy`


## Android

`npm run android`

It will open Android Studio if configured in PATH. Alternatively you can open Studio with path `android`.

## iOS

`npm run ios`

## App assets

1. Install plugin

    `npm install -g cordova-res`

2. Update icon or splash in `resources` folder.

    Note: icon size is 1024x1024px, Splash size is 2732x2732px

3. Run command

    ```
    $ cordova-res ios --skip-config --copy
    $ cordova-res android --skip-config --copy
    ```
