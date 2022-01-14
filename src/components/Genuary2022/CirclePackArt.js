import React, {useEffect, useMemo, useState} from "react";
import * as d3 from 'd3';

const NoComputer = ({id, size, image_src}) => {
    const svgId = useMemo(() => id+"__svg", [id]);
    const canvasId = useMemo(() => id+"__canvas", [id]);
    const num_circles = useMemo(() => 1000, []);

    const [dir, setDir] = useState(true);

    const data = useMemo(() => 
        ({value:1,key:'circle-1',children: Array.from(Array(num_circles), (_,i)=>({"value":dir ? Math.min(5+num_circles-i,5+i) : 5+num_circles-i,"key":`circle${i}`}))}),
        [num_circles, dir]);

    // const data = useMemo(() => 
    //     ({value:1,key:'circle-1',children: Array.from(Array(num_circles), (_,i)=>({"value":dir ? 5+i : 5+i,"key":`circle${i}`}))}),
    //     [num_circles, dir]);

    useEffect(() => {
        const image = new Image();
        image.src = image_src;
        image.onload = () => {
            const ctx = document.getElementById(canvasId).getContext("2d");
            ctx.drawImage(image, 0, 0, size, size);
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
            
            setDir(false);
        };

        
    }, [size, svgId, canvasId, data, image_src, dir, setDir]);

    return <div>
        <svg id={svgId} width={size} height={size} />
        <canvas id={canvasId} width={size} height={size} style={{display: "none"}} />
    </div>;
};
export default NoComputer;