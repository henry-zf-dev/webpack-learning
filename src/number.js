function number() {
  const div = document.createElement('div');
  div.setAttribute('id', 'number');
  div.innerHTML = '1000';
  document.body.append(div);
}

export default number;