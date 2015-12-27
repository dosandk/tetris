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
        figureCoordinates: [],
        initialize: function () {
            var self = this;

            console.error('tetris init');

            self.initListeners();
            self.generateField(self.verticalSize, self.horizontalSize);
            self.clearField();
            self.showFigure();
        },
        initListeners: function () {
            var self = this;

            document.addEventListener('keydown', function(e) {
                switch (e.keyCode) {
                    case 37:
                        self.moveLeft();
                        break;
                    case 39:
                        self.moveRight();
                        break;
                }
            });
        },
        showFigure: function () {
            var self = this,
                figure = self.generateFigure();

            self.drawFigure(figure);
            self.moveDown();
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
        drawFigure: function (type) {
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
            self.figureCoordinates.forEach(function(point) {
                self.activateCell('g' + point);
            })
        },
        moveLeft: function () {
            var self = this;

            self.clearField();

            self.figureCoordinates = self.figureCoordinates.map(function(point) {
                return point - 1;
            });

            self.figureCoordinates.forEach(function(point) {
                self.activateCell('g' + point);
            });
        },
        moveRight: function () {
            var self = this;

            self.clearField();

            self.figureCoordinates = self.figureCoordinates.map(function(point) {
                return point + 1;
            });

            self.figureCoordinates.forEach(function(point) {
                self.activateCell('g' + point);
            });
        },
        moveDown: function () {
            var self = this;

            var moveInterval = setInterval(function() {
                self.clearField();

                self.figureCoordinates = self.figureCoordinates.map(function(point) {
                    return point + self.verticalSize;
                });

                self.figureCoordinates.forEach(function(point) {
                    self.activateCell('g' + point);
                });

                var maxCoordinate = self.verticalSize * self.horizontalSize,
                    lastCoordinate = self.figureCoordinates[self.figureCoordinates.length -1];

                if (lastCoordinate + 20 > maxCoordinate) {
                    clearInterval(moveInterval);
                    self.figureCoordinates = [];
                    self.showFigure();
                }
            }, 300);
        },
        clearField: function () {
            var cells = document.getElementsByClassName('horizontal'),
                cellsArray = Array.prototype.slice.call(cells);

            cellsArray.forEach(function(cell) {
                cell.className = cell.className.replace(/\bactive\b/, '');
            });
        },
        activateCell: function (className) {
            var cell = document.getElementsByClassName(className)[0],
                currentClassNames = cell.className;

            cell.className = currentClassNames + ' active';
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