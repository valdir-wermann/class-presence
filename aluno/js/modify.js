const modifySelector = document.querySelector(`#info-select`);
const tipoForm = document.querySelector(`#tipo-form`);
const dataForm = document.querySelector(`#data-form`);
const descForm = document.querySelector('#desc-form');
const periodsForm = document.querySelector('#periods-form');

const modifyDateInput = document.querySelector('#date-input');
const modifyDescInput = document.querySelector('#desc-input');
const modifyPeriodsInput = document.querySelector('#periods-input');

const modifyDateBtn = document.querySelector('#modify-date-btn');
const modifyDescBtn = document.querySelector('#modify-desc-btn');
const modifyPeriodsBtn = document.querySelector('#modify-periods-btn');


modifySelector.addEventListener('change', function(e) {
    [tipoForm, dataForm, descForm, periodsForm].forEach(form => form.style.display = 'none');
    if (e.target.value === 'tipo')  {
        tipoForm.style.display = 'flex';
    } else if (e.target.value === 'date') {
        dataForm.style.display = 'flex';
    } else if (e.target.value === 'desc') {
        descForm.style.display = 'flex';
    } else if (e.target.value === 'periods') {
        periodsForm.style.display = 'flex';
    }
});

const modifyFunction = (input, name) => {
        if(input.value === '') {
            alert('Por favor, insira um valor válido!')
        } else {
            let body = {};
            body[name] = input.value;
            fetch(`https://class-presence-backend.onrender.com/api/attendances/${attendanceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('authorization')
                },
                body: JSON.stringify(body)
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
    }

modifyDateBtn.addEventListener('click', () => modifyFunction(modifyDateInput, 'date'));
modifyDescBtn.addEventListener('click', () => modifyFunction(modifyDescInput, 'desc'));
modifyPeriodsBtn.addEventListener('click', () => modifyFunction(modifyPeriodsInput, 'periods'));