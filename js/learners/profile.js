import { getCurrentLearner, clearCurrentLearner } from '../data/storage.js';
import { escapeHtml } from './validators.js';
const panel = document.getElementById('profilePanel');
const learner = getCurrentLearner();
if (panel) {
  if (!learner) {
    panel.innerHTML = '<p class="muted">No learner is currently logged in.</p><div class="form-actions"><a class="btn btn-red" href="login.html">Login</a><a class="btn" href="register.html">Register</a></div>';
  } else {
    panel.innerHTML = `<div class="form-row"><label>Username</label><input value="${escapeHtml(learner.username)}" readonly></div><div class="form-row"><label>Phone Number</label><input value="${escapeHtml(learner.phone)}" readonly></div><div class="form-row"><label>Programme Interest</label><input value="${escapeHtml(learner.programme)}" readonly></div><div class="form-actions"><a class="btn" href="learners.html">Back to learners</a><button class="btn btn-red" id="logoutBtn">Logout</button></div>`;
    document.getElementById('logoutBtn').addEventListener('click', () => { clearCurrentLearner(); window.location.href = 'login.html'; });
  }
}
