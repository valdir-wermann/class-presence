const url = 'http://localhost:3000';

const tipo = document.querySelector('#tipo');
const nome = document.querySelector('#nome');
const email = document.querySelector('#email');
const cartao = document.querySelector('#cartao');
const senha = document.querySelector('#senha');
const codigo = document.querySelector('#codigo');
const codigo_field = document.querySelector('.codigo-field');
const registrar_btn = document.querySelector('#entrar-btn');
let path = '';

const registrar = () => {
    if (!isEmailValid(email.value)) return alert('Email inválido!');
    if (!isPasswordMedium(senha.value)) return alert('A sua senha deve ter pelo menos: 1 letra minúscula, 1 letra maiúscula, 1 número e pelo menos 6 caracteres!');
    if (!isCardValid(cartao.value)) return alert('O seu cartão deve ter exatamente 8 dígitos (inclua o 00)');
    const body = {
        name: nome.value,
        email: email.value,
        card: cartao.value,
        password: senha.value
    };

    if (tipo.value === 'teacher') {
        path = '/api/teachers/signup';
        body.code = codigo.value;
    } else path = '/api/students/signup';

    fetch(url + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(body)
    })
        .then(response => {
            if (response.ok) return response.json();
            alert('Algo deu errado no cadastro. Tente novamente mais tarde.');
            throw new Error(response);
        })
        .then(() => {
            alert('Registrado corretamente. Direcionando para a página de login.');
            window.location.assign("../login/index.html");
        });
}

const isEmailValid = (email) => {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return mailformat.test(email);
}

const isPasswordMedium = password => {
    const regex = /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,}))/g;
    return regex.test(password);
}

const isCardValid = (card) => {
    const cardformat = /^[0-9]{8}$/g;
    return cardformat.test(card);
}

const alternarCodigo = (e) => {
    if (e.target.value === 'teacher') {
        codigo_field.style.display = 'block';
    } else {
        codigo_field.style.display = 'none';
    }
}

tipo.addEventListener('change', alternarCodigo);
registrar_btn.addEventListener('click', registrar);