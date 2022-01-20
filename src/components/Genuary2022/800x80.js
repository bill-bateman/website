import React, {useEffect, useMemo} from "react";
import GlslCanvas from "glslCanvas";

const EightHundredByEighty = () => {
    const canvasId = useMemo(() => "800x80__canvas", []);

    useEffect(() => {
        //adapted from @patriciogv's code: see https://thebookofshaders.com/10/
        const shader = `
precision mediump float;

uniform vec2 u_myresolution;
uniform float u_time;

float random(in vec2 pos) {
    return fract(sin(dot(pos.xy, vec2(12.9898,78.233)))*43758.5453123);
}

vec2 truchetPattern(in vec2 pos, in float i) {
    i = fract(((i-0.5)*2.0));
    if (i>0.75) {
        pos = vec2(1.0) - pos;
    } else if (i>0.5) {
        pos = vec2(1.0-pos.x,pos.y);
    } else if (i>0.25) {
        pos = vec2(pos.x,1.0-pos.y);
    }
    return pos;
}

void main() {
    vec2 pos = gl_FragCoord.xy / u_myresolution.xy;
    // pos.x = pos.x*(9.95 + random(vec2(pos.x,u_time))*0.05);
    // pos.y = pos.y*(9.95 + random(vec2(pos.y,u_time))*0.05);
    pos *= 10.0;
    pos.x += u_time*3.0;
    
    vec2 ipos = floor(pos);
    vec2 fpos = fract(pos);
    vec2 tile = truchetPattern(fpos, random(ipos));

    float color = 0.0;

    // Maze
    color = smoothstep(tile.x-0.3,tile.x,tile.y)-
            smoothstep(tile.x,tile.x+0.3,tile.y);

    // Circles
    color = (step(length(tile),0.6) -
            step(length(tile),0.4) ) +
            (step(length(tile-vec2(1.)),0.6) -
            step(length(tile-vec2(1.)),0.4) );

    // Truchet
    color = step(tile.x,tile.y);
    
    gl_FragColor = vec4(vec3(color*gl_FragCoord.x/200.0+gl_FragCoord.x/800.0),1.0);
}
`;

        const canvas = document.getElementById(canvasId);
        const sandbox = new GlslCanvas(canvas);
        sandbox.load(shader);
        sandbox.setUniform("u_myresolution",200,200);
    }, [canvasId])

    return <div>
        <canvas id={canvasId} width={800} height={80} />
    </div>;
};
export default EightHundredByEighty;