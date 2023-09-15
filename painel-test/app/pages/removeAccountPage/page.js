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
import loading from '../../imgs/Spinner310Green4.svg'
import logoML from '../../imgs/logo-meulocker.svg'
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from 'react'
import { firebaseConfig } from '../../firebase.config.js'
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, addDoc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore/lite';
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

    const stopLoadPage = async () => {
      document.querySelector('.mainLoad').remove()
    }

    const checkPassword = async () => {
      let password = document.getElementById('senha').value
      let passCheck = document.getElementById('confirmSenha').value

      if(password !== passCheck){
        // document.getElementById('passCheck').classList.add('wrongPass')
        // document.getElementById('loginAlerts').innerHTML = `
        //   <p class="${sg.className} white">Erro na confirmação da senha, certifique-se de que está digitando a mesma senha.</p>
        // `
        // document.getElementById('loginAlerts').classList.add('wrongPassAlerts')

        window.alert('Erro na confirmação da senha, certifique-se de que está digitando a mesma senha.')

        return false

      } else {
        // document.getElementById('passCheck').classList.remove('wrongPass')
        // document.getElementById('loginAlerts').classList.remove('wrongPassAlerts')
        // document.getElementById('loginAlerts').innerHTML = ``;
        return password
      }

    }

    const alterarDados = async () => {
      let nome = document.getElementById('nome').value
      let email = document.getElementById('emailInput').value
      let papel = document.getElementById('papelSelect').value
      let senha = await checkPassword()

      if(senha == false) {
          return;
      } else {

          const data = {
            nome: nome,
            email: email,
            papel: papel,
            senha: senha
          };

          console.log(data)

          const docRef = doc(db, "painelUsers", email);

          loadPage()

          updateDoc(docRef, data)
          .then(docRef => {
              console.log("A New Document Field has been added to an existing document");
              stopLoadPage()
              pesquisar({email: email})
          })
          .catch(error => {
              console.log(error);
          })
      }
    }

    const removerUser = async () => {
      let email = document.getElementById('email').value

      loadPage()
    
      if(window.confirm("Deseja excluir esse usuário?")){
          await deleteDoc(doc(db, `painelUsers`, email))
          document.getElementById('logUser').innerHTML = ''
          stopLoadPage()
      } 
    }

    const pesquisar = async (emailInput) => {
      
      let email = document.getElementById('email').value

      console.log( "e: " , emailInput)

      if(emailInput.email){
        email = emailInput.email
      }

      loadPage()

      let userFound = undefined

      const users = (await getDocs(collection(db, 'painelUsers'))).docs.map(doc => doc.data())

      console.log(users)

      users.forEach(user => {
        // console.log(user)
        if(user.email === email){

          userFound = user

          return 
        }

      })

      if(userFound == undefined){
        console.log('flag')
        return
      } else {

        stopLoadPage()

        console.log('user')

        document.getElementById('logUser').innerHTML = `
          <div class="dadosInsideDiv userCard" id="logUserDiv">
              <p  class="${sg.className} white">Nome (pessoa ou empresa):</p>
              <div class="divTextarea removeMargin">
                  <input id="nome" class=${sg.className} value="${userFound.nome}"></input>
                  <div style="height: 2px !important;" class="divTextareaInsideC"></div>
              </div>
              <p class="${sg.className} white">Email:</p>
              <div class="divTextarea removeMargin">
                  <input id="emailInput" class=${sg.className} value="${userFound.email}"></input>
                  <div style="height: 1.5px !important;" class="divTextareaInsideC"></div>
              </div>
              <p class="${sg.className} white">Papel:</p>
              <div class="divTextarea removeMargin">
                  <select class="select" name="papel" id="papelSelect" required>
                        <option value="${userFound.papel == 'admin' ? 'admin' : 'usuario'}">${userFound.papel == 'admin' ? 'admin' : 'usuario'}</option>
                        <option value="${userFound.papel == 'admin' ? 'admin' : 'usuario'}">${userFound.papel != 'admin' ? 'admin' : 'usuario'}</option>
                  </select>
              </div>
              <p class="${sg.className} white">Senha:</p>
              <div class="divTextarea removeMargin">
                  <input id="senha" class=${sg.className} value="${userFound.senha}"></input>
                  <div style="height: 1.5px !important;" class="divTextareaInsideC"></div>
              </div>
              <p class="${sg.className} white">Confirmação da senha:</p>
              <div class="divTextarea removeMargin">
                  <input id="confirmSenha" class=${sg.className} value="${userFound.senha}"></input>
                  <div style="height: 1.5px !important;" class="divTextareaInsideC" id="passCheckDiv"></div>
              </div>
              <div class="userCardButtons">
                <button class="addButton removeMargin" id="alterDados"><p class="${sg.className} white">Alterar dados</p></button>
                <button class="addButton desconectarButton removeMargin" id="removeUser"><p class="${sg.className} white"><svg style="fill:#eeeeee;" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>Remover usuário</p></button>
              </div>
          </div>
        `

        document.getElementById('alterDados').addEventListener('click', alterarDados)
        document.getElementById('removeUser').addEventListener('click', removerUser)
        document.getElementById('email').value = email

      }
        
      
    
    }

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
      else if(!flagAdmin){
        push('/pages/mainPage')
      }
    }   

    const myFunc = async () => {

      if(window.sessionStorage.getItem('user') == undefined || window.sessionStorage.getItem('user') == null || window.sessionStorage.getItem('user') == ""){
        await push('/pages/loginPage')
      } 

      checkUser()

      const users = (await getDocs(collection(db, 'painelUsers'))).docs.map(doc => doc.data())
      const userActual = window.sessionStorage.getItem('user')

      console.log(users)
      // console.log(userActual)

      let flagAchou = false

      users.forEach(async (user) => {
        // console.log(user)
        console.log(user.email)
        if(user.email === userActual){

              if(user.papel != 'admin'){
                await push('/pages/loginPage')
              }

              flagAchou = true

              return 
          }

      })

      if(!flagAchou){
        push('/pages/loginPage')
      }

      // document.getElementById(`createAccount`).addEventListener("click", loadPage, false);
      document.getElementById(`searchButtonButton`).addEventListener("click", pesquisar, false);
      let ps = document.querySelectorAll('p')

      ps.forEach(p => {
        p.classList.add('white')
      })

      let h2s = document.querySelectorAll('h2')

      h2s.forEach(h2 => {
        h2.classList.add('white')
      })
      // if(window.sessionStorage.getItem('user')){
      //   push('/pages/mainPage')
      // } 
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
                <h2 className={sg.className, "white"}>Pesquisa de Usuário</h2>
                <div className={"loginHeaderInside"} ></div>
              </div>
            </div>
  
            <div className={"loginMainDiv"}>
                <div className={"loginDiv"} id={"loginDiv"}>
                    {/* <p  className={sg.className}>Nome (pessoa ou empresa):</p>
                    <div className={"divTextarea"}>
                        <input id={"nome"} className={""}></input>
                        <div className={"divTextareaInside"}></div>
                    </div> */}
                    <div className={"outsideSearchDiv"}>
                      <div className={"insideSearchDiv"}>
                        <p className={sg.className, "white"}>Digite o Email do usuário:</p>
                        <div className={"divTextarea divTASearch"}>
                            <input id={"email"} className={""}></input>
                            <div className={"divTextareaInside"}></div>
                        </div>
                      </div>

                      
                      <div style={{margin: '0px 0px 0px 0px !important',}} className={"loginButton"} id={"loginButton"}> 
                          <button className={"addButton"} id={"searchButtonButton"}><p className={sg.className, "white"}><svg id={"magGlass"} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>Pesquisar</p></button>
                      </div>
                    </div>

                    <div className={"logUser"} id={"logUser"}>

                    </div>
                    {/* <p className={sg.className}>Papel:</p>
                    <div className={"divTextarea"}>
                      <select className={"select"} name="papel" id="papel">
                        <option value="">--Selecione uma opção--</option>
                        <option value="admin">Admin</option>
                        <option value="usuario">Usuário</option>
                      </select>
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
                    </div> */}
                </div>
            </div>

            
            {/* <div className={"loginAlertsDiv"}> 
                <div className={"loginAlerts"} id={"loginAlerts"}> 
                
                </div>
            </div> */}

            {/* <div className={"linkDivOutside"}> 
              <div className={"linkDiv"}> 
                  <Link href="/pages/loginPage" className={"linkDivA"} id={"createAccount"}>
                    <p className={sg.className, "navLink", "noShadowBox"}>Fazer login</p>
                    <div className={"linkDivInside"}>
                      <div className={"navLinkDivLeft"}></div>
                      <div className={"navLinkDivRight"}></div>
                    </div>  
                  </Link>
              </div>
            </div> */}
  
          </div>
  
        </main>
  
      </>
    )
  }
  