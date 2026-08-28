(function () {
	'use strict';

	// Where the game gets a puzzle from, independent of how one is made. Today it
	// wraps SudokuGenerator + the sudoku-worker.js worker; it could later wrap a
	// precomputed bank or a fetch without sudoku.js changing.
	//
	//   requestPuzzle(difficulty, onReady)  ->  onReady({ puzzle, solution })
	//
	// Generation runs in a worker when available (grading a hard puzzle can take a
	// second or two); otherwise it runs inline on a deferred tick. Only the newest
	// request is delivered - clicking through difficulties won't install a stale board.

	var worker = null;
	var lastRequestId = 0;

	function requestPuzzle(difficulty, onReady) {
		var id = ++lastRequestId;

		if (typeof Worker !== 'undefined') {
			try {
				if (!worker) worker = new Worker('sudoku-worker.js');
				worker.onmessage = function (e) {
					if (e.data && e.data.id === lastRequestId) {
						onReady({ puzzle: e.data.puzzle, solution: e.data.solution });
					}
				};
				worker.onerror = function () {
					worker = null; // give up on the worker, fall back to inline
					runInline(difficulty, id, onReady);
				};
				worker.postMessage({ id: id, difficulty: difficulty });
				return;
			} catch (e) {
				worker = null;
			}
		}
		runInline(difficulty, id, onReady);
	}

	function runInline(difficulty, id, onReady) {
		// defer so the caller's loading state can paint before the blocking run
		setTimeout(function () {
			if (id === lastRequestId) onReady(self.SudokuGenerator.generate(difficulty));
		}, 20);
	}

	self.SudokuSource = { requestPuzzle: requestPuzzle };
})();
