const reportButton = document.querySelector('#reportGeral');

const makeReport = () => {
    fetch(`https://causal-scorpion-rapidly.ngrok-free.app/api/attendances/?count=true&studentId=${params.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': localStorage.getItem('authorization')
        },
        mode: 'no-cors'
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