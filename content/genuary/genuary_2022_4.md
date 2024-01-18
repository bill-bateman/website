---
title: "Day 4: Image Fidenza"
date: "2022-01-06"
post: False
---

[Fidenza](https://tylerxhobbs.com/fidenza)-like visualization using flow fields based on electrical fields and grabbing the color from an underlying image.
Click on each image for the original.

<div id="fidenza"></div>

<script>
const toggleShow = (id1, id2) => () => {
    const e1 = document.getElementById(id1);
    e1.style.display = e1.style.display=="block" ? "none" : "block";

    const e2 = document.getElementById(id2);
    e2.style.display = e2.style.display=="block" ? "none" : "block";
}

const do_fidenza = (id, image_src, width, height, label_text) => {
    const orig = id + "_orig_canvas";
    const grad = id + "_grad_canvas";

    ///make html elements
    const d = document.createElement('div');
    const canvas1 = document.createElement('canvas');
    const canvas2 = document.createElement('canvas');
    const p = document.createElement('p');

    canvas1.id = orig;
    canvas1.width = width;
    canvas1.height = height;
    canvas1.style.marginLeft = -(width-650)/2 + "px";
    canvas1.style.display = "none";
    canvas1.onclick = toggleShow(orig, grad);

    canvas2.id = grad;
    canvas2.width = width;
    canvas2.height = height;
    canvas2.style.marginLeft = -(width-650)/2 + "px";
    canvas2.style.display = "block";
    canvas2.onclick = toggleShow(orig, grad);

    p.class = "caption";
    p.text = label_text;

    d.appendChild(canvas1);
    d.appendChild(canvas2);
    d.appendChild(p);

    document.getElementById('fidenza').appendChild(d);

    const draw = (src_id) => {
        const RECTS = [];
        const xy_to_i = (x,y) => {
            return Math.floor(x) + Math.floor(y)*width;
        }
        const test_collide = (r1,r2) => {
            const z=1;
            const ineq_test = (amin,amax,bmin,bmax) => (
                (amin-bmax<z && amin-bmin>-z) ||
                (bmin-amax<z && bmin-amin>-z)
            );
            const project_min_max = (mx,my,r) => {
                let min,max,dot;
                min = r.x1*mx + r.y1*my;
                max = min;

                dot = r.x2*mx + r.y2*my;
                if (dot>max) max=dot;
                if (dot<min) min=dot;

                dot = r.x3*mx + r.y3*my;
                if (dot>max) max=dot;
                if (dot<min) min=dot;

                dot = r.x4*mx + r.y4*my;
                if (dot>max) max=dot;
                if (dot<min) min=dot;

                return [min,max];
            }
            const sat_test = (m,r1,r2) => {
                const [mx,my] = m;
                const [amin,amax] = project_min_max(mx,my,r1);
                const [bmin,bmax] = project_min_max(mx,my,r2);
                return ineq_test(amin,amax,bmin,bmax);
            }
            const get_slope = (r,a) => {
                let mx,my;
                if (a===1) {
                    mx = r.x1-r.x2;
                    my = r.y1-r.y2;
                } else {
                    mx = r.x1-r.x4;
                    my = r.y1-r.y4;
                }
                mx = mx / (mx*mx + my*my);
                my = my / (mx*mx + my*my);
                return [mx,my];
            }
            //first, cheap but quick comparison
            if (ineq_test(r1.xmin,r1.xmax,r2.xmin,r2.xmax)) {
                if (ineq_test(r1.ymin,r1.ymax,r2.ymin,r2.ymax)) {
                    //next, SAT (separating axis theorem)
                    //each rect has 2 axis we need to check
                    //from p1->p2 and from p1->p4
                    if (!sat_test(get_slope(r1,1),r1,r2)) return false;
                    if (!sat_test(get_slope(r1,2),r1,r2)) return false;
                    if (!sat_test(get_slope(r2,1),r1,r2)) return false;
                    if (!sat_test(get_slope(r2,2),r1,r2)) return false;
                    //there is no line we can draw between the objects
                    //i.e. we collide
                    return true;
                }
            }
            return false;
        };
        const draw_curve = (ctx, img, angles, sx, sy, num_steps, resolution, num_columns, step_length) => {
            let x = sx, y=sy;
            let r=0, g=0, b=0;
            
            for (let i=0; i<num_steps; ++i) {
                const ii = xy_to_i(x,y)*4;
                if (ii>=0 && ii<img.data.length) {
                    r += img.data[ii] / num_steps;
                    g += img.data[ii+1] / num_steps;
                    b += img.data[ii+2] / num_steps;
                }
            }
            r = Math.floor(r);
            g = Math.floor(g);
            b = Math.floor(b);
            ctx.strokeStyle = `rgb(${r},${g},${b})`;
            ctx.fillStyle = `rgb(${r},${g},${b})`;

            let x1,x2,x3,x4,y1,y2,y3,y4;
            const w = 2 + Math.random()*num_steps/2;
            const tmp_rects = [];
            
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

                const xmin = Math.floor(Math.min(x1,x2,x3,x4)), xmax = Math.floor(Math.max(x1,x2,x3,x4));
                const ymin = Math.floor(Math.min(y1,y2,y3,y4)), ymax = Math.floor(Math.max(y1,y2,y3,y4));
                const this_rect = {x1,y1,x2,y2,x3,y3,x4,y4,xmin,xmax,ymin,ymax};

                let collision=false;
                for (const rect of RECTS) {
                    if (test_collide(this_rect, rect)) {
                        collision=true; break;
                    }
                }
                if (collision) break;

                ctx.beginPath();
                ctx.moveTo(x1,y1);
                ctx.lineTo(x2,y2);
                ctx.lineTo(x3,y3);
                ctx.lineTo(x4,y4);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                tmp_rects.push(this_rect);

                x1=x4; x2=x3;
                y1=y4; y2=y3;
            }

            RECTS.push(...tmp_rects);
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
        for (let i=0; i<5000; ++i) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            draw_curve(ctx, img, angles, x, y, 2+Math.random()*5, resolution, num_columns, resolution);
        }

        // const img2 = new ImageData(bits, width);
        // const ctx = document.getElementById(grad).getContext("2d");
        // ctx.clearRect(0,0,width,height);
    };

    const image = new Image();
    image.src = image_src;
    image.onload = () => {
        document.getElementById(orig).getContext("2d").drawImage(image, 0, 0, width, height);
        draw(orig);
    };
}

do_fidenza("killarney", "/images/killarney.png", 800, 400, "Killarney, Ontario");
do_fidenza("chet", "/images/chet.png", 392, 295, "Chet Baker");
do_fidenza("mountain", "/images/mountain.jpeg", 1528, 278, "BC");
do_fidenza("demondays", "/images/demon_days.jpeg", 728, 728, "Demon Days by Gorillaz");
do_fidenza("ykwtm", "/images/ykwtm.jpeg", 400, 400, "You Know What They Mean by Bent Knee");

</script>