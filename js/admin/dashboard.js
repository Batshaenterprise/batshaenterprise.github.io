import { getLearners } from '../data/storage.js';
import { escapeHtml } from '../learners/validators.js';
const rows = document.getElementById('learnerRows');
const refreshBtn = document.getElementById('refreshLearners');
const exportBtn = document.getElementById('exportLearners');
function renderLearners() {
  const learners = getLearners();
  rows.innerHTML = learners.length ? learners.map((learner) => `<tr><td>${escapeHtml(learner.username)}</td><td>${escapeHtml(learner.phone)}</td><td>${escapeHtml(learner.programme)}</td></tr>`).join('') : '<tr><td colspan="3">No learner records yet.</td></tr>';
}
function exportCSV() {
  const learners = getLearners(); const header = ['Username','Phone','Programme']; const body = learners.map((learner) => [learner.username, learner.phone, learner.programme]);
  const csv = [header, ...body].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('
');
  const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'batshas-learners.csv'; link.click(); URL.revokeObjectURL(url);
}
refreshBtn?.addEventListener('click', renderLearners); exportBtn?.addEventListener('click', exportCSV); renderLearners();
