
const container = document.querySelector(".container");
const btnSignIn = document.getElementById("btn-sign-in");
const btnSignUp = document.getElementById("btn-sign-up");

btnSignIn.addEventListener("click", () => container.classList.remove("toggle"));
btnSignUp.addEventListener("click", () => container.classList.add("toggle"));


class SistemaFormularios {
  constructor(tipo) {
    this.tipo = tipo;
  }

  mostrarMensaje(msj) {
    console.log(`[${this.tipo}] ${msj}`);
  }
}


class Formulario extends SistemaFormularios {
  constructor(form, tipo) {
    super(tipo); 
    this.form = form;
  }

  procesar() {
    
    this.mostrarMensaje("Procesando formulario genérico...");
  }
}


class FormularioInicioSesion extends Formulario {
  procesar() {
    const email = this.form.querySelector('input[placeholder="Email"]').value.trim();
    const password = this.form.querySelector('input[placeholder="Password"]').value.trim();
    const storedData = JSON.parse(localStorage.getItem(email));

    if (storedData && storedData.password === password) {
      alert(`✅ Bienvenido ${email}\nFecha de nacimiento: ${storedData.fechaNacimiento}`);
    } else {
      alert("❌ Email o contraseña incorrectos");
    }
  }
}


class FormularioRegistro extends Formulario {
  procesar() {
    const nombre = this.form.querySelector('input[placeholder="Nombre"]').value.trim();
    const email = this.form.querySelector('input[placeholder="Email"]').value.trim();
    const password = this.form.querySelector('input[placeholder="Password"]').value.trim();
    const dia = parseInt(this.form.querySelector('input[placeholder="Día"]').value.trim());
    const mes = parseInt(this.form.querySelector('input[placeholder="Mes"]').value.trim());
    const ano = parseInt(this.form.querySelector('input[placeholder="Año"]').value.trim());

    if (!nombre || !email || !password || !dia || !mes || !ano) {
      alert("⚠️ Todos los campos son obligatorios");
      return;
    }

    if (
      isNaN(dia) || dia < 1 || dia > 31 ||
      isNaN(mes) || mes < 1 || mes > 12 ||
      isNaN(ano) || ano < 1900 || ano > new Date().getFullYear()
    ) {
      alert("⚠️ Fecha inválida");
      return;
    }

    if (localStorage.getItem(email)) {
      alert("⚠️ El usuario ya existe con este email");
      return;
    }

    const fechaNacimiento = new Date(ano, mes - 1, dia).toISOString().split("T")[0];
    const userData = { nombre, password, fechaNacimiento };

    localStorage.setItem(email, JSON.stringify(userData));
    alert(`✅ Usuario registrado con éxito: ${nombre}`);
    container.classList.remove("toggle");
  }
}


const formularios = [
  { selector: ".sign-in", clase: FormularioInicioSesion, tipo: "Inicio de sesión" },
  { selector: ".sign-up", clase: FormularioRegistro, tipo: "Registro" }
];

formularios.forEach(({ selector, clase, tipo }) => {
  const formElement = document.querySelector(selector);
  const formulario = new clase(formElement, tipo); 

  formElement.addEventListener("submit", (e) => {
    e.preventDefault();
    formulario.procesar(); 
  });
});
