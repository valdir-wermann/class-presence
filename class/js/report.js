const openModalBtn = document.querySelector('#relatorio-presencas');
const closeModalBtn = document.querySelector('#fechar-report');
const reportModal = document.querySelector('#report-modal');
const startInput = document.querySelector('#start-report');
const endInput = document.querySelector('#end-report');
const generateReportBtn = document.querySelector('#report-btn');


const generateReport = () => {
    if (startInput.value === '' || endInput.value === '') return alert('Por favor, insira datas válidas!');

    fetch(`https://class-presence-backend.onrender.com/api/classes/class_report/${params.id}?start=${startInput.value}T00:00&end=${endInput.value}T23:59`, {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('authorization')
        }
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
        .then((content) => {
            var blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
            var url = URL.createObjectURL(blob);

            var pom = document.createElement('a');
            pom.href = url;
            pom.setAttribute('download', `${params.id}-${Date.now()}`);
            pom.click();
            closeModalBtn.click();
            startInput.value = '';
            endInput.value = '';
        })
}

openModalBtn.addEventListener('click', () => reportModal.style.visibility = 'visible');
closeModalBtn.addEventListener('click', () => reportModal.style.visibility = 'hidden');
generateReportBtn.addEventListener('click', generateReport);