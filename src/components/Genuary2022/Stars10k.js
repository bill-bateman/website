import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

// import './WhistlerStatus.css';

const Stars10k = () => {

    const WIDTH = 600;
    const HEIGHT = 600;
    const DIM = WIDTH/23;

    const MTN_VERTICES = [
        [0, HEIGHT],
        [0, HEIGHT-10],
        [2*DIM, HEIGHT-15],
        [3*DIM, HEIGHT-17],
        [5*DIM, HEIGHT-20],
        [7*DIM, HEIGHT-40],
        [9*DIM, HEIGHT-40],
        [10*DIM, HEIGHT-50],
        [10.9*DIM, HEIGHT-50],
        [11*DIM, HEIGHT-52],
        [11*DIM, HEIGHT-70],
        [11.15*DIM, HEIGHT-75],
        [11.45*DIM, HEIGHT-77],
        [11.5*DIM, HEIGHT-80],
        [11.6*DIM, HEIGHT-78],
        [11.75*DIM, HEIGHT-80],
        [11.9*DIM, HEIGHT-73],
        [12*DIM, HEIGHT-70],
        [12.15*DIM, HEIGHT-45],
        [12.3*DIM, HEIGHT-50],
        [12.5*DIM, HEIGHT-45],
        [13*DIM, HEIGHT-45],
        [13.5*DIM, HEIGHT-30],
        [14*DIM, HEIGHT-30],
        [14.25*DIM, HEIGHT-35],
        [16*DIM, HEIGHT-25],
        [16.25*DIM, HEIGHT-30],
        [19*DIM, HEIGHT-20],
        [19.25*DIM, HEIGHT-25],
        [20*DIM, HEIGHT-18],
        [21*DIM, HEIGHT-18],
        [22*DIM, HEIGHT-10],
        [WIDTH, HEIGHT-10],
        [WIDTH, HEIGHT],
    ];

    class ContLine {
        constructor(ctx) {
            this.ctx = ctx;
        };
        init(x,y) {
            this.x = x; this.y = y;
            this.ctx.beginPath();
            this.ctx.moveTo(x,y);
        };
        point(x,y) {
            this.ctx.lineTo(this.x, this.y, x, y);
            this.x = x; this.y = y;
        };
        draw() {
            this.ctx.stroke();
        };
    };

    const randn_bm = () => {
        //see https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
        let u = 0, v = 0;
        while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
        while(v === 0) v = Math.random();
        let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
        num = num / 10.0 + 0.5; // Translate to 0 -> 1
        if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
        return num;
    }

    const test_occlude = (x,y) => {
        //don't show star if it would be behind the mountain
        //using Jordan Curve Theorem
        //see http://jeffreythompson.org/collision-detection/poly-point.php
        let collision = false;
        for (let i=0; i<MTN_VERTICES.length; ++i) {
            const x1=MTN_VERTICES[i][0], y1=MTN_VERTICES[i][1];
            const next = (i+1>=MTN_VERTICES.length) ? 0 : i+1;
            const x2=MTN_VERTICES[next][0], y2=MTN_VERTICES[next][1];
            if (
              ((y1 >= y && y2 < y) || (y1 < y && y2 >= y)) &&
              (x < (x2-x1) * (y-y1) / (y2-y1) + x1)
            ) {
              collision = !collision;
            }
        }
        return collision;
    };

    const draw_ground = (ctx) => {
        ctx.strokeStyle = 'rgb(255,255,255)';
        ctx.globalAlpha = 0.6;
        const line_drawer = new ContLine(ctx);
        line_drawer.init(MTN_VERTICES[0][0], MTN_VERTICES[0][1]);
        for (let i=1; i<MTN_VERTICES.length; ++i) {
            line_drawer.point(MTN_VERTICES[i][0], MTN_VERTICES[i][1]);
        }
        line_drawer.draw();
    };

    const draw_star = (ctx,x,y) => {
        ctx.fillRect(x,y,1,1);
    };

    const draw_stars = (ctx) => {
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.globalAlpha = 0.6;
        for (let i=0; i<5000; ++i) {
            const x = Math.floor(Math.random() * WIDTH);
            const y = Math.floor(Math.random() * HEIGHT);
            if (!test_occlude(x,y)) draw_star(ctx, x,y);
            else --i;
        }
        for (let i=0; i<5000; ++i) {
            let w = WIDTH;
            let y = Math.random();
            w = w*(y/2+0.5);
            const skew = (1-y)*50;
            const x = Math.floor(randn_bm() * w + WIDTH/2-w/2)+skew;
            y = Math.floor(y * HEIGHT);
            if (!test_occlude(x,y)) draw_star(ctx, x,y);
            else --i;
        }
    };

    useEffect(() => {
        //draw once
        const c = document.getElementById("stars10k__canvas");
        const ctx = c.getContext("2d");
        
        //black background
        ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
        ctx.fillStyle = 'rgba(0,0,0,1.0)';
        ctx.fillRect(0,0,c.clientWidth,c.clientHeight);

        draw_stars(ctx);
        draw_ground(ctx);
        
    }, []);

    return <canvas id="stars10k__canvas" width={WIDTH} height={HEIGHT} />
}
export default Stars10k;