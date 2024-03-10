/*
 * File: light_renderable.js
 *
 * Supports the drawing of an object with light sources attached to it
*/
"use strict";

import SpriteRenderable from "./sprite_renderable.js";
import * as shaderResources from "../core/shader_resources.js";

class LightRenderable extends SpriteRenderable{
    constructor(myTexture){
        super(myTexture);
        super._setShader(shaderResources.getLightShader());

        //Will hold all light source objects
        this.lightSources = [];
    }

    /**
     * Will draw the light renderable object and all light sources
     * @param {camera} camera 
     */
    draw(camera){
        super.draw(camera);

        //Will draw all light sources on a light renderable object
        this.mShader.setCameraAndLight(camera, this.lightSources);
    }

    /**
     * Will return the light source corresponding to the index
     * @param {int} index 
     */
    getLightSource(index){
        return this.lightSources[index];
    }

    /**
     * Will append a light to the end of the lightSources array
     * @param {lightSource} light 
     */
    addLightSource(light){
        this.lightSources.push(light);
    }

    /**
     * Will remove the light source in index
     * @param {int} index 
     */
    removeLightSource(index){
        this.lightSources.splice(index, 0);
    }
}

export default LightRenderable;