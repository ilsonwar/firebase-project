// Defindo referências para elementos da página
let authForm = document.getElementById("authForm");
let authFormTitle = document.getElementById("authFormTitle");
let register = document.getElementById("register");
let access = document.getElementById("access");

let loading = document.getElementById("loading");

let auth = document.getElementById("auth");
let userContent = document.getElementById("userContent");

let userEmail = document.getElementById("userEmail");

let sendEmailVerificationDiv = document.getElementById(
  "sendEmailVerificationDiv"
);
let emailVerified = document.getElementById("emailVerified");

let passwordReset = document.getElementById("passwordReset");

let userName = document.getElementById("userName");
let userImg = document.getElementById("userImg");

let todoForm = document.getElementById("todoForm");
let todoCount = document.getElementById("todoCount");
let ulTodoList = document.getElementById("ulTodoList");
// Alterar o formulário de autenticação para o cadastro de novas contas
function toggleToRegister() {
  authForm.submitAuthForm.innerHTML = "Cadastrar conta";
  authFormTitle.innerHTML = "Insira seus dados para se cadastrar";
  hideItem(register); // Esconder atalho para cadastrar conta
  hideItem(passwordReset); // Esconder a opção de redefinição de senha
  showItem(access); // Mostrar atalho para acessar conta
}

// Alterar o formulário de autenticação para o acesso de contas já existentes
function toggleToAccess() {
  authForm.submitAuthForm.innerHTML = "Acessar";
  authFormTitle.innerHTML = "Acesse a sua conta para continuar";
  hideItem(access); // Esconder atalho para acessar conta
  showItem(passwordReset); // Mostrar a opção de redefinição de senha
  showItem(register); // Mostrar atalho para cadastrar conta
}

// Simplifica a exibição de elementos da página
function showItem(element) {
  element.style.display = "block";
}

// Simplifica a remoção de elementos da página
function hideItem(element) {
  element.style.display = "none";
}

// Mostrar conteúdo para usuários autenticados
function showUserContent(user) {
  console.log(user);
  if (user.providerData[0].providerId != "password") {
    emailVerified.innerHTML =
      "Autenticação por provedor confiável, não é necessário verificar e-mail";
    hideItem(sendEmailVerificationDiv);
  } else {
    if (user.emailVerified) {
      emailVerified.innerHTML = "E-mail verificado";
      hideItem(sendEmailVerificationDiv);
    } else {
      emailVerified.innerHTML = "E-mail não verificado";
      showItem(sendEmailVerificationDiv);
    }
  }

  userImg.src = user.photoURL ? user.photoURL : "img/unknownUser.png";
  userName.innerHTML = user.displayName;
  userEmail.innerHTML = user.email;
  hideItem(auth);

  dbRefUsers.child(firebase.auth().currentUser.uid).on('value', function(dataSnapshot){
    fillTodoList(dataSnapshot)
  })

  showItem(userContent);
}

// Mostrar conteúdo para usuários não autenticados
function showAuth() {
  authForm.email.value = "";
  authForm.password.value = "";
  hideItem(userContent);
  showItem(auth);
}

//centralizar e traduzir erros
function showError(prefix, error) {
  console.log(error.code);
  hideItem(loading);

  switch (error.code) {
    case "auth/invalid-email":
      alert(prefix + " " + "E-mail inválido!");
      break;
    case "auth/wrong-password":
      alert(prefix + " " + "Senha inválida!");
      break;
    case "auth/weak-password":
      alert(prefix + " " + "Senha deve ter ao menos 6 caracteres!");
      break;
    case "auth/email-already-in-use":
      alert(prefix + " " + "E-mail já está em uso por outra conta!");
      break;
    case "auth/popup-closed-by-user":
      alert(
        prefix +
          " " +
          "O popup de autenticação foi fechado antes da operação ser concluída!"
      );
      break;

    default:
      alert(prefix + " " + error.message);
  }
}

// Atributos extras de configuração de e-mail
let actionCodeSettings = {
  url: "https://todolist-52f95.firebaseapp.com/",
};

let database = firebase.database();
let dbRefUsers = firebase.database().ref("users");
