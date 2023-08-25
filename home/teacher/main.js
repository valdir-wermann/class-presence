const classes = document.querySelector('.classes'); classes.innerHTML = '';
const onload = async () => {
    fetch('https://causal-scorpion-rapidly.ngrok-free.app/api/classes?teacherId=own', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': localStorage.getItem('authorization')
        },
        mode: 'no-cors'
    })
        .then(res => {
            if (res.ok) return res.json();
            if (res.status === 401 || res.status === 403) {
                alert('Você não tem acesso a esta página. Redirecionando para página de login.');
                localStorage.clear();
                window.location.href = `${window.location.origin}/class-presence/login`;
            }
            throw new Error(res);
        })
        .then(response => {
            document.querySelector('#username').innerHTML = JSON.parse(localStorage.getItem('user')).name;
            if (response.length === 0) return classes.innerHTML = '<h2>Você não leciona em nenhuma turma</h2>';
            response.forEach(res => {
                const html = `
                <div class="class">
                    <div class="name"><span title="${res.name}">${res.name}</span></div>
                    <div class="more"><a href="../../class/?id=${res._id}">Mais</a></div>
                </div>`;
                classes.innerHTML += html;
            });
        })
}

const leave = () => {
    localStorage.clear();
    window.location.href = `${window.location.origin}/class-presence/login`;
}

window.addEventListener('load', onload);
document.querySelector('#leave').addEventListener('click', leave);