// Trata a submissão do formulário de autenticação
todoForm.onsubmit = function (event) {
  event.preventDefault(); // Evita o redirecionamento da página
  if (todoForm.name.value != "") {
    let data = {
      name: todoForm.name.value,
      nameLowerCase: todoForm.name.value.toLowerCase()
    };

    dbRefUsers
      .child(firebase.auth().currentUser.uid)
      .push(data)
      .then(function () {
        console.log('Tarefa "' + data.name + '" adicionada com sucesso');
      })
      .catch(function () {
        showError("Falha ao adicionar tarefa. (use no máximo 30 caracteres):", error);
      });
    todoForm.name.value = "";
  } else {
    alert("O nome da tarefa não pode ser em branco para criar a tarefa!");
  }
};

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
      nameLowerCase: newValue.toLowerCase()
    };
    dbRefUsers
      .child(firebase.auth().currentUser.uid)
      .child(key)
      .update(data)
      .then(function () {
        console.log("Tarefa '" + data.name + "'atualizada com sucesso");
      })
      .catch(function (error) {
        showError("Falha ao atualizar tarefa. (use no máximo 30 caracteres):", error);
      });
  } else {
    alert("O nome da tarefa não pode estar em branco ao atualizar");
  }
}
