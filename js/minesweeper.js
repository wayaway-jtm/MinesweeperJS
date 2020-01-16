"use strict";
let count = 0;
const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
    'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

const MINE_TOTAL = 99;
let recursiveCounter = 0;

class Tile {
    constructor(row, column) {
        this.row = row;
        this.col = column;
        this.mine = false;
        this.flagged = false;
        this.value = 0;
    }

    getRow() {
        return this.row;
    }

    getCol() {
        return Number(this.col);
    }

    getCoords() {
        return (this.row + this.col);
    }

    getValue() {
        return Number(this.value);
    }

    isMine() {
        return this.mine;
    }

    isFlagged() {
        return this.flagged;
    }

};

let tiles = [];

// Populate tiles
const cells = document.getElementsByTagName('td');
for (const tile of cells) {
    const newTile = new Tile(tile.id[0], tile.id.substring(1));

    tile.addEventListener('mousedown', onMouseDown);
    tile.addEventListener('mouseup', onMouseUp);
    tile.addEventListener('contextmenu', onRightClick);
    tile.addEventListener('mouseleave', onMouseLeave);

    tiles.push(newTile);
}

randomizeMines();
setTileValues();

/*
    Functions
*/

//#region Mouse Events

/**
 * Handles mouseDown event
 * @param {*} e Event argument
 */
function onMouseDown(e) {
    e.preventDefault();
    // Trigger only on left click
    if (e.buttons === 1 && e.target.classList.contains('hidden')) {
        let tile = e.target;
        tile.classList = ['pressed'];
    }
};

/**
 * Handles mouseUp event
 * @param {*} e Event argument
 */
function onMouseUp(e) {
    let tile = e.target;
    let jsTile = tiles.find(t => t.getCoords() === tile.id);
    // Triggering only if pressed first
    if (tile.classList.contains('pressed')) {
        if (jsTile.isMine()) {
            tile.classList = ['mine'];
        } else if (jsTile.getValue() === 0) {
            revealTile(tile);
            revealAdjacentTiles(jsTile);
        } else {
            revealTile(tile);
        }
        tile.removeEventListener('mousedown', onMouseDown);
    } else if (tile.classList.contains('open')) {
        if (jsTile.getValue() === getAdjacentFlags(jsTile)) {
            revealAdjacentTiles(jsTile);
        }
    }
};

/**
 * Toggles flag on tile
 * @param {*} e Event argument
 */
function onRightClick(e) {
    e.preventDefault();
    let tile = e.target;
    // Flagging only if not open
    if (!tile.classList.contains('open')) {
        // Toggling flag
        if (tile.classList.contains('flagged')) {
            tile.classList = ['hidden'];
            tile.addEventListener('mousedown', onMouseDown);
            getMatchingJSTile(tile).flagged = false;
        } else {
            tile.classList = ['flagged'];
            tile.removeEventListener('mousedown', onMouseDown);
            getMatchingJSTile(tile).flagged = true;
        }
    }
};

/**
 * Handles clicking then leaving tile
 * @param {*} e Mouse Event argument
 */
function onMouseLeave(e) {
    // Resets tile if pressed
    let tile = e.target;
    if (tile.classList.contains('pressed')) {
        tile.classList = ['hidden'];
    }
};
//#endregion

//#region Mine Generation
function randomizeMines() {
    for (let i = 0; i < MINE_TOTAL; i++) {
        let mineTile = getEmptyTile();

        mineTile.mine = true;
        // DEBUG logs mine positions
        // console.log(`row: ${mineTile.row} col: ${mineTile.col}`);
        // DEBUG shows mines
        //getMatchingHTMLTile(mineTile).classList.add('mine');
    }
}


function getEmptyTile() {
    let max = tiles.length - 1;
    let index = Math.floor(Math.random() * max);

    if (tiles[index].isMine()) {
        return getEmptyTile();
    } else {
        recursiveCounter = 0;
        return tiles[index];
    }
}

//#endregion

//#region HTML/Tile Interaction

function getRowFromHTML(htmlTile) {
    return htmlTile.id[0];
}

function getColFromHTML(htmlTile) {
    return htmlTile.id.slice(1);
}

function getMatchingHTMLTile(tile) {
    let htmlTiles = document.getElementsByTagName('td');
    for (const i of htmlTiles) {
        if (i.id === tile.getCoords()) {
            return i;
        }
    }
    return null;
}

function getMatchingJSTile(htmlTile) {
    for (const i of tiles) {
        if (htmlTile.id == i.getCoords()) {
            return i;
        }
    }
    console.log('No match found: ', htmlTile);
    return null;
}

function isRowAdjacent(centerTile, adjacentTile) {
    let tileRow = centerTile.getRow();
    let prevRowLetter = ALPHABET[ALPHABET.indexOf(tileRow) - 1];
    let nextRowLetter = ALPHABET[ALPHABET.indexOf(tileRow) + 1];

    if (adjacentTile.getRow() === prevRowLetter ||
        adjacentTile.getRow() === nextRowLetter) {
        return true;
    } else {
        return false;
    }
}

function isColAdjacent(centerTile, adjacentTile) {
    if (adjacentTile.getCol() === (centerTile.getCol() - 1) ||
        adjacentTile.getCol() === (centerTile.getCol() + 1)) {
        return true;
    } else {
        return false;
    }
}

function isAdjacent(jsCenterTile, jsAdjacentTile) {
    // Filter same tile
    if (!(jsCenterTile.getCoords() === jsAdjacentTile.getCoords())) {
        // Filter rows
        if (isRowAdjacent(jsCenterTile, jsAdjacentTile) ||
            jsCenterTile.getRow() === jsAdjacentTile.getRow()) {

            // Filter columns
            if (isColAdjacent(jsCenterTile, jsAdjacentTile) ||
                jsCenterTile.getCol() === jsAdjacentTile.getCol()) {
                return true;
            }
        }
    }
    return false;
}

function revealTile(htmlTile) {
    htmlTile.classList = ['open'];
    setTileNum(htmlTile);
}

function getAdjacentTiles(jsCenterTile) {
    return tiles.filter(t => isAdjacent(jsCenterTile, t));
}

function getAdjacentFlags(jsCenterTile) {
    let adjacentTiles = getAdjacentTiles(jsCenterTile);
    return adjacentTiles.filter(t => t.isFlagged()).length;
}

function revealAdjacentTiles(jsCenterTile) {
    let adjacentTiles = getAdjacentTiles(jsCenterTile);
    for (const jsTile of adjacentTiles) {
        if (!jsTile.isMine()) {
            let htmlTile = getMatchingHTMLTile(jsTile);
            if (!htmlTile.classList.contains('open')) {
                htmlTile.classList = ['open'];
                setTileNum(htmlTile);
                if (jsTile.getValue() === 0) {
                    revealAdjacentTiles(jsTile);
                }
            }
        }
    }
}

//#endregion

//#region Tile Value Generation
/**
 * Computes & assigns values to tiles
 * Tile values = how many mines are around them
 */
function setTileValues() {
    for (const tileIterator of tiles) {
        if (!tileIterator.isMine()) {
            let adjacentTiles = getAdjacentTiles(tileIterator);
            let mineCount = adjacentTiles.filter(t => t.isMine()).length;
            tileIterator.value = mineCount;
        } else {
            tileIterator.value = -1;
        }
    }
};

function setTileNum(targetHtmlTile) {
    let jsTile = getMatchingJSTile(targetHtmlTile);
    switch (jsTile.getValue()) {
        case 0:
            // Don't need to do anything
            break;
        case 1:
            targetHtmlTile.textContent = '1';
            targetHtmlTile.classList.add('num1')
            break;
        case 2:
            targetHtmlTile.textContent = '2';
            targetHtmlTile.classList.add('num2')
            break;
        case 3:
            targetHtmlTile.textContent = '3';
            targetHtmlTile.classList.add('num3')
            break;
        case 4:
            targetHtmlTile.textContent = '4';
            targetHtmlTile.classList.add('num4')
            break;
        case 5:
            targetHtmlTile.textContent = '5';
            targetHtmlTile.classList.add('num5')
            break;
        case 6:
            targetHtmlTile.textContent = '6';
            targetHtmlTile.classList.add('num6')
            break;
        case 7:
            targetHtmlTile.textContent = '7';
            targetHtmlTile.classList.add('num7')
            break;
        case 8:
            targetHtmlTile.textContent = '8';
            targetHtmlTile.classList.add('num8')
            break;
    }
}
//#endregion

// get adjacent tiles

// reveal adjacent tiles

// flag adjacent tiles

// count flagged adjacent tiles

// get adjacent mine count