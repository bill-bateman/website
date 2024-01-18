---
date: "2022-01-08"
title: "Day 7: Sol LeWitt Wall Drawing"
post: False
---

<div>
    <canvas id="wall__canvas" width=600 height=600 style="margin-left: 25px" >
</div>

<p class="caption">Based on <a href="https://massmoca.org/event/walldrawing797/">Wall Drawing 797</a>.</p>

<script>
    const width=600;
    const height=600;
    
    const initial_line = (ctx) => {
        ctx.strokeStyle='rgb(0,0,0)';
        let line = [];
        let x=0, y=Math.random()*5+2;

        ctx.beginPath();
        ctx.moveTo(x,y);
        line.push({x,y});
        
        while (x<width) {
            x += 5 + 5*Math.random();
            y += 5 * (Math.random()-0.5);
            y = Math.max(y,10);
            
            ctx.lineTo(x,y);
            line.push({x,y});
        }

        ctx.stroke();
        return line;
    };
    const draft2 = (ctx, prev) => {
        ctx.strokeStyle='rgb(255,0,0)';
        let line = [];

        let x = prev[0].x;
        let y = prev[0].y+3;
        ctx.beginPath();
        ctx.moveTo(x,y);
        line.push({x,y});

        for (let i=1; i<prev.length; ++i) {
            const p2 = prev[i], p1 = prev[i-1];
            
            x += (p2.x-p1.x)*(Math.random()/4 + 6/4);
            x = Math.max(x, p2.x-10);
            x = Math.min(x, p2.x+1);

            y = p2.y + 3 + 3*(Math.random()-0.75);

            ctx.lineTo(x,y);
            line.push({x,y});
        }

        ctx.stroke();
        return line;
    };
    const draft3 = (ctx, prev) => {
        ctx.strokeStyle='#fbf108';
        let line = [];

        let x = prev[0].x;
        let y = prev[0].y+5;
        ctx.beginPath();
        ctx.moveTo(x,y);
        line.push({x,y});

        for (let i=1; i<prev.length; ++i) {
            const p2 = prev[i], p1 = prev[i-1];
            
            x += (p2.x-p1.x);
            y = p2.y+2+5*Math.random();

            ctx.lineTo(x,y);
            line.push({x,y});
        }

        ctx.stroke();
        return line;
    };
    const draft4 = (ctx, prev) => {
        ctx.strokeStyle='rgb(0,0,255)';
        let line = [];

        let x = prev[0].x;
        let y = prev[0].y+5;
        ctx.beginPath();
        ctx.moveTo(x,y);
        line.push({x,y});

        for (let i=1; i<prev.length; ++i) {
            const p2 = prev[i], p1 = prev[i-1];
            
            x += (p2.x-p1.x);
            y += (p2.y-p1.y);

            ctx.lineTo(x,y);
            line.push({x,y});
        }

        ctx.stroke();
        return line;
    };

    const ctx = document.getElementById("wall__canvas").getContext("2d");
    ctx.clearRect(0,0,width,height);
    ctx.fillStyle='rgb(255,255,255)';
    ctx.fillRect(0,0,width,height);

    ctx.lineWidth = 10;

    let line = initial_line(ctx);
    
    while (Math.min(...line.map(l => l.y)) < height+10) {
        line = draft2(ctx, line);
        line = draft3(ctx, line);
        line = draft4(ctx, line);
    }
</script>