---
date: "2022-01-13"
title: "Day 11: 'No' Computer"
post: False
---

<div>
    <canvas id="nomatrix__canvas" width="600px" height="600px"></canvas>
</div>

<p class="caption">Computer says no.</p>
<p class="caption">Based on the matrix code from <a href="https://medium.com/@twineworks/fun-with-html-canvas-build-the-matrix-c87c4bb12487">Slawomir Chodnicki</a>.</p>

<script>
    const width = 600;
    const height = 600;

    const canvas = document.getElementById("nomatrix__canvas");
    const ctx = canvas.getContext("2d");

    const fontHeight = 14;
    const fontFamily = "Meiryo, monospace";

    const spawnInterval = 500;
    const density = 0.9;

    const moveScale = 0.012;

    const speedBase = 1.0;
    const speedDeviation = 0.4;
    const streaks = 1.9;

    const brightRatio = 0.1;

    let count=1;
    const getGlyph = (first) => {
        ++count; if (count>1) count=0;
        return {
            glyph: (count%2===0) ? "N" : "O",
            bright: Math.random() < brightRatio,
        };
    };

    const makeUniverse = (size) => {
        let out=[];
        for (let i=0; i<size; ++i) {
            out.push(getGlyph());
        }
        return out;
    }
    const universe = makeUniverse(1000);

    const w=+width, h=+height;
    const charSize = ctx.measureText("N");
    const colWidth = charSize.width * 1.15, charHeight = fontHeight * 1.15;
    const charsOnCol = Math.ceil(h / charHeight), colsPerLine = Math.ceil(w / colWidth);
    
    const makeTrail = (col, maxSpeed=null, headAt=null) => {
        let speed = speedBase + (Math.random() * speedDeviation*2 - speedDeviation);
        if (maxSpeed>0 && speed>maxSpeed) speed=maxSpeed;
        if (headAt===null) headAt = -Math.floor(Math.random()*2*charsOnCol);
        return {
            col,
            offset: Math.random()-0.5,
            size: Math.random()*fontHeight,
            universeAt: Math.floor(Math.random()*universe.length),
            headAt, speed,
            length: Math.floor(Math.random()*streaks*charsOnCol)+8,
        }
    };

    const trails = [];
    const rgb = "#008000";
    const rgbBright = "#20E020";
    const rgbHead = ["#F0FFF0", "#D0F0D0", "#80C080", "#40B040"];
    const rgbTail = ["#000500", "#003000", "#005000", "#007000"];

    const drawTrail = (trail) => {
        const head = Math.round(trail.headAt);
        if (head<0) return; //hasn't entered screen

        const x = trail.col * colWidth + trail.offset;
        let y = head*charHeight + charHeight*0.9;
        ctx.font = trail.size + "px " + fontFamily;
        for (let i=0; i<trail.length; ++i, y-=(trail.size * 1.15)) {
            if (y<0) break; //beyond top?
            if (y>h+charHeight) continue; //beyond bottom

            let idx=(trail.universeAt + head - i) % universe.length;
            if (idx<0) idx += universe.length;
            const item = universe[idx];
            if (item===undefined) console.log(item, idx);
            if (i<rgbHead.length) {
                ctx.fillStyle = rgbHead[i];
            } else if (trail.length-i-1 < rgbTail.length) {
                ctx.fillStyle = rgbTail[trail.length-i-1];
            } else {
                if (item.bright) ctx.fillStyle = rgbBright;
                else ctx.fillStyle = rgb;
            }

            let glyph = item.glyph;
            // let glyph = "O";
            // if (i===trail.length-1 || y-charHeight<0) glyph="N";
            ctx.fillText(glyph, x, y);
        }
    };
    const moveTrails = (distance) => {
        const trailsToRemove=[];
        const count = trails.length;
        for (let i=0; i<count; ++i) {
            const trail = trails[i];
            trail.headAt += trail.speed*distance;
            const tip = trail.headAt - trail.length;
            if (tip*charHeight > h) trailsToRemove.push(i);
        }
        while (trailsToRemove.length>0) trails.splice(trailsToRemove.pop(), 1);
    };

    const spawnTrails = () => {
        // find topmost trail on each column
        const topTrailPerCol = [];
        for (let i = 0; i < trails.length; i++) {
            const trail = trails[i];
            const trailTop = trail.headAt - trail.length;
            const top = topTrailPerCol[trail.col];
            if (!top || top.headAt - top.length > trailTop) {
                topTrailPerCol[trail.col] = trail;
            }
        }
    
        // spawn new trails
        for (let i = 0; i < colsPerLine; i++) {
            let spawnProbability = 0.0;
            let maxSpeed = null;
            let headAt = null;
    
            if (!topTrailPerCol[i]) {
                // column has no trail at all
                // we'll try and add one
                // this most commonly happens at the beginning of the animation
                // when few trails have spawned yet
                spawnProbability = 1.0;
            } else {
                // column has a trail
                const topTrail = topTrailPerCol[i];
                const tip = Math.round(topTrail.headAt) - topTrail.length;
                if (tip > 0) {
                    // if trail's top tip is on screen
                    // we might spawn another one
                    // probability rises the further down the tip is
                    const emptySpaceRatio = tip / charsOnCol;
                    spawnProbability = emptySpaceRatio;
                    // heuristic limiting speed of new trail chasint the existing one
                    //  we don't want the chasing trail to catch up
                    maxSpeed = topTrail.speed * (1 + emptySpaceRatio);
                    // we'll spawn the follow up at the top of the screen
                    headAt = 0;
                }
            }
    
            // scale the probabilities by density
            const effectiveP = spawnProbability * density;
    
            // spawn?
            const p = Math.random();
    
            if (p < effectiveP) {
                trails.push(makeTrail(i, maxSpeed, headAt));
            }
        }
    };

    let prevTime;
    let spawnCollect = 0;

    const tick = (time) => {
        if (prevTime===undefined) prevTime = time;
        let elapsed = time - prevTime;
        prevTime = time;

        moveTrails(elapsed * moveScale);

        spawnCollect += elapsed;
        while (spawnCollect > spawnInterval) {
            spawnCollect -= spawnInterval;
            spawnTrails();
        }

        ctx.fillStyle='black';
        ctx.fillRect(0,0,w,h);

        const count = trails.length;
        for (var i = 0; i < count; i++) {
            const trail = trails[i];
            drawTrail(trail);
        }

        requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
</script>