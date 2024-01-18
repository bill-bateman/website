---
title: "Day 17: 3 Colors"
date: "2022-01-24"
post: False
---

Fallen pretty far behind the daily prompt by now, but I'll take my time and finish up in Feb. I've really been enjoying messing with image data and getting different looks on pictures I've taken.

<div id="three_color"></div>

<script>
const toggleShow = (id1, id2) => () => {
    const e1 = document.getElementById(id1);
    e1.style.display = e1.style.display=="block" ? "none" : "block";

    const e2 = document.getElementById(id2);
    e2.style.display = e2.style.display=="block" ? "none" : "block";
}

const ThreeColors = (id, image_src, width, height) => {
    
    const hidden = id + "_hidden_canvas";
    const dithered = id + "_dithered_canvas";

    ///make html elements
    const d = document.createElement('div');
    const canvas1 = document.createElement('canvas');
    const canvas2 = document.createElement('canvas');

    canvas1.id = hidden;
    canvas1.width = width;
    canvas1.height = height;
    canvas1.style.marginLeft = -(width-650)/2 + "px";
    canvas1.style.display = "none";
    canvas1.onclick = toggleShow(hidden, dithered);

    canvas2.id = dithered;
    canvas2.width = width;
    canvas2.height = height;
    canvas2.style.marginLeft = -(width-650)/2 + "px";
    canvas2.style.display = "block";
    canvas2.onclick = toggleShow(hidden, dithered);

    d.appendChild(canvas1);
    d.appendChild(canvas2);
    d.appendChild(document.createElement('br'));

    document.getElementById('three_color').appendChild(d);

    const colorify = (src_id) => {
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
    };

    const image = new Image();
    image.src = image_src;
    image.onload = () => {
        document.getElementById(hidden).getContext("2d").drawImage(image, 0, 0, width, height);
        colorify(hidden);
    };
}

ThreeColors("killarney", "/images/killarney.png", 1000, 526);
ThreeColors("mountain", "/images/mountain.jpeg", 1528, 278);
ThreeColors("olomana", "/images/olomana.png", 1000, 518);

</script>