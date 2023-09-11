const lessonReport = (e) => {
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
            var wb = XLSX.utils.book_new();
            wb.Props = {
                Title: `Relatório - ${e.target.id} - ${Date.now()}`,
                Subject: "",
                Author: "ClassPresence",
                CreatedDate: new Date()
            };
            wb.SheetNames.push(e.target.id);
            var ws = XLSX.utils.aoa_to_sheet(content);
            wb.Sheets[e.target.id] = ws;

            var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
            function s2ab(s) {
                var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
                var view = new Uint8Array(buf);  //create uint8array as viewer
                for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
                return buf;
            }

            saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), `${e.target.id}-${Date.now()}.xlsx`);
        })
}