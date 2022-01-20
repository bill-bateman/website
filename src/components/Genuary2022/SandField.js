import React, {useCallback, useEffect} from "react"

const SandField = ({id, width, height}) => {
    const grad = id + "_grad_canvas";

    const draw = useCallback(() => {
        const draw_curve = (ctx, angles, sx, sy, num_steps, resolution, num_columns, step_length) => {
            let x = sx, y=sy;            
            const colors = ['#f6d2ac','#e6ae74','#d6834f','#a35233','#42281c'];
            ctx.strokeStyle = colors[Math.floor(Math.random()*colors.length)];

            let x1,x2,x3,x4,y1,y2,y3,y4;
            const w = 2 + Math.random()*num_steps/2;
            
            for (let i=0; i<num_steps; ++i) {
                const xi = Math.floor(x / resolution);
                const yi = Math.floor(y / resolution);
                const theta = angles[yi*num_columns + xi];

                if (x1===undefined) x1=x + w*Math.cos(theta-Math.PI/2);
                if (x2===undefined) x2=x + w*Math.cos(theta+Math.PI/2);
                if (y1===undefined) y1=y + w*Math.sin(theta-Math.PI/2);
                if (y2===undefined) y2=y + w*Math.sin(theta+Math.PI/2);

                x += step_length * Math.cos(theta);
                y += step_length * Math.sin(theta);
                
                x3=x + w*Math.cos(theta+Math.PI/2);
                x4=x + w*Math.cos(theta-Math.PI/2);
                y3=y + w*Math.sin(theta+Math.PI/2);
                y4=y + w*Math.sin(theta-Math.PI/2);

                if (isNaN(x1) || isNaN(x2) || isNaN(x3) || isNaN(x4) || isNaN(y1) || isNaN(y2) || isNaN(y3) || isNaN(y4)) break;

                ctx.beginPath();
                ctx.moveTo(x1,y1);
                ctx.lineTo(x4,y4);
                ctx.stroke();

                x1=x4; x2=x3;
                y1=y4; y2=y3;
            }
        };

        let resolution = Math.ceil(width * 0.5/100);
        if (resolution%2!==0) resolution+=1;
        const num_columns = Math.ceil(width/resolution);
        const num_rows = Math.ceil(height/resolution);

        const pos_points = [
            [num_columns/2, -num_rows/4],
            [num_columns/4, -num_rows/4],
        ];
        const neg_points = [
            [2.3*num_columns/2, 3*num_rows/4],
            [0.2*num_columns/2, 4.4*num_rows/4],
        ];

        const angles = new Float32Array(num_columns * num_rows);
        for (let x=0; x<num_columns; ++x) {
            for (let y=0; y<num_rows; ++y) {                
                //go away from positive, towards negative
                let fx=0, fy=0;

                for (let i=0; i<pos_points.length; ++i) {
                    const dpx = x-pos_points[i][0], dpy = y-pos_points[i][1];
                    const dp2 = dpx*dpx + dpy*dpy;

                    fx += dpx / Math.pow(dp2, 1.5);
                    fy += dpy / Math.pow(dp2, 1.5);
                }
                for (let i=0; i<neg_points.length; ++i) {
                    const dnx = x-neg_points[i][0], dny = y-neg_points[i][1];
                    const dn2 = dnx*dnx + dny*dny;

                    fx -= dnx / Math.pow(dn2, 1.5);
                    fy -= dny / Math.pow(dn2, 1.5);
                }

                angles[y*num_columns + x] = Math.atan2(fy, fx);
            }
        }

        const ctx = document.getElementById(grad).getContext("2d");
        ctx.clearRect(0,0,width,height);
        ctx.fillStyle="rgb(255,255,255)";
        ctx.fillRect(0,0,width,height);
        ctx.fillStyle="rgba(0,0,0,0.1)";
        for (let i=0; i<20000; ++i) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            draw_curve(ctx, angles, x, y, 2+Math.random()*15, resolution, num_columns, resolution);
        }

    }, [width, height, grad]);

    useEffect(() => {
        draw();
    }, [width, height, draw]);

    return <div>
        <canvas id={grad} width={width} height={height} style={{marginLeft: -(width-650)/2+"px"}} />
    </div>
}
export default SandField;