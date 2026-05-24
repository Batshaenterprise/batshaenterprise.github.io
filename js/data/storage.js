const LEARNERS_KEY = 'batshasLearners';
const SESSION_KEY = 'batshasCurrentLearner';
export function getLearners() { return JSON.parse(localStorage.getItem(LEARNERS_KEY) || '[]'); }
export function saveLearners(learners) { localStorage.setItem(LEARNERS_KEY, JSON.stringify(learners)); }
export function addLearner(learner) { const learners = getLearners(); learners.push(learner); saveLearners(learners); }
function normalizePhone(phoneNumber = '') { return phoneNumber.replace(/[\s-]/g, ''); }
export function findLearnerByLogin(login, password) { const phone = normalizePhone(login); return getLearners().find((learner) => normalizePhone(learner.phone) === phone && learner.password === password); }
export function learnerExists(username, phoneNumber) { const phone = normalizePhone(phoneNumber); return getLearners().some((learner) => learner.username === username || normalizePhone(learner.phone) === phone); }
export function setCurrentLearner(learner) { localStorage.setItem(SESSION_KEY, JSON.stringify(learner)); }
export function getCurrentLearner() { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
export function clearCurrentLearner() { localStorage.removeItem(SESSION_KEY); }
