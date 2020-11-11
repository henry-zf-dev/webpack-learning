function Sidebar() {
	const dom = document.getElementById('root');
	const sidebar = document.createElement('div');
	sidebar.innerText = 'sidebar';
	dom.append(sidebar);
}

module.exports = Sidebar;