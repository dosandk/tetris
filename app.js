;(function(root, factory) {
    root.tetris = factory();

    document.addEventListener('DOMContentLoaded', tetris.initialize.bind(tetris));
}(this, function() {
    function generateUniqueClassName(element) {
        var rowCounter = 0,
            cellCounter = 0,
            counter = null,
            prefix = '';

        switch (element) {
            case 'row':
                prefix = 'v';
                counter = rowCounter;
                break;
            case 'cell':
                prefix = 'g';
                counter = cellCounter;
                break;
        }

        return function() {
            return prefix + (counter++) + ' ';
        }
    }

    var rowUniqueClassNameGenerator = generateUniqueClassName('row'),
        cellUniqueClassNameGenerator = generateUniqueClassName('cell');

    function createElement(name) {
        var element = null;

        function addClass(element, classNames) {
            return element.className = classNames;
        }

        function createElement(elemName) {
            var elementName = elemName || 'div';

            return document.createElement(elementName);
        }

        switch (name) {
            case 'row':
                var rowClassName = rowUniqueClassNameGenerator();

                element = createElement();
                addClass(element, rowClassName + 'vertical display-table-row');
                break;
            case 'cell':
                var cellClassName = cellUniqueClassNameGenerator();

                element = createElement();
                addClass(element, cellClassName + 'display-table-cell horizontal');
                break;
            case 'field':
                element = createElement();
                addClass(element, 'field display-table');
                break;
            case 'tetris':
                element = createElement();
                addClass(element, 'tetris');
                break;
        }

        return element;
    }

    return {
        verticalSize: 20,
        horizontalSize: 40,
        maxCoordinate: 0,
        activeCoordinates: [],
        figureCoordinates: [],
        initialize: function () {
            var self = this;

            self.maxCoordinate = this.verticalSize * this.horizontalSize;

            console.error('tetris init');

            self.initListeners();
            self.generateField(self.verticalSize, self.horizontalSize);
            self.clearField();
            self.showFigure();
        },
        initListeners: function () {
            var self = this,
                direction = '';

            document.addEventListener('keydown', function(e) {
                switch (e.keyCode) {
                    case 37:
                        direction = 'left';
                        break;
                    case 39:
                        direction = 'right';
                        break;
                    case 40:
                        direction = 'down';
                        break;
                }

                self.moveFigure(direction);
            });
        },
        moveFigure: function (direction) {
            var self = this;
            var coordinatesShift = 0;
            var currentCoord = [];

            function riba() {
                for (var i = 0; i < self.figureCoordinates.length; i++) {
                    currentCoord.push(self.figureCoordinates[i] + coordinatesShift);
                }
            }

            function foo() {
                self.clear(currentCoord, coordinatesShift);

                currentCoord.forEach(function(point) {
                    self.activateCell('g' + point);
                    self.figureCoordinates = [];
                    self.figureCoordinates = currentCoord;
                });
            }

            switch (direction) {
                case 'left':
                    coordinatesShift = -1;
                    riba();
                    if (!self.isNextCellActive(currentCoord) && self.isLeftSideCellExist(currentCoord)) {
                        foo();
                    }
                    break;
                case 'right':
                    coordinatesShift = 1;
                    riba();
                    if (!self.isNextCellActive(currentCoord) && self.isRightSideCellExist(currentCoord)) {
                        foo();
                    }
                    break;
                case 'down':
                    coordinatesShift = self.verticalSize;
                    riba();
                    if (!self.isNextCellActive(currentCoord) && self.isNextCellExist(currentCoord)) {
                        foo();
                    }
                    else {
                        self.showNextFigure();
                    }
                    break;
            }
        },
        isNextCellActive: function(currentCoord) {
            var self = this,
                result = false,
                index = currentCoord.length;

            while (index--) {
                if (self.activeCoordinates.indexOf(currentCoord[index]) !== -1) {
                    result = true;
                    break;
                }
            }

            return result;
        },
        isLeftSideCellExist: function (currentCoord) {
            var self = this,
                result = true,
                index = currentCoord.length;

            while (index--) {
                var position = currentCoord[index] % self.verticalSize;
                var leftMax = currentCoord[index] - position;

                if (currentCoord[index] <= leftMax) {
                    result = false;
                    break;
                }
            }

            return result;
        },
        isRightSideCellExist: function (currentCoord) {
            var self = this,
                result = true,
                index = currentCoord.length;

            while (index--) {
                var position = currentCoord[index] % self.verticalSize;
                var rightMax = currentCoord[index] + self.verticalSize - position - 1;

                if ( currentCoord[index] >= rightMax) {
                    result = false;
                    break;
                }
            }

            return result;
        },
        isNextCellExist: function (currentCoord) {
            var self = this,
                result = true,
                downMax = self.maxCoordinate,
                index = currentCoord.length;

            while (index--) {

                if (currentCoord[index] > downMax) {
                    result = false;
                    break;
                }
            }

            return result;
        },
        clear: function(coordinates, coordinatesShift) {
            var self = this;

            coordinates.forEach(function(point) {
                var cell = document.getElementsByClassName('g' + (point - coordinatesShift))[0];

                if (typeof cell !== 'undefined') {
                    cell.className = cell.className.replace(/\bactive\b/, '');
                }
            });
        },
        showFigure: function () {
            var self = this,
                figure = self.generateFigure();

            self.generateCoordinates(figure);
            self.drawFigure();
            self.moveInterval = setInterval(function() {
                self.moveFigure('down');
            }, 1000);
        },
        drawFigure: function () {
            var self = this;

            self.figureCoordinates.forEach(function(point) {
                self.activateCell('g' + point);
            });
        },
        generateField: function (vSize, hSize) {
            var verticalSize = vSize || this.verticalSize,
                horizontalSize = hSize || this.horizontalSize;

            var tetris = createElement('tetris'),
                field = createElement('field');

            for (var i = 0; i < horizontalSize; i++) {
                var row = createElement('row');

                for (var j = 0; j < verticalSize; j++) {
                    row.appendChild(createElement('cell'));
                }

                field.appendChild(row);
            }

            tetris.appendChild(field);
            document.body.appendChild(tetris);
        },
        generateCoordinates: function (type) {
            var self = this,
                coordinates = [];

            switch (type) {
                case 'cube':
                    console.error('draw cube');
                    coordinates = [8, 9, 28, 29];
                    break;
                case 'l':
                    console.error('draw l');
                    coordinates = [8, 28, 29, 30];
                    break;
                case 't':
                    console.error('draw t');
                    coordinates = [8, 28, 27, 29];
                    break;
            }

            self.figureCoordinates = coordinates;
        },
        showNextFigure: function () {
            var self = this;

            clearInterval(self.moveInterval);

            self.figureCoordinates.forEach(function(point) {
                self.activeCoordinates.push(point);
            });

            self.figureCoordinates = [];
            self.showFigure();
        },
        clearField: function () {
            var cells = document.getElementsByClassName('horizontal'),
                cellsArray = Array.prototype.slice.call(cells);

            cellsArray.forEach(function(cell) {
                cell.className = cell.className.replace(/\bactive\b/, '');
            });
        },
        activateCell: function (className) {
            var cell = document.getElementsByClassName(className)[0];

            if (typeof cell !== 'undefined') {
                var currentClassNames = cell.className;

                cell.className = currentClassNames + ' active';
            }
        },
        generateFigure: function () {
            var figure = null,
                randomNumber = Math.random();

            if (randomNumber <= 0.33) {
                figure = 'cube';
            }
            else if (0.33 < randomNumber && randomNumber >= 0.66) {
                figure = 'l';
            }
            else {
                figure = 't';
            }

            return figure;
        }
    };
}));