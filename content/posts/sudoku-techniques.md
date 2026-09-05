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
