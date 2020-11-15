'use strict'

const CloudWatchLogs = require('aws-sdk/clients/cloudwatchlogs')
const { name: logGroupName } = require('./package')

class Logger {
  constructor(config) {
    /* values expected to be in the config object
     * accessKeyId:
     * secretAccessKey:
     * region
     */
    this.client = new CloudWatchLogs(config)
    this.logGroupName = process.env.LOG_GROUP || logGroupName
  }
  /*
   * Think about creating one log stream a day
   */
  async nextToken() {
    const params = {
      logGroupName: this.logGroupName
    }
    try {
      const { logStreams } = await this.client.describeLogStreams(params).promise()
      return logStreams[0].uploadSequenceToken
    } catch (error) {
      throw new Error(error)
    }
  }

  async log(message) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(message)
      return
    }

    const timestamp = new Date().getTime()
    try {
      const sequenceToken = await this.nextToken()
      const params = {
        logEvents: [
          {
            message,
            timestamp
          }
        ],
        logGroupName: this.logGroupName,
        logStreamName: 'test', //`${this.logGroup}-${timestamp}`
        sequenceToken
      }

      const logResponse = this.client.putLogEvents(params).promise()
      return logResponse
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = Logger
