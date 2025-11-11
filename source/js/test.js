const basketButtonDOMEl = document.querySelector('.header__navigation-basket-link');
const basketMainDOMEl = document.querySelector('.basket');
const cardsDOMEl = document.querySelectorAll('.card__item');
const basketListDOMEl = document.querySelector('.basket__list');

const openBasket = () => {
    basketButtonDOMEl.addEventListener('click', () => {
        basketMainDOMEl.classList.toggle('basket--active');
    });
};

const cardProperty = {};

const priceButtonClickON = (priceButton, buttonClick, buttonText) => {
    priceButton.style.display = 'none';
    buttonClick.classList.add('show');
    buttonText.style.opacity = '1';
    buttonText.textContent = '1';
};

const priceButtonClickOff = (priceButton, buttonClick, buttonText) => {
    priceButton.style.display = 'block';
    buttonClick.classList.remove('show');
    buttonText.style.opacity = '0';
};

const saveCardProperty = () => {
    localStorage.setItem('cardProperty', JSON.stringify(cardProperty));
};

const restoreCardState = () => {
    const savedData = JSON.parse(localStorage.getItem('cardProperty')) || {};
    Object.assign(cardProperty, savedData);

    cardsDOMEl.forEach(cardItem => {
        const cardArticle = cardItem.dataset.article;

        if (localStorage.getItem(`clickPriceButton_${cardArticle}`) === 'true') {
            const priceButton = cardItem.querySelector('.card__item-price-button');
            const priceBlock = priceButton ? priceButton.closest('.card__item-price') : null;
            const buttonClick = priceBlock ? priceBlock.querySelector('.button-click') : null;
            const buttonText = priceBlock ? priceBlock.querySelector('.button-click__text') : null;

            priceButtonClickON(priceButton, buttonClick, buttonText);

            if (cardProperty[cardArticle] && buttonText) {
                buttonText.textContent = cardProperty[cardArticle].quantity || '1';
            }
        }
    });
};

const resetCardState = () => {
    cardsDOMEl.forEach(cardItem => {
        const cardArticle = cardItem.dataset.article;
        localStorage.setItem(`clickPriceButton_${cardArticle}`, 'false');

        const priceButton = cardItem.querySelector('.card__item-price-button');
        const priceBlock = priceButton ? priceButton.closest('.card__item-price') : null;
        const buttonClick = priceBlock ? priceBlock.querySelector('.button-click') : null;
        const buttonText = priceBlock ? priceBlock.querySelector('.button-click__text') : null;

        priceButtonClickOff(priceButton, buttonClick, buttonText);
    });

    localStorage.removeItem('cardProperty');
};

const basket = () => {
    restoreCardState();

    // Функция для обновления количества товаров в корзине
    function valueBasket() {
        const retrievedUser = JSON.parse(localStorage.getItem('cardProperty'));
        const basketValue = document.querySelector('.header__navigation-basket-text');

        const totalQuantity = Object.values(retrievedUser).reduce((sum, product) => sum + (parseInt(product.quantity) || 0), 0);

        if (totalQuantity > 0) {
            basketValue.style.display = 'flex';
            basketValue.textContent = totalQuantity;
        } else {
            basketValue.style.display = 'none';
        }
    }

    // Клик по кнопке "Купить"
    document.addEventListener('click', (event) => {
        const target = event.target;
        const cardItem = target.closest('.card__item');
        const priceButton = target.closest('.card__item-price-button');
        if (!cardItem || !priceButton) return;

        const priceBlock = cardItem.querySelector('.card__item-price');
        const buttonClick = priceBlock.querySelector('.button-click');
        const buttonText = priceBlock.querySelector('.button-click__text');
        const cardArticle = cardItem.dataset.article;

        cardProperty[cardArticle] = {
            img: cardItem.querySelector('img')?.src || '',
            productName: cardItem.querySelector('.card__item-text h5')?.textContent.trim() || '',
            price: cardItem.querySelector('.card__item-price-value')?.textContent.replace(/[^\d,.]/g, '').trim() || '',
            quantity: '1'
        };

        saveCardProperty();
        valueBasket();
        localStorage.setItem(`clickPriceButton_${cardArticle}`, 'true');
        priceButtonClickON(priceButton, buttonClick, buttonText);
        cardInBasket();
    });

    // Кнопки +/- для каждой карточки
    cardsDOMEl.forEach(cardItem => {
    const lessBtn = cardItem.querySelector('.button-click__less');
    const moreBtn = cardItem.querySelector('.button-click__more');
    const buttonText = cardItem.querySelector('.button-click__text');
    const cardArticle = cardItem.dataset.article;

    const priceButton = cardItem.querySelector('.card__item-price-button');
    const priceBlock = cardItem.querySelector('.card__item-price');
    const buttonClick = priceBlock ? priceBlock.querySelector('.button-click') : null;

    if (lessBtn) {
        lessBtn.addEventListener('click', () => {
            let count = cardProperty[cardArticle] ? Number(cardProperty[cardArticle].quantity) : 1;

            if (count > 1) {
                count--;
                buttonText.textContent = count;
                cardProperty[cardArticle].quantity = count.toString();
                saveCardProperty();
                valueBasket();
            } else {
                priceButtonClickOff(priceButton, buttonClick, buttonText);
                localStorage.setItem(`clickPriceButton_${cardArticle}`, 'false');
                delete cardProperty[cardArticle];
                saveCardProperty();
                valueBasket();
                cardInBasket();
            }
        });
    }

    if (moreBtn) {
        moreBtn.addEventListener('click', () => {
            let count = cardProperty[cardArticle] ? Number(cardProperty[cardArticle].quantity) : 1;
            count++;
            buttonText.textContent = count;
            cardProperty[cardArticle].quantity = count.toString();
            saveCardProperty();
            valueBasket();
            cardInBasket();
        });
    }
  });

  const cardInBasket = () => {
    if (basketListDOMEl) { 
        basketListDOMEl.innerHTML = '';

        Object.entries(cardProperty).forEach(([article, product]) => {
            const quantity = parseInt(product.quantity) || 0;

            if (quantity > 0) {
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
                        <button class="card__item-price-button" type="button">
                        <svg>
                            <use xlink:href="img/icons/sprite.svg#shopping_basket">
                        </svg>
                        </button>
                        <div class="card__item-price-button-block button-click">
                        <button class="button-click__less" type="button">
                            <span>-</span>
                        </button>
                        <span class="button-click__text">${quantity}</span>
                        <button class="button-click__more" type="button">
                            <span>+</span>
                        </button>
                        </div>
                    </div>
                    </div>
                    `;
                basketListDOMEl.appendChild(basketItem);
            }
            
        });
    } else {
        console.error('Элемент basket__list не найден'); 
    }
  };
    

    valueBasket();
    cardInBasket();

    // Сбрасываем через 10 минут
    setTimeout(() => {
        resetCardState();
        valueBasket();
    }, 600000);
};

export {basket, openBasket};
