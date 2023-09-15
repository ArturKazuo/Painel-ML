const wppconnect = require('@wppconnect-team/wppconnect');
const express = require('express')
const fetch = require('node-fetch');
const cors = require('cors')
const bodyParser = require('body-parser');
const fs = require('fs')
var shell = require('shelljs');
const { firebaseConfig } = require('./firebase.config.js')
const { initializeApp } = require('firebase/app')
const { getFirestore, collection, getDocs, doc, addDoc, setDoc, deleteDoc } = require('firebase/firestore/lite');
const pm2 = require('pm2')
// const client = require('firebase-tools')

// async function generateQRCode(context, qrcode) {


//     await wppconnect.create({
//         session: context.id, //Pass the name of the client you want to start the bot
//         catchQR: async (base64Qr, asciiQR, attempts, urlCode) => {
//             console.log('Number of attempts to read the qrcode: ', attempts);
//             console.log('Terminal qrcode: ', asciiQR);
//             console.log('base64 image string qrcode: ', base64Qr);
//             console.log('urlCode (data-ref): ', urlCode); 
            
//             var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
//                 response = {};

//             if (matches.length !== 3) {
//                 return new Error('Invalid input string');
//             }
//             response.type = matches[1];
//             response.data = new Buffer.from(matches[2], 'base64');

//             var imageBuffer = response;
//             require('fs').writeFile(
//                 `./qrCodes/${context.id}.png`,
//                 imageBuffer['data'],
//                 'binary',
//                 function (err) {
//                     if (err != null) {
//                         console.log(err);
//                     }
//                 }
//             );

//             qrcode = base64Qr;

//             console.log(qrcode)

//             // return base64Qr
//         },
//         statusFind: (statusSession, session) => {
//             console.log('Status Session: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
//             //Create session wss return "serverClose" case server for close
//             console.log('Session name: ', session);
//         },
//         headless: true, // Headless chrome
//         devtools: false, // Open devtools by default
//         useChrome: true, // If false will use Chromium instance
//         debug: false, // Opens a debug session
//         logQR: false, // Logs QR automatically in terminal
//         browserWS: '', // If u want to use browserWSEndpoint
//         browserArgs: [''], // Parameters to be added into the chrome browser instance
//         puppeteerOptions: {}, // Will be passed to puppeteer.launch
//         disableWelcome: false, // Option to disable the welcoming message which appears in the beginning
//         updatesLog: true, // Logs info updates automatically in terminal
//         autoClose: 90000, // Automatically closes the wppconnect only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
//         tokenStore: 'file', // Define how work with tokens, that can be a custom interface
//         folderNameToken: './tokens', //folder name when saving tokens
//         // BrowserSessionToken
//         // To receive the client's token use the function await clinet.getSessionTokenBrowser()
//         sessionToken: {
//             WABrowserId: '"UnXjH....."',
//             WASecretBundle: '{"key":"+i/nRgWJ....","encKey":"kGdMR5t....","macKey":"+i/nRgW...."}',
//             WAToken1: '"0i8...."',
//             WAToken2: '"1@lPpzwC...."',
//         }
//     })
//     .then((client) => {
//         // start(client)
//         console.log(client)
//     })
//     .catch((error) => console.log("error", error));

//     console.log("foianofwnaondiaodnoa", qrcode)

//     return qrcode

// }

const appDB = initializeApp(firebaseConfig);
const db = getFirestore(appDB);

var app = express();

// app.use(bodyParser.json(), cors({
//     origin: 'http://localhost:3000'
// }))
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );
app.use(cors({origin: 'http://localhost:3000'}))


app.listen(process.env.port || process.env.PORT || 3978, async () => {
    console.log(`\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator`);
    console.log(`\nTo talk to your bot, open the emulator select "Open Bot" on 3978`);

});


app.get('/startSessions', async function (req, res) {

    shell.exec(`npx pm2 start ./botSessions/envs/ENV${req.query.id}.config.js`)
    // shell.exec(`npx pm2 start ./botSessions/bot${req.query.id}.js`)
    // shell.exec(`npx pm2 start ./botSessions/wppConnectSessions/${req.query.id}Sessions.js`)
    // shell.exit(1)

    const sessions = (await getDocs(collection(db, `Sessions/${req.query.name}/sessions`))).docs.map(doc => doc.data())

    let senderPort = ''

    setTimeout(async () => {
        for(const session of sessions){
            if(session.sessionkey == req.query.id){
                console.log('found')
                senderPort = session.APIPORT
            }
        }
        console.log('chamou')
        let url = `http://localhost:${senderPort}/generateQRCode?id=${req.query.id}`
        console.log(url)
        await fetch(`http://localhost:${senderPort}/generateQRCode?id=${req.query.id}`)    
        res.json(
            {
                result: "ok",
                error: null
            }
        )
    
        res.end()
    }, 7000);
    
})

app.get('/disconnectSessions', async function (req, res) {

    // console.log('foi foi foi foi foi')

    shell.exec(`npx pm2 stop ./botSessions/envs/ENV${req.query.id}.config.js`)

    // shell.exec(`npx pm2 stop bot${req.query.id}`)
    // shell.exec(`npx pm2 stop ${req.query.id}Sessions`)
    // // shell.exit(1)

    console.log('req.query.id: ', req.query.id)

    try{
        await fs.writeFileSync( `./botSessions/status/${req.query.id.replace(' ','')}.txt`, 'browserCloseled')
        // console.log('alooooooooooooooooooooooou')
    } catch(e){
        console.log("error browserClosed: ", err);
    }

    res.json(
        {
            result: "ok",
            error: null
        }
    )

    res.end()
    
})

app.get('/checkIfExists', async function (req, res) {
    fs.exists( `./WppConnect/qrCodes/${req.query.id}.png`, (exists) => {
        console.log(exists ? 'Found' : 'Not found!');

        res.json(
            {
                exists: exists,
                error: null
            }
        )
    
        res.end()
    } )


})


app.get('/getImage', async function (req, res) {

    let pic = req.query.image;

    fs.readFile(`${__dirname}/qrCodes/` + pic + ".png", async function (err, content) {
        if (err) {
            res.writeHead(400, {'Content-type':'image/png'})
            // console.log("err Triangle");
            let errorImage = fs.readFileSync(`${__dirname}/imgs/errorTriangle.png`)
            res.end(errorImage);    
        } else {
            //specify the content type in the response will be an image
            // console.log('not weeoe')
            fs.readFile(`${__dirname}/botSessions/status/` + pic + ".txt", async function (err, content) {
                if (err) {
                    res.writeHead(400, {'Content-type':'image/png'})
                    console.log("err2");
                    let errorImage = fs.readFileSync(`${__dirname}/imgs/errorTriangle.png`)
                    res.end(errorImage);    
                } else {

                    let finalImg = '';

                    if(content == 'notLogged' || content == 'desconnectedMobile' ){
                        finalImg = fs.readFileSync(`${__dirname}/qrCodes/${pic}.png`)
                    } else if(content == 'browserCloseled' || content == 'autocloseCalled' ||  content == 'serverClose' ||  content == 'deleteToken' ||  content == 'qrReadFail'){
                        finalImg = fs.readFileSync(`${__dirname}/imgs/errorFF.png`)
                    } else if(content == 'isLogged' || content == 'inChat'){
                        finalImg = fs.readFileSync(`${__dirname}/imgs/greenCheck.png`)
                    } else if(content == 'qrReadError'){
                        finalImg = fs.readFileSync(`${__dirname}/imgs/errorTriangle.png`)
                    } else {
                        // console.log('naaaada nada nada')
                        finalImg = fs.readFileSync(`${__dirname}/imgs/errorTriangle.png`)
                    }
                    
                    res.writeHead(200,{'Content-type':'image/png'});
                    res.end(finalImg);
                }
            });  
        }
    });

})

app.post('/copyFiles', async function (req, res) {

    fs.copyFile(`./templates/botMeuLocker.js`, `./botSessions/bot${req.query.id}.js`, (err) => {
        if(err){
            console.log("erro: " + err)
            throw err
        }
        console.log("index created")
        fs.readFile(`${__dirname}/botSessions/bot${req.query.id}.js`, async function (err, content) {
            if (err) {
                console.log("err", err);
            } else {
                let contentS = content.toString().replaceAll('lockerCadastroManagementBot', `locker${req.query.id}`)
                // console.log('contentS: ', contentS)
                await fs.writeFileSync(`${__dirname}/botSessions/bot${req.query.id}.js`, contentS)
            }
        });
    });

    fs.copyFile(`./templates/MeuLockerSessions.js`, `./botSessions/wppConnectSessions/${req.query.id}Sessions.js`, (err) => {
        if(err){
            console.log("erro: " + err)
            throw err
        } 
        console.log("created")
    });

    fs.copyFile(`./templates/lockerCadastroManagementBot.js`, `./botSessions/bots/locker${req.query.id}.js`, (err) => {
        if (err) {
            console.log("erro: " + err)
            throw err
        }
        console.log("created");
        fs.readFile(`${__dirname}/botSessions/bots/locker${req.query.id}.js`, async function (err, content) {
            if (err) {
                console.log("err", err);
            } else {
                let contentS = content.toString().replaceAll('mainDialogMeuLocker', `mainDialog${req.query.id}`)
                await fs.writeFileSync(`${__dirname}/botSessions/bots/locker${req.query.id}.js`, contentS)
            }
        });
    });

    fs.copyFile(`./templates/mainDialogMeuLocker.js`, `./botSessions/dialogs/mainDialog${req.query.id}.js`, (err) => {
        if (err) {
            console.log("erro: " + err)
            throw err
        }
    
        console.log("created");
    });

    fs.copyFile(`./templates/ENV.config.js`, `./botSessions/envs/ENV${req.query.id}.config.js`, (err) => {
        if (err) {
            console.log("erro: " + err)
            throw err
        }
        console.log("created ENV");
        fs.readFile(`${__dirname}/botSessions/envs/ENV${req.query.id}.config.js`, async function (err, content) {
            if (err) {
                console.log("err", err);
            } else {
                let contentS = content.toString().replaceAll('"PORT": ,', `"PORT": "${req.body.PORT}",`).replaceAll('"SENDERPORT": ,', `"SENDERPORT": "${req.body.APIPORT}",`).replaceAll('"APINAME" : ,', `"APINAME" : "${req.body.APINAME}",`).replaceAll('fileName', `${req.body.sessionkey}`)
                await fs.writeFileSync(`${__dirname}/botSessions/envs/ENV${req.query.id}.config.js`, contentS)
            }
        });
    });

    res.json(
        {
            result: "ok",
            error: null
        }
    )

    res.end()

})

app.get('/deleteFiles', async function (req, res) {

    try {
        fs.renameSync(`./botSessions/bot${req.query.id}.js`, `./botSessions/bot${req.query.id}MarkedForDelete.js`);
        // console.log("Marked File successfully.");
        
    } catch (error) {
        console.log(error);
    }   

    try {
        fs.renameSync(`./botSessions/wppConnectSessions/${req.query.id}Sessions.js`, `./botSessions/wppConnectSessions/${req.query.id}SessionsMarkedForDelete.js`);
        // console.log("Marked File successfully.");
                
    } catch (error) {
        console.log(error);
    }   


    try {
        fs.renameSync(`./botSessions/bots/locker${req.query.id}.js`, `./botSessions/bots/locker${req.query.id}MarkedForDelete.js`);
        // console.log("Marked File successfully.");
                
    } catch (error) {
        console.log(error);
    }   


    try {
        fs.renameSync(`./botSessions/dialogs/mainDialog${req.query.id}.js`, `./botSessions/dialogs/mainDialog${req.query.id}MarkedForDelete.js`);
        // console.log("Marked File successfully.");
                
    } catch (error) {
        console.log(error);
    }   


    try {
        fs.renameSync(`./botSessions/envs/ENV${req.query.id}.config.js`, `./botSessions/envs/ENV${req.query.id}MarkedForDelete.config.js`);
        // console.log("Marked ENVFile successfully.");
                
    } catch (error) {
        console.log(error);
    } 


    // try {
    //     fs.renameSync(`./qrCodes/${req.query.id}.png`, `./qrCodes/${req.query.id}MarkedForDelete.png`);
    //     console.log("Marked QRCode File successfully.");
            
    // } catch (error) {
    //     // console.log(error);
    // }   

    res.json(
        {
            result: "ok",
            error: null
        }
    )

    res.end()

    fetch(`http://localhost:3978/deleteFilesFinal?id=${req.query.id}`)

})

app.get('/deleteFilesFinal', async function (req, res) {

    try {
        // fs.unlinkSync(`./botSessions/bot${req.query.id}MarkedForDelete.js`);
        fs.unlink(`./botSessions/bot${req.query.id}MarkedForDelete.js`, () => {});
        console.log("Deleted File successfully.");
        
    } catch (error) {
        console.log(error);
    }   

    try {
        // fs.unlinkSync(`./botSessions/wppConnectSessions/${req.query.id}SessionsMarkedForDelete.js`);
        fs.unlink(`./botSessions/wppConnectSessions/${req.query.id}SessionsMarkedForDelete.js`, () => {});
        console.log("Deleted File successfully.");
                
    } catch (error) {
        console.log(error);
    }   


    try {
        // fs.unlinkSync(`./botSessions/bots/locker${req.query.id}MarkedForDelete.js`);
        fs.unlink(`./botSessions/bots/locker${req.query.id}MarkedForDelete.js`, () => {});
        console.log("Deleted File successfully.");
                
    } catch (error) {
        console.log(error);
    }   


    try {
        // fs.unlinkSync(`./botSessions/dialogs/mainDialog${req.query.id}MarkedForDelete.js`);
        fs.unlink(`./botSessions/dialogs/mainDialog${req.query.id}MarkedForDelete.js`, () => {});
        console.log("Deleted File successfully.");
                
    } catch (error) {
        console.log(error);
    }   


    try {

        shell.exec(`npx pm2 stop ./botSessions/envs/ENV${req.query.id}MarkedForDelete.config.js`)
        shell.exec(`npx pm2 delete ./botSessions/envs/ENV${req.query.id}MarkedForDelete.config.js`)

        // fs.unlinkSync(`./botSessions/envs/ENV${req.query.id}MarkedForDelete.config.js`);
        fs.unlink(`./botSessions/envs/ENV${req.query.id}MarkedForDelete.config.js`, () => {});
        console.log("Deleted ENVFile successfully.");
                
    } catch (error) {
        console.log(error);
    } 


    try {
        // fs.unlinkSync(`./qrCodes/${req.query.id}MarkedForDelete.png`);
        fs.unlink(`./qrCodes/${req.query.id}.png`, () => {});
        console.log("Deleted QRCode File successfully. ");
            
    } catch (error) {
        // console.log(error);
    }   

    try {
        // fs.unlinkSync(`./qrCodes/${req.query.id}MarkedForDelete.png`);
        fs.unlink(`./botSessions/status/${req.query.id}.txt`, () => {});
        console.log("Deleted status File successfully. *******************************");
            
    } catch (error) {
        // console.log(error);
    }   



    res.json(
        {
            result: "ok",
            error: null
        }
    )

    res.end()


})

app.post('/changeFile', async function (req, res) {
    
    let file = req.body

    let fileName = req.query.name

    let final = '';

    // console.log(file.code)

    switch(req.query.type){
        
        case 'indexFile':
            final = `bot${fileName}`
            break;

        case 'sessionFile':
            final = `wppConnectSessions/${fileName}Sessions`
            break;

        case 'botFile':
            final = `bots/locker${fileName}`
            break;

        case 'dialogFile':
            final = `dialogs/MainDialog${fileName}`
            break;

        case 'envFile':
            final = `envs/ENV${fileName}.config`
            break;

        default: 
            console.log('nops')

    }

    try {
        await fs.writeFileSync(`${__dirname}/botSessions/${final}.js`, file.code)
        res.status(200).send(JSON.stringify({
            status: "ok"
        }));
    } catch (e) {
        console.log("err", e);
        res.status(500).send(JSON.stringify({
            status: "error"
        })); 
    }


    // res.end();
        
})

app.get('/getFile', async function (req, res) {

    let fileName = req.query.file;
    let type = req.query.type;
    let final = ''

    // console.log(type)

    switch(type){
        
        case 'indexFile':
            final = `bot${fileName}`
            break;

        case 'sessionFile':
            final = `wppConnectSessions/${fileName}Sessions`
            break;

        case 'botFile':
            final = `bots/locker${fileName}`
            break;

        case 'dialogFile':
            final = `dialogs/MainDialog${fileName}`
            break;

        case 'envFile':
            final = `envs/ENV${fileName}.config`
            break;

        default: 
            console.log('nops')

    }

    console.log(fileName)

    fs.readFile(`${__dirname}/botSessions/${final}.js`, async function (err, content) {
        if (err) {
            // res.writeHead(400, {'Content-type':'application/javascript'})
            console.log("err", err);
            // let errorImage = fs.readFileSync(`${__dirname}/imgs/errorFF.jpg`)
            res.end('');    
        } else {
            //specify the content type in the response will be an image
            // console.log('not weeoe', content.toString())
            // res.writeHead(200,{'Content-type':'text/html'});
            res.status(200).send(JSON.stringify(content.toString()));
        }
    });

})

app.get('/connectedToAPI', async function (req, res) {

    pm2.list(async (err, list) => {
        for(const session of list){
            if(session.pm2_env.status == 'stopped' || session.pm2_env.status == 'errored'){
                // console.log("errorCloseled")
                let final = session.name.replaceAll('Sessions', '').replaceAll('bot', '')
                // console.log('final: ', final)
                await fs.writeFileSync( `./botSessions/status/${final}.txt`, `browserCloseled`)   
            } else {
                // console.log("not")
            }
        }
    })

    // console.log('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB')

    res.json(
        {
            result: "ok",
            error: null
        }
    )

    res.end()
})

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }