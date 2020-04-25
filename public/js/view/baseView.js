import axios from 'axios';
/*---- DOM ELEMENTS OBJECTS ----*/
export const DOMElements = {
  // Form Objects
  formLogin: document.querySelector('.login__form'),
  formUpdateProfile: document.querySelector('.updateProfile__form'),
  formAddAddress: document.querySelector('.addAddress__form'),
  formUpdateAddress: document.querySelector('.updateAddress__form'),
  formChangePassword: document.querySelector('.changePassword__form'),
  formSignup: document.querySelector('.register__form'),
  formPasswordForgot: document.querySelector('.forgetPassword__form'),
  formPasswordReset: document.querySelector('.resetPassword__form'),

  // Form Element Objects
  inputCommonArr: Array.from(document.querySelectorAll('.form__field__input')),
  fullName: document.querySelector('.fullName'),
  email: document.querySelector(`.email`),
  password: document.querySelector(`.password`),
  currentPassword: document.querySelector(`.currentPassword`),
  newPassword: document.querySelector(`.newPassword`),
  confirmPassword: document.querySelector(`.confirmPassword`),
  passwordCommonObj: document.querySelector(`.form__field__password input`),
  logoutBtn: document.querySelector('.btn--logout'),
  toggleBtnPassword: Array.from(
    document.querySelectorAll('.password__toggleBtn')
  ),

  // AddressObj DOM
  addressInfo: {
    name: document.querySelector('.fullName'),
    mobileNo: document.querySelector('.mobile'),
    houseNo: document.querySelector('.houseNo'),
    street: document.querySelector('.street'),
    locality: document.querySelector('.locality'),
    city: document.querySelector('.city'),
    pincode: document.querySelector('.pincode'),
    district: document.querySelector('.district'),
    state: document.querySelector('.state'),
    country: document.querySelector('.country')
  },

  addressInfoValue: {},

  deleteAddressBtn: Array.from(
    document.querySelectorAll('.myAddress__btnDelete')
  ),
  editAddressBtn: Array.from(document.querySelectorAll('.myAddress__btnEdit')),

  navigation: document.querySelector('.navigation'),
  searchBtn: document.querySelector('.btn__search'),
  searchInput: document.querySelector('.input__search'),

  addToCartBtn: document.querySelector('.addToCartBtn'),
  buyNowBtn: document.querySelector('.product_img_part__btn--buy'),
  productQuantityCart: document.querySelector('.productQuantityCart'),
  cartBtnHeader: Array.from(document.querySelectorAll('.cartBtnHeader')),

  // Cart Objects
  removeCartItemBtn: Array.from(document.querySelectorAll(`.cart__removeBtn`)),
  quantityData: Array.from(
    document.querySelectorAll('.cart__info--quantity__data')
  ),
  cartItems: Array.from(document.querySelectorAll('.cart')),
  cartItemsPrice: Array.from(document.querySelectorAll('.cart__info__price')),
  totalAmtCart: document.querySelector('.totalBilling__data'),

  bookingDetailsQuantity: document.querySelector('.bookingDetails__quantity'),
  bookingDetailsTotal: document.querySelector('.bookingDetail__totalPrice'),
  bookingDetailsItemPrice: document.querySelector('.bookingDetails__itemPrice'),
  orderPlaceBtn: document.querySelector('.btn__orderPlace'),
  orderCancelBtn: document.querySelector('.btn__orderCancel'),
  proceedBtnChooseAddr: document.querySelector('.btn__chooseAddressProceed'),
  radioBtnAddress: Array.from(document.getElementsByName('addressChoice')),

  //Pincode
  pincodeCheckBtn: document.querySelector(
    '.product__info__basic__pincode__checkBtn'
  ),
  pincodeCheckInput: document.querySelector(
    '.product__info__basic__pincode__input'
  ),

  /*--- ## This Objects will be used for  ---*/
  browserWidth: document.documentElement.clientWidth,
  headerImg: document.querySelector(`.header__image`),
  droneImg: document.querySelector(`.drone__image`),
  mobileNavObj: document.querySelector('.modalNav')
};
/* ########### */

/*-------------- Varibales ----------------*/

/* ########### */

/*---- FOR TOGGLING THE MOBILE NAVIGATION ----*/

const showMobileNav = () => {
  DOMElements.mobileNavObj.classList.add('modalNav__show');
};
const removeMobileNav = () => {
  DOMElements.mobileNavObj.classList.remove('modalNav__show');
};

export const renderMobileNav = () => {
  document
    .querySelector(`.navigation__primary__item--menuBtn`)
    .addEventListener('click', showMobileNav);

  document
    .querySelector('.modalNav__close')
    .addEventListener('click', removeMobileNav);
};
/* ########### */

// Again make the transition availabe after load
window.addEventListener('load', () => {
  document
    .querySelector('.preload--transitions')
    .classList.remove('preload--transitions');
});

// Closing modal on clicking anywhere
window.addEventListener('click', e => {
  if (
    !(
      e.target.matches('.modalNav__content') ||
      e.target.matches(`.modalNav__content *`) ||
      e.target.matches(`.navigation__primary__item--menuBtn`) ||
      e.target.matches(`.navigation__primary__item--menuBtn *`)
    )
  )
    removeMobileNav();
});

/*---- FOR CHANGING THE IMAGES AND REQUIRED DATA ON RESIZE ----*/
export const changeResponsiveContent = () => {
  if (DOMElements.browserWidth <= 700) {
    if (DOMElements.headerImg) {
      DOMElements.headerImg.setAttribute(
        'src',
        './images/home_page/home_top_header_mobile.jpg'
      );
    }
    if (DOMElements.droneImg) {
      DOMElements.droneImg.setAttribute(
        'src',
        './images/home_page/home_drone_mobile.jpg'
      );
    }
  } else if (DOMElements.browserWidth >= 1200) {
    if (DOMElements.headerImg) {
      DOMElements.headerImg.setAttribute(
        'src',
        './images/home_page/home_top_header.jpg'
      );
    }
    if (DOMElements.droneImg) {
      DOMElements.droneImg.setAttribute(
        'src',
        './images/home_page/home_drone.jpg'
      );
    }
  }
};
/* ########### */

// To Toggle showing of password
export const toggleShowPassword = e => {
  const pass = document.querySelector(`.form__field__password input`);
  if (e.target.name === 'eye-off') {
    e.target.name = 'eye';
    e.target.parentElement.firstChild.type = 'text';
  } else {
    e.target.name = 'eye-off';
    e.target.parentElement.firstChild.type = 'password';
  }
};
/* ########### */

// Show the quantity in booking Detail
if (DOMElements.bookingDetailsQuantity) {
  if (DOMElements.bookingDetailsTotal.textContent === '') {
    DOMElements.bookingDetailsQuantity.textContent = `Quantity : ${sessionStorage.getItem(
      'buyingQuantity'
    )}`;

    DOMElements.bookingDetailsTotal.textContent = `₹ ${Number(
      DOMElements.bookingDetailsItemPrice.textContent.match(/(\d+)/)[0]
    ) * Number(sessionStorage.getItem('buyingQuantity'))} /-`; // Multiplying Item price with quantity
  }
}

export const checkDeliveryOnPincode = async () => {
  const pincode = Number(DOMElements.pincodeCheckInput.value);
  const res = await axios({
    method: 'GET',
    url: `https://api.postalpincode.in/pincode/${pincode}`
  });

  const markUpPincode = (msg, error = false) => {
    if (document.querySelector('.pincode__notice')) {
      document
        .querySelector('.pincode__notice')
        .parentNode.removeChild(document.querySelector('.pincode__notice'));
    }

    const markUp = `
    <tr class = "pincode__notice ">
      <td></td>
      <td><div class = ${
        error === false ? 'small__para--success' : 'small__para--error'
      }>${msg}</div></td>
    </tr>`;

    document
      .querySelector('.pincodeDeliveryRow')
      .insertAdjacentHTML('afterend', markUp);
  };
  if (res.data[0].Status === 'Error') {
    markUpPincode('Please Enter a valid pincode', true);
    return;
  }

  if (
    res.data[0].Status === 'Success' &&
    res.data[0].PostOffice[0].State === 'Maharashtra'
  ) {
    markUpPincode(`Delivery within 2-3 days at your pincode ${pincode}`);
  } else {
    markUpPincode(`Delivery is not available at your pincode ${pincode}`, true);
  }
};

// Validations
const formInputErrorNotice = (el = '', msg = '') => {
  // Removing the error of particular input
  if (el && el.parentElement.querySelector('.formInput__error')) {
    el.parentElement
      .querySelector('.formInput__error')
      .parentElement.removeChild(
        el.parentElement.querySelector('.formInput__error')
      );
  }

  // If the function is not getting the msg, that means the notice should only be removed
  if (msg === '') return;

  const markUp = `
         <div class = 'para--small color--error formInput__error u-margin-top-extraSmall'>${msg}</div>
    `;
  el.insertAdjacentHTML('afterend', markUp);
};

export const checkPasswordMatch = () => {
  // Checking whether this fields actually exist
  if (!DOMElements.newPassword && !DOMElements.confirmPassword) return;

  if (DOMElements.newPassword.value !== DOMElements.confirmPassword.value) {
    formInputErrorNotice(DOMElements.confirmPassword, 'Passwords do not match');
  } else {
    formInputErrorNotice(DOMElements.passwordObj);
  }
};

// Minimum should be 6char
export const validatePasswordInput = passwordObj => {
  return () => {
    if (passwordObj.value.length < 6) {
      formInputErrorNotice(
        passwordObj,
        'Password should be of minimum 6 characters'
      );
    } else {
      formInputErrorNotice(passwordObj);
    }
  };
};

// Basic validation of input fields
export const validateInputs = () => {
  for (let i = 0; i < DOMElements.inputCommonArr.length; i++) {
    if (DOMElements.inputCommonArr[i].value.length < 1) {
      formInputErrorNotice(
        DOMElements.inputCommonArr[i],
        'This field is mondatory'
      );
      return false;
    }
  }

  if (DOMElements.passwordCommonObj) {
    if (DOMElements.passwordCommonObj.length < 6) {
      return false;
    }
  }

  return true;
};

// Validate a single input after user changes its value
export const validateInput = el => {
  return () => {
    if (el.value.length < 1) {
      formInputErrorNotice(el, 'This field is mondatory');
      return false;
    } else {
      formInputErrorNotice(el);
    }
  };
};

// Searching
export const searchResults = () => {
  location.assign(`/search/?searchStr=${DOMElements.searchInput.value}`);
};
