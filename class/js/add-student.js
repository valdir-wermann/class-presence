const addStudentModal = document.querySelector('#add-student-modal');
const openAddStudentModalBtn = document.querySelector('#adicionar-alunos');
const closeAddStudentModalBtn = document.querySelector('#fechar-add-alunos');
const studentEmailsInput = document.querySelector('#add-emails-alunos');
const addStudentsBtn = document.querySelector('#add-alunos-btn');

const addStudents = () => {
    const body = JSON.stringify({ identifiers: studentEmailsInput.value });
    fetch(`https://causal-scorpion-rapidly.ngrok-free.app/api/students/add_class/${params.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('authorization'),
            'ngrok-skip-browser-warning': 'true'
        },
        body
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
            alert('Estudantes adicionados à turma!');
            studentEmailsInput.value = '';
            closeAddStudentModalBtn.click();
            window.location.reload();
        })
}

openAddStudentModalBtn.addEventListener('click', () => addStudentModal.style.visibility = 'visible');
closeAddStudentModalBtn.addEventListener('click', () => addStudentModal.style.visibility = 'hidden');
addStudentsBtn.addEventListener('click', addStudents);