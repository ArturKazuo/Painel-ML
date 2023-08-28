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
import MainPage from '../mainPage/page.js'
import '../../login.css'
import { useRouter } from 'next/navigation';
import NavBar from '../components/navBar/page.js'
import bgML from '../../imgs/banner_top_home11.jpg'

  
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sg = Space_Grotesk({ subsets: ['latin'], display: 'swap', adjustFontFallback: false })

export default function loginPage(params) {

    const { push } = useRouter();

    const loadPage = async () => {
      document.getElementById('mainID').innerHTML = document.getElementById('mainID').innerHTML + `<div class=mainLoad ><img src="${loading.src}" /></div>`
    }

    const login = async () => {
      
      let email = document.getElementById('email').value
      let senha = document.getElementById('pass').value
      let flagChave = false

      const users = (await getDocs(collection(db, 'painelUsers'))).docs.map(doc => doc.data())

      console.log(users)

      users.forEach(user => {
        console.log(user)

        if(user.email === email){

          console.log('entrou')

          if(user.senha === senha){

            window.sessionStorage.setItem("user", user.email)

            flagChave = true

            loadPage()

            push('/pages/mainPage')
          } else {
            document.getElementById('loginAlerts').innerHTML = `
              <p class="${sg.className} white" >Senha incorreta, insira outra.</p>
            `

            document.getElementById('loginAlerts').classList.add('wrongPassAlerts')

            flagChave = true

            
          }

        } 

      })

      if(flagChave){
        console.log('flag')
        return
      } else {
        document.getElementById('loginAlerts').innerHTML = `
          <p class="${sg.className} white" >Este email não esta vinculado a nenhuma conta, deseja <a href="/pages/cadastroPage" style="color: blue !important; ">criar uma conta</a>?</p>
        `

        document.getElementById('loginAlerts').classList.add('wrongPassAlerts')

        flagChave = true

        return 
      }
    
    }

    const myFunc = async () => {
      document.getElementById(`loginButtonButton`).addEventListener("click", login, false);
      document.getElementById(`createAccount`).addEventListener("click", loadPage, false);
      let ps = document.querySelectorAll('p')

      ps.forEach(p => {
        p.classList.add('white')
      })

      let h2s = document.querySelectorAll('h2')

      h2s.forEach(h2 => {
        h2.classList.add('white')
      })

      if(window.sessionStorage.getItem('user')){
        push('/pages/mainPage')
      } 
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

          <NavBar />

          {/* <nav className={sg.className, "navbar"}>
            <Image src={logoML} alt=""/>
            <Link href="/" ><p className={sg.className, "navLink"}>Home</p><div className={"divNavInside"}></div></Link>
            <Link href="/pages/about" ><p className={sg.className, "navLink"}>Outro</p><div className={"divNavInside"}></div></Link>
            <Link href="/pages/sobre" ><p className={sg.className, "navLink"}>Sobre</p><div className={"divNavInside"}></div></Link>
          </nav> */}

          <Image src={bgML.src} alt="" className={"bgImg"} fill />  
  
        <div className={"mainDiv"} >

          <div className={"loginHeader"}> 
              <div>
                <h2 className={sg.className}>Login</h2>
                <div className={"loginHeaderInside"} ></div>
              </div>
            </div>
  
  
            <div className={"loginMainDiv"}>
                <div className={"loginDiv"} id={"loginDiv"}>
                    <p className={sg.className}>Email:</p>
                    <div className={"divTextarea"}>
                        <input id={"email"} className={""}></input>
                        <div className={"divTextareaInside"}></div>
                    </div>
                    <p className={sg.className}>Senha:</p>
                    <div className={"divTextarea"}>
                        <input id={"pass"} className={""}></input>
                        <div className={"divTextareaInside"}></div>
                    </div>
                </div>
            </div>

            
            <div className={"loginAlertsDiv"}> 
                <div className={"loginAlerts"} id={"loginAlerts"}> 

                </div>
            </div>

            <div className={"loginButton"} id={"loginButton"}> 
                <button className={"addButton"} id={"loginButtonButton"}><p className={sg.className}>Login</p></button>
            </div>

            <div className={"linkDivOutside"}> 
              <div className={"linkDiv"}> 
                  <Link href="/pages/cadastroPage" className={"linkDivA"} id={"createAccount"}>
                    <p className={sg.className, "navLink", "noShadowBox"}>Criar uma conta</p>
                    <div className={"linkDivInside"}>
                      <div className={"navLinkDivLeft"}></div>
                      <div className={"navLinkDivRight"}></div>
                    </div>  
                  </Link>
              </div>
            </div>
  
          </div>
  
        </main>
  
      </>
    )
  }
  