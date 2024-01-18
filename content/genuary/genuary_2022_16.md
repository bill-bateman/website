---
title: "Day 16: Color Gradients Gone Wrong"
date: "2022-01-19"
post: False
---

<div>
    <canvas id="color__gradient" width="600px" height="600px" style="margin-left: 25px" />
</div>

<script>
    const d = 600;
    const ctx = document.getElementById("color__gradient").getContext("2d");

    ctx.clearRect(0,0,d,d);
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0,0,d,d);

    const colors = [
        '#000000',
        '#660000',
        '#990022',
        '#ff0033',
    ]
    for (let i=0; i<20000; ++i) {
        const x=Math.random()*d, y=Math.random()*d;
        const i = Math.random()*x*x/d/y + Math.random()*3*y*y/d/x;
        ctx.fillStyle = colors[Math.floor(i) % colors.length];
        ctx.fillRect(x,y,1+Math.random()*2,5+Math.random()*25);
    }
</script>