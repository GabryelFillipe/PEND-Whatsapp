'use strict'

async function carregarUsuarios() {
    const url = `https://corsproxy.io/?url=https://pbe-api-whatsapp.onrender.com/v1/whatsapp/users`
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Erro ao buscar usuários: ${response.statusText}`)
        }
        const dados = await response.json()
        return dados.users || [] 
    } catch (error) {
        console.error('Falha em carregarUsuarios:', error)
        return []
    }
}


async function carregarContatos(numeroUsuario) {
    const url = `https://corsproxy.io/?url=https://pbe-api-whatsapp.onrender.com/v1/whatsapp/user/contatos/${numeroUsuario}`
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Erro ao buscar contatos: ${response.statusText}`)
        }
        const dados = await response.json()
        return dados.contatos || []
    } catch (error) {
        console.error('Falha em carregarContatos:', error)
        return []
    }
}

async function carregarMensagensDoContato(numeroContato) {
    console.log(`Buscando mensagens para o contato: ${numeroContato}`)
    // const url = `.../v1/whatsapp/messages/${numeroContato}`
    // const response = await fetch(url)
    // const dados = await response.json()
    // return dados.messages || []


    return [
        { type: 'received', content: 'Olá, tudo bem?' },
        { type: 'sent', content: 'Tudo ótimo, e você?' }
    ]
}


function criarCartaoUsuario(usuario) {
    const cartaoUsuario = document.createElement('div')
    cartaoUsuario.classList.add('cardUser')
    cartaoUsuario.dataset.userId = usuario.id

    const imagemUsuario = document.createElement('img')
    imagemUsuario.classList.add('userImg')
    imagemUsuario.src = './img/' + usuario['profile-image']
    imagemUsuario.alt = `Foto de perfil de ${usuario.account}`

    const nomeUsuario = document.createElement('p')
    nomeUsuario.classList.add('userName')
    nomeUsuario.textContent = usuario.account

    cartaoUsuario.appendChild(imagemUsuario)
    cartaoUsuario.appendChild(nomeUsuario)

    return cartaoUsuario
}


function criarCartaoContato(contato) {
    const cartaoContato = document.createElement('div')
    cartaoContato.classList.add('contato')
    cartaoContato.id = contato.number

    const dadosContato = document.createElement('div')
    dadosContato.classList.add('mensagem-contato')

    const imagemContato = document.createElement('img')

    imagemContato.src = './img/11987876567.png'
    imagemContato.alt = `Foto de perfil de ${contato.name}`

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
    dadosContato.appendChild(imagemContato)
    dadosContato.appendChild(infoContato)
    cartaoContato.appendChild(dadosContato)
    cartaoContato.appendChild(dataMensagem)

    return cartaoContato
}

function criarModalLogin() {
    const modalOverlay = document.createElement('div')
    modalOverlay.classList.add('modal-overlay')

    const modalLogin = document.createElement('div')
    modalLogin.classList.add('modal-login')

    modalOverlay.appendChild(modalLogin)
    document.body.appendChild(modalOverlay)

    return { modalOverlay, modalLogin }
}


function abrirModalLogin() {
    document.querySelector('.modal-overlay')?.classList.add('visivel')
}

function fecharModalLogin() {
    document.querySelector('.modal-overlay')?.classList.remove('visivel')
}


function atualizarHeaderPerfil(urlImagem) {
    const imagemDoPerfilHeader = document.getElementById('abrir-modal-perfil')
    if (imagemDoPerfilHeader) {
        imagemDoPerfilHeader.src = urlImagem
    }
}


function carregarInfoContato(contato) {
    document.getElementById('foto-contato').src = './img/11987876567.png'
    document.getElementById('nome-contato').textContent = contato.name
}

function exibirMensagens(mensagens) {
    const areaMensagens = document.getElementById('area-mensagens')
    areaMensagens.replaceChildren('')

    mensagens.forEach(msg => {
        const balaoMensagem = document.createElement('div')
        balaoMensagem.classList.add('mensagem', msg.type)
        balaoMensagem.textContent = msg.content
        areaMensagens.appendChild(balaoMensagem)
    })
}


async function aoSelecionarUsuario(evento, usuarios, modalOverlay) {
    const cartaoClicado = evento.target.closest('.cardUser')
    if (!cartaoClicado) return
    const idUsuario = cartaoClicado.dataset.userId

    const usuarioSelecionado = usuarios.find(user => user.id == idUsuario)
    if (!usuarioSelecionado) return

    const imagemDoCard = cartaoClicado.querySelector('.userImg').src
    atualizarHeaderPerfil(imagemDoCard)

    fecharModalLogin()

    await criarAreaContatos(usuarioSelecionado)
}


async function aoSelecionarContato(evento, listaDeContatos) {
    const contatoEscolhido = evento.target.closest('.contato')
    if (!contatoEscolhido) return

    const idContato = contatoEscolhido.id // Este é o NÚMERO do contato

    const infoContato = listaDeContatos.find(c => c.number == idContato)
    if (!infoContato) return

    carregarInfoContato(infoContato)

    const mensagens = await carregarMensagensDoContato(idContato)
    exibirMensagens(mensagens)
}


async function popularModalLogin(elementoModal) {
    const usuarios = await carregarUsuarios()
    if (usuarios.length === 0) {
        elementoModal.textContent = 'Nenhum usuário encontrado.'
        return []
    }

    usuarios.forEach(usuario => {
        const cartaoUsuario = criarCartaoUsuario(usuario)
        elementoModal.appendChild(cartaoUsuario)
    })

    return usuarios
}

function configurarListenersModal(modalOverlay, modalLogin, usuarios) {
    modalOverlay.addEventListener('click', (evento) => {
        if (evento.target === modalOverlay) {
            fecharModalLogin()
        }
    })

    modalLogin.addEventListener('click', (evento) => {
        aoSelecionarUsuario(evento, usuarios, modalOverlay)
    })
}

function configurarListenerContatos(containerContatos, listaDeContatos) {
    containerContatos.addEventListener('click', (evento) => {
        aoSelecionarContato(evento, listaDeContatos)
    })
}

async function criarAreaContatos(usuario) {
    const containerContatos = document.getElementById('contatos-box')
    containerContatos.replaceChildren('')

    const dados = await carregarContatos(usuario.number)

    if (dados && dados.length > 0) {
        dados.forEach(contato => {
            const cardContato = criarCartaoContato(contato)
            containerContatos.appendChild(cardContato)
        })

        configurarListenerContatos(containerContatos, dados)
    } else {
        containerContatos.textContent = 'Nenhum contato encontrado.'
    }
}


async function inicializarAplicativo() {
    const { modalOverlay, modalLogin } = criarModalLogin()

    const usuarios = await popularModalLogin(modalLogin)

    configurarListenersModal(modalOverlay, modalLogin, usuarios)

    const botaoAbrir = document.getElementById('abrir-modal-perfil')
    if (botaoAbrir) {
        botaoAbrir.addEventListener('click', abrirModalLogin)
    }
}

// Inicia a aplicação
inicializarAplicativo()