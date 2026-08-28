(function () {
	'use strict';

	// Grades a puzzle by solving it the way a person would - always reaching for the
	// easiest available technique - and reporting which techniques the path needed.
	//
	//   grade(puzzle) -> {
	//     solvable:           true if solved with logic alone (no guessing)
	//     hardestDifficulty:  'easy' | 'medium' | 'hard' - the hardest technique the path needed
	//     steps:              { easy, medium, hard } - deductions of each difficulty on the path
	//     counts:             { techniqueName: timesUsed, ... }
	//   }

	var FULL = 0x1FF; // candidate bitmask for digits 1..9
	var DIFFICULTY = self.SudokuUtils.DIFFICULTY;
	var RANK = self.SudokuUtils.RANK;

	// ---- unit / peer tables, built once ----

	var UNITS = [];    // 27 units (9 rows, 9 cols, 9 boxes), each an array of 9 cell indices
	var UNITS_OF = []; // per cell: [rowUnit, colUnit, boxUnit]
	var PEERS = [];    // per cell: array of its 20 peer cell indices

	(function buildTables() {
		var i;
		for (i = 0; i < 27; i++) UNITS.push([]);
		for (i = 0; i < 81; i++) { UNITS_OF.push(null); PEERS.push([]); }
		for (var r = 0; r < 9; r++) {
			for (var c = 0; c < 9; c++) {
				i = r * 9 + c;
				var b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
				UNITS[r].push(i);        // rows   0..8
				UNITS[9 + c].push(i);    // cols   9..17
				UNITS[18 + b].push(i);   // boxes 18..26
				UNITS_OF[i] = [r, 9 + c, 18 + b];
			}
		}
		for (i = 0; i < 81; i++) {
			var seen = {};
			UNITS_OF[i].forEach(function (u) {
				UNITS[u].forEach(function (j) { if (j !== i) seen[j] = true; });
			});
			PEERS[i] = Object.keys(seen).map(Number);
		}
	})();

	// Lookup tables over every 9-bit candidate mask (0..511), built once at load.
	var BITCOUNT = new Uint8Array(512); // number of set bits
	var DIGIT_OF = new Uint8Array(512); // lowest set bit -> digit 1..9 (0 for an empty mask)
	var VALUES = [];                    // mask -> array of the digits it contains
	(function () {
		for (var m = 0; m < 512; m++) {
			var n = 0, low = 0, list = [];
			for (var v = 1; v <= 9; v++) {
				if (m & (1 << (v - 1))) { n++; list.push(v); if (!low) low = v; }
			}
			BITCOUNT[m] = n; DIGIT_OF[m] = low; VALUES[m] = list;
		}
	})();

	// Table lookups. valuesOf returns a shared array - callers only read it.
	function bitCount(m) { return BITCOUNT[m]; }
	function lowestDigit(m) { return DIGIT_OF[m]; }
	function valuesOf(m) { return VALUES[m]; }

	var COMBO_CACHE = [];
	function kcombos(n, k) {
		// all size-k index subsets of [0, n); n <= 9, k <= 3.
		// Memoized: callers only read the result (map/indexOf), never mutate it.
		var key = n * 4 + k;
		if (COMBO_CACHE[key]) return COMBO_CACHE[key];
		var res = [];
		(function rec(start, acc) {
			if (acc.length === k) { res.push(acc.slice()); return; }
			for (var i = start; i < n; i++) { acc.push(i); rec(i + 1, acc); acc.pop(); }
		})(0, []);
		COMBO_CACHE[key] = res;
		return res;
	}

	// ---- solver ----

	function grade(puzzle) {
		var solved = puzzle.slice();
		var cand = new Array(81);
		var i, k;

		for (i = 0; i < 81; i++) cand[i] = solved[i] ? 0 : FULL;
		for (i = 0; i < 81; i++) {
			if (solved[i]) {
				var m = ~(1 << (solved[i] - 1));
				for (k = 0; k < PEERS[i].length; k++) cand[PEERS[i][k]] &= m;
			}
		}

		var counts = {};
		var hardest = DIFFICULTY.EASY;   // hardest technique difficulty seen on the solve path
		var steps = {};                  // count of deductions made at each difficulty
		steps[DIFFICULTY.EASY] = steps[DIFFICULTY.MEDIUM] = steps[DIFFICULTY.HARD] = 0;

		function place(idx, val) {
			solved[idx] = val;
			cand[idx] = 0;
			var m = ~(1 << (val - 1));
			for (var j = 0; j < PEERS[idx].length; j++) cand[PEERS[idx][j]] &= m;
		}

		function note(name) {
			var difficulty = DIFFICULTY_OF[name];
			counts[name] = (counts[name] || 0) + 1;
			steps[difficulty]++;
			if (RANK[difficulty] > RANK[hardest]) hardest = difficulty;
		}

		// technique ladder, easiest first. `fn` returns true iff it changed the
		// board; `name` is the label recorded in `counts` and the key `note` uses
		// to look up the deduction's difficulty. Keep this ordered easy -> hard:
		// the solver always applies the first listed technique that works.
		var TECHNIQUES = [
			{ fn: nakedSingle,      name: 'nakedSingle',      difficulty: DIFFICULTY.EASY },
			{ fn: hiddenSingle,     name: 'hiddenSingle',     difficulty: DIFFICULTY.EASY },
			{ fn: lockedCandidates, name: 'lockedCandidates', difficulty: DIFFICULTY.MEDIUM },
			{ fn: nakedPair,        name: 'nakedPair',        difficulty: DIFFICULTY.MEDIUM },
			{ fn: hiddenPair,       name: 'hiddenPair',       difficulty: DIFFICULTY.MEDIUM },
			{ fn: nakedTriple,      name: 'nakedTriple',      difficulty: DIFFICULTY.HARD },
			{ fn: hiddenTriple,     name: 'hiddenTriple',     difficulty: DIFFICULTY.HARD },
			{ fn: xWing,            name: 'xWing',            difficulty: DIFFICULTY.HARD },
			{ fn: xyWing,           name: 'xyWing',           difficulty: DIFFICULTY.HARD },
			{ fn: xyzWing,          name: 'xyzWing',          difficulty: DIFFICULTY.HARD },
			{ fn: swordfish,        name: 'swordfish',        difficulty: DIFFICULTY.HARD }
		];

		var DIFFICULTY_OF = {};
		for (var ti = 0; ti < TECHNIQUES.length; ti++) DIFFICULTY_OF[TECHNIQUES[ti].name] = TECHNIQUES[ti].difficulty;

		for (;;) {
			var full = true;
			for (i = 0; i < 81; i++) if (!solved[i]) { full = false; break; }
			if (full) break;

			// dead end: an empty cell with no candidates left
			var dead = false;
			for (i = 0; i < 81; i++) if (!solved[i] && !cand[i]) { dead = true; break; }
			if (dead) return result(false);

			var moved = false;
			for (var t = 0; t < TECHNIQUES.length; t++) {
				if (TECHNIQUES[t].fn()) { moved = true; break; }
			}
			if (!moved) return result(false);
		}
		return result(true);

		function result(ok) {
			// copy the accumulators so callers can't mutate grader internals
			var stepsCopy = {}, countsCopy = {}, key;
			for (key in steps) stepsCopy[key] = steps[key];
			for (key in counts) countsCopy[key] = counts[key];
			return { solvable: ok, hardestDifficulty: hardest, steps: stepsCopy, counts: countsCopy };
		}

		// ---- techniques: each returns true iff it changed the board ----

		function nakedSingle() {
			for (var c = 0; c < 81; c++) {
				if (!solved[c] && bitCount(cand[c]) === 1) {
					place(c, lowestDigit(cand[c]));
					note('nakedSingle');
					return true;
				}
			}
			return false;
		}

		function hiddenSingle() {
			for (var u = 0; u < 27; u++) {
				for (var v = 1; v <= 9; v++) {
					var bit = 1 << (v - 1), spot = -1, cnt = 0;
					for (var j = 0; j < 9; j++) {
						var c = UNITS[u][j];
						if (!solved[c] && (cand[c] & bit)) { cnt++; spot = c; }
					}
					if (cnt === 1) {
						place(spot, v);
						note('hiddenSingle');
						return true;
					}
				}
			}
			return false;
		}

		function lockedCandidates() {
			// value's candidates in unit U all lie inside another unit W -> clear v from W \ U
			// (covers both pointing pairs/triples and box-line reduction)
			for (var v = 1; v <= 9; v++) {
				var bit = 1 << (v - 1);
				for (var u = 0; u < 27; u++) {
					var cells = [];
					for (var j = 0; j < 9; j++) {
						var c = UNITS[u][j];
						if (!solved[c] && (cand[c] & bit)) cells.push(c);
					}
					if (cells.length < 2 || cells.length > 3) continue;
					for (var w = 0; w < 27; w++) {
						if (w === u) continue;
						var all = true;
						for (var a = 0; a < cells.length; a++) {
							if (UNITS[w].indexOf(cells[a]) === -1) { all = false; break; }
						}
						if (!all) continue;
						var changed = false;
						for (var n = 0; n < 9; n++) {
							var d = UNITS[w][n];
							if (cells.indexOf(d) === -1 && !solved[d] && (cand[d] & bit)) { cand[d] &= ~bit; changed = true; }
						}
						if (changed) { 
							note('lockedCandidates'); 
							return true; 
						}
					}
				}
			}
			return false;
		}

		function openCells(u) {
			var open = [];
			for (var j = 0; j < 9; j++) { var c = UNITS[u][j]; if (!solved[c]) open.push(c); }
			return open;
		}

		function nakedSubsetInUnit(size) {
			// `size` cells whose candidates together span exactly `size` values ->
			// those values can't appear elsewhere in the unit
			for (var u = 0; u < 27; u++) {
				var open = openCells(u);
				if (open.length <= size) continue;
				var combos = kcombos(open.length, size);
				for (var ci = 0; ci < combos.length; ci++) {
					var pick = combos[ci].map(function (x) { return open[x]; });
					var mask = 0;
					for (var p = 0; p < size; p++) mask |= cand[pick[p]];
					if (bitCount(mask) !== size) continue;
					var changed = false;
					for (var b = 0; b < open.length; b++) {
						if (pick.indexOf(open[b]) !== -1) continue;
						if (cand[open[b]] & mask) { cand[open[b]] &= ~mask; changed = true; }
					}
					if (changed) return true;
				}
			}
			return false;
		}

		function hiddenSubsetInUnit(size) {
			// `size` values that appear only within the same `size` cells of a unit
			// -> those cells can't hold anything else
			for (var u = 0; u < 27; u++) {
				var open = openCells(u);
				if (open.length <= size) continue;
				var combos = kcombos(open.length, size);
				for (var ci = 0; ci < combos.length; ci++) {
					var pick = combos[ci].map(function (x) { return open[x]; });
					var vmask = 0;
					for (var v = 1; v <= 9; v++) {
						var bit = 1 << (v - 1), inPick = false, outside = false;
						for (var d = 0; d < open.length; d++) {
							if (!(cand[open[d]] & bit)) continue;
							if (pick.indexOf(open[d]) !== -1) inPick = true; else outside = true;
						}
						if (inPick && !outside) vmask |= bit;
					}
					if (bitCount(vmask) !== size) continue;
					var changed = false;
					for (var e = 0; e < size; e++) {
						if (cand[pick[e]] & ~vmask) { cand[pick[e]] &= vmask; changed = true; }
					}
					if (changed) return true;
				}
			}
			return false;
		}

		function nakedPair()    { if (nakedSubsetInUnit(2))  { note('nakedPair');    return true; } return false; }
		function hiddenPair()   { if (hiddenSubsetInUnit(2)) { note('hiddenPair');   return true; } return false; }
		function nakedTriple()  { if (nakedSubsetInUnit(3))  { note('nakedTriple');  return true; } return false; }
		function hiddenTriple() { if (hiddenSubsetInUnit(3)) { note('hiddenTriple'); return true; } return false; }

		function xWing()     { return fishOfSize(2, 'xWing'); }
		function swordfish() { return fishOfSize(3, 'swordfish'); }

		function fishOfSize(size, name) {
			for (var v = 1; v <= 9; v++) {
				var bit = 1 << (v - 1);
				if (fishN(bit, true, size) || fishN(bit, false, size)) { note(name); return true; } // by row, then by column
			}
			return false;
		}

		function fishN(bit, byRow, size) {
			// `size` base lines whose candidate positions for the value span exactly
			// `size` cross lines -> clear the value from those cross lines elsewhere.
			// byRow: base lines are rows and cross lines are columns; !byRow swaps them.
			var lines = [];
			for (var line = 0; line < 9; line++) {
				var crossPositions = [];
				for (var j = 0; j < 9; j++) {
					var idx = byRow ? (line * 9 + j) : (j * 9 + line);
					if (!solved[idx] && (cand[idx] & bit)) crossPositions.push(j);
				}
				if (crossPositions.length >= 2 && crossPositions.length <= size) {
					lines.push({ line: line, crossPositions: crossPositions });
				}
			}
			var combos = kcombos(lines.length, size);
			for (var ci = 0; ci < combos.length; ci++) {
				var pick = combos[ci].map(function (x) { return lines[x]; });
				var crossSet = {}, a, b;
				for (a = 0; a < size; a++) for (b = 0; b < pick[a].crossPositions.length; b++) crossSet[pick[a].crossPositions[b]] = true;
				var crossLines = Object.keys(crossSet).map(Number);
				if (crossLines.length !== size) continue;
				var baseLines = pick.map(function (x) { return x.line; });
				var changed = false;
				for (var cl = 0; cl < crossLines.length; cl++) {
					for (var bl = 0; bl < 9; bl++) {
						if (baseLines.indexOf(bl) !== -1) continue;
						var idx = byRow ? (bl * 9 + crossLines[cl]) : (crossLines[cl] * 9 + bl);
						if (!solved[idx] && (cand[idx] & bit)) { cand[idx] &= ~bit; changed = true; }
					}
				}
				if (changed) return true;
			}
			return false;
		}

		function xyWing() {
			for (var pv = 0; pv < 81; pv++) {
				if (solved[pv] || bitCount(cand[pv]) !== 2) continue;
				var xy = valuesOf(cand[pv]), x = xy[0], y = xy[1];
				var pals = PEERS[pv].filter(function (c) { return !solved[c] && bitCount(cand[c]) === 2; });
				for (var a = 0; a < pals.length; a++) {
					for (var b = 0; b < pals.length; b++) {
						if (a === b) continue;
						var A = pals[a], B = pals[b];
						var av = valuesOf(cand[A]);
						if (av.indexOf(x) === -1) continue;
						var z = av[0] === x ? av[1] : av[0];
						if (z === y) continue;
						var bv = valuesOf(cand[B]);
						if (!((bv[0] === y && bv[1] === z) || (bv[0] === z && bv[1] === y))) continue;
						var zbit = 1 << (z - 1), changed = false;
						for (var kk = 0; kk < PEERS[A].length; kk++) {
							var c = PEERS[A][kk];
							if (c === pv || c === B) continue;
							if (PEERS[B].indexOf(c) === -1) continue;
							if (!solved[c] && (cand[c] & zbit)) { cand[c] &= ~zbit; changed = true; }
						}
						if (changed) { note('xyWing'); return true; }
					}
				}
			}
			return false;
		}

		function xyzWing() {
			for (var pv = 0; pv < 81; pv++) {
				if (solved[pv] || bitCount(cand[pv]) !== 3) continue;
				var pals = PEERS[pv].filter(function (c) {
					return !solved[c] && bitCount(cand[c]) === 2 && (cand[c] & ~cand[pv]) === 0;
				});
				for (var a = 0; a < pals.length; a++) {
					for (var b = a + 1; b < pals.length; b++) {
						var A = pals[a], B = pals[b];
						if ((cand[A] | cand[B]) !== cand[pv]) continue; // pincers cover all three
						var zmask = cand[A] & cand[B];
						if (bitCount(zmask) !== 1) continue;           // shared value z
						var changed = false;
						for (var kk = 0; kk < PEERS[A].length; kk++) {
							var c = PEERS[A][kk];
							if (c === pv || c === B) continue;
							if (PEERS[B].indexOf(c) === -1 || PEERS[pv].indexOf(c) === -1) continue;
							if (!solved[c] && (cand[c] & zmask)) { cand[c] &= ~zmask; changed = true; }
						}
						if (changed) { note('xyzWing'); return true; }
					}
				}
			}
			return false;
		}
	}

	self.SudokuGrader = { grade: grade };
})();
