const registrarPresencaBtn = document.querySelector('#registrar-presenca');

registrarPresencaBtn.addEventListener('click', () => window.location.assign(`${window.location.origin}/class-presence/class/registrar?id=` + params.id));