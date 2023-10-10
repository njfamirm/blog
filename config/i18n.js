const locale = {code: 'fa'};

const numberFormatter = new Intl.NumberFormat(locale.code);

function number(n) {
  return numberFormatter.format(n);
}

module.exports = {number};
