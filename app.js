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
            var self = this;

            document.addEventListener('keydown', function(e) {
                var direction = '';

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
            var nextCoordinates = [];

            function riba() {
                for (var i = 0; i < self.figureCoordinates.length; i++) {
                    nextCoordinates.push(self.figureCoordinates[i] + coordinatesShift);
                }
            }

            function foo() {
                self.clear();

                nextCoordinates.forEach(function(point) {
                    self.activateCell('g' + point);
                    self.figureCoordinates = [];
                    self.figureCoordinates = nextCoordinates;
                });
            }

            switch (direction) {
                case 'left':
                    coordinatesShift = -1;
                    riba();
                    if (!self.isNextCellActive(nextCoordinates) && self.isLeftSideCellExist(self.figureCoordinates)) {
                        foo();
                    }
                    break;
                case 'right':
                    coordinatesShift = 1;
                    riba();
                    if (!self.isNextCellActive(nextCoordinates) && self.isRightSideCellExist(self.figureCoordinates)) {
                        foo();
                    }
                    break;
                case 'down':
                    coordinatesShift = self.verticalSize;
                    riba();
                    if (!self.isNextCellActive(nextCoordinates) && self.isNextCellExist(nextCoordinates)) {
                        foo();
                    }
                    else {
                        self.saveActiveCoordinates();
                        self.resetLevel();
                        self.showNextFigure();
                    }
                    break;
            }
        },
        saveActiveCoordinates: function () {
            var self = this;

            self.figureCoordinates.forEach(function(point) {
                self.activeCoordinates.push(point);
            });
        },
        sortActiveCoordinates: function () {
            var self = this;

            return self.activeCoordinates.sort(function(el, nexEl) {
                return el - nexEl;
            });
        },
        findSplicePoints: function () {
            var self = this;
            var levelsIntervals = {};
            var maxLevel = self.horizontalSize;

            var riba = [];

            for (var i = 0; i < maxLevel; i++) {
                var level = i + 1;

                levelsIntervals['level-' + level] = [];
                var min = self.verticalSize*(level - 1);
                var max = (level * self.verticalSize) - 1;
                levelsIntervals['level-' + level].push(min);
                levelsIntervals['level-' + level].push(max);

                riba.push(min);
            }

            return riba.sort(function(el, nexEl) {
                return el - nexEl;
            });
        },
        resetLevel: function () {
            var self = this;

            if (self.activeCoordinates.length >= self.verticalSize) {
                var sortedArr = self.sortActiveCoordinates();
                var splicePoints = self.findSplicePoints();
                var copyActiveCoordinates = sortedArr.slice();

                var splicePoint = null;

                for (var i = 0; i < splicePoints.length; i++) {
                    console.log(splicePoints[i]);
                    if (sortedArr.indexOf(splicePoints[i]) !== -1) {
                        splicePoint = sortedArr.indexOf(splicePoints[i]);
                        break;
                    }
                }

                console.log('sortedArr', sortedArr);
                console.log('splicePoint', splicePoint);

                if (splicePoint !== null) {
                    while (copyActiveCoordinates.length) {
                        var slice = copyActiveCoordinates.splice(splicePoint, self.verticalSize);
                        var maxVal = Math.max.apply({}, slice);
                        var minVal = Math.min.apply({}, slice);

                        //console.log('slice', slice);
                        //console.log('maxVal', maxVal);
                        //console.log('minVal', minVal);

                        if ((maxVal - minVal) === (self.verticalSize - 1)) {
                            self.clear(slice);

                            var tempArr = self.activeCoordinates.filter(function(el) {
                                return slice.indexOf(el) < 0;
                            });

                            self.activeCoordinates = [];
                            self.activeCoordinates = tempArr.slice();
                        }
                    }
                }
            }
        },
        isNextCellActive: function(nextCoordinates) {
            var self = this,
                result = false,
                index = nextCoordinates.length;

            while (index--) {
                if (self.activeCoordinates.indexOf(nextCoordinates[index]) !== -1) {
                    result = true;
                    break;
                }
            }

            return result;
        },
        isLeftSideCellExist: function () {
            var self = this,
                result = true,
                index = self.figureCoordinates.length;

            while (index--) {
                var position = self.figureCoordinates[index] % self.verticalSize;
                var leftMax = self.figureCoordinates[index] - position;

                //console.log('leftMax', leftMax);
                //console.log('nextCoordinates[index]', self.figureCoordinates[index]);

                if (self.figureCoordinates[index] === leftMax) {
                    result = false;
                    break;
                }
            }
            //console.error('=======');

            return result;
        },
        isRightSideCellExist: function () {
            var self = this,
                result = true,
                index = self.figureCoordinates.length;

            while (index--) {
                var position = self.figureCoordinates[index] % self.verticalSize;
                var rightMax = self.figureCoordinates[index] + self.verticalSize - position - 1;

                if (self.figureCoordinates[index] >= rightMax) {
                    result = false;
                    break;
                }
            }

            return result;
        },
        isNextCellExist: function (nextCoordinates) {
            var self = this,
                result = true,
                downMax = self.maxCoordinate,
                index = nextCoordinates.length;

            while (index--) {
                if (nextCoordinates[index] > downMax) {
                    result = false;
                    break;
                }
            }

            return result;
        },
        clear: function(coordinates) {
            var self = this,
                coordinatesForReset = coordinates || self.figureCoordinates;

            coordinatesForReset.forEach(function(point) {
                var cell = document.getElementsByClassName('g' + point)[0];

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
            }, 300);
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