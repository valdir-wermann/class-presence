const addTeacherModal = document.querySelector('#add-teacher-modal');
const openAddTeacherModalBtn = document.querySelector('#adicionar-professores');
const closeAddTeacherModalBtn = document.querySelector('#fechar-add-teacher');
const teacherEmailsInput = document.querySelector('#add-emails-professores');
const addTeachersBtn = document.querySelector('#add-professor-btn');

const addTeachers = () => {
    const body = JSON.stringify({ identifiers: teacherEmailsInput.value });
    fetch(`https://causal-scorpion-rapidly.ngrok-free.app/api/classes/add_teacher/${params.id}`, {
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
            alert('Professores adicionados à turma!');
            studentEmailsInput.value = '';
            closeAddStudentModalBtn.click();
            window.location.reload();
        })
}

openAddTeacherModalBtn.addEventListener('click', () => addTeacherModal.style.visibility = 'visible');
closeAddTeacherModalBtn.addEventListener('click', () => addTeacherModal.style.visibility = 'hidden');
addTeachersBtn.addEventListener('click', addTeachers);