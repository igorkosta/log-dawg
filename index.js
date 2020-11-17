'use strict'

const CloudWatchLogs = require('aws-sdk/clients/cloudwatchlogs.js')

module.exports = class Logger {
  constructor(config) {
    /* values expected to be in the config object
     * accessKeyId
     * secretAccessKey
     * logGroupName
     * logStreamName
     * region
     */
    const {
      accessKeyId,
      secretAccessKey,
      logGroupName,
      logStreamName,
      region
    } = config
    this.client = new CloudWatchLogs({
      accessKeyId,
      secretAccessKey,
      region
    })
    this.logGroupName = logGroupName
    this.logStreamName = logStreamName
    this.region = region
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
      const logStream = logStreams.find(entry => entry.logStreamName === this.logStreamName)
      return logStream.uploadSequenceToken
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
        logStreamName: this.logStreamName,
        sequenceToken
      }

      const logResponse = this.client.putLogEvents(params).promise()
      return logResponse
    } catch (error) {
      throw new Error(error)
    }
  }
}
