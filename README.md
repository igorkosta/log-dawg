# log-dawg

<p align="center">
  <img
    src="./log-dawg.jpg"
    width="150"
  />
</p>
Push your logs from the frontend to [AWS CloudWatch](https://aws.amazon.com/cloudwatch/)

`log-dawg` will neither create a `Log Group` nor a `Log Stream` inside of the log group.

I don't think it's a good idea to let your frontend do that or check whether
a log group or a log stream exists every time you try to log something.

## How-To

```js
const Logger = require('log-dawg')

const logger = new Logger({
  accessKeyId: 'accessKeyId',
  secretAccessKey: 'secretAccessKey',
  logGroupName: 'log-dawg',
  logStreamName: 'logs',
  region: 'us-east-1'
})

logger.log('Hello from log-dawg')
```

`log-dawg` will only send logs to `CloudWatch` if you run in production mode,
otherwise it will use `console.log()` to log your messages.

## Prerequisites
1. A log group
2. An AWS role with the permission to:
- PutLogEvents
- DescribeLogStreams

A policy for the user/role could look something like this:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "LogDawg",
            "Effect": "Allow",
            "Action": [
                "logs:PutLogEvents",
                "logs:DescribeLogStreams"
            ],
            "Resource": "arn:aws:logs:<region>:<account-id>:log-group:<log-group-name>:log-stream:*"
        }
    ]
}
```

## Create LogGroup and LogStream
There is a cloudformation script inside of the `aws` folder that should help you to get started with creating `LogGroup` and a `LogStream` for your frontend application.

> You'll have to adapt the script to your needs though!!!

```sh
cd aws
./deploy-stack.sh
```
