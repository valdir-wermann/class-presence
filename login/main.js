const url = 'https://causal-scorpion-rapidly.ngrok-free.app';

const ident = document.querySelector('#email');
const senha = document.querySelector('#senha');
const tipo = document.querySelector('#tipo');
const entrar_btn = document.querySelector('#entrar-btn');
let path = '';

const entrar = () => {
    const body = {
        identifier: ident.value,
        password: senha.value
    }
    if (tipo.value === 'student') {
        path = '/api/students/login';
    } else path = '/api/teachers/login';

    fetch(url + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(body),
        mode: 'no-cors'
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            errorHandle(response);
            throw new Error(response);
        })
        .then(res => {
            localStorage.setItem('authorization', tipo.value + ' ' + res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            alert('Conectado com sucesso!');
            window.location.replace(`${window.location.origin}/class-presence/home/${tipo.value}/`);
        });
}

const errorHandle = (err) => {
    alert('Credenciais inválidas!');
    console.log(err);
}

// (async () => {
//     const _ = await fetch('http://localhost:3000/api/students', {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*", 'Authorization': "student eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsicGFzc3dvcmQiOiJpbml0IiwiZW1haWwiOiJpbml0IiwibmFtZSI6ImluaXQiLCJjbGFzc0lkIjoiaW5pdCIsIl9pZCI6ImluaXQiLCJfX3YiOiJpbml0In0sInN0YXRlcyI6eyJyZXF1aXJlIjp7fSwiZGVmYXVsdCI6e30sImluaXQiOnsiX2lkIjp0cnVlLCJuYW1lIjp0cnVlLCJlbWFpbCI6dHJ1ZSwicGFzc3dvcmQiOnRydWUsImNsYXNzSWQiOnRydWUsIl9fdiI6dHJ1ZX19fSwic2tpcElkIjp0cnVlfSwiJGlzTmV3IjpmYWxzZSwiX2RvYyI6eyJfaWQiOiI2NGI5NjQ2OGI2NzI5YTc5NzlmOWU4YWUiLCJuYW1lIjoiVkFMREFTIiwiZW1haWwiOiJhQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJHZ3NW9FNHB0cU93dUpBV1VoTUIwSS5QZ0J2NTJSZDlIbkdCLnhjNlIzYUhtdmNnWENLY3BHIiwiY2xhc3NJZCI6W10sIl9fdiI6MH0sImlhdCI6MTY4OTk1MTUyOSwiZXhwIjoxNjkwMTI0MzI5fQ.1n9B67lImnQPwHwUqqn4bnnE_ScTwFMaEzsVfpsITg4" },
//     });
//     const response = await _.json();

//     console.log(response);
// })()

entrar_btn.addEventListener('click', entrar);