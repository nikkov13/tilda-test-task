'use strict';

document.addEventListener("DOMContentLoaded", function() {

  let body = document.querySelector('body'),
      cardButtons = body.querySelectorAll('.card__button'),
      bottomModal = body.querySelector('.bottom-modal'),
      bottomModalClose = bottomModal.querySelector('.bottom-modal__link'),
      cartButton = body.querySelector('.cart-button'),
      itemCount = body.querySelectorAll('.js-count'),
      openCartButton = bottomModal.querySelector('.bottom-modal__button'),
      darkBackground = body.querySelector('.dark-background'),
      cartModal = darkBackground.querySelector('.cart'),
      itemsOnCart = cartModal.querySelectorAll('.cart-item'),
      closeDelay;

  itemCount.forEach((count) => {
    count.textContent = itemsOnCart.length;
  });

  cardButtons.forEach((button) => {
    button.addEventListener('click', (evt) => {
      evt.preventDefault();
      
      openBottomModal();

      closeDelay= setTimeout(() => {
        closeBottomModal();
      }, 3000);
    });
  });

  bottomModalClose.addEventListener('click', (evt) => {
    evt.preventDefault();

    clearTimeout(closeDelay);
    closeBottomModal();
  });

  openCartButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    clearTimeout(closeDelay);
    closeBottomModal();
    openCart();

    openTab('cart');
    setActiveStage('cart');
  });

  cartButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    openCart();
    openTab('cart');
    setActiveStage('cart');
  });

  darkBackground.addEventListener('click', (evt) => {
    if (!(evt.target == cartModal || cartModal.contains(evt.target))) {
      closeCart();
    }
  });

  document.addEventListener('keydown', (evt) => {
    if (evt.keyCode === 27 && cartModal.classList.contains('js-open')) {
      closeCart();
    }
  });

  let stagesWrapper = cartModal.querySelector('.stages'),
      stageDots = stagesWrapper.querySelectorAll('.stages__point');

  stageDots.forEach((dot) => {
    dot.addEventListener('click', (evt) => {
      evt.preventDefault();

      let dotName = dot.dataset.name;
  
      setActiveStage(dotName);
      openTab(dotName);
    });
  });

  let tabs = cartModal.querySelectorAll('.cart__tab'),
      prevTabButton = cartModal.querySelector('.cart__back-link'),
      nextTabButton = cartModal.querySelector('.cart__button');

  prevTabButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    let currentTab = cartModal.querySelector('.cart__tab.js-open'),
        currentTabIndex = Array.prototype.indexOf.call(tabs, currentTab);

    if (currentTabIndex > 0) {
      let prevTab = tabs[currentTabIndex - 1],
          prevTabName = prevTab.dataset.name;

      openTab(prevTabName);
      setActiveStage(prevTabName);
    } else {
      closeCart();
    }
  });

  nextTabButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    let currentTab = cartModal.querySelector('.cart__tab.js-open'),
        currentTabIndex = Array.prototype.indexOf.call(tabs, currentTab);

    if (currentTabIndex < tabs.length - 1) {
      let nextTab = tabs[currentTabIndex + 1],
          nextTabName = nextTab.dataset.name;

      openTab(nextTabName);
      setActiveStage(nextTabName);
    } else {
      closeCart();
    }
  });

  let itemDeleteBtns = cartModal.querySelectorAll('.cart-item__delete');

  itemDeleteBtns.forEach((button) => {
    button.addEventListener('click', (evt) => {
      evt.preventDefault();
  
      deleteItem(findParentWithClass(button, 'cart-item'));
    });
  });

  totalCounting();
  
  let itemCountInput = cartModal.querySelectorAll('.cart-item__counter-number');

  itemCountInput.forEach((input) => {
    input.addEventListener('keydown', (evt) => {
      if(evt.keyCode === 13) {
        evt.preventDefault();
        input.blur();
      }
    });

    input.addEventListener('blur', (evt) => {
      itemTotalCounting(input);
      totalCounting();
    });
  });

  let countIncreaseBtns = cartModal.querySelectorAll('.js-btn-increase'),
      countDecreaseBtns = cartModal.querySelectorAll('.js-btn-decrease');

  countIncreaseBtns.forEach((button) => {
    button.addEventListener('click', (evt) => {
      evt.preventDefault();

      let counterWrapper = findParentWithClass(button, 'cart-item__counter'),
          counterInput = counterWrapper.querySelector('.cart-item__counter-number');

      increaseCounter(counterInput);
      itemTotalCounting(counterInput);
      totalCounting();
    });
  });
  
  countDecreaseBtns.forEach((button) => {
    button.addEventListener('click', (evt) => {
      evt.preventDefault();

      let counterWrapper = findParentWithClass(button, 'cart-item__counter'),
          counterInput = counterWrapper.querySelector('.cart-item__counter-number');

      decreaseCounter(counterInput);
      itemTotalCounting(counterInput);
      totalCounting();
    });
  });

  let deliveryTabBtns = cartModal.querySelectorAll('.js-delivery-btn'),
      deliveryTabs = cartModal.querySelectorAll('.js-delivery-tab');

  deliveryTabBtns.forEach((button) => {
    button.addEventListener('click', (evt) => {
      let tabName = button.id,
          deliveryTotal = cartModal.querySelector('.js-delivery-sum');

      if (tabName === 'pickup') {
        deliveryTotal.textContent = 0;
      }
      
      if (tabName === 'delivery') {
        deliveryTotal.textContent = 1200;
      }

      deliveryTabs.forEach((tab) => {
        if (tab.dataset.name === tabName) {
          tab.classList.remove('visually-hidden');
        } else {
          tab.classList.add('visually-hidden');
        }
      });
    });
  });

  let selectWrapper = cartModal.querySelector('.select'),
      selectInput = selectWrapper.querySelector('.select__input'),
      selectDropdown = selectWrapper.querySelector('.select__dropdown'),
      selectOptions = selectWrapper.querySelectorAll('.select__option');

  document.addEventListener('click', (evt) => {

    

    if (evt.target == selectInput) {
      evt.preventDefault();
  
      if (selectDropdown.classList.contains('js-open')) {
        selectWrapper.classList.remove('select--open');
        closeDropdown();

        return;
      }
  
      selectWrapper.classList.add('select--open');
      openDropdown();

      return;
    }

    if (evt.target != selectWrapper
      && selectDropdown.classList.contains('js-open')) {
        selectWrapper.classList.remove('select--open');
        closeDropdown();
    }
    
  });

  selectOptions.forEach((option) => {
    option.addEventListener('click', (evt) => {
      evt.preventDefault();

      selectOptions.forEach(option => option.classList.remove('select__option--active'));
      option.classList.add('select__option--active');

      selectInput.value = option.textContent;
    });
  });

  /* functions */

  function openDropdown() {
    selectDropdown.style.transform = 'translateY(0)';
    selectDropdown.classList.add('js-open');
  }

  function closeDropdown() {
    selectDropdown.style.transform = 'translateY(-100%)';
    selectDropdown.classList.remove('js-open');
  }
  
  function findParentWithClass(el, cls) {
    while((el = el.parentElement) && !(el.classList.contains(cls)));
    return el;
  }

  function openBottomModal() {
    bottomModal.classList.add('js-open');
    bottomModal.style.transform = 'translate(-50%, 0)';
    //traslate(-50%) for keep modal in center
  }

  function closeBottomModal() {
    bottomModal.classList.remove('js-open');
    bottomModal.style.transform = 'translate(-50%, 100%)';
    //traslate(-50%) for keep modal in center
  }

  function openCart() {
    cartModal.classList.add('js-open');
    body.style.overflow = 'hidden';
    darkBackground.classList.remove('visually-hidden');
  }

  function closeCart() {
    cartModal.classList.remove('js-open');
    body.style.overflow = 'visible';
    darkBackground.style.opacity = 0;

    setTimeout(() => {
      darkBackground.style.opacity = null;
      darkBackground.classList.add('visually-hidden');
    }, 700);
  }
  
  function setActiveStage(stageName) {
    let activeBar = stagesWrapper.querySelector('.stages__active-bar');

    if (stageName == 'success') {
      activeBar.style.width = `100%`;

      stageDots.forEach((dot) => {
        let dotTitle = dot.querySelector('.stages__point-text');

        dot.classList.add('stages__point--active');
        dotTitle.classList.remove('stages__point-text--active');
      });

      return;
    }

    let progressBar = stagesWrapper.querySelector('.stages__progress-bar'),
        progressBarStartPosition = progressBar.getBoundingClientRect().left,
        progressBarWidth = progressBar.getBoundingClientRect().width,
        wasCurrentDot = false;

    stageDots.forEach((dot) => {
      if (dot.dataset.name != stageName
          && !wasCurrentDot) {
            dot.classList.add('stages__point--active');

            let dotTitle = dot.querySelector('.stages__point-text');
            dotTitle.classList.remove('stages__point-text--active');
      }

      if (dot.dataset.name == stageName) {
        let dotTitle = dot.querySelector('.stages__point-text'),
            dotPosition = dot.getBoundingClientRect().left,
            newActiveBarWidth = ((dotPosition - progressBarStartPosition) / progressBarWidth) * 100;

        activeBar.style.width = `${newActiveBarWidth}%`;

        dot.classList.add('stages__point--active');
        dotTitle.classList.add('stages__point-text--active');

        wasCurrentDot = true;

        if (document.documentElement.getBoundingClientRect().width <= 768) {
          stagesWrapper.scrollLeft = dotPosition - progressBar.getBoundingClientRect().width / 4;
        }

      }

      if (dot.dataset.name != stageName
          && wasCurrentDot) {
            dot.classList.remove('stages__point--active');
            
            let dotTitle = dot.querySelector('.stages__point-text');
            dotTitle.classList.remove('stages__point-text--active');
      }
    });
  }

  function openTab(tabName) {
    let cartTotal = cartModal.querySelector('.cart__total');

    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].dataset.name == tabName) {
        tabs[i].classList.add('js-open');
        tabs[i].classList.remove('visually-hidden');

        if (tabs[i].dataset.name == 'success') {
          cartTotal.style.display = 'none';
          prevTabButton.style.display = 'none';
          nextTabButton.textContent = tabs[i].dataset.nextBtn;
          nextTabButton.style.margin = '0 auto';
        } else {
          cartTotal.style.display = 'block';
          prevTabButton.style.display = 'flex';

          prevTabButton.textContent = tabs[i].dataset.prevBtn;
          nextTabButton.textContent = tabs[i].dataset.nextBtn;
          nextTabButton.style.margin = '0'
        }

        if (tabs[i].dataset.name == 'payment') {
          let minItemsList = tabs[i].querySelector('.product-list'),
              minItems = minItemsList.querySelectorAll('.item-min');

          minItems.forEach(item => item.remove());

          itemsOnCart.forEach((item) => {
            let minItemObj = getItemObject(item),
                minItemNode = createMinItem(minItemObj);

            minItemsList.append(minItemNode);
          });

          countTotalWithDelivery();

        } else {
          totalCounting();
        }

        continue;
      }
      
      tabs[i].classList.remove('js-open');
      tabs[i].classList.add('visually-hidden');
    }
  }

  function deleteItem(item) {
    let deleteWarning = item.querySelector('.cart-item__delete-wrapper'),
        timer = item.querySelector('.cart-item__time');

    deleteWarning.classList.remove('visually-hidden');

    let time = 5,
      initialOffset = '140',
      currentTime = 1,
      circleAnimation = item.querySelector('.circle-animation');

    circleAnimation.style.strokeDashoffset = initialOffset-(1*(initialOffset/time));

    let interval = setInterval(function() {

      timer.textContent = currentTime;

      if (currentTime == time) {  	
        clearInterval(interval);
        item.remove();
        totalCounting();

        itemCount.forEach((count) => {
          itemsOnCart = cartModal.querySelectorAll('.cart-item');
          count.textContent = itemsOnCart.length;
        });

        return;
      }

      circleAnimation.style.strokeDashoffset = initialOffset-((currentTime+1)*(initialOffset/time));
      currentTime++;
    }, 1000);

    let cancelButton = item.querySelector('.cart-item__return-item');
  
    cancelButton.addEventListener('click', (evt) => {
      evt.preventDefault();

      clearInterval(interval);
      deleteWarning.classList.add('visually-hidden');

      circleAnimation.style.strokeDashoffset = initialOffset;
      timer.textContent = 0;

    });
  }

  function itemTotalCounting(input) {
    let parentItem = findParentWithClass(input, 'cart-item'),
        itemPrice = parentItem.querySelector('.cart-item__price-per-item--bold').textContent.split('р')[0],
        itemTotal = parentItem.querySelector('.cart-item__price');

    itemTotal.textContent = input.value * itemPrice + ' р.';
  }

  function totalCounting() {
    let cartTotal = cartModal.querySelector('.cart__total--sum'),
        itemsSubtotal = cartModal.querySelector('.js-items-sum'),
        bottomModalTotal = body.querySelector('.js-total'),
        itemsPrice = cartModal.querySelectorAll('.cart-item__price'),
        total = 0;

    itemsPrice.forEach((price) => {
      total += parseInt(price.textContent, 10);
    });

    bottomModalTotal.textContent = total;
    cartTotal.textContent = total + 'р.';
    itemsSubtotal.textContent = total;
  }

  function countTotalWithDelivery() {
    let cartTotal = cartModal.querySelector('.cart__total--sum'),
        deliveryPrice = parseInt(cartModal.querySelector('.js-delivery-sum').textContent, 10),
        itemsSubtotal = parseInt(cartModal.querySelector('.js-items-sum').textContent, 10);

    let total = deliveryPrice + itemsSubtotal;

    cartTotal.textContent = total + 'р.';
  }

  function increaseCounter(counter) {
    counter.value = +counter.value + 1;
  }

  function decreaseCounter(counter) {
    if (counter.value > 1) {
      counter.value = +counter.value - 1;
    }
  }

  function getItemObject(itemNode) {
    let itemObj = {};

    let itemImg = itemNode.querySelector('img'),
        itemTitle = itemNode.querySelector('.cart-item__name').textContent,
        itemCount = itemNode.querySelector('.cart-item__counter-number').value,
        itemPrice = itemNode.querySelector('.cart-item__price').textContent;

    itemObj.imgPath = itemImg.getAttribute('src');
    itemObj.title = itemTitle;
    itemObj.count = itemCount;
    itemObj.price = itemPrice;

    return itemObj;
  }

  function createMinItem(itemObj) {
    let newItem = document.createElement('li');

    newItem.classList.add('product-list__item', 'item-min');
    newItem.innerHTML = `
      <div class="item-min__img-wrapper">
        <img src="${itemObj.imgPath}" alt="">
      </div>
      <div class="item-min__content">
        <p class="item-min__name">
          ${itemObj.title}
        </p>
        <div class="item-min__price-wrapper">
          <span class="item-min__count">${itemObj.count}</span>
          <span class="item-min__price">${itemObj.price}</span>
        </div>
      </div>
    `;

    return newItem;
  }

});