---
date: "2022-01-09"
title: "Day 9: Architecture"
post: False
---

<div>
    <input type="checkbox" id="adder__a" name="a" checked onChange="draw()" />
    <input type="checkbox" id="adder__b" name="b" onChange="draw()" />
    <input type="checkbox" id="adder__c" name="c" checked onChange="draw()" />
    <canvas id="adder__canvas" width=600 height=600 style="margin-left: 25px" >
</div>

<p class="caption">A full adder, a basic component of computer architecture.</p>

<p class="caption">Each inner node is a NAND gate.</p>

<script>
    const width = 600;
    const height = 600;

    const draw = () => {
        const a_val = document.getElementById('adder__a').checked;
        const b_val = document.getElementById('adder__b').checked;
        const c_val = document.getElementById('adder__c').checked;

        const color_on = 'black';
        const color_off = 'grey';

        const nand = (ctx, in1, in2, x, y) => {
            ctx.fillStyle = in1.val ? color_on : color_off;
            ctx.strokeStyle = in1.val ? color_on : color_off;
            ctx.beginPath();
            ctx.moveTo(in1.x, in1.y);
            ctx.lineTo(x,y);
            ctx.stroke();

            ctx.fillStyle = in2.val ? color_on : color_off;
            ctx.strokeStyle = in2.val ? color_on : color_off;
            ctx.beginPath();
            ctx.moveTo(in2.x, in2.y);
            ctx.lineTo(x,y);
            ctx.stroke();

            const val = !(in1.val && in2.val);
            ctx.fillStyle = val ? color_on : color_off;
            ctx.strokeStyle = val ? color_on : color_off;
            ctx.beginPath();
            ctx.arc(x,y,5,0,2*Math.PI);
            ctx.fill();
            ctx.stroke();           

            return {val,x,y};
        }
        const start = (node) => {
            ctx.fillStyle = node.val ? color_on : color_off;
            ctx.strokeStyle = node.val ? color_on : color_off;
            ctx.beginPath();
            ctx.arc(node.x,node.y,5,0,2*Math.PI);
            ctx.fill();
            ctx.stroke();
        };
        const terminal = (node, in1) => {
            ctx.fillStyle = node.val ? color_on : color_off;
            ctx.strokeStyle = node.val ? color_on : color_off;
            ctx.beginPath();
            ctx.arc(node.x,node.y,5,0,2*Math.PI);
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(in1.x, in1.y);
            ctx.lineTo(node.x,node.y);
            ctx.stroke();
        }

        const ctx = document.getElementById("adder__canvas").getContext("2d");
        ctx.clearRect(0,0,width,height);
        ctx.fillStyle='rgb(255,255,255)';
        ctx.fillRect(0,0,width,height);

        ctx.fillStyle='rgb(0,0,0)';
        const a = {val:a_val, x:1*width/9, y:1.5*height/5};
        const b = {val:b_val, x:1*width/9, y:2.5*height/5};
        const c = {val:c_val, x:1*width/9, y:3.5*height/5};

        start(a);
        start(b);
        start(c);

        const n1 = nand(ctx, a, b, 2*width/9, 2*height/5);
        const n2 = nand(ctx, a, n1, 3*width/9, 1*height/5);
        const n3 = nand(ctx, b, n1, 3*width/9, 3*height/5);
        const n4 = nand(ctx, n2, n3, 4*width/9, 2*height/5);
        const n5 = nand(ctx, n4, c, 5*width/9, 2*height/5);
        const n6 = nand(ctx, n4, n5, 6*width/9, 1*height/5);
        const n7 = nand(ctx, n5, c, 6*width/9, 3*height/5);
        const n8 = nand(ctx, n6, n7, 7*width/9, 2*height/5);
        const n9 = nand(ctx, n1, n5, 7*width/9, 3*height/5);

        const out1 = {val:n8.val, x:8*width/9, y:2*height/5};
        const out2 = {val:n9.val, x:8*width/9, y:3*height/5};
        terminal(out1, n8);
        terminal(out2, n9);
    }

    draw();
</script>