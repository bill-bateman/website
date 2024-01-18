---
date: "2022-01-07"
title: "Day 6: Borrow a Style (Catenza)"
post: False
---

Copying @interphx's [cat-Fidenza](https://twitter.com/interphx/status/1478357511774343177).

<div>
    <canvas id="catenza__id" width=600 height=600 style="margin-left: 25px">
</div>

Also the collision detection on the cats isn't quite right, so sometimes the cats will overlap.

<script>
    //based on @interphx's cat-fidenza
    //https://twitter.com/interphx/status/1478357511774343177

    const canvas_id = "catenza__id";
    const width = 600;
    const height = 600;        

    const draw = () => {
        const RECTS = [];
        const test_collide = (r1,r2) => {
            const z=20;
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
        const draw_curve = (ctx, angles, sx, sy, num_steps, resolution, num_columns, step_length) => {
            let x = sx, y=sy;

            let x1,x2,x3,x4,y1,y2,y3,y4;
            const w = 25;
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
                tmp_rects.push(this_rect);

                x1=x4; x2=x3;
                y1=y4; y2=y3;
            }

            if (tmp_rects.length > 20) {
                //enforce minimum length
                
                let r, theta;
                ctx.strokeStyle = `rgb(255,255,255)`;
                ctx.fillStyle = `rgb(255,255,255)`;         

                //going down the cat
                ctx.beginPath();
                for (let i=0; i<tmp_rects.length; ++i) {
                    const rect = tmp_rects[i];
                    if (i===0) ctx.moveTo(rect.x1,rect.y1);
                    else ctx.lineTo(rect.x1,rect.y1);
                }
                ctx.lineTo(tmp_rects[tmp_rects.length-1].x4,tmp_rects[tmp_rects.length-1].y4)

                //rounded tail
                r = tmp_rects[tmp_rects.length-1];
                theta = Math.atan2(r.y4-r.y3,r.x4-r.x3);
                // ctx.beginPath();
                ctx.arc(
                    (r.x3+r.x4)/2,
                    (r.y3+r.y4)/2,
                    Math.sqrt(((r.x4-r.x3)**2+(r.y4-r.y3)**2))/2,
                    theta, theta+Math.PI, false
                );

                //going back up the cat
                for (let i=tmp_rects.length-1; i>=0; --i) {
                    const rect = tmp_rects[i];
                    ctx.lineTo(rect.x3,rect.y3);
                }
                ctx.lineTo(tmp_rects[0].x2,tmp_rects[0].y2);

                //cute head
                x1 = r.x4; x2 = r.x3;
                y1 = r.y4; y2 = r.y3;
                x4 = r.x4 - w/4 * Math.sin(theta);
                x3 = r.x3 - w/4 * Math.sin(theta);
                y4 = r.y4 + w/4 * Math.cos(theta);
                y3 = r.y3 + w/4 * Math.cos(theta);
                tmp_rects.push({
                    x1,x2,x3,x4,y1,y2,y3,y4,
                    xmax: Math.max(x1,x2,x3,x4), xmin: Math.min(x1,x2,x3,x4),
                    ymax: Math.max(y1,y2,y3,y4), ymin: Math.min(y1,y2,y3,y4),
                })
                r = tmp_rects[0];
                theta = Math.atan2(r.y2-r.y1,r.x2-r.x1);

                ctx.lineTo(
                    r.x1 + 5*w/3 * Math.cos(theta) - w * Math.sin(theta),
                    r.y1 + 5*w/3 * Math.sin(theta) + w * Math.cos(theta),
                )
                ctx.lineTo(
                    r.x1 + 4*w/3 * Math.cos(theta) - w/2 * Math.sin(theta),
                    r.y1 + 4*w/3 * Math.sin(theta) + w/2 * Math.cos(theta),
                )
                ctx.lineTo(
                    r.x1 + 2*w/3 * Math.cos(theta) - w/2 * Math.sin(theta),
                    r.y1 + 2*w/3 * Math.sin(theta) + w/2 * Math.cos(theta),
                )
                ctx.lineTo(
                    r.x1 + w/3 * Math.cos(theta) - w * Math.sin(theta),
                    r.y1 + w/3 * Math.sin(theta) + w * Math.cos(theta),
                )

                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                //top of head           
                // ctx.beginPath();
                // ctx.arc(
                //     r.x1 + w * Math.cos(theta) + w/4 * Math.sin(theta),
                //     r.y1 + w * Math.sin(theta) - w/4 * Math.cos(theta),
                //     w*7/8,
                //     theta + Math.PI*120/180, theta + Math.PI * 60/180, true
                // )
                // ctx.stroke();
                // ctx.fill();     

                //cute face (eyes and nose and mouth)
                ctx.strokeStyle = `rgb(0,0,0)`;
                ctx.fillStyle = `rgb(0,0,0)`;

                ctx.beginPath();
                ctx.arc(
                    r.x1 + 2*w/3 * Math.cos(theta) - w/4 * Math.sin(theta),
                    r.y1 + 2*w/3 * Math.sin(theta) + w/4 * Math.cos(theta),
                    Math.max(1,w/10), 0, 2*Math.PI
                );
                ctx.fill();

                ctx.beginPath();
                ctx.arc(
                    r.x1 + 4*w/3 * Math.cos(theta) - w/4 * Math.sin(theta),
                    r.y1 + 4*w/3 * Math.sin(theta) + w/4 * Math.cos(theta),
                    Math.max(1,w/10), 0, 2*Math.PI
                );
                ctx.fill();

                ctx.beginPath();
                ctx.arc(
                    r.x1 + 3*w/3 * Math.cos(theta) - 0 * Math.sin(theta),
                    r.y1 + 3*w/3 * Math.sin(theta) + 0 * Math.cos(theta),
                    Math.max(1,w/20), 0, 2*Math.PI
                );
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(
                    r.x1 + 3*w/3 * Math.cos(theta) - 0 * Math.sin(theta),
                    r.y1 + 3*w/3 * Math.sin(theta) + 0 * Math.cos(theta),
                );
                ctx.lineTo(
                    r.x1 + 3.1*w/3 * Math.cos(theta) + w/16 * Math.sin(theta),
                    r.y1 + 3.1*w/3 * Math.sin(theta) - w/16 * Math.cos(theta),
                );
                ctx.lineTo(
                    r.x1 + 3.2*w/3 * Math.cos(theta) + 1.3*w/16 * Math.sin(theta),
                    r.y1 + 3.2*w/3 * Math.sin(theta) - 1.3*w/16 * Math.cos(theta),
                );
                ctx.lineTo(
                    r.x1 + 3.3*w/3 * Math.cos(theta) + 1.4*w/16 * Math.sin(theta),
                    r.y1 + 3.3*w/3 * Math.sin(theta) - 1.4*w/16 * Math.cos(theta),
                );
                ctx.lineTo(
                    r.x1 + 3.4*w/3 * Math.cos(theta) + 1.5*w/16 * Math.sin(theta),
                    r.y1 + 3.4*w/3 * Math.sin(theta) - 1.5*w/16 * Math.cos(theta),
                );
                ctx.lineTo(
                    r.x1 + 3.5*w/3 * Math.cos(theta) + 1.2*w/16 * Math.sin(theta),
                    r.y1 + 3.5*w/3 * Math.sin(theta) - 1.2*w/16 * Math.cos(theta),
                );
                ctx.lineTo(
                    r.x1 + 3.6*w/3 * Math.cos(theta) + 0.7*w/16 * Math.sin(theta),
                    r.y1 + 3.6*w/3 * Math.sin(theta) - 0.7*w/16 * Math.cos(theta),
                );
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(
                    r.x1 + 3*w/3 * Math.cos(theta) - 0 * Math.sin(theta),
                    r.y1 + 3*w/3 * Math.sin(theta) + 0 * Math.cos(theta),
                );
                ctx.lineTo(
                    r.x1 + 2.9*w/3 * Math.cos(theta) + w/16 * Math.sin(theta),
                    r.y1 + 2.9*w/3 * Math.sin(theta) - w/16 * Math.cos(theta),
                );
                ctx.lineTo(
                    r.x1 + 2.8*w/3 * Math.cos(theta) + 1.3*w/16 * Math.sin(theta),
                    r.y1 + 2.8*w/3 * Math.sin(theta) - 1.3*w/16 * Math.cos(theta),
                );
                ctx.lineTo(
                    r.x1 + 2.7*w/3 * Math.cos(theta) + 1.4*w/16 * Math.sin(theta),
                    r.y1 + 2.7*w/3 * Math.sin(theta) - 1.4*w/16 * Math.cos(theta),
                );
                ctx.lineTo(
                    r.x1 + 2.6*w/3 * Math.cos(theta) + 1.5*w/16 * Math.sin(theta),
                    r.y1 + 2.6*w/3 * Math.sin(theta) - 1.5*w/16 * Math.cos(theta),
                );
                ctx.lineTo(
                    r.x1 + 2.5*w/3 * Math.cos(theta) + 1.2*w/16 * Math.sin(theta),
                    r.y1 + 2.5*w/3 * Math.sin(theta) - 1.2*w/16 * Math.cos(theta),
                );
                ctx.lineTo(
                    r.x1 + 2.4*w/3 * Math.cos(theta) + 0.7*w/16 * Math.sin(theta),
                    r.y1 + 2.4*w/3 * Math.sin(theta) - 0.7*w/16 * Math.cos(theta),
                );
                ctx.stroke();

                x4 = r.x1; x3 = r.x2;
                y4 = r.y1; y3 = r.y1;
                x1 = r.x1 - w/4 * Math.sin(theta);
                x2 = r.x2 - w/4 * Math.sin(theta);
                y1 = r.y1 + w/4 * Math.cos(theta);
                y2 = r.y2 + w/4 * Math.cos(theta);
                tmp_rects.push({
                    x1,x2,x3,x4,y1,y2,y3,y4,
                    xmax: Math.max(x1,x2,x3,x4), xmin: Math.min(x1,x2,x3,x4),
                    ymax: Math.max(y1,y2,y3,y4), ymin: Math.min(y1,y2,y3,y4),
                })

                //for bounds checking
                RECTS.push(...tmp_rects);
            }
        };

        let resolution = Math.ceil(width * 0.5/100);
        if (resolution%2!==0) resolution+=1;
        const num_columns = Math.ceil(width/resolution);
        const num_rows = Math.ceil(height/resolution);

        const pos_x = -num_columns/2, neg_x = num_columns/2;
        const pos_y = num_rows/4, neg_y = 4.1*num_rows/4;

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

        const ctx = document.getElementById(canvas_id).getContext("2d");
        ctx.clearRect(0,0,width,height);
        ctx.fillStyle="rgb(0,0,0)";
        ctx.fillRect(0,0,width,height);
        for (let i=0; i<50; ++i) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            draw_curve(ctx, angles, x, y, 50+Math.random()*5, resolution, num_columns, resolution);
        }
    };

    draw();
</script>