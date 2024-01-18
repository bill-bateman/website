---
title: "Day 14: Something You'd Never Make"
date: "2022-01-19"
post: False
---

<div>
    <canvas id="mushroom__canvas" width="600px" height="600px" style="margin-left: 25px" />
</div>

<p class="caption">Started with Jerobeam Fenderson's <a href="https://www.youtube.com/watch?v=rtR63-ecUNo">oscilloscope mushrooms</a>, but ended up with this.</p>

<script>
    const d = 600;
    const ctx = document.getElementById("mushroom__canvas").getContext("2d");

    ctx.clearRect(0,0,d,d);
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0,0,d,d);

    const ms = 50;
    const f = 3;
    const sf = 30, ms2 = 150/sf;
    const sawtooth = (t) => (
        (t>sf) ? sawtooth(t-2*sf) : t
    );
    const t_end = 10*2*Math.PI;
    const y_func = (t) => 0.5*d+ms*Math.sin(f*t)-ms2*sawtooth(t);
    const x_func = (t) => d/2+ms*Math.cos(f*t)*Math.sin(sf*2.1*t);

    ctx.strokeStyle = 'rgb(0,255,0)';
    ctx.beginPath();
    ctx.moveTo(x_func(0), y_func(0));
    
    for (let t=0; t<t_end; t+=0.1) {
        if (sawtooth(t)>sawtooth(t-0.1)) {
            ctx.lineTo(x_func(t), y_func(t));
            ctx.stroke();
        }
        if (sawtooth(t+0.1)>sawtooth(t)) {
            ctx.beginPath();
            ctx.moveTo(x_func(t), y_func(t));
        }
    }
    ctx.stroke();
</script>