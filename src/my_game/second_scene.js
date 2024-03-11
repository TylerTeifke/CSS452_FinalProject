"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

// user stuff
import Brain from "./objects/brain.js";
import Hero from "./objects/hero.js";
import Minion from "./objects/minion.js";
import TextureObject from "./objects/texture_object.js";
import BoundingBox from "../engine/utils/bounding_box.js";

import MyGame from "./my_game.js";

class SecondScene extends engine.Scene {
    constructor() {
        super();
        this.kMinionSprite = "assets/Player.png";
        this.kMinionPortal = "assets/minion_portal.png";
        this.kBg = "assets/SceneTwoBackground.png";
        this.kBgTwo = "assets/SceneTwoBackgroundCave.png";

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
        engine.texture.load(this.kBgTwo);
    }

    unload() {
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kMinionPortal);
        engine.texture.unload(this.kBg);
        engine.texture.unload(this.kBgTwo);
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
        testLight1.getXform().setPosition(320, 240);
        testLight1.setLightRange(1000);
        testLight1.setBrightness(0.6);
        testLight1.setColor(1, 1, 1);


        //Background object that will be used to test our lighting system
        this.lightingTest = new engine.LightRenderable(this.kBg);
        this.lightingTest.setElementPixelPositions(0, 640, 0, 480);
        this.lightingTest.getXform().setSize(100, 80);
        this.lightingTest.getXform().setPosition(50, 35);
        this.lightingTest.addLightSource(testLight1);

        //Will create the player character
        this.mHero = new engine.LightRenderable(this.kMinionSprite);
        this.mHero.setColor([1, 1, 1, 0]);
        this.mHero.getXform().setSize(13, 15);
        this.mHero.getXform().setPosition(50, 50);
        this.mHero.setElementPixelPositions(0, 150, 0, 180);
        this.mHero.addLightSource(testLight1);

        let testLight2 = new engine.LightSource();
        testLight2.getXform().setSize(10, 15);
        testLight2.getXform().setPosition(50, 50);
        testLight2.setLightRange(50);
        testLight2.setBrightness(0);
        testLight2.setColor(0.6, 0, 0.45);
        this.lightingTest.addLightSource(testLight2);

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
        this.mHero.draw(this.mCamera);
    }
    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {

        if (engine.input.isKeyClicked(engine.input.keys.N)) {
            super.next()
            let myGame = new MyGame();
            myGame.start();
        }

        let zoomDelta = 0.05;
        let TutorialMsg = "Move Player: Arrow Keys";
        let msg = "";

        this.mCamera.update();  // for smoother camera movements

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

        this.lightingTest.getLightSource(1).getXform().setPosition(6.4 * (this.mHero.getXform().getXPos()), 6.4 * (this.mHero.getXform().getYPos()));

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

        console.log(this.mHero.getXform().getXPos() + " " + this.mHero.getXform().getYPos());

        if (this.mHero.getXform().getYPos() < 25) {
            //this.lightingTest.getLightSource(0).setBrightness(0.1);
            this.lightingTest.getLightSource(1).setBrightness(2);
            this.lightingTest.setTexture(this.kBgTwo);
        } else {
            //this.lightingTest.getLightSource(0).setBrightness(1);
            this.lightingTest.getLightSource(1).setBrightness(0);
            this.lightingTest.setTexture(this.kBg);
        }
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}

export default SecondScene;