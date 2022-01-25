import React, {useCallback, useEffect, useState, useRef} from "react"

const ThreeColors = ({id, canvas_src, image_src, width, height}) => {
    const [show, setShow] = useState(true);
    const showRef = useRef(true);

    const toggleShow = useCallback(() => {
        setShow(!showRef.current);
        showRef.current = !showRef.current;
    }, [setShow]);

    const hidden = id + "_hidden_canvas";
    const dithered = id + "_dithered_canvas";

    const colorify = useCallback((src_id) => {
        const img = document.getElementById(src_id).getContext("2d").getImageData(0, 0, width, height);
        const bits = new Uint8ClampedArray(img.data.length);

        const red_color = [0,0,0,0], green_color = [0,0,0,0], blue_color = [0,0,0,0];

        for (let x=0; x<width; ++x) {
            for (let y=0; y<height; ++y) {
                const i = 4*x + 4*width*y;
                let r = img.data[i], g = img.data[i+1], b = img.data[i+2];
                
                if (r>g && r>b) {
                    red_color[0]+=r; red_color[1]+=g; red_color[2]+=b; red_color[3]+=1;
                } else if (b>g) {
                    green_color[0]+=r; green_color[1]+=g; green_color[2]+=b; green_color[3]+=1;
                } else {
                    blue_color[0]+=r; blue_color[1]+=g; blue_color[2]+=b; blue_color[3]+=1;
                }
            }
        }

        for (let x=0; x<width; ++x) {
            for (let y=0; y<height; ++y) {
                const i = 4*x + 4*width*y;
                let r = img.data[i], g = img.data[i+1], b = img.data[i+2];
                                
                if (r>g && r>b) {
                    r=red_color[0]/red_color[3]; g=red_color[1]/red_color[3]; b=red_color[2]/red_color[3];
                } else if (b>g) {
                    r=green_color[0]/green_color[3]; g=green_color[1]/green_color[3]; b=green_color[2]/green_color[3];
                } else {
                    r=blue_color[0]/blue_color[3]; g=blue_color[1]/blue_color[3]; b=blue_color[2]/blue_color[3];
                }

                bits[i + 0] = r;
                bits[i + 1] = g;
                bits[i + 2] = b;
                bits[i + 3] = 255; //alpha channel
            }
        }

        const img2 = new ImageData(bits, width);
        const ctx = document.getElementById(dithered).getContext("2d");
        ctx.clearRect(0,0,width,height);
        ctx.putImageData(img2, 0,0);
    }, [width, height, dithered]);

    useEffect(() => {
        if (image_src) {
            const image = new Image();
            image.src = image_src;
            image.onload = () => {
                document.getElementById(hidden).getContext("2d").drawImage(image, 0, 0, width, height);
                colorify(hidden);
            };
        } else if (canvas_src) {
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
            sleep(1000).then(() => {
                console.log(canvas_src);
                colorify(canvas_src)
            });
        }
    }, [canvas_src, image_src, width, height, colorify, hidden]);

    return <div>
        <canvas onClick={toggleShow} id={hidden} width={width} height={height} style={{marginLeft: -(width-650)/2+"px", display: show ? "none" : "block"}}  />
        <canvas onClick={toggleShow} id={dithered} width={width} height={height} style={{marginLeft: -(width-650)/2+"px", display: !show ? "none" : "block"}} />
    </div>
}
export default ThreeColors;