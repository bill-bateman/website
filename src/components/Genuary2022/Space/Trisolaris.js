import React, {useEffect, useState} from "react";
import {Displayer} from "./Graphics.js"

const Dither = () => {
    const WIDTH = 600;
    const HEIGHT = 600;

    const [displayer, setDisplayer] = useState();

    useEffect(() => {
        const d = new Displayer(document.getElementById("space__canvas").getContext("2d"), WIDTH, HEIGHT);
        d.loop();
        setDisplayer(d);
    }, [setDisplayer]);

    useEffect(() => () => {
        //unmount
        if (displayer) displayer.stop();
    }, [displayer]);

    return <div>
        <canvas id="space__canvas" width={WIDTH} height={HEIGHT} style={{marginLeft: -(WIDTH-650)/2+"px"}}  />
    </div>
}
export default Dither;