/* eslint-disable */
import axios from 'axios';
import * as customAlerts from '../view/customAlerts';
import * as baseView from '../view/baseView';
import BookingProduct from '../model/BookingProduct';
import CartProduct from '../model/CartProduct';
import * as utilities from './utilities';

/*------ WHEN LOGIN ROUTE IS HITTED -----*/
export const login = async (email, password, st = '') => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/users/login`,
      data: {
        email,
        password
      }
    });
    if (st === 'booking') {
      utilities.renderAlertSecondary('Logged in successfully', true); // Just Reload , if the user coming from booking
    } else {
      if (
        res.data.status === 'error' &&
        res.data.issue === 'emailNotConfirmed'
      ) {
        // Create a modal popup
        customAlerts.alertSecondary(
          `We've sent you a email!!! Please confirm it to activate your account!!`
        );
      } else {
        window.location.assign('/');
      }
    }
  } catch (err) {
    utilities.renderAlertSecondary(err.response.data.message);
  }
};
/*  ############## */

/*------ CALLED WHEN LOGOUT ROUTE IS HITTED -----*/
export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/users/logout`
    });

    utilities.renderAlertSecondary('Logged out successfully', false, '/');
  } catch (err) {
    utilities.renderAlertSecondary(err.response.data.message);
  }
};
/*  ############## */

/*------ WHEN SIGNUP ROUTE IS HITTED -----*/
export const signup = async (
  name,
  email,
  password,
  passwordConfirm,
  st = ''
) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/users/signup`,
      data: {
        name,
        email,
        password,
        passwordConfirm
      }
    });
    if (st === 'booking') {
      const redirectUrl = window.location.pathname.replace('/signup', '');
      // Get Back to the booking process after signup
      utilities.renderAlertSecondary(
        'Account created successfully!!',
        false,
        redirectUrl
      );
    }
    if (
      res.data &&
      res.data.status === 'error' &&
      res.data.issue === 'emailNotConfirmed'
    ) {
      // Create a modal popup
      customAlerts.alertSecondary(
        `We've sent you a email!!! Please confirm it to activate your account!!`
      );
    } else {
      utilities.renderAlertSecondary(
        'Account Created successfully',
        false,
        '/'
      );
    }
  } catch (err) {
    utilities.renderAlertSecondary(err.response.data.message);
  }
};
/*  ############## */

/*------ WHEN UPDATE_PROFILE IS HITTED (For Updating email and name)-----*/
export const updateProfile = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/updateMe`,
      data: {
        name: name,
        email: email
      }
    });

    if (res.data.staus === 'success')
      utilities.renderAlertSecondary('Your Profile Updated successfully!!');
  } catch (err) {
    utilities.renderAlertSecondary(err.response.data.message);
  }
};
/*  ############## */

/*------ WHEN CHANGE_PASSWORD ROUTE IS HITTED -----*/
export const changePassword = async (
  currentPassword,
  newPassword,
  confirmPassword
) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/changePassword`,
      data: {
        currentPassword,
        newPassword,
        confirmPassword
      }
    });
    if (res.data.staus === 'success')
      utilities.renderAlertSecondary('Your password changed successfully!!');
  } catch (err) {
    utilities.renderAlertSecondary(err.response.data.message);
  }
};
/*  ############## */

const resAddEditAddress = (res, st, msg) => {
  // If the user is trying to edit or add the adddress while booking,, so redirect him again after updating
  if (st === 'booking') {
    utilities.renderAlertPrimary(
      res,
      msg,
      false,
      sessionStorage.getItem('chooseAddressRoute')
    );
  } else {
    if (res.data.staus === 'success')
      utilities.renderAlertSecondary(msg, false, '/myAccount/addresses');
  }
};

/*------ WHEN ADD_ADDRESS ROUTE IS HITTED -----*/
export const addAddress = async (addressInfo, st = '') => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/addAddress`,
      data: {
        addressInfo
      }
    });

    resAddEditAddress(res, st, 'Address added successfulyy');
  } catch (err) {
    utilities.renderAlertSecondary(err.response.data.message);
  }
};
/*  ############## */

/*------ WHEN Update_ADDRESS ROUTE IS HITTED -----*/
export const updateAddress = async (addressInfo, id, st = '') => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/updateAddress/${id}`,
      data: {
        addressInfo
      }
    });

    // If the user is trying to edit or add the adddress while booking,, so redirect him again after updating
    resAddEditAddress(res, st, 'Address updated successfully');
  } catch (err) {
    utilities.renderAlertSecondary(err.response.data.message);
  }
};
/*  ############## */

/*------ WHEN Delete_ADDRESS ROUTE IS HITTED -----*/
export const deleteAddress = async id => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/deleteAddress/${id}`
    });

    utilities.renderAlertSecondary(res, 'Address deleted succesfully!!', true);
  } catch (err) {
    utilities.renderAlertSecondary(err.response.data.message);
  }
};
/*  ############## */

/*------ Forget Password Form -----*/
export const forgetPassword = async email => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/users/forgetPassword`,
      data: {
        email
      }
    });

    utilities.renderAlertSecondary(
      'A instruction has sent to your email for reseting your password!'
    );
  } catch (err) {}
};
/*  ############## */

/*------ Reset Password Request -----*/
export const resetPassword = async (password, passwordConfirm, resetToken) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${resetToken}`,
      data: {
        password,
        passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      utilities.renderAlertSecondary(
        'Password Resetted successfully',
        false,
        '/'
      );
    }
  } catch (err) {
    utilities.renderAlertSecondary(err.response.data.message);
  }
};

// CART

/*------ When Add to Cart Btn is clicked -----*/
export const addProductToCart = async (product, quantity) => {
  try {
    if (baseView.DOMElements.navigation.dataset.user === 'true') {
      const res = await axios({
        method: 'PATCH',
        url: `/api/v1/users/product/addToCart`,
        data: {
          product,
          quantity
        }
      });
      if (res.data.status === 'success')
        utilities.renderAlertSecondary('Item Added to Cart', true);
    } else if (baseView.DOMElements.navigation.dataset.user === 'false') {
      // When the user exist than ,than the item is not going to save in cookie
      // Storing the Product Id and quantity in cookie as a cartItem in [array of obj cart]
      // If cookie exist than it romoves that array,, and add one element and again push back that in storage, if not than creates a new array
      const cartItem = new CartProduct(product, quantity);
      let i;
      let cart = [];
      if (utilities.getCookie('cart')) {
        cart = JSON.parse(utilities.getCookie('cart'));
        let l = cart.length;
        for (i = 0; i < l; i++) {
          if (cart[i].product === cartItem.product) {
            break;
          }
        }
        if (i === cart.length) {
          cart[l] = cartItem;
        } else {
          utilities.renderAlertSecondary('Item already exist in cart');
          return;
        }
      } else {
        cart[0] = cartItem;
      }
      utilities.createCookie('cart', JSON.stringify(cart), 10);
      utilities.renderAlertPrimary('true', 'Item Added to Cart', true);
      // ####
    }
  } catch (err) {
    utilities.renderAlertSecondary(err.response.data.message);
  }
};

/*  ############## */

/*------ When Remove from Cart Btn is clicked -----*/
export const removeCartItem = async product => {
  try {
    if (baseView.DOMElements.navigation.dataset.user === 'true') {
      const res = await axios({
        method: 'PATCH',
        url: `/api/v1/users/product/deleteFromCart`,
        data: {
          product
        }
      });
      utilities.renderAlertSecondary('Removed from cart', true);
    } else if (baseView.DOMElements.navigation.dataset.user === 'false') {
      let cart = utilities.getCookie('cart');
      cart = JSON.parse(cart);
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].product === product) {
          let del = cart.splice(i, 1);
          break;
        }
      }
      utilities.createCookie('cart', JSON.stringify(cart), 10);
      utilities.renderAlertSecondary('Removed from cart', true);
    }
  } catch (err) {
    utilities.renderAlertSecondary(err.response.data.message);
  }
};

/*  ############## */

//Update the Quantity of CartItem
export const updateProductCart = async (product, quantity) => {
  try {
    if (baseView.DOMElements.navigation.dataset.user === 'true') {
      await axios({
        method: 'PATCH',
        url: `/api/v1/users/product/updateProductCart/${product}`,
        data: {
          quantity
        }
      });
    } else if (baseView.DOMElements.navigation.dataset.user === 'false') {
      let cart = utilities.getCookie('cart');
      cart = JSON.parse(cart);
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].product === product) {
          cart[i].quantity = quantity;
          break;
        }
      }
      utilities.createCookie('cart', JSON.stringify(cart), 10);
    }
    // We don't need to notify user,, when he changes the quantity
  } catch (err) {
    utilities.renderAlertSecondary(err.response.data.message);
  }
};

/*  ############## */

// Booking -> Product Model

//----- Booking -----//

export const addProductToBooking = async (userId, productId = null) => {
  try {
    if (!productId) {
      const cartRes = await axios({
        method: 'GET',
        url: `/api/v1/users/getCartProducts`
      });

      let product = [];
      for (let i = 0; i < cartRes.data.cart.length; i++) {
        product[i] = new BookingProduct(
          cartRes.data.cart[i].product,
          cartRes.data.cart[i].quantity
        );
      }
      const res = await axios({
        method: 'POST',
        url: `/api/v1/users/${userId}/bookings`,
        data: {
          product
        }
      });

      if (res.data.status === 'success') {
        window.location.assign('/users/orderConfirmed');
      }
    } else {
      const product = new BookingProduct(
        productId,
        Number(sessionStorage.getItem('buyingQuantity'))
      );

      const res = await axios({
        method: 'POST',
        url: `/api/v1/users/${userId}/bookings`,
        data: {
          product
        }
      });

      if (res.data.status === 'success') {
        window.location.assign('/users/orderConfirmed');
      }
    }
  } catch (err) {
    utilities.renderAlertSecondary(err.response.data.message);
  }
};

// After selecting the Address
export const proceedToBookingDetails = () => {
  let addrArrIndex, nextRoute;
  // Fetching the pathName from url ,, and removing the chooseAddress will make the route required for bookingsDetails
  baseView.DOMElements.radioBtnAddress.forEach(el => {
    if (el.checked) {
      addrArrIndex = el.value;
      return;
    }
  });

  if (window.location.pathname.search('chooseAddress/') != -1) {
    nextRoute = window.location.pathname.replace('chooseAddress/', '');
    nextRoute = nextRoute + `/${addrArrIndex}`;
  } else if (window.location.pathname.search('chooseAddress') != -1) {
    nextRoute = window.location.pathname.replace('chooseAddress', '');
    nextRoute = nextRoute + `${addrArrIndex}`;
  }
  window.location.assign(`${nextRoute}`);
};

// Cancel Order
export const cancelOrder = (orderId, userId) => {
  return async () => {
    try {
      const res = await axios({
        method: 'PATCH',
        url: `/api/v1/users/${userId}/bookings/${orderId}`,
        data: {
          status: 'cancelled'
        }
      });

      if (res.data.status === 'success') {
        window.setTimeout(() => location.reload(), 1000);
      }
    } catch (err) {
      utilities.renderAlertSecondary(err.response.data.message);
    }
  };
};
