const lessonReport = (e) => {
    console.log(e);
    fetch(`https://class-presence-backend.onrender.com/api/attendances/lessonAttendance/${e.target.id}`, {
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
            var blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
            var url = URL.createObjectURL(blob);

            var pom = document.createElement('a');
            pom.href = url;
            pom.setAttribute('download', `Relatório Aula - ${Date.now()}`);
            pom.click();
        })
}