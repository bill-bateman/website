---
date: "2022-01-13"
title: "Day 12: Circle Packing"
post: False
---

<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>

<script>
const svgId = "killarney__svg";
const canvasId = "killarney__canvas";
const imgId = "killarney__img";
const num_circles = 1000;
const image_src = "";
const size = 600;

const get_data = (dir) => ({
    value:1,
    key:'circle-1',
    children: Array.from(
        Array(num_circles),
        (_,i)=>({
            "value":dir ? Math.min(5+num_circles-i,5+i) : 5+num_circles-i,
            "key":`circle${i}`
        })
    )
});

function circle_pack() {
    let data = get_data(true);
    const ctx = document.getElementById(canvasId).getContext("2d");
    ctx.drawImage(document.getElementById(imgId), 0, 0, size, size);
    const img = ctx.getImageData(0, 0, size, size);
    
    const root = d3.hierarchy(data);
    root.sum(d => d.value);//.sort((a, b) => dir ? a.value-b.value : b.value-a.value);
    
    d3.pack()
        .size([size*0.95, size*0.95])
        .padding(0)
        (root);
    
    const svg = d3.select(`#${svgId}`);
    const t = svg.transition().duration(1500);

    const circle_to_color = (d) => {
        const i = 4*(Math.floor(d.y)*size + Math.floor(d.x));
        if (d.depth===0) return 'none';
        return `rgb(${img.data[i]},${img.data[i+1]},${img.data[i+2]})`;
    }

    svg.selectAll("circle")
        .data(root, d=>d.data.key)
        .join(
            enter => enter.append("circle")
                .attr("cx",d=>d.x)
                .attr("cy",d=>d.y)
                .attr("transform", `translate(${size*0.025},${size*0.025})`)
                .attr("fill", circle_to_color)
                .attr("stroke", d => d.depth===0 ? "none" : "none")
                .attr("id",d=>d.data.key),
            update => update,
            exit => exit,
        )
        .call(c => c.transition(t)
            .attr("r", d => d.depth===0 ? d.r*1.03 : 2*d.r));
    
    data = get_data(false);
};
</script>

<div>
    <svg id="killarney__svg" width="600px" height="600px"></svg>
    <img id="killarney__img" src="/images/killarney.jpeg" width="600px" height="600px" style="display: none;" onload="circle_pack()" />
    <canvas id="killarney__canvas" width="600px" height="600px" style="display: none;"></canvas>
</div>

<p class="caption">Circle packing using <a href="https://github.com/d3/d3-hierarchy#pack">d3 pack</a>.</p>
