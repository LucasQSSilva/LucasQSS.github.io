/** 
 * @file
 * 
 * <p>Draws an animated character, called Jack Walker, running on a mostly sunny day.
 * 
 * <p>When drawImage is given nine arguments, it can be used to draw only a fragment of an image. 
 * The second through fifth arguments indicate the rectangle (x, y, width, and height) in the source image that should be copied, 
 * and the sixth to ninth arguments give the rectangle (on the canvas) into which it should be copied.</p>
 * 
 * <p>We know that each sprite, each sub-picture, is 48 pixels wide and 60 pixels high. 
 * The code in {@link animation} draws a single image sprite for each frame, which is then called
 * continously by {@link runAnimation}.</p>
 * 
 * <p>The cycle binding in {@link pose} tracks our position in the animation. For each frame, 
 * it is incremented and then clipped back to the 0 to 7 range by using the remainder operator. 
 * This binding is then used to compute, for the current pose, the x-coordinate that the sprite has in the picture.</p>
 * 
 * @author Paulo Roma
 * @since 11/08/2021
 * @see https://eloquentjavascript.net/17_canvas.html
 * @see https://lcg.ufrj.br/eloquentJavascript/game/jack.html
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
 * @see <img src="../img/player_big.png">.
 */
'use strict';
let cx = document.querySelector("canvas").getContext("2d");
var speedX, speedY = 0, gravity = 7, jump = 0, vinc, ginc = 1;
var timer = null, runAnimation = null, frameDelay = 1000/60;
/** Jack player_big.png version. */
var img = document.getElementById("jack"); // 10 sprites (sub-images)

/** Rotation counter to walk on the walls */
var rotation_count = 0;

/** width of each sprite. */
let spriteW = img.width/10;

/** height of each sprite. */
let spriteH = img.height

/** Jack's head line. */
let topLine = cx.canvas.height*3/5;

/** Jack's floor. */
let baseLine = topLine + spriteH;

/** initial horizontal position. */
let x = spriteW;

/** initial vertical position. */
let y = topLine;

/** distance to be walked before flipping. */
let width = cx.canvas.width;

/** flip coordinate. */
let flipLimit = width - spriteH;

/** horizontal speed in pixels/ms. */
speedX = 1/frameDelay;

/** velocity increment. */
vinc = speedX;

/** number of flips. */
let flip = 0;

/** lap timestamp. */
let lapTimeStamp = 0;

/** text height. */
let theight = 18;

// draw canvas border.
cx.beginPath()
cx.rect(0, 0, cx.canvas.width, cx.canvas.height);
cx.strokeStyle = 'grey';
cx.fillStyle = '#70483c';
cx.closePath();
cx.stroke();
// draw earth rectangle
cx.fillRect(0, baseLine+1, cx.canvas.width, cx.canvas.height-baseLine);
/** draw legend with a fancy font. */
(function drawLabel() {
    cx.font = `italic bold ${theight}px Tangerine`;
    let text = cx.measureText(`DCC / UFRJ  `);
    let t = cx.getTransform();
    cx.setTransform();
        cx.fillStyle = "#FF7F50";
        cx.fillText(`DCC / UFRJ`, cx.canvas.width-text.width, cx.canvas.height-theight);
        cx.fillText(`   Jack Walker`, 0, cx.canvas.height-theight);
    cx.setTransform(t);
})();
/**
 * Flip a picture around the vertical line at a given x position.
 * 
 * @param {Object} context 2d graphical context.
 * @param {number} around a vertical line abscissa.
 */
 function rotateJack(context, x, y) {
    context.translate(x, y);
    context.rotate(-Math.PI/2);
    context.translate(-x, -y);
}
/**
 *  A closure that returns a function to get the pose index into the gif image.
 *  A complete cycle of the sprites takes 640 ms.
 *  @param {number} t time.
 *  @returns {number} index ∈[0,7].
 *  @see https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
 *  @see https://developer.mozilla.org/en-US/docs/Web/API/Performance/now
 *  @function
 */
var pose = ( () => {
    let cycle = 0;
    // time to complete a whole sprite cycle: 80ms * 8.
    const duration = 640;
    // return () => cycle++ % 8;
    return (t) => {
        cycle = (cycle + t) % duration;
        return Math.floor(cycle * 7 / duration);
    }
})();
/**
 * Draws a single frame.
 * @param {number} timestep elapsed time since last call.
 */
let animation = (timestep) => {
    // erase Jack's image
    cx.clearRect(Math.floor(x), y, spriteW, spriteH);
    // draw the floor (baseLine)
    cx.moveTo(0,baseLine);
    cx.lineTo(cx.canvas.width,baseLine);
    cx.lineWidth = 1.5;
    cx.stroke();
    // px = vx * t
    let dx = speedX * timestep;
    x += dx; // px/frame
    // jump control
    y =  speedY > 0 ? Math.floor(gravity * jump) : topLine;
    jump = (jump+1) % topLine;
    if (y > topLine) {
        y = topLine;
        speedY = 0;
        jump = 0;
    }
    x = Math.min(Math.max(0,x),flipLimit);
    let tnow = performance.now();
    // hit wall control
    if (x >= flipLimit) {
        flip++;

        // Now a lap is when Jack goes around the entire picture 
        if (flip%4==0) {
            let dt = (tnow-lapTimeStamp)/1000;
            lapTimeStamp = tnow;
            document.getElementById("time").innerHTML = `${dt.toFixed(1)} s or ${((2*(width-2*spriteH)+2*(y-spriteH))/dt).toFixed()} px/s`;
        }

        rotateJack(cx, x, y);
        switch(rotation_count%2){
			case(0):
				rotation_count++;
				flipLimit+=y-spriteH;
                y = topLine;
                speedY = 0;
                jump = 0;				
                break;
			case(1):
				rotation_count++;
				flipLimit+=width-2*spriteH;
                y = topLine;
                speedY = 0;
                jump = 0;
				break;
			}
    }
    // if Jack is stand still (running on the same place), he'll never reach the wall.
    if (speedX <= 0) document.getElementById("time").innerHTML = `∞ s or 0 px/s`;
    // if jumping, use the last sprite, otherwise keep cycling the sprites in the gif.
    let tile = speedY > 0 ? 9 : pose(timestep);
    cx.drawImage(img,
            // source rectangle
            tile*spriteW,  0, spriteW, spriteH,
            // destination rectangle
            Math.floor(x), y, spriteW, spriteH);
    // print the statistics
    document.getElementById("px").innerHTML    = x.toFixed(0);
    document.getElementById("speed").innerHTML = `${dx.toFixed(0)} px/frame 
                                                    (${(speedX*1000).toFixed(0)} px/s)`;
    document.getElementById("turn").innerHTML  = flip.toString();
}
/**
 * <p>A closure to draw a single frame, by returning a function (frame), which triggers the animation.</p>
 * 
 * There are three ways of animating a scene, by calling:
 * <ul>
 *  <li> <a href="https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout">setTimeout</a> </li>
 *  <li> <a href="https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval">setInterval</a> </li>
 *  <li> <a href="https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame">requestAnimationFrame</a> 
 *       (hints towards the browser that the update ticks intend to perform animated rendering continuously).</li>
 * </ul>
 * 
 * <p>Therefore, from the perspective of the browsers, requestAnimationFrame() is superior (when implementing animation) 
 * compared to setTimeout(), for three reasons: </p>
 * <ol>
 *   <li> rAF() firing rate can match display's refresh rate (30Hz/60Hz/90Hz/120Hz/144Hz are all possible), 
 *   depending on what kind of gaming display one is running on, though last I checked, only Firefox implemented these rates, 
 *   and Chrome was using fixed 60fps, even if desktop was set to 120Hz. 
 *   With setTimeout() one cannot know the display refresh rate, and has to guess/choose fixed 60Hz.</li>
 * 
 *   <li> rAF() calls are also synced to display's vsync interval, giving smoother animation, 
 *   since there is a smaller chance that vsync intervals would be missed. 
 *   setTimeout() is used on the web for arbitrary/general timers, 
 *   and browser cannot deduce that those would need to be vsync locked.</li>
 * 
 *   <li> rAF() calls hint to the browser that the callbacks are about rendering animation, so when the tab is not visible, 
 *   browsers can optimize power usage, e.g., by stopping rAF() callbacks until tab comes back to foreground. 
 *   In general, rAF()s do not run when page is on the background or browser is minimized. </li>
 * </ol>
 * 
 * @param {DOMHighResTimeStamp} time time elapsed since the time origin.
 * @see https://developer.mozilla.org/en-US/docs/Tools/Performance/Scenarios/Intensive_JavaScript
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Performance/now
 * @function
 */
runAnimation = ( () => {
    // timestamp.
    let lastTimeStamp = 0;
    // last time frame has been called.
    let lastTime = lastTimeStamp;
    // frame counter.
    let fcounter = 0;
    // Triggers the animation.
    function frame(time) {
        let timestep = time - lastTime;
        if ( (time - lastTimeStamp) >= 1000 ) {  // more than 1s has elapsed?
            // Count the number of frames per second (1000/frameDelay).
            fpsCounter.innerHTML = fcounter;
            lastTimeStamp = time;
            fcounter = 0;
        }
        fcounter++;
        lastTime = time;
        animation(timestep);
        timer = requestAnimationFrame(frame);
    }
    timer = requestAnimationFrame(frame);
    return frame;
})();
/**
 * Pause / resume animation when Spacebar is pressed.
 * @param {KeyboardEvent} event key pressed.
 */
window.onkeydown = function (event) {
    if (event.key === ' ') {
        if (timer==null) {
            timer = requestAnimationFrame(runAnimation);
        } else {
            cancelAnimationFrame(timer);
            timer = null;
        }
    } else if (event.key=="ArrowRight") {
        speedX += vinc;
        speedX = Math.min(10*vinc,speedX);
    } else if (event.key=="ArrowLeft") {
        speedX -= vinc;
        speedX = Math.max(0,speedX);
    } else if (event.key=="ArrowUp" && speedY <= 0) {  // jump is over?
        speedY = 1;
        jump = 0;
    } else if (event.key=="ArrowDown" && speedY <= 0) {
        speedY = 0;
    } else if (event.key=="g" && speedY <= 0) {
        gravity -= ginc;
        gravity = Math.max(gravity,1);
    } else if (event.key=="G" && speedY <= 0) {
        gravity += ginc;
        gravity = Math.min(gravity,7*ginc);
    }
}