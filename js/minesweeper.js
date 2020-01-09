"use strict";

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
        return this.col;
    }

    getCoords() {
        return (this.row + this.col);
    }

    getValue() {
        return this.value;
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
    if (e.buttons === 1) {
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
    // Triggering only if pressed first
    if (tile.classList.contains('pressed')) {
        tile.removeEventListener('mousedown', onMouseDown);
        if (tiles.find(t => t.getCoords() === tile.id).isMine()) {
            tile.classList = ['mine'];
        } else {
            tile.classList = ['open'];
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

function randomizeMines() {
    for (let i = 0; i < MINE_TOTAL; i++) {
        let mineTile = getEmptyTile();
        let loopCount = 0;
        while (typeof mineTile === 'undefined') {
            console.log(`------UNDEFINED ${++loopCount}`);
            mineTile = getEmptyTile();
        }
        //console.log(mineTile);
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
    //console.log(`index ${index} of ${max}`);

    if (tiles[index].isMine()) {
        console.log(`RECURSION ${++recursiveCounter}`)
        getEmptyTile();
    } else {
        recursiveCounter = 0;
        return tiles[index];
    }
}

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
        if (htmlTile.id === i.getCoords()) {
            return i;
        }
    }
    return null;
}

//#endregion

// get adjacent tiles

// reveal adjacent tiles

// flag adjacent tiles

// count flagged adjacent tiles

// get adjacent mine count