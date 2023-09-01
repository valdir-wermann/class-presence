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
            if (type === 'student') {
                document.querySelector('.actions').innerHTML = '';
                document.querySelector('.modals').innerHTML = '';
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
                });
        });

    //fetch students
}

window.addEventListener('load', onload);