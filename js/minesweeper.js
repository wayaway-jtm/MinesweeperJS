"use strict";

const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
    'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

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

// Functions

/**
 * Handles mouseDown event
 * 
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
 * TODO: reveal tile or appropriate action,
 *       on revealed tile w/ flagged adjacent tiles
 *         equal to adjacent mines
 *          - reveal all adjacent tiles
 * @param {*} e Event argument
 */
function onMouseUp(e) {
    let tile = e.target;
    // Triggering only if pressed first
    if (tile.classList.contains('pressed')) {
        tile.classList = ['open'];
    }
};

/**
 * TODO: toggle tile flag
 * 
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
        } else {
            tile.classList = ['flagged'];
        }
    }
};

/**
 * 
 * @param {*} e Mouse Event argument
 */
function onMouseLeave(e) {
    // Resets tile if pressed
    let tile = e.target;
    if (tile.classList.contains('pressed')) {
        tile.classList = ['hidden'];
    }
};

// reveal tile

// get adjacent tiles

// reveal adjacent tiles

// flag adjacent tiles

// count flagged adjacent tiles

// get adjacent mine count