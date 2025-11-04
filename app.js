'use script'

async function carregarUsuarios() {

    const url = `https://corsproxy.io/?url=https://pbe-api-whatsapp.onrender.com/v1/whatsapp/users`
    const response = await fetch(url)
    const dados = await response.json()
    return dados

}

function criarCardUsuariio(usuario) {
    const cardUser = document.createElement('div')
    cardUser.classList.add('cardUser')
    cardUser.dataset.userId = usuario.id

    const userImg = document.createElement('img')
    userImg.classList.add('userImg')
    userImg.src = './img/' + usuario['profile-image']

    const userName = document.createElement('p')
    userName.classList.add('userName')
    userName.textContent = usuario.account

    cardUser.appendChild(userImg)
    cardUser.appendChild(userName)

    return cardUser
}

function abrirModalLogin() {
    const modal = document.querySelector('.modal-overlay')
    if (modal) {
        modal.classList.add('visivel')
    }
}

function fecharModalLogin() {
    const modal = document.querySelector('.modal-overlay')
    if (modal) {
        modal.classList.remove('visivel')
    }
}

async function criarModalLogin() {
    const modalOverlay = document.createElement('div')
    modalOverlay.classList.add('modal-overlay')

    const modalLogin = document.createElement('div')
    modalLogin.classList.add('modal-login')

    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            fecharModalLogin()
        }
    })

    modalLogin.addEventListener('click', (event) => {
        const clickedCard = event.target.closest('.cardUser')
        if (clickedCard) {
            const userId = clickedCard.dataset.userId

            const imagemDoCard = clickedCard.querySelector('.userImg')
            const imagemDoPerfilHeader = document.getElementById('abrir-modal-perfil')
            const novoSrc = imagemDoCard.src

            if (imagemDoPerfilHeader) {
                imagemDoPerfilHeader.src = novoSrc
            }

            fecharModalLogin()
            criarAreaContatos(userId)

        }
    })

    const dados = await carregarUsuarios()



    if (dados && dados.users) {
        const users = dados.users

        users.forEach(usuario => {
            const cardUser = criarCardUsuariio(usuario)
            modalLogin.appendChild(cardUser)
        })
    } else {
    }


    modalOverlay.appendChild(modalLogin)
    document.body.appendChild(modalOverlay)

    escolherContato()
}

async function carregarContatos(id) {

    id = Number(id)
    console.log(id)
    const usuarios = await carregarUsuarios()

    const dadosUsuario = usuarios.users

    const usuario = dadosUsuario.find(user => user.id === id)
    const numeroUsuario = usuario.number

    const url = `https://corsproxy.io/?url=https://pbe-api-whatsapp.onrender.com/v1/whatsapp/user/contatos/${numeroUsuario}`
    const response = await fetch(url)
    const contatos = await response.json()


    return contatos

}

async function criarAreaContatos(id) {

    const containerContatos = document.getElementById('contatos-box')
    containerContatos.replaceChildren('')

    const dados = await carregarContatos(id)

    if (dados && dados.contatos) {

        const contatos = dados.contatos

        contatos.forEach(contato => {
            const cardContato = criarCardContato(contato)
            containerContatos.appendChild(cardContato)
        })

    }

}

function criarCardContato(contato) {

    const contatoCard = document.createElement('div')
    contatoCard.classList.add('contato')
    contatoCard.id = contato.number

    const dadosContato = document.createElement('div')
    dadosContato.classList.add('mensagem-contato')

    const contatoImg = document.createElement('img')
    contatoImg.src = './img/11987876567.png'

    const infoContato = document.createElement('div')
    infoContato.classList.add('info-contato')

    const nomeContato = document.createElement('h2')
    nomeContato.textContent = contato.name

    const ultimaMensagem = document.createElement('p')
    ultimaMensagem.textContent = 'Ultima Mensagem'

    const dataMensagem = document.createElement('span')
    dataMensagem.textContent = "17/10/2025"

    infoContato.appendChild(nomeContato)
    infoContato.appendChild(ultimaMensagem)
    dadosContato.appendChild(contatoImg)
    dadosContato.appendChild(infoContato)
    contatoCard.appendChild(dadosContato)
    contatoCard.appendChild(dataMensagem)

    return contatoCard
}

async function escolherContato() {

    const containerContatos = document.getElementById('contatos-box')

    containerContatos.addEventListener('click', async function (contato) {

        const contatoEscolhido = contato.target.closest('.contato')
        
        const idContato = contatoEscolhido.id

        const infoContato = await carregarContatos(idContato)

        carregarInfoContato(infoContato)
        carregarMensagensContato(idContato)

    })

}

function carregarInfoContato(contato){

    const dadosContato = document.getElementById('dados-contato')

    const contatoImg = document.getElementById('foto-contato')
    contatoImg.src = contato.image

    const infoContato = document.getElementById('info-contato')

    const nomeContato = document.getElementById('nome-contato')
    nomeContato.textContent = contato.name

    const visto = document.getElementById('visto')

    

}

function carregarMensagensContato(contato) {



}

const botaoAbrir = document.getElementById('abrir-modal-perfil')

if (botaoAbrir) {
    botaoAbrir.addEventListener('click', abrirModalLogin)
}
criarModalLogin()