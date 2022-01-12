import React, {useCallback} from "react";
import Sketch from '../sketch';
import Scribble from 'scribble-fork';

const ML = ({width, height}) => {
    const displayer = useCallback((p5) => {
        let scribble = undefined;

        p5.setup = () => {
            p5.createCanvas(width, height)
            scribble = new Scribble(p5);
        }

        let d = true;
        const rdim = width/4.1;
        const font_size = 32;

        p5.draw = () => {
            if (!d) return;
            p5.background(255);
            
            if (scribble) {
                d = false;
                p5.fill(0);
                p5.stroke(0);

                //plus
                scribble.scribbleLine(width/2-0.75*0.9*rdim, height/2,
                                      width/2-0.75*1.1*rdim, height/2);
                scribble.scribbleLine(width/2-0.75*rdim, height/2+0.1*rdim,
                                      width/2-0.75*rdim, height/2-0.1*rdim);
                
                //equals
                scribble.scribbleLine(width/2+0.75*0.9*rdim, height/2+0.05*rdim,
                                      width/2+0.75*1.1*rdim, height/2+0.05*rdim);
                scribble.scribbleLine(width/2+0.75*0.9*rdim, height/2-0.05*rdim,
                                      width/2+0.75*1.1*rdim, height/2-0.05*rdim);
                
                //text
                p5.textSize(font_size);
                p5.textStyle(p5.ITALIC);
                p5.fill(0);
                p5.textAlign(p5.CENTER, p5.CENTER);
                p5.text("Panda", width/2-1.5*rdim,height/2+rdim/2+font_size);
                p5.text("Nematode", width/2,height/2+rdim/2+font_size);
                p5.text("Gibbon", width/2+1.5*rdim,height/2+rdim/2+font_size);

                //panda x2
                function panda(x, y) {
                    //eye spots
                    const n=32;
                    p5.fill(0);
                    scribble.scribbleEllipse(x-10, y+rdim/n, 15,15);
                    scribble.scribbleEllipse(x+10, y+rdim/n, 15,15);

                    //pupils
                    p5.fill(255);
                    scribble.scribbleEllipse(x-10, y+2+rdim/n, 5, 5);
                    scribble.scribbleEllipse(x+10, y+2+rdim/n, 5, 5);

                    p5.fill(0,0);
                    //head
                    scribble.scribbleEllipse(x, y, rdim/2, rdim/2);
                    //mouth
                    scribble.scribbleEllipse(x, y+10+rdim/n, 3, 3);
                    scribble.scribbleCurve(
                        x, y+10+rdim/n+3,
                        x-10, y+10+rdim/n+3,
                        x, y+10+rdim/n+13,
                        x-10, y+10+rdim/n+5,
                    )
                    scribble.scribbleCurve(
                        x, y+10+rdim/n+3,
                        x+10, y+10+rdim/n+3,
                        x, y+10+rdim/n+13,
                        x+10, y+10+rdim/n+5,
                    )
                    //ear
                    p5.fill(0);
                    const start = 15*Math.PI/180, end=60*Math.PI/180;
                    scribble.scribbleCurve(
                        x+rdim/4*Math.cos(start), y-rdim/4*Math.sin(start),
                        x+rdim/4*Math.cos(end), y-rdim/4*Math.sin(end),
                        x+rdim/4*Math.cos(start)+20, y-rdim/4*Math.sin(start)-5,
                        x+rdim/4*Math.cos(end)+20, y-rdim/4*Math.sin(end)-15,
                    )
                    scribble.scribbleCurve(
                        x-rdim/4*Math.cos(start), y-rdim/4*Math.sin(start),
                        x-rdim/4*Math.cos(end), y-rdim/4*Math.sin(end),
                        x-rdim/4*Math.cos(start)-20, y-rdim/4*Math.sin(start)-5,
                        x-rdim/4*Math.cos(end)-20, y-rdim/4*Math.sin(end)-15,
                    )
                }
                panda(width/2-1.5*rdim, height/2);
                panda(width/2+1.5*rdim, height/2);

                //nematode (random pixels)
                for (let i=0; i<rdim-4; ++i) {
                    for (let j=0; j<rdim-4; ++j) {
                        p5.stroke(255*Math.random(), 255*Math.random(), 255*Math.random());
                        p5.rect(width/2-rdim/2+2+i, height/2-rdim/2+2+j, 1, 1);
                    }
                }

                //boxes
                p5.fill(0);
                p5.stroke(0);
                scribble.scribbleRect(width/2-1.5*rdim, height/2, rdim, rdim);
                scribble.scribbleRect(width/2, height/2, rdim, rdim);
                scribble.scribbleRect(width/2+1.5*rdim, height/2, rdim, rdim);
            }
        }
    }, [width, height]);

    return <div>
        <Sketch sketch={displayer} />
    </div>
}
export default ML;