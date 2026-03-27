// ---- ANSI Color Utility ----
// Native replacement for the 'colors' npm package.

const ESC = '\x1b[';
const RESET = `${ESC}0m`;

module.exports = {
	yellow: ( text ) => `${ESC}33m${text}${RESET}`,
	red: ( text ) => `${ESC}31m${text}${RESET}`,
	green: ( text ) => `${ESC}32m${text}${RESET}`,
	grey: ( text ) => `${ESC}90m${text}${RESET}`,
	bgYellow: ( text ) => `${ESC}43m${text}${RESET}`
};
