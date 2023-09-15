module.exports = {
    apps : [
        {
          name: "botfileName",
          script: "./botSessions/botfileName.js",
          // cron_restart: '0 3 * * *',
          env: {
            "PORT": ,
            "SENDERPORT": ,
            "APINAME" : ,
          }
        },
        {
          name: "fileNameSessions",
          script: "./botSessions/wppConnectSessions/fileNameSessions.js",
          // cron_restart: '0 3 * * *',
          env: {
            "PORT": ,
            "SENDERPORT": ,
            "APINAME" : ,
          }
        }
    ]
  }