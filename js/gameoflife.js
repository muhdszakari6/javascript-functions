function seed(...arg) {
  return [...arg]
}

function same([x, y], [j, k]) {
  return x === j && y === k
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  let temp = this.filter(
    (item) => {
      return item[0] === cell[0] && item[1] === cell[1]
    }
  )
  return temp.length > 0

}

const printCell = (cell, state) => {
  // let temp = state.filter(
  //   (item)=>{
  //     return item[0] === cell[0] && item[1] === cell[1]
  //   }
  // )
  // return temp.length > 0 ? '\u25A3' : '\u25A2'
  let temp = this.contains.call(state, cell)
  return temp ? '\u25A3' : '\u25A2'

};

const corners = (state = []) => {
  if (state.length > 0) {
    let x_array = state.map((item) => {
      return item[0]
    })

    let y_array = state.map((item) => {
      return item[1]
    })

    let xmin = x_array.reduce(
      (prev, curr) => Math.min(curr, prev)
    )
    let xmax = x_array.reduce(
      (prev, curr) => Math.max(curr, prev)
    )


    let ymin = y_array.reduce(
      (prev, curr) => Math.min(curr, prev)
    )
    let ymax = y_array.reduce(
      (prev, curr) => Math.max(curr, prev)
    )
    return { topRight: [xmax, ymax], bottomLeft: [xmin, ymin] }
  } else {
    return { topRight: [0, 0], bottomLeft: [0, 0] }
  }

};

const printCells = (state) => {

  let {bottomLeft, topRight} = corners(state)
  let accumulator = ""
  for (let y = topRight[1]; y >= bottomLeft[1]; y--) {
    let row = [];
    for (let x = bottomLeft[0]; x <= topRight[0]; x++) {
      row.push(printCell([x,y],state))      
    }
    accumulator += row.join(" ") + "\n";
    
  }
  return accumulator;


};

const getNeighborsOf = ([x, y]) => { 
  return [
    [x-1,y+1], [x,y+1], [x+1,y+1],
    [x-1, y],         [x+1, y],
    [x-1,y-1], [x,y-1], [x+1,y-1],

  ] 
};

const getLivingNeighbors = (cell, state) => { 
  let neighbors = getNeighborsOf(cell)
  let living = neighbors.filter(
    (item) => {
      return this.contains.bind(state)(item)
    }
  )
  return living
};

const willBeAlive = (cell, state) => { 
  if((this.contains.bind(state)(cell) && getLivingNeighbors(cell,state).length == 2)){
    return true
  }
  else if( getLivingNeighbors(cell,state) .length == 3){
    return true
  }
  return false
};

const calculateNext = (state) => {
  let {bottomLeft, topRight} = corners(state)
  let result = [] 
  for(let y = topRight[1]+1 ; y>= bottomLeft[1]-1;y--){
    for (let x = bottomLeft[0]-1; x <= topRight[0] + 1; x++) {
      result = result.concat(willBeAlive([x,y], state)? [[x,y]]:[])      
    }
  }
  return result
 };

const iterate = (state, iterations) => {
  const states = [state]; 
  for (let i = 0; i < iterations; i++) {
    states.push(calculateNext(states[states.length -1]))
  }
  return states
 };

const main = (pattern, iterations) => { 
  const results = iterate(startPatterns[pattern], iterations)
  results.forEach(
    r=>console.log(printCells(r))
  )
};

const startPatterns = {
  rpentomino: [
    [3, 2],
    [2, 3],
    [3, 3],
    [3, 4],
    [4, 4]
  ],
  glider: [
    [-2, -2],
    [-1, -2],
    [-2, -1],
    [-1, -1],
    [1, 1],
    [2, 1],
    [3, 1],
    [3, 2],
    [2, 3]
  ],
  square: [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2]
  ]
};

const [pattern, iterations] = process.argv.slice(2);
const runAsScript = require.main === module;

if (runAsScript) {
  if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
    main(pattern, parseInt(iterations));
  } else {
    console.log("Usage: node js/gameoflife.js rpentomino 50");
  }
}

exports.seed = seed;
exports.same = same;
exports.contains = contains;
exports.getNeighborsOf = getNeighborsOf;
exports.getLivingNeighbors = getLivingNeighbors;
exports.willBeAlive = willBeAlive;
exports.corners = corners;
exports.calculateNext = calculateNext;
exports.printCell = printCell;
exports.printCells = printCells;
exports.startPatterns = startPatterns;
exports.iterate = iterate;
exports.main = main;