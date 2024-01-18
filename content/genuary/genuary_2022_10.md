---
date: "2022-01-11"
title: "Day 10: Machine Learning (Wrong Answers Only)"
post: False
---

<div id="ml__parent"></div>

<p class="caption">Based on the famous result by <a href="https://cds.nyu.edu/adversarial-attacks-poster/">Huang, et. al.</a></p>

<p class="caption">Using <a href="https://p5js.org/">p5.js</a> and <a href="https://www.npmjs.com/package/scribble-fork">scribble-fork</a>.</p>

<script src="https://cdn.jsdelivr.net/npm/p5@1.9.0/lib/p5.js"></script>
<script src="/static/p5.scribble.js"></script>

<script>
    const width=600;
    const height=300;
    let scribble = undefined;

    let d = true;
    const rdim = width/4.1;
    const font_size = 32;

    function setup() {
        let canvas = createCanvas(width, height);
        canvas.parent("ml__parent");
        scribble = new Scribble();
        background(255);

        d = false;
        fill(0);
        stroke(0);

        //plus
        scribble.scribbleLine(width/2-0.75*0.9*rdim, height/2,
                                width/2-0.75*1.1*rdim, height/2);
        scribble.scribbleLine(width/2-0.75*rdim, height/2+0.1*rdim,
                                width/2-0.75*rdim, height/2-0.1*rdim);
        
        //equals
        scribble.scribbleLine(width/2+0.75*0.9*rdim, height/2+0.05*rdim,
                                width/2+0.75*1.1*rdim, height/2+0.05*rdim);
        scribble.scribbleLine(width/2+0.75*0.9*rdim, height/2-0.05*rdim,
                                width/2+0.75*1.1*rdim, height/2-0.05*rdim);
        
        //text
        textSize(font_size);
        textStyle(ITALIC);
        fill(0);
        textAlign(CENTER, CENTER);
        text("Panda", width/2-1.5*rdim,height/2+rdim/2+font_size);
        text("Nematode", width/2,height/2+rdim/2+font_size);
        text("Gibbon", width/2+1.5*rdim,height/2+rdim/2+font_size);

        //panda x2
        function panda(x, y) {
            //eye spots
            const n=32;
            fill(0);
            scribble.scribbleEllipse(x-10, y+rdim/n, 15,15);
            scribble.scribbleEllipse(x+10, y+rdim/n, 15,15);

            //pupils
            fill(255);
            scribble.scribbleEllipse(x-10, y+2+rdim/n, 5, 5);
            scribble.scribbleEllipse(x+10, y+2+rdim/n, 5, 5);

            fill(0,0);
            //head
            scribble.scribbleEllipse(x, y, rdim/2, rdim/2);
            //mouth
            scribble.scribbleEllipse(x, y+10+rdim/n, 3, 3);
            scribble.scribbleCurve(
                x, y+10+rdim/n+3,
                x-10, y+10+rdim/n+3,
                x, y+10+rdim/n+13,
                x-10, y+10+rdim/n+5,
            )
            scribble.scribbleCurve(
                x, y+10+rdim/n+3,
                x+10, y+10+rdim/n+3,
                x, y+10+rdim/n+13,
                x+10, y+10+rdim/n+5,
            )
            //ear
            fill(0);
            const start = 15*Math.PI/180, e=60*Math.PI/180;
            scribble.scribbleCurve(
                x+rdim/4*Math.cos(start), y-rdim/4*Math.sin(start),
                x+rdim/4*Math.cos(e), y-rdim/4*Math.sin(e),
                x+rdim/4*Math.cos(start)+20, y-rdim/4*Math.sin(start)-5,
                x+rdim/4*Math.cos(e)+20, y-rdim/4*Math.sin(e)-15,
            )
            scribble.scribbleCurve(
                x-rdim/4*Math.cos(start), y-rdim/4*Math.sin(start),
                x-rdim/4*Math.cos(e), y-rdim/4*Math.sin(e),
                x-rdim/4*Math.cos(start)-20, y-rdim/4*Math.sin(start)-5,
                x-rdim/4*Math.cos(e)-20, y-rdim/4*Math.sin(e)-15,
            )
        }
        panda(width/2-1.5*rdim, height/2);
        panda(width/2+1.5*rdim, height/2);

        //nematode (random pixels)
        for (let i=0; i<rdim-4; ++i) {
            for (let j=0; j<rdim-4; ++j) {
                stroke(255*Math.random(), 255*Math.random(), 255*Math.random());
                rect(width/2-rdim/2+2+i, height/2-rdim/2+2+j, 1, 1);
            }
        }

        //boxes
        fill(0);
        stroke(0);
        scribble.scribbleRect(width/2-1.5*rdim, height/2, rdim, rdim);
        scribble.scribbleRect(width/2, height/2, rdim, rdim);
        scribble.scribbleRect(width/2+1.5*rdim, height/2, rdim, rdim);
    }

    function draw() {}
</script>