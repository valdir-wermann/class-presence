const listaAlunosBtn = document.querySelector('#lista-alunos');

const listaAlunos = (e) => {
    fetch(`https://causal-scorpion-rapidly.ngrok-free.app/api/classes/student_list/${params.id}`, {
        method: 'GET',
        headers: {
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
            alert('Algo deu errado. Tente novamente ou revise o campo de digitação!');
            throw new Error(res);
        })
        .then(async (data) => {
            try {
                await navigator.clipboard.writeText(data);
                alert('A lista de alunos foi copiada para sua área de transferência.');
            } catch (error) {
                alert('Algo deu errado. Tente novamente mais tarde.');
                console.log(error);
            }
        });
}

listaAlunosBtn.addEventListener('click', listaAlunos);