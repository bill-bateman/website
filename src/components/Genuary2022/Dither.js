import React, {useCallback, useEffect, useMemo, useState, useRef} from "react"

const Dither = ({id, canvas_src, image_src, width, height}) => {
    const [show, setShow] = useState(true);
    const showRef = useRef(true);

    const toggleShow = useCallback(() => {
        setShow(!showRef.current);
        showRef.current = !showRef.current;
    }, [setShow]);

    const hidden = id + "_hidden_canvas";
    const dithered = id + "_dithered_canvas";
    const DOT_SCREEN = useMemo(() => ([
        [62, 57, 48, 36, 37, 49, 58, 63],
        [56, 47, 35, 21, 22, 38, 50, 59],
        [46, 34, 20, 10, 11, 23, 39, 51],
        [33, 19, 9, 3, 0, 4, 12, 24],
        [32, 18, 8, 2, 1, 5, 13, 25],
        [45, 31, 17, 7, 6, 14, 26, 40],
        [55, 44, 30, 16, 15, 27, 41, 52],
        [61, 54, 43, 29, 28, 42, 53, 60],
    ]), []);

    const draw_pixel = useCallback((bits, x, y) => {
        bits[y*width*4 + x*4 + 0] = 0;
        bits[y*width*4 + x*4 + 1] = 0;
        bits[y*width*4 + x*4 + 2] = 0;
        bits[y*width*4 + x*4 + 3] = 255; //alpha channel
    }, [width]);

    const fill_dots = useCallback((bits, data, x, y) => {
        for (let i=0; i<DOT_SCREEN.length; ++i) {
            for (let j=0; j<DOT_SCREEN[0].length; ++j) {
                const grey = (data[4*x + 4*width*y + 0] + data[4*x + 4*width*y + 1] + data[4*x + 4*width*y + 2])/3;
                if (grey/256 * 64 <= DOT_SCREEN[i][j]) {
                    draw_pixel(bits, x+i, y+j);
                }
            }
        }
    }, [width, draw_pixel, DOT_SCREEN]);

    const dither = useCallback((src_id) => {
        const img = document.getElementById(src_id).getContext("2d").getImageData(0, 0, width, height);
        const bits = new Uint8ClampedArray(img.data.length);

        const d=8;
        let y = 0;
        let x = 0
        for (let i=0; i<img.data.length; i+=4*d) {
            if ((i/4)%width === 0 || (i/4+d/2)%width === 0) {
                i+=(4*width*(d-1)); //skip a row
                y += d;
                if ((y/d) % 2 === 0) {x = d/2;i+=d*4/2;} //slightly mis-align
                else x = 0;
            }

            fill_dots(bits, img.data, x, y);

            x += d;
        }

        const img2 = new ImageData(bits, width);
        const ctx = document.getElementById(dithered).getContext("2d");
        ctx.clearRect(0,0,width,height);
        ctx.putImageData(img2, 0,0);
    }, [width, height, dithered, fill_dots]);

    useEffect(() => {
        if (image_src) {
            const image = new Image();
            image.src = image_src;
            image.onload = () => {
                document.getElementById(hidden).getContext("2d").drawImage(image, 0, 0, width, height);
                dither(hidden);
            };
        } else if (canvas_src) {
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
            sleep(1000).then(() => {
                console.log(canvas_src);
                dither(canvas_src)
            });
            // dither(canvas_src);
        }
    }, [canvas_src, image_src, width, height, dither, hidden]);

    return <div onClick={toggleShow}>
        <canvas id={hidden} width={width} height={height} style={{marginLeft: -(width-650)/2+"px", display: show ? "none" : "block"}}  />
        <canvas id={dithered} width={width} height={height} style={{marginLeft: -(width-650)/2+"px", display: !show ? "none" : "block"}} />
    </div>
}
export default Dither;