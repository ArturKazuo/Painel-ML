// 'use client'

import NextImage from 'next/image'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import Script from 'next/script'
import { Space_Grotesk } from 'next/font/google'
import alo from './imgs/alo.png'
import qrcode from './imgs/qrcode.png'
import wpp from './imgs/wpp.png'
import error from './imgs/errorFF.jpg'
import loading from './imgs/giphy.gif'
import logoML from './imgs/logo-meulocker.svg'
import "bootstrap/dist/css/bootstrap.min.css";
// import React, { useState, useEffect } from 'react'
import { firebaseConfig } from './firebase.config.js'
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, addDoc, setDoc, deleteDoc } from 'firebase/firestore/lite';
// import fs from 'fs'
// import wppconnect from '@wppconnect-team/wppconnect';
import MainPage from './pages/mainPage/page.js'
import CadastroPage from './pages/cadastroPage/page.js'
import LoginPage from './pages/loginPage/page.js'
// import { getServerSideProps } from './pages/addSession/page.js';



export default function Home(params) {

  

  return (
    <>
      
      {/* <MainPage /> */}

      <LoginPage />

    </>
  )
}
