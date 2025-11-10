// === basket.js ===

// Элементы интерфейса
const basketValue = document.querySelector('.header__navigation-basket-text');
const basketList = document.querySelector('.basket__list');

// === LocalStorage helpers ===
const getCount = article => parseInt(localStorage.getItem(`count_${article}`)) || 0;
const setCount = (article, count) => localStorage.setItem(`count_${article}`, count.toString());

// Получаем все товары из localStorage
const getAllProductsFromStorage = () => {
  const products = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('count_')) {
      const article = key.replace('count_', '');
      const count = getCount(article);
      if (count > 0) {
        const productData = localStorage.getItem(`product_${article}`);
        if (productData) {
          products[article] = {
            ...JSON.parse(productData),
            quantity: count.toString()
          };
        }
      }
    }
  }
  return products;
};

// Сохраняем данные товара
const saveProductDataToStorage = (article, productData) => {
  localStorage.setItem(`product_${article}`, JSON.stringify({
    img: productData.img,
    productName: productData.productName,
    price: productData.price
  }));
};

// === Обновление счётчика корзины ===
const updateBasketDisplay = () => {
  const allProducts = getAllProductsFromStorage();
  const totalQuantity = Object.values(allProducts)
    .reduce((sum, p) => sum + (parseInt(p.quantity) || 0), 0);

  if (basketValue) {
    basketValue.style.display = totalQuantity > 0 ? 'flex' : 'none';
    basketValue.textContent = totalQuantity;
  }
};

// === Отрисовка товаров в корзине ===
const viewItemBasket = () => {
  if (!basketList) return;
  basketList.innerHTML = '';

  const allProducts = getAllProductsFromStorage();
  const entries = Object.entries(allProducts);

  if (entries.length === 0) {
    basketList.innerHTML = '<div class="basket__empty">Корзина пуста</div>';
    return;
  }

  entries.forEach(([article, product]) => {
    const basketItem = document.createElement('li');
    basketItem.className = 'card__item card__item--basket';
    basketItem.dataset.article = article;
    basketItem.innerHTML = `
      <img src="${product.img}" alt="${product.productName}" class="basket__item-img">
      <div class="card__content card__content--basket">
        <div class="card__item-text card__item-text--basket">
          <h5>${product.productName}</h5>
        </div>
        <div class="card__item-price card__item-price--basket">
          <span class="card__item-price-value">${product.price}₽</span>
          <!-- кнопка скрыта, только для совместимости -->
          <button class="card__item-price-button" type="button" style="display:none">
            <svg style="pointer-events:none">
              <use xlink:href="img/icons/sprite.svg#shopping_basket"></use>
            </svg>
          </button>
          <div class="card__item-price-button-block button-click show">
            <button class="button-click__less" type="button"><span>-</span></button>
            <span class="button-click__text">${product.quantity}</span>
            <button class="button-click__more" type="button"><span>+</span></button>
          </div>
        </div>
      </div>`;
    basketList.appendChild(basketItem);
  });
};

// === Инициализация карточек на страницах ===
const priceTest = () => {
  const cards = document.querySelectorAll('.card__item');
  if (!cards.length) return;

  cards.forEach(card => {
    const article = card.dataset.article;
    const count = getCount(article);
    const priceButton = card.querySelector('.card__item-price-button');
    const buttonClick = card.querySelector('.button-click');
    const buttonText = card.querySelector('.button-click__text');

    if (count > 0) {
      if (priceButton) priceButton.style.display = 'none';
      if (buttonClick) buttonClick.classList.add('show');
      if (buttonText) buttonText.textContent = count;
      buttonText.style.opacity = '1';
    } else {
      if (priceButton) priceButton.style.display = '';
      if (buttonClick) buttonClick.classList.remove('show');
      if (buttonText) buttonText.textContent = '0';
      buttonText.style.opacity = '0';
    }
  });

  updateBasketDisplay();
};

// === Делегирование кликов (главная + корзина) ===
document.addEventListener('click', e => {
  const target = e.target;

  const btnPrice = target.closest('.card__item-price-button');
  const btnLess = target.closest('.button-click__less');
  const btnMore = target.closest('.button-click__more');
  if (!btnPrice && !btnLess && !btnMore) return;

  const card = target.closest('.card__item');
  if (!card) return;
  const article = card.dataset.article;

  let count = getCount(article);
  const buttonClick = card.querySelector('.button-click');
  const buttonText = card.querySelector('.button-click__text');
  const priceButton = card.querySelector('.card__item-price-button');

  const isInBasket = !!card.closest('.basket__list');

  // === Добавление товара ===
  if (btnPrice) {
    count = count > 0 ? count : 1;
    setCount(article, count);
    localStorage.setItem(`clickPriceButton_${article}`, 'true');

    const img = card.querySelector('img')?.src || '';
    const title = card.querySelector('.card__item-text h5')?.textContent.trim() || '';
    const price = card.querySelector('.card__item-price-value')?.textContent.replace(/[^\d,.]/g, '') || '0';
    saveProductDataToStorage(article, { img, productName: title, price });

    if (priceButton) priceButton.style.display = 'none';
    if (buttonClick) buttonClick.classList.add('show');
    if (buttonText) buttonText.textContent = count;
    buttonText.style.opacity = '1';

    updateBasketDisplay();
    viewItemBasket();
    return;
  }

  // === Уменьшение количества ===
  if (btnLess) {
    if (count > 1) {
      count--;
      setCount(article, count);
      if (buttonText) buttonText.textContent = count;
    } else {
      // Удаление товара
      setCount(article, 0);
      localStorage.setItem(`clickPriceButton_${article}`, 'false');
      localStorage.removeItem(`product_${article}`);

      if (isInBasket) {
        card.remove(); // удаляем только из корзины
      } else {
        // на главной: сбрасываем состояние кнопок
        if (priceButton) priceButton.style.display = '';
        if (buttonClick) buttonClick.classList.remove('show');
        if (buttonText) buttonText.textContent = '0';
        buttonText.style.opacity = '0';
      }
    }

    updateBasketDisplay();
    viewItemBasket();
    return;
  }

  // === Увеличение количества ===
  if (btnMore) {
    count++;
    setCount(article, count);
    if (buttonText) buttonText.textContent = count;
    updateBasketDisplay();
    viewItemBasket();
  }
});

// === Экспорт ===

