'use client'

import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import alo from '../../imgs/alo.png'
import wpp from '../../imgs/wpp.png'
import error from '../../imgs/errorFF.png'
import loading from '../../imgs/Spinner310.svg'
import loadingGreen from '../../imgs/Spinner310Green4.svg'
import logoML from '../../imgs/logo-meulocker.svg'
import { Space_Grotesk } from 'next/font/google'
import "../../addSession.css"
import React, { useState, useEffect } from 'react'
import { firebaseConfig } from '../../firebase.config.js'
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, setDoc, doc } from 'firebase/firestore/lite';
import { useRouter } from 'next/navigation';
import NavBar from '../components/navBar/page.js'

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sg = Space_Grotesk({ subsets: ['latin'], display: 'swap', adjustFontFallback: false })

export default function Home() {

    const { push } = useRouter();

    const checkUser = async () => {
        const users = (await getDocs(collection(db, 'painelUsers'))).docs.map(doc => doc.data())
        const userActual = window.sessionStorage.getItem('user')

        console.log(users)

        let flagUser = false
        
        users.forEach(async (user) => {
            // console.log(user)
            console.log(user.email)
            if(user.email === userActual){
                flagUser = true
            } 

        })

        if(!flagUser){
            push('/pages/loginPage')
        }
    }   

    const loadPage = async () => {
        document.getElementById('mainID').innerHTML = document.getElementById('mainID').innerHTML + `<div class=mainLoad ><img src="${loadingGreen.src}" /></div>`
    }

    const stopLoadPage = async () => {
        document.querySelector('.mainLoad').remove()
      }

    const addAnotherSession = () => {
        document.getElementById('addSessionDiv').innerHTML = `
            <p class=sg.className>Chave da sessão:</p>
            <div class="divTextarea">
                <input id="chave" class=""></input>
                <div class="divTextareaInside"></div>
            </div>
            <p class=sg.className>Nome da sessão:</p>
            <div class="divTextarea">
                <input id="nome" class=""></input>
                <div class="divTextareaInside"></div>
            </div>
        `

        document.getElementById('addSessionButton').innerHTML = `
            <button class="addButton" id="addSessionButtonButton"><p class=sg.className>Adicionar sessão</p></button>
        `

        document.getElementById('addSessionButtonButton').addEventListener("click", addSession);
    }

    const addSession = async () => {

        const nome = document.getElementById('nome').value 
        // const aparelho = document.getElementById('aparelho').value 
        // const port = document.getElementById('port').value 
        let chave = document.getElementById('chave').value
        // const token = document.getElementById('token').value  
        let flagChave = false

        chave = chave.replaceAll(' ', '')

        loadPage()

        if(chave == null || chave == undefined || chave == ""){
            document.getElementById('addSessionDiv').innerHTML = `
                <p class="sg.className chaveErro" >Insira uma chave de sessão.</p>
            `

            document.getElementById('addSessionButton').innerHTML = `
                <div class=multipleButtons>
                    <a href="/pages/addSession" class="addButton"><p class=sg.className>Tentar novamente</p></a>
                    <a href="/pages/mainPage" class="addButton"><p class=sg.className>Voltar para a página inicial</p></a>
                </div>
            `

            stopLoadPage()

            return
        }

        if((nome == undefined || nome == "") || (chave == undefined || chave == "")){
            document.getElementById('addSessionDiv').innerHTML = `
                <p class="sg.className chaveErro" >Preencha todos os campos.</p>
            `

            document.getElementById('addSessionButton').innerHTML = `
                <div class=multipleButtons>
                    <a href="/pages/addSession" class="addButton"><p class=sg.className>Tentar novamente</p></a>
                    <a href="/pages/mainPage" class="addButton"><p class=sg.className>Voltar para a página inicial</p></a>
                </div>
            `

            stopLoadPage()

            return 
        }

        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        console.log(db)

        const sessions = (await getDocs(collection(db, `Sessions/${window.sessionStorage.getItem('user')}/sessions`))).docs.map(doc => doc.data())

        console.log(sessions)

        sessions.forEach(session => {
            console.log(session)
            if(session.sessionkey == chave){

                document.getElementById('addSessionDiv').innerHTML = `
                    <p class="sg.className chaveErro" >Esta chave de sessão já está sendo utilizada, insira outra.</p>
                `

                document.getElementById('addSessionDiv').style.border = "2px solid #d20808"

                document.getElementById('addSessionButton').innerHTML = `
                    <div class=multipleButtons>
                        <a href="/pages/addSession" class="addButton"><p class=sg.className>Tentar novamente</p></a>
                        <a href="/pages/mainPage" class="addButton"><p class=sg.className>Voltar para a página inicial</p></a>
                    </div>
                `

                flagChave = true

                stopLoadPage()

                return 
            }

        })

        if(flagChave){
            return
        }

        const data = {
            Engine: '2',
            WABrowserId: "MultiDevice",
            WASecretBundle: "MultiDevice",
            WAToken1: "MultiDevice",
            WAToken2: "MultiDevice",
            session: nome,
            sessionkey: chave,
            PORT: getRandomInt(3000, 3300),
            APIPORT: getRandomInt(61000, 62000),
            APINAME: chave,
            wh_connect: "",
            wh_message: "",
            wh_qrcode: "",
            wh_status: "",
        }

        const docRefID = doc(db, `Sessions/${window.sessionStorage.getItem('user')}/sessions`, chave)

        const docRef = await setDoc(docRefID, data);

        // await fetch(`http://localhost:3978/copyFiles?id=${chave}`).then(async () => {

        // })

        await fetch(`http://localhost:3978/copyFiles?id=${chave}`, {
                method: "post",
                mode: 'cors',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)      
            }).then(async (response) => {
                console.log('response: ', await response.json())
                // setTimeout(async () => {
                //     // push('/pages/mainPage')
                // }, 5000);
                // window.alert('Arquivo salvo com sucesso!')
                // document.querySelector('.outsideDiv').innerHTML = `<div class=mainLoad ><p class="${sg.className}" >Sucesso ao salvar</p>></div>`
            })

        console.log("Document written with ID: ", docRef);

        document.getElementById('addSessionDiv').innerHTML = `
            <p class="sg.className sucesso" >Sessão adicionada com sucesso!</p>
        `

        document.getElementById('addSessionButton').innerHTML = `
            <div class=multipleButtons>
                <button class="addButton" id="addButtonAfter"><p class=sg.className>Adicionar outra sessão</p></button>
                <a href="/pages/mainPage" class="addButton"><p class=sg.className>Voltar</p></a>
            </div>
        `

        document.getElementById('addButtonAfter').addEventListener("click", addAnotherSession);

        stopLoadPage()

    }


    const myFunc = () => {
        if(window.sessionStorage.getItem('user') == undefined || window.sessionStorage.getItem('user') == null || window.sessionStorage.getItem('user') == ""){
            push('/pages/loginPage')
          } 
        checkUser()
        document.getElementById('addSessionButtonButton').addEventListener("click", addSession);
    }
    
    useEffect(() => {

        myFunc();

    })


  return (
    <>
    <Head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500&display=swap');
      </style>
    </Head>
    <main className={sg.className, ""} id={"mainID"}>

    {/* <nav className={sg.className, "navbar"}>
          <Image src={logoML} alt=""/>
          <Link href="/pages/mainPage" ><p className={sg.className, "navLink"}>Home</p><div className={"divNavInside"}></div></Link>
          <Link href="/pages/about" ><p className={sg.className, "navLink"}>Outro</p><div className={"divNavInside"}></div></Link>
          <Link href="/pages/sobre" ><p className={sg.className, "navLink"}>Sobre</p><div className={"divNavInside"}></div></Link>
        </nav> */}

        <NavBar />

      <div className={""}>

        <div className={"addSessionMainDiv"}>
            <div className={"addSessionDiv"} id={"addSessionDiv"}>
                {/* <p  className={sg.className}>Servidor e porta:</p>
                <div className={"divTextarea"}>
                    <input id={"port"} className={""}></input>
                    <div className={"divTextareaInside"}></div>
                </div> */}
                <p className={sg.className}>Chave da sessão:</p>
                <div className={"divTextarea"}>
                    <input id={"chave"} className={""}></input>
                    <div className={"divTextareaInside"}></div>
                </div>
                <p className={sg.className}>Nome da sessão:</p>
                <div className={"divTextarea"}>
                    <input id={"nome"} className={""}></input>
                    <div className={"divTextareaInside"}></div>
                </div>
                {/* <p className={sg.className}>Aparelho/Dispositivo:</p>
                <div className={"divTextarea"}>
                    <input id={"aparelho"} className={""}></input>
                    <div className={"divTextareaInside"}></div>
                </div>
                <p className={sg.className}>Token:</p>
                <div className={"divTextarea"}>
                    <input id={"token"} className={""}></input>
                    <div className={"divTextareaInside"}></div>
                </div> */}
            </div>
        </div>

        <div className={"addSessionButton"} id={"addSessionButton"}> 
            <div className={"multipleButtons"}>
                <button className={"addButton"} id={"addSessionButtonButton"}><p className={sg.className}>Adicionar sessão</p></button>
                <Link href={"/pages/mainPage"} className={"addButton"}><p className={sg.className}>Voltar</p></Link>
            </div>
        </div>

      </div>

    </main>
    </>
  )
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }