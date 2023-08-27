const exclude = (e) => {
    const ans = prompt('Você tem certeza que deseja excluir essa presença? Se você fizer isso, todas as outras presenças dessa aula serão excluídas! Digite 1 para exlcuir e 0 para voltar.');

    if (ans == 1) {
        const id = e.target.id;
        fetch(`https://causal-scorpion-rapidly.ngrok-free.app/api/attendances/${id}`, {
            method: 'DELETE',
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
            .then(() => {
                alert('Aula deletada com sucesso!');
                window.location.reload();
            })
    }
}