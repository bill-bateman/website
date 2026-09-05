---
title: "Sudoku & Techniques"
subtitle: "games / sudoku"
category: "games"
date: "2026-09-04"
summary: "Sudoku game, plus techniques walkthrough."
post: True
---

I made a Sudoku game! Check it out [here](sudoku/).

Why make a Sudoku game? There are free ones online after all

- For fun.
- It is a PWA, so you can download it onto smartphones and use it offline.
- I can control the difficulty, and make it harder!

The way I controlled the difficulty is by separating techniques into categories. E.g. a difficult puzzle requires the use of at least 1 difficult technique (and I try to get at least 2 difficult techniques). In the rest of this post, I'll show examples of all the techniques that my Sudoku games might require. There are more, and hopefully I'll come back and add more to the game and to this post!

None of these techniques are new. For reference, see [learn-sudoku.com](https://www.learn-sudoku.com/index.html), [sudokuwiki.org](https://www.sudokuwiki.org/Introduction), and other similar sites.

<link rel="stylesheet" href="/sudoku/sudoku.css" />
<link rel="stylesheet" href="/sudoku-technique-post/technique-demo.css" />

# Easy Techniques

## Naked single

Naked singles are the easiest. If a cell has only one possible candidate, then fill it in!

<div id="naked-single-demo" class="technique-demo"></div>

<div id="naked-single-step-text" class="technique-step-text"></div>

<script src="/sudoku/sudoku-utils.js"></script>
<script src="/sudoku-technique-post/technique-demo.js"></script>
<script>
SudokuTechniqueDemo.render({
    containerId: 'naked-single-demo',
    textContainerId: 'naked-single-step-text',
    givens: [
        5, 0, 4, 6, 7, 0, 0, 0, 0,
        0, 7, 0, 1, 0, 5, 0, 4, 0,
        1, 0, 8, 3, 4, 0, 5, 6, 7,
        8, 5, 0, 7, 6, 0, 0, 0, 0,
        4, 0, 0, 0, 5, 3, 0, 0, 1,
        0, 1, 3, 0, 0, 4, 8, 5, 6,
        0, 6, 1, 5, 3, 0, 0, 8, 0,
        2, 8, 0, 4, 1, 0, 6, 3, 0,
        3, 0, 5, 2, 8, 6, 1, 0, 0
    ],
    steps: [
        { text: "Initial state." },
        {
            active: [3, 12, 21, 30, 31, 32, 39, 40, 41, 45, 46, 47, 48, 49, 50, 51, 52, 53, 57, 66, 75],
            text: "Highlighting the interesting area."
        },
        {
            active: [3, 12, 21, 30, 31, 32, 39, 40, 41, 45, 46, 47, 48, 49, 50, 51, 52, 53, 57, 66, 75],
            highlight: [48],
            text: "The highlighted cell can only be 9."
        },
        {
            active: [3, 12, 21, 30, 31, 32, 39, 40, 41, 45, 46, 47, 48, 49, 50, 51, 52, 53, 57, 66, 75],
            highlight: [48],
            fill: [{ idx: 48, value: 9 }],
            text: "Done!"
        }
    ]
});
</script>

## Hidden single

Hidden singles are just as simple, but harder to spot. If in a given row, column, or box, there is only one cell that could possibly be a value, then that cell must be that value.

<div id="hidden-single-demo" class="technique-demo"></div>

<div id="hidden-single-step-text" class="technique-step-text"></div>

<script>
SudokuTechniqueDemo.render({
    containerId: 'hidden-single-demo',
    textContainerId: 'hidden-single-step-text',
    givens: [
        0, 0, 8, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 2, 8, 0, 7, 3,
        0, 0, 0, 9, 1, 6, 2, 4, 8,
        0, 0, 2, 1, 9, 0, 0, 5, 0,
        0, 9, 0, 6, 0, 0, 0, 2, 0,
        0, 0, 0, 3, 0, 2, 0, 0, 9,
        3, 0, 7, 0, 6, 0, 0, 0, 5,
        0, 0, 0, 7, 0, 0, 0, 8, 6,
        0, 0, 6, 0, 0, 0, 7, 3, 2
    ],
    steps: [
        { text: "Initial state." },
        {
            active: [3, 12, 21, 30, 39, 48, 57, 66, 75],
            text: 'Highlighting column of interest.'
        },
        {
            active: [3, 12, 21, 30, 39, 48, 57, 66, 75],
            highlight: [57],
            text: 'The highlighted cell is the only place in the column that can possibly be 2.'
        },
        {
            active: [3, 12, 21, 30, 39, 48, 57, 66, 75],
            highlight: [57],
            keepCandidates: [{ idx: 57, values: [2] }],
            text: 'Update candidates.'
        },
        {
            active: [3, 12, 21, 30, 39, 48, 57, 66, 75],
            highlight: [57],
            fill: [{ idx: 57, value: 2 }],
            text: 'Done!'
        }
    ]
});
</script>

# Medium Techniques

## Locked candidates

If you can show that the candidates for a value within a region (box/row/column) are entirely within a second region (box/row/column), you can remove the candidates for that value that are in the second region but not the first.

In this first example, the first region is a box, and the second region is a column.

<div id="locked-candidates-demo" class="technique-demo"></div>

<div id="locked-candidates-step-text" class="technique-step-text"></div>

<script>
SudokuTechniqueDemo.render({
    containerId: 'locked-candidates-demo',
    textContainerId: 'locked-candidates-step-text',
    givens: [
        0, 3, 4, 0, 7, 0, 9, 0, 0,
        0, 7, 0, 0, 9, 5, 0, 0, 0,
        0, 0, 8, 0, 4, 0, 0, 6, 7,
        0, 0, 0, 0, 6, 1, 0, 0, 3,
        0, 0, 0, 0, 5, 0, 0, 0, 0,
        0, 1, 3, 0, 2, 0, 8, 0, 6,
        0, 0, 1, 0, 0, 0, 2, 0, 0,
        0, 0, 0, 0, 1, 0, 6, 3, 0,
        0, 4, 0, 2, 0, 6, 1, 0, 0
    ],
    steps: [
        { text: "Initial state." },
        {
            active: [60, 61, 62, 69, 70, 71, 78, 79, 80],
            text: "Highlighting first region (box)."
        },
        {
            active: [60, 61, 62, 69, 70, 71, 78, 79, 80],
            highlight: [61, 79],
            text: "Within this box, 7 can only happen in the second-to-last column."
        },
        {
            active: [7, 16, 25, 34, 43, 52, 61, 70, 79],
            highlight: [61, 79],
            text: "So, 7 cannot happen elsewhere in that column."
        },
        {
            active: [7, 16, 25, 34, 43, 52, 61, 70, 79],
            highlight: [34, 43, 52],
            text: "So, we can remove 7 as a candidate from the highlighted cells."
        },
        {
            active: [7, 16, 25, 34, 43, 52, 61, 70, 79],
            highlight: [34, 43, 52],
            keepCandidates: [
                { idx: 34, values: [2, 4, 5, 9] },
                { idx: 43, values: [1, 2, 4, 9] },
                { idx: 52, values: [4, 5, 9] }
            ],
            text: "Done!"
        }
    ]
});
</script>

Box vs row.

<div id="locked-candidates-box-row-demo" class="technique-demo"></div>

<div id="locked-candidates-box-row-step-text" class="technique-step-text"></div>

<script>
SudokuTechniqueDemo.render({
    containerId: 'locked-candidates-box-row-demo',
    textContainerId: 'locked-candidates-box-row-step-text',
    givens: [
        5, 3, 0, 0, 0, 8, 0, 0, 0,
        0, 7, 2, 0, 9, 0, 0, 0, 0,
        1, 9, 8, 0, 0, 2, 5, 6, 7,
        0, 5, 9, 0, 0, 0, 4, 2, 0,
        0, 2, 0, 0, 5, 0, 0, 0, 0,
        0, 1, 3, 9, 2, 0, 0, 5, 0,
        9, 0, 0, 0, 0, 7, 0, 0, 0,
        2, 0, 0, 0, 0, 9, 0, 3, 0,
        3, 4, 0, 2, 0, 0, 1, 0, 0
    ],
    steps: [
        { text: "Initial state." },
        {
            active: [6, 7, 8, 15, 16, 17, 24, 25, 26],
            text: "Highlighting first region (box)."
        },
        {
            active: [6, 7, 8, 15, 16, 17, 24, 25, 26],
            highlight: [15, 17],
            text: "Within this box, 3 can only occur in the second row."
        },
        {
            active: [9, 10, 11, 12, 13, 14, 15, 16, 17],
            highlight: [15, 17],
            text: "So, 3 cannot occur elsewhere in this row."
        },
        {
            active: [9, 10, 11, 12, 13, 14, 15, 16, 17],
            highlight: [12, 14],
            text: "So, we can remove 3 as a candidate from the highlighted cells."
        },
        {
            active: [9, 10, 11, 12, 13, 14, 15, 16, 17],
            highlight: [12, 14],
            keepCandidates: [
                { idx: 12, values: [1, 4, 5, 6] },
                { idx: 14, values: [1, 4, 5, 6] }
            ],
            text: "Done!"
        }
    ]
});
</script>

Row vs box.

<div id="locked-candidates-row-box-demo" class="technique-demo"></div>

<div id="locked-candidates-row-box-step-text" class="technique-step-text"></div>

<script>
SudokuTechniqueDemo.render({
    containerId: 'locked-candidates-row-box-demo',
    textContainerId: 'locked-candidates-row-box-step-text',
    givens: [
        5, 3, 0, 0, 0, 8, 0, 0, 0,
        0, 7, 2, 0, 9, 0, 0, 0, 0,
        1, 9, 8, 0, 0, 2, 5, 6, 7,
        0, 5, 9, 0, 0, 0, 4, 2, 0,
        0, 2, 0, 0, 5, 0, 0, 0, 0,
        0, 1, 3, 9, 2, 0, 0, 5, 0,
        9, 0, 0, 0, 0, 7, 0, 0, 0,
        2, 0, 0, 0, 0, 9, 0, 3, 0,
        3, 4, 0, 2, 0, 0, 1, 0, 0
    ],
    steps: [
        { text: "Initial state." },
        {
            active: [18, 19, 20, 21, 22, 23, 24, 25, 26],
            text: "Highlighting first region (row)."
        },
        {
            active: [18, 19, 20, 21, 22, 23, 24, 25, 26],
            highlight: [21, 22],
            text: "Within this row, both 3 and 4 can only occur within that box."
        },
        {
            active: [3, 4, 5, 12, 13, 14, 21, 22, 23],
            highlight: [21, 22],
            text: "So, neither 3 nor 4 can occur elsewhere in this box."
        },
        {
            active: [3, 4, 5, 12, 13, 14, 21, 22, 23],
            highlight: [3, 4, 12, 14],
            text: "Remove 3 and 4 as candidates from the highlighted cells."
        },
        {
            active: [3, 4, 5, 12, 13, 14, 21, 22, 23],
            highlight: [12, 14],
            keepCandidates: [
                { idx: 3, values: [1, 6, 7] },
                { idx: 4, values: [1, 6, 7] },
                { idx: 12, values: [1, 5, 6] },
                { idx: 14, values: [1, 5, 6] }
            ],
            text: "Done!"
        }
    ]
});
</script>

Column vs box.

<div id="locked-candidates-col-box-demo" class="technique-demo"></div>

<div id="locked-candidates-col-box-step-text" class="technique-step-text"></div>

<script>
SudokuTechniqueDemo.render({
    containerId: 'locked-candidates-col-box-demo',
    textContainerId: 'locked-candidates-col-box-step-text',
    givens: [
        0, 0, 0, 0, 0, 0, 9, 1, 2,
        0, 7, 0, 1, 9, 0, 0, 0, 8,
        0, 0, 0, 0, 0, 0, 5, 0, 7,
        0, 0, 9, 0, 0, 0, 0, 0, 3,
        0, 0, 6, 0, 0, 3, 0, 9, 0,
        7, 1, 3, 9, 0, 0, 0, 0, 6,
        0, 6, 0, 0, 0, 0, 2, 8, 0,
        2, 8, 0, 0, 0, 9, 6, 0, 0,
        0, 0, 5, 0, 8, 0, 0, 0, 0
    ],
    steps: [
        { text: "" },
        {
            active: [2, 11, 20, 29, 38, 47, 56, 65, 74],
            text: ""
        },
        {
            active: [2, 11, 20, 29, 38, 47, 56, 65, 74],
            highlight: [2, 20],
            text: ""
        },
        {
            active: [0, 1, 2, 9, 10, 11, 18, 19, 20],
            highlight: [2, 20],
            text: ""
        },
        {
            active: [0, 1, 2, 9, 10, 11, 18, 19, 20],
            highlight: [0, 18],
            text: ""
        },
        {
            active: [0, 1, 2, 9, 10, 11, 18, 19, 20],
            highlight: [0, 18],
            keepCandidates: [
                { idx: 0, values: [3, 4, 5, 6] },
                { idx: 18, values: [1, 3, 4, 6, 9] }
            ],
            text: ""
        }
    ]
});
</script>

## Naked pair

In a naked pair, 2 cells within a region have the same 2 candidates. This means those 2 values must be in those 2 cells, and the rest of the region cannot contain either value.

Note that this generalizes - if the set of candidates for n cells within a region is only of size n, then all other cells in that region cannot have any of those n values. But I marked naked triplets and above as hard techniques.

<div id="naked-pair-demo" class="technique-demo"></div>

<div id="naked-pair-step-text" class="technique-step-text"></div>

<script>
SudokuTechniqueDemo.render({
    containerId: 'naked-pair-demo',
    textContainerId: 'naked-pair-step-text',
    givens: [
        0, 0, 4, 6, 0, 0, 9, 1, 2,
        0, 7, 0, 0, 9, 0, 0, 4, 0,
        0, 0, 0, 0, 0, 2, 0, 0, 7,
        0, 5, 0, 0, 6, 1, 0, 0, 0,
        4, 0, 0, 0, 5, 3, 0, 0, 0,
        0, 0, 3, 0, 2, 0, 0, 5, 0,
        0, 0, 1, 5, 0, 0, 2, 0, 4,
        0, 0, 7, 0, 0, 9, 0, 0, 0,
        3, 0, 5, 0, 8, 0, 0, 0, 9
    ],
    steps: [
        { text: "Initial state." },
        {
            active: [4, 13, 22, 31, 40, 49, 58, 67, 76],
            text: "Highlighting the column of interest."
        },
        {
            active: [4, 13, 22, 31, 40, 49, 58, 67, 76],
            highlight: [4, 58],
            text: "The highlighted cells give a naked pair!"
        },
        {
            active: [4, 13, 22, 31, 40, 49, 58, 67, 76],
            highlight: [22, 67],
            text: "So, we can remove 3 and 7 from the highlighted cells."
        },
        {
            active: [4, 13, 22, 31, 40, 49, 58, 67, 76],
            highlight: [22, 67],
            keepCandidates: [
                { idx: 22, values: [1, 4] },
                { idx: 67, values: [1, 4] }
            ],
            text: "Done!"
        }
    ]
});
</script>

## Hidden pair

Similarly, in a hidden pair, 2 cells within a region are the only possibilities for 2 candidates. So we can clear the other candidates from those cells.

Also similarly, this generalizes to e.g. hidden triplets, which I marked as a difficult technique.

<div id="hidden-pair-demo" class="technique-demo"></div>

<div id="hidden-pair-step-text" class="technique-step-text"></div>

<script>
SudokuTechniqueDemo.render({
    containerId: 'hidden-pair-demo',
    textContainerId: 'hidden-pair-step-text',
    givens: [
        0, 0, 4, 6, 7, 0, 0, 0, 0,
        6, 0, 0, 1, 0, 5, 0, 0, 0,
        0, 0, 0, 0, 4, 2, 5, 0, 0,
        8, 0, 0, 0, 0, 0, 0, 0, 3,
        0, 2, 6, 8, 0, 3, 7, 0, 1,
        0, 0, 3, 0, 0, 4, 0, 5, 0,
        0, 6, 0, 0, 0, 0, 0, 8, 0,
        0, 0, 0, 0, 0, 0, 6, 0, 5,
        3, 0, 0, 2, 0, 6, 1, 0, 9
    ],
    steps: [
        { text: "Initial state." },
        {
            active: [30, 31, 32, 39, 40, 41, 48, 49, 50],
            text: "Highlighting the box of interest."
        },
        {
            active: [30, 31, 32, 39, 40, 41, 48, 49, 50],
            highlight: [31, 49],
            text: "The highlighted cells are the only possibilities for 2 and 6."
        },
        {
            active: [30, 31, 32, 39, 40, 41, 48, 49, 50],
            highlight: [31, 49],
            keepCandidates: [
                { idx: 31, values: [2, 6] },
                { idx: 49, values: [2, 6] }
            ],
            text: "So, we can clear it of all other candidates."
        }
    ]
});
</script>
