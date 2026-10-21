/**
 * AUD-016: escape a value for interpolation into HTML text or a quoted
 * attribute (e-mail templates). null / undefined become "" so a missing field
 * no longer prints "undefined".
 */
const HTML_ESCAPES = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;",
};

const escapeHtml = (value) =>
	value === null || value === undefined ? "" : String(value).replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);

module.exports = { escapeHtml };
