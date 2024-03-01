/* 
 * File: light_source.js
 * Defines a simple light source
 * code is based off of this code from the book: https://github.com/Apress/build-your-own-2d-game-engine-2e/blob/main/BookSourceCode/chapter8/8.3.multiple_lights/src/engine/lights/light.js
 */
"use strict";

import Transform from "../utils/transform.js";

class LightSource {

    constructor() {
        this.lightColor = vec4.fromValues(0.1, 0.1, 0.1, 1);  // light color
        this.lightRange = 5; // range of the light
        this.mPlacement = new Transform();
    }

    // simple setters and getters
    setColor(rgb) {
        this.lightColor[0] = rgb[0];
        this.lightColor[1] = rgb[1];
        this.lightColor[2] = rgb[2];
    }
    getColor() { return this.lightColor; }

    getXform() { return this.mPlacement; }

    setLightRange(val) { this.lightRange = val; }
    incLightRangeBy(delta) { this.lightRange += delta; }
    getLightRange() { return this.lightRange; }

    setBrightness(val) { this.lightColor[3] = val; }
    getBrightness() { return this.lightColor[3]; }
    incBrightnessBy(delta) { this.lightColor[3] += delta; }
}

export default LightSource;