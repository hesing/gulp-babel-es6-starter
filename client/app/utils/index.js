'use strict';

module.exports = {
    count
};

function count() {
    var count = 0;
    setInterval(() => console.log(count++), 400);
}
