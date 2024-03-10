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
        this.mIsOn = true;
    }

    // simple setters and getters
    setColor(r,g,b) {
        this.lightColor[0] = r;
        this.lightColor[1] = g;
        this.lightColor[2] = b;
    }
    incRedBy(delta){
        this.lightColor[0] += delta;
    }
    incGreenBy(delta){
        this.lightColor[1] += delta;
    }
    incBlueBy(delta){
        this.lightColor[2] += delta;
    }
    getColor() { return this.lightColor; }

    getXform() { return this.mPlacement; }

    setLightRange(val) { this.lightRange = val; }
    incLightRangeBy(delta) { this.lightRange += delta; }
    getLightRange() { return this.lightRange; }

    setBrightness(val) { this.lightColor[3] = val; }
    getBrightness() { return this.lightColor[3]; }
    incBrightnessBy(delta) { this.lightColor[3] += delta; }

    //Will turn the light on and off
    turnOnOrOff(){ 
        if(this.mIsOn == true){
            this.mIsOn = false;
        }
        else{
            this.mIsOn = true;
        }
    }
    getIsOn() {return this.mIsOn; }
}

export default LightSource;