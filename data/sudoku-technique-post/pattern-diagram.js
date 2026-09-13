(function () {
	'use strict';

	// Tiny schematic-diagram widget for the sudoku-techniques post. It turns a
	// compact text sketch of a technique's shape into a mini sudoku-board-like
	// grid, so patterns such as an x-wing can be drawn inline without wiring up
	// a full 9x9 SudokuTechniqueDemo.
	//
	// Source form: a <pre class="sudoku-pattern"> whose text is one row per
	// line. Within a row, "|" separates columns. A segment written as "..." is a
	// gap column (cells elsewhere in that row); a line of just "..." is a gap
	// row (cells elsewhere in that column). Everything else is a cell, and its
	// whitespace-separated tokens are drawn as small candidate marks. A segment
	// may start with "*" to highlight the cell, and the token "<>" is drawn as
	// an elimination target. Every column is the same fixed width, gaps
	// included.

	function isGap(s) { return s === '...' || /^(\.{2,}|⋮)$/.test(s); }

	function parse(text) {
		var raw = text.replace(/\r/g, '').split('\n');
		var lines = [];
		for (var i = 0; i < raw.length; i++) {
			var t = raw[i].trim();
			if (t !== '') lines.push(t);
		}

		var rows = [];
		var cols = 1;
		for (i = 0; i < lines.length; i++) {
			if (isGap(lines[i])) {
				rows.push({ gap: true });
				continue;
			}
			var segs = lines[i].split('|');
			var cells = [];
			for (var j = 0; j < segs.length; j++) {
				var s = segs[j].trim();
				if (isGap(s)) {
					cells.push({ gap: true });
					continue;
				}
				var highlight = false;
				if (s.charAt(0) === '*') { highlight = true; s = s.slice(1).trim(); }
				cells.push({
					highlight: highlight,
					tokens: s === '' ? [] : s.split(/\s+/)
				});
			}
			if (cells.length > cols) cols = cells.length;
			rows.push({ cells: cells });
		}
		return { rows: rows, cols: cols };
	}

	function render(pre) {
		if (!pre || !pre.parentNode) return;
		var parsed = parse(pre.textContent);

		var grid = document.createElement('div');
		grid.className = 'sudoku-pattern-diagram';
		grid.style.gridTemplateColumns = 'repeat(' + parsed.cols + ', 2.4rem)';

		for (var r = 0; r < parsed.rows.length; r++) {
			var row = parsed.rows[r];
			if (row.gap) {
				var gapRow = document.createElement('div');
				gapRow.className = 'pattern-gap-row';
				gapRow.style.gridColumn = '1 / -1';
				gapRow.textContent = '⋮';
				grid.appendChild(gapRow);
				continue;
			}
			for (var c = 0; c < parsed.cols; c++) {
				var cell = row.cells[c];
				var el = document.createElement('div');
				if (!cell || cell.gap) {
					el.className = 'pattern-gap-col';
					if (cell) el.textContent = '…';
				} else {
					el.className = cell.highlight ? 'pattern-cell pattern-highlight' : 'pattern-cell';
					for (var k = 0; k < cell.tokens.length; k++) {
						var mark = document.createElement('span');
						mark.textContent = cell.tokens[k];
						if (cell.tokens[k] === '<>') mark.className = 'pattern-elim';
						el.appendChild(mark);
					}
				}
				grid.appendChild(el);
			}
		}

		pre.parentNode.replaceChild(grid, pre);
	}

	function init() {
		var nodes = document.querySelectorAll('pre.sudoku-pattern');
		for (var i = 0; i < nodes.length; i++) render(nodes[i]);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

	self.SudokuPatternDiagram = { render: render, init: init };
})();
