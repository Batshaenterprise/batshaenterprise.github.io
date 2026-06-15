const LEARNERS_KEY = 'batshasLearners';
const SESSION_KEY = 'batshasCurrentLearner';

function parseStoredJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

function parseSessionJson(key, fallback) {
  try {
    return JSON.parse(sessionStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    sessionStorage.removeItem(key);
    return fallback;
  }
}

export function getLearners() { const learners = parseStoredJson(LEARNERS_KEY, []); return Array.isArray(learners) ? learners : []; }
export function saveLearners(learners) { localStorage.setItem(LEARNERS_KEY, JSON.stringify(learners)); }
export function addLearner(learner) {
  const learners = getLearners();
  const { password, ...storedLearner } = learner;
  learners.push(storedLearner);
  saveLearners(learners);
}
function normalizePhone(phoneNumber = '') { return phoneNumber.replace(/[\s-]/g, ''); }
export function findLearnerByLogin(login, passwordHash, legacyPassword = '') {
  const phone = normalizePhone(login);
  return getLearners().find((learner) => normalizePhone(learner.phone) === phone && (learner.passwordHash === passwordHash || (!learner.passwordHash && learner.password === legacyPassword)));
}
export function learnerExists(username, phoneNumber, emailAddress = '') {
  const phone = normalizePhone(phoneNumber);
  const email = String(emailAddress || '').toLowerCase();
  return getLearners().some((learner) => learner.username === username || normalizePhone(learner.phone) === phone || (email && String(learner.email || '').toLowerCase() === email));
}
export function setCurrentLearner(learner) {
  const { password, passwordHash, ...sessionLearner } = learner;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionLearner));
  localStorage.removeItem(SESSION_KEY);
}
export function getCurrentLearner() {
  const activeLearner = parseSessionJson(SESSION_KEY, null);
  if (activeLearner) return activeLearner;
  const legacyLearner = parseStoredJson(SESSION_KEY, null);
  if (legacyLearner) setCurrentLearner(legacyLearner);
  return legacyLearner;
}
export function clearCurrentLearner() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
}
