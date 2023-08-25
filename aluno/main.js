const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

if (!params.id) {
    alert('O id está faltando na URL. Redirecionando para página inicial.');
    window.location.assign('../home/teacher');
}

const attendanceList = document.querySelector('.presencas');
const studentName = document.querySelector('#studentName');
const studentEmail = document.querySelector('#studentEmail');
const studentCard = document.querySelector('#studentCard');

let student;

const onload = () => {
    fetch(`https://causal-scorpion-rapidly.ngrok-free.app/api/students/${params.id}`, {
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
                alert('Você não tem permissão para visualizar essa turma. Te redirecionando para sua página inicial.');
                window.location.assign('../home/teacher');
            }
            throw new Error(res);
        })
        .then(stud => {
            student = stud;
            studentName.innerHTML = 'Nome: ' + student.name;
            studentName.title = student.name;

            studentEmail.innerHTML = 'E-mail: ' + student.email;
            studentEmail.title = student.email;

            studentCard.innerHTML = 'Cartão: ' + student.card;
            studentCard.title = student.card;
        })

    fetch(`https://causal-scorpion-rapidly.ngrok-free.app/api/attendances/?studentId=${params.id}&groupBy=classId`, {
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
                alert('Você não tem permissão para modificar esse aluno. Não foi você quem fez essa chamada!');
                window.location.assign('../home/teacher');
            }
            throw new Error(res);
        })
        .then(presencas => {
            let html = '';
            const user = JSON.parse(localStorage.getItem('user'));
            presencas = Object.entries(presencas);
            if (presencas.length == 0) return attendanceList.innerHTML = '<h2>Não há presenças deste aluno</h2>';

            presencas.forEach(m => {
                html += `<h2>${m[0]}</h2>`;
                m[1].forEach(pres => {
                    let [date, hour] = pres.date.split('T');
                    date = date.split('-').reverse().join('/');
                    hour = (hour.slice(0, 2)) - 3 + ':' + hour.slice(3, 5); // neste caso o mongodb armazena o horário em UTC, mas como estamos no brasil = -3
                    html += `
                    <div class="presenca">
                        <div class="column">
                            <span>Dia ${date}</span><span>às ${hour} por ${pres.periods} períodos</span>
                        </div>
                        <div class="description">
                            <span id=${pres._id}"">${pres.description.toUpperCase()}</span>
                        </div>
                        <div class="center type">
                            <span class="status" 
                            style="color: ${(pres.type === 'presente' ? '#6ab04c' : (pres.type === 'atrasado' ? '#f9ca24' : (pres.type === 'ausente' ? '#eb4d4b' : '')))}">
                            ${pres.type.toUpperCase()}</span>
                        </div>
                        ${pres.teacherId !== user.id ? '<div style="width: 98.09px"></div>' : `<div class="modify center">
                        <span class="modifyBtn" id="${pres._id}">Modificar</span>
                        <span class="deleteBtn" id="${pres._id}">Excluir</span>
                    </div>`}
                    </div>`;
                });
                attendanceList.innerHTML = html;
                document.querySelectorAll('.modifyBtn').forEach(_ => {
                    _.addEventListener('click', e => {
                        attendanceId = e.target.id;
                        modal.style.visibility = 'visible';
                    })
                });
                document.querySelectorAll('.deleteBtn').forEach(_ => {
                    _.addEventListener('click', exclude);
                });
            })
        })
}

window.addEventListener('load', onload);