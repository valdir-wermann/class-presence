const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

if (!params.id) {
    alert('O id está faltando na URL. Redirecionando para página inicial.');
    window.location.assign(`${window.location.origin}/home/teacher/`);
}

let studs;

const className = document.querySelector('#title h1');
const dateInput = document.querySelector('#date');
const periodsInput = document.querySelector('#periodsInput');
const descriptionInput = document.querySelector('#descriptionInput');
const studentsList = document.querySelector('.students');
const registrarBtn = document.querySelector('.registrar>button');

const onload = () => {
    fetch(`https://class-presence-backend.onrender.com/api/classes/${params.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('authorization')
        }
    })
        .then(res => {
            if (res.ok) return res.json();
            if (res.status === 401 || res.status === 403) {
                alert('Você não tem permissão para visualizar essa turma. Te redirecionando para sua página inicial.');
                localStorage.clear();
                window.location.href = `${window.location.origin}/class-presence/login`;
            }
            throw new Error(res);
        })
        .then(clas => {
            className.innerHTML = `Registrar presença: ${clas.name}`;
            fetch(`https://class-presence-backend.onrender.com/api/students?classId=${params.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('authorization')
                }
            })
                .then(res => {
                    if (res.ok) return res.json();
                    if (res.status === 401 || res.status === 403) {
                        alert('Você não pode fazer isso. Redirecionando para página inicial.');
                        localStorage.clear();
                        window.location.href = `${window.location.origin}/class-presence/login`;
                    }
                    throw new Error(res);
                })
                .then(students => {
                    if (students.length === 0) return studentsList.innerHTML = '<h2>Não há alunos na turma.</h2>';
                    studs = students;
                    studentsList.innerHTML = '';
                    students.forEach(student => {
                        studentsList.innerHTML += `
                        <div class="student">
                            <span title="${student.card} - ${student.name}">${student.card} - ${student.name}</span>
                            <select class="tipo" id="${student._id}">
                                <option value="presente">Presente</option>
                                <option value="atrasado">Atrasado</option>
                                <option value="ausente">Ausente</option>
                                <option value="fj">Falta Justificada</option>
                            </select>
                        </div>
                        `;
                    });
                })
        })
}

const registrar = () => {
    let students = [];
    document.querySelectorAll('.tipo').forEach(_ => {
        students.push({ studentId: _.id, type: _.value })
    });

    if (descriptionInput.value === '') return alert('Escreva a sua descrição da aula!');
    if (periodsInput.value < 0 || periodsInput.value === '') return alert('Digite uma quantidade de períodos válida!');
    if (dateInput.value === '') return alert('Digite uma data válida!');

    fetch(`https://class-presence-backend.onrender.com/api/attendances/${params.id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('authorization')
        },
        body: JSON.stringify({
            students,
            description: descriptionInput.value,
            date: dateInput.value,
            periods: periodsInput.value
        })
    })
        .then(res => {
            if (res.ok) return res.json();
            if (res.status === 401 || res.status === 403) {
                alert('Você não tem acesso a essa ação. Redirecionando para página de login.');
                localStorage.clear();
                window.location.href = `${window.location.origin}/class-presence/login`;
            }
            throw new Error(res);
        })
        .then(() => {
            alert('Presença registrada com sucesso! Redirecionando para página da turma!');
            window.location.assign(`../../class/?id=${params.id}`);
        });
}

window.addEventListener('load', onload);
registrarBtn.addEventListener('click', registrar)