const users = [];
const gridId = 'myGrid';

const searchUser = async () => {
  const inputValue = document.getElementById('inputUser').value;

  if (!inputValue) {
    alert('Digite um usuário');
    return;
  }

  try {
    const response = await axios.get(
      `https://api.github.com/users/${inputValue}`
    );
    console.log(response.data);

    const { name, bio, avatar_url, login } = response.data;

    const userExists = users.filter(user => {
      return user === login;
    });

    if (userExists.length) {
      alert('Usuário já cadastrado');
      return;
    }

    const html = /*html*/ `
      <a href="https://github.com/${login}" target="_blank">
        <div id="card-${login}" class="card">
          <img src="${avatar_url}" alt="${name}" />
          <strong>${name ? name : login}</strong>
          <span>${bio ? bio : 'sem descrição'}</span>
        </div>
      </a>
    `;

    document.getElementById(gridId).insertAdjacentHTML('beforeend', html);
    users.push(login);

    if (users.length) {
      document.getElementById('myForm').style.marginTop = '50px';
    }
  } catch {
    alert('Usuário não encontrado');
  }
};
