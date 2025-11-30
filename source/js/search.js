const button = document.querySelector('.search button');
const searchBlock = document.querySelector('.search');
const searchInput = searchBlock.querySelector('#search');

const searchActive = () => {
  button.addEventListener('click',() => {
    searchBlock.classList.toggle('search--active');
  });

  document.addEventListener('DOMContentLoaded', () => {
    initCategories();
  });

  async function initCategories() {
    const saved = localStorage.getItem('categories');

    // Уже есть — просто выходим
    if (saved) return;

    // Если мы на странице каталога — собираем сразу
    const isCatalogPage = location.pathname.includes('catalog');

    if (isCatalogPage) {
        saveCategoriesFromDOM();
        return;
    }

    // Если мы НЕ на каталоге — загружаем HTML каталога в фоне
    try {
        const res = await fetch('/catalog.html');
        const html = await res.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        saveCategoriesFromDOM(doc);
    } catch (e) {
        console.error('Ошибка загрузки каталога', e);
    }
  }

  function saveCategoriesFromDOM(root = document) {
    const items = [...root.querySelectorAll('[data-category]')];

    const categories = items.map(el => el.textContent.trim());

    if (categories.length > 0) {
        localStorage.setItem('categories', JSON.stringify(categories));
        console.log('Категории сохранены:', categories);
    }
  }

};



export {searchActive};
