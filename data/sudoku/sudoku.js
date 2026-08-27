(function () {
	'use strict';

	var STORAGE_KEY = 'sudoku-game-v1';
	
	var canPlace = SudokuGenerator.canPlace;
	var generate = SudokuGenerator.generate;

	var boardEl = document.getElementById('sudoku-board');
	var padEl = document.getElementById('sudoku-pad');
	var diffEl = document.getElementById('sudoku-difficulty');
	var modeEl = document.getElementById('sudoku-mode');
	var autoNotesEl = document.getElementById('sudoku-autonotes');

	var puzzle = [];   // 81 ints, non-zero entries are the fixed givens
	var current = [];  // 81 ints, full board state (givens + player entries)
	var solution = []; // 81 ints, the (unique) completed grid
	var marks = [];    // 81 arrays of 9 booleans, player's pencil marks for empty cells
	var noteEdits = []; // 81 arrays of 9 ints: 0 defer to auto, 1 forced on, -1 forced off
	var selected = -1;
	var difficulty = 'medium';
	var mode = 'answer'; // 'answer' fills the cell, 'notes' toggles pencil marks
	var autoNotes = false; // when on, pencil marks track the board automatically

	function blankCell() { return [false, false, false, false, false, false, false, false, false]; }
	function zeroEdits() { return [0, 0, 0, 0, 0, 0, 0, 0, 0]; }

	function emptyMarks() {
		var m = [];
		for (var i = 0; i < 81; i++) m.push(blankCell());
		return m;
	}

	function emptyNoteEdits() {
		var m = [];
		for (var i = 0; i < 81; i++) m.push(zeroEdits());
		return m;
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
			}
			cell.setAttribute('data-idx', i);
			boardEl.appendChild(cell);
			if (puzzle[i] === 0) paintCell(i);
		}
		applyHighlights();
	}

	function paintCell(idx) {
		// render the mutable contents of one non-given cell: value, or pencil marks
		var cell = boardEl.children[idx];
		if (!cell || puzzle[idx] !== 0) return;
		cell.innerHTML = '';
		if (current[idx] !== 0) {
			cell.classList.remove('has-marks');
			cell.textContent = current[idx];
			return;
		}
		var cm = marks[idx], any = false, k;
		for (k = 0; k < 9; k++) if (cm[k]) { any = true; break; }
		if (!any) {
			cell.classList.remove('has-marks');
			return;
		}
		cell.classList.add('has-marks');
		var wrap = document.createElement('div');
		wrap.className = 'sudoku-marks';
		for (var n = 0; n < 9; n++) {
			var s = document.createElement('span');
			s.textContent = cm[n] ? (n + 1) : '';
			wrap.appendChild(s);
		}
		cell.appendChild(wrap);
	}

	// ---- auto-notes ----

	function autoCandidates(idx) {
		// naive row/col/box candidates for an empty, non-given cell
		var cand = blankCell();
		if (puzzle[idx] !== 0 || current[idx] !== 0) return cand;
		for (var v = 1; v <= 9; v++) cand[v - 1] = canPlace(current, idx, v);
		return cand;
	}

	function recomputeNotes() {
		// re-derive every cell's pencil marks from the board, then reapply user overrides
		if (!autoNotes) return;
		for (var i = 0; i < 81; i++) {
			if (puzzle[i] !== 0 || current[i] !== 0) { marks[i] = blankCell(); continue; }
			var base = autoCandidates(i), row = marks[i] = blankCell();
			for (var d = 0; d < 9; d++) {
				var e = noteEdits[i][d];
				row[d] = e === 1 ? true : e === -1 ? false : base[d];
			}
		}
		for (var k = 0; k < 81; k++) paintCell(k);
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
		if (mode === 'notes') {
			if (num === 0) {
				marks[selected] = blankCell();
				if (autoNotes) { for (var d = 0; d < 9; d++) noteEdits[selected][d] = -1; }
			} else if (current[selected] === 0) {
				var want = !marks[selected][num - 1];
				if (autoNotes) {
					var base = autoCandidates(selected)[num - 1];
					noteEdits[selected][num - 1] = want === base ? 0 : want ? 1 : -1;
				}
				marks[selected][num - 1] = want;
			}
		} else {
			current[selected] = num;
			if (num !== 0) marks[selected] = blankCell();
			if (autoNotes) {
				noteEdits[selected] = zeroEdits();
				recomputeNotes();
			}
		}
		paintCell(selected);
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
		// a full board with no unit conflicts must be the (unique) solution;
		// a full board with mistakes always has a conflict, already shown in red.
		var solved = true;
		for (var i = 0; i < 81; i++) {
			if (current[i] === 0 || current[i] !== solution[i]) { solved = false; break; }
		}
		boardEl.classList.toggle('solved', solved);
	}

	function setDifficulty(d) {
		difficulty = d;
		var btns = diffEl.children;
		for (var i = 0; i < btns.length; i++) {
			var on = btns[i].getAttribute('data-diff') === d;
			btns[i].classList.toggle('active', on);
			btns[i].setAttribute('aria-pressed', on ? 'true' : 'false');
		}
	}

	function setMode(m) {
		if (m !== 'answer' && m !== 'notes') return;
		mode = m;
		var btns = modeEl.children;
		for (var i = 0; i < btns.length; i++) {
			var on = btns[i].getAttribute('data-mode') === m;
			btns[i].classList.toggle('active', on);
			btns[i].setAttribute('aria-pressed', on ? 'true' : 'false');
		}
	}

	function setAutoNotes(on) {
		autoNotes = !!on;
		if (autoNotesEl) {
			autoNotesEl.classList.toggle('active', autoNotes);
			autoNotesEl.setAttribute('aria-pressed', autoNotes ? 'true' : 'false');
		}
	}

	// ---- persistence ----

	function save() {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify({
				puzzle: puzzle,
				current: current,
				solution: solution,
				marks: marks,
				noteEdits: noteEdits,
				autoNotes: autoNotes,
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
			marks = (data.marks && data.marks.length === 81) ? data.marks : emptyMarks();
			noteEdits = (data.noteEdits && data.noteEdits.length === 81) ? data.noteEdits : emptyNoteEdits();
			setAutoNotes(data.autoNotes);
			if (data.difficulty) setDifficulty(data.difficulty);
			return true;
		} catch (e) {
			return false;
		}
	}

	function newGame() {
		boardEl.classList.add('loading');
		// defer so the loading state paints before the (blocking) generator runs
		setTimeout(function () {
			var g = generate(difficulty);
			puzzle = g.puzzle;
			solution = g.solution;
			current = puzzle.slice();
			marks = emptyMarks();
			noteEdits = emptyNoteEdits();
			selected = -1;
			save();
			render();
			boardEl.classList.remove('solved');
			boardEl.classList.remove('loading');
			recomputeNotes();
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

	diffEl.addEventListener('click', function (e) {
		var btn = e.target.closest('button');
		if (!btn) return;
		setDifficulty(btn.getAttribute('data-diff'));
		newGame();
	});

	modeEl.addEventListener('click', function (e) {
		var btn = e.target.closest('button');
		if (!btn) return;
		setMode(btn.getAttribute('data-mode'));
	});

	if (autoNotesEl) {
		autoNotesEl.addEventListener('click', function () {
			setAutoNotes(!autoNotes);
			noteEdits = emptyNoteEdits();
			if (autoNotes) {
				recomputeNotes(); // fresh reseed; also the "reset notes" action
			} else {
				marks = emptyMarks(); // leaving auto-notes clears the notes
				for (var i = 0; i < 81; i++) paintCell(i);
			}
			save();
		});
	}

	if (load()) {
		render();
		recomputeNotes();
		checkWin();
	} else {
		newGame();
	}
})();
