const excludeClassButton = document.querySelector('#excluir-turma');

const deleteClass = () => {
    const confirm = prompt(`Essa ação é irreversível. Se quiser continuar essa ação, digite [${Class.name}] e confirme.`);
    if (confirm === Class.name) {
        fetch(`https://class-presence-backend.onrender.com/api/classes/${Class._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
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
                throw new Error(res);
            })
            .then(() => {
                alert('Turma deletada com sucesso! Redirecionando para a página inicial!');
                window.location.assign(`${window.location.origin}/class-presence/home/teacher`);
            });
    }
}

excludeClassButton.addEventListener('click', deleteClass);