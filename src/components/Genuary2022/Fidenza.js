import React, {useCallback, useEffect, useState, useRef} from "react"

const Fidenza = ({id, image_src, width, height}) => {
    const [show, setShow] = useState(true);
    const showRef = useRef(true);

    const toggleShow = useCallback(() => {
        setShow(!showRef.current);
        showRef.current = !showRef.current;
    }, [setShow]);

    const orig = id + "_orig_canvas";
    const grad = id + "_grad_canvas";

    const draw = useCallback((src_id) => {
        const xy_to_i = (x,y) => {
            return Math.floor(x) + Math.floor(y)*width;
        }
        const draw_curve = (ctx, img, angles, sx, sy, num_steps, resolution, num_columns, step_length) => {
            let x = sx, y=sy;
            ctx.beginPath();
            ctx.moveTo(sx, sy);

            let r=0;
            let g=0;
            let b=0;
            
            for (let i=0; i<num_steps; ++i) {
                const ii = xy_to_i(x,y)*4;
                if (ii>=0 && ii<img.data.length) {
                    r += img.data[ii] / num_steps;
                    g += img.data[ii+1] / num_steps;
                    b += img.data[ii+2] / num_steps;
                }

                const xi = Math.floor(x / resolution);
                const yi = Math.floor(y / resolution);
                const theta = angles[yi*num_columns + xi];
                x += step_length * Math.cos(theta);
                y += step_length * Math.sin(theta);
                ctx.lineTo(x,y);
            }
            r = Math.floor(r);
            g = Math.floor(g);
            b = Math.floor(b);
            ctx.strokeStyle = `rgb(${r},${g},${b})`;
            ctx.stroke();
        };

        const img = document.getElementById(src_id).getContext("2d").getImageData(0, 0, width, height);

        let resolution = Math.ceil(width * 0.5/100);
        if (resolution%2!==0) resolution+=1;
        const num_columns = Math.ceil(width/resolution);
        const num_rows = Math.ceil(height/resolution);

        const pos_x = num_columns/2, neg_x = num_columns/2;
        const pos_y = num_rows/4, neg_y = 3*num_rows/4;

        const angles = new Float32Array(num_columns * num_rows);
        for (let x=0; x<num_columns; ++x) {
            for (let y=0; y<num_rows; ++y) {                
                //go away from positive, towards negative
                const dpx = x-pos_x, dpy = y-pos_y;
                const dp2 = dpx*dpx + dpy*dpy;
                const dnx = x-neg_x, dny = y-neg_y;
                const dn2 = dnx*dnx + dny*dny;
                
                const fx = dpx / Math.pow(dp2, 1.5) - dnx / Math.pow(dn2, 1.5);
                const fy = dpy / Math.pow(dp2, 1.5) - dny / Math.pow(dn2, 1.5);

                angles[y*num_columns + x] = Math.atan2(fy, fx);
            }
        }

        const ctx = document.getElementById(grad).getContext("2d");
        ctx.clearRect(0,0,width,height);
        ctx.fillStyle="rgb(255,255,255)";
        ctx.fillRect(0,0,width,height);
        ctx.fillStyle="rgba(0,0,0,0.1)";
        const d = 10;
        for (let i=0; i<10000; ++i) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            draw_curve(ctx, img, angles, x, y, 5, resolution, num_columns, resolution);
        }

        // const img2 = new ImageData(bits, width);
        // const ctx = document.getElementById(grad).getContext("2d");
        // ctx.clearRect(0,0,width,height);
    }, [width, height, grad]);

    useEffect(() => {
        const image = new Image();
        image.src = image_src;
        image.onload = () => {
            document.getElementById(orig).getContext("2d").drawImage(image, 0, 0, width, height);
            draw(orig);
        };
    }, [image_src, width, height, draw, orig]);

    return <div>
        <canvas onClick={toggleShow} id={orig} width={width} height={height} style={{marginLeft: -(width-650)/2+"px", display: show ? "none" : "block"}}  />
        <canvas onClick={toggleShow} id={grad} width={width} height={height} style={{marginLeft: -(width-650)/2+"px", display: !show ? "none" : "block"}} />
    </div>
}
export default Fidenza;