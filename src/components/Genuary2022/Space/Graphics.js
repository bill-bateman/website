import {updatePosition, updatePlanet, calculateNewPositions, resetStateToInitialConditions} from "./Physics"

export class Displayer {
    constructor(ctx, w, h) {
        this.ctx = ctx;
        this.width = w;
        this.height = h;
        this.run = true;

        // Current state of the system
        this.state = {
            // State variables used in the differential equations
            // First two elements are x and y positions, and second two are x and y components of velocity
            // repeated for three bodies.
            u: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            positions: [
                {x:0, y:0},
                {x:0, y:0},
                {x:0, y:0},
            ],
            //planet coords
            pu: [0,0,0,0],
            px: 0, py: 0,
        };
        resetStateToInitialConditions(this.state);

        let largestDistanceMeters = 0;
        for (let i=0; i<this.state.positions.length; ++i) {
            const r = this.state.u[4*i+0]**2 + this.state.u[4*i+1]**2;
            largestDistanceMeters = Math.max(r, largestDistanceMeters);
        } 
        largestDistanceMeters = Math.sqrt(largestDistanceMeters);
        this.metersPerPixel = 2.3 * largestDistanceMeters / Math.min(this.width, this.height);
    }

    handlePosition() {
        const calculationsPerFrame = 250;
        const framesPerSecond = 60;
        const timeScaleFactor = 1;
        const timestep = timeScaleFactor / framesPerSecond / calculationsPerFrame;

        const drawTimesPerFrame = 10;
        const drawIndex = Math.ceil(calculationsPerFrame / drawTimesPerFrame);

        for (let i=0; i<calculationsPerFrame; ++i) {
            updatePosition(timestep, this.state);
            updatePlanet(timestep, this.state);

            if (i%drawIndex === 0) {
                //TODO: draw orbital lines
            }
        }
        
        calculateNewPositions(this.state, this.metersPerPixel, this.width, this.height);
    }

    handleOrbitalDrawing() {
        //TODO: draw
    }

    handleDrawing() {
        // console.log(this.state.u);
        // console.log(this.state.positions);
        this.ctx.clearRect(0,0,this.width,this.height);
        this.ctx.fillStyle = "rgb(0,0,0)";
        this.ctx.fillRect(0,0,this.width,this.height);
        this.ctx.strokeStyle = "rgb(255,255,255)";
        for (let i=0; i < this.state.positions.length; ++i) {
            const r = 5;
            this.ctx.beginPath();
            this.ctx.arc(this.state.positions[i].x, this.state.positions[i].y, r, 0, 2*Math.PI);
            this.ctx.stroke();
        }
        this.ctx.strokeRect(this.state.px, this.state.py, 1, 1);
    }

    loop() {
        if (!this.run) return;
        this.handlePosition();
        this.handleDrawing();
        window.requestAnimationFrame(() => this.loop());
    }

    stop() {
        this.run = false;
    }
}