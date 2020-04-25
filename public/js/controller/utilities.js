import * as customAlerts from '../view/customAlerts';

export const createCookie = (name, value, days) => {
  let expires;
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toGMTString();
  } else {
    expires = '';
  }
  document.cookie = name + '=' + value + expires + '; path=/';
};

export const getCookie = c_name => {
  let c_start, c_end;
  if (document.cookie.length > 0) {
    c_start = document.cookie.indexOf(c_name + '=');
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1;
      c_end = document.cookie.indexOf(';', c_start);
      if (c_end == -1) {
        c_end = document.cookie.length;
      }
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return '';
};

// ## For Showing the Alert Primary
export const renderAlertPrimary = async (
  res,
  msg,
  reload = false,
  assign = '/'
) => {
  if (res === 'true' || res.data.status === 'success') {
    await customAlerts.alertPrimary('success', msg);
    if (reload === true) {
      window.setTimeout(() => location.reload(), 1000);
      return;
    }
    window.setTimeout(() => location.assign(assign), 1000);
  }
};

// ## For Showing the Alert Secondary
export const renderAlertSecondary = async (msg, reload, assign = '') => {
  customAlerts.alertSecondary(msg);
  if (reload === true) {
    window.setTimeout(() => location.reload(), 1000);
    return;
  } else if (assign != '') {
    window.setTimeout(() => location.assign(assign), 1000);
  }
};
