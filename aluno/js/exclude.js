const exclude = (e) => {
    const ans = prompt('Você tem certeza que deseja excluir essa presença? Se você fizer isso, todas as outras presenças dessa aula serão excluídas! Digite 1 para exlcuir e 0 para voltar.');

    if (ans == 1) {
        const id = e.target.id;
        fetch(`http://localhost:3000/api/attendances/${id}`, {
            method: 'DELETE',
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
            .then(() => {
                alert('Aula deletada com sucesso!');
                window.location.reload();
            })
    }
}