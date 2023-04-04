// Trata a submissão do formulário de autenticação
todoForm.onsubmit = function (event) {
  event.preventDefault(); // Evita o redirecionamento da página

  if (todoForm.name.value != "") {
    let file = todoForm.file.files[0]; // Seleciona o primeiro aquivo da seleção de aquivos
    if (file != null) {
      // Verifica se o arquivo foi selecionado
      if (file.type.includes("image")) {
        // Verifica se o arquivo é uma imagem
        // Compõe o nome do arquivo
        let imgName = firebase.database().ref().push().key + "-" + file.name;
        // Compõe o caminho do arquivo
        let imgPath =
          "todoListFiles/" + firebase.auth().currentUser.uid + "/" + imgName;

        // Cria uma referência de arquivo usando o caminho criado na linha acima
        let storageRef = firebase.storage().ref(imgPath);

        // Inicia o processo de upload
        let = upload = storageRef.put(file);

        trackUpload(upload);
      } else {
        alert("O arquivo selecionado não é uma imagem");
      }
    }

    let data = {
      name: todoForm.name.value,
      nameLowerCase: todoForm.name.value.toLowerCase(),
    };

    dbRefUsers
      .child(firebase.auth().currentUser.uid)
      .push(data)
      .then(function () {
        console.log('Tarefa "' + data.name + '" adicionada com sucesso');
      })
      .catch(function () {
        showError(
          "Falha ao adicionar tarefa. (use no máximo 30 caracteres):",
          error
        );
      });
    todoForm.name.value = "";
  } else {
    alert("O nome da tarefa não pode ser em branco para criar a tarefa!");
  }
};

// Rastreia o progresso de upload
function trackUpload(upload) {
  showItem(progressFeedback);
  upload.on(
    "state_changed",
    function (snapshot) {
      // Segundo argumento: Recebe informações sobre o upload
      console.log(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100 + "%"
      );
      progress.value = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    },
    function (error) {
      // Terceiro argumento: Função executada em caso de erro no upload
      showError(error, "Falha no upload da imagem");
    },
    function () {
      // Quarto argumento: Função executada em caso de sucesso no upload
      console.log("Sucesso no upload");
    }
  );
}
hideItem(progressFeedback);

// Exibe a lista de tartefas do usuário
function fillTodoList(dataSnapshot) {
  ulTodoList.innerHTML = "";

  let num = dataSnapshot.numChildren();
  todoCount.innerHTML = num + (num > 1 ? " Tarefas" : " Tarefa") + ":"; //Exibe na interface o número de tarefas
  dataSnapshot.forEach(function (item) {
    let value = item.val();
    let li = document.createElement("li"); //Cria um elemneto do tipo li
    let spanLi = document.createElement("span"); //Cria um elemento do tipo span
    spanLi.appendChild(document.createTextNode(value.name)); //Adiciona elemento de texto dentro da span
    spanLi.id = item.key; //Define o id do spanLi como chave da tarefa
    li.appendChild(spanLi); //Adiciona a span dentro da li

    let liUpdateBtn = document.createElement("button"); //Cria um botão para editar as tarefas
    liUpdateBtn.appendChild(document.createTextNode("Editar")); //Adiciona o texto do botão
    liUpdateBtn.setAttribute("onclick", 'updateTodo("' + item.key + '")'); //Configura o onclick do botão de editar tarefas
    liUpdateBtn.setAttribute("class", "alternative todoBtn"); //Define classes de style para o botão de editar
    li.appendChild(liUpdateBtn); //Adiciona o botão de remoção dentro da li

    let liRemoveBtn = document.createElement("button"); //Cria um botão para remoção da tarefa
    liRemoveBtn.appendChild(document.createTextNode("Excluir")); //Adiciona o texto do botão
    liRemoveBtn.setAttribute("onclick", 'removeTodo("' + item.key + '")'); //Configura o onclick do botão de remover tarefas
    liRemoveBtn.setAttribute("class", "danger todoBtn"); //Defini classes de style para o botão de remoção
    li.appendChild(liRemoveBtn); //Adiciona o botão de remoção dentro da li

    ulTodoList.appendChild(li); //Adiciona a li dentro da ul
  });
}

// Remove uma tarefa
function removeTodo(key) {
  let selectedItem = document.getElementById(key);
  let confirmation = confirm(
    "Realmente deseja remover a tarefa:  '" + selectedItem.innerHTML + "' ?"
  );
  if (confirmation) {
    dbRefUsers
      .child(firebase.auth().currentUser.uid)
      .child(key)
      .remove()
      .then(function () {
        console.log("Tarefa removida com sucesso");
      })
      .catch(function () {
        showError("Falha ao remover tarefa", error);
      });
  }
}

// Atualiza uma tarefa
function updateTodo(key) {
  let selectedItem = document.getElementById(key);
  let newValue = prompt(
    'Informe o novo nome para a tarefa "' + selectedItem.innerHTML + '".',
    selectedItem.innerHTML
  );
  if (newValue && newValue != "") {
    let data = {
      name: newValue,
      nameLowerCase: newValue.toLowerCase(),
    };
    dbRefUsers
      .child(firebase.auth().currentUser.uid)
      .child(key)
      .update(data)
      .then(function () {
        console.log("Tarefa '" + data.name + "'atualizada com sucesso");
      })
      .catch(function (error) {
        showError(
          "Falha ao atualizar tarefa. (use no máximo 30 caracteres):",
          error
        );
      });
  } else {
    alert("O nome da tarefa não pode estar em branco ao atualizar");
  }
}
