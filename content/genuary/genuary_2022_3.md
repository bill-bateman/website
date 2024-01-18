---
date: "2022-01-05"
title: "Day 3: Space"
post: False
---

<div>
    <canvas id="space__canvas" width="600px" height="600px" style="margin-left: 25px">
</div>

<script>
    //based on code from https://evgenii.com/blog/three-body-problem-simulator/

    const constants = {
        gravitationalConstant: 6.67408 * Math.pow(10, -11),
        // Average density of the body (kg/m^3). Used for calculating body's radius form its mass
        averageDensity: 1410
    };

    const vigure8Position = {x: 0.97000436, y: -0.24308753};
    const vigure8Velocity = {x: -0.93240737, y: -0.86473146};

    function polarFromCartesian(coordinates) {
        var angle;

        if (coordinates.x === 0) {
        angle = 0;
        } else {
        angle = Math.atan2(coordinates.y, coordinates.x);
        }

        return {
        r: Math.sqrt(Math.pow(coordinates.x, 2) + Math.pow(coordinates.y, 2)),
        theta: angle
        };
    }

    const initialConditions = {
        bodies: 3,
        dimensionless: true,
        masses: [1, 1, 1],
        massSlider: {
            min: 0.1,
            max: 5,
            power: 3
        },
        timeScaleFactor: 1,
        timeScaleFactorSlider: {
            min: 0.00,
            max: 5000,
            power: 5
        },
        positions: [ // in Polar coordinates, r is in meters
            polarFromCartesian(vigure8Position),
            polarFromCartesian({x: -vigure8Position.x, y: -vigure8Position.y}),
            polarFromCartesian({x: 0, y: 0}),
        ],
        velocities: [ // in Polar coordinates, r is in m/s
            polarFromCartesian({x: -vigure8Velocity.x / 2, y: -vigure8Velocity.y/2}),
            polarFromCartesian({x: -vigure8Velocity.x / 2, y: -vigure8Velocity.y/2}),
            polarFromCartesian(vigure8Velocity)
        ],
        planetPosition: polarFromCartesian({x: 0.1, y: -0.3}),
        planetVelocity: {r: 0, theta: 0},
    };

    function calculateCenterOfMassVelocity(state){
        var centerOfMassVelocity = {x: 0, y: 0};
        var sumOfMasses = 0;

        // Loop through the bodies
        for (var iBody = 0; iBody < initialConditions.bodies; iBody++) {
            var bodyStart = iBody * 4; // Starting index for current body in the u array
            centerOfMassVelocity.x += initialConditions.masses[iBody] * state.u[bodyStart + 2];
            centerOfMassVelocity.y += initialConditions.masses[iBody] * state.u[bodyStart + 3];
            sumOfMasses += initialConditions.masses[iBody];
        }

        centerOfMassVelocity.x /= sumOfMasses;
        centerOfMassVelocity.y /= sumOfMasses;

        return centerOfMassVelocity;
    }

    function calculateCenterOfMass(state){
        var centerOfMass = {x: 0, y: 0};
        var sumOfMasses = 0;

        // Loop through the bodies
        for (var iBody = 0; iBody < initialConditions.bodies; iBody++) {
            var bodyStart = iBody * 4; // Starting index for current body in the u array
            centerOfMass.x += initialConditions.masses[iBody] * state.u[bodyStart + 0];
            centerOfMass.y += initialConditions.masses[iBody] * state.u[bodyStart + 1];
            sumOfMasses += initialConditions.masses[iBody];
        }

        centerOfMass.x /= sumOfMasses;
        centerOfMass.y /= sumOfMasses;

        return centerOfMass;
    }

    function resetStateToInitialConditions(state) {
        var iBody, bodyStart;

        // Loop through the bodies
        for (iBody = 0; iBody < initialConditions.bodies; iBody++) {
            bodyStart = iBody * 4; // Starting index for current body in the u array

            var position = initialConditions.positions[iBody];
            state.u[bodyStart + 0] = position.r * Math.cos(position.theta); // x
            state.u[bodyStart + 1] = position.r * Math.sin(position.theta); //y

            var velocity = initialConditions.velocities[iBody];
            state.u[bodyStart + 2] = velocity.r * Math.cos(velocity.theta); // velocity x
            state.u[bodyStart + 3] = velocity.r * Math.sin(velocity.theta); // velocity y
        }

        var centerOfMassVelocity = calculateCenterOfMassVelocity(state);
        var centerOfMass = calculateCenterOfMass(state);

        // Correct the velocities and positions of the bodies
        // to make the center of mass motionless at the middle of the screen
        for (iBody = 0; iBody < initialConditions.bodies; iBody++) {
            bodyStart = iBody * 4; // Starting index for current body in the u array
            state.u[bodyStart + 0] -= centerOfMass.x;
            state.u[bodyStart + 1] -= centerOfMass.y;
            state.u[bodyStart + 2] -= centerOfMassVelocity.x;
            state.u[bodyStart + 3] -= centerOfMassVelocity.y;
        }

        state.pu[0] = initialConditions.planetPosition.r * Math.cos(initialConditions.planetPosition.theta);
        state.pu[1] = initialConditions.planetPosition.r * Math.sin(initialConditions.planetPosition.theta);
        state.pu[2] = initialConditions.planetVelocity.r * Math.cos(initialConditions.planetVelocity.theta);
        state.pu[3] = initialConditions.planetVelocity.r * Math.sin(initialConditions.planetVelocity.theta);
    }   

    const rungeKutta = (h, u) => {
        const a = [h/2, h/2, h, 0];
        const b = [h/6, h/3, h/3, h/6];
        let u0 = [];
        let ut = [];
        const dimension = u.length;

        for (let i=0; i<dimension; ++i) {
            u0.push(u[i]);
            ut.push(0);
        }
        for (let j=0; j<4; ++j) {
            const du = derivative(u);
            for (let i=0; i<dimension; ++i) {
                u[i] = u0[i] + a[j]*du[i];
                ut[i] = ut[i] + b[j]*du[i];
            }
        }
        for (let i=0; i<dimension; ++i) {
            u[i] = u0[i] + ut[i];
        }
    }

    //calculate the derivatives of the system of ODEs that describe equation of motion of the bodies
    const derivative = (u) => {
        const du = new Array(initialConditions.bodies * 4);

        //loop through bodies
        for (let i=0; i<initialConditions.bodies; ++i) {
            var ui = i*4;

            du[ui + 0] = u[ui + 0 + 2]; //velocity x
            du[ui + 1] = u[ui + 0 + 3]; //velocity y
            du[ui + 2] = acceleration(u, i, 0); //acceleration x
            du[ui + 3] = acceleration(u, i, 1); //acceleration y
        }

        return du;
    }


    //calculates the acceleration of the body 'iFromBody'
    //due to gravity from other bodies,
    //using Newton's law of gravitation.
    //  u: state
    //  i: the index of body. 0 is first body, 1 is second body.
    //  c: 0 for x coordinate, 1 for y coordinate
    const acceleration = (u, i, c) => {
        let result = 0;
        const ui = i*4;
        const gravitationalConstant = initialConditions.dimensionless ? 1 : constants.gravitationalConstant;

        for (let j=0; j<initialConditions.bodies; ++j) {
            if (i===j) continue;
            const uj = j*4;

            //distance
            const dx = u[ui+0] - u[uj+0];
            const dy = u[ui+1] - u[uj+1];
            const d = Math.sqrt(dx*dx + dy*dy);

            result += gravitationalConstant * 
                initialConditions.masses[j] *
                (u[uj+c] - u[ui+c]) /
                (Math.pow(d, 3));
        }

        return result;
    };


    // The main function that is called on every animation frame.
    // It calculates and updates the current positions of the bodies
    function updatePosition(timestep, state) {
        rungeKutta(timestep, state.u);
    }

    function updatePlanet(timestep, state) {
        let ax = 0, ay = 0;
        const gravitationalConstant = initialConditions.dimensionless ? 1 : constants.gravitationalConstant;

        for (let i=0; i<initialConditions.bodies; ++i) {
            const ui = i*4;
            const dx = state.u[ui+0] - state.pu[0];
            const dy = state.u[ui+1] - state.pu[1];
            const d2 = dx*dx + dy*dy;
            const d = Math.sqrt(d2);

            const at = gravitationalConstant * initialConditions.masses[i] / d2;
            ax += at * (dx / d);
            ay += at * (dy / d);
        }

        state.pu[2] += timestep * ax;
        state.pu[3] += timestep * ay;
        state.pu[0] += timestep * state.pu[2];
        state.pu[1] += timestep * state.pu[3];
    }

    function calculateNewPositions(state, metersPerPixel, width, height) {
        // Loop through the bodies
        for (let i = 0; i < initialConditions.bodies; ++i) {
            const ui = i * 4;
            state.positions[i].x = state.u[ui+0] / metersPerPixel + width/2;
            state.positions[i].y = state.u[ui+1] / metersPerPixel + height/2;
        }
        state.px = state.pu[0] / metersPerPixel + width/2;
        state.py = state.pu[1] / metersPerPixel + height/2;
    }

    class Displayer {
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

    const WIDTH = 600;
    const HEIGHT = 600;

    const d = new Displayer(document.getElementById("space__canvas").getContext("2d"), WIDTH, HEIGHT);
    d.loop();
    
</script>

<p class="caption">Adapted from <a href="https://evgenii.com/blog/three-body-problem-simulator/">this blog post</a> (see his <a href="https://evgenii.com/files/2018/09/three-body-problem-simulator/the_complete_code/">source code here</a>).</p>
<p class="caption">(refresh to reset)</p>