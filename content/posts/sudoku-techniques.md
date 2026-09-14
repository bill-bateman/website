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
<link rel="stylesheet" href="/sudoku-technique-post/pattern-diagram.css" />

# Easy Techniques

## Naked single

Naked singles are the easiest. If a cell has only one possible candidate, then fill it in!

<div id="naked-single-demo" class="technique-demo"></div>

<div id="naked-single-step-text" class="technique-step-text"></div>

<script src="/sudoku/sudoku-utils.js"></script>
<script src="/sudoku-technique-post/technique-demo.js"></script>
<script src="/sudoku-technique-post/pattern-diagram.js"></script>
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

# Hard Techniques

## Naked triple

Very similar to the naked double, but we need 3 cells limited to a total of 3 candidates.

Note that in the below example, the box could also be seen as having a hidden quadruple! (2, 3, 6, 9)


<div id="naked-triple-demo" class="technique-demo"></div>

<div id="naked-triple-step-text" class="technique-step-text"></div>

<script>
SudokuTechniqueDemo.render({
    containerId: 'naked-triple-demo',
    textContainerId: 'naked-triple-step-text',
    givens: [
        9, 6, 0, 3, 4, 2, 0, 5, 0,
        0, 4, 2, 0, 5, 0, 0, 0, 0,
        5, 0, 0, 0, 0, 9, 0, 4, 0,
        0, 0, 5, 2, 0, 0, 8, 9, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 3, 0,
        0, 0, 0, 0, 0, 0, 0, 1, 0,
        7, 0, 6, 0, 0, 0, 4, 0, 5,
        0, 0, 0, 0, 0, 0, 0, 6, 0
    ],
    steps: [
        { text: "Initial state." },
        {
            active: [6, 7, 8, 15, 16, 17, 24, 25, 26],
            text: "Highlighting the box of interest."
        },
        {
            active: [6, 7, 8, 15, 16, 17, 24, 25, 26],
            highlight: [6, 8, 16],
            text: "The highlighted cells are a naked triple with 1, 7, 8."
        },
        {
            active: [6, 7, 8, 15, 16, 17, 24, 25, 26],
            highlight: [15, 17, 24, 26],
            text: "So, we can remove 1, 7, 8 from the rest of the box."
        },
        {
            active: [6, 7, 8, 15, 16, 17, 24, 25, 26],
            highlight: [15, 17, 24, 26],
            keepCandidates: [
                { idx: 15, values: [3, 6, 9] },
                { idx: 17, values: [3, 6, 9] },
                { idx: 24, values: [2, 3, 6] },
                { idx: 26, values: [2, 3, 6] }
            ],
            text: "Done!"
        }
    ]
});
</script>

## Hidden triple

Similar to hidden pair, but with 3 cells and 3 candidates.

Note that the below example could also be seen as a naked quadruple! (1, 2, 3, 8 in the column; or 1, 2, 8, 9 in the box)

<div id="hidden-triple-demo" class="technique-demo"></div>

<div id="hidden-triple-step-text" class="technique-step-text"></div>

<script>
SudokuTechniqueDemo.render({
    containerId: 'hidden-triple-demo',
    textContainerId: 'hidden-triple-step-text',
    givens: [
        4, 0, 0, 0, 0, 0, 6, 0, 9,
        0, 0, 0, 0, 0, 0, 0, 4, 0,
        0, 0, 0, 9, 0, 4, 7, 0, 0,
        0, 9, 0, 1, 0, 0, 4, 6, 0,
        2, 5, 0, 7, 0, 6, 8, 0, 0,
        1, 0, 0, 0, 0, 0, 0, 7, 5,
        3, 0, 2, 4, 0, 0, 5, 0, 0,
        0, 0, 0, 0, 3, 0, 0, 0, 0,
        0, 0, 0, 2, 0, 0, 3, 0, 0
    ],
    steps: [
        { text: "Initial state." },
        {
            active: [8, 17, 26, 35, 44, 53, 62, 71, 80],
            text: "Highlighting the column of interest."
        },
        {
            active: [8, 17, 26, 35, 44, 53, 62, 71, 80],
            highlight: [62, 71, 80],
            text: "The highlighted cells are the only possibilities for 4, 6, 7."
        },
        {
            active: [8, 17, 26, 35, 44, 53, 62, 71, 80],
            highlight: [62, 71, 80],
            keepCandidates: [
                { idx: 62, values: [6, 7] },
                { idx: 71, values: [4, 6, 7] },
                { idx: 80, values: [4, 6, 7] }
            ],
            text: "So, we can remove all candidates that aren't 4, 6, 7."
        }
    ]
});
</script>

## X-wing

In the x-wing, you can determine that one value has to occur in a specific overlap area.

E.g. in the example below:

- if the top left of the x-wing is 1
    - the top-right is 6
    - the bottom-left is 4
    - the bottom-right is 1
- if the top left of the x-wing is 6
    - the top-right is 1
    - the bottom-right is 4
    - the bottom-left is 1

So, in the 2 columns of interest, 1 can only occur in the x-wing rows.

Note that (1) exists in all 4 corners of the x-wing. I.e. the x-wing pattern is like:

<pre class="sudoku-pattern">
x y | ... | x y
... | ... | ...
x z | ... | x z
</pre>

or

<pre class="sudoku-pattern">
x y | ... | x z
... | ... | ...
x y | ... | x z
</pre>

<div id="x-wing-demo" class="technique-demo"></div>

<div id="x-wing-step-text" class="technique-step-text"></div>

<script>
SudokuTechniqueDemo.render({
    containerId: 'x-wing-demo',
    textContainerId: 'x-wing-step-text',
    givens: [
        4, 5, 0, 8, 9, 0, 3, 2, 7,
        7, 3, 9, 4, 2, 5, 1, 8, 6,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        5, 6, 0, 9, 7, 0, 2, 3, 8,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        3, 1, 8, 6, 5, 9, 4, 7, 2,
        0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    steps: [
        { text: "Initial state." },
        {
            active: [0, 1, 2, 3, 4, 5, 6, 7, 8, 45, 46, 47, 48, 49, 50, 51, 52, 53],
            text: "Highlighting the rows of interest."
        },
        {
            active: [0, 1, 2, 3, 4, 5, 6, 7, 8, 45, 46, 47, 48, 49, 50, 51, 52, 53],
            highlight: [2, 5, 47, 50],
            lines: [[2, 50], [5, 47]],
            text: "The highlighted cells form an x-wing pattern."
        },
        {
            active: [2, 11, 20, 29, 38, 47, 56, 65, 74, 5, 14, 23, 32, 41, 50, 59, 68, 77],
            highlight: [2, 5, 47, 50],
            text: "In the highlighted columns, 1 must occur in the x-wing rows."
        },
        {
            active: [2, 11, 20, 29, 38, 47, 56, 65, 74, 5, 14, 23, 32, 41, 50, 59, 68, 77],
            highlight: [20, 29, 38, 23, 32, 41, 59, 77],
            text: "We can remove 1 as an option from the rest of both columns."
        },
        {
            active: [2, 11, 20, 29, 38, 47, 56, 65, 74, 5, 14, 23, 32, 41, 50, 59, 68, 77],
            highlight: [20, 29, 38, 23, 32, 41, 59, 77],
            keepCandidates: [
                { idx: 20, values: [2, 6] },
                { idx: 29, values: [2, 3, 4, 7] },
                { idx: 38, values: [2, 3, 4, 7] },
                { idx: 23, values: [3, 6, 7] },
                { idx: 32, values: [2, 3, 4, 6, 8] },
                { idx: 41, values: [2, 3, 4, 6, 8] },
                { idx: 59, values: [2, 3, 4, 7, 8] },
                { idx: 77, values: [2, 3, 4, 7, 8] }
            ],
            text: "Done!"
        }
    ]
});
</script>

## XY-wing

XY-wing is similar to the X-wing, but we can only the pivot from cells that can see both corners.

<pre class="sudoku-pattern">
y z | ... | x y
... | ... | ...
x z | ... | <>
</pre>

- if the top-left corner is y
    - top right is x
    - bottom-right cannot be x
- if the top-left corner is z
    - bottom-left is x
    - bottom-right cannot be x

<div id="xy-wing-demo" class="technique-demo"></div>

<div id="xy-wing-step-text" class="technique-step-text"></div>

<script>
SudokuTechniqueDemo.render({
    containerId: 'xy-wing-demo',
    textContainerId: 'xy-wing-step-text',
    givens: [
        0, 4, 5, 6, 0, 7, 8, 9, 0,
        8, 3, 0, 0, 2, 9, 0, 0, 5,
        9, 0, 0, 5, 0, 0, 1, 0, 0,
        4, 1, 0, 0, 0, 0, 2, 5, 0,
        0, 0, 0, 0, 0, 5, 4, 0, 6,
        5, 0, 0, 2, 4, 0, 0, 3, 0,
        6, 0, 0, 8, 0, 0, 0, 0, 0,
        7, 0, 0, 0, 0, 2, 3, 0, 4,
        0, 2, 0, 0, 0, 0, 0, 8, 0
    ],
    steps: [
        { text: "Initial state." },
        {
            active: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 18, 27, 36, 45, 54, 63, 72,
                    13, 22, 31, 37, 38, 39, 40, 41, 42, 43, 44, 49, 58, 67, 76],
            text: "Highlighting rows and columns of interest."
        },
        {
            active: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 18, 27, 36, 45, 54, 63, 72,
                    13, 22, 31, 37, 38, 39, 40, 41, 42, 43, 44, 49, 58, 67, 76],
            highlight: [0, 4, 36],
            lines: [[0, 4], [0, 36]],
            text: "These 3 cells form the 'Y', with 3 as the common value."
        },
        {
            active: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 18, 27, 36, 45, 54, 63, 72,
                    13, 22, 31, 37, 38, 39, 40, 41, 42, 43, 44, 49, 58, 67, 76],
            highlight: [0, 4, 36],
            text: "3 must be either in the top-right or bottom-left."
        },
        {
            active: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 18, 27, 36, 45, 54, 63, 72,
                    13, 22, 31, 37, 38, 39, 40, 41, 42, 43, 44, 49, 58, 67, 76],
            highlight: [0, 4, 36, 40],
            lines: [[0, 4], [0, 36], { from: 4, to: 40, dashed: true }, { from: 36, to: 40, dashed: true }],
            text: "Any cell that can see both cannot be 3."
        },
        {
            active: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 18, 27, 36, 45, 54, 63, 72,
                    13, 22, 31, 37, 38, 39, 40, 41, 42, 43, 44, 49, 58, 67, 76],
            highlight: [0, 4, 36, 40],
            keepCandidates: [
                { idx: 40, values: [1, 7, 8, 9] }
            ],
            text: "Done!"
        }
    ]
});
</script>

Note that xy-wing can be used on boxes too!

<div id="xy-wing-box-demo" class="technique-demo"></div>

<div id="xy-wing-box-step-text" class="technique-step-text"></div>

<script>
SudokuTechniqueDemo.render({
    containerId: 'xy-wing-box-demo',
    textContainerId: 'xy-wing-box-step-text',
    givens: [
        0, 0, 0, 2, 0, 0, 0, 0, 4,
        0, 0, 0, 0, 0, 0, 2, 0, 0,
        0, 0, 0, 0, 7, 0, 0, 0, 0,
        5, 0, 0, 1, 6, 0, 0, 0, 0,
        8, 0, 1, 9, 0, 5, 0, 0, 0,
        0, 0, 6, 0, 8, 3, 0, 0, 0,
        0, 6, 8, 0, 0, 0, 9, 4, 0,
        4, 5, 7, 0, 0, 0, 0, 1, 0,
        9, 1, 0, 0, 0, 0, 0, 0, 5
    ],
    steps: [
        { text: "Initial state." },
        {
            active: [27, 28, 29, 36, 37, 38, 39, 40, 41, 42, 43, 44,
                    45, 46, 47, 48, 49, 50, 51, 52, 53],
            text: "Hightlighting rows and box of interest."
        },
        {
            active: [27, 28, 29, 36, 37, 38, 39, 40, 41, 42, 43, 44,
                    45, 46, 47, 48, 49, 50, 51, 52, 53],
            highlight: [48, 40, 45],
            lines: [[48, 40], [48, 45]],
            text: "These 3 cells form the 'Y', with 2 as the common value."
        },
        {
            active: [27, 28, 29, 36, 37, 38, 39, 40, 41, 42, 43, 44,
                    45, 46, 47, 48, 49, 50, 51, 52, 53],
            highlight: [48, 40, 45],
            lines: [[48, 40], [48, 45]],
            text: "2 must be either in the top-right or bottom-left."
        },
        {
            active: [27, 28, 29, 36, 37, 38, 39, 40, 41, 42, 43, 44,
                    45, 46, 47, 48, 49, 50, 51, 52, 53],
            highlight: [48, 40, 45, 37],
            lines: [[48, 40], [48, 45], { from: 40, to: 37, dashed: true }, { from: 45, to: 37, dashed: true }],
            text: "So any cell that sees both cannot be 2."
        },
        {
            active: [27, 28, 29, 36, 37, 38, 39, 40, 41, 42, 43, 44,
                    45, 46, 47, 48, 49, 50, 51, 52, 53],
            highlight: [48, 40, 45, 37],
            keepCandidates: [
                { idx: 37, values: [3, 4, 7] }
            ],
            text: "Done!"
        }
    ]
});
</script>


## XYZ-wing

As the techniques get more complicated I find it harder to put into words.

The setup is you have a cell with 3 candidates (XYZ) which can see a cell that has XZ and a cell that has YZ. The XZ cell and the YZ cell can't see each other - i.e. the 3 cells are not within a single row/box/column. Anything that can see all 3 cells cannot have Z.

<pre class="sudoku-pattern">
x y z | ... | y z | ...
... | ... | ... | ...
... | ... | <> | x z
... | ... | ... | ...
</pre>

- if the XZ cell is X
    - XYZ cell can be only Y or Z
    - you can apply a naked pair rule to anything that can see the XYZ and YZ cells
- if the XZ cell is Z
    - then anything that can see the XZ cell cannot be Z


<div id="xyz-wing-demo" class="technique-demo"></div>

<div id="xyz-wing-step-text" class="technique-step-text"></div>

<script>
SudokuTechniqueDemo.render({
    containerId: 'xyz-wing-demo',
    textContainerId: 'xyz-wing-step-text',
    givens: [
        5, 3, 0, 0, 4, 0, 1, 6, 0,
        4, 0, 0, 0, 0, 0, 0, 0, 5,
        0, 6, 2, 0, 0, 0, 8, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 4, 6, 1, 0, 8, 0, 3, 9,
        3, 0, 0, 9, 0, 4, 7, 1, 0,
        6, 0, 4, 0, 0, 5, 0, 7, 1,
        0, 9, 0, 4, 0, 7, 6, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    steps: [
        { text: "Initial state." },
        {
            active: [1, 10, 19, 27, 28, 29, 36, 37, 38, 45, 46, 47, 55, 64, 73],
            text: "Highlighting areas of interest."
        },
        {
            active: [1, 10, 19, 27, 28, 29, 36, 37, 38, 45, 46, 47, 55, 64, 73],
            highlight: [46],
            text: "Our XYZ cell (2, 5, 8)."
        },
        {
            active: [1, 10, 19, 27, 28, 29, 36, 37, 38, 45, 46, 47, 55, 64, 73],
            highlight: [46, 47],
            text: "Add our XZ cell (5, 8)."
        },
        {
            active: [1, 10, 19, 27, 28, 29, 36, 37, 38, 45, 46, 47, 55, 64, 73],
            highlight: [46, 47, 55],
            text: "Add our YZ cell (2, 8)."
        },
        {
            active: [1, 10, 19, 27, 28, 29, 36, 37, 38, 45, 46, 47, 55, 64, 73],
            highlight: [46, 47, 55, 28],
            text: "Anything that can see all 3 cells cannot have 8."
        },
        {
            active: [1, 10, 19, 27, 28, 29, 36, 37, 38, 45, 46, 47, 55, 64, 73],
            highlight: [28],
            keepCandidates: [
                { idx: 28, values: [1, 2, 5, 7] }
            ],
            text: "Done!"
        }
    ]
});
</script>