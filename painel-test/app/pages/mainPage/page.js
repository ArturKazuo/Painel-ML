'use client'

import dynamic from "next/dynamic";
import NextImage from 'next/image'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import Script from 'next/script'
import { Space_Grotesk } from 'next/font/google'
import alo from '../../imgs/alo.png'
import wpp from '../../imgs/wpp.png'
import error from '../../imgs/errorFF.jpg'
import loading from '../../imgs/giphy.gif'
import logoML from '../../imgs/logo-meulocker.svg'
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from 'react'
import { firebaseConfig } from '../../firebase.config.js'
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, addDoc, setDoc, deleteDoc } from 'firebase/firestore/lite';
import { useRouter } from 'next/navigation';
import NavBar from '../components/navBar/page.js'
import loadingSVG from '../../imgs/oval-anim-dark.svg'

  
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let count = 1

const sg = Space_Grotesk({ subsets: ['latin'], display: 'swap', adjustFontFallback: false })

export async function generateStaticParams (e) {



    console.log(e)

    // const image = await import(`../../../../WppConnect/qrCodes/${e}.png`)

    // try {
    //     await fetch(`http://localhost:3979/generateQRCode?id=${e}`, {
    //         method: "POST",
    //         headers: {
    //             'Content-Type': "application/json"
    //         },
    //     }).then(async (response) => {
    //         console.log(await response.json())
    //     });
    // } catch (error) {
    //     console.log("error: ", error)
    // }
  
    return [{ id: e },  { image: image }]
}

export default function mainPage(params) {

    const { push } = useRouter();

    const conectar = async (e) => {
        console.log(e)
        console.log(loading)
        document.getElementById(`botCardImg${e.target.id}`).innerHTML = `<img src="${loading.src}" width={500} height={500} alt="Picture of the author"/> `

        // generateStaticParams(e.target.id)

        let time4 = setTimeout(async () => {
          document.getElementById(`botCardImg${e.target.id}`).innerHTML = `<Image src="http://localhost:3978/getImage?image=${e.target.id}" width={500} height={500} alt="Picture of the author" /> `
        }, 30000);

        try {
            await fetch(`http://localhost:3978/startSessions?id=${e.target.id}`)
        } catch (error) {
            console.log("error: ", error)
        }


    }
  
    const desconectar = async (e) => {
        console.log(e)
        try {

          document.getElementById(`botCardImg${e.target.id}`).innerHTML = `<img src="${loading.src}" width={500} height={500} alt="Picture of the author"/> `

          await fetch(`http://localhost:3978/disconnectSessions?id=${e.target.id}`).then(async (response) => {
            document.getElementById(`botCardImg${e.target.id}`).innerHTML = `<img src="${error.src}" width={500} height={500} alt="Picture of the author"/> `
          });

        } catch (error) {
            console.log("error: ", error)
        }
    }
  
    const deletar = async (e) => {
        console.log(e.target.id)
    
        if(window.confirm("Deseja excluir essa sessão?")){
            await deleteDoc(doc(db, `Sessions/${window.sessionStorage.getItem('user')}/sessions`, e.target.id))

            loadPage()

            await fetch(`http://localhost:3978/deleteFiles?id=${e.target.id}`).then(async () => {
              await myFunc();
              stopLoadPage()
            })

        } 
    
        // document.getElementById(`botCardImg${e.target.id}`).innerHTML = `<img src="${loading.src}" width={500} height={500} alt="Picture of the author"/> `
    }
    
    const loadPage = async () => {
        document.getElementById('mainID').innerHTML = document.getElementById('mainID').innerHTML + `<div class=mainLoad ><img src="${loading.src}" /></div>`
    }

    const stopLoadPage = async () => {
      document.querySelector('.mainLoad').classList.add('noDisplay')
    }

    const myFunc = async () => {

      if(window.sessionStorage.getItem('user') == undefined || window.sessionStorage.getItem('user') == null || window.sessionStorage.getItem('user') == ""){
        await push('/pages/loginPage')
      } 

      document.getElementById(`addButtonDiv`).addEventListener("click", loadPage, false);

      const sessions = (await getDocs(collection(db, `Sessions/${window.sessionStorage.getItem('user')}/sessions`))).docs.map(doc => doc.data())
  
      console.log(sessions)
  
      let text = ``;
  
      sessions.forEach(session => {
  
        if(count == 1 || count % 3 == 1){
          text += `<div class="col-2"></div>`
        }

        text += `
        <div class='botCard col-2'> 
            <div class='botCardImg' id=botCardImg${session.sessionkey}>
              <img src="${wpp.src}" width={500} height={500} alt="Picture of the author"/> 
            </div>
            <button  class=marginButtonBotCard ><p class='${sg.className}'>Nome: ${session.session}</p></button>
            <button  class=marginButtonBotCard ><p class='${sg.className}'>Chave: ${session.sessionkey}</p></button>
            <button id=conectarSession${session.sessionkey} class=marginButtonBotCard ><p class='${sg.className} addButton' id=${session.sessionkey}>Conectar</p></button>
            <button id=desconectarSession${session.sessionkey} class=marginButtonBotCard ><p class='${sg.className} addButton desconectarButton' id=${session.sessionkey}>Desconectar</p></button>
            <button id=deletarSession${session.sessionkey} class=marginButtonBotCard ><p class='${sg.className} addButton deleteButton' id=${session.sessionkey}>Excluir</p></button>
        </div>
        `

        if(count != 3 && count % 3 != 0 && count != sessions.length){
          text += `<div class="col-1"></div>`
        }
  
        if(count == 3 || count % 3 == 0 || count == sessions.length){
          text += `<div class="col-2"></div>`
        }
  
        count++;
  
      });

      count = 1
  
      document.getElementById('botCards').innerHTML = text
  
      sessions.forEach(session => {
        console.log(session)
        document.getElementById(`conectarSession${session.sessionkey}`).addEventListener("click", conectar, false);
        document.getElementById(`desconectarSession${session.sessionkey}`).addEventListener("click", desconectar, false);
        document.getElementById(`deletarSession${session.sessionkey}`).addEventListener("click", deletar, false);
      })
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
          
          <Script type="text/javascript" src="/scripts/mainPage.js"/>
  
        </Head>
        {/* className="mainTitle fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30" */}
        <main className={sg.className, ""} id={"mainID"}>
          {/* <nav className={sg.className, "navbar"}>
            <Image src={logoML} alt=""/>
            <Link href="/" ><p className={sg.className, "navLink"}>Home</p><div className={"divNavInside"}></div></Link>
            <Link href="/pages/about" ><p className={sg.className, "navLink"}>Outro</p><div className={"divNavInside"}></div></Link>
            <Link href="/pages/sobre" ><p className={sg.className, "navLink"}>Sobre</p><div className={"divNavInside"}></div></Link>
          </nav> */}

          <NavBar />
  
          <div className={""}>
  
            <div className={"addButtonDiv"} > 
              <Link href="/pages/addSession" prefetch={true} className={"addButton"} id={"addButtonDiv"}><p className={sg.className}>Criar sessão</p></Link>
            </div>
  
            <div className={"botCards"} id={"botCards"}>
              
            </div>
  
          </div>
  
        </main>
  
      </>
    )
  }
  