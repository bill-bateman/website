import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import * as d3 from 'd3';

import './WhistlerStatus.css';

const WhistlerStatus = () => {

    const lift_nodes = useMemo(() => [
        //Blackcomb
        {"x":278,"y":273,"lift":"7th Heaven Express"},
        {"x":493,"y":343,"lift":"7th Heaven Express"},
        {"x":240,"y":433,"lift":"Jersey Cream Express"},
        {"x":345,"y":365,"lift":"Jersey Cream Express"},
        {"x":187,"y":286,"lift":"Glacier Express"},
        {"x":232,"y":431,"lift":"Glacier Express"},
        {"x":135,"y":357,"lift":"Crystal Ridge Express"},
        {"x":160,"y":547,"lift":"Crystal Ridge Express"},
        {"x":211,"y":275,"lift":"Showcase T-Bar"},
        {"x":227,"y":230,"lift":"Showcase T-Bar"},
        {"x":282,"y":429,"lift":"Excelerator Express"},
        {"x":324,"y":597,"lift":"Excelerator Express"},
        {"x":358,"y":369,"lift":"Catskinner Express"},
        {"x":449,"y":463,"lift":"Catskinner Express"},
        {"x":517,"y":694,"lift":"Magic Chair"},
        {"x":546,"y":747,"lift":"Magic Chair"},
        {"x":327,"y":601,"lift":"Excalibur Gondola Upper"},
        {"x":541,"y":692,"lift":"Excalibur Gondola Upper"},
        {"x":541,"y":692,"lift":"Excalibur Gondola Lower"},
        {"x":618,"y":759,"lift":"Excalibur Gondola Lower"},
        {"x":352,"y":371,"lift":"Blackcomb Gondola Upper"},
        {"x":410,"y":583,"lift":"Blackcomb Gondola Upper"},
        {"x":410,"y":583,"lift":"Blackcomb Gondola Lower"},
        {"x":519,"y":741,"lift":"Blackcomb Gondola Lower"},
        //Whistler
        {"x":633,"y":752,"lift":"Fitzsimmons Express"},
        {"x":754,"y":594,"lift":"Fitzsimmons Express"},
        {"x":741,"y":596,"lift":"Garbanzo Express"},
        {"x":858,"y":398,"lift":"Garbanzo Express"},
        {"x":874,"y":309,"lift":"Big Red Express"},
        {"x":984,"y":542,"lift":"Big Red Express"},
        {"x":881,"y":306,"lift":"Franz's Chair"},
        {"x":968,"y":438,"lift":"Franz's Chair"},
        {"x":953,"y":352,"lift":"Peak Express"},
        {"x":1050,"y":187,"lift":"Peak Express"},
        {"x":897,"y":289,"lift":"T-Bar"},
        {"x":938,"y":357,"lift":"T-Bar"},
        {"x":669,"y":407,"lift":"Harmony 6 Express"},
        {"x":929,"y":223,"lift":"Harmony 6 Express"},
        {"x":654,"y":328,"lift":"Symphony Express"},
        {"x":855,"y":213,"lift":"Symphony Express"},
        {"x":700,"y":462,"lift":"Emerald 6 Express"},
        {"x":859,"y":322,"lift":"Emerald 6 Express"},
        {"x":672,"y":537,"lift":"Olympic Chair"},
        {"x":695,"y":595,"lift":"Olympic Chair"},
        {"x":986,"y":553,"lift":"Creekside Gondola"},
        {"x":1150,"y":725,"lift":"Creekside Gondola"},
        {"x":725,"y":595,"lift":"Whistler Village Gondola Upper"},
        {"x":869,"y":328,"lift":"Whistler Village Gondola Upper"},
        {"x":640,"y":758,"lift":"Whistler Village Gondola Lower"},
        {"x":725,"y":595,"lift":"Whistler Village Gondola Lower"},
        //Peak 2 Peak
        {"x":352,"y":370,"lift":"PEAK 2 PEAK Gondola"},
        {"x":869,"y":328,"lift":"PEAK 2 PEAK Gondola"},

    ], []);
    const lift_links = useMemo(() => {
        let links = [];
        let last = "";
        for (let i=0; i<lift_nodes.length; ++i) {
            if (lift_nodes[i].lift===last) {
                links.push({
                    "x1":lift_nodes[i-1].x,
                    "y1":lift_nodes[i-1].y,
                    "x2":lift_nodes[i].x,
                    "y2":lift_nodes[i].y,
                    "lift":last,
                });
            }
            last = lift_nodes[i].lift;
        };
        return links;
    }, [lift_nodes]);

    const url = "https://whistler-status.herokuapp.com/";
    // const url = "http://localhost:5000";
    const width = 1300; const height = 800;

    const [data, setData] = useState();
    const lifts_svg = useRef();

    const update_data = useCallback(() => {
        fetch(url, {})
            .then(data => data.json())
            .then(json => setData(json))
            .catch(err => console.log(err));
    }, [setData]);

    useEffect(() => update_data(), [update_data]); //on startup, fetch the data

    const wrap_text = useCallback((text, width) => {
        //see https://bl.ocks.org/mbostock/7555321
        text.each(function() {
            const text = d3.select(this);
            const w = width(text._groups[0][0].__data__);
            const words = text.text().split(/\s+/);
            let line=[], lineNumber=0, lineHeight=-1.1, y=text.attr("y"), dy=parseFloat(text.attr("dy"));
            if (isNaN(dy)) dy=0;
            let tspan = text.text(null).append("tspan").attr("x",0).attr("y",y).attr("dy",dy+"em");
            let word = words.pop();
            while (word) {
                line.push(word);
                tspan.text(line.slice().reverse().join(" "));
                if (tspan.node().getComputedTextLength() > w && line.length>1) {
                    line.pop();
                    tspan.text(line.slice().reverse().join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
                word = words.pop();
            }
        });
    }, []);

    useEffect(() => {
        if (!data) return;

        const lift_name_to_index = {};
        for (let i=0; i<data.Lifts.length; ++i) {
            lift_name_to_index[data.Lifts[i].Name] = i;
        }

        const svg = d3.select("#whistler__svg");

        if (lifts_svg.current === undefined) lifts_svg.current = {
                                                "nodes": svg.selectAll("circle"),
                                                "links": svg.selectAll("path"),
                                                "text": svg.selectAll("text"),
                                            };

        const lift_color = d => {
            if (lift_name_to_index[d.lift]===undefined) console.log(d.lift);
            return data.Lifts[lift_name_to_index[d.lift]].Status==="Open" ? "green" : "grey"
        };

        lifts_svg.current.nodes = lifts_svg.current.nodes
            .data(lift_nodes)
            .join("circle")
                .attr("cx", d=>d.x)
                .attr("cy", d=>d.y)
                .attr("r", 3)
                .attr("fill", d=>lift_color(d));
        
        lifts_svg.current.links = lifts_svg.current.links
            .data(lift_links)
            .join("line")
                .attr("x1", d=>d.x1)
                .attr("y1", d=>d.y1)
                .attr("x2", d=>d.x2)
                .attr("y2", d=>d.y2)
                .attr("stroke", d=>lift_color(d))
                .attr("stroke-width", 2);
        
        lifts_svg.current.text = lifts_svg.current.text
            .data(lift_links.filter(d=>!d.lift.endsWith("Lower")))
            .join("text")
                .attr("transform", d => (
                    `translate(${(d.x1+d.x2)/2},${(d.y1+d.y2)/2})`
                    + `rotate(${Math.atan2(d.y2-d.y1,d.x2-d.x1)*180/Math.PI})`
                    + `translate(0,-5)`))
                .attr("text-anchor", "middle")
                .text(d=>d.lift.replace(" Upper",""))
                .call(wrap_text, d=>Math.sqrt((d.y2-d.y1)**2+(d.x2-d.x1)**2));
        

    }, [data, lift_nodes, lift_links, wrap_text]);

    return <div id="whistler__content">
        <svg id="whistler__svg" width={width} height={height}/>
        {
            data ? data.Date ? 
                <p style={{textAlign:"center"}}>{"Data received at:"}<br />{(new Date(data.Date)).toString()}</p>
                : null : null
        }
    </div>;
}
export default WhistlerStatus;