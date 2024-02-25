/* 
 * File: light.js
 * Defines a simple light source
 */
"use strict";

import Transform from "../utils/transform.js";

class Light {

    constructor() {
        this.lightColor = vec4.fromValues(0.1, 0.1, 0.1, 1);  // light color
        this.mPosition = vec3.fromValues(0, 0, 5); // light position in WC
        this.lightRange = 5; // range of the light
        this.mPlacement = new Transform();
    }

    // simple setters and getters
    setColor(rgb) { 
        this.lightColor[0] = rgb[0];
        this.lightColor[1] = rgb[1];
        this.lightColor[2] = rgb[2];
    }
    getColor() { return this.mColor; }

    getXform() { return this.mPlacement; }

    setLightRange(val){ this.lightRange = val; }
    incLightRangeBy(delta){ this.lightRange += delta; }
    getLightRange(){ return this.lightRange; }

    setBrightness(val) { this.lightColor[3] = val; }
    getBrightness() { return this.lightColor[3]; }
    incBrightnessBy(delta){ this.lightColor[3] += delta; }

    isLightOn() { return this.mIsOn; }
    setLightTo(on) { this.mIsOn = on; }
}

export default Light;