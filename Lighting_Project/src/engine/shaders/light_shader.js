/* 
 * Heavily derived from implementation in the 8.3 Sample Program
 * File: light_shader.js
 *      Subclass from SpriteShader
 *      Supports light illumination
 *
 */
"use strict";

import SpriteShader from "./sprite_shader.js";
import ShaderLightAt from "./shader_light_at.js";

class LightShader extends SpriteShader {
    constructor(vertexShaderPath, fragmentShaderPath) {
        // Call super class constructor
        super(vertexShaderPath, fragmentShaderPath);  // call super class constructor

        this.mLight = null;  // light from the Renderable
        this.mCamera = null;  // the camera to draw for, required for WC to DC transform

        this.mShaderLight = new ShaderLightAt(this.mCompiledShader, 0);
    }

    // Overriding the activation of the shader for rendering
    activate(pixelColor, trsMatrix, cameraMatrix) {
        // first call the super class' activate
        super.activate(pixelColor, trsMatrix, cameraMatrix);

        // now push the light information to the shader
        if (this.mLight !== null) {
            this.mShaderLight.loadToShader(this.mCamera, this.mLight);
        } else {
            this.mShaderLight.switchOffLight(); // switch off the light
        }
    }

    setCameraAndLight(c, l) {
        this.mCamera = c;
        this.mLight = l;
    }
}

export default LightShader;