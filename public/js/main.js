// /* eslint-disable */
import '@babel/polyfill';
import axios from 'axios';
import * as baseView from './view/baseView';
import * as cartView from './view/cartView';
import * as authenticate from './controller/authenticate';
import * as utilities from './controller/utilities';

/*----- Its for Changing the Responsive Content and Loading Mobile Nav ------*/
baseView.changeResponsiveContent();
window.addEventListener('resize', () => {
  baseView.changeResponsiveContent();
});

window.addEventListener('DOMContentLoaded', () => {
  // Render and Handle Mobile Navigation
  baseView.renderMobileNav();
  if (baseView.DOMElements.toggleBtnPassword) {
    baseView.DOMElements.toggleBtnPassword.forEach(el => {
      el.addEventListener('click', baseView.toggleShowPassword);
    });
  }

  if (baseView.DOMElements.cartItems) {
    for (let i = 0; i < baseView.DOMElements.cartItems.length; i++) {
      baseView.DOMElements.cartItems[i].addEventListener(
        'click',
        cartView.updateCart(i)
      );
    }
  }
});
/* ###### */

// ## Function to get the values of input fields when Address Form is submitted
const assignAddressDOM = () => {
  baseView.DOMElements.addressInfoValue.name =
    baseView.DOMElements.addressInfo.name.value;
  baseView.DOMElements.addressInfoValue.mobileNo =
    baseView.DOMElements.addressInfo.mobileNo.value;
  baseView.DOMElements.addressInfoValue.houseNo =
    baseView.DOMElements.addressInfo.houseNo.value;
  baseView.DOMElements.addressInfoValue.street =
    baseView.DOMElements.addressInfo.street.value;
  baseView.DOMElements.addressInfoValue.locality =
    baseView.DOMElements.addressInfo.locality.value;
  baseView.DOMElements.addressInfoValue.city =
    baseView.DOMElements.addressInfo.city.value;
  baseView.DOMElements.addressInfoValue.pincode =
    baseView.DOMElements.addressInfo.pincode.value;
  baseView.DOMElements.addressInfoValue.district =
    baseView.DOMElements.addressInfo.district.value;
  baseView.DOMElements.addressInfoValue.state =
    baseView.DOMElements.addressInfo.state.value;
  baseView.DOMElements.addressInfoValue.country =
    baseView.DOMElements.addressInfo.country.value;
};
/* ###### */

// ## When Login Form is submitted
if (baseView.DOMElements.formLogin) {
  baseView.DOMElements.formLogin.addEventListener('submit', e => {
    e.preventDefault();
    if (baseView.validateInputs()) {
      authenticate.login(
        baseView.DOMElements.email.value,
        baseView.DOMElements.password.value,
        baseView.DOMElements.formLogin.dataset.status
      );
    }
  });
}
/* ###### */

// ## When SignUp Form is submitted
if (baseView.DOMElements.formSignup) {
  baseView.DOMElements.formSignup.addEventListener('submit', e => {
    e.preventDefault();
    if (baseView.validateInputs()) {
      authenticate.signup(
        baseView.DOMElements.fullName.value,
        baseView.DOMElements.email.value,
        baseView.DOMElements.newPassword.value,
        baseView.DOMElements.confirmPassword.value,
        baseView.DOMElements.formSignup.dataset.status
      );
    }
  });
}
/* ###### */

// ## When Logout Button is clicked
if (baseView.DOMElements.logoutBtn) {
  baseView.DOMElements.logoutBtn.addEventListener('click', authenticate.logout);
}
/* ###### */

// ## When Update Profile Form is submitted
if (baseView.DOMElements.formUpdateProfile) {
  baseView.DOMElements.formUpdateProfile.addEventListener('submit', e => {
    e.preventDefault();
    if (baseView.validateInputs()) {
      authenticate.updateProfile(
        baseView.DOMElements.fullName.value,
        baseView.DOMElements.email.value
      );
    }
  });
}
/* ###### */

// ## When Update Password Form is submitted
if (baseView.DOMElements.formChangePassword) {
  baseView.DOMElements.formChangePassword.addEventListener('submit', e => {
    e.preventDefault();
    if (baseView.validateInputs()) {
      authenticate.changePassword(
        baseView.DOMElements.currentPassword.value,
        baseView.DOMElements.newPassword.value,
        baseView.DOMElements.confirmPassword.value
      );
    }
  });
}
/* ###### */

// ## Requested the Data from GOV website based on PINCODE and Inserting in the Input Fields
if (baseView.DOMElements.addressInfo.pincode) {
  baseView.DOMElements.addressInfo.pincode.addEventListener(
    'change',
    async el => {
      let dataObj;
      const pinCodeRes = await axios({
        method: 'GET',
        url: `https://api.postalpincode.in/pincode/${parseInt(
          baseView.DOMElements.addressInfo.pincode.value
        )}`
      });

      if (res.data[0].Status === 'Error') {
        utilities.renderAlertSecondary('Please Enter a valid pincode');
        return;
      }

      if (pinCodeRes.data[0].PostOffice[0])
        dataObj = pinCodeRes.data[0].PostOffice[0];

      if (dataObj) {
        baseView.DOMElements.addressInfo.district.value = dataObj.District;
        baseView.DOMElements.addressInfo.state.value = dataObj.State;
        baseView.DOMElements.addressInfo.country.value = dataObj.Country;
      }
    }
  );
}
/* ###### */

// ## When Add Address Form is submitted
if (baseView.DOMElements.formAddAddress) {
  baseView.DOMElements.formAddAddress.addEventListener('submit', e => {
    e.preventDefault();
    assignAddressDOM();
    if (baseView.validateInputs()) {
      authenticate.addAddress(
        baseView.DOMElements.addressInfoValue,
        baseView.DOMElements.formAddAddress.dataset.status
      );
    }
  });
}
/* ###### */

// ## When Update Address Form is submitted
if (baseView.DOMElements.formUpdateAddress) {
  baseView.DOMElements.formUpdateAddress.addEventListener('submit', e => {
    e.preventDefault();
    assignAddressDOM();

    if (baseView.validateInputs()) {
      authenticate.updateAddress(
        baseView.DOMElements.addressInfoValue,
        baseView.DOMElements.formUpdateAddress.dataset.addressid,
        baseView.DOMElements.formUpdateAddress.dataset.status
      );
    }
  });
}
/* ###### */

// ## When User Deletes one of his addresses
if (baseView.DOMElements.deleteAddressBtn.length > 0) {
  baseView.DOMElements.deleteAddressBtn.forEach(el =>
    el.addEventListener('click', e => {
      authenticate.deleteAddress(el.dataset.addressid);
      // Here u can user el. ,, because el is the element which is coming for, loop not from eventListener
    })
  );
}

/* ###### */

// ## When Add to Cart Button is clicked
if (baseView.DOMElements.addToCartBtn) {
  baseView.DOMElements.addToCartBtn.addEventListener('click', e => {
    authenticate.addProductToCart(
      baseView.DOMElements.addToCartBtn.dataset.productid,
      baseView.DOMElements.productQuantityCart.value
    );
  });
}

/* ###### */

// ## When Remove Cart Button is clicked
if (baseView.DOMElements.removeCartItemBtn) {
  baseView.DOMElements.removeCartItemBtn.forEach(el => {
    el.addEventListener('click', e => {
      authenticate.removeCartItem(el.dataset.productid);
    });
  });
}

// Forgot Password Form Submit
if (baseView.DOMElements.formPasswordForgot) {
  baseView.DOMElements.formPasswordForgot.addEventListener('submit', e => {
    e.preventDefault();
    if (baseView.validateInputs()) {
      authenticate.forgetPassword(baseView.DOMElements.email.value);
    }
  });
}

// Reset Password Request
if (baseView.DOMElements.formPasswordReset) {
  baseView.DOMElements.formPasswordReset.addEventListener('submit', e => {
    e.preventDefault();
    if (baseView.validateInputs()) {
      authenticate.resetPassword(
        baseView.DOMElements.newPassword.value,
        baseView.DOMElements.confirmPassword.value,
        baseView.DOMElements.formPasswordReset.dataset.resettoken
      );
    }
  });
}

// Save the Quantity to session storage when user clicks on buy now
if (baseView.DOMElements.buyNowBtn) {
  baseView.DOMElements.buyNowBtn.addEventListener('click', () => {
    sessionStorage.setItem(
      'buyingQuantity',
      baseView.DOMElements.productQuantityCart.value
    );
  });
}

// Create a instance of Booking Model on placeOrderBtn Click
if (baseView.DOMElements.orderPlaceBtn) {
  baseView.DOMElements.orderPlaceBtn.addEventListener('click', () => {
    if (baseView.DOMElements.orderPlaceBtn.dataset.iscart === 'true') {
      authenticate.addProductToBooking(
        baseView.DOMElements.orderPlaceBtn.dataset.userid
      );
    } else if (baseView.DOMElements.orderPlaceBtn.dataset.iscart === 'false') {
      authenticate.addProductToBooking(
        baseView.DOMElements.orderPlaceBtn.dataset.userid,
        baseView.DOMElements.cartItems[0].dataset.productid
      );
    }
  });
}

// Save the Choose address on proceeding to sessionStorage
if (baseView.DOMElements.proceedBtnChooseAddr) {
  baseView.DOMElements.proceedBtnChooseAddr.addEventListener('click', () => {
    authenticate.proceedToBookingDetails();
  });
}

// If proceedAddrBtn exist,, so it verifies, that user is booking something than,
// save the current pathname(route) in sessionStorage
if (baseView.DOMElements.proceedBtnChooseAddr) {
  /* Note :
    What ecactly happens here is that,, I save the current pathname to sessionStorage,, this route will be
    called if the user comming to choose an address and he wants to edit or add in the myAddress section,, so after
    editing or adding the page should redirect to the previous route,, from where the user can continue his booking process
  */
  sessionStorage.setItem('chooseAddressRoute', window.location.pathname);
}

// ## Will be redirecting directly
// // When Clicked on cartIcon on phone and pc
// if (baseView.DOMElements.cartBtnHeader.length > 0) {
//   baseView.DOMElements.cartBtnHeader.forEach(el => {
//     el.addEventListener(
//       'click',
//       cartView.showCart(baseView.DOMElements.cartBtnHeader[0].dataset.user)
//     );
//   });
// }

// Check Delivery status on pincodes
if (baseView.DOMElements.pincodeCheckBtn) {
  baseView.DOMElements.pincodeCheckBtn.addEventListener(
    'click',
    baseView.checkDeliveryOnPincode
  );
}

//## Validations

// Check whether password and confirmpassword are matching
if (baseView.DOMElements.confirmPassword) {
  baseView.DOMElements.confirmPassword.addEventListener(
    'keyup',
    baseView.checkPasswordMatch
  );
  baseView.DOMElements.newPassword.addEventListener(
    'change',
    baseView.checkPasswordMatch
  );
  baseView.DOMElements.newPassword.addEventListener(
    'change',
    baseView.validatePasswordInput(baseView.DOMElements.newPassword)
  );
}

// Password Length should be minimum 6 characters
if (baseView.DOMElements.passwordCommonObj) {
  baseView.DOMElements.passwordCommonObj.addEventListener(
    'keyup',
    baseView.validatePasswordInput(baseView.DOMElements.passwordCommonObj)
  );
}

// Onchaging the value of input, check that single input
if (baseView.DOMElements.inputCommonArr.length > 0) {
  baseView.DOMElements.inputCommonArr.forEach(el => {
    el.addEventListener('change', baseView.validateInput(el));
  });
}

// Cancelling a order
if (baseView.DOMElements.orderCancelBtn) {
  baseView.DOMElements.orderCancelBtn.addEventListener(
    'click',
    authenticate.cancelOrder(
      baseView.DOMElements.orderCancelBtn.dataset.bookingid,
      baseView.DOMElements.orderCancelBtn.dataset.userid
    )
  );
}

// When user searches something
if (baseView.DOMElements.searchBtn) {
  baseView.DOMElements.searchBtn.addEventListener(
    'click',
    baseView.searchResults
  );
}
