function Header() {
	const dom = document.getElementById('root');
	const header = document.createElement('div');
	header.innerText = 'header';
	dom.append(header);
}

module.exports = Header;