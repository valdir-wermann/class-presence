const username = document.querySelector('#username');
const password = document.querySelector('#password');
const createBtn = document.querySelector('#create');

const create = () => {
    const body = {
        username: username.value,
        password: password.value
    };

    fetch(`http://localhost:3000/api/teacher_code/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': localStorage.getItem('authorization')
        },
        body: JSON.stringify(body)
    })
        .then(res => {
            if (res.ok) return res.json();
            if (res.status === 401 || res.status === 403) {
                alert('Credenciais inválidas!');
            }
            throw new Error(res);
        })
        .then(code => alert(`O código para criação do professor é: ${code.code}`));
}

createBtn.addEventListener('click', create);