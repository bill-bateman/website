import React, {useEffect} from "react";

const Square = ({dim}) => {

    useEffect(() => {
        const ctx = document.getElementById("squarecanvas").getContext("2d");

        //clear
        ctx.clearRect(0,0,dim,dim);
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillRect(0,0,dim,dim);

        //square to destroy
        ctx.strokeStyle = 'rgb(255,255,255)';
        ctx.beginPath();
        ctx.moveTo(dim/4,dim/4);
        ctx.lineTo(3*dim/4,dim/4);
        ctx.lineTo(3*dim/4,3*dim/4);
        ctx.lineTo((7/8)*dim/2+dim/4,3*dim/4);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(dim/4,dim/4);
        ctx.lineTo(dim/4,3*dim/4);
        ctx.lineTo((5/8)*dim/2+dim/4,3*dim/4);
        ctx.stroke();

        //draw lines randomly
        const numlines=1000;
        let x, y, mx, dx, dy, r;
        const alpha = 0.1;

        const COLORS = [ //ROYGBIV
            {r:255,g:0,b:0},
            {r:255,g:165,b:0},
            {r:255,g:255,b:0},
            {r:0,g:128,b:0},
            {r:0,g:0,b:255},
            {r:75,g:0,b:130},
            {r:238,g:130,b:238},
        ]
        const rainbow = (rand, a) => {
            const cnum = rand*6;
            const c1 = COLORS[Math.floor(cnum)];
            console.log(cnum);
            const c2 = COLORS[Math.ceil(cnum)];
            const m1 = Math.ceil(cnum) - cnum;
            const m2 = cnum - Math.floor(cnum);

            const r = c1.r*m1 + c2.r*m2;
            const g = c1.g*m1 + c2.g*m2;
            const b = c1.b*m1 + c2.b*m2;

            return `rgba(${r},${g},${b},${a})`;
        };

        for (let i=0; i<numlines; ++i) {
            x = 5/8*dim;
            y=0; mx=0;
            ctx.beginPath();
            ctx.moveTo(x,y);

            dy = dim/4;
            dx = mx * dy;
            y += dy; x += dx;
            ctx.lineTo(x,y);

            dy = dim/2;
            r = Math.random();
            mx = (r - 0.5) / 4;
            dx = mx * dy;
            y += dy; x += dx;
            ctx.lineTo(x,y);

            dy = dim/4;
            mx *= 1.5;
            dx = mx * dy;
            y += dy; x += dx;
            ctx.lineTo(x,y);

            const grad = ctx.createLinearGradient(5/8*dim,0,x,dim);
            grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
            grad.addColorStop(0.25, `rgba(255,255,255,${alpha})`);
            grad.addColorStop(0.75, rainbow(r,alpha));
            grad.addColorStop(1, rainbow(r,alpha));
            ctx.strokeStyle = grad;

            ctx.stroke();
        }
    }, [dim]);

    return <canvas id="squarecanvas" width={dim+"px"} height={dim+"px"} style={{marginLeft: -(dim-650)/2+"px"}} />
}
export default Square;