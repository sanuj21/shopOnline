/* eslint-disable */

// RENDERING BASIC TEMPLATE OF WEBSITE
const renderBasicTemplate = () => {
  // Top Navigation
  const markUpNav = `
  <div class="navigation">
  <!------- Main Navigation including log ------>
  <nav class="navigation__primary">
    <div class="row">
      <div class="navigation__primary__list clearfix">
        <div
          class="navigation__primary__item navigation__primary__item--menuBtn"
          data-target="#modal__navTop"
        >
          <span class="navigation__primary__item--menuBtn_line"></span>
          <span class="navigation__primary__item--menuBtn_line"></span>
          <span class="navigation__primary__item--menuBtn_line"></span>
        </div>

        <div class="navigation__primary__item">
          <a href="home.html" class="navigation__primary__link">
            <img
              src="./logo/logo_light.svg"
              class="navigation__logo"
            />
          </a>
        </div>

        <!-- For Mobile [Cart] -->
        <div
          class="navigation__primary__item navigation__primary__item--forMobile"
        >
          <a href="#" class="navigation__primary__link cartBtnHeader">
          <img src = "images/cart.svg" class = "cartBtnHeader__img">
          <span class = "navigation__primary__link__text cartBtnHeader__text">3</span>
          </a>
        </div>

        <div
          class="navigation__primary__item navigation__primary__item--search"
        >
          <div class="navigation__search">
            <input
              type="text"
              class="navigation__search__box"
              placeholder="Search for products..."
            />
            <ion-icon
              name="search"
              class="navigation__search__icon"
            ></ion-icon>
          </div>
        </div>

        <div class="navigation__primary__text__links clearfix">
          <div class="navigation__primary__item">
            <a href="loginForm.html" class="navigation__primary__link">
              <span class="navigation__primary__link__text">Hello! Sign in</span>
              <ion-icon name="chevron-down-outline" class="downArrow-icon"></ion-icon>
              <div class="navigation__dropdown__list navigation__dropdown__list--primary">
            <a href="#" class="navigation__dropdown__item">Dal</a>
            <a href="#" class="navigation__dropdown__item"
              >Atta and flour</a
            >
            <a href="#" class="navigation__dropdown__item">Oil and Ghee</a>
            <a href="#" class="navigation__dropdown__item">Sugar</a>
            <a href="#" class="navigation__dropdown__item">Rices</a>
            <a href="#" class="navigation__dropdown__item">Spices</a>
          </div>
            </a>
          </div>


          <div class="navigation__primary__item">
            <a href="#" class="navigation__primary__link cartBtnHeader">
              <img src = "images/cart.svg" class = "cartBtnHeader__img">
              <span class = "navigation__primary__link__text cartBtnHeader__text">2</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-----   Secondary Navigation     ----->
  <nav class="navigation__secondary">
    <div class="row">
      <div class="navigation__secondary__list clearfix">
        <div class="navigation__secondary__item">
          <a href="#" class="navigation__secondary__link">
            <span class="navigation__secondary__link__text"
              >Topwear</span
            >
            <ion-icon name="chevron-down-outline" class="downArrow-icon"></ion-icon>
          </a>

          <div class="navigation__dropdown__list">
            <a href="#" class="navigation__dropdown__item">Dal</a>
            <a href="#" class="navigation__dropdown__item"
              >Atta and flour</a
            >
            <a href="#" class="navigation__dropdown__item">Oil and Ghee</a>
            <a href="#" class="navigation__dropdown__item">Sugar</a>
            <a href="#" class="navigation__dropdown__item">Rices</a>
            <a href="#" class="navigation__dropdown__item">Spices</a>
          </div>
        </div>

        <div class="navigation__secondary__item">
          <a href="#" class="navigation__secondary__link">
            <span class="navigation__secondary__link__text"
              >Bottomwear</span
            >
            <ion-icon name="chevron-down-outline" class="downArrow-icon"></ion-icon>
          </a>
          <div class="navigation__dropdown__list">
            <a href="#" class="navigation__dropdown__item">Dal</a>
            <a href="#" class="navigation__dropdown__item"
              >Atta and flour</a
            >
            <a href="#" class="navigation__dropdown__item">Oil and Ghee</a>
            <a href="#" class="navigation__dropdown__item">Sugar</a>
            <a href="#" class="navigation__dropdown__item">Rices</a>
            <a href="#" class="navigation__dropdown__item">Spices</a>
          </div>
        </div>

        <div class="navigation__secondary__item">
          <a href="#" class="navigation__secondary__link">
            <span class="navigation__secondary__link__text"
              >Footwear</span
            >
            <ion-icon name="chevron-down-outline" class="downArrow-icon"></ion-icon>
          </a>
          <div class="navigation__dropdown__list">
            <a href="#" class="navigation__dropdown__item">Dal</a>
            <a href="#" class="navigation__dropdown__item"
              >Atta and flour</a
            >
            <a href="#" class="navigation__dropdown__item">Oil and Ghee</a>
            <a href="#" class="navigation__dropdown__item">Sugar</a>
            <a href="#" class="navigation__dropdown__item">Rices</a>
            <a href="#" class="navigation__dropdown__item">Spices</a>
          </div>
        </div>

        <div class="navigation__secondary__item">
          <a href="#" class="navigation__secondary__link">
            <span class="navigation__secondary__link__text"
              >Festivewear</span
            >
            <ion-icon name="chevron-down-outline" class="downArrow-icon"></ion-icon>
          </a>
          <div class="navigation__dropdown__list">
            <a href="#" class="navigation__dropdown__item">Dal</a>
            <a href="#" class="navigation__dropdown__item"
              >Atta and flour</a
            >
            <a href="#" class="navigation__dropdown__item">Oil and Ghee</a>
            <a href="#" class="navigation__dropdown__item">Sugar</a>
            <a href="#" class="navigation__dropdown__item">Rices</a>
            <a href="#" class="navigation__dropdown__item">Spices</a>
          </div>
        </div>


        <div class="navigation__secondary__item">
          <a href="#" class="navigation__secondary__link">
            <span class="navigation__secondary__link__text"
              >Offer Zone</span
            >
          </a>
        </div>

        <div class="navigation__secondary__item">
          <a href="#" class="navigation__secondary__link">
            <span class="navigation__secondary__link__text"
              >Contact us</span
            >
          </a>
        </div>
      </div>
    </div>
  </nav>
</div>

<!--## Mobile Navigation , its a modal which will get fired on the click of Button -->
<div class="modalNav" id="modal__navTop">
  <div class="modal__content modalNav__content">
    <div class="modalNav__header">
      <a href="loginForm.html" class="modalNav__header__title">
        <ion-icon
          name="person-circle-outline"
          class="person-icon--mobile"
        ></ion-icon>
        <span class="modalNav__header__title__text">Hello! Sign In</span>
      </a>

      <ion-icon name="close-outline" class="modalNav__close"></ion-icon>
    </div>
    <div class="modalNav__body">
      <div class="modalNav__body__list">
        <a href="#" class="modalNav__body__list__item">Home</a>
        <a href="#" class="modalNav__body__list__item">Order</a>
        <a href="#" class="modalNav__body__list__item">Account</a>
        <a href="#" class="modalNav__body__list__item">Today's Deal</a>
        <a href="#" class="modalNav__body__list__item">Contact Us</a>
      </div>
    </div>
  </div>
</div>
`;

  document.querySelector(`body`).insertAdjacentHTML('afterbegin', markUpNav);

  // RENDERING THE FOOTER

  const markUpFooter = `
  <div class="row">
  <div class="footer__nav">
    <!-- //Left Bottom Nav -->
    <div class="footer__nav__left">
      <div class="footer__nav--1">
        <img src="./logo/logo_light.svg" class="footer__logo" />
      </div>
      <div class="footer__nav--2">
        <ul class="footer__nav__list">
          <li class="footer__nav__list__item">
            <a href="#" class="footer__nav__list__item__link">Home</a>
          </li>
          <li class="footer__nav__list__item">
            <a href="#" class="footer__nav__list__item__link">About</a>
          </li>
          <li class="footer__nav__list__item">
            <a href="#" class="footer__nav__list__item__link"
              >Contact us</a
            >
          </li>
          <li class="footer__nav__list__item">
            <a href="#" class="footer__nav__list__item__link"
              >Terms & Conditions</a
            >
          </li>
        </ul>
      </div>
    </div>

    <!-- //Right Bottom Nav -->
    <div class="footer__nav__right">
      <div class="footer__nav--1">
        <ul class="footer__nav__list">
          <li class="footer__nav__list__item">
            <a href="#" class="footer__nav__list__item__link">
            <ion-icon name="logo-facebook" class = "facebook-icon"></ion-icon><span class = "facebook-text">Facebook</span>
            </a>
          </li>

          <li class="footer__nav__list__item">
            <a href="#" class="footer__nav__list__item__link">
            <ion-icon name="logo-twitter" class = "twitter-icon"></ion-icon><span class = "twitter-text">twitter</span>
            </a>
          </li>

          <li class="footer__nav__list__item">
            <a href="#" class="footer__nav__list__item__link">
            <ion-icon name="logo-instagram" class = "instagram-icon"></ion-icon><span class = "instagram-text">instagram</span>
            </a>
          </li>
        </ul>
      </div>
      <div class="footer__nav--2">
        <div class="subscribe">
          <div class="subscribe__text">
            Subscribe to our newsletter
          </div>

          <div class="subscribe__email">
            <input
              type="email"
              placeholder="Email Address"
              class="subscribe__email__input"
            />
            <input
              type="button"
              value="OK"
              class="subscribe__email__btn"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!----- Credit To the Developer ----->
<div class="row">
  <div class="creator">
    Designed and Developed by Anuj Sharma
  </div>
</div>`;

  document
    .querySelector(`.footer`)
    .insertAdjacentHTML('afterbegin', markUpFooter);

  const markUpHead = `<meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lonavala Bazaar</title>
  <link href="css/style.css" rel="stylesheet" type="text/css" />
  <link
    href="https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600&display=swap"
    rel="stylesheet"
  />`;

  document.querySelector('head').insertAdjacentHTML('beforeend', markUpHead);
};

/* ---------------------------------------------------------------- */

const toggleModal = () => {
  const modalNav = document.querySelector('.modalNav');
  modalNav.classList.toggle('modalNav__show');
};

const changeResponsiveContent = () => {
  var widthRes = document.documentElement.clientWidth;

  const headerImg = document.querySelector(`.header__image`);
  const droneImg = document.querySelector(`.drone__image`);

  if (headerImg) {
    if (widthRes <= 700) {
      headerImg.setAttribute(
        'src',
        './images/home_page/home_top_header_mobile.jpg'
      );
      droneImg.setAttribute('src', './images/home_page/home_drone_mobile.jpg');
    } else if (widthRes >= 1200) {
      headerImg.setAttribute('src', './images/home_page/home_top_header.jpg');
      droneImg.setAttribute('src', './images/home_page/home_drone.jpg');
    }
  }
};

changeResponsiveContent();
window.addEventListener('resize', changeResponsiveContent);

// To Toggle showing of password
const toggleShowPassword = e => {
  const pass = document.querySelector(`.form__field__password input`);
  if (e.target.name === 'eye-off') {
    e.target.name = 'eye';
    pass.type = 'text';
    console.log('show');
  } else {
    e.target.name = 'eye-off';
    pass.type = 'password';
    console.log('hide');
  }
};

// For updating the quantity in input box
const updateQuantity = n => {
  let box = document.querySelector('.cart__info--quantity__data').textContent;
  const curQ = Number(box) + n;
  if (curQ > 0) {
    document.querySelector('.cart__info--quantity__data').textContent = curQ;
  }
};

const renderAndEvents = () => {
  // RENDER THE BASIC TEMPLATE
  console.log('Its working dude');
  renderBasicTemplate();

  document
    .querySelector(`.navigation__primary__item--menuBtn`)
    .addEventListener('click', toggleModal);

  document
    .querySelector('.modalNav__close')
    .addEventListener('click', toggleModal);

  document
    .querySelector('.password__toggleBtn')
    .addEventListener('click', toggleShowPassword);

  document
    .querySelector('.cart__info--quantity__minus')
    .addEventListener('click', () => {
      updateQuantity(-1);
    });
  document
    .querySelector('.cart__info--quantity__plus')
    .addEventListener('click', () => {
      updateQuantity(1);
    });
};
window.addEventListener('DOMContentLoaded', renderAndEvents);

const handleWheel = state => {
  // state -> 'paused'||'running''
  return () => {
    document.querySelector(`#wheel`).style.animationPlayState = state;
  };
};

window.addEventListener('load', () => {
  document
    .querySelector('.preload--transitions')
    .classList.remove('preload--transitions');
});

window.setTimeout(handleWheel('paused'), 3000);
window.setTimeout(handleWheel('running'), 9000);

window.addEventListener('click', e => {
  if (
    !(
      e.target.matches('.modalNav__content') ||
      e.target.matches(`.modalNav__content *`) ||
      e.target.matches(`.navigation__primary__item--menuBtn`) ||
      e.target.matches(`.navigation__primary__item--menuBtn *`)
    )
  )
    document.querySelector('.modalNav').classList.remove('modalNav__show');
});
