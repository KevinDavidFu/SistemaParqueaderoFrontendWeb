class Toast {
  show(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  success(message) {
    this.show(message, 'success');
  }

  error(message) {
    this.show(message, 'error');
  }

  info(message) {
    this.show(message, 'info');
  }
}

export default new Toast();

export const validateEmail = (email) => {
  if (!email) return { valid: true };
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return { valid: false, message: 'Email inválido' };
  }
  return { valid: true };
};

export const validatePrecio = (precio) => {
  const num = parseFloat(precio);
  if (isNaN(num) || num <= 0) {
    return { valid: false, message: 'El precio debe ser mayor a 0' };
  }
  return { valid: true };
};