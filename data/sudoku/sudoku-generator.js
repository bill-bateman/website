(function () {
	'use strict';

	var GIVENS = { easy: 42, medium: 34, hard: 28 };

	function canPlace(grid, idx, val) {
		// checks if the given value is allowed at the given index

		var r = Math.floor(idx / 9), c = idx % 9, k;
		for (k = 0; k < 9; k++) {
			// check row
			if (grid[r * 9 + k] === val) return false;
			// check column
			if (grid[k * 9 + c] === val) return false;
		}
		// check box
		var br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3, i, j;
		for (i = 0; i < 3; i++) {
			for (j = 0; j < 3; j++) {
				if (grid[(br + i) * 9 + (bc + j)] === val) return false;
			}
		}

		// if still here, no conflict, so we can place
		return true;
	}

	function firstEmpty(grid) {
		for (var i = 0; i < 81; i++) {
			if (grid[i] === 0) return i;
		}
		return -1;
	}

	function shuffle(a) {
		// in-place Fisher-Yates
		for (var i = a.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));

			// swap
			var t = a[i];
			a[i] = a[j];
			a[j] = t;
		}
		return a;
	}

	function fillGrid(grid) {
		// fill an empty grid with a random complete solution
		var idx = firstEmpty(grid);
		if (idx === -1) return true;
		var vals = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
		for (var i = 0; i < 9; i++) {
			if (canPlace(grid, idx, vals[i])) {
				grid[idx] = vals[i];
				if (fillGrid(grid)) return true;
				grid[idx] = 0;
			}
		}
		return false;
	}

	function hasUniqueSolution(grid) {
		// true if the grid has exactly one completion; bails as soon as a second is found
		var count = 0;
		(function search(g) {
			var idx = firstEmpty(g);
			if (idx === -1) { count++; return; }
			for (var v = 1; v <= 9 && count < 2; v++) {
				if (canPlace(g, idx, v)) {
					g[idx] = v;
					search(g);
					g[idx] = 0;
				}
			}
		})(grid);
		return count === 1;
	}

	function generate(difficulty) {
		var full = [];
		for (var i = 0; i < 81; i++) full.push(0);
		fillGrid(full);

		var puz = full.slice();
		var order = shuffle(full.map(function (_, i) { return i; }));
		var toRemove = 81 - (GIVENS[difficulty] || GIVENS.medium);
		var removed = 0;

		for (var k = 0; k < order.length && removed < toRemove; k++) {
			var p = order[k];
			var backup = puz[p];
			if (backup === 0) continue;
			puz[p] = 0;
			if (hasUniqueSolution(puz.slice())) {
				removed++;
			} else {
				puz[p] = backup; // removing this clue would make the puzzle ambiguous
			}
		}
		return { puzzle: puz, solution: full };
	}

	window.SudokuGenerator = {
		canPlace: canPlace,
		generate: generate
	};
})();
