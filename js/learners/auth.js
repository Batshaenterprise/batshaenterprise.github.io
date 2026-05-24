import { addLearner, findLearnerByLogin, learnerExists, setCurrentLearner } from '../data/storage.js';
import { isStrongPassword, isValidPhone, sanitizeText, showNotice } from './validators.js';
const registerForm = document.getElementById('registerForm');
const loginBtn = document.getElementById('loginBtn');
if (registerForm) {
  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const password = document.getElementById('regPass').value;
    const confirmPassword = document.getElementById('regPassConfirm').value;
    const learner = { username: sanitizeText(document.getElementById('regUsername').value), phone: sanitizeText(document.getElementById('regPhone').value), programme: sanitizeText(document.getElementById('regProgramme').value), password };
    if (!learner.username) return showNotice('regNotice', 'Enter a username.');
    if (!isValidPhone(learner.phone)) return showNotice('regNotice', 'Enter a valid phone number.');
    if (!isStrongPassword(password)) return showNotice('regNotice', 'Password must be 15 to 128 characters long.');
    if (password !== confirmPassword) return showNotice('regNotice', 'Passwords must match before the account can be created.');
    if (learnerExists(learner.username, learner.phone)) return showNotice('regNotice', 'A learner with that phone number or username already exists.');
    addLearner(learner); setCurrentLearner(learner); showNotice('regNotice', 'Learner profile created. Redirecting to your profile...'); registerForm.reset(); setTimeout(() => { window.location.href = 'profile.html'; }, 700);
  });
}
if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    const login = sanitizeText(document.getElementById('loginPhone').value); const password = document.getElementById('loginPass').value; const learner = findLearnerByLogin(login, password);
    if (!learner) return showNotice('loginNotice', 'No matching learner found in this browser demo.');
    setCurrentLearner(learner); showNotice('loginNotice', `Welcome back, ${learner.username}. Redirecting...`); setTimeout(() => { window.location.href = 'profile.html'; }, 700);
  });
}
