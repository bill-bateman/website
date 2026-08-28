(function () {
	'use strict';

	// Produces a graded puzzle for a difficulty. `generate(difficulty)` is the
	// synchronous core - the game reaches it through SudokuSource (worker or inline),
	// and the worker in sudoku-worker.js calls it directly.

	var EASY = self.SudokuUtils.DIFFICULTY.EASY;
	var MEDIUM = self.SudokuUtils.DIFFICULTY.MEDIUM;
	var HARD = self.SudokuUtils.DIFFICULTY.HARD;
	var RANK = self.SudokuUtils.RANK;
	var canPlace = self.SudokuUtils.canPlace;

	var TUNING = {};
	TUNING[EASY]   = { maxGivens: 42, attempts: 300 };
	TUNING[MEDIUM] = { maxGivens: 34, attempts: 400 };
	TUNING[HARD]   = { maxGivens: 28, attempts: 180 };

	var MIN_STEPS = 2; // a puzzle must need at least this many deductions at its own difficulty

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
		// true if the grid has exactly one completion; bails as soon as a second is
		// found. Branches on the empty cell with the fewest candidates (MRV), which
		// keeps this fast enough to call thousands of times during generation.
		var g = grid.slice();
		var count = 0;
		(function search() {
			if (count >= 2) return;
			var bestIdx = -1, bestCands = null, bestLen = 10;
			for (var i = 0; i < 81; i++) {
				if (g[i] !== 0) continue;
				var cs = [];
				for (var v = 1; v <= 9; v++) if (canPlace(g, i, v)) cs.push(v);
				if (cs.length < bestLen) {
					bestLen = cs.length; bestIdx = i; bestCands = cs;
					if (bestLen <= 1) break;
				}
			}
			if (bestIdx === -1) { count++; return; } // no empty cell: a full solution
			if (bestLen === 0) return;               // dead end
			for (var k = 0; k < bestCands.length; k++) {
				g[bestIdx] = bestCands[k];
				search();
				g[bestIdx] = 0;
				if (count >= 2) return;
			}
		})();
		return count === 1;
	}

	function makeFull() {
		var full = [];
		for (var i = 0; i < 81; i++) full.push(0);
		fillGrid(full);
		return full;
	}

	function digToTarget(full, target) {
		// remove cells in random order, keeping each removal only while the puzzle
		// still has a unique solution; stop once `target` cells are gone
		var puz = full.slice();
		var order = shuffle(full.map(function (_, i) { return i; }));
		var removed = 0;
		for (var k = 0; k < order.length && removed < target; k++) {
			var p = order[k];
			var backup = puz[p];
			if (backup === 0) continue;
			puz[p] = 0;
			if (hasUniqueSolution(puz.slice())) removed++;
			else puz[p] = backup; // removing this clue would make the puzzle ambiguous
		}
		return { grid: puz, removed: removed };
	}

	function digUntilBand(state, grade, difficulty) {
		// dig out as many clues as possible while the puzzle stays unique, solvable
		// by our solver, and no harder than `difficulty` - undoing any removal that
		// breaks one of those and moving on to the next cell. Returns the grade of
		// the deepest in-band puzzle reached; generate() checks it hit MIN_STEPS.
		var puz = state.grid, spots = [];
		for (var i = 0; i < 81; i++) if (puz[i] !== 0) spots.push(i);
		shuffle(spots);
		var g = grade(puz);
		if (!g.solvable || RANK[g.hardestDifficulty] > RANK[difficulty]) return g;
		for (var k = 0; k < spots.length; k++) {
			var p = spots[k], backup = puz[p];
			puz[p] = 0;
			if (!hasUniqueSolution(puz.slice())) { puz[p] = backup; continue; } // ambiguous
			var ng = grade(puz);
			if (!ng.solvable || RANK[ng.hardestDifficulty] > RANK[difficulty]) { puz[p] = backup; continue; } // out of band
			state.removed++; 
			g = ng;
		}
		return g;
	}

	function bandOk(difficulty, g) {
		return g.solvable
			&& g.hardestDifficulty === difficulty
			&& g.steps[difficulty] >= MIN_STEPS;
	}

	function bandScore(difficulty, g) {
		// rank the least-bad puzzle to fall back on if no attempt hits the band
		var want = RANK[difficulty];
		var got = g.solvable ? RANK[g.hardestDifficulty] : 0;
		var score = -Math.abs(want - got) * 10;
		if (g.solvable) score += 1 + Math.min(g.steps[difficulty], MIN_STEPS) * 3;
		return score;
	}

	function generate(difficulty) {
		var grade = self.SudokuGrader.grade;
		var cfg = TUNING[difficulty];
		var target = 81 - cfg.maxGivens;
		var maxAttempts = cfg.attempts;
		var best = null, bestScore = -Infinity;

		for (var attempt = 0; attempt < maxAttempts; attempt++) {
			var full = makeFull();
			var st = digToTarget(full, target);
			if (st.removed < target) continue; // couldn't even reach the floor

			var g = difficulty === EASY
				? grade(st.grid)
				: digUntilBand(st, grade, difficulty);
			if (bandOk(difficulty, g)) return { puzzle: st.grid, solution: full };

			var sc = bandScore(difficulty, g);
			if (sc > bestScore) {
				bestScore = sc;
				best = { puzzle: st.grid.slice(), solution: full.slice() };
			}
		}

		// no attempt landed in the band; return the closest one we saw
		if (best) return best;
		var fb = makeFull();
		return { puzzle: digToTarget(fb, target).grid, solution: fb };
	}

	self.SudokuGenerator = { generate: generate };
})();
