const closeBtn = document.querySelector('#close-modal');
const modal = document.querySelector('#modal');
const typeSelect = document.querySelector('#novoTipo');
const updateBtn = document.querySelector('.modificar>button');

let attendanceId;

const update = () => {
    fetch(`https://causal-scorpion-rapidly.ngrok-free.app/api/attendances/${attendanceId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': localStorage.getItem('authorization')
        },
        body: JSON.stringify({ type: typeSelect.value })
    })
        .then(res => {
            if (res.ok) return res.json();
            if (res.status === 401 || res.status === 403) {
                alert('Você não tem permissão para modificar essa presença. Não foi você quem fez essa chamada!');
                window.location.assign('../home/teacher');
            }
            throw new Error(res);
        })
        .then(() => {
            alert('Presença modificada com sucesso!');
            window.location.reload();
        })
}

closeBtn.addEventListener('click', () => modal.style.visibility = 'hidden');
updateBtn.addEventListener('click', update);