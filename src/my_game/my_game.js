"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

// user stuff
import Brain from "./objects/brain.js";
import Hero from "./objects/hero.js";
import Minion from "./objects/minion.js";
import TextureObject from "./objects/texture_object.js";

class MyGame extends engine.Scene {
    constructor() {
        super();
        this.kMinionSprite = "assets/minion_sprite.png";
        this.kMinionPortal = "assets/minion_portal.png";
        this.kBg = "assets/bg.png";

        // The camera to view the scene
        this.mCamera = null;
        this.mHeroCam = null;
        this.mBrainCam = null;
        this.mBg = null;

        this.mMsg = null;
        this.mTutorialMsg = null;

        //Will determine which light is being controlled
        this.mCurrentLight = 0;

        // the hero and the support objects
        this.mHero = null;
        this.mBrain = null;
        this.mPortal = null;
        this.mLMinion = null;
        this.mRMinion = null;
        this.mFocusObj = null;

        // Will be used to test the lighting
        this.lightingTest = null;

        this.mChoice = 'D';
    }

    load() {
        engine.texture.load(this.kMinionSprite);
        engine.texture.load(this.kMinionPortal);
        engine.texture.load(this.kBg);
    }

    unload() {
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kMinionPortal);
        engine.texture.unload(this.kBg);
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(50, 36), // position of the camera
            100,                       // width of camera
            [0, 0, 640, 480]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray

        let testLight = new engine.LightSource();
        testLight.getXform().setSize(100, 100);
        testLight.getXform().setPosition(150, 150);
        testLight.setLightRange(40);
        testLight.setBrightness(10);

        //Background object that will be used to test our lighting system
        this.lightingTest1 = new engine.LightRenderable(this.kBg);
        this.lightingTest1.getXform().setSize(150, 150);
        this.lightingTest1.getXform().setPosition(50, 35);
        this.lightingTest.addLightSource(testLight1);

        this.lightingTest2 = new engine.LightRenderable(this.kBg);
        this.lightingTest2.getXform().setSize(150, 150);
        this.lightingTest2.getXform().setPosition(35, 35);
        this.lightingTest.addLightSource(testLight2);

        this.lightingTest3 = new engine.LightRenderable(this.kBg);
        this.lightingTest3.getXform().setSize(150, 150);
        this.lightingTest3.getXform().setPosition(50, 0);
        this.lightingTest.addLightSource(testLight3);

        this.lightingTest4 = new engine.LightRenderable(this.kBg);
        this.lightingTest4.getXform().setSize(150, 150);
        this.lightingTest4.getXform().setPosition(20, 0);
        this.lightingTest.addLightSource(testLight4);

        this.lightingTest5 = new engine.LightRenderable(this.kBg);
        this.lightingTest5.getXform().setSize(150, 150);
        this.lightingTest5.getXform().setPosition(100, 35);
        this.lightingTest.addLightSource(testLight5);

        this.lightingTest6 = new engine.LightRenderable(this.kBg);
        this.lightingTest6.getXform().setSize(150, 150);
        this.lightingTest6.getXform().setPosition(50, 100);
        this.lightingTest.addLightSource(testLight6);

        this.lightingTest7 = new engine.LightRenderable(this.kBg);
        this.lightingTest7.getXform().setSize(150, 150);
        this.lightingTest7.getXform().setPosition(0, 0);
        this.lightingTest.addLightSource(testLight7);

        this.lightingTest8 = new engine.LightRenderable(this.kBg);
        this.lightingTest8.getXform().setSize(150, 150);
        this.lightingTest8.getXform().setPosition(100, 100);
        this.lightingTest.addLightSource(testLight8);

        this.lightingTest.addLightSource(testLight1);

        // Message to display values
        this.mMsg = new engine.FontRenderable("Status Message");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(1, 1);
        this.mMsg.setTextHeight(2);

        // Message to display the controls
        this.mTutorialMsg = new engine.FontRenderable("Status Message");
        this.mTutorialMsg.setColor([1, 1, 1, 1]);
        this.mTutorialMsg.getXform().setPosition(1, 15);
        this.mTutorialMsg.setTextHeight(2);
    }

    _drawCamera(camera) {
        camera.setViewAndCameraMatrix();
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Draw with all three cameras
        this._drawCamera(this.mCamera);
        this.lightingTest.draw(this.mCamera);
        this.mMsg.draw(this.mCamera);   // only draw status in the main camera
        this.mTutorialMsg.draw(this.mCamera);   // only draw status in the main camera
    }
    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        let zoomDelta = 0.05;
        let TutorialMsg = "Move light: Arrow Keys\nChange Range: Z/X \nBrightness: J/K \nChange Red Value: Q/W"
        + "\nChange Green Value: E/R \nChange Blue Value: T/Y \nTurn Light On/off: U";
        let msg = "";

        this.mCamera.update();  // for smoother camera movements

        //Will decide which light is being controlled
        if(engine.input.isKeyPressed(engine.input.keys.Zero)){
            this.mCurrentLight = 0;
        }
        if(engine.input.isKeyPressed(engine.input.keys.One)){
            this.mCurrentLight = 1;
        }
        if(engine.input.isKeyPressed(engine.input.keys.Two)){
            this.mCurrentLight = 2;
        }
        if(engine.input.isKeyPressed(engine.input.keys.Three)){
            this.mCurrentLight = 3;
        }
        if(engine.input.isKeyPressed(engine.input.keys.Four)){
            this.mCurrentLight = 4;
        }
        if(engine.input.isKeyPressed(engine.input.keys.Five)){
            this.mCurrentLight = 5;
        }
        if(engine.input.isKeyPressed(engine.input.keys.Six)){
            this.mCurrentLight = 6;
        }
        if(engine.input.isKeyPressed(engine.input.keys.Seven)){
            this.mCurrentLight = 7;
        }

        //Will change the position of the light
        if (engine.input.isKeyPressed(engine.input.keys.Left)) {
            this.lightingTest.getLightSource(this.mCurrentLight).getXform().incXPosBy(-1);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Right)) {
            this.lightingTest.getLightSource(this.mCurrentLight).getXform().incXPosBy(1);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Up)) {
            this.lightingTest.getLightSource(this.mCurrentLight).getXform().incYPosBy(1);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Down)) {
            this.lightingTest.getLightSource(this.mCurrentLight).getXform().incYPosBy(-1);
        }

        //Will change the range of the light
        if (engine.input.isKeyPressed(engine.input.keys.Z)) {
            this.lightingTest.getLightSource(this.mCurrentLight).incLightRangeBy(1);
        }
        if (engine.input.isKeyPressed(engine.input.keys.X)) {
            this.lightingTest.getLightSource(this.mCurrentLight).incLightRangeBy(-1);
        }

        //Will increase and decrease the brightness of the light
        if (engine.input.isKeyPressed(engine.input.keys.K)) {
            this.lightingTest.getLightSource(this.mCurrentLight).incBrightnessBy(0.1);
        }
        if (engine.input.isKeyPressed(engine.input.keys.J)) {
            this.lightingTest.getLightSource(this.mCurrentLight).incBrightnessBy(-0.1);
        }

        //Will increase and decrease the amount of red/green/blue
        //is in the light
        if(engine.input.isKeyPressed(engine.input.keys.W)){
            this.lightingTest.getLightSource(this.mCurrentLight).incRedBy(0.01);
        }
        if(engine.input.isKeyPressed(engine.input.keys.Q)){
            this.lightingTest.getLightSource(this.mCurrentLight).incRedBy(-0.01);
        }
        if(engine.input.isKeyPressed(engine.input.keys.R)){
            this.lightingTest.getLightSource(this.mCurrentLight).incGreenBy(0.01);
        }
        if(engine.input.isKeyPressed(engine.input.keys.E)){
            this.lightingTest.getLightSource(this.mCurrentLight).incGreenBy(-0.01);
        }
        if(engine.input.isKeyPressed(engine.input.keys.Y)){
            this.lightingTest.getLightSource(this.mCurrentLight).incBlueBy(0.01);
        }
        if(engine.input.isKeyPressed(engine.input.keys.T)){
            this.lightingTest.getLightSource(this.mCurrentLight).incBlueBy(-0.01);
        }

        //Will turn the selected light on or off
        if(engine.input.isKeyPressed(engine.input.keys.U)){
            this.lightingTest.getLightSource(this.mCurrentLight).turnOnOrOff();
        }

        // I was having issues with how JavaScript can't let me explicitly 
        // define the type to lightSource, so I had to save it in memory

        const lightSource = this.lightingTest.getLightSource(this.mCurrentLight);

        const lightX = lightSource.getXform().getXPos();
        const lightY = lightSource.getXform().getYPos();
        msg += "X=" + lightX + " Y=" + lightY;

        const lightRange = lightSource.getLightRange();
        msg += " Range=" + lightRange;

        const lightBrightness = lightSource.getBrightness();
        msg += " Brightness=" + lightBrightness;

        this.mMsg.setText(msg);
        this.mTutorialMsg.setText(TutorialMsg);
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}