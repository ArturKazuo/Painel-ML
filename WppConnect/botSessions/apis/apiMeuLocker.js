const fetch = require('node-fetch');

const apiURL = 'http://r1m.meulocker.com.br:60010';


  /****************************************************************************************************************************
   * 
   * 
   *            Sessão de GET
   * 
   * 
  *****************************************************************************************************************************/

  async function getCondominio(id) {

    try{

      console.log("id", id)
      //id = "0869bab1-f9fb-41bc-9d4e-c41131120c4a";

      let resp = await fetch(`https://apicci.qira.com.br/v1/chatbot/condominio/locker?lockerId=${id}`);  
      const resposta = await resp.json()

      return resposta;

    }catch(e){
      console.error(e)
    }
  }

  /****************************************************************************************************************************
   * 
   * 
   *            Sessão de SEND
   * 
   * 
  *****************************************************************************************************************************/

  async function sendCadastro(results) {

    return new Promise(async (resolve, reject) => {

      const resultsSend = JSON.stringify(results)

      console.log("results: ", results)
      //console.log("resultsSend: ", resultsSend)

      try {
        const response = await fetch('https://apicci.qira.com.br/v1/chatbot/condomino', {
          method: "POST",
          headers: {
            'Content-Type': "application/json",
            "Accept": "*/*"
          },
          body: resultsSend
        });
        const data = await response.json();

        console.log(data);

        resolve(true)
      
      } catch(err)  {
        console.log("Erro", err)
        reject(false);
      };


      // const resposta = await resp.json()
      // console.log("resposta: ", resposta)

  });

  }

//   sendRespostaAuto(results){

//     return new Promise(async (resolve, reject) => {

//       const resultsSend = JSON.stringify(results)

//       try {

//         const response = await fetch(`${results.callback_url}`, {
//           method: "POST",
//           headers: {
//             'Content-Type': "application/json",
//             "Accept": "*/*"
//           },
//           body: resultsSend
//         });

//         const data = await response.json();

//         console.log(data);

//         resolve(true)
//       }catch(err){
//         console.log("Erro", err)
//         reject(false);
//       }

//     });

//   }

module.exports.getCondominio = getCondominio
module.exports.sendCadastro = sendCadastro