import * as baseView from './baseView';
import * as authenticate from '../controller/authenticate';
import axios from 'axios';
import * as utilities from '../controller/utilities';

// For Testing Purpose
const isMobile = /Android/i.test(navigator.userAgent);
let ipAddr = baseView.variables.computerIp;
if (isMobile === true) ipAddr = baseView.variables.mobileIp;

// Updating the total cart Price of cart
const updateCartTotalPrice = (exAmt, st) => {
  const tPrice = Number(
    baseView.DOMElements.totalAmtCart.textContent.match(/(\d+)/)[0]
  );
  if (st === 'add') {
    baseView.DOMElements.totalAmtCart.textContent = `₹ ${tPrice + exAmt} /-`;
  } else if (st === 'minus') {
    baseView.DOMElements.totalAmtCart.textContent = `₹ ${tPrice - exAmt} /-`;
  }
};

// For updating the quantity in input box
export const updateCart = i => {
  return e => {
    if (e.target.matches('.cart__info--quantity__plus')) {
      baseView.DOMElements.quantityData[i].textContent =
        Number(baseView.DOMElements.quantityData[i].textContent) + 1;
      updateCartTotalPrice(
        Number(
          baseView.DOMElements.cartItemsPrice[i].textContent.match(/(\d+)/)[0]
        ), // Regex to match a number in a string
        'add'
      );
    } else if (e.target.matches('.cart__info--quantity__minus')) {
      if (Number(baseView.DOMElements.quantityData[i].textContent) > 1) {
        baseView.DOMElements.quantityData[i].textContent =
          Number(baseView.DOMElements.quantityData[i].textContent) - 1;
        updateCartTotalPrice(
          Number(
            baseView.DOMElements.cartItemsPrice[i].textContent.match(/(\d+)/)[0]
          ),
          'minus'
        );
      }
    }
    // Save the Updated Quantity to database or the cookie
    authenticate.updateProductCart(
      baseView.DOMElements.removeCartItemBtn[i].dataset.productid,
      Number(baseView.DOMElements.quantityData[i].textContent),
      true
    );
  };
};
/* ########### */

// Show Cart
export const showCart = user => {
  return async () => {
    if (user && user != '') {
      window.location.assign(`/myAccount/cart/${user}`);
    } else {
      const res = await axios({
        method: 'POST',
        url: `/myAccount/cart`
      });
    }
  };
};
