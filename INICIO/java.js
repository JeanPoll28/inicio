
class Descuento {
  constructor(subtotal) {
    this.subtotal = subtotal;
  }

  aplicar() {
    
    return 0;
  }
}


class CuponDescuento extends Descuento {
  constructor(subtotal, codigo) {
    super(subtotal); 
    this.codigo = codigo;
  }

  
  aplicar() {
    return 0;
  }
}


class Descuento10 extends CuponDescuento {
  aplicar() {
    return this.subtotal * 0.10;
  }
}


class Descuento20 extends CuponDescuento {
  aplicar() {
    return this.subtotal * 0.20;
  }
}


class DescuentoInvalido extends CuponDescuento {
  aplicar() {
    alert("❌ Cupón inválido. Intenta con DESCUENTO10 o DESCUENTO20.");
    return 0;
  }
}



const applyCouponBtn = document.getElementById("applyCoupon");
const couponInput = document.getElementById("couponInput");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");
const summaryDiv = document.querySelector(".summary");

const carrito = JSON.parse(localStorage.getItem("carrito")) || [];


summaryDiv.querySelectorAll(".product").forEach(div => div.remove());

carrito.forEach(item => {
  const div = document.createElement("div");
  div.classList.add("product");
  div.innerHTML = `
    <img src="${item.imagen}" alt="${item.nombre}" width="60" />
    <div>
      <p><strong>${item.nombre}</strong><br />Cantidad: ${item.cantidad}</p>
      <p>S/${(item.precio * item.cantidad).toFixed(2)}</p>
    </div>
  `;
  summaryDiv.insertBefore(div, summaryDiv.querySelector(".apply-coupon"));
});

let subtotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
subtotalEl.textContent = `S/${subtotal.toFixed(2)}`;
totalEl.textContent = `S/${subtotal.toFixed(2)}`;

let descuentoAplicado = false;

applyCouponBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const code = couponInput.value.trim().toUpperCase();

  if (descuentoAplicado) {
    alert("⚠️ Ya aplicaste un cupón de descuento.");
    return;
  }

  let cupon;

  
  if (code === "DESCUENTO10") {
    cupon = new Descuento10(subtotal, code);
  } else if (code === "DESCUENTO20") {
    cupon = new Descuento20(subtotal, code);
  } else {
    cupon = new DescuentoInvalido(subtotal, code);
  }

  const descuento = cupon.aplicar(); 

  if (descuento > 0) {
    descuentoAplicado = true;
    const porcentaje = descuento === subtotal * 0.10 ? 10 : 20;
    alert(`✅ Cupón válido, ${porcentaje}% de descuento aplicado.`);

    const totalConDescuento = subtotal - descuento;
    totalEl.textContent = `S/${totalConDescuento.toFixed(2)}`;
  }
});
