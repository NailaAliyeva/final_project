function randomString() {
    let result = '';
    for (let i = 0; i < 5; i++) {
        result += Math.random().toString(36).substring(2);
    }

    return result;
  }
  
  module.exports = randomString;