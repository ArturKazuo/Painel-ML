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
import error from '../../imgs/errorFF.png'
import loadingGreen from '../../imgs/Spinner310Green4.svg'
import loading from '../../imgs/Spinner470Black.svg'
import logoML from '../../imgs/logo-meulocker.svg'
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from 'react'
import { firebaseConfig } from '../../firebase.config.js'
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, addDoc, setDoc, deleteDoc } from 'firebase/firestore/lite';
import { useRouter } from 'next/navigation'
// import Router  from 'next/router';
import NavBar from '../components/navBar/page.js'
import ConsoleMonaco from '../components/consoleMonaco/page.js'
import loadingSVG from '../../imgs/oval-anim-dark.svg'
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faCircleStop
} from "@fortawesome/free-solid-svg-icons";

  
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let count = 1

const sg = Space_Grotesk({ subsets: ['latin'], display: 'swap', adjustFontFallback: false })

export async function generateStaticParams (e) {



    console.log(e)

  
    return [{ id: e },  { image: image }]
}

export default function mainPage(params) {

    const { push } = useRouter();

    // let flagConnect = false

    const checkUser = async () => {
      const users = (await getDocs(collection(db, 'painelUsers'))).docs.map(doc => doc.data())
      const userActual = window.sessionStorage.getItem('user')

      console.log(users)

      let flagAdmin = false
      let flagUser = false
      
      users.forEach(async (user) => {
          // console.log(user)
          console.log(user.email)
          if(user.email === userActual){
              if(user.papel == 'admin'){
                flagAdmin = true
              }
              flagUser = true
          } 

      })

      if(!flagUser){
          push('/pages/loginPage')
      }
      if(flagAdmin){
        document.getElementById('addButtonDiv').innerHTML = `
            <a href="/pages/addSession" prefetch={true} class="addButton" id="addButtonDiv"><p class=${sg.className} >Criar sessão</p></a>
            <a href="/pages/cadastroPage" prefetch={true} class="addButton" id="addButtonDivAccount"><p class=${sg.className} >Adicionar Usuário</p></a>
            <a href="/pages/removeAccountPage" prefetch={true} class="addButton" id="addButtonDivAccount"><p class=${sg.className} >Procurar Usuário</p></a>
        `
      }
    }   

    const pulseCheckImg = async (id) => {
      try {
        // console.log('alou')
        if(document.getElementById(`checkBox${id}`).checked){
          console.log(true)
        } else {
          console.log('alou')
          document.getElementById(`botCardImg${id}`).childNodes[0].src = `http://localhost:3978/getImage?image=${id}&date=${Date.now()}`
          try {
            await fetch(`http://localhost:3978/connectedToAPI?id=${id}`)
          } catch (error) {
            console.log("error: ", error)
          }
        }

      } catch (error) {
          console.log("error: ", error)
      }
      await setTimeout(async () => {
        // console.log('alou2')
        if(document.getElementById(`checkBox${id}`)?.checked != undefined){
          // console.log("id: ", id)
          await pulseCheckImg(id);
        }
      }, 2000);
    }

    const conectar = async (e) => {

        console.log(e)
        // flagConnect = true;
        document.getElementById(`checkBox${e.target.id}`).checked = true

        // loadPage()
        
        // console.log(loading)
        document.getElementById(`botCardImg${e.target.id}`).innerHTML = `<Image src="${loading.src}" width={500} height={500} alt="Picture of the author"/> `

        // generateStaticParams(e.target.id)

        let time4 = setTimeout(async () => {
          document.getElementById(`botCardImg${e.target.id}`).innerHTML = `<Image src="http://localhost:3978/getImage?image=${e.target.id}" width={500} height={500} alt="Picture of the author" /> `
          // flagConnect = false
          document.getElementById(`checkBox${e.target.id}`).checked = false
          pulseCheckImg(e.target.id)
        }, 30000);

        try {
            await fetch(`http://localhost:3978/startSessions?id=${e.target.id}&name=${window.sessionStorage.getItem('user')}`)
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
              // push('/pages/mainPage')
              stopLoadPage()
            })

        } 
    
        // document.getElementById(`botCardImg${e.target.id}`).innerHTML = `<img src="${loading.src}" width={500} height={500} alt="Picture of the author"/> `
    }

    const backPage = async (e) => {
      console.log(e)
      document.getElementById(`botCardDiv${e.target.id}`).classList.toggle('flipped')
      document.getElementById(`${e.target.id}`).classList.toggle('svgFlipped')
      document.getElementById(`divSvg${e.target.id}`).classList.toggle('divSvgFlipped')
    }

    const frontPage = async (e) => {
      
    }

    const toggleFileInput = async (e) => {
      // document.getElementById(`${e.target.id}`).classList.toggle('receivedFile')
      console.log('foi', e)
      loadPage()
      await fetch(`http://localhost:3978/getFile?file=${e.target.classList[2]}&type=${e.target.id.replace(`${e.target.classList[2]}`, '')}`).then( async (codeSS) => {  
            let code = await codeSS.json()
            // console.log("code: ", code)
            // flagConnect = true;
            // push(`/pages/components/consoleMonaco?name=${e.target.classList[2]}&type=${e.target.id.replace(`${e.target.classList[2]}`, '')}`)
            push(`/pages/components/consoleMonaco?file=${encodeURI(code)}&name=${e.target.classList[2]}&type=${e.target.id.replace(`${e.target.classList[2]}`, '')}`)

            // document.getElementById('monacoEditor').editor.setValue(code)
        })
      // document.getElementById(`botCardBack${e.target.id}`).innerHTML = `${ConsoleMonaco()}`
    }

    const sendFilePlease = async (formData) => {
      await fetch(`http://localhost:3978/changeFiles`, {
        method: "POST",
        // headers: {'Content-Type': ' application/json'},
        headers: {'Content-Type': 'multipart/form-data'},
        // body: JSON.stringify(files)
        body: formData      
      })
    }

    const sendFile = async (e) => {
      let indexFiles = document.getElementById(`indexFile${e.target.id.replace('addFile', '')}`).files[0]
      let sessionFiles = document.getElementById(`sessionFile${e.target.id.replace('addFile', '')}`).files[0]
      let botFiles = document.getElementById(`botFile${e.target.id.replace('addFile', '')}`).files[0]
      let dialogFiles = document.getElementById(`dialogFile${e.target.id.replace('addFile', '')}`).files[0]
    
      console.log(indexFiles)

      const files = {
        index: indexFiles,
        session: sessionFiles,
        bot: botFiles,
        dialog: dialogFiles
      }

      console.log(files)

      let formData = new FormData();
      formData.append('file', indexFiles);

      sendFilePlease(formData)
    }
    
    const loadPage = async () => {
        // console.log(loading)
        document.getElementById('mainID').innerHTML = document.getElementById('mainID').innerHTML + `<div class=mainLoad ><Image src="${loadingGreen.src}" width={500} height={500} alt="Picture of the author"/></div>`
    }

    const stopLoadPage = async () => {
      document.querySelector('.mainLoad').remove()
    }

    const myFunc = async () => {

      if(window.sessionStorage.getItem('user') == undefined || window.sessionStorage.getItem('user') == null || window.sessionStorage.getItem('user') == ""){
        await push('/pages/loginPage')
      } 

      checkUser()
      
      document.getElementById(`addButtonDiv`).addEventListener("click", loadPage, false);

      const sessions = (await getDocs(collection(db, `Sessions/${window.sessionStorage.getItem('user')}/sessions`))).docs.map(doc => doc.data())
  
      console.log(sessions)
  
      let text = ``;

      loadPage();

      // flagConnect = false;

      await fetch(`http://localhost:3978/connectedToAPI?id=${window.sessionStorage.getItem('user')}`)

      sessions.forEach(session => {
  
        if(count == 1 || count % 3 == 1){
          text += `<div class="col-2"></div>`
        }

        // console.log(faMagnifyingGlass)

        text += `
        <div class='outsideBotCard col-2'> 
          <div class='botCardDiv'  id="botCardDivsvg${session.sessionkey}"> 
            <div class='botCard front'>
              <div class='botCardImg' id=botCardImg${session.sessionkey}>
                <img src="http://localhost:3978/getImage?image=${session.sessionkey}" width={500} height={500} alt="error"/> 
              </div>
              <button  class=marginButtonBotCard ><p class='${sg.className}'>Nome: ${session.session}</p></button>
              <button  class=marginButtonBotCard ><p class='${sg.className}'>Chave: ${session.sessionkey}</p></button>
              <button id=conectarSession${session.sessionkey} class=marginButtonBotCard ><p class='${sg.className} addButton' id=${session.sessionkey}>Conectar</p></button>
              <button id=desconectarSession${session.sessionkey} class=marginButtonBotCard ><p class='${sg.className} addButton desconectarButton' id=${session.sessionkey}>Desconectar</p></button>
              <button id=deletarSession${session.sessionkey} class=marginButtonBotCard ><p class='${sg.className} addButton deleteButton' id=${session.sessionkey}>Excluir</p></button>
              <input style="display:none;" type="checkbox" id="checkBox${session.sessionkey}" value="flagConnect" >
            </div>
            <div class='botCard back' id="botCardBack${session.sessionkey}"> 

              <button id=indexFile${session.sessionkey} class="marginButtonBotCard fullSize" ><p class='${sg.className} addButton ${session.sessionkey}' id=indexFile${session.sessionkey}>Editar arquivo index</p></button>

              <button id=sessionFile${session.sessionkey} class="marginButtonBotCard fullSize" ><p class='${sg.className} addButton ${session.sessionkey}' id=sessionFile${session.sessionkey}>Editar arquivo de session</p></button>

              <button id=botFile${session.sessionkey} class="marginButtonBotCard fullSize " ><p class='${sg.className} addButton ${session.sessionkey}' id=botFile${session.sessionkey}>Editar arquivo de Bot</p></button>

              <button id=dialogFile${session.sessionkey} class="marginButtonBotCard fullSize " ><p class='${sg.className} addButton ${session.sessionkey}' id=dialogFile${session.sessionkey}>Editar arquivo de dialogo</p></button>

              <button id=envFile${session.sessionkey} class="marginButtonBotCard fullSize " ><p class='${sg.className} addButton ${session.sessionkey}' id=envFile${session.sessionkey}>Editar arquivo de Portas (ENV)</p></button>

              <button style="color: #eeeeee !important;" class="addButton removeMargin" id="addFile${session.sessionkey}" >Enviar</button>
              
            </div>
          </div>

          <div class="divSvg" id="divSvgsvg${session.sessionkey}">
          <svg id="svg${session.sessionkey}" xmlns="http://www.w3.org/2000/svg" height="3em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path id="svg${session.sessionkey}" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
          </div>
        </div>
        `

                    // <svg id="svg${session.sessionkey}" xmlns="http://www.w3.org/2000/svg" height="3em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path id="svg${session.sessionkey}" d="M307 34.8c-11.5 5.1-19 16.6-19 29.2v64H176C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96h96v64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z"/></svg>


        if(count != 3 && count % 3 != 0 && count != sessions.length){
          text += `<div class="col-1"></div>`
        }
  
        if(count == 3 || count % 3 == 0 || count == sessions.length){
          text += `<div class="col-2"></div>`
        }
  
        count++;
  
      });

      stopLoadPage()

      count = 1
  
      document.getElementById('botCards').innerHTML = text
  
      sessions.forEach(session => {
        console.log(session)
        document.getElementById(`conectarSession${session.sessionkey}`).addEventListener("click", conectar, false);
        document.getElementById(`desconectarSession${session.sessionkey}`).addEventListener("click", desconectar, false);
        document.getElementById(`deletarSession${session.sessionkey}`).addEventListener("click", deletar, false);

        document.getElementById(`svg${session.sessionkey}`).addEventListener("click", backPage, false);

        document.getElementById(`indexFile${session.sessionkey}`).addEventListener("click", toggleFileInput, false);
        document.getElementById(`sessionFile${session.sessionkey}`).addEventListener("click", toggleFileInput, false);
        document.getElementById(`botFile${session.sessionkey}`).addEventListener("click", toggleFileInput, false);
        document.getElementById(`dialogFile${session.sessionkey}`).addEventListener("click", toggleFileInput, false);
        document.getElementById(`envFile${session.sessionkey}`).addEventListener("click", toggleFileInput, false);
        document.getElementById(`addFile${session.sessionkey}`).addEventListener("click", sendFile, false);
        pulseCheckImg(session.sessionkey)
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
          <script src="https://kit.fontawesome.com/0cc1b7e656.js" crossorigin="anonymous"></script>
  
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
  
            <div className={"addButtonDiv"} id={"addButtonDiv"}> 
              <Link href="/pages/addSession" prefetch={true} className={"addButton"} id={"addButtonDiv"}><p className={sg.className}>Criar sessão</p></Link>
            </div>
  
            <div className={"botCards"} id={"botCards"}>
              
            </div>

          </div>
  
        </main>
  
      </>
    )
  }
  