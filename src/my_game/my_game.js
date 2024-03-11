"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

// user stuff
import Brain from "./objects/brain.js";
import Hero from "./objects/hero.js";
import Minion from "./objects/minion.js";
import TextureObject from "./objects/texture_object.js";

import SecondScene from "./second_scene.js";

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

        // Will be used for interpolating where the lights need to go
        this.redLightX = null;
        this.redLightY = null;
        this.greenLightX = null;
        this.greenLightY = null;
        this.blueLightX = null;
        this.blueLightY = null;

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

        let testLight1 = new engine.LightSource();
        testLight1.getXform().setSize(100, 100);
        testLight1.getXform().setPosition(150, 150);
        testLight1.setLightRange(40);
        testLight1.setBrightness(10);
        testLight1.setColor(1, 0, 0);

        let testLight2 = new engine.LightSource();
        testLight2.getXform().setSize(100, 100);
        testLight2.getXform().setPosition(0, 0);
        testLight2.setLightRange(40);
        testLight2.setBrightness(10);
        testLight2.setColor(0, 1, 0);

        let testLight3 = new engine.LightSource();
        testLight3.getXform().setSize(100, 100);
        testLight3.getXform().setPosition(100, 100);
        testLight3.setLightRange(40);
        testLight3.setBrightness(10);
        testLight3.setColor(0, 0, 1);

        let testLight4 = new engine.LightSource();
        testLight4.getXform().setSize(100, 100);
        testLight4.getXform().setPosition(200, 200);
        testLight4.setLightRange(400);
        testLight4.setBrightness(3);

        let testLight5 = new engine.LightSource();
        testLight5.getXform().setSize(100, 100);
        testLight5.getXform().setPosition(0, 150);
        testLight5.setLightRange(40);
        testLight5.setBrightness(10);

        let testLight6 = new engine.LightSource();
        testLight6.getXform().setSize(100, 100);
        testLight6.getXform().setPosition(150, 0);
        testLight6.setLightRange(40);
        testLight6.setBrightness(10);

        let testLight7 = new engine.LightSource();
        testLight7.getXform().setSize(100, 100);
        testLight7.getXform().setPosition(75, 75);
        testLight7.setLightRange(40);
        testLight7.setBrightness(10);

        let testLight8 = new engine.LightSource();
        testLight8.getXform().setSize(100, 100);
        testLight8.getXform().setPosition(300, 300);
        testLight8.setLightRange(40);
        testLight8.setBrightness(10);

        //Background object that will be used to test our lighting system
        this.lightingTest = new engine.LightRenderable(this.kBg);
        this.lightingTest.setElementPixelPositions(0, 1024, 0, 1024);
        this.lightingTest.getXform().setSize(150, 150);
        this.lightingTest.getXform().setPosition(50, 35);
        this.lightingTest.addLightSource(testLight1);
        this.lightingTest.addLightSource(testLight2);
        this.lightingTest.addLightSource(testLight3);
        this.lightingTest.addLightSource(testLight4);
        //this.lightingTest.addLightSource(testLight5);
        //this.lightingTest.addLightSource(testLight6);
        //this.lightingTest.addLightSource(testLight7);
        //this.lightingTest.addLightSource(testLight8);

        //Will create the player character
        this.mHero = new engine.LightRenderable(this.kMinionSprite);
        this.mHero.setColor([1, 1, 1, 0]);
        this.mHero.getXform().setSize(10, 15);
        this.mHero.getXform().setPosition(50, 50);
        this.mHero.setElementPixelPositions(0, 120, 0, 180);
        this.mHero.addLightSource(testLight1);
        this.mHero.addLightSource(testLight2);
        this.mHero.addLightSource(testLight3);
        this.mHero.addLightSource(testLight4);

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

        // Will lerp the lights to the player
        this.redLightX = new engine.Lerp(this.mHero.getXform().getXPos(), 120, 0.05);
        this.redLightY = new engine.Lerp(this.mHero.getXform().getYPos(), 120, 0.05);

        this.greenLightX = new engine.Lerp(this.mHero.getXform().getXPos(), 120, 0.025);
        this.greenLightY = new engine.Lerp(this.mHero.getXform().getYPos(), 120, 0.025);

        this.blueLightX = new engine.Lerp(this.mHero.getXform().getXPos(), 120, 0.075);
        this.blueLightY = new engine.Lerp(this.mHero.getXform().getYPos(), 120, 0.075);
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
        this.mHero.draw(this.mCamera);
    }
    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {

        if (engine.input.isKeyClicked(engine.input.keys.N)) {
            super.next()
            let myGame = new SecondScene();
            myGame.start();
        }

        let zoomDelta = 0.05;
        let TutorialMsg = "Move light: Arrow Keys\nTurn Light On/off: U\nMake Lights Follow Player: Space";
        let msg = "";

        this.mCamera.update();  // for smoother camera movements

        //Will decide which light is being controlled
        if (engine.input.isKeyPressed(engine.input.keys.Zero)) {
            this.mCurrentLight = 0;
        }
        if (engine.input.isKeyPressed(engine.input.keys.One)) {
            this.mCurrentLight = 1;
        }
        if (engine.input.isKeyPressed(engine.input.keys.Two)) {
            this.mCurrentLight = 2;
        }

        //Will change the position of the player
        if (engine.input.isKeyPressed(engine.input.keys.Left)) {
            this.mHero.getXform().incXPosBy(-1);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Right)) {
            this.mHero.getXform().incXPosBy(1);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Up)) {
            this.mHero.getXform().incYPosBy(1);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Down)) {
            this.mHero.getXform().incYPosBy(-1);
        }

        //Will cause all of the lights to lerp towards the hero
        if (engine.input.isKeyClicked(engine.input.keys.Space)) {
            this.mLerpToHero = true;
        }

        if (this.mLerpToHero) {
            this.lerpFunction();
        }

        //Will turn the selected light on or off
        if (engine.input.isKeyClicked(engine.input.keys.U)) {
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

    //Will handle the lights moving towards the player
    lerpFunction() {
        //Will update the coordinates of the lights using the lerp class
        this.redLightX.setFinal(this.mHero.getXform().getXPos());
        this.redLightY.setFinal(this.mHero.getXform().getYPos());
        this.greenLightX.setFinal(this.mHero.getXform().getXPos());
        this.greenLightY.setFinal(this.mHero.getXform().getYPos());
        this.blueLightX.setFinal(this.mHero.getXform().getXPos());
        this.blueLightY.setFinal(this.mHero.getXform().getYPos());

        this.redLightX.update();
        this.redLightY.update();
        this.greenLightX.update();
        this.greenLightY.update();
        this.blueLightX.update();
        this.blueLightY.update();

        let newRedX = this.redLightX.get() * 6.4;
        let newRedY = this.redLightY.get() * 6.4;
        let newGreenX = this.greenLightX.get() * 6.4;
        let newGreenY = this.greenLightY.get() * 6.4;
        let newBlueX = this.blueLightX.get() * 6.4;
        let newBlueY = this.blueLightY.get() * 6.4;

        this.lightingTest.getLightSource(0).getXform().setPosition(newRedX, newRedY);
        this.lightingTest.getLightSource(1).getXform().setPosition(newGreenX, newGreenY);
        this.lightingTest.getLightSource(2).getXform().setPosition(newBlueX, newBlueY);
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}