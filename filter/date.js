var monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function date(content) {
  return `${monthName[content.getMonth()]} ${content.getDate()}, ${content.getFullYear()}`;
}

module.exports = {date};
