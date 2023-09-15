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
import wppYes from '../../imgs/greenCheck.png'
import errorTriangle from '../../imgs/errorTriangle.png'
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

    const cadastrar = async () => {
      
      let nome = document.getElementById('nome').value
      let email = document.getElementById('email').value
      let papel = document.getElementById('papel').value
      if(papel == ""){
        window.alert('Selecione o papel do usuário.')
        return
      }
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

                // document.getElementById('loginAlerts').innerHTML = `
                //   <p class="${sg.className} white">Este email já está sendo utilizado, insira outro.</p>
                // `

                // document.getElementById('loginAlerts').classList.add('wrongPassAlerts')

                window.alert('Este email já está sendo utilizado, insira outro.')

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
            papel: papel,
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

      if(window.sessionStorage.getItem('user') == undefined || window.sessionStorage.getItem('user') == null || window.sessionStorage.getItem('user') == ""){
        await push('/pages/loginPage')
      } 

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
    //   document.getElementById(`loginButtonButton`).addEventListener("click", cadastrar, false);
      let ps = document.querySelectorAll('p')

      ps.forEach(p => {
        p.classList.add('white')
      })

      let h1s = document.querySelectorAll('h1')

      h1s.forEach(h1 => {
        h1.classList.add('white')
      })

      let h2s = document.querySelectorAll('h2')

      h2s.forEach(h2 => {
        h2.classList.add('white')
      })

      let h3s = document.querySelectorAll('h3')

      h3s.forEach(h3 => {
        h3.classList.add('white')
      })

      let h4s = document.querySelectorAll('h4')

      h4s.forEach(h4 => {
        h4.classList.add('white')
      })

      let h5s = document.querySelectorAll('h5')

      h5s.forEach(h5 => {
        h5.classList.add('white')
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
        <main className={sg.className, "maxHeight"} id={"mainID"}>
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
                <h2  className={`${sg.className} white`}>Ajuda</h2>
                <div className={"loginHeaderInside"} ></div>
              </div>
            </div>
  
            <div className={"loginMainDiv ajudaMainDiv"}>
                <div className={"loginDiv ajudaDiv"} id={"loginDiv"}>
                    {/* <h4  className={`${sg.className} white`}>Legenda: </h4> */}
                    <div className={"ajudaInsideDiv"}>
                        <h5  className={`${sg.className} white`}><b>Sessões: </b></h5>
                        <p  className={`${sg.className} white`}><br />
                          <Image src={wppYes.src} width={"50"} height={"50"} alt="" className={"bgImg"} />Sessão conectada <br />
                          <Image src={error.src} width={"60"} height={"60"}  alt="" className={"bgImg"} />Sessão desconectada <br />
                          <Image src={errorTriangle.src} width={"80"} height={"80"}  alt="" className={"bgImg"} />Sessão nunca utilizada anteriormente, ou algum erro ocorreu<br /><br />
                          - Caso tenha algum erro ao conectar o bot, clique em desconectar, espere alguns segundos e tente conectar novamente.<br />
                        </p>
                    </div>
                    <div className={"ajudaInsideDiv"}>
                        <h5 className={`${sg.className} white`}><b>Usuários: </b></h5>
                        <p className={`${sg.className} white`}><br />- Apenas os usuários com papel admin podem criar novos usuários, alterar os dados de usuários e excluí-los<br /><br />
                                                    - Os admins podem alterar informações sobre os usuários já existentes, incluindo o papel deles.<br />
                                                    &nbsp;&nbsp;&nbsp;&nbsp;- Para alterar informações sobre novos usuários:<br />
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1- Faça login em uma conta admin<br />
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2- Clique no botão "Procurar Usuário", na tela principal (Home)<br />
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3- Digite o email vinculado à conta do usuário que deesja encontrar<br />
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4- Você pode alterar qualquer dado e salvar essas alterações clicando no botão "Alterar Dados"<br /><br />
                                                    
                                                    - Os admins podem deletar usuários.<br />
                                                    &nbsp;&nbsp;&nbsp;&nbsp;- Para excluir usuários:<br />
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1- Faça login em uma conta admin<br />
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2- Clique no botão "Procurar Usuário", na tela principal (Home)<br />
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3- Digite o email vinculado à conta do usuário que deesja encontrar<br />
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4- Você pode excluir o usuário, clicando no botão "Remover usuário"<br />
                                                    </p>
                    </div>
                </div>
            </div>

  
          </div>
  
        </main>
  
      </>
    )
  }