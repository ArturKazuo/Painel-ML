
import React from 'react'
import Head from 'next/head'
import Script from 'next/script'

// import fs from 'fs'
// import wppconnect from '@wppconnect-team/wppconnect';
// import { getServerSideProps } from './pages/addSession/page.js';

export async function generateStaticParams () {

  // const wppconnect = await import('@wppconnect-team/wppconnect')

  // wppconnect.create({
  //     session: e.target.id, //Pass the name of the client you want to start the bot
  //     catchQR: (base64Qrimg, asciiQR, attempts, urlCode) => {
  //     console.log('Number of attempts to read the qrcode: ', attempts);
  //     console.log('Terminal qrcode: ', asciiQR);
  //     console.log('base64 image string qrcode: ', base64Qrimg);
  //     console.log('urlCode (data-ref): ', urlCode);
  //     },
  //     statusFind: (statusSession, session) => {
  //     console.log('Status Session: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
  //     //Create session wss return "serverClose" case server for close
  //     console.log('Session name: ', session);
  //     },
  //     headless: true, // Headless chrome
  //     devtools: false, // Open devtools by default
  //     useChrome: true, // If false will use Chromium instance
  //     debug: false, // Opens a debug session
  //     logQR: true, // Logs QR automatically in terminal
  //     browserWS: '', // If u want to use browserWSEndpoint
  //     browserArgs: [''], // Parameters to be added into the chrome browser instance
  //     puppeteerOptions: {}, // Will be passed to puppeteer.launch
  //     disableWelcome: false, // Option to disable the welcoming message which appears in the beginning
  //     updatesLog: true, // Logs info updates automatically in terminal
  //     autoClose: 60000, // Automatically closes the wppconnect only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
  //     tokenStore: 'file', // Define how work with tokens, that can be a custom interface
  //     folderNameToken: './tokens', //folder name when saving tokens
  //     // BrowserSessionToken
  //     // To receive the client's token use the function await clinet.getSessionTokenBrowser()
  //     sessionToken: {
  //     WABrowserId: '"UnXjH....."',
  //     WASecretBundle: '{"key":"+i/nRgWJ....","encKey":"kGdMR5t....","macKey":"+i/nRgW...."}',
  //     WAToken1: '"0i8...."',
  //     WAToken2: '"1@lPpzwC...."',
  //     }
  // })
  // .then((client) => start(client))
  // .catch((error) => console.log(error));

  const response = await fetch('https://apicci.qira.com.br/v1/chatbot/condominio/locker?lockerId=0869bab1-f9fb-41bc-9d4e-c41131120c4a', {
    method: 'GET'
  });
  const data = await response.json();

  console.log("data", data)

  return [{id: 'alou'}]
}

export default function About(params) {

  // const agr = () => {
  //   console.log(params)
  // }

  function handleClick() {
    console.log(params)
  }

  return (
    <>
    {/* <button onClick={handleClick}>wdadwda</button> */}
    <div>about</div>
    </>
  )
}
