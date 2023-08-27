const reportButton = document.querySelector('#reportGeral');

const makeReport = () => {
    fetch(`https://causal-scorpion-rapidly.ngrok-free.app/api/attendances/?count=true&studentId=${JSON.parse(localStorage.getItem('user')).id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('authorization'),
            'ngrok-skip-browser-warning': 'true'
        }
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
        .then(att => {
            let writing = '';
            Object.entries(att).forEach(([nome, faltas]) => {
                writing += `${nome}: DE ${faltas.presente + faltas.ausente + faltas.atrasado + faltas.fj} PERÍODOS FORAM: {
                    PRESENTE: ${faltas.presente}
                    ATRASADO: ${faltas.atrasado}
                    AUSENTE: ${faltas.ausente}
                    FALTA JUSTIFICADA: ${faltas.fj}
                }
`
            });
            alert(writing);
        });
}

reportButton.addEventListener('click', makeReport);