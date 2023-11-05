const modifySelector = document.querySelector(`#info-select`);
const tipoForm = document.querySelector(`#tipo-form`);
const dataForm = document.querySelector(`#data-form`);

const modifyDateBtn = document.querySelector('#modify-date-btn');
const modifyDateInput = document.querySelector('#date-input');

modifySelector.addEventListener('change', function(e) {
    if (e.target.value === 'tipo')  {
        console.log(1)
        tipoForm.style.display = 'flex';
        dataForm.style.display = 'none';
    } else if (e.target.value === 'date') {
        tipoForm.style.display = 'none';
        dataForm.style.display = 'flex';
    }
})

modifyDateBtn.addEventListener('click', function(e) {
    if(modifyDateInput.value === '') {
        alert('Por favor, insira uma data válida!')
    } else {
        fetch(`https://class-presence-backend.onrender.com/api/attendances/${attendanceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('authorization')
            },
            body: JSON.stringify({ date: modifyDateInput.value })
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
});