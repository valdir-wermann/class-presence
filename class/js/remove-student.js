const removeStudentModal = document.querySelector('#remove-student-modal');
const openRemoveStudentModalBtn = document.querySelector('#remover-alunos');
const closeRemoveStudentModalBtn = document.querySelector('#fechar-remove-alunos');
const removeStudentsEmailsInput = document.querySelector('#remove-emails-alunos');
const removeStudentBtn = document.querySelector('#remove-alunos-btn');

const removeStudents = () => {
    const body = JSON.stringify({ identifiers: removeStudentsEmailsInput.value });
    fetch(`https://class-presence-backend.onrender.com/api/students/remove_class/${params.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('authorization')
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
            alert('Estudantes removidos da turma!');
            removeStudentsEmailsInput.value = '';
            closeRemoveStudentModalBtn.click();
            window.location.reload();
        })
}

openRemoveStudentModalBtn.addEventListener('click', () => removeStudentModal.style.visibility = 'visible');
closeRemoveStudentModalBtn.addEventListener('click', () => removeStudentModal.style.visibility = 'hidden');
removeStudentBtn.addEventListener('click', removeStudents);