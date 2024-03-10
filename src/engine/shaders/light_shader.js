/* 
 * Heavily derived from implementation in the 8.3 Sample Program
 * File: light_shader.js
 *      Subclass from SpriteShader
 *      Supports light illumination
 * Code gotten from example 8.3 of the book
 */
"use strict";

import SpriteShader from "./sprite_shader.js";
import * as glSys from "../core/gl.js";
import * as defaultResources from "../resources/default_resources.js";
import ShaderLightAt from "./shader_light_at.js";

class LightShader extends SpriteShader {
    constructor(vertexShaderPath, fragmentShaderPath) {
        // Call super class constructor
        super(vertexShaderPath, fragmentShaderPath);  // call super class constructor

        this.mLights = null;  // light from the Renderable
        this.mCamera = null;  // the camera to draw for, required for WC to DC transform

        //global light variables that will make it so the light affects the entire game world
        this.mGlobalAmbientColorRef = null; // global light of the game world
        this.mGlobalAmbientIntensityRef = null; // intensity of global light
        this.MAX_LIGHTS = 8;
        this.mShaderLights = [];
        let i, ls;
        for (i = 0; i < this.MAX_LIGHTS; i++) {
            ls = new ShaderLightAt(this.mCompiledShader, i);
            this.mShaderLights.push(ls);
        }
    }

    // Overriding the activation of the shader for rendering
    activate(pixelColor, trsMatrix, cameraMatrix) {
        // first call the super class' activate
        super.activate(pixelColor, trsMatrix, cameraMatrix);

        // now push the light information to the shader
        let numLight = 0;
        if (this.mLights !== null) {
            while (numLight < this.mLights.length) {
                this.mShaderLights[numLight].loadToShader(this.mCamera, this.mLights[numLight]);
                numLight++;
            }
        }
        // switch off the left over ones.
        while (numLight < this.kGLSLuLightArraySize) {
            this.mShaderLights[numLight].switchOffLight(); // switch off unused lights
            numLight++;
        }
    }

    setCameraAndLight(c, l) {
        this.mCamera = c;
        this.mLights = l;
    }
}

export default LightShader;