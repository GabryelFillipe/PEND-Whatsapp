'use script'

async function carregarContatos(user) {
    console.log("Buscando contatos para o usuário:", user)
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
        console.error("Falha ao carregar usuários:", error)
    }
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
            carregarContatos(userId)
        }
    })

    const dados = await carregarUsuarios()
    
    if(dados && dados.users){
        const users = dados.users
    
        users.forEach(usuario => {
            const cardUser = criarCardUsuariio(usuario)
            modalLogin.appendChild(cardUser)
        })
    } else {
        console.error("Não foi possível renderizar os cards de usuário.")
    }

    modalOverlay.appendChild(modalLogin)
    document.body.appendChild(modalOverlay)
}

const botaoAbrir = document.getElementById('abrir-modal-perfil')

if (botaoAbrir) {
    botaoAbrir.addEventListener('click', abrirModalLogin)
}

criarModalLogin()