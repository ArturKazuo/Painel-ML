function conectar(e) {
    console.log(e)
    document.getElementById(`botCardImg${e}`).innerHTML = `<img src=`${loading.src}` width={500} height={500} alt="Picture of the author"/> `
}

function desconectar(e) {
    console.log(e)
    document.getElementById(`botCardImg${e}`).innerHTML = `<img src=`${error.src}` width={500} height={500} alt="Picture of the author"/> `
}