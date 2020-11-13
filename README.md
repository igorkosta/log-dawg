# log-dawg
Push your logs from the frontend to [AWS CloudWatch](https://aws.amazon.com/cloudwatch/)

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
            "Sid": "VisualEditor0",
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
