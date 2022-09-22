module.exports = (list, field = "balance") => {
      let total = 0;

      for (let index = 0; index < list.length; index++) {
            const element = list[index];

            if (element[field]) {
                  total += element[field];
            }
      }

      return total;
};