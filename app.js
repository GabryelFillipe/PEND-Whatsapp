'use script'


async function carregarContatos(user) {

    const url = ` https://pbe-api-whatsapp.onrender.com/v1/whatsapp/user/contatos/${user}`

}
function criarContatos(contatos) {

}

async function carregarUsuarios() {

    try {

        const url = `https://corsproxy.io/?url=https://pbe-api-whatsapp.onrender.com/v1/whatsapp/users`
        const response = await fetch(url)
        const dados = await response.json()

        return dados
    } catch (error) {

    }

}

async function criarCardUsuariio(usuario) {

    const cardUser = document.createElement('div')
    cardUser.classList.add('cardUser')

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

async function criarModalLogin(userCard) {

    const modalOverlay = document.createElement('div')
    modalOverlay.classList.add('modal-overlay')

    const modalLogin = document.createElement('div')
    modalLogin.classList.add('modal-login')

    const modalInfo = document.createElement('span')
    modalInfo.classList.add('spanModal')
    modalInfo.textContent = 'Escolha um usuario'

    const dados = await carregarUsuarios()
    const users = dados.users

    modalOverlay.appendChild(modalInfo)

    users.forEach(async usuario => {

        const cardUser = await criarCardUsuariio(usuario)

        modalLogin.appendChild(cardUser)
    });

    modalOverlay.appendChild(modalLogin)
    document.body.appendChild(modalOverlay)


}
criarModalLogin()