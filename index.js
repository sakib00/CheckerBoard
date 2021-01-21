let squares = document.getElementsByClassName("square");
let table = document.getElementById("table");
let checkers_white = document.getElementsByClassName("white");
let checkers_black = document.getElementsByClassName("black");
let turn;
let list_squares = [];
let list_white = [];
let list_black = [];
let current_poss_moves = [];
let current_poss_kills = [];
let current_checker;
let killed_checkers = [];

class square {
  constructor(id, row, col) {
    this.id = id;
    this.row = row;
    this.col = col;
    this.is_occupied = false;
    this.checker_color = null;
    this.checker_id = null;
  }
}

class white_checker {
  constructor(id, square_id) {
    this.id = id;
    this.square_id = square_id;
    this.is_alive = true;
    this.is_king = false;
  }
}

class black_checker {
  constructor(id, square_id) {
    this.id = id;
    this.square_id = square_id;
    this.is_alive = true;
    this.is_king = false;
  }
}

function add_squares() {
  let index = 0;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      squares[index].classList.add(index);
      list_squares.push(new square(index, row, col));
      index++;
    }
  }
}

function add_white() {
  for (let i = 0; i < 4; i++) {
    list_white.push(new white_checker(i, 2 * i + 1));
    list_squares[2 * i + 1].is_occupied = true;
    list_squares[2 * i + 1].checker_id = i;
    list_squares[2 * i + 1].checker_color = "white";
    squares[2 * i + 1].childNodes[0].classList.add("white");
    checkers_white[i].classList.add(i);
  }
  for (let i = 4; i < 8; i++) {
    list_white.push(new white_checker(i, 2 * i));
    list_squares[2 * i].is_occupied = true;
    list_squares[2 * i].checker_id = i;
    list_squares[2 * i].checker_color = "white";
    squares[2 * i].childNodes[0].classList.add("white");
    checkers_white[i].classList.add(i);
  }
  for (let i = 8; i < 12; i++) {
    list_white.push(new white_checker(i, 2 * i + 1));
    list_squares[2 * i + 1].is_occupied = true;
    list_squares[2 * i + 1].checker_id = i;
    list_squares[2 * i + 1].checker_color = "white";
    squares[2 * i + 1].childNodes[0].classList.add("white");
    checkers_white[i].classList.add(i);
  }
}

function add_black() {
  for (let i = 0; i < 4; i++) {
    list_black.push(new black_checker(i, 40 + 2 * i));
    list_squares[40 + 2 * i].is_occupied = true;
    list_squares[40 + 2 * i].checker_id = i;
    list_squares[40 + 2 * i].checker_color = "black";
    squares[40 + 2 * i].childNodes[0].classList.add("black");
    checkers_black[i].classList.add(i);
  }
  for (let i = 4; i < 8; i++) {
    list_black.push(new black_checker(i, 40 + 2 * i + 1));
    list_squares[40 + 2 * i + 1].is_occupied = true;
    list_squares[40 + 2 * i + 1].checker_id = i;
    list_squares[40 + 2 * i + 1].checker_color = "black";
    squares[40 + 2 * i + 1].childNodes[0].classList.add("black");
    checkers_black[i].classList.add(i);
  }
  for (let i = 8; i < 12; i++) {
    list_black.push(new black_checker(i, 40 + 2 * i));
    list_squares[40 + 2 * i].is_occupied = true;
    list_squares[40 + 2 * i].checker_id = i;
    list_squares[40 + 2 * i].checker_color = "black";
    squares[40 + 2 * i].childNodes[0].classList.add("black");
    checkers_black[i].classList.add(i);
  }
}
function add_white_listeners() {
  for (let index = 0; index < checkers_white.length; index++) {
    checkers_white[index].addEventListener("click", show_moves);
  }
}
function remove_white_listeners() {
  for (let index = 0; index < checkers_white.length; index++) {
    checkers_white[index].removeEventListener("click", show_moves);
  }
}
function add_black_listeners() {
  for (let index = 0; index < checkers_black.length; index++) {
    checkers_black[index].addEventListener("click", show_moves);
  }
}
function remove_black_listeners() {
  for (let index = 0; index < checkers_black.length; index++) {
    checkers_black[index].removeEventListener("click", show_moves);
  }
}
function reset_select() {
  remove_square_listeners();
  for (let index = 0; index < current_poss_moves.length; index++) {
    squares[current_poss_moves[index]].style.backgroundImage = "url('black.jpg')";
  }

  for (let index = 0; index < current_poss_kills.length; index++) {
    squares[current_poss_kills[index][1]].style.backgroundImage = "url('black.jpg')";
  }
}
function new_game() {
  add_squares();
  add_white();
  add_black();
  turn = 0;
  add_white_listeners();
}

function next_turn() {
  make_king();
  reset_select();
  if (turn == 0) {
    remove_white_listeners();
    add_black_listeners();
    turn = 1;
  } else {
    remove_black_listeners();
    add_white_listeners();
    turn = 0;
  }
}

function show_moves(event) {
  reset_select();
  id = event.target.classList[2];
  color = event.target.classList[1];
  current_checker = [id, color];
  let square_id;

  let is_king;
  if (color == "white") {
    square_id = list_white[id].square_id;
    is_king = list_white[id].is_king;
    current_poss_moves = possible_moves("white", id, is_king, square_id);
    current_poss_kills = possible_kills(is_king, square_id);
    add_square_listeners();
  }
  if (color == "black") {
    square_id = list_black[id].square_id;
    is_king = list_black[id].is_king;
    current_poss_moves = possible_moves("black", id, is_king, square_id);
    current_poss_kills = possible_kills(is_king, square_id);
    add_square_listeners();
  }

  for (let index = 0; index < current_poss_moves.length; index++) {
    squares[current_poss_moves[index]].style.background = "#3a86ff";
  }
  for (let index = 0; index < current_poss_kills.length; index++) {
    squares[current_poss_kills[index][1]].style.background = "#ef233c";
  }
}

function possible_moves(color, id, is_king, square_id) {
  let poss_moves = [];
  if (color == "white" && is_king == false) {
    let row = list_squares[square_id].row;
    let col = list_squares[square_id].col;
    let next_row = row + 1;
    let left_col = col - 1;
    let right_col = col + 1;
    if (left_col < 0 && right_col > 7) {
      poss_moves = null;
    } else if (left_col < 0) {
      poss_square = 8 * next_row + right_col;
      if (!check_occupied(poss_square)) {
        poss_moves.push(poss_square);
      }
    } else if (right_col > 7) {
      poss_square = 8 * next_row + left_col;
      if (!check_occupied(poss_square)) {
        poss_moves.push(poss_square);
      }
    } else {
      poss_square_1 = 8 * next_row + left_col;
      poss_square_2 = 8 * next_row + right_col;
      if (!check_occupied(poss_square_1)) {
        poss_moves.push(poss_square_1);
      }
      if (!check_occupied(poss_square_2)) {
        poss_moves.push(poss_square_2);
      }
    }
  } else if (color == "black" && is_king == false) {
    let row = list_squares[square_id].row;
    let col = list_squares[square_id].col;
    let next_row = row - 1;
    let left_col = col - 1;
    let right_col = col + 1;
    if (left_col < 0 && right_col > 7) {
      poss_moves = null;
    } else if (left_col < 0) {
      poss_square = 8 * next_row + right_col;
      if (!check_occupied(poss_square)) {
        poss_moves.push(poss_square);
      }
    } else if (right_col > 7) {
      poss_square = 8 * next_row + left_col;
      if (!check_occupied(poss_square)) {
        poss_moves.push(poss_square);
      }
    } else {
      poss_square_1 = 8 * next_row + left_col;
      poss_square_2 = 8 * next_row + right_col;
      if (!check_occupied(poss_square_1)) {
        poss_moves.push(poss_square_1);
      }
      if (!check_occupied(poss_square_2)) {
        poss_moves.push(poss_square_2);
      }
    }
  } else if (color == "white" && is_king == true) {
    let row = list_squares[square_id].row;
    let col = list_squares[square_id].col;
    let prev_row = row - 1;
    let next_row = row + 1;
    let left_col = col - 1;
    let right_col = col + 1;
    console.log(row, col, prev_row, next_row, left_col, right_col);
    if (next_row > 7) {
      if (left_col < 0 && right_col > 7) {
      } else if (left_col < 0 && right_col < 8) {
        console.log(poss_square);
        poss_square = 8 * prev_row + right_col;
        if (!check_occupied(poss_square)) {
          console.log(poss_square);
          poss_moves.push(poss_square);
        }
      } else if (right_col > 7 && left_col > 0) {
        poss_square = 8 * prev_row + left_col;
        console.log(poss_square);
        if (!check_occupied(poss_square)) {
          console.log(poss_square);
          poss_moves.push(poss_square);
        }
      } else {
        poss_square_1 = 8 * prev_row + left_col;
        poss_square_2 = 8 * prev_row + right_col;
        console.log(poss_square_1);
        console.log(poss_square_2);
        if (!check_occupied(poss_square_1)) {
          console.log(poss_square_1);
          poss_moves.push(poss_square_1);
        }
        if (!check_occupied(poss_square_2)) {
          console.log(poss_square_2);
          poss_moves.push(poss_square_2);
        }
      }
    } else if (prev_row < 0) {
      if (left_col < 0 && right_col > 7) {
      } else if (left_col < 0 && right_col < 8) {
        poss_square = 8 * next_row + right_col;
        if (!check_occupied(poss_square)) {
          poss_moves.push(poss_square);
        }
      } else if (right_col > 7 && left_col > 0) {
        poss_square = 8 * next_row + left_col;
        if (!check_occupied(poss_square)) {
          poss_moves.push(poss_square);
        } else {
          poss_square_1 = 8 * next_row + left_col;
          poss_square_2 = 8 * next_row + right_col;
          if (!check_occupied(poss_square_1)) {
            poss_moves.push(poss_square_1);
          }
          if (!check_occupied(poss_square_2)) {
            poss_moves.push(poss_square_2);
          }
        }
      }
    } else if (prev_row > -1 && next_row < 8) {
      if (left_col < 0 && right_col < 8) {
        poss_square_1 = 8 * next_row + right_col;
        poss_square_2 = 8 * prev_row + right_col;
        if (!check_occupied(poss_square_1)) {
          poss_moves.push(poss_square_1);
        }
        if (!check_occupied(poss_square_2)) {
          poss_moves.push(poss_square_2);
        }
      } else if (right_col > 7 && left_col > 0) {
        poss_square_1 = 8 * next_row + left_col;
        poss_square_2 = 8 * prev_row + left_col;
        if (!check_occupied(poss_square_1)) {
          poss_moves.push(poss_square_1);
        }
        if (!check_occupied(poss_square_2)) {
          poss_moves.push(poss_square_2);
        }
      } else {
        poss_square_1 = 8 * next_row + right_col;
        poss_square_2 = 8 * prev_row + right_col;
        poss_square_3 = 8 * next_row + left_col;
        poss_square_4 = 8 * prev_row + left_col;
        if (!check_occupied(poss_square_1)) {
          poss_moves.push(poss_square_1);
        }
        if (!check_occupied(poss_square_2)) {
          poss_moves.push(poss_square_2);
        }
        if (!check_occupied(poss_square_3)) {
          poss_moves.push(poss_square_3);
        }
        if (!check_occupied(poss_square_4)) {
          poss_moves.push(poss_square_4);
        }
      }
    }
  } else if (color == "black" && is_king == true) {
    let row = list_squares[square_id].row;
    let col = list_squares[square_id].col;
    let prev_row = row + 1;
    let next_row = row - 1;
    let left_col = col - 1;
    let right_col = col + 1;
    console.log(row, col, prev_row, next_row, left_col, right_col);
    if (next_row < 0) {
      if (left_col < 0 && right_col > 7) {
      } else if (left_col < 0 && right_col < 8) {
        console.log(poss_square);
        poss_square = 8 * prev_row + right_col;
        if (!check_occupied(poss_square)) {
          console.log(poss_square);
          poss_moves.push(poss_square);
        }
      } else if (right_col > 7 && left_col > 0) {
        poss_square = 8 * prev_row + left_col;
        console.log(poss_square);
        if (!check_occupied(poss_square)) {
          console.log(poss_square);
          poss_moves.push(poss_square);
        }
      } else {
        poss_square_1 = 8 * prev_row + left_col;
        poss_square_2 = 8 * prev_row + right_col;
        console.log(poss_square_1);
        console.log(poss_square_2);
        if (!check_occupied(poss_square_1)) {
          console.log(poss_square_1);
          poss_moves.push(poss_square_1);
        }
        if (!check_occupied(poss_square_2)) {
          console.log(poss_square_2);
          poss_moves.push(poss_square_2);
        }
      }
    } else if (prev_row > 7) {
      if (left_col < 0 && right_col > 7) {
      } else if (left_col < 0 && right_col < 8) {
        poss_square = 8 * next_row + right_col;
        if (!check_occupied(poss_square)) {
          poss_moves.push(poss_square);
        }
      } else if (right_col > 7 && left_col > 0) {
        poss_square = 8 * next_row + left_col;
        if (!check_occupied(poss_square)) {
          poss_moves.push(poss_square);
        } else {
          poss_square_1 = 8 * next_row + left_col;
          poss_square_2 = 8 * next_row + right_col;
          if (!check_occupied(poss_square_1)) {
            poss_moves.push(poss_square_1);
          }
          if (!check_occupied(poss_square_2)) {
            poss_moves.push(poss_square_2);
          }
        }
      }
    } else if (prev_row > -1 && next_row < 8) {
      if (left_col < 0 && right_col < 8) {
        poss_square_1 = 8 * next_row + right_col;
        poss_square_2 = 8 * prev_row + right_col;
        if (!check_occupied(poss_square_1)) {
          poss_moves.push(poss_square_1);
        }
        if (!check_occupied(poss_square_2)) {
          poss_moves.push(poss_square_2);
        }
      } else if (right_col > 7 && left_col > 0) {
        poss_square_1 = 8 * next_row + left_col;
        poss_square_2 = 8 * prev_row + left_col;
        if (!check_occupied(poss_square_1)) {
          poss_moves.push(poss_square_1);
        }
        if (!check_occupied(poss_square_2)) {
          poss_moves.push(poss_square_2);
        }
      } else {
        poss_square_1 = 8 * next_row + right_col;
        poss_square_2 = 8 * prev_row + right_col;
        poss_square_3 = 8 * next_row + left_col;
        poss_square_4 = 8 * prev_row + left_col;
        if (!check_occupied(poss_square_1)) {
          poss_moves.push(poss_square_1);
        }
        if (!check_occupied(poss_square_2)) {
          poss_moves.push(poss_square_2);
        }
        if (!check_occupied(poss_square_3)) {
          poss_moves.push(poss_square_3);
        }
        if (!check_occupied(poss_square_4)) {
          poss_moves.push(poss_square_4);
        }
      }
    }
  }
  return poss_moves;
}

function possible_kills(is_king, square_id) {
  poss_kills = [];
  let id = current_checker[0];
  let color = current_checker[1];
  if (color == "white" && is_king == false) {
    row = list_squares[square_id].row;
    col = list_squares[square_id].col;
    next_row = row + 1;
    next_next_row = row + 2;
    left_col = col - 1;
    left_left_col = col - 2;
    right_col = col + 1;
    right_right_col = col + 2;
    right_diagonal = 8 * next_row + right_col;
    left_diagonal = 8 * next_row + left_col;
    next_right_diagonal = 8 * next_next_row + right_right_col;
    next_left_diagonal = 8 * next_next_row + left_left_col;
    if (next_next_row < 8) {
      if (left_col < 0 && right_col > 7) {
        poss_kills = null;
      }
      if (right_right_col < 8) {
        if (
          list_squares[right_diagonal].is_occupied == true &&
          list_squares[right_diagonal].checker_color == "black"
        ) {
          if (list_squares[next_right_diagonal].is_occupied == false) {
            poss_kills.push([right_diagonal, next_right_diagonal]);
          }
        }
      }
      if (left_left_col > -1) {
        if (
          list_squares[left_diagonal].is_occupied == true &&
          list_squares[left_diagonal].checker_color == "black"
        ) {
          if (list_squares[next_left_diagonal].is_occupied == false) {
            poss_kills.push([left_diagonal, next_left_diagonal]);
          }
        }
      }
    }
  } else if (color == "black" && is_king == false) {
    row = list_squares[square_id].row;
    col = list_squares[square_id].col;
    next_row = row - 1;
    next_next_row = row - 2;
    left_col = col - 1;
    left_left_col = col - 2;
    right_col = col + 1;
    right_right_col = col + 2;
    right_diagonal = 8 * next_row + right_col;
    left_diagonal = 8 * next_row + left_col;
    next_right_diagonal = 8 * next_next_row + right_right_col;
    next_left_diagonal = 8 * next_next_row + left_left_col;
    if (next_next_row > -1) {
      if (left_col < 0 && right_col > 7) {
        poss_kills = null;
      }
      if (right_right_col < 8) {
        if (
          list_squares[right_diagonal].is_occupied == true &&
          list_squares[right_diagonal].checker_color == "white"
        ) {
          if (list_squares[next_right_diagonal].is_occupied == false) {
            poss_kills.push([right_diagonal, next_right_diagonal]);
          }
        }
      }
      if (left_left_col > -1) {
        if (
          list_squares[left_diagonal].is_occupied == true &&
          list_squares[left_diagonal].checker_color == "white"
        ) {
          if (list_squares[next_left_diagonal].is_occupied == false) {
            poss_kills.push([left_diagonal, next_left_diagonal]);
          }
        }
      }
    }
  } else if (color == "white" && is_king == true) {
    row = list_squares[square_id].row;
    col = list_squares[square_id].col;
    next_row = row + 1;
    next_next_row = row + 2;
    prev_row = row - 1;
    prev_prev_row = row - 2;
    left_col = col - 1;
    left_left_col = col - 2;
    right_col = col + 1;
    right_right_col = col + 2;
    next_right_diagonal = 8 * next_row + right_col;
    next_left_diagonal = 8 * next_row + left_col;
    prev_right_diagonal = 8 * prev_row + right_col;
    prev_left_diagonal = 8 * prev_row + left_col;
    next_next_right_diagonal = 8 * next_next_row + right_right_col;
    next_next_left_diagonal = 8 * next_next_row + left_left_col;
    prev_prev_right_diagonal = 8 * prev_prev_row + right_right_col;
    prev_prev_left_diagonal = 8 * prev_prev_row + left_left_col;
    if (next_next_row < 8) {
      if (left_col < 0 && right_col > 7) {
        poss_kills = null;
      }
      if (right_right_col < 8) {
        if (
          list_squares[next_right_diagonal].is_occupied == true &&
          list_squares[next_right_diagonal].checker_color == "black"
        ) {
          if (list_squares[next_next_right_diagonal].is_occupied == false) {
            poss_kills.push([next_right_diagonal, next_next_right_diagonal]);
          }
        }
      }
      if (left_left_col > -1) {
        if (
          list_squares[next_left_diagonal].is_occupied == true &&
          list_squares[next_left_diagonal].checker_color == "black"
        ) {
          if (list_squares[next_next_left_diagonal].is_occupied == false) {
            poss_kills.push([next_left_diagonal, next_next_left_diagonal]);
          }
        }
      }
    }
    if (prev_prev_row > -1) {
      if (left_col < 0 && right_col > 7) {
        poss_kills = null;
      }
      if (right_right_col < 8) {
        if (
          list_squares[prev_right_diagonal].is_occupied == true &&
          list_squares[prev_right_diagonal].checker_color == "black"
        ) {
          if (list_squares[prev_prev_right_diagonal].is_occupied == false) {
            poss_kills.push([prev_right_diagonal, prev_prev_right_diagonal]);
          }
        }
      }
      if (left_left_col > -1) {
        if (
          list_squares[prev_left_diagonal].is_occupied == true &&
          list_squares[prev_left_diagonal].checker_color == "black"
        ) {
          if (list_squares[prev_prev_left_diagonal].is_occupied == false) {
            poss_kills.push([prev_left_diagonal, prev_prev_left_diagonal]);
          }
        }
      }
    }
  } else if (color == "black" && is_king == true) {
    row = list_squares[square_id].row;
    col = list_squares[square_id].col;
    next_row = row - 1;
    next_next_row = row - 2;
    prev_row = row + 1;
    prev_prev_row = row + 2;
    left_col = col - 1;
    left_left_col = col - 2;
    right_col = col + 1;
    right_right_col = col + 2;
    next_right_diagonal = 8 * next_row + right_col;
    next_left_diagonal = 8 * next_row + left_col;
    prev_right_diagonal = 8 * prev_row + right_col;
    prev_left_diagonal = 8 * prev_row + left_col;
    next_next_right_diagonal = 8 * next_next_row + right_right_col;
    next_next_left_diagonal = 8 * next_next_row + left_left_col;
    prev_prev_right_diagonal = 8 * prev_prev_row + right_right_col;
    prev_prev_left_diagonal = 8 * prev_prev_row + left_left_col;
    if (next_next_row > -1) {
      if (left_col < 0 && right_col > 7) {
        poss_kills = null;
      }
      if (right_right_col < 8) {
        if (
          list_squares[next_right_diagonal].is_occupied == true &&
          list_squares[next_right_diagonal].checker_color == "white"
        ) {
          if (list_squares[next_next_right_diagonal].is_occupied == false) {
            poss_kills.push([next_right_diagonal, next_next_right_diagonal]);
          }
        }
      }
      if (left_left_col > -1) {
        if (
          list_squares[next_left_diagonal].is_occupied == true &&
          list_squares[next_left_diagonal].checker_color == "white"
        ) {
          if (list_squares[next_next_left_diagonal].is_occupied == false) {
            poss_kills.push([next_left_diagonal, next_next_left_diagonal]);
          }
        }
      }
    }
    if (prev_prev_row < 8) {
      if (left_col < 0 && right_col > 7) {
        poss_kills = null;
      }
      if (right_right_col < 8) {
        if (
          list_squares[prev_right_diagonal].is_occupied == true &&
          list_squares[prev_right_diagonal].checker_color == "white"
        ) {
          if (list_squares[prev_prev_right_diagonal].is_occupied == false) {
            poss_kills.push([prev_right_diagonal, prev_prev_right_diagonal]);
          }
        }
      }
      if (left_left_col > -1) {
        if (
          list_squares[prev_left_diagonal].is_occupied == true &&
          list_squares[prev_left_diagonal].checker_color == "white"
        ) {
          if (list_squares[prev_prev_left_diagonal].is_occupied == false) {
            poss_kills.push([prev_left_diagonal, prev_prev_left_diagonal]);
          }
        }
      }
    }
  }
  return poss_kills;
}

function add_square_listeners() {
  if (current_poss_moves.length != 0) {
    for (let index = 0; index < current_poss_moves.length; index++) {
      squares[current_poss_moves[index]].addEventListener("click", make_move);
    }
  }
  if (current_poss_kills.length != 0) {
    for (let index = 0; index < current_poss_kills.length; index++) {
      squares[current_poss_kills[index][1]].addEventListener(
        "click",
        make_kill
      );
    }
  }
}

function remove_square_listeners() {
  if (current_poss_moves.length != 0) {
    for (let index = 0; index < current_poss_moves.length; index++) {
      squares[current_poss_moves[index]].removeEventListener(
        "click",
        make_move
      );
    }
  }
  if (current_poss_kills.length != 0) {
    for (let index = 0; index < current_poss_kills.length; index++) {
      squares[current_poss_kills[index][1]].removeEventListener(
        "click",
        make_kill
      );
    }
  }
}

function check_occupied(square_id) {
  if (list_squares[square_id].is_occupied == true) return true;
  else return false;
}

function make_move(event) {
  new_square_id = event.target.classList[1];
  id = current_checker[0];
  color = current_checker[1];
  if (color == "white") {
    old_square_id = list_white[id].square_id;
    list_white[id].square_id = new_square_id;
    list_squares[new_square_id].is_occupied = true;
    list_squares[new_square_id].checker_color = color;
    list_squares[new_square_id].checker_id = id;
    list_squares[old_square_id].is_occupied = false;
    list_squares[old_square_id].checker_color = null;
    list_squares[old_square_id].checker_id = null;
    let class_old = "square " + old_square_id;
    let class_new = "square " + new_square_id;
    checker_element = document.getElementsByClassName(class_old)[0].innerHTML;
    document.getElementsByClassName(class_old)[0].innerHTML = "";
    document.getElementsByClassName(class_new)[0].innerHTML = checker_element;
    next_turn();
  }
  if (color == "black") {
    old_square_id = list_black[id].square_id;
    list_black[id].square_id = new_square_id;
    list_squares[new_square_id].is_occupied = true;
    list_squares[new_square_id].checker_color = color;
    list_squares[new_square_id].checker_id = id;
    list_squares[old_square_id].is_occupied = false;
    list_squares[old_square_id].checker_color = null;
    list_squares[old_square_id].checker_id = null;
    let class_old = "square " + old_square_id;
    let class_new = "square " + new_square_id;
    checker_element = document.getElementsByClassName(class_old)[0].innerHTML;
    document.getElementsByClassName(class_old)[0].innerHTML = "";
    document.getElementsByClassName(class_new)[0].innerHTML = checker_element;
    next_turn();
  }
}
function make_kill(event) {
  let new_square_id = event.target.classList[1];
  let id = current_checker[0];
  let color = current_checker[1];
  let killed_square_id = get_kill(new_square_id);

  if (color == "white") {
    old_square_id = list_white[id].square_id;
    list_white[id].square_id = new_square_id;
    killed_checker_id = list_squares[killed_square_id].checker_id;
    console.log(killed_checker_id);
    list_black[killed_checker_id].is_alive = false;
    list_squares[new_square_id].is_occupied = true;
    list_squares[new_square_id].checker_color = color;
    list_squares[new_square_id].checker_id = id;
    list_squares[old_square_id].is_occupied = false;
    list_squares[old_square_id].checker_color = null;
    list_squares[old_square_id].checker_id = null;
    list_squares[killed_square_id].is_occupied = false;
    list_squares[killed_square_id].checker_color = null;
    list_squares[killed_square_id].checker_id = null;
    let class_old = "square " + old_square_id;
    let class_new = "square " + new_square_id;
    let class_killed = "square " + killed_square_id;
    checker_element = document.getElementsByClassName(class_old)[0].innerHTML;
    document.getElementsByClassName(class_old)[0].innerHTML = "";
    document.getElementsByClassName(class_new)[0].innerHTML = checker_element;
    checker_element = document.getElementsByClassName(class_old)[0].innerHTML;
    document.getElementsByClassName(class_killed)[0].innerHTML = "";
    killed_checkers.push([killed_checker_id, "black"]);

    next_turn();
  }
  if (color == "black") {
    old_square_id = list_black[id].square_id;
    list_black[id].square_id = new_square_id;
    killed_checker_id = list_squares[killed_square_id].checker_id;
    console.log(killed_checker_id);
    list_white[killed_checker_id].is_alive = false;
    list_squares[new_square_id].is_occupied = true;
    list_squares[new_square_id].checker_color = color;
    list_squares[new_square_id].checker_id = id;
    list_squares[old_square_id].is_occupied = false;
    list_squares[old_square_id].checker_color = null;
    list_squares[old_square_id].checker_id = null;
    list_squares[killed_square_id].is_occupied = false;
    list_squares[killed_square_id].checker_color = null;
    list_squares[killed_square_id].checker_id = null;
    let class_old = "square " + old_square_id;
    let class_new = "square " + new_square_id;
    let class_killed = "square " + killed_square_id;
    checker_element = document.getElementsByClassName(class_old)[0].innerHTML;
    document.getElementsByClassName(class_old)[0].innerHTML = "";
    document.getElementsByClassName(class_new)[0].innerHTML = checker_element;
    checker_element = document.getElementsByClassName(class_old)[0].innerHTML;
    document.getElementsByClassName(class_killed)[0].innerHTML = "";
    killed_checkers.push([killed_checker_id, "white"]);

    next_turn();
  }
}
function get_kill(square_id) {
  if (current_poss_kills.length != 0) {
    for (let index = 0; index < current_poss_kills.length; index++) {
      if (current_poss_kills[index][1] == square_id) {
        return current_poss_kills[index][0];
      }
    }
  }
}

function make_king() {
  id = current_checker[0];
  color = current_checker[1];
  if (color == "white") {
    square_id = list_white[id].square_id;
    if (list_squares[square_id].row == 7) {
      list_white[id].is_king = true;
      let checker_class = "checker white " + id;
      document.getElementsByClassName(checker_class)[0].style.backgroundImage = "url('white_cro.png')";
      "blue";
    }
  } else if (color == "black") {
    square_id = list_black[id].square_id;
    if (list_squares[square_id].row == 0) {
      list_black[id].is_king = true;
      let checker_class = "checker black " + id;
      document.getElementsByClassName(checker_class)[0].style.backgroundImage = "url('black_cro.png')";
      "blue";
    }
  }
}

function game_over() {
  // check if there are no black or white checkers left

  let white_count = 0;
  let black_count = 0;

  for (let index = 0; index < list_white.length; index++) {
    if (list_white[index].is_alive == false) {
      white_count++;
    }
  }
  for (let index = 0; index < list_black.length; index++) {
    if (list_black[index].is_alive == false) {
      black_count++;
    }
  }
  if (white_count == 12) {
    document.getElementById("game-over").style.display = "block";
    document.getElementById("game-over").innerHTML =
      "<h2>Player " + color + " wins!!</h2>";
  } else if (black_count == 12) {
    document.getElementById("game-over").style.display = "block";
    document.getElementById("game-over").innerHTML =
      "<h2>Player " + color + " wins!!</h2>";
  }
}
new_game();

