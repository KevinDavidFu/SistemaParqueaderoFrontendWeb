export const validatePlaca = (placa) => {
  if (!placa || placa.trim().length === 0) {
    return { valid: false, message: 'La placa es requerida' };
  }
  if (placa.length < 3 || placa.length > 15) {
    return { valid: false, message: 'La placa debe tener entre 3 y 15 caracteres' };
  }
  return { valid: true };
};

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