(function () {
	'use strict';

	// Shared sudoku-rules helpers, safe to load on the main thread or in a worker.

	// Difficulty names, shared so the UI, generator, grader and worker agree on
	// spelling. The values are the literal strings so they stay compatible with the
	// DOM `data-diff` attributes and saved-game JSON. RANK orders them for the
	// places that need "how far apart are two difficulties".
	var DIFFICULTY = { EASY: 'easy', MEDIUM: 'medium', HARD: 'hard' };
	var RANK = { easy: 1, medium: 2, hard: 3 };

	function canPlace(grid, idx, val) {
		// true if `val` breaks no row / column / box constraint at cell `idx`
		var r = Math.floor(idx / 9), c = idx % 9, k;
		for (k = 0; k < 9; k++) {
			if (grid[r * 9 + k] === val) return false; // row
			if (grid[k * 9 + c] === val) return false; // column
		}
		var br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3, i, j;
		for (i = 0; i < 3; i++) {
			for (j = 0; j < 3; j++) {
				if (grid[(br + i) * 9 + (bc + j)] === val) return false; // box
			}
		}
		return true;
	}

	self.SudokuUtils = { canPlace: canPlace, DIFFICULTY: DIFFICULTY, RANK: RANK };
})();
