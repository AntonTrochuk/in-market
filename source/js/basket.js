// basket.js

const basketButtonDOMEl = document.querySelector('.header__navigation-basket-link');
const basketMainDOMEl = document.querySelector('.basket');
const cardsDOMEl = document.querySelectorAll('.card__item');
const basketListDOMEl = document.querySelector('.basket__list');

const cardProperty = {};

// ====== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ======

const openBasket = () => {
    basketButtonDOMEl.addEventListener('click', () => {
        basketMainDOMEl.classList.toggle('basket--active');
    });
};

const priceButtonClickON = (priceButton, buttonClick, buttonText, quantity = '1') => {
    if (!priceButton || !buttonClick || !buttonText) return;
    priceButton.style.display = 'none';
    buttonClick.classList.add('show');
    buttonText.style.opacity = '1';
    buttonText.textContent = quantity;
};

const priceButtonClickOff = (priceButton, buttonClick, buttonText) => {
    if (!priceButton || !buttonClick || !buttonText) return;
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
            const priceBlock = priceButton?.closest('.card__item-price');
            const buttonClick = priceBlock?.querySelector('.button-click');
            const buttonText = priceBlock?.querySelector('.button-click__text');

            const quantity = cardProperty[cardArticle]?.quantity || '1';
            priceButtonClickON(priceButton, buttonClick, buttonText, quantity);
        }
    });
};

const resetCardState = () => {
    cardsDOMEl.forEach(cardItem => {
        const cardArticle = cardItem.dataset.article;
        localStorage.setItem(`clickPriceButton_${cardArticle}`, 'false');

        const priceButton = cardItem.querySelector('.card__item-price-button');
        const priceBlock = priceButton?.closest('.card__item-price');
        const buttonClick = priceBlock?.querySelector('.button-click');
        const buttonText = priceBlock?.querySelector('.button-click__text');

        priceButtonClickOff(priceButton, buttonClick, buttonText);
    });

    localStorage.removeItem('cardProperty');
};

// ====== ОСНОВНАЯ ЛОГИКА КОРЗИНЫ ======

const basket = () => {
    restoreCardState();

    // Загружаем данные из localStorage
    const saved = JSON.parse(localStorage.getItem('cardProperty'));
    if (saved) Object.assign(cardProperty, saved);

    // Обновление количества товаров в шапке
    function valueBasket() {
        const retrievedUser = JSON.parse(localStorage.getItem('cardProperty')) || {};
        const basketValue = document.querySelector('.header__navigation-basket-text');
        const totalQuantity = Object.values(retrievedUser)
            .reduce((sum, product) => sum + (parseInt(product.quantity) || 0), 0);

        if (totalQuantity > 0) {
            basketValue.style.display = 'flex';
            basketValue.textContent = totalQuantity;
        } else {
            basketValue.style.display = 'none';
        }
    }

    // Обновление содержимого корзины (без дерганий)
    const cardInBasket = () => {
        if (!basketListDOMEl) {
            console.error('Элемент basket__list не найден');
            return;
        }

        // Сохраняем текущее состояние открытых элементов
        const currentItems = Array.from(basketListDOMEl.children);
        
        Object.entries(cardProperty).forEach(([article, product]) => {
            const quantity = parseInt(product.quantity) || 0;

            if (quantity > 0) {
                // Ищем существующий элемент
                const existingItem = currentItems.find(item => item.dataset.article === article);
                
                if (existingItem) {
                    // Обновляем только количество и цену существующего элемента
                    const quantityElement = existingItem.querySelector('.button-click__text--in-basket');
                    if (quantityElement) {
                        quantityElement.textContent = quantity;
                    }
                } else {
                    // Создаем новый элемент только если его нет
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
                                <div class="card__item-price-button-block button-click show">
                                    <button class="button-click__less" type="button"><span>-</span></button>
                                    <span class="button-click__text button-click__text--in-basket">${quantity}</span>
                                    <button class="button-click__more" type="button"><span>+</span></button>
                                </div>
                            </div>
                        </div>
                    `;
                    basketListDOMEl.appendChild(basketItem);
                }
            } else {
                // Удаляем элемент если количество = 0
                const itemToRemove = basketListDOMEl.querySelector(`[data-article="${article}"]`);
                if (itemToRemove) {
                    itemToRemove.remove();
                }
            }
        });

        // Удаляем элементы которых больше нет в cardProperty
        const currentArticles = Object.keys(cardProperty);
        currentItems.forEach(item => {
            if (!currentArticles.includes(item.dataset.article)) {
                item.remove();
            }
        });
    };

    // Обновление количества в карточке на странице
    const updateCardQuantity = (article, quantity) => {
        const cardItem = document.querySelector(`.card__item[data-article="${article}"]`);
        if (!cardItem) return;

        const buttonText = cardItem.querySelector('.button-click__text');
        if (buttonText) {
            buttonText.textContent = quantity;
        }

        // Если количество стало 0, скрываем кнопки управления
        if (quantity === 0) {
            const priceButton = cardItem.querySelector('.card__item-price-button');
            const priceBlock = priceButton?.closest('.card__item-price');
            const buttonClick = priceBlock?.querySelector('.button-click');
            
            priceButtonClickOff(priceButton, buttonClick, buttonText);
            localStorage.setItem(`clickPriceButton_${article}`, 'false');
        }
    };

    // === ДЕЛЕГИРОВАНИЕ СОБЫТИЙ ===
    document.addEventListener('click', (event) => {
        const target = event.target;

        // Клик по кнопке "Купить"
        const priceButton = target.closest('.card__item-price-button');
        const cardItem = target.closest('.card__item');
        if (cardItem && priceButton && !target.closest('.button-click')) {
            const priceBlock = cardItem.querySelector('.card__item-price');
            const buttonClick = priceBlock?.querySelector('.button-click');
            const buttonText = priceBlock?.querySelector('.button-click__text');
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
            priceButtonClickON(priceButton, buttonClick, buttonText, '1');
            cardInBasket();
            return;
        }

        // Клик по кнопке "-" (в карточке или в корзине)
        const lessBtn = target.closest('.button-click__less');
        if (lessBtn) {
            const cardItem = target.closest('.card__item');
            if (!cardItem) return;
            const cardArticle = cardItem.dataset.article;
            const buttonText = cardItem.querySelector('.button-click__text');

            let count = Number(cardProperty[cardArticle]?.quantity || 1);
            if (count > 1) {
                count--;
                // Обновляем в cardProperty
                if (cardProperty[cardArticle]) {
                    cardProperty[cardArticle].quantity = count.toString();
                }
                
                // Синхронизируем количество везде
                updateCardQuantity(cardArticle, count);
                saveCardProperty();
                valueBasket();
                cardInBasket(); // Обновляем корзину
            } else {
                // Удаляем товар при количестве 0
                delete cardProperty[cardArticle];
                localStorage.setItem(`clickPriceButton_${cardArticle}`, 'false');
                
                // Синхронизируем состояние
                updateCardQuantity(cardArticle, 0);
                saveCardProperty();
                valueBasket();
                cardInBasket(); // Обновляем корзину
            }
            return;
        }

        // Клик по кнопке "+" (в карточке или в корзине)
        const moreBtn = target.closest('.button-click__more');
        if (moreBtn) {
            const cardItem = target.closest('.card__item');
            if (!cardItem) return;
            const cardArticle = cardItem.dataset.article;
            const buttonText = cardItem.querySelector('.button-click__text');
            
            let count = Number(cardProperty[cardArticle]?.quantity || 1);
            count++;
            
            // Обновляем в cardProperty
            if (cardProperty[cardArticle]) {
                cardProperty[cardArticle].quantity = count.toString();
            }
            
            // Синхронизируем количество везде
            updateCardQuantity(cardArticle, count);
            saveCardProperty();
            valueBasket();
            cardInBasket(); // Обновляем корзину
            return;
        }
    });

    // Первичное обновление корзины при загрузке
    valueBasket();
    cardInBasket();

    // Сброс через 10 минут (по желанию можно убрать)
    setTimeout(() => {
        resetCardState();
        valueBasket();
    }, 600000);
};

export { basket, openBasket };