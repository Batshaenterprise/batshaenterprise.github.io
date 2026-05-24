export function isValidPhone(phoneNumber) { return /^\+?\d[\d\s-]{7,18}$/.test(phoneNumber); }
export function isStrongPassword(password) { return typeof password === 'string' && password.length >= 15 && password.length <= 128; }
export function sanitizeText(value) { return String(value || '').replace(/[\u0000-\u001f\u007f<>]/g, '').trim(); }
export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
export function showNotice(elementId, message) { const element = document.getElementById(elementId); if (element) element.textContent = message; }
