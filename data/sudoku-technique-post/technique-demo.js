(function () {
	'use strict';

	// Reusable "technique demo" widget for the sudoku-techniques post: renders a
	// 9x9 grid from a givens array, computes candidates via SudokuUtils, then
	// steps through an author-supplied list of highlight/reveal targets on
	// click. The component has no idea what technique it's showing or what the
	// steps say - all of that is data (steps[].active / .highlight / .fill /
	// .keepCandidates / .text) supplied inline in the post's script block.
	// config.textContainerId names the element each step's .text is written
	// into.

	function blankCell() { return [false, false, false, false, false, false, false, false, false]; }

	function computeCandidates(givens, idx) {
		var cand = blankCell();
		if (givens[idx] !== 0) return cand;
		for (var v = 1; v <= 9; v++) cand[v - 1] = SudokuUtils.canPlace(givens, idx, v);
		return cand;
	}

	function renderBoard(boardEl, givens) {
		boardEl.innerHTML = '';
		for (var i = 0; i < 81; i++) {
			var cell = document.createElement('div');
			var c = i % 9, r = Math.floor(i / 9);
			cell.className = 'sudoku-cell';
			if (c === 2 || c === 5) cell.className += ' br';
			if (r === 2 || r === 5) cell.className += ' bb';
			cell.setAttribute('data-idx', i);
			if (givens[i] !== 0) {
				cell.className += ' given';
				var text = document.createElement('span');
				text.className = 'sudoku-cell-text';
				text.textContent = givens[i];
				cell.appendChild(text);
			} else {
				var cand = computeCandidates(givens, i);
				cell.classList.add('has-marks');
				var wrap = document.createElement('div');
				wrap.className = 'sudoku-marks';
				for (var n = 0; n < 9; n++) {
					var s = document.createElement('span');
					s.textContent = cand[n] ? (n + 1) : '';
					wrap.appendChild(s);
				}
				cell.appendChild(wrap);
				var fillText = document.createElement('span');
				fillText.className = 'sudoku-fill-text';
				cell.appendChild(fillText);
			}
			boardEl.appendChild(cell);
		}
	}

	// Refreshes a non-given cell's candidate spans and clears any fill,
	// without recreating DOM nodes - the marks wrapper and the fill-text
	// overlay both exist from the initial render and just have their
	// content/classes toggled, so opacity transitions (.dimmed,
	// .candidate-removed, .filled) keep animating between steps instead of
	// snapping on freshly-created elements.
	function resetCellContent(cell, givens, idx) {
		cell.classList.remove('filled');
		var cand = computeCandidates(givens, idx);
		var spans = cell.querySelectorAll('.sudoku-marks span');
		spans.forEach(function (s, n) {
			s.textContent = cand[n] ? (n + 1) : '';
			s.classList.remove('candidate-removed');
		});
		var fillText = cell.querySelector('.sudoku-fill-text');
		if (fillText) fillText.textContent = '';
	}

	function resetBoardContent(boardEl, givens) {
		for (var i = 0; i < 81; i++) {
			if (givens[i] !== 0) continue;
			resetCellContent(boardEl.children[i], givens, i);
		}
	}

	var SVG_NS = 'http://www.w3.org/2000/svg';

	function cellCenter(idx) {
		return { x: (idx % 9) + 0.5, y: Math.floor(idx / 9) + 0.5 };
	}

	// Draws connector lines between cell centers on an SVG overlay stacked on
	// top of the board. Used for patterns (x-wing, xy-wing, ...) where the
	// relationship between cells is easier to see as a line than to infer
	// from highlight color alone. Each spec is either a [from, to] pair or an
	// {from, to, dashed} object; dashed marks a "sees" elimination link
	// rather than the pattern's own shape.
	function drawLines(linesSvg, lines) {
		while (linesSvg.firstChild) linesSvg.removeChild(linesSvg.firstChild);
		(lines || []).forEach(function (spec) {
			var from = Array.isArray(spec) ? spec[0] : spec.from;
			var to = Array.isArray(spec) ? spec[1] : spec.to;
			var a = cellCenter(from), b = cellCenter(to);
			var line = document.createElementNS(SVG_NS, 'line');
			line.setAttribute('x1', a.x);
			line.setAttribute('y1', a.y);
			line.setAttribute('x2', b.x);
			line.setAttribute('y2', b.y);
			line.setAttribute('class', 'technique-line' + (!Array.isArray(spec) && spec.dashed ? ' dashed' : ''));
			linesSvg.appendChild(line);
		});
	}

	function applyStep(boardEl, textEl, linesSvg, state, step) {
		if (step.active) state.active = step.active;
		if (step.lines) state.lines = step.lines;
		if (linesSvg) drawLines(linesSvg, state.lines);
		var activeSet = {}, highlightSet = {};
		(state.active || []).forEach(function (i) { activeSet[i] = true; });
		(step.highlight || []).forEach(function (i) { highlightSet[i] = true; });
		for (var i = 0; i < 81; i++) {
			var cellEl = boardEl.children[i];
			var contents = cellEl.querySelectorAll('.sudoku-marks, .sudoku-cell-text, .sudoku-fill-text');
			var dim = !!state.active && !activeSet[i];
			contents.forEach(function (el) { el.classList.toggle('dimmed', dim); });
			cellEl.classList.toggle('technique-highlight', !!highlightSet[i]);
		}
		(step.keepCandidates || []).forEach(function (k) {
			var cell = boardEl.children[k.idx];
			var spans = cell.querySelectorAll('.sudoku-marks span');
			var keepSet = {};
			k.values.forEach(function (v) { keepSet[v] = true; });
			spans.forEach(function (s, n) {
				s.classList.toggle('candidate-removed', !keepSet[n + 1]);
			});
		});
		(step.fill || []).forEach(function (f) {
			var cell = boardEl.children[f.idx];
			var fillText = cell.querySelector('.sudoku-fill-text');
			if (fillText) fillText.textContent = f.value;
			cell.classList.add('filled');
		});
		if (step.text !== undefined && textEl) textEl.innerHTML = step.text;
	}

	function render(config) {
		var container = document.getElementById(config.containerId);
		if (!container) return;
		var textEl = config.textContainerId ? document.getElementById(config.textContainerId) : null;

		var boardWrap = document.createElement('div');
		boardWrap.className = 'technique-board-wrap';
		container.appendChild(boardWrap);

		var boardEl = document.createElement('div');
		boardEl.className = 'sudoku-board technique-board';
		boardWrap.appendChild(boardEl);
		renderBoard(boardEl, config.givens);

		var linesSvg = document.createElementNS(SVG_NS, 'svg');
		linesSvg.setAttribute('class', 'technique-lines');
		linesSvg.setAttribute('viewBox', '0 0 9 9');
		boardWrap.appendChild(linesSvg);

		if (textEl) container.appendChild(textEl);

		var nav = document.createElement('div');
		nav.className = 'technique-demo-nav';
		var prevBtn = document.createElement('button');
		prevBtn.type = 'button';
		prevBtn.className = 'technique-demo-nav-btn';
		prevBtn.textContent = '<';
		var nextBtn = document.createElement('button');
		nextBtn.type = 'button';
		nextBtn.className = 'technique-demo-nav-btn';
		nextBtn.textContent = '>';
		nav.appendChild(prevBtn);
		nav.appendChild(nextBtn);
		container.appendChild(nav);

		var stepIdx = 0;

		function showStep() {
			resetBoardContent(boardEl, config.givens);
			var state = { active: null, lines: null };
			for (var i = 0; i <= stepIdx; i++) {
				applyStep(boardEl, textEl, linesSvg, state, config.steps[i]);
			}
			prevBtn.disabled = stepIdx <= 0;
			nextBtn.disabled = stepIdx >= config.steps.length - 1;
		}

		prevBtn.addEventListener('click', function () {
			if (stepIdx <= 0) return;
			stepIdx -= 1;
			showStep();
		});

		nextBtn.addEventListener('click', function () {
			if (stepIdx >= config.steps.length - 1) return;
			stepIdx += 1;
			showStep();
		});

		showStep();
	}

	self.SudokuTechniqueDemo = { render: render };
})();
