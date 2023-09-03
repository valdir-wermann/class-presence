const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

if (!params.id) {
    alert('O id está faltando na URL. Redirecionando para página inicial.');
    window.location.href = `${window.location.origin}/class-presence/home/teacher/`;
}

const classTitle = document.querySelector('.title h1');
const teachersSpan = document.querySelector('#teachers-span');
const studList = document.querySelector('.alunos-lista');

var Class;
var type;

const onload = () => {
    // fetch class info and teacher info
    fetch(`https://class-presence-backend.onrender.com/api/classes/${params.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('authorization')
        }
    })
        .then(res => {
            type = res.headers.get('user');
            if (type === 'teacher') {
                document.querySelector('.actions').innerHTML = `<div class="action" id="adicionar-alunos">
                <span>Adicionar Alunos</span>
            </div>
            <div class="action" id="remover-alunos">
                <span>Remover Alunos</span>
            </div>
            <div class="action" id="adicionar-professores">
                <span>Adicionar Professores</span>
            </div>
            <div class="action" id="remover-professores">
                <span>Remover Professores</span>
            </div>
            <div class="action" id="excluir-turma">
                <span>Excluir Sala</span>
            </div>
            <div class="action" id="registrar-presenca">
                <span>Registrar presença</span>
            </div>
            <div class="action" id="relatorio-presencas">
                <span>Relatório</span>
            </div>
            <div class="action" id="lista-alunos">
                <span>Lista Alunos</span>
            </div>`;
                document.querySelector('.modals').innerHTML = `
                <div class="modal" id="add-student-modal">
                    <div class="form">
                        <div class="right">
                            <button id="fechar-add-alunos">
                                <span class="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div class="input">
                            <span>Email ou Cartão dos Alunos (separado por ,):</span>
                            <input id="add-emails-alunos" type="text" />
                        </div>
                        <button class="doAction" id="add-alunos-btn">Adicionar</button>
                    </div>
                </div>
        
                <div class="modal" id="remove-student-modal">
                    <div class="form">
                        <div class="right">
                            <button id="fechar-remove-alunos">
                                <span class="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div class="input">
                            <span>Email ou Cartão dos Alunos (separado por ,):</span>
                            <input id="remove-emails-alunos" type="text" />
                        </div>
                        <button class="doAction" id="remove-alunos-btn">Remover</button>
                    </div>
                </div>
        
                <div class="modal" id="add-teacher-modal">
                    <div class="form">
                        <div class="right">
                            <button id="fechar-add-teacher">
                                <span class="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div class="input">
                            <span>Email ou Cartão dos Professores (separado por ,):</span>
                            <input id="add-emails-professores" type="text" />
                        </div>
                        <button class="doAction" id="add-professor-btn">Adicionar</button>
                    </div>
                </div>
        
                <div class="modal" id="remove-teacher-modal">
                    <div class="form">
                        <div class="right">
                            <button id="fechar-remove-professores">
                                <span class="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div class="input">
                            <span>Email ou Cartão dos Professores (separado por ,):</span>
                            <input id="remove-emails-professores" type="text" />
                        </div>
                        <button class="doAction" id="remove-professores-btn">Remover</button>
                    </div>
                </div>
        
                <div class="modal" id="report-modal">
                    <div class="form">
                        <div class="right">
                            <button id="fechar-report">
                                <span class="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div class="input">
                            <span>Data inicial:</span>
                            <input id="start-report" type="date" />
                            <span>Data final:</span>
                            <input id="end-report" type="date" />
                        </div>
                        <button class="doAction" id="report-btn">Gerar</button>
                    </div>
                </div>`;
                const js = ['./js/add-student.js', './js/add-teacher.js', './js/exclude-class.js', './js/lista-alunos.js', './js/registrar-presenca.js', './js/remove-student.js', './js/remove-teacher.js', './js/report.js'];
                js.forEach(file => {
                    const element = document.createElement('script');
                    element.setAttribute('src', file);
                    document.body.appendChild(element);
                })
            }
            if (res.ok) return res.json();
            if (res.status === 401 || res.status === 403) {
                alert('Você não tem permissão para visualizar essa turma. Te redirecionando para página de login.');
                localStorage.clear();
                window.location.href = `${window.location.origin}/class-presence/login`;
            }
            throw new Error(res);
        })
        .then(clas => {
            Class = clas;
            classTitle.innerHTML = `Turma ${clas.name}`;
            classTitle.title = `Turma ${clas.name}`;

            fetch(`https://class-presence-backend.onrender.com/api/teachers?ids=${clas.teacherId.join(',')}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('authorization')
                }
            }).then(res => {
                if (res.ok) return res.json();
                if (res.status === 401 || res.status === 403) {
                    alert('Você não tem acesso a essa ação. Redirecionando para página de login.');
                    localStorage.clear();
                    window.location.href = `${window.location.origin}/class-presence/login`;
                }
                throw new Error(res);
            })
                .then(teachers => {
                    const writing = teachers.map(cur => cur.name + ' (' + cur.email + ')').join(', ');

                    teachersSpan.innerHTML = `Professores: ${writing}`;
                    teachersSpan.title = `Professores: ${writing}`;
                });
        });

    //fetch students
    fetch(`https://class-presence-backend.onrender.com/api/students?classId=${params.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('authorization')
        }
    })
        .then(res => {
            type = res.headers.get('user');
            if (res.ok) return res.json();
            if (res.status === 401 || res.status === 403) {
                alert('Você não tem permissão para visualizar essa turma. Te redirecionando para sua página inicial.');
                localStorage.clear();
                window.location.href = `${window.location.origin}/class-presence/login`;
            }
            throw new Error(res);
        })
        .then(students => {
            if (students.length === 0) return studList.innerHTML = '<h2>Não há alunos na turma.</h2>';
            studList.innerHTML = '';
            let html;
            if (type === 'teacher') {
                html = (student) => `<li class="aluno aluno-hover"><a href="../aluno/?id=${student._id}" title="${student.card} - ${student.name}">${student.card} - ${student.name}</a></li>`
            }
            else { html = (student) => `<li class="aluno"><a title="${student.name}">${student.name}</a></li>` }
            students.forEach(student => {
                studList.innerHTML += html(student);
            })
        })
}

window.addEventListener('load', onload);