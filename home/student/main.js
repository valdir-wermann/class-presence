const classesDiv = document.querySelector('.classes');
const attendanceList = document.querySelector('.presencas');

const onload = () => {
    document.querySelector('#username').innerHTML = JSON.parse(localStorage.getItem('user')).name;
    //fetch minhas turmas
    fetch('https://class-presence-backend.onrender.com/api/classes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('authorization')
        }
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
        .then(classes => {
            if (classes.length == 0) classesDiv.innerHTML = `<h2 class="subtitle">Não há turmas que você participa.</h2>`;
            classes.forEach(cur => {
                classesDiv.innerHTML += `
                <div class="class">
                    <div class="name"><span title="${cur.name}">${cur.name}</span></div>
                    <div class="more"><a href="../../class/?id=${cur._id}">Mais</a></div>
                </div>
                `;
            })
        });

    //fetch presencas
    fetch(`https://class-presence-backend.onrender.com/api/attendances/?groupBy=classId`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('authorization')
        }
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
        .then(presencas => {
            if (Object.keys(presencas).length === 0) {
                attendanceList.innerHTML = `<h2 class="subtitle">Não há presenças em seu nome.</h2>`;
            } else {
                let html = '';
                Object.entries(presencas).forEach(m => {
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
                            style="color: ${(pres.type === 'presente' ? '#6ab04c' : (pres.type === 'atrasado' ? '#f9ca24' : (pres.type === 'ausente' ? '#eb4d4b' : (pres.type === 'fj') ? '#e67e22' : '')))}">
                            ${pres.type.toUpperCase()}</span>
                        </div>
                    </div>`;
                    });
                    attendanceList.innerHTML = html;
                })
            }
        });
}

const leave = () => {
    localStorage.clear();
    window.location.href = `${window.location.origin}/class-presence/login`;
}

window.addEventListener('load', onload);
document.querySelector('#leave').addEventListener('click', leave);