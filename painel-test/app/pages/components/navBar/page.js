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
import error from '../../../imgs/errorFF.jpg'
import loading from '../../../imgs/giphy.gif'
import logoML from '../../../imgs/logo-meulocker.svg'
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

    const gotoHomePage = () => {
        push('/pages/mainPage')
    }

    const myFunc = () => {
        document.getElementById('imgML').addEventListener('click', gotoHomePage)
    }

    useEffect(() => {
        myFunc()
    })

    return (
        <nav className={sg.className, "navbar"}>
            <div className={"imgMLDiv flexRow"}>
                <Image src={logoML} alt="" id={"imgML"} />
            </div>
            <Link href="/pages/mainPage" ><p className={sg.className, "navLink"}>Home</p><div className={"divNavInside"}></div></Link>
            <Link href="https://meulocker.com.br/" target={"blank"} ><p className={sg.className, "navLink"}>Conheça a empresa</p><div className={"divNavInside"}></div></Link>
            <Link href="/pages/conta" ><p className={sg.className, "navLink"}>Conta</p><div className={"divNavInside"}></div></Link>
        </nav>
    )
}