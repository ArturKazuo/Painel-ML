module.exports = {
    apps : [
        {
          name: "botkazuoTeste",
          script: "./botSessions/botkazuoTeste.js",
          // cron_restart: '0 3 * * *',
          env: {
            "PORT": "3266",
            "SENDERPORT": "61931",
            "APINAME" : "kazuoTeste",
          }
        },
        {
          name: "kazuoTesteSessions",
          script: "./botSessions/wppConnectSessions/kazuoTesteSessions.js",
          // cron_restart: '0 3 * * *',
          env: {
            "PORT": "3266",
            "SENDERPORT": "61931",
            "APINAME" : "kazuoTeste",
          }
        }
    ]
  }