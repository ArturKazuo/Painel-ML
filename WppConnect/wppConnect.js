const wppconnect = require('@wppconnect-team/wppconnect');
const express = require('express')
const fetch = require('node-fetch');
const cors = require('cors')
const bodyParser = require('body-parser');
const fs = require('fs')
var shell = require('shelljs');
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

var app = express();

app.use(bodyParser.json(), cors({
    origin: 'http://localhost:3000'
}))


app.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator`);
    console.log(`\nTo talk to your bot, open the emulator select "Open Bot"`);
});

app.get('/startSessions', async function (req, res) {

    // console.log('foi foi foi foi foi')

    shell.exec(`npx pm2 start ./botSessions/bot${req.query.id}.js`)
    shell.exec(`npx pm2 start ./botSessions/wppConnectSessions/${req.query.id}Sessions.js`)
    // shell.exit(1)

    setTimeout(async () => {
        await fetch(`http://localhost:60008/generateQRCode?id=${req.query.id}`)    
    }, 8000);
    
})

app.get('/disconnectSessions', async function (req, res) {

    // console.log('foi foi foi foi foi')

    shell.exec(`npx pm2 stop bot${req.query.id}`)
    shell.exec(`npx pm2 stop ${req.query.id}Sessions`)
    // shell.exit(1)

    // setTimeout(async () => {
    //     await fetch(`http://localhost:60008/generateQRCode?id=${req.query.id}`)    
    // }, 8000);

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
            // console.log("err");
            let errorImage = fs.readFileSync(`${__dirname}/imgs/errorFF.jpg`)
            res.end(errorImage);    
        } else {
            //specify the content type in the response will be an image
            // console.log('not weeoe')
            res.writeHead(200,{'Content-type':'image/png'});
            res.end(content);
        }
    });

})

app.get('/copyFiles', async function (req, res) {

    fs.copyFile(`./templates/botMeuLocker.js`, `./botSessions/bot${req.query.id}.js`, (err) => {
        if(err){
            console.log("erro: " + err)
            throw err
        }
        console.log("created")
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
    });

    fs.copyFile(`./templates/mainDialogMeuLocker.js`, `./botSessions/dialogs/mainDialog${req.query.id}.js`, (err) => {
        if (err) {
            console.log("erro: " + err)
            throw err
        }
    
        console.log("created");
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

    fs.unlink(`./botSessions/bot${req.query.id}.js`, (err) => {
        if (err) {
            console.log("erro: " + err)
            throw err
        }
        console.log("Deleted File successfully.");
    });

    fs.unlink(`./botSessions/wppConnectSessions/${req.query.id}Sessions.js`, (err) => {
        if (err) {
            console.log("erro: " + err)
            throw err
        }
    
        console.log("Deleted File successfully.");
    });

    fs.unlink(`./botSessions/bots/locker${req.query.id}.js`, (err) => {
        if (err) {
            console.log("erro: " + err)
            throw err
        }
    
        console.log("Deleted File successfully.");
    });

    fs.unlink(`./botSessions/dialogs/mainDialog${req.query.id}.js`, (err) => {
        if (err) {
            console.log("erro: " + err)
            throw err
        }
    
        console.log("Deleted File successfully.");
    });

    fs.unlink(`./qrCodes/${req.query.id}.png`, (err) => {
        if (err) {
            console.log("erro: " + err)
            throw err
        }
    
        console.log("Deleted File successfully.");
    });

    res.json(
        {
            result: "ok",
            error: null
        }
    )

    res.end()


})

app.get('/deleteAccount', async (req, res) => {
    // await client.firestore.delete(`Sessions/${req.query.email}`, {
    //     project: 'meu-locker-myzap-test',
    //     recursive: true,
    //     yes: true
    // }); 
})