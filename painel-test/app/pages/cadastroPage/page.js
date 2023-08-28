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

export default function cadastroPage(params) {

    const { push } = useRouter();

    const loadPage = async () => {
      document.getElementById('mainID').innerHTML = document.getElementById('mainID').innerHTML + `<div class=mainLoad ><img src="${loading.src}" /></div>`
    }

    const checkPassword = async () => {
      let password = document.getElementById('pass').value
      let passCheck = document.getElementById('passCheck').value

      if(password !== passCheck){
        document.getElementById('passCheck').classList.add('wrongPass')
        document.getElementById('loginAlerts').innerHTML = `
          <p class="${sg.className} white">Erro na confirmação da senha, certifique-se de que está digitando a mesma senha.</p>
        `
        document.getElementById('loginAlerts').classList.add('wrongPassAlerts')

        return false

      } else {
        document.getElementById('passCheck').classList.remove('wrongPass')
        document.getElementById('loginAlerts').classList.remove('wrongPassAlerts')
        document.getElementById('loginAlerts').innerHTML = ``;
        return password
      }

    }

    const cadastrar = async () => {
      
      let nome = document.getElementById('nome').value
      let email = document.getElementById('email').value
      let senha = await checkPassword()

      let flagChave = false

      if(senha == false){

      } else {

        const users = (await getDocs(collection(db, 'painelUsers'))).docs.map(doc => doc.data())

        console.log(users)

        users.forEach(user => {
          console.log(user)
          // console.log(user.email)
          if(user.email === email){

                document.getElementById('loginAlerts').innerHTML = `
                  <p class="${sg.className} white">Este email já está sendo utilizado, insira outro.</p>
                `

                document.getElementById('loginAlerts').classList.add('wrongPassAlerts')

                flagChave = true

                return 
            }

        })

        if(flagChave){
          console.log('flag')
          return
        } else {

          loadPage()

          let user = {
            nome: nome,
            email: email,
            senha: senha
          }

          const docRefID = doc(db, "painelUsers", email)
          const docRefSessionsID = doc(db, "Sessions", email)

          const docRef = await setDoc(docRefID, user);
          const docRefSessions = await setDoc(docRefSessionsID, {});

          window.sessionStorage.setItem("user", user.email)

          push('/pages/mainPage')

        }
        
      }
    
    }

    const myFunc = async () => {
      document.getElementById(`createAccount`).addEventListener("click", loadPage, false);
      document.getElementById(`loginButtonButton`).addEventListener("click", cadastrar, false);
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
          {/* <nav className={sg.className, "navbar"}>
            <Image src={logoML} alt=""/>
            <Link href="/" ><p className={sg.className, "navLink"}>Home</p><div className={"divNavInside"}></div></Link>
            <Link href="/pages/about" ><p className={sg.className, "navLink"}>Outro</p><div className={"divNavInside"}></div></Link>
            <Link href="/pages/sobre" ><p className={sg.className, "navLink"}>Sobre</p><div className={"divNavInside"}></div></Link>
          </nav> */}

          <NavBar />

        <Image src={bgML.src} fill alt="" className={"bgImg"} />  

  
          <div className={"mainDiv"}>

            <div className={"loginHeader"}> 
              <div>
                <h2 className={sg.className}>Cadastro</h2>
                <div className={"loginHeaderInside"} ></div>
              </div>
            </div>
  
            <div className={"loginMainDiv"}>
                <div className={"loginDiv"} id={"loginDiv"}>
                    <p  className={sg.className}>Nome (pessoa ou empresa):</p>
                    <div className={"divTextarea"}>
                        <input id={"nome"} className={""}></input>
                        <div className={"divTextareaInside"}></div>
                    </div>
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
                    <p className={sg.className}>Confirmação da senha:</p>
                    <div className={"divTextarea"}>
                        <input id={"passCheck"} className={""}></input>
                        <div className={"divTextareaInside"} id={"passCheckDiv"}></div>
                    </div>
                </div>
            </div>

            
            <div className={"loginAlertsDiv"}> 
                <div className={"loginAlerts"} id={"loginAlerts"}> 
                
                </div>
            </div>

            <div className={"loginButton"} id={"loginButton"}> 
                <button className={"addButton"} id={"loginButtonButton"}><p className={sg.className}>Cadastrar</p></button>
            </div>

            <div className={"linkDivOutside"}> 
              <div className={"linkDiv"}> 
                  <Link href="/pages/loginPage" className={"linkDivA"} id={"createAccount"}>
                    <p className={sg.className, "navLink", "noShadowBox"}>Fazer login</p>
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
  