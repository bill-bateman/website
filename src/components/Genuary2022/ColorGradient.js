import React, {useEffect, useMemo} from "react";

const ColorGradient = () => {
    const d=useMemo(() => 600, []);

    useEffect(() => {
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
    }, [d]);

    return <div>
        <canvas id="color__gradient" width={d} height={d} style={{marginLeft: -(d-650)/2+"px"}} />
    </div>
}
export default ColorGradient;