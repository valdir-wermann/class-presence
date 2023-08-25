const excludeClassButton = document.querySelector('#excluir-turma');

const deleteClass = () => {
    const confirm = prompt(`Essa ação é irreversível. Se quiser continuar essa ação, digite [${Class.name}] e confirme.`);
    if (confirm === Class.name) {
        fetch(`https://causal-scorpion-rapidly.ngrok-free.app/api/classes/${Class._id}`, {
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
                    alert('Você não tem permissão para fazer isso. Redirecionando para a página inicial!');
                    window.location.assign('/frontend/home/teacher');
                }
            })
            .then(() => {
                alert('Turma deletada com sucesso! Redirecionando para a página inicial!');
                window.location.assign('/frontend/home/teacher');
            });
    }
}

excludeClassButton.addEventListener('click', deleteClass);