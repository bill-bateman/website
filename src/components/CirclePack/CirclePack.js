import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import * as d3 from 'd3';

import './CirclePack.css';

const CirclePack = () => {

    const size = 500;
    const init_count = 50;

    const [num_circles, set_num_circles] = useState(init_count);
    const [scale_circles, set_scale_circles] = useState(false);
    const scaleCircleRef = useRef(false);
    const circles = useRef();

    const data = useMemo(() => 
        ({value:1,key:'circle-1',children: Array.from(Array(num_circles), (_,i)=>({"value":5+(scale_circles ? i : 0),"key":`circle${i}`}))}),
        [num_circles, scale_circles]);

    const toggleScaleCircles = useCallback(() => {
        set_scale_circles(!scaleCircleRef.current);
        scaleCircleRef.current = !scaleCircleRef.current;
    }, [set_scale_circles]);

    useEffect(() => { //redo layout and update svg
        const root = d3.hierarchy(data);
        root.sum(d => d.value).sort();
        
        d3.pack()
            .size([size, size])
            .padding(3)
            (root);

        const svg = d3.select("#svg");
        const t = svg.transition().duration(750);

        if (circles.current === undefined) {
            circles.current = svg.selectAll("circle");
        }

        const tweenFactory = function(elem, d, is_x) {
            const oldx = Number(elem.getAttribute("cx"));
            const oldy = Number(elem.getAttribute("cy"));
            if (isNaN(oldx) || isNaN(oldy)) {
                return function(_) {
                    return is_x ? d.x : d.y;
                }
            }

            const old_r = ((oldx-size/2)**2 + (oldy-size/2)**2)**0.5;
            const new_r = ((d.x-size/2)**2 + (d.y-size/2)**2)**0.5;
            const old_theta = Math.atan2(oldy-size/2, oldx-size/2);
            let new_theta = Math.atan2(d.y-size/2,  d.x-size/2);
            
            //we want to rotate in the direction that makes us move the least
            const d1 = Math.abs(new_theta - old_theta);
            const d2 = Math.abs((new_theta + 2*Math.PI) - old_theta);
            const d3 = Math.abs((new_theta - 2*Math.PI) - old_theta);
            if (d2<=d1 && d2<=d3) new_theta += 2*Math.PI;
            else if (d3<d2 && d3<=d1) new_theta -= 2*Math.PI;
            

            return function(t) {
                const r = old_r * (1-t) + new_r * t;
                const theta = old_theta*(1-t) + new_theta*t;
                return r * (is_x ? Math.cos(theta) : Math.sin(theta)) + size/2;
            }
        }

        const tweenFactoryX = function(d) {
            return tweenFactory(this, d, true);
        }
        const tweenFactoryY = function(d) {
            return tweenFactory(this, d, false);
        }

        circles.current = circles.current.data(root, d=>d.data.key)
            .join(
                enter => enter.append("circle")
                    .attr("cx",d=>d.x)
                    .attr("cy",d=>d.y)
                    .attr("id",d=>d.data.key),
                update => update,
                exit => exit.call(c => c.transition(t).remove()
                    .attr("cy",d=>d.y-size)
                    .attr("fill-opacity",0)
                    .attr("stroke-opacity",0))
            )
                .call(c => c.transition(t)
                    .attrTween("cx",tweenFactoryX)
                    .attrTween("cy",tweenFactoryY)
                    .attr("fill", d => d.children ? '#fff' : '#666')
                    .attr("fill-opacity", d => d.children ? null : 1)
                    .attr("stroke", d => d.children ? '#bbb' : '#000')
                    .attr("r", d => d.r));
    }, [data]);

    const addCircle = () => {set_num_circles(num_circles+1)};
    const resetCount = () => {set_num_circles(init_count)};

    return <div className="CirclePack__content">
        <svg id="svg" width={size} height={size} />
        <div className="CirclePack__buttons">
            <button onClick={addCircle}>Add Circle</button>
            <button onClick={resetCount}>Reset Count</button>
            <button onClick={toggleScaleCircles}>Toggle Circle Scale</button>
        </div>
    </div>;
};
export default CirclePack;