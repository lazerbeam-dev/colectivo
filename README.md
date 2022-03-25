# App


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