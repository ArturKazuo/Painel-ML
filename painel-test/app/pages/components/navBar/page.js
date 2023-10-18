'use client'

import dynamic from "next/dynamic";
import NextImage from 'next/image'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import Script from 'next/script'
import { Space_Grotesk } from 'next/font/google'
import alo from '../../../imgs/alo.png'
import wpp from '../../../imgs/wpp.png'
import error from '../../../imgs/errorFF.png'
import loading from '../../../imgs/giphy.gif'
import logoML from '../../../imgs/logo-meulocker.svg'
import loadingGreen from '../../../imgs/Spinner310Green4.svg'
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from 'react'
import { firebaseConfig } from '../../../firebase.config.js'
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, addDoc, setDoc, deleteDoc } from 'firebase/firestore/lite';
import '../../../login.css'
import { useRouter } from 'next/navigation';

const sg = Space_Grotesk({ subsets: ['latin'], display: 'swap', adjustFontFallback: false })

export default function navBar(params) {

    const { push } = useRouter()

    const loadPage = async () => {
        console.log("\n\ndocuemtn:: \n\n", document)
        document.getElementById('mainID').innerHTML = document.getElementById('mainID').innerHTML + `<div class=mainLoad ><Image src="${loadingGreen.src}" width={500} height={500} alt="Picture of the author"/></div>`
    }

    const stopLoadPage = async () => {
      document.querySelector('.mainLoad').remove()
    }

    const gotoHomePage = () => {
        push('/pages/mainPage')
    }

    const myFunc = () => {
        document.getElementById('imgML').addEventListener('click', gotoHomePage)
        document.getElementById(`home`).addEventListener("click", loadPage, false);
        document.getElementById(`conta`).addEventListener("click", loadPage, false);
        document.getElementById(`ajuda`).addEventListener("click", loadPage, false);
    }

    useEffect(() => {
        myFunc()
    })

    return (
        <nav className={sg.className, "navbar"}>
            <div className={"imgMLDiv flexRow"}>
                <Image src={logoML} alt="" id={"imgML"} />
            </div>
            <Link href="/pages/mainPage" id={"home"} ><p className={sg.className, "navLink"}>Home</p><div className={"divNavInside"}></div></Link>
            <Link href="/pages/conta" id={"conta"} ><p className={sg.className, "navLink"}>Conta</p><div className={"divNavInside"}></div></Link>
            <Link href="/pages/ajuda" id={"ajuda"} ><p className={sg.className, "navLink"}>Ajuda</p><div className={"divNavInside"}></div></Link>
            <Link href="https://meulocker.com.br/" target={"blank"} ><p className={sg.className, "navLink"}>Conheça a empresa</p><div className={"divNavInside"}></div></Link>
        </nav>
    )
}