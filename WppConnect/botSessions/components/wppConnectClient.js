const wppconnect = require('@wppconnect-team/wppconnect');
const qrcode = require('qrcode-terminal');
const QR = require('qrcode');
const { io } = require("socket.io-client");


module.exports = class Bot {

    /**
     * Defino seu construtor recebendo o client do WhatsApp 
     * para que eu possa responder as mensagems por aqui.
     */
    constructor(SESSION_NAME, receiveMessage, context) {
        // let sessionName = ''; 
       wppconnect.create({
        session: SESSION_NAME, //Pass the name of the client you want to start the bot
        catchQR: (base64Qrimg, asciiQR, attempts, urlCode) => {
          console.log('Number of attempts to read the qrcode: ', attempts);
          console.log(asciiQR);
          // console.log('base64 image string qrcode: ', base64Qrimg);
          console.log('urlCode (data-ref): ', urlCode);

          // sessionName = Sess

            var matches = base64Qrimg.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
                response = {};

            if (matches.length !== 3) {
                return new Error('Invalid input string');
            }
            response.type = matches[1];
            response.data = new Buffer.from(matches[2], 'base64');

            var imageBuffer = response;

            console.log("dwaidonwa ALOU")

            console.log("dwaidonwa")

            require('fs').writeFile(
                `./qrCodes/${context}.png`,
                imageBuffer['data'],
                'binary',
                function (err) {
                    if (err != null) {
                        console.log(err);
                    }
                }
            );

            // const socket = io();
            const socket = io("http://localhost:3978");
            socket.emit('qrCodeToRead', imageBuffer, asciiQR, SESSION_NAME);


        },
        statusFind: (statusSession, session) => {
          console.log('Status Session: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
          //Create session wss return "serverClose" case server for close
          console.log('Session name: ', session);

          // const socket = io("http://localhost:3978");
          // socket.emit('qrCodeToRead', imageBuffer, asciiQR, SESSION_NAME);

          const socket = io("http://localhost:3978");
          socket.emit('statusChange', session, statusSession);

          require('fs').writeFile(
            `./botSessions/status/${session}.txt`,
            statusSession,
            function (err) {
                if (err != null) {
                    console.log(err);
                }
            }
          );

          // const socket = io("http://localhost:3978");
          // socket.emit('statusChange', session, statusSession);

        },
        onLoadingScreen: (percent, message) => {
          console.log('LOADING_SCREEN', percent, message);
        },
        headless: true, // Headless chrome
        devtools: false, // Open devtools by default
        //useChrome: true, // If false will use Chromium instance
        debug: false, // Opens a debug session
        logQR: true, // Logs QR automatically in terminal
        browserWS: '', // If u want to use browserWSEndpoint
        browserArgs: [
                      '--log-level=3',
                      '--no-default-browser-check',
                      '--disable-site-isolation-trials',
                      '--no-experiments',
                      '--ignore-gpu-blacklist',
                      '--ignore-certificate-errors',
                      '--ignore-certificate-errors-spki-list',
                      '--disable-gpu',
                      '--disable-extensions',
                      '--disable-default-apps',
                      '--enable-features=NetworkService',
                      '--disable-setuid-sandbox',
                      '--no-sandbox',
                      // Extras
                      '--disable-webgl',
                      '--disable-threaded-animation',
                      '--disable-threaded-scrolling',
                      '--disable-in-process-stack-traces',
                      '--disable-histogram-customizer',
                      '--disable-gl-extensions',
                      '--disable-composited-antialiasing',
                      '--disable-canvas-aa',
                      '--disable-3d-apis',
                      '--disable-accelerated-2d-canvas',
                      '--disable-accelerated-jpeg-decoding',
                      '--disable-accelerated-mjpeg-decode',
                      '--disable-app-list-dismiss-on-blur',
                      '--disable-accelerated-video-decode',
                  ], // Parameters to be added into the chrome browser instance
        puppeteerOptions: {}, // Will be passed to puppeteer.launch
        disableWelcome: false, // Option to disable the welcoming message which appears in the beginning
        updatesLog: true, // Logs info updates automatically in 
        debug: false, // Opens a debug session
        autoClose: 90000, // Automatically closes the wppconnect only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
        tokenStore: 'file', // Define how work with tokens, that can be a custom interface
        folderNameToken: './tokens', //folder name when saving tokens
        // BrowserSessionToken
        // To receive the client's token use the function await clinet.getSessionTokenBrowser()
        sessionToken: {
          WABrowserId: '"UnXjH....."',
          WASecretBundle: '{"key":"+i/nRgWJ....","encKey":"kGdMR5t....","macKey":"+i/nRgW...."}',
          WAToken1: '"0i8...."',
          WAToken2: '"1@lPpzwC...."',
        }
      })
      .then((client) => this.start(client, receiveMessage))
      .catch((error) => {
        console.log(error)
        
        const socket = io("http://localhost:3978");
        socket.emit('qrCodeAutoClose', SESSION_NAME);
      });
    }
  
    start(client, receiveMessage) {
      this.client = client;
  
      client.onMessage((message) => {
        //console.log(`Mensagem Recebida`, JSON.stringify(message));
  
        const contact = message?.from;
        const channelData = {
          data: {
            pushname: message?.notifyName,
            contact: contact
          }
        }
  
          // console.log(msg);
          receiveMessage(message.body, contact, channelData, message);
      });
    }
  
  
      parseMessage(message) {
          var retorno = message.replace(/\\n/g, "\n");
          return retorno;
      }
  
  
    sendText(phone, text, qrcode) {
      return new Promise((resolve, reject) => {
        console.log(`${phone} ${texto}`);
        if (!texto) return;
        if (!phone) return;
        if (!this.client) reject(new Error(`No Client`));
  
        const text = this.parseMessage(texto);
  
        try {
          this.client.checkNumberStatus(phone)
            .then((result) => {
              // console.log('Result: ', result); //return object success
              if (result.numberExists) {
                const { _serialized } = result.id;
                if (_serialized) {
                  if (qrcode) {
                    this.sendQrCode(_serialized, text, qrcode).then((res) => {
                      resolve(res);
                    }).catch((erro) => {
                      reject(erro)
                    })
                  } else {
                    this.client.sendText(_serialized, text).then((res) => {
                      resolve(res);
                    }).catch((erro) => {
                      reject(erro)
                    })
                  }
                } else {
                  reject({ error: `Número Inválido` })
                }
              } else {
                reject({ error: `Número Inválido` })
              }
            }).catch((erro) => {
              console.error('Error when sending: ', JSON.stringify(erro)); //return object error
              //throw new Error(erro)
              //throw erro;
              reject({ error: erro })
            });
          // console.log('MSG', msg);
        } catch (error) {
          console.error('Erro Numero: ', JSON.stringify(erro)); //return object error
          //throw new Error(error)
          //throw error;
          reject(error)
        }
  
      });
    }
  
    getPhoneNumber(phone) {
      return new Promise((resolve, reject) => {
        if (!phone) return;
        if (!this.client) reject(new Error(`No Client`));
  
        try {
          this.client.checkNumberStatus(phone)
            .then((result) => {
              // console.log('Result: ', result); //return object success
              if (result.numberExists) {
                const { _serialized } = result.id;
                if (_serialized) {
                  resolve({
                    phone: _serialized
                  })
                } else {
                  reject({ error: `Número Inválido` })
                }
              } else {
                reject({ error: `Número Inválido` })
              }
            }).catch((erro) => {
              console.error('Error when sending: ', JSON.stringify(erro)); //return object error
              reject({ error: erro })
            });
        } catch (error) {
          console.error('Erro Numero: ', JSON.stringify(erro)); //return object error
          reject(error)
        }
  
      });
    }
  
  
  
    sendTextNew(phone, texto, qrcode) {
      return new Promise((resolve, reject) => {
        console.log(`${phone} ${texto} ${qrcode}`);
        if (!texto) return;
        if (!phone) return;
        if (!this.client) reject(new Error(`No Client`));
  
        const text = this.parseMessage(texto);
        const qrParsed = (qrcode && (qrcode != undefined) && (qrcode != 'undefined'))?`${qrcode}`:null;
  
        console.log('QRCODE', qrParsed);
  
        try {
          this.client.checkNumberStatus(phone)
            .then((result) => {
              // console.log('Result: ', result); //return object success
              if (result.numberExists) {
                const { _serialized } = result.id;
                if (_serialized) {
                  if (qrParsed) {
                    this.sendQrCode(_serialized, text, qrParsed).then((res) => {
                      resolve(res);
                    }).catch((erro) => {
                      reject(erro)
                    })
                  } else {
                    this.client.sendText(_serialized, text).then((res) => {
                      resolve(res);
                    }).catch((erro) => {
                      reject(erro)
                    })
                  }
                } else {
                  reject({ error: `Número Inválido` })
                }
              } else {
                reject({ error: `Número Inválido` })
              }
            }).catch((erro) => {
              console.error('Error when sending: ', JSON.stringify(erro)); //return object error
              //throw new Error(erro)
              //throw erro;
              reject({ error: erro })
            });
          // console.log('MSG', msg);
        } catch (error) {
          console.error('Erro Numero: ', JSON.stringify(erro)); //return object error
          //throw new Error(error)
          //throw error;
          reject(error)
        }
  
      });
    }
  
    async sendQrCode(phone, text, qrcode) {
  
      if (!this.client) return;
      if (!text) return;
      if (!phone) return;
  
      try {
        //console.log('QR CODE:', qrcode);
        var imgData = await QR.toDataURL(qrcode);
        //console.log('QRCODE DATA', imgData)
        const msg = await this.sendMedia(phone, text, imgData);
        return msg;
        // console.log('MSG', msg);
      } catch (error) {
        throw new Error(error)
      }
  
    }
  
    async sendMedia(phone, text, b64data) {
      //console.log(`${phone} ${text}`);
      if (!this.client) return;
      if (!text) return;
      if (!phone) return;
  
      try {
        const msg = await this.client.sendFileFromBase64(phone, b64data, 'qrcode' ,text);
        return msg;
        // console.log('MSG', msg);
      } catch (error) {
        throw new Error(error)
      }
  
    }
  
  
  
  }