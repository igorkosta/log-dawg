#!/bin/bash

# make file executable
set -e

stackname=${stackname:-log-dawg}
region=${region:-eu-west-1}

while [ $# -gt 0 ]; do

   if [[ $1 == *"--"* ]]; then
        param="${1/--/}"
        declare $param="$2"
   fi

  shift
done

echo "Creating stack with the name: ${stackname} in the region: ${region}"
# Deploy
aws cloudformation deploy --stack-name ${stackname} --no-fail-on-empty-changeset --region ${region} --template-file template.yml --parameters parameters.json

echo "🚀 🚀 🚀 🚀 🚀"
