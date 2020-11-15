# log-dawg
Push your logs from the frontend to [AWS CloudWatch](https://aws.amazon.com/cloudwatch/)

`log-dawg` will neither create a `Log Group` nor a `Log Stream` inside of the log group.

I don't think it's a good idea to let your frontend do that or check whether
a log group or a log stream exists every time you try to log something.

## Create LogGroup and LogStream
There is a cloudformation script inside of the `aws` folder that will let you
create a `LogGroup` and a `LogStream` for your frontend.

```sh
cd aws
./deploy-stack.sh
```
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
