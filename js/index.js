function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 120);
  var last,
      deferTimer;
  return function () {
    var context = scope || this;

    var now = +new Date,
        args = arguments;
    if (last && now < last + threshhold) {

    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

colors = {
  2: "#BAA286",
  4: "#90ba86",
  8: "#08923f",
  16: "#1f7a7a",
  32: "#cc3333",
  64: "#ff1a00",
  128: "#ffb733",
  256: "#003699",
  512: "#000833 ",
  1024: "#290033",
  2048: "#7a0099"
}

const animationSpeed = 120;
const popupSpeed = 60;
const tileSize = $('.grid-cell').outerWidth(true);


let score = 0;


function updateScore(value) {
    let newScore = $(`<span class="points">+${value}</span>`);
    score += value;
    $('.score-table .score').html(score);
    newScore.appendTo('.score-table')
            .transition({ y: -100, x: 50}, 500, function() {
              $(this).remove();
            });


}

function moveTiles(direction) {
  let tiles = null,
      axis = null,
      value = null,
      tilesMoved = false,
      points = 0;

  if (direction == "up") {
    tiles = $('.grid-row:gt(0) .grid-cell .grid-tile');
    axis = "y";
    value = -tileSize;
  } else if (direction == "down") {
    tiles = $($('.grid-row:lt(3) .grid-cell .grid-tile').get().reverse());
    axis = "y";
    value = tileSize;
  } else if (direction == "left") {
    tiles = $('.grid-cell:not(:first-child) .grid-tile');
    axis = "x";
    value = -tileSize;
  } else if (direction == "right") {
    tiles = $($('.grid-cell:not(:last-child) .grid-tile').get().reverse());
    axis = "x";
    value = tileSize;
  }

  tiles.each( function() {
    let tile = $(this);
    let tileNumber = tile.text(),
        tileCell = tile.parent();
        index = tileCell.index('.grid-cell'),
        column = $(`.grid-cell:nth-child(4n+${ index % 4 +1})`),
        nextCells = null,
        nextTile = null,
        nextTileNumber = null,
        emptyCell = null,
        toEmpty = null,
        toNext = null,
        vector = {},
        animationTile = $(`<div class="animation-tile">${tileNumber}</div>`)
                          .css({'background-color': colors[tileNumber]});

    if (direction == "up") {
      nextCells = $($(`.grid-cell:lt(${ index }):nth-child(4n+${ index % 4 +1})`)
        .get().reverse()),
      nextTile = nextCells.find('.grid-tile').last().not(".used"),

      nextTileNumber = nextTile.text(),
      nextTileCell = nextTile.parent(),
      emptyCell = nextCells.not(nextCells.has('.grid-tile')).last(),
      toEmpty = column.index(tileCell) - column.index(emptyCell),
      toNext = column.index(tileCell) - column.index(nextTileCell);
    } else if (direction == "down") {
      nextCells = $(`.grid-cell:gt(${ index }):nth-child(4n+${ index % 4 +1})`),
      nextTile = nextCells.find('.grid-tile').first().not(".used"),
      nextTileNumber = nextTile.text(),
      nextTileCell = nextTile.parent(),
      emptyCell = nextCells.not(nextCells.has('.grid-tile')).last();
      toEmpty = column.index(emptyCell) - column.index(tileCell),
      toNext = column.index(nextTileCell) - column.index(tileCell);
    } else if (direction == "left") {
      nextCells = tileCell.prevAll(),
      nextTile = nextCells.find('.grid-tile').last().not(".used"),
      nextTileNumber = nextTile.text(),
      nextTileCell = nextTile.parent(),
      emptyCell = nextCells.not(nextCells.has('.grid-tile')).last(),
      toEmpty  = tileCell.index() - emptyCell.index(),
      toNext = tileCell.index() - nextTileCell.index();
    } else if (direction == "right") {
      nextCells = tileCell.nextAll(),
      nextTile = nextCells.find('.grid-tile').first().not(".used"),
      nextTileNumber = nextTile.text(),
      nextTileCell = nextTile.parent(),
      emptyCell = nextCells.not(nextCells.has('.grid-tile')).last(),
      toEmpty  = emptyCell.index() - tileCell.index(),
      toNext = nextTileCell.index() - tileCell.index();
    }

    if (nextTileNumber == tileNumber) {
      vector[axis] = value * toNext;
      tile.remove();
      animationTile.appendTo(tileCell);
      nextTile.addClass('used')
              .text(tileNumber * 2)
              .css({'background-color': colors[tileNumber * 2]})
              .transition({scale: 1.1}, popupSpeed)
              .transition({scale: 1.0}, popupSpeed);
      // nextTile.addClass('used')
      //         .text(tileNumber * 2)
      //         .transition(
      //           {
      //             scale: 1.1,
      //             "background-color": colors[tileNumber * 2]
      //           }, popupSpeed)
      //         .transition({scale: 1.0}, popupSpeed);
      animationTile.transition(vector, animationSpeed, function() {
        $(this).remove();
      });

      points += tileNumber * 2;
      tilesMoved = true;

    } else if (emptyCell.length > 0) {
      vector[axis] = value * toEmpty;
      tile.hide().appendTo(emptyCell).delay(animationSpeed).show(0);
      animationTile.appendTo(tileCell);
      animationTile.transition(vector, animationSpeed, function() {
        $(this).remove();
      });

      tilesMoved = true;
    }

  });
  if (tilesMoved) {
    addNewTile();
  }
  if (points) {
    updateScore(points);
  }

  $('.grid-tile').removeClass('used');

}

function addNewTile() {
  let emptyCell = returnEmptyCell();
  let number = (Math.random() > 0.3) ? 2 :4;
  let newTile = $(`<div class="grid-tile">${number}</div>`)
                .css({'background-color': colors[number]});
  if (emptyCell.length > 0) {
    $(newTile).transition({scale: 0}, 0)
              .appendTo(emptyCell)
              .delay(animationSpeed)
              .fadeIn(animationSpeed)
              .transition({scale: 1}, popupSpeed);
  }
}

function returnEmptyCell() {
  return $('.grid-cell:not(:has(".grid-tile"))').random();
}

function clearGrid() {
  $('.grid-tile').remove();
}

function newGame() {
  score = 0;
  $('.score-table .score').text(0);
  clearGrid();
  addNewTile();
  addNewTile();
}

$(document).ready( function() {
  newGame();

  $(window).keydown( throttle(function(e) {
    let direction = "";
    if ( e.keyCode == 38 ) {
      direction = "up";
    } else if ( e.keyCode == 40 ) {
      direction = "down";
    } else if ( e.keyCode == 39 ) {
      direction = "right";
    } else if ( e.keyCode == 37 ) {
      direction = "left";
    }
    if (direction) {
      moveTiles(direction);
    }
  }));

  $('.restart-button').click( function() {
    newGame();
  });


});
