// public/cond8-dev.js

document.fonts.ready.then(() => {
	document.documentElement.classList.add('fonts-loaded');
});

Promise.race([document.fonts.ready, new Promise(res => setTimeout(res, 1000))]).then(() => {
	document.documentElement.classList.add('fonts-loaded');
});

// cond8-client.js
document.addEventListener('click', e => {
	const button = e.target.closest('button[data-copy]');
	if (!button) return;

	const value = button.getAttribute('data-copy');
	if (!value) return;

	navigator.clipboard
		.writeText(value)
		.then(() => {
			const originalText = button.textContent;
			button.textContent = 'Copied!';
			setTimeout(() => {
				button.textContent = originalText;
			}, 1000);
		})
		.catch(err => console.error('Clipboard copy failed:', err));
});
