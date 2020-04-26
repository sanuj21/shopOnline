// Promises

export const alertPrimary = (type, msg) => {
  const alertMarkup = `
  <div class = 'customAlert customAlert--${type}'>
  ${msg}
  </div>`;

  document.querySelector('body').insertAdjacentHTML('beforeend', alertMarkup);

  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      const alertEl = document.querySelector('.customAlert');
      alertEl.parentElement.removeChild(alertEl);
      resolve();
    }, 4000);
  });
};

const removeSecondaryAlert = resolve => {
  return () => {
    document
      .querySelector('.modalAlert')
      .parentElement.removeChild(document.querySelector('.modalAlert'));
    resolve();
  };
};

export const alertSecondary = msg => {
  const alertMarkup = `
      <div class = "modalAlert">
          <div class = "modalAlert__content">
              <div class = "modalAlert__para">
                  ${msg}
              </div>
              <a class = "modalAlert__btn--ok">Ok</a>
          </div>
      </div>
        `;

  document.querySelector('body').insertAdjacentHTML('beforeend', alertMarkup);

  return new Promise((resolve, reject) => {
    document
      .querySelector('.modalAlert__btn--ok')
      .addEventListener('click', removeSecondaryAlert(resolve));
  });
};
