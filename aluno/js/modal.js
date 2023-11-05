const closeBtn = document.querySelectorAll('.close-modal');
const modal = document.querySelector('#modal');
const typeSelect = document.querySelector('#novoTipo');
const updateBtn = document.querySelector('.modificar>button');

let attendanceId;

const update = () => {
    fetch(`https://class-presence-backend.onrender.com/api/attendances/${attendanceId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('authorization')
        },
        body: JSON.stringify({ type: typeSelect.value })
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
            alert('Presença modificada com sucesso!');
            window.location.reload();
        })
}

closeBtn.forEach(_ => _.addEventListener('click', () => modal.style.visibility = 'hidden'));
updateBtn.addEventListener('click', update);