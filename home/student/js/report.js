const reportButton = document.querySelector('#reportGeral');

const makeReport = () => {
    fetch(`http://localhost:3000/api/attendances/?count=true&studentId=${JSON.parse(localStorage.getItem('user')).id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': localStorage.getItem('authorization')
        }
    })
        .then(res => {
            if (res.ok) return res.json();
            if (res.status === 401 || res.status === 403) {
                alert('Você não tem permissão para visualizar essa turma. Te redirecionando para sua página inicial.');
                window.location.assign('../home/teacher');
            }
            throw new Error(res);
        })
        .then(att => {
            let writing = '';
            Object.entries(att).forEach(([nome, faltas]) => {
                writing += `${nome}: DE ${faltas.presente + faltas.ausente + faltas.atrasado} PERÍODOS FORAM: {
                    PRESENTE: ${faltas.presente}
                    ATRASADO: ${faltas.atrasado}
                    AUSENTE: ${faltas.ausente}
                }
`
            });
            alert(writing);
        });
}

reportButton.addEventListener('click', makeReport);