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
    }

    getRow() {
        return this.row;
    }

    getCol() {
        return this.col;
    }

    isMine() {
        return this.mine;
    }

}

let tiles = [];

// Populate tiles
const cells = document.getElementsByTagName('td');
for (const tile of cells) {
    const newTile = new Tile(tile.id[0], tile.id.substring(1));
    
    newTile.addEventListener('mousedown', onMouseDown);
    newTile.addEventListener('mouseup', onMouseUp);

    tiles.push(newTile);
    // TODO: add onClick/onContextMenu to tile
}

// Functions

/**
 * TODO: "press" tile (change look)
 * 
 * @param {*} e Event argument
 */
let onMouseDown = e => {

};

/**
 * TODO: reveal tile or appropriate action,
 *       on revealed tile w/ flagged adjacent tiles
 *         equal to adjacent mines
 *          - reveal all adjacent tiles
 * @param {*} e Event argument
 */
let onMouseUp = e => {

};

// reveal tile

// flag tile (onContextMenu)

// get adjacent tiles

// reveal adjacent tiles

// flag adjacent tiles

// count flagged adjacent tiles

// get adjacent mine count
