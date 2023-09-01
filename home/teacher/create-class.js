const modal = document.querySelector('.create-class');
const openModalBtn = document.querySelector('#create-class-btn');
const closeModalBtn = document.querySelector('#close-modal');
const nameInput = document.querySelector('#class-name');
const submitBtn = document.querySelector('#submit-btn');

const createClass = () => {
    const body = JSON.stringify({ name: nameInput.value });
    fetch('https://class-presence-backend.onrender.com/api/classes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('authorization')
        },
        body
    })
        .then(res => {
            if (res.ok) return res.json();
            if (res.status === 401 || res.status === 403) {
                alert('Você não tem permissão para executar esta ação. Te redirecionando para sua página inicial.');
                window.location.href = `${window.location.origin}/class-presence/login`;
            }
            throw new Error(res);
        })
        .then(response => {
            alert(`Sua turma ${response.name} foi criada com sucesso!`);
            closeModalBtn.click();
            window.location.reload();
        })
}

openModalBtn.addEventListener('click', () => modal.style.visibility = 'visible');
closeModalBtn.addEventListener('click', () => {
    modal.style.visibility = 'hidden';
    nameInput.value = '';
});
submitBtn.addEventListener('click', createClass);