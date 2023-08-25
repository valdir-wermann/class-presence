const addStudentModal = document.querySelector('#add-student-modal');
const openAddStudentModalBtn = document.querySelector('#adicionar-alunos');
const closeAddStudentModalBtn = document.querySelector('#fechar-add-alunos');
const studentEmailsInput = document.querySelector('#add-emails-alunos');
const addStudentsBtn = document.querySelector('#add-alunos-btn');

const addStudents = () => {
    const body = JSON.stringify({ identifiers: studentEmailsInput.value });
    fetch(`http://localhost:3000/api/students/add_class/${params.id}`, {
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
            alert('Estudantes adicionados à turma!');
            studentEmailsInput.value = '';
            closeAddStudentModalBtn.click();
            window.location.reload();
        })
}

openAddStudentModalBtn.addEventListener('click', () => addStudentModal.style.visibility = 'visible');
closeAddStudentModalBtn.addEventListener('click', () => addStudentModal.style.visibility = 'hidden');
addStudentsBtn.addEventListener('click', addStudents);