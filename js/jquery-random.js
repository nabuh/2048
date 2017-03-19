$.fn.random = function() {
    let randomIndex = Math.floor(Math.random() * this.length);
    return $(this[randomIndex]);
};
