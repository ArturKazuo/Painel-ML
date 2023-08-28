const fetch = require('node-fetch');





  async function sendDatabase(results) {

    return new Promise(async (resolve, reject) => {

      const resultsSend = JSON.stringify(results)

      console.log("results: ", results)

      try {
        const response = await fetch('https://6c1ltqsvje.execute-api.us-east-1.amazonaws.com/default/MeuLockerMessageInsert', {
          method: "POST",
          headers: {
            'Content-Type': "application/json",
            "Accept": "*/*"
          },
          body: resultsSend
        });
        //const data = await response.json();

        //console.log(data);

        resolve(true)
      
      } catch(err)  {
        console.log("Erro", err)
        reject(false);
      };



  });

  }



module.exports.sendDatabase = sendDatabase