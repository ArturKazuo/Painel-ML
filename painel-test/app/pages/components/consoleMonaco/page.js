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
import '../../../monaco.css'
import Editor from "@monaco-editor/react";
import {  useRouter , useSearchParams } from 'next/navigation'

const sg = Space_Grotesk({ subsets: ['latin'], display: 'swap', adjustFontFallback: false })

export default function consoleMonaco(params) {

    const { push } = useRouter();

    const loadPage = async () => {
        document.querySelector('.outsideDiv').innerHTML += `<div class=mainLoad ><img src="${loading.src}" /></div>`
    }

    const stopLoadPage = async () => {
      document.querySelector('.mainLoad').classList.add('noDisplay')
    }

    const searchParams = useSearchParams()

    const name = searchParams.get('name')
    const type = searchParams.get('type')
    const file = searchParams.get('file')

    let monacoValue = file

    const voltarMainPage = () => {
        loadPage()
        push('/pages/mainPage')
    }

    const salvarDados = async () => {
        // console.log("\n \n\nMONACO VALUE \n \n \n: ", monacoValue)

        if(window.confirm('Deseja salvar esse arquivo? Essa ação não pode ser revertida.')){
            let data = {
                code: monacoValue
            }
    
            await fetch(`http://localhost:3978/changeFile?name=${name}&type=${type}`, {
                method: "post",
                mode: 'cors',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)      
            }).then(async (response) => {
                console.log('response: ', await response.json())
                // setTimeout(async () => {
                //     // push('/pages/mainPage')
                // }, 5000);
                window.alert('Arquivo salvo com sucesso!')
                // document.querySelector('.outsideDiv').innerHTML = `<div class=mainLoad ><p class="${sg.className}" >Sucesso ao salvar</p>></div>`
            })
        }
    } 

    const myFunc = async () => {
        document.getElementById('atualizarFile').addEventListener('click', salvarDados)
        document.getElementById('voltarFile').addEventListener('click', voltarMainPage)
    }

    useEffect(() => {
        myFunc()
    })

    return (
        <div className="outsideDiv">
            <Editor
                id="monacoEditor"
                height="100%"
                language="javascript"
                theme="vs-dark"
                value={file}
                onChange={(value) => {
                    // console.log(value)
                    monacoValue = value
                }}
            />
            <div className={"insideDiv"}>
                <div className={"monacoButtonDiv flexRow"} >
                    <button id={"voltarFile"} className={"marginButtonBotCard"} ><p className={`${sg.className} addButton`}>Voltar</p></button>
                    <button id={"atualizarFile"} className={"marginButtonBotCard"} ><p className={`${sg.className} addButton`}>Salvar</p></button>
                </div>
            </div>
        </div>

        // beforeMount={async (monaco) => {
        //     // let codeF = await myFunc()
        //     // monaco.setValue(codeF)
        //     console.log("aiwajdiao", monaco)
        //     // monaco.setValue('code')
        //     monaco.value = 'code'
        // }}
    )

}