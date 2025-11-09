const cards = document.querySelectorAll('.card__item');
const basketValue = document.querySelector('.header__navigation-basket-text');
const basketList = document.querySelector('.basket__list');

const cardProperty = {};

// Функция для обновления данных карточек
const cardPropertyFun = () => {
  cards.forEach(card => {
    const cardName = card.dataset.article;

    const imgElement = card.querySelector('img');
    const titleElement = card.querySelector('.card__item-text h5');
    const priceElement = card.querySelector('.card__item-price-value');
    const quantityElement = card.querySelector('.button-click__text');

    cardProperty[cardName] = {
      img: imgElement ? imgElement.src : '',
      productName: titleElement ? titleElement.textContent.trim() : '',
      price: priceElement ? priceElement.textContent.replace(/[^\d,.]/g, '').trim() : '',
      quantity: quantityElement ? quantityElement.textContent.trim() : '0',
    };
  });
};

const updateBasketDisplay = () => {
  const totalQuantity = Object.values(cardProperty)
    .reduce((sum, product) => sum + (parseInt(product.quantity) || 0), 0);

  console.log('Общее количество товаров:', totalQuantity);

  if (basketValue) {
    if (totalQuantity > 0) {
      basketValue.style.display = 'flex';
      basketValue.textContent = totalQuantity;
    } else {
      basketValue.style.display = 'none';
    }
  }
};

const priceTest = () => {
  if (!cards || cards.length === 0) {
    console.log('Карточки товаров не найдены для инициализации');
    return;
  }

  cardPropertyFun();
  updateBasketDisplay();

  cards.forEach(cardItem => {
    const priceButton = cardItem.querySelector('.card__item-price-button');
    const cardArticle = cardItem.dataset.article;
    const buttonClick = cardItem.querySelector('.button-click');
    const buttonText = cardItem.querySelector('.button-click__text');

    let count = parseInt(localStorage.getItem(`count_${cardArticle}`)) || 0;

    const clickPriceButton = () => {
      if (priceButton) priceButton.style.display = 'none';
      if (buttonClick) buttonClick.classList.add('show');
      if (buttonText) {
        buttonText.style.opacity = '1';
        buttonText.textContent = count;
      }
    };

    const resetClickPriceButton = () => {
      count = 0;
      if (buttonText) buttonText.textContent = '0';
      localStorage.setItem(`clickPriceButton_${cardArticle}`, 'false');
      localStorage.setItem(`count_${cardArticle}`, '0');
      if (priceButton) priceButton.style.display = '';
      if (buttonClick) buttonClick.classList.remove('show');
      if (buttonText) buttonText.style.opacity = '';

      cardPropertyFun();
      updateBasketDisplay();
    };

    if (localStorage.getItem(`clickPriceButton_${cardArticle}`) === 'true' && count > 0) {
      clickPriceButton();
    } else {
      resetClickPriceButton();
    }

    if (priceButton) {
      priceButton.addEventListener('click', () => {
        count = 1;
        localStorage.setItem(`clickPriceButton_${cardArticle}`, 'true');
        localStorage.setItem(`count_${cardArticle}`, count.toString());
        clickPriceButton();

        cardPropertyFun();
        updateBasketDisplay();
      });
    }

    const lessBtn = cardItem.querySelector('.button-click__less');
    const moreBtn = cardItem.querySelector('.button-click__more');

    if (lessBtn) {
      lessBtn.addEventListener('click', () => {
        if (count > 1) {
          count--;
          if (buttonText) buttonText.textContent = count;
          localStorage.setItem(`count_${cardArticle}`, count.toString());

          cardPropertyFun();
          updateBasketDisplay();
        } else {
          resetClickPriceButton();
        }
      });
    }

    if (moreBtn) {
      moreBtn.addEventListener('click', () => {
        count++;
        if (buttonText) buttonText.textContent = count;
        localStorage.setItem(`count_${cardArticle}`, count.toString());

        cardPropertyFun();
        updateBasketDisplay();
      });
    }

    setTimeout(() => {
      resetClickPriceButton();
    }, 600000);
  });
};

const viewItemBasket = () => {
  if (basketList) {
    // Очищаем корзину
    basketList.innerHTML = '';

    // Проверяем все товары в cardProperty
    let hasItems = false;

    Object.entries(cardProperty).forEach(([article, product]) => {
      const quantity = parseInt(product.quantity) || 0;

      if (quantity > 0) {
        hasItems = true;

        // Создаем элемент корзины
        const basketItem = document.createElement('li');
        basketItem.className = 'card__item card__item--basket';
        basketItem.innerHTML = `
            <img src="${product.img}" alt="${product.productName}" class="basket__item-img">
            <div class="card__content card__content--basket">
              <div class="card__item-text card__item-text--basket">
                <h5>${product.productName}</h5>
              </div>
              <div class="card__item-price card__item-price--basket">
                <span class="card__item-price-value">${product.price}₽</span>
                <button class="card__item-price-button" type="button">
                  <svg>
                    <use xlink:href="img/icons/sprite.svg#shopping_basket">
                  </svg>
                </button>
                <div class="card__item-price-button-block button-click">
                  <button class="button-click__less" type="button">
                    <span>-</span>
                  </button>
                  <span class="button-click__text">0</span>
                  <button class="button-click__more" type="button">
                    <span>+</span>
                  </button>
                </div>
              </div>
            </div>
            `;

        basketList.appendChild(basketItem);
      }
    });

    // Если товаров нет, показываем сообщение
    if (!hasItems) {
      basketList.innerHTML = '<div class="basket__empty">Корзина пуста</div>';
    }
  }
};

// Функция для обновления отображения корзины при изменениях
const updateBasketView = () => {
  cardPropertyFun();
  updateBasketDisplay();
  viewItemBasket();
};

