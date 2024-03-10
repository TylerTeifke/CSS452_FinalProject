/*
 * File: shader_light_at.js 
 *      support of loading light info to the glsl shader
 *      references are pointing to uLight[index]
 * Code gotten from example 8.3 of the book
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as glSys from "../core/gl.js";

class ShaderLightAt {
    constructor(shader, index) {
        this._setShaderReferences(shader, index);
    }

    loadToShader(aCamera, aLight) {
        let gl = glSys.get();
        gl.uniform1i(this.mIsOnRef, aLight.getIsOn());
        // Process a light only when it is switched on
        if (aLight.getIsOn() == true) {
            let p = aLight.getXform().getPosition();
            let n = aLight.getLightRange();
            let f = aLight.getLightRange() * 2;
            let c = aLight.getColor();
            gl.uniform4fv(this.mColorRef, c);
            gl.uniform2fv(this.mPosRef, p);
            gl.uniform1f(this.mNearRef, n);
            gl.uniform1f(this.mFarRef, f);
            gl.uniform1f(this.mIntensityRef, aLight.getBrightness());
        }
    }

    switchOffLight() {
        let gl = glSys.get();
        gl.uniform1i(this.mIsOnRef, false);
    }
    //</editor-fold>

    //<editor-fold desc="private functions">
    _setShaderReferences(aLightShader, index) {
        let gl = glSys.get();
        this.mColorRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].Color");
        this.mPosRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].Position");
        this.mNearRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].Near");
        this.mFarRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].Far");
        this.mIntensityRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].Intensity");
        this.mIsOnRef = gl.getUniformLocation(aLightShader, "uLights[" + index + "].isOn");
    }

}

export default ShaderLightAt;