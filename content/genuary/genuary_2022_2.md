---
title: "Day 2: Dither"
date: "2022-01-04"
post: False
---

Dithering images with [Threshold Halftoning](https://www.it.uu.se/edu/course/homepage/projektTDB/ht10/project2/Report_ht10_02.pdf). Click on each image to show the original. 

<div id="dither"></div>

<script>
const toggleShow = (id1, id2) => () => {
    const e1 = document.getElementById(id1);
    e1.style.display = e1.style.display=="block" ? "none" : "block";

    const e2 = document.getElementById(id2);
    e2.style.display = e2.style.display=="block" ? "none" : "block";
}

function do_dither(id, image_src, width, height, label_text) {
    const hidden = id + "__orig";
    const dithered = id + "__dithered";

    // create html elements
    const d = document.createElement('div');
    const canvas1 = document.createElement('canvas');
    const canvas2 = document.createElement('canvas');
    const p = document.createElement('p');

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

    p.class = "caption";
    p.text = label_text;

    d.appendChild(canvas1);
    d.appendChild(canvas2);
    d.appendChild(p);

    document.getElementById('dither').appendChild(d);

    const DOT_SCREEN = [
        [62, 57, 48, 36, 37, 49, 58, 63],
        [56, 47, 35, 21, 22, 38, 50, 59],
        [46, 34, 20, 10, 11, 23, 39, 51],
        [33, 19, 9, 3, 0, 4, 12, 24],
        [32, 18, 8, 2, 1, 5, 13, 25],
        [45, 31, 17, 7, 6, 14, 26, 40],
        [55, 44, 30, 16, 15, 27, 41, 52],
        [61, 54, 43, 29, 28, 42, 53, 60],
    ];

    const draw_pixel = (bits, x, y) => {
        bits[y*width*4 + x*4 + 0] = 0;
        bits[y*width*4 + x*4 + 1] = 0;
        bits[y*width*4 + x*4 + 2] = 0;
        bits[y*width*4 + x*4 + 3] = 255; //alpha channel
    };

    const fill_dots = (bits, data, x, y) => {
        for (let i=0; i<DOT_SCREEN.length; ++i) {
            for (let j=0; j<DOT_SCREEN[0].length; ++j) {
                const grey = (data[4*x + 4*width*y + 0] + data[4*x + 4*width*y + 1] + data[4*x + 4*width*y + 2])/3;
                if (grey/256 * 64 <= DOT_SCREEN[i][j]) {
                    draw_pixel(bits, x+i, y+j);
                }
            }
        }
    };

    const dither = (src_id) => {
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
    };

    const image = new Image();
    image.src = image_src;
    image.onload = () => {
        document.getElementById(hidden).getContext("2d").drawImage(image, 0, 0, width, height);
        dither(hidden);
    };
}

do_dither("killarney", "/images/killarney.jpeg", 1000, 526, "Killarney, Ontario");
do_dither("chet", "/images/chet.png", 392, 295, "Chet Baker");
do_dither("mountain", "/images/mountain.jpeg", 1528, 278, "BC");
do_dither("olomana", "/images/olomana.jpeg", 1000, 518, "Olomana");
do_dither("demondays", "/images/demon_days.jpeg", 728, 728, "Demon Days by Gorillaz");
do_dither("moodvaliant", "/images/mood_valiant.jpeg", 944, 944, "Mood Valiant by Hiatus Kaiyote");
do_dither("ykwtm", "/images/ykwtm.jpeg", 1200, 1200, "You Know What They Mean by Bent Knee");

</script>