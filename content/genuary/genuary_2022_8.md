---
date: "2022-01-08"
title: "Day 8: Single Curve"
post: False
---

<SingleCurve width="600" height="600" />
<div>
    <canvas id="curve__canvas" width="600" height="600" style="margin-left: 25px" >
</div>

<script>
    const width = 600;
    const height = 600;

    const ctx = document.getElementById("curve__canvas").getContext("2d");
    ctx.clearRect(0,0,width,height);
    ctx.fillStyle='rgb(255,255,255)';
    ctx.fillRect(0,0,width,height);

    ctx.strokeStyle='#3d6597';

    let x=width/4, y=Number(height);
    let dx=-width/8, dy=-height/8;
    const ratio=0.86;

    ctx.moveTo(x,y);
    while (true) {
        x+=dx; y+=dy;
        ctx.lineTo(x,y);
        dx*=-ratio; dy*=ratio;
        if (dy>-1) break;
    }

    ctx.moveTo(x,y);
    const mx = x+width/2;
    const hx=width/2/16, hy=height/2/32;

    const vs = [
        [x+hx,y-hy],
        [x+2*hx,y-1.5*hy],
        [x+3*hx,y-1*hy],
        [x+4*hx,y-1.5*hy],
        [x+5*hx,y-2*hy],
        [x+6*hx,y-2*hy],
        [x+7*hx,y-2.5*hy],
        [x+8*hx,y-3*hy],
        [x+9*hx,y-2.5*hy],
        [x+10*hx,y-3*hy],
        [x+11*hx,y-2*hy],
        [x+12*hx,y-0*hy],
        [x+13*hx,y-2.5*hy],
        [x+14*hx,y-2*hy],
        [x+15*hx,y-1*hy],
        [mx,y],
    ]

    for (const v of vs) ctx.lineTo(v[0],v[1]);
    
    x = mx;
    ctx.moveTo(x,y);
    while (true) {
        x+=dx; y-=dy;
        ctx.bezierCurveTo(x,y,x,y,mx,y-dy/2);
        dx/=-ratio; dy/=ratio;
        if (dy<=-height/8) break;
    }

    ctx.stroke();
</script>