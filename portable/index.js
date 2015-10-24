'use strict';

module.exports = {
    validateId
};

const ID_PREFIX = 'USER_';
function validateId(id) {
    return typeof id == 'string' && id.indexOf(ID_PREFIX) === 0;
}
