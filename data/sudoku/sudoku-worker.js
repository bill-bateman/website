// Runs puzzle generation off the main thread so grading a hard puzzle doesn't
// freeze the UI. Driven by SudokuSource.requestPuzzle; echoes back the request id
// it was given.
importScripts('sudoku-utils.js', 'sudoku-grader.js', 'sudoku-generator.js');

self.onmessage = function (e) {
	var g = self.SudokuGenerator.generate(e.data.difficulty);
	self.postMessage({ id: e.data.id, puzzle: g.puzzle, solution: g.solution });
};
