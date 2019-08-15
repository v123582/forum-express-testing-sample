module.exports = {
  add: function (a, b) {
    if(isNaN(a) || isNaN(b)){
        throw new Error("參數必須為數字")
    }

    return a + b
  },
}