/* 
 * Heavily derived from implementation in the 8.3 Sample Program
 * File: light_shader.js
 *      Subclass from SpriteShader
 *      Supports light illumination
 *
 */
"use strict";

import SpriteShader from "./sprite_shader.js";
import * as glSys from "../core/gl.js";
import * as defaultResources from "../resources/default_resources.js";

class LightShader extends SpriteShader {
    constructor(vertexShaderPath, fragmentShaderPath) {
        // Call super class constructor
        super(vertexShaderPath, fragmentShaderPath);  // call super class constructor

        this.mLight = null;  // light from the Renderable
        this.mCamera = null;  // the camera to draw for, required for WC to DC transform

        //global light variables that will make it so the light affects the entire game world
        this.mGlobalAmbientColorRef = null; // global light of the game world
        this.mGlobalAmbientIntensityRef = null; // intensity of global light

        let gl = glSys.get();

        //Will hold the references to the variables that control the light
        this.mColorRef = gl.getUniformLocation(this.mCompiledShader, "uLight.Color");
        this.mPosRef = gl.getUniformLocation(this.mCompiledShader, "uLight.Position");
        this.mNearRef = gl.getUniformLocation(this.mCompiledShader, "uLight.Near");
        this.mFarRef = gl.getUniformLocation(this.mCompiledShader, "uLight.Far");
        this.mIntensityRef = gl.getUniformLocation(this.mCompiledShader, "uLight.Intensity");
        this.mGlobalAmbientColorRef = gl.getUniformLocation(this.mCompiledShader, "uGlobalAmbientColor");
        this.mGlobalAmbientIntensityRef = gl.getUniformLocation(this.mCompiledShader, "uGlobalAmbientIntensity");
    }

    // Overriding the activation of the shader for rendering
    activate(pixelColor, trsMatrix, cameraMatrix) {
        // first call the super class' activate
        super.activate(pixelColor, trsMatrix, cameraMatrix);

        let gl = glSys.get();

        //let p = aCamera.wcPosToPixel(aLight.getXform().getPosition());
        //let n = aCamera.wcSizeToPixel(aLight.lightRange());
        //let f = aCamera.wcSizeToPixel(aLight.lightRange() * 2);
        if(this.mLight !== null){
            let c = this.mLight.getColor();
            gl.uniform4fv(this.mColorRef, c);
            gl.uniform2fv(this.mPosRef, this.mLight.getXform().getPosition());
            gl.uniform1f(this.mNearRef, this.mLight.getLightRange());
            gl.uniform1f(this.mFarRef, this.mLight.getLightRange() * 2);
            gl.uniform1f(this.mIntensityRef, c[3]);
            gl.uniform4fv(this.mGlobalAmbientColorRef, defaultResources.getGlobalAmbientColor());
            gl.uniform1f(this.mGlobalAmbientIntensityRef, defaultResources.getGlobalAmbientIntensity());
        }
    }

    setCameraAndLight(c, l) {
        this.mCamera = c;
        this.mLight = l;
    }
}

export default LightShader;