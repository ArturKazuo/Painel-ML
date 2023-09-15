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
import { getFirestore, collection, getDocs, doc, addDoc, setDoc, deleteDoc } from 'firebase/firestore/lite';
import MainPage from '../mainPage/page.js'
import '../../login.css'
import { useRouter } from 'next/navigation';
import NavBar from '../components/navBar/page.js'

  
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sg = Space_Grotesk({ subsets: ['latin'], display: 'swap', adjustFontFallback: false })

export default function loginPage(params) {

    const { push } = useRouter();

    const loadPage = async () => {
      document.getElementById('mainID').innerHTML = document.getElementById('mainID').innerHTML + `<div class=mainLoad ><img src="${loading.src}" /></div>`
    }

    const alterarDados = async () => {
        
    }

    const sairConta = async () => {

    }

    const deletarConta = async () => {

    }

    const myFunc = async () => {
    //   document.getElementById(`loginButtonButton`).addEventListener("click", login, false);
    //   document.getElementById(`createAccount`).addEventListener("click", loadPage, false);
        if(window.sessionStorage.getItem('user') == undefined || window.sessionStorage.getItem('user') == null || window.sessionStorage.getItem('user') == ""){
            push('/pages/loginPage')
        } 

        const users = (await getDocs(collection(db, `painelUsers`))).docs.map(doc => doc.data())

        console.log(users)

        users.forEach(user => {
            console.log(user)
            if(user.email == window.sessionStorage.getItem('user')){

                // document.getElementById('addSessionDiv').innerHTML = `
                //     <p class="sg.className chaveErro" >Esta chave de sessão já está sendo utilizada, insira outra.</p>
                // `

                // document.getElementById('addSessionDiv').style.border = "2px solid #d20808"

                // document.getElementById('addSessionButton').innerHTML = `
                //     <div class=multipleButtons>
                //         <a href="/pages/addSession" class="addButton"><p class=sg.className>Tentar novamente</p></a>
                //         <a href="/pages/mainPage" class="addButton"><p class=sg.className>Voltar para a página inicial</p></a>
                //     </div>
                // `

                // flagChave = true

                document.getElementById('loginDiv').innerHTML = `
                    <h3>Dados</h3>
                    <div class="dadosDiv">
                        <p className={sg.className}>Nome: ${user.nome}</p>
                        <p className={sg.className}>Email: ${user.email}</p>
                        <p className={sg.className}>Senha: ${user.senha}</p>
                    </div>
                `

                return 
            }

            document.getElementById('contaButtonAlter').addEventListener("click", loadPage, false);
            document.getElementById('contaButtonSair').addEventListener("click", loadPage, false);
            document.getElementById('contaButtonExcluir').addEventListener("click", loadPage, false);

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

          <NavBar />
  
          <div className={""}>
  
            <div className={"loginMainDiv"}>
                <div className={"loginDiv"} id={"loginDiv"}>
                
                </div>
            </div>

            
            <div className={"loginAlertsDiv"}> 
                <div className={"loginAlerts"} id={"loginAlerts"}> 

                </div>
            </div>

            <div className={"loginButton"} id={"loginButton"}> 
                <Link href={"/pages/conta"} className={"addButton contaButton"} id={"contaButtonAlter"}><p className={sg.className}>Voltar</p></Link>
                <button className={"addButton contaButton desconectarButton"} id={"contaButtonSair"}><p className={sg.className}>Sair</p></button>
                <button className={"addButton contaButton desconectarButton"} id={"contaButtonExcluir"}><p className={sg.className}>Excluir Conta</p></button>
            </div>
  
          </div>
  
        </main>
  
      </>
    )
  }
  