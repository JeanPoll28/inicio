document.addEventListener('DOMContentLoaded', function () {


  class AccionUsuario {
    realizarAccion() {
      console.log("Ejecutando una acción general del usuario...");
    }
  }

  class AccionFormulario extends AccionUsuario {
    validarCampo(campo, mensajeError) {
      if (!campo.value.trim()) {
        alert(mensajeError);
        return false;
      }
      return true;
    }
  }

  class AccionBuscar extends AccionFormulario {
    constructor(input) {
      super();
      this.input = input;
    }

    realizarAccion() {
      if (!this.validarCampo(this.input, 'Por favor, ingresa un término de búsqueda.')) return;
      alert('🔎 Buscando producto: ' + this.input.value.trim());
      this.input.value = '';
    }
  }


  class AccionSuscribirse extends AccionFormulario {
    constructor(emailInput, privacyCheck, msg) {
      super();
      this.emailInput = emailInput;
      this.privacyCheck = privacyCheck;
      this.msg = msg;
    }

    realizarAccion() {
      const email = this.emailInput.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email)) {
        this.msg.style.color = '#ff6f6f';
        this.msg.textContent = 'Por favor, ingresa un correo electrónico válido.';
        return;
      }
      if (!this.privacyCheck.checked) {
        this.msg.style.color = '#ff6f6f';
        this.msg.textContent = 'Debes aceptar la política de privacidad.';
        return;
      }
      this.msg.style.color = '#66bb6a';
      this.msg.textContent = '¡Suscripción exitosa! Gracias por registrarte.';
      this.emailInput.value = '';
      this.privacyCheck.checked = false;
    }
  }

  class AccionCompra extends AccionUsuario {
    constructor(carrito) {
      super();
      this.carrito = carrito;
    }

    calcularSubtotal() {
      return this.carrito.reduce((acc, p) => acc + (p.precio * (p.cantidad || 1)), 0);
    }
  }


  class AccionAgregarCarrito extends AccionCompra {
    constructor(carrito, producto, actualizar) {
      super(carrito);
      this.producto = producto;
      this.actualizar = actualizar;
    }

    realizarAccion() {
      const { nombre, precio, imagen } = this.producto;
      const existente = this.carrito.find(p => p.nombre === nombre);

      if (existente) {
        existente.cantidad++;
      } else {
        this.carrito.push({ nombre, precio, imagen, cantidad: 1 });
      }

      localStorage.setItem('carrito', JSON.stringify(this.carrito));
      this.actualizar();
      console.log(`🛍️ Producto agregado: ${nombre}`);
    }
  }

  class AccionAplicarCupon extends AccionCompra {
    constructor(carrito, input, totalEl) {
      super(carrito);
      this.input = input;
      this.totalEl = totalEl;
      this.descuentoAplicado = false;
    }

    realizarAccion() {
      const code = this.input.value.trim().toUpperCase();
      if (this.descuentoAplicado) {
        alert("⚠️ Solo puedes aplicar un cupón por compra.");
        return;
      }

      const subtotal = this.calcularSubtotal();
      let descuento = 0;

      switch (code) {
        case "AHORRA10": descuento = subtotal * 0.10; break;
        case "AHORRA20": descuento = subtotal * 0.20; break;
        default:
          alert("❌ Cupón no válido. Usa AHORRA10 o AHORRA20.");
          return;
      }

      this.descuentoAplicado = true;
      this.totalEl.textContent = `S/${(subtotal - descuento).toFixed(2)}`;
      alert(`✅ Cupón aplicado con éxito: -${(descuento / subtotal) * 100}%`);
    }
  }

  class AccionFinalizarCompra extends AccionCompra {
    realizarAccion() {
      alert('🎉 ¡Gracias por tu compra! Tu pedido está siendo procesado.');
      localStorage.removeItem('carrito');
      window.location.href = 'index.html';
    }
  }

  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const subtotalEl = document.getElementById('subtotal');
  const cartCountEl = document.getElementById('cartCount');
  const cartPanel = document.getElementById('cartPanel');

  function actualizarCarrito() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    carrito.forEach((p, i) => {
      subtotal += p.precio * (p.cantidad || 1);
      const item = document.createElement('div');
      item.classList.add('cart-item');
      item.innerHTML = `
        <img src="${p.imagen}" alt="${p.nombre}">
        <div>
          <h4>${p.nombre}</h4>
          <p>Cantidad: ${p.cantidad}</p>
          <p>S/${(p.precio * p.cantidad).toFixed(2)}</p>
        </div>
        <button class="removeBtn" data-index="${i}">🗑️</button>
      `;
      cartItemsContainer.appendChild(item);
    });

    subtotalEl.textContent = `S/${subtotal.toFixed(2)}`;
    cartCountEl.textContent = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  }

  actualizarCarrito();


  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchHeader');
  if (searchBtn) {
    const accionBuscar = new AccionBuscar(searchInput);
    searchBtn.addEventListener('click', () => accionBuscar.realizarAccion());
  }

  const newsletterForm = document.getElementById('newsletterForm');
  const emailInput = document.getElementById('emailInput');
  const privacyCheck = document.getElementById('privacyCheck');
  const subscribeMsg = document.getElementById('subscribeMsg');
  if (newsletterForm) {
    const accionSuscribir = new AccionSuscribirse(emailInput, privacyCheck, subscribeMsg);
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      accionSuscribir.realizarAccion();
    });
  }


  document.querySelectorAll('.product-card').forEach((card) => {
    const btn = card.querySelector('.addCart');
    const producto = {
      nombre: card.querySelector('h3').textContent,
      precio: parseFloat(card.querySelector('.price').textContent.replace(/[^\d\.]/g, '')),
      imagen: card.querySelector('img').src
    };
    const accionAgregar = new AccionAgregarCarrito(carrito, producto, actualizarCarrito);
    btn.addEventListener('click', () => {
      accionAgregar.realizarAccion();
      btn.textContent = 'Agregado ✓';
      setTimeout(() => btn.textContent = 'Agregar', 900);
    });
  });


  const applyCouponBtn = document.getElementById('applyCoupon');
  const couponInput = document.getElementById('couponInput');
  const totalEl = document.getElementById('total');
  if (applyCouponBtn) {
    const accionCupon = new AccionAplicarCupon(carrito, couponInput, totalEl);
    applyCouponBtn.addEventListener('click', (e) => {
      e.preventDefault();
      accionCupon.realizarAccion();
    });
  }

  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    const accionFinalizar = new AccionFinalizarCompra(carrito);
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      accionFinalizar.realizarAccion();
    });
  }

  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn && cartPanel) {
    cartBtn.addEventListener('click', () => {
      cartPanel.classList.toggle('hidden');
    });
  }

});
