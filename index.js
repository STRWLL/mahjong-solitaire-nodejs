import { DrawPile } from './pile.js';
import { Player } from './player.js';
import { Game } from './game.js'

const drawPile = new DrawPile();
const player = new Player(drawPile);
const game = new Game(player);
game.start();
