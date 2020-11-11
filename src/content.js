function Content() {
	const dom = document.getElementById('root');
	const content = document.createElement('div');
	content.innerText = 'content';
	dom.append(content);
}

module.exports = Content;