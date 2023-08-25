const removeStudentModal = document.querySelector('#remove-student-modal');
const openRemoveStudentModalBtn = document.querySelector('#remover-alunos');
const closeRemoveStudentModalBtn = document.querySelector('#fechar-remove-alunos');
const removeStudentsEmailsInput = document.querySelector('#remove-emails-alunos');
const removeStudentBtn = document.querySelector('#remove-alunos-btn');

const removeStudents = () => {
    const body = JSON.stringify({ identifiers: removeStudentsEmailsInput.value });
    fetch(`https://causal-scorpion-rapidly.ngrok-free.app/api/students/remove_class/${params.id}`, {
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
            alert('Estudantes removidos da turma!');
            removeStudentsEmailsInput.value = '';
            closeRemoveStudentModalBtn.click();
            window.location.reload();
        })
}

openRemoveStudentModalBtn.addEventListener('click', () => removeStudentModal.style.visibility = 'visible');
closeRemoveStudentModalBtn.addEventListener('click', () => removeStudentModal.style.visibility = 'hidden');
removeStudentBtn.addEventListener('click', removeStudents);