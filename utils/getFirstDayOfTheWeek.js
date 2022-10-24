

module.exports = (date) => {
      date = new Date(date);
      var day = date.getDay();
      diff = date.getDate() - day - 1; // adjust when day is sunday
      date = new Date(date.setDate(diff));
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}