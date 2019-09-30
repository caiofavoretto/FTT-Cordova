const users = [];
const gridId = 'myGrid';

const searchUser = async () => {
  const inputValue = document.getElementById('inputUser').value;
  document.getElementById('inputUser').value = '';

  if (!inputValue) {
    alert('Digite um usuário');
    return;
  }

  try {
    const [userData, reposData] = await Promise.all([
      axios.get(`https://api.github.com/users/${inputValue}`),
      axios.get(`https://api.github.com/users/${inputValue}/repos?sort=stars`)
    ]);

    console.log(userData);
    console.log(reposData);

    const { name, bio, avatar_url, login } = userData.data;

    const userExists = users.filter(user => {
      return user.login === login;
    });

    if (userExists.length) {
      alert('Usuário já cadastrado');
      return;
    }

    const repos = reposData.data.map(repo => {
      const { name, html_url, stargazers_count, language } = repo;
      return { name, html_url, stargazers_count, language };
    });

    if (repos.length > 4) {
      repos.splice(4, repos.length - 4);
    }

    users.push({
      name,
      bio,
      avatar_url,
      login,
      repos
    });

    updateGrid();
  } catch {
    alert('Usuário não encontrado');
  }
};

const removeUser = login => {
  const userLogin = users.map(user => user.login);
  const index = userLogin.indexOf(login);
  users.splice(index, 1);

  updateGrid();
};

const openDetails = login => {
  users.map(user => {
    if (user.login !== login) {
      closeDetails(user.login);
    }
  });

  const card = document.getElementById(`card-${login}`);

  card.classList.add('card-open');
  card.innerHTML = '';

  const userLogin = users.filter(user => user.login === login)[0];

  let html = /*html*/ `
      <button 
      onclick="closeDetails('${userLogin.login}');" 
      type="button" 
      class="back-btn">
        🡠
      </button>
      <h1 class="repos-title">Repositórios de ${userLogin.name}</h1>
      <ul>
  `;

  userLogin.repos.map(repo => {
    html += /*html*/ `    
      <a href="${repo.html_url}" target="_blank">
        <li class="repo-info">
          <strong>${repo.name}</strong>
          <span>${repo.language ? repo.language : 'Desconhecida'}</span>
          <span><span class="star">🟊</span> ${repo.stargazers_count}</span>
        </li>
      </a> 
    `;
  });

  html += /*html*/ `
    </ul>
  `;

  insertHTML(card, html);
};

const closeDetails = login => {
  const card = document.getElementById(`card-${login}`);

  card.classList.remove('card-open');
  card.innerHTML = '';

  const userLogin = users.filter(user => user.login === login)[0];

  const html = /*html*/ `
    <button 
    onclick="removeUser('${userLogin.login}');" 
    type="button" 
    class="close-btn">
      &#215;
    </button>
    <img onclick="openDetails('${userLogin.login}');" 
      src="${userLogin.avatar_url}" alt="${userLogin.name}" />
    <strong class="user-name">
      ${userLogin.name ? userLogin.name : userLogin.login}
    </strong>
    <span class="user-bio">
      ${userLogin.bio ? userLogin.bio : 'sem descrição'}
    </span>
  `;

  insertHTML(card, html);
};

const updateGrid = () => {
  const grid = document.getElementById(gridId);

  grid.innerHTML = '';

  users.map(user => {
    const html = /*html*/ `
        <div id="card-${user.login}" class="card">
          <button 
          onclick="removeUser('${user.login}');" 
          type="button" 
          class="close-btn">
            &#215;
          </button>
          <img onclick="openDetails('${user.login}');" 
           src="${user.avatar_url}" alt="${user.name}" />
           <strong class="user-name">
            ${user.name ? user.name : user.login}
          </strong>
          <span class="user-bio">
            ${user.bio ? user.bio : 'sem descrição'}
          </span>
        </div>
      `;

    insertHTML(grid, html, 0);
  });

  if (users.length) {
    document.getElementById('myForm').style.marginTop = '50px';
  } else {
    document.getElementById('myForm').style.marginTop = 'calc(50vh - 41px)';
  }
};

const insertHTML = (element, html, delay = 200) => {
  setTimeout(() => {
    element.insertAdjacentHTML('beforeend', html);
  }, delay);
};
