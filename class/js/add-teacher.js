const addTeacherModal = document.querySelector('#add-teacher-modal');
const openAddTeacherModalBtn = document.querySelector('#adicionar-professores');
const closeAddTeacherModalBtn = document.querySelector('#fechar-add-teacher');
const teacherEmailsInput = document.querySelector('#add-emails-professores');
const addTeachersBtn = document.querySelector('#add-professor-btn');

const addTeachers = () => {
    const body = JSON.stringify({ identifiers: teacherEmailsInput.value });
    fetch(`http://localhost:3000/api/classes/add_teacher/${params.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': localStorage.getItem('authorization')
        },
        body
    })
        .then(res => {
            if (res.ok) return res.json();
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