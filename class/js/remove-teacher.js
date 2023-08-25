const removeTeacherModal = document.querySelector('#remove-teacher-modal');
const openRemoveTeacherModalBtn = document.querySelector('#remover-professores');
const closeRemoveTeacherModalBtn = document.querySelector('#fechar-remove-professores');
const removeTeacherEmailsInput = document.querySelector('#remove-emails-professores');
const removeTeacherBtn = document.querySelector('#remove-professores-btn');

const removeTeachers = () => {
    const body = JSON.stringify({ identifiers: removeTeacherEmailsInput.value });
    fetch(`hthttps://causal-scorpion-rapidly.ngrok-free.app/api/classes/remove_teacher/${params.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': localStorage.getItem('authorization')
        },
        body,
        mode: 'no-cors'
    })
        .then(res => {
            if (res.ok) return res.json();
            if (res.status === 401 || res.status === 403) {
                alert('Você não tem acesso a essa ação. Redirecionando para página de login.');
                localStorage.clear();
                window.location.href = `${window.location.origin}/class-presence/login`;
            }
            alert('Algo deu errado. Tente novamente ou revise o campo de digitação!');
            throw new Error(res);
        })
        .then(() => {
            alert('Professores removidos da turma!');
            removeTeacherEmailsInput.value = '';
            closeRemoveTeacherModalBtn.click();
            window.location.reload();
        })
}

openRemoveTeacherModalBtn.addEventListener('click', () => removeTeacherModal.style.visibility = 'visible');
closeRemoveTeacherModalBtn.addEventListener('click', () => removeTeacherModal.style.visibility = 'hidden');
removeTeacherBtn.addEventListener('click', removeTeachers);