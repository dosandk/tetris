var $ = function(slector) {
    var firstChar = slector.charAt(0),
        preparedSelector = slector.substr(1),
        elem;

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

    var handleApi = {
        add: function(elem, className) {
            elem.className += ' ' + className;
        },
        remove: function(elem, className) {
            elem.className = elem.className.replace(new RegExp('\\b' + className + '\\b'), '');
        }
    };

    return {
        0: elem,
        handleElements: function (methodName, className) {
            var selectedElements = this[0];

            if (selectedElements.length) {
                var selectedElementsArr = Array.prototype.slice.call(selectedElements);

                selectedElementsArr.forEach(function(elem) {
                    handleApi[methodName](elem, className);
                })
            }
            else {
                handleApi[methodName](selectedElements, className);
            }

            return selectedElements;
        },
        addClass: function(className) {
            this.handleElements('add', className);
        },
        removeClass: function(className) {
            this.handleElements('remove', className);
        }
    }
};
