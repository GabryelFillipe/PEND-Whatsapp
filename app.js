'use strict'

let numeroUsuarioEscolhido = ""

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
        return []
    }
}

async function carregarMensagensDoContato(nomeContato) {
    const url = `https://corsproxy.io/?url=https://pbe-api-whatsapp.onrender.com/v1/whatsapp/user/mensagem/contato?user=${numeroUsuarioEscolhido}&contato=${nomeContato}`
    const response = await fetch(url)
    const dados = await response.json()
    const mensagens = dados.mensagens
    return mensagens
}


function criarCartaoUsuario(usuario) {
    const cartaoUsuario = document.createElement('div')
    cartaoUsuario.classList.add('cardUser')
    cartaoUsuario.dataset.userId = usuario.id

    const imagemUsuario = document.createElement('img')
    imagemUsuario.classList.add('userImg')
    
    imagemUsuario.src = `https://ui-avatars.com/api/?name=${usuario.account}&background=random`
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
    cartaoContato.id = contato.name

    const dadosContato = document.createElement('div')
    dadosContato.classList.add('mensagem-contato')

    const imagemContato = document.createElement('img')
    
    imagemContato.src = `https://ui-avatars.com/api/?name=${contato.name}&background=random`
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
    document.getElementById('foto-contato').src = `https://ui-avatars.com/api/?name=${contato.name}&background=random`
    document.getElementById('nome-contato').textContent = contato.name
}

function exibirMensagens(mensagens) {
    const boxMensagens = document.getElementById('box-mensagens')
    boxMensagens.replaceChildren('')

    mensagens.forEach(mensagem => {
        const balaoMensagem = document.createElement('div')
        balaoMensagem.classList.add('mensagem')

        const mensagemContainer = document.createElement('div')
        mensagemContainer.classList.add('mensagem-texto')

        const contato = document.createElement('h4')
        contato.textContent = mensagem.sender

        const textoMensagem = document.createElement('span')
        textoMensagem.textContent = mensagem.content

        mensagemContainer.appendChild(contato)
        mensagemContainer.appendChild(textoMensagem)

        if (mensagem.sender === 'me') {
            balaoMensagem.classList.add('enviada')
            mensagemContainer.classList.add('enviada')
            balaoMensagem.appendChild(mensagemContainer)
        } else {
            balaoMensagem.classList.add('recebida')
            mensagemContainer.classList.add('recebida')

            const profile = document.createElement('img')
            profile.src = `https://ui-avatars.com/api/?name=${mensagem.sender}&background=random`
            profile.alt = `Foto de ${mensagem.sender}`

            balaoMensagem.appendChild(profile)
            balaoMensagem.appendChild(mensagemContainer)
        }

        boxMensagens.appendChild(balaoMensagem)
    })
}


async function aoSelecionarUsuario(evento, usuarios, modalOverlay) {
    const cartaoClicado = evento.target.closest('.cardUser')
    if (!cartaoClicado) return
    const idUsuario = cartaoClicado.dataset.userId

    const usuarioSelecionado = usuarios.find(user => user.id == idUsuario)
    if (!usuarioSelecionado) return

    numeroUsuarioEscolhido = usuarioSelecionado.number
    const imagemDoCard = cartaoClicado.querySelector('.userImg').src
    atualizarHeaderPerfil(imagemDoCard)

    fecharModalLogin()

    await criarAreaContatos(usuarioSelecionado)
}


async function aoSelecionarContato(evento, listaDeContatos) {
    const contatoEscolhido = evento.target.closest('.contato')
    if (!contatoEscolhido) return
    const nomeContato = contatoEscolhido.id
    const infoContato = listaDeContatos.find(contato => contato.name == nomeContato)
    if (!infoContato) return

    carregarInfoContato(infoContato)

    const mensagens = await carregarMensagensDoContato(nomeContato)
    if (mensagens) {
        exibirMensagens(mensagens)
    } else {
        console.error('Não foi possível carregar as mensagens.')
    }
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

inicializarAplicativo()