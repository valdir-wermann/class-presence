const openModalBtn = document.querySelector('#relatorio-presencas');
const closeModalBtn = document.querySelector('#fechar-report');
const reportModal = document.querySelector('#report-modal');
const startInput = document.querySelector('#start-report');
const endInput = document.querySelector('#end-report');
const generateReportBtn = document.querySelector('#report-btn');


const generateReport = () => {
    if (startInput.value === '' || endInput.value === '') return alert('Por favor, insira datas válidas!');

    fetch(`https://causal-scorpion-rapidly.ngrok-free.app/api/classes/${params.id}?start=${startInput.value}T00:00&end=${endInput.value}T23:59`, {
        method: 'POST',
        headers: {
            'Authorization': localStorage.getItem('authorization'),
            'ngrok-skip-browser-warning': 'true'
        }
    })
        .then(res => {
            if (res.ok) return res.blob();
            if (res.status === 401 || res.status === 403) {
                alert('Você não tem acesso a essa ação. Redirecionando para página de login.');
                localStorage.clear();
                window.location.href = `${window.location.origin}/class-presence/login`;
            }
            alert('Algo deu errado. Tente novamente ou revise o campo de digitação!');
            throw new Error(res);
        })
        .then((blob) => {
            var a = window.document.createElement('a');

            a.href = window.URL.createObjectURL(blob, {
                type: 'text/plain'
            });
            a.download = `${params.id}-${Date.now()}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        })
}

openModalBtn.addEventListener('click', () => reportModal.style.visibility = 'visible');
closeModalBtn.addEventListener('click', () => reportModal.style.visibility = 'hidden');
generateReportBtn.addEventListener('click', generateReport);