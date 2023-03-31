// Trata a submissão do formulário de autenticação
todoForm.onsubmit = function (event) {
  event.preventDefault(); // Evita o redirecionamento da página
  if (todoForm.name.value != "") {
    let data = {
      name: todoForm.name.value,
    };

    dbRef
      .child(firebase.auth().currentUser.uid)
      .push(data)
      .then(function () {
        console.log('Tarefa "' + data.name + '" adicionada com sucesso');
      });
  } else {
    alert("O nome da tarefa não pode ser em branco para criar a tarefa!");
  }
};
