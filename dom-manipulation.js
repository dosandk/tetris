var $ = function(slector) {
    var firstChar = slector.charAt(0);
    var preparedSelector = slector.substr(1);
    var elem;

    switch (firstChar) {
        case '#':
            elem = document.getElementById(preparedSelector);
            break;
        case '.':
            elem = document.getElementsByClassName(preparedSelector);
            break;
        case '[':
            elem = document.querySelectorAll(slector);
            break;
        default:
            elem = document.getElementsByTagName(slector);
            break;
    }

    return {
        0: elem,
        addClass: function(className) {
            if (this[0].length) {
                var currentElements = Array.prototype.slice.call(this[0]);

                currentElements.forEach(function(elem) {
                    elem.className += ' ' + className + ' ';
                })
            }
            else {
                this[0].className += ' ' + className + ' ';
            }

            return this[0];
        },
        removeClass: function(className) {
            if (this[0].length) {
                var currentElements = Array.prototype.slice.call(this[0]);

                currentElements.forEach(function(elem) {
                    elem.className = elem.className.replace(new RegExp('\\b' + className + '\\b'),'');
                })
            }
            else {
                this[0].className = this[0].className.replace(new RegExp('\\b' + className + '\\b'),'');
            }

            return this[0];
        }
    }
};
