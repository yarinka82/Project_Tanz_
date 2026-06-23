import { accordeonRules } from './accordeonRules.js';
import renderRules from './renderRules.js';

renderRules();
document.addEventListener('click', (e)=> accordeonRules(e))