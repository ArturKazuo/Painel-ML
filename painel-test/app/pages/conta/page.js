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
import { getFirestore, collection, getDocs, doc, addDoc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore/lite';
import MainPage from '../mainPage/page.js'
import '../../login.css'
import '../../addSession.css'
import { useRouter } from 'next/navigation';
import NavBar from '../components/navBar/page.js'
// import client from 'firebase-tools';

  
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sg = Space_Grotesk({ subsets: ['latin'], display: 'swap', adjustFontFallback: false })

export default function loginPage(params) {

    const { push } = useRouter();

    const loadPage = async () => {
      document.getElementById('mainID').innerHTML = document.getElementById('mainID').innerHTML + `<div class=mainLoad ><img src="${loading.src}" /></div>`
    }

    const stopLoadPage = async () => {
        document.querySelector('.mainLoad').classList.add('noDisplay')
    }

    const checkPassword = async () => {
        let password = document.getElementById('senha').value
        let passCheck = document.getElementById('confirmSenha').value
  
        if(password !== passCheck){
          document.getElementById('confirmSenha').classList.add('wrongPass')
          window.alert('Erro na confirmação da senha, certifique-se de que está digitando a mesma senha.')
        //   document.getElementById('loginAlerts').innerHTML = `
        //     <p class="${sg.className}">Erro na confirmação da senha, certifique-se de que está digitando a mesma senha.</p>
        //   `
        //   document.getElementById('loginAlerts').classList.add('wrongPassAlerts')
  
          return false
  
        } else {
          document.getElementById('confirmSenha').classList.remove('wrongPass')
        //   document.getElementById('loginAlerts').classList.remove('wrongPassAlerts')
        //   document.getElementById('loginAlerts').innerHTML = ``;
          return password
        }
  
      }
  

    const alterarDadosDB = async () => {
        let nome = document.getElementById('nome').value
        let email = document.getElementById('email').value
        let senha = await checkPassword()

        if(senha == false) {
            return;
        } else {
            const docRef = doc(db, "painelUsers", window.sessionStorage.getItem('user'));

            const data = {
                nome: nome,
                email: email,
                senha: senha
            };

            loadPage()

            updateDoc(docRef, data)
            .then(docRef => {
                console.log("A New Document Field has been added to an existing document");
                myFunc()
                stopLoadPage()
            })
            .catch(error => {
                console.log(error);
            })
        }

    }

    const alterarDados = async () => {

        // <div class="dadosDiv">
        //         <input class=${sg.className} value="${user.nome}"></input>
        //         <input class=${sg.className} value="${user.email}"></input>
        //         <input class=${sg.className} value="${user.senha}"></input>
                
        //     </div>

        const users = (await getDocs(collection(db, `painelUsers`))).docs.map(doc => doc.data())

        console.log("alter", users)

        let sessionkey

        users.forEach(user => {
            console.log(user)
            console.log(window.sessionStorage.getItem('alter'))
            if(user.email === window.sessionStorage.getItem('user') && window.sessionStorage.getItem('alter') == "true"){

                document.getElementById('dadosDiv').innerHTML = document.getElementById('dadosDiv').innerHTML + `

                    <h4 class=${sg.className} style="margin-top: 20px;">Alteração de dados</h4>
                    <div class="dadosInsideDiv" id="loginDiv">
                        <p  class=${sg.className}>Nome (pessoa ou empresa):</p>
                        <div class="divTextarea">
                            <input id="nome" class=${sg.className} value="${user.nome}"></input>
                            <div style="height: 2px !important;" class="divTextareaInsideC"></div>
                        </div>
                        <p class=${sg.className}>Email:</p>
                        <div class="divTextarea">
                            <input id="email" class=${sg.className} value="${user.email}"></input>
                            <div style="height: 1.5px !important;" class="divTextareaInsideC"></div>
                        </div>
                        <p class=${sg.className}>Senha:</p>
                        <div class="divTextarea">
                            <input id="senha" class=${sg.className} value="${user.senha}"></input>
                            <div style="height: 1.5px !important;" class="divTextareaInsideC"></div>
                        </div>
                        <p class=${sg.className}>Confirmação da senha:</p>
                        <div class="divTextarea">
                            <input id="confirmSenha" class=${sg.className} value="${user.senha}"></input>
                            <div style="height: 1.5px !important;" class="divTextareaInsideC" id="passCheckDiv"></div>
                        </div>
                    </div>
                    <div style="width:100%;display:flex;justify-content:center;align-items:center;margin:10px 0px 10px 0px;" id="loginAlerts">

                    </div>
                    <div style="width:100%;display:flex;justify-content:center;align-items:center;">
                        <button class="addButton contaButton" id="contaButtonAlterFunc"><p style="margin: 0px 0px 0px 0px !important; " class=${sg.className} >Confirmar</p></button>
                    </div>
                `

                window.sessionStorage.setItem('alter', false)

                return 
            }
        })

        document.getElementById('contaButtonAlterFunc').addEventListener("click", alterarDadosDB, false);

    }

    const sairConta = async () => {
        if(window.confirm("Deseja sair desta conta?")){
            window.sessionStorage.removeItem("user");
            push('/pages/loginPage')
        }
    }

    const deletarConta = async () => {
        if(window.confirm("Deseja excluir essa conta? Essa ação é permanente e irreversível.")){

            const sessions = (await getDocs(collection(db, `Sessions/${window.sessionStorage.getItem('user')}/sessions`))).docs.map(doc => doc.data())

            // await fetch(`http://localhost:3978/deleteAccount?email=${window.sessionStorage.getItem('user')}`)

            sessions.forEach(async (session) => {
                await deleteDoc(doc(db, `Sessions/${window.sessionStorage.getItem('user')}/sessions`, session.sessionkey))
            })

            await deleteDoc(doc(db, `Sessions`, window.sessionStorage.getItem('user')))
            await deleteDoc(doc(db, `painelUsers`, window.sessionStorage.getItem('user')))
            window.sessionStorage.removeItem("user");
            push('/pages/loginPage')
        } 
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
                    <h3 class=${sg.className}>Dados</h3>
                    <div class="dadosDiv" id="dadosDiv">
                        <p class=${sg.className}>Nome: ${user.nome}</p>
                        <p class=${sg.className}>Email: ${user.email}</p>
                        <p class=${sg.className}>Senha: ${user.senha}</p>
                    </div>
                `

                return 
            }

            document.getElementById('contaButtonAlter').addEventListener("click", alterarDados, false);
            document.getElementById('contaButtonSair').addEventListener("click", sairConta, false);
            document.getElementById('contaButtonExcluir').addEventListener("click", deletarConta, false);

            window.sessionStorage.setItem('alter', true)

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

          {/* <nav className={sg.className, "navbar"}>
            <Image src={logoML} alt=""/>
            <Link href="/" ><p className={sg.className, "navLink"}>Home</p><div className={"divNavInside"}></div></Link>
            <Link href="/pages/about" ><p className={sg.className, "navLink"}>Outro</p><div className={"divNavInside"}></div></Link>
            <Link href="/pages/sobre" ><p className={sg.className, "navLink"}>Sobre</p><div className={"divNavInside"}></div></Link>
          </nav> */}
  
          <div className={""}>
  
            <div className={"loginMainDiv"}>
                <div className={"addSessionDiv"} id={"loginDiv"}>
                
                </div>
            </div>

            
            <div className={"loginAlertsDiv"}> 
                <div className={"loginAlerts"} id={"loginAlerts"}> 

                </div>
            </div>

            <div className={"loginButton"} id={"loginButton"}> 
                <button className={"addButton contaButton"} id={"contaButtonAlter"}><p className={sg.className}>Alterar Dados</p></button>
                <button className={"addButton contaButton desconectarButton"} id={"contaButtonSair"}><p className={sg.className}>Sair</p></button>
                <button className={"addButton contaButton desconectarButton"} id={"contaButtonExcluir"}><p className={sg.className}>Excluir Conta</p></button>
            </div>
  
          </div>
  
        </main>
  
      </>
    )
  }
  