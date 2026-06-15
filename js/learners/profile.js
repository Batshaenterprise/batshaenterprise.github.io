import { clearCurrentLearner, getCurrentLearner } from '../data/storage.js';
import { sanitizeText } from './validators.js';

const panel = document.getElementById('profilePanel');
const learner = getCurrentLearner();

const createLink = (href, text, className = 'btn') => {
  const link = document.createElement('a');
  link.className = className;
  link.href = href;
  link.textContent = text;
  return link;
};

const createDetail = (label, value) => {
  const item = document.createElement('div');
  item.className = 'profile-detail';

  const labelEl = document.createElement('span');
  labelEl.textContent = label;

  const valueEl = document.createElement('strong');
  valueEl.textContent = sanitizeText(value) || 'Not provided';

  item.append(labelEl, valueEl);
  return item;
};

if (panel) {
  panel.replaceChildren();

  if (!learner) {
    const empty = document.createElement('div');
    empty.className = 'profile-empty';

    const message = document.createElement('p');
    message.className = 'muted';
    message.textContent = 'No learner is currently logged in.';

    const actions = document.createElement('div');
    actions.className = 'form-actions profile-actions';
    actions.append(createLink('login.html', 'Login', 'btn btn-red'), createLink('register.html', 'Register'));

    empty.append(message, actions);
    panel.appendChild(empty);
  } else {
    const summary = document.createElement('div');
    summary.className = 'profile-summary';

    const avatar = document.createElement('div');
    avatar.className = 'profile-avatar';
    avatar.textContent = sanitizeText(learner.name || learner.username || 'L').charAt(0).toUpperCase();

    const heading = document.createElement('div');
    const eyebrow = document.createElement('span');
    eyebrow.textContent = 'Active learner profile';
    const name = document.createElement('h2');
    name.textContent = sanitizeText(learner.username);
    heading.append(eyebrow, name);
    summary.append(avatar, heading);

    const details = document.createElement('div');
    details.className = 'profile-details';
    details.append(
      createDetail('Full Name', learner.username),
      createDetail('Phone Number', learner.phone),
      createDetail('Email Address', learner.email),
      createDetail('House Address', learner.address),
      createDetail('Province', learner.province)
    );

    const actions = document.createElement('div');
    actions.className = 'form-actions profile-actions';
    const logout = document.createElement('button');
    logout.className = 'btn btn-red';
    logout.type = 'button';
    logout.id = 'logoutBtn';
    logout.textContent = 'Logout';
    actions.append(createLink('learners.html', 'Back to learners'), logout);

    panel.append(summary, details, actions);

    logout.addEventListener('click', () => {
      clearCurrentLearner();
      window.location.href = 'login.html';
    });
  }
}
