import { addLearner, findLearnerByLogin, learnerExists, setCurrentLearner } from '../data/storage.js';
import { isStrongPassword, isValidEmail, isValidPhone, sanitizeText, showNotice } from './validators.js';
const registerForm = document.getElementById('registerForm');
const loginBtn = document.getElementById('loginBtn');

const hashPassword = async (password) => {
  if (!window.crypto?.subtle) {
    let hash = 2166136261;
    for (const char of password) {
      hash ^= char.charCodeAt(0);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return `fallback:${(hash >>> 0).toString(16)}`;
  }
  const data = new TextEncoder().encode(password);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

if (registerForm) {
  const stepEls = [...registerForm.querySelectorAll('[data-register-step]')];
  const indicatorEls = [...registerForm.querySelectorAll('[data-step-indicator]')];
  const nextBtn = document.getElementById('registerNext');
  const backBtn = document.getElementById('registerBack');
  const submitBtn = document.getElementById('registerSubmit');
  const terms = document.getElementById('regTerms');
  const summary = document.getElementById('registerSummary');
  let currentStep = 1;
  let autoAdvanceTimer;

  const fields = [
    ['regName', 'Name'],
    ['regSurname', 'Surname'],
    ['regPhone', 'Phone Number'],
    ['regAddress', 'House Address'],
    ['regProvince', 'Province'],
    ['regEmail', 'Email Address'],
    ['regPass', 'Password'],
    ['regPassConfirm', 'Confirm Password']
  ];

  const getValue = (id) => sanitizeText(document.getElementById(id)?.value);
  const getStepFieldIds = (step) => fields.slice(step === 1 ? 0 : 4, step === 1 ? 4 : 8).map(([id]) => id);
  const titleCaseFieldIds = ['regName', 'regSurname', 'regAddress', 'regProvince'];
  const toTitleCase = (value) => sanitizeText(value).toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
  const formatTitleCaseFields = () => {
    titleCaseFieldIds.forEach((id) => {
      const field = document.getElementById(id);
      if (field) field.value = toTitleCase(field.value);
    });
  };

  const validateStep = (step, showErrors = false) => {
    const missingField = getStepFieldIds(step).find((id) => !getValue(id));
    if (missingField) {
      if (showErrors) showNotice('regNotice', 'Complete all visible fields before continuing.');
      return false;
    }

    if (step === 1 && !isValidPhone(getValue('regPhone'))) {
      if (showErrors) showNotice('regNotice', 'Enter a valid phone number.');
      return false;
    }

    if (step === 2 && !isValidEmail(getValue('regEmail'))) {
      if (showErrors) showNotice('regNotice', 'Enter a valid email address.');
      return false;
    }

    if (step === 2 && !isStrongPassword(document.getElementById('regPass').value)) {
      if (showErrors) showNotice('regNotice', 'Password must be 15 to 128 characters long.');
      return false;
    }

    if (step === 2 && document.getElementById('regPass').value !== document.getElementById('regPassConfirm').value) {
      if (showErrors) showNotice('regNotice', 'Passwords must match before the account can be created.');
      return false;
    }

    if (showErrors) showNotice('regNotice', '');
    return true;
  };

  const renderSummary = () => {
    summary.replaceChildren();
    fields.forEach(([id, label]) => {
      const value = id.toLowerCase().includes('pass') ? 'Hidden for security' : getValue(id);
      const targetStep = Number(id === 'regName' || id === 'regSurname' || id === 'regPhone' || id === 'regAddress' ? 1 : 2);
      const item = document.createElement('div');
      const itemLabel = document.createElement('span');
      const itemValue = document.createElement('strong');
      const editButton = document.createElement('button');

      item.className = 'confirm-item';
      itemLabel.textContent = label;
      itemValue.textContent = value;
      editButton.type = 'button';
      editButton.dataset.editStep = String(targetStep);
      editButton.textContent = 'Edit';
      item.append(itemLabel, itemValue, editButton);
      summary.appendChild(item);
    });
  };

  const updateStep = (step) => {
    currentStep = step;
    stepEls.forEach((element) => element.classList.toggle('is-active', Number(element.dataset.registerStep) === step));
    indicatorEls.forEach((element) => element.classList.toggle('is-active', Number(element.dataset.stepIndicator) === step));
    backBtn.hidden = step === 1;
    nextBtn.hidden = step === 3;
    submitBtn.hidden = step !== 3;
    if (step === 3) renderSummary();
    updateButtons();
  };

  const updateButtons = () => {
    if (currentStep < 3) nextBtn.disabled = !validateStep(currentStep);
    if (currentStep === 3) submitBtn.disabled = !terms.checked;
  };

  const scheduleAutoAdvance = () => {
    clearTimeout(autoAdvanceTimer);
    if (currentStep >= 3 || !validateStep(currentStep)) return;
    autoAdvanceTimer = setTimeout(() => updateStep(currentStep + 1), 450);
  };

  registerForm.addEventListener('input', () => {
    updateButtons();
    scheduleAutoAdvance();
  });
  titleCaseFieldIds.forEach((id) => {
    document.getElementById(id)?.addEventListener('blur', formatTitleCaseFields);
  });
  terms.addEventListener('change', updateButtons);
  nextBtn.addEventListener('click', () => {
    if (!validateStep(currentStep, true)) return;
    updateStep(currentStep + 1);
  });
  backBtn.addEventListener('click', () => updateStep(Math.max(1, currentStep - 1)));
  summary.addEventListener('click', (event) => {
    const editButton = event.target.closest('[data-edit-step]');
    if (editButton) updateStep(Number(editButton.dataset.editStep));
  });

  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const password = document.getElementById('regPass').value;
    const confirmPassword = document.getElementById('regPassConfirm').value;
    formatTitleCaseFields();
    if (!validateStep(1, true) || !validateStep(2, true)) return;
    if (!terms.checked) return showNotice('regNotice', 'Agree to the Terms & Conditions before registering.');
    const learner = {
      name: getValue('regName'),
      surname: getValue('regSurname'),
      username: `${getValue('regName')} ${getValue('regSurname')}`,
      phone: getValue('regPhone'),
      address: getValue('regAddress'),
      province: getValue('regProvince'),
      email: getValue('regEmail').toLowerCase(),
      programme: 'Learner Profile',
      passwordHash: await hashPassword(password)
    };
    if (!learner.name || !learner.surname) return showNotice('regNotice', 'Enter your name and surname.');
    if (!isValidPhone(learner.phone)) return showNotice('regNotice', 'Enter a valid phone number.');
    if (!isValidEmail(learner.email)) return showNotice('regNotice', 'Enter a valid email address.');
    if (!isStrongPassword(password)) return showNotice('regNotice', 'Password must be 15 to 128 characters long.');
    if (password !== confirmPassword) return showNotice('regNotice', 'Passwords must match before the account can be created.');
    if (learnerExists(learner.username, learner.phone, learner.email)) return showNotice('regNotice', 'A learner with that name, phone number, or email already exists.');
    addLearner(learner); setCurrentLearner(learner); showNotice('regNotice', 'Learner profile created. Redirecting to your profile...'); registerForm.reset(); setTimeout(() => { window.location.href = 'profile.html'; }, 700);
  });

  updateStep(1);
}
if (loginBtn) {
  loginBtn.addEventListener('click', async () => {
    const login = sanitizeText(document.getElementById('loginPhone').value); const password = document.getElementById('loginPass').value; const learner = findLearnerByLogin(login, await hashPassword(password), password);
    if (!learner) return showNotice('loginNotice', 'No matching learner found in this browser demo.');
    setCurrentLearner(learner); showNotice('loginNotice', `Welcome back, ${learner.username}. Redirecting...`); setTimeout(() => { window.location.href = 'profile.html'; }, 700);
  });
}
