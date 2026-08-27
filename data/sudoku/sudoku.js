(function () {
	'use strict';

	var STORAGE_KEY = 'sudoku-game-v1';
	var GIVENS = { easy: 42, medium: 34, hard: 28 };

	var boardEl = document.getElementById('sudoku-board');
	var statusEl = document.getElementById('sudoku-status');
	var padEl = document.getElementById('sudoku-pad');
	var newBtn = document.getElementById('sudoku-new');
	var diffEl = document.getElementById('sudoku-difficulty');

	var puzzle = [];   // 81 ints, non-zero entries are the fixed givens
	var current = [];  // 81 ints, full board state (givens + player entries)
	var solution = []; // 81 ints, the (unique) completed grid
	var selected = -1;
	var difficulty = 'medium';

	// ---- solver / generator ----

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

	// ---- rendering ----

	function render() {
		boardEl.innerHTML = '';
		for (var i = 0; i < 81; i++) {
			var cell = document.createElement('div');
			var c = i % 9, r = Math.floor(i / 9);
			cell.className = 'sudoku-cell';
			if (c === 2 || c === 5) cell.className += ' br';
			if (r === 2 || r === 5) cell.className += ' bb';
			if (puzzle[i] !== 0) {
				cell.className += ' given';
				cell.textContent = puzzle[i];
			} else if (current[i] !== 0) {
				cell.textContent = current[i];
			}
			cell.setAttribute('data-idx', i);
			boardEl.appendChild(cell);
		}
		applyHighlights();
	}

	function peers(idx) {
		if (idx < 0) return {};
		var r = Math.floor(idx / 9), c = idx % 9;
		var br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
		var set = {}, k, i, j;
		for (k = 0; k < 9; k++) {
			set[r * 9 + k] = true;
			set[k * 9 + c] = true;
		}
		for (i = 0; i < 3; i++) {
			for (j = 0; j < 3; j++) set[(br + i) * 9 + (bc + j)] = true;
		}
		return set;
	}

	function findConflicts() {
		var bad = [];
		for (var i = 0; i < 81; i++) bad.push(false);

		var groups = [];
		for (var g = 0; g < 9; g++) {
			var row = [], col = [], box = [];
			for (var j = 0; j < 9; j++) {
				row.push(g * 9 + j);
				col.push(j * 9 + g);
				var br = Math.floor(g / 3) * 3, bc = (g % 3) * 3;
				box.push((br + Math.floor(j / 3)) * 9 + bc + (j % 3));
			}
			groups.push(row, col, box);
		}

		groups.forEach(function (group) {
			var seen = {};
			group.forEach(function (idx) {
				var v = current[idx];
				if (!v) return;
				if (seen[v] !== undefined) {
					bad[idx] = true;
					bad[seen[v]] = true;
				} else {
					seen[v] = idx;
				}
			});
		});
		return bad;
	}

	function applyHighlights() {
		var cells = boardEl.children;
		var conflicts = findConflicts();
		var peerSet = peers(selected);
		for (var i = 0; i < 81; i++) {
			var cl = cells[i].classList;
			cl.toggle('selected', i === selected);
			cl.toggle('peer', i !== selected && !!peerSet[i]);
			cl.toggle('conflict', conflicts[i]);
		}
	}

	// ---- interaction ----

	function enter(num) {
		if (selected < 0 || puzzle[selected] !== 0) return;
		current[selected] = num;
		var cell = boardEl.children[selected];
		cell.textContent = num === 0 ? '' : num;
		save();
		applyHighlights();
		checkWin();
	}

	function moveSelection(key) {
		if (selected < 0) { selected = 0; applyHighlights(); return; }
		var r = Math.floor(selected / 9), c = selected % 9;
		if (key === 'ArrowUp') r = (r + 8) % 9;
		else if (key === 'ArrowDown') r = (r + 1) % 9;
		else if (key === 'ArrowLeft') c = (c + 8) % 9;
		else if (key === 'ArrowRight') c = (c + 1) % 9;
		selected = r * 9 + c;
		applyHighlights();
	}

	function checkWin() {
		for (var i = 0; i < 81; i++) {
			if (current[i] === 0) { setStatus('', false); return; }
		}
		for (var j = 0; j < 81; j++) {
			if (current[j] !== solution[j]) { setStatus('Not quite — check for mistakes.', false); return; }
		}
		setStatus('Solved!', true);
	}

	function setStatus(msg, solved) {
		statusEl.textContent = msg;
		statusEl.classList.toggle('solved', !!solved);
	}

	function setDifficulty(d) {
		if (!GIVENS[d]) return;
		difficulty = d;
		var btns = diffEl.children;
		for (var i = 0; i < btns.length; i++) {
			var on = btns[i].getAttribute('data-diff') === d;
			btns[i].classList.toggle('active', on);
			btns[i].setAttribute('aria-pressed', on ? 'true' : 'false');
		}
	}

	// ---- persistence ----

	function save() {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify({
				puzzle: puzzle,
				current: current,
				solution: solution,
				difficulty: difficulty
			}));
		} catch (e) { /* storage unavailable, no-op */ }
	}

	function load() {
		try {
			var data = JSON.parse(localStorage.getItem(STORAGE_KEY));
			if (!data || !data.puzzle || !data.current || !data.solution) return false;
			if (data.puzzle.length !== 81) return false;
			puzzle = data.puzzle;
			current = data.current;
			solution = data.solution;
			if (data.difficulty) setDifficulty(data.difficulty);
			return true;
		} catch (e) {
			return false;
		}
	}

	function newGame() {
		setStatus('Generating…', false);
		// defer so the status text paints before the (blocking) generator runs
		setTimeout(function () {
			var g = generate(difficulty);
			puzzle = g.puzzle;
			solution = g.solution;
			current = puzzle.slice();
			selected = -1;
			setStatus('', false);
			save();
			render();
		}, 20);
	}

	boardEl.addEventListener('click', function (e) {
		var cell = e.target.closest('.sudoku-cell');
		if (!cell) return;
		selected = parseInt(cell.getAttribute('data-idx'), 10);
		applyHighlights();
	});

	padEl.addEventListener('click', function (e) {
		var btn = e.target.closest('button');
		if (!btn) return;
		enter(parseInt(btn.getAttribute('data-num'), 10));
	});

	document.addEventListener('keydown', function (e) {
		if (e.key >= '1' && e.key <= '9') enter(parseInt(e.key, 10));
		else if (e.key === '0' || e.key === 'Backspace' || e.key === 'Delete') enter(0);
		else if (e.key.indexOf('Arrow') === 0) moveSelection(e.key);
		else return;
		e.preventDefault();
	});

	newBtn.addEventListener('click', newGame);
	diffEl.addEventListener('click', function (e) {
		var btn = e.target.closest('button');
		if (!btn) return;
		setDifficulty(btn.getAttribute('data-diff'));
		newGame();
	});

	if (load()) {
		render();
		checkWin();
	} else {
		newGame();
	}
})();
