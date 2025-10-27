'use script'


async function carregarContatos(user) {
    
    const url = ` https://pbe-api-whatsapp.onrender.com/v1/whatsapp/user/contatos/${user}`

}
function criarContatos(contatos){

}

async function carregarUsuarios() {
    
    const url = `https://corsproxy.io/?url=https://pbe-api-whatsapp.onrender.com/v1/whatsapp/users`
    const response = await fetch(url)
    const dados = await response.json()

    return dados
}

async function criarModalLogin(){

    const dados = await carregarUsuarios()
    const users = dados.users
}
criarModalLogin()