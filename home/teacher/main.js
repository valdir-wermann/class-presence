const onload = async () => {
    const classes = document.querySelector('.classes'); classes.innerHTML = '';

    // if (localStorage.getItem('authorization').split(' ')[1] === 'student') {
    //     alert('Você não pode visualizar essa página! Por favor,')
    // }

    fetch('http://localhost:3000/api/classes?teacherId=own', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': localStorage.getItem('authorization')
        }
    })
        .then(res => {
            if (res.ok) return res.json();
            if (res.status === 401 || res.status === 403) {
                alert('Sua sessão expirou. Redirecionando para página de login.');
                localStorage.clear();
                window.location.assign('../../login');
            }
        })
        .then(response => {
            document.querySelector('#username').innerHTML = JSON.parse(localStorage.getItem('user')).name;
            if (response.length === 0) return classes.innerHTML = '<h2>Você não leciona em nenhuma turma</h2>';
            response.forEach(res => {
                const html = `
                <div class="class">
                    <div class="name"><span title="${res.name}">${res.name}</span></div>
                    <div class="more"><a href="../../class/index.html?id=${res._id}">Mais</a></div>
                </div>`;
                classes.innerHTML += html;
            });
        })
}

const leave = () => {
    localStorage.clear();
    window.location.assign('/frontend/login');
}

window.addEventListener('load', onload);
document.querySelector('#leave').addEventListener('click', leave);