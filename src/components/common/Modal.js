class Modal {
  show(title, content, onConfirm = null) {
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) existingModal.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="modalCancel">Cancelar</button>
        ${onConfirm ? '<button class="btn btn-primary" id="modalConfirm">Confirmar</button>' : ''}
      </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    setTimeout(() => overlay.classList.add('show'), 10);
    
    const close = () => {
      overlay.classList.remove('show');
      setTimeout(() => overlay.remove(), 300);
    };
    
    overlay.querySelector('.modal-close').onclick = close;
    overlay.querySelector('#modalCancel').onclick = close;
    
    if (onConfirm) {
      overlay.querySelector('#modalConfirm').onclick = () => {
        onConfirm();
        close();
      };
    }
    
    overlay.onclick = (e) => {
      if (e.target === overlay) close();
    };
  }

  confirm(title, message, onConfirm) {
    this.show(title, `<p>${message}</p>`, onConfirm);
  }
}

export default new Modal();

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