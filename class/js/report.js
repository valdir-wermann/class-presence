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
            var wb = XLSX.utils.book_new();
            wb.Props = {
                Title: `Relatório - ${params.id} - ${Date.now()}`,
                Subject: "",
                Author: "ClassPresence",
                CreatedDate: new Date()
            };
            wb.SheetNames.push(params.id);
            var ws = XLSX.utils.aoa_to_sheet(content);
            wb.Sheets[params.id] = ws;

            var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
            function s2ab(s) {
                var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
                var view = new Uint8Array(buf);  //create uint8array as viewer
                for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
                return buf;
            }

            saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), `${params.id}-${Date.now()}.xlsx`);
        })
}

openModalBtn.addEventListener('click', () => reportModal.style.visibility = 'visible');
closeModalBtn.addEventListener('click', () => reportModal.style.visibility = 'hidden');
generateReportBtn.addEventListener('click', generateReport);