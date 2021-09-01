/**
 * @file
 *
 * Summary.
 * <p>Animation module for the robot.</p>
 *
 *  Description.
 *  <p>The class Animation aims at providing the methods for animating the robot movement
 *     during its task of delivering parcels.</p>
 *
 *  <pre>
 *  Documentation:
 *  - Ubuntu:
 *     - sudo apt install jsdoc-toolkit
 *  - MacOS:
 *     - sudo port install npm6 (or npm7)
 *     - sudo npm install -g jsdoc
 *  - jsdoc -d doc-village animatevillage.js
 *  </pre>
 *
 *  @see http://orion.lcg.ufrj.br/eloquentJavascript/robot/robot.html
 *  @see https://eloquentjavascript.net/07_robot.html
 *  @author Marijn Haverbeke ({@link https://marijnhaverbeke.nl}), adapted to ES6 by Paulo Roma
 *  @since 06/07/2021
 */
/**
 * @function
 * @name Anonymous self-invoked function
 * @description <p>Call animation module. </p>
 * A self-invoking (also called self-executing) function is a nameless (anonymous) function that is invoked immediately after its definition.
 * A self-invoking function can have variables and methods but they cannot be accessed from outside of it. 
 * To access them, the global window object has to be passed as a parameter.
 * @see https://scriptverse.academy/tutorials/js-self-invoking-functions.html
 * @see https://www.devmedia.com.br/padronizando-codigo-javascript-com-iife-amd-e-requirejs/31031
 */
(function() {
  "use strict"
  /** 
   * Animation instance exposed to the window object as a property.
   * @global
   */
  let active = null
  /**
   * A dictionary for associating coordinates to the locations of the village.
   * @global
   */
  const places = {
    "Alice's House": {x: 279, y: 100},
    "Bob's House": {x: 315, y: 203},
    "Cabin": {x: 372, y: 67},
    "Daria's House": {x: 183, y: 285},
    "Ernie's House": {x: 50, y: 283},
    "Farm": {x: 86, y: 118},
    "Grete's House": {x: 35, y: 187},
    "Marketplace": {x: 162, y: 110},
    "Post Office": {x: 205, y: 57},
    "Shop": {x: 137, y: 212},
    "Town Hall": {x: 202, y: 213}
  }
  /** 
   * The places of the village. 
   * @global
   */
  const placeKeys = Object.keys(places)
  /** 
   * Animation speed. 
   * @global
   */
  const speed = 2
  /**
   * A direction to go, and the rest of the route as the memory.
   * @typedef {Array<direction:string,memory:Array<string>>} RobotState
   */
  /**
   * @typedef {function(state,route):RobotState} robotCallback
   * @callback robotCallback
   * @param {VillageState} state village state.
   * @param {Array<string>} route route to be followed (memory).
   * @returns {RobotState} new route.
   */
  /**
   * Class for building the html elements necessary to depict the village of Meadowfield, the parcels, and the robot.
   * It also schedules the animation process.
   */
  class Animation {
    /**
     * @param {VillageState} worldState state of the village.
     * @param {robotCallback} robot a robot type (algorithm).
     * @param {Array<string>} robotState route to be followed (memory).
     * @param {boolean} [start=true] whether the animation should begin immediately.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/transitionend_event
     */
    constructor(worldState, robot, robotState, start=true) {
      this.worldState = worldState
      this.robot = robot
      this.robotState = robotState
      this.turn = 0
      this.parcels = []
      let outer = (window.__sandbox ? window.__sandbox.output.div : document.body), doc = outer.ownerDocument
      this.node = outer.appendChild(doc.createElement("div"))
      this.node.style.cssText = "position: relative; line-height: 0.1; margin-left: 10px"
      this.map = this.node.appendChild(doc.createElement("img"))
      this.map.src = "img/village2x.png"
      this.map.style.cssText = "vertical-align: -8px; border: 5px solid #555; margin-bottom: 20px;"
      this.robotElt = this.node.appendChild(doc.createElement("div"))
      // CSS transitions allows you to change property values smoothly, over a given duration.
      this.robotElt.style.cssText = `position: absolute; transition: left ${0.8 / speed}s, top ${0.8 / speed}s;`
      let robotPic = this.robotElt.appendChild(doc.createElement("img"))
      robotPic.src = "img/robot_moving2x.gif"
      this.text = this.node.appendChild(doc.createElement("span"))
      this.button = this.node.appendChild(doc.createElement("button"))
      this.button.style.cssText = "color: white; background: #28b; border: none; border-radius: 2px; padding: 2px 5px; line-height: 1.1; font-family: sans-serif; font-size: 80%"
      this.button.addEventListener("click", () => this.clicked())
      // should the game begin started or stopped?
      if (!start) {
        this.button.textContent = "Start"
      } else {
        this.button.textContent = "Stop"
        this.schedule()
      }
     
      this.updateView()
      this.updateParcels()
      // when the robot reaches its final position, then update its parcels.
      this.robotElt.addEventListener("transitionend", () => this.updateParcels())
    }
    /** Deletes all created elements. */
    deleteNode() {
      this.node.remove()
    }
    /** Updates the robot position in the village. */
    updateView() {
      let pos = places[this.worldState.place]
      this.robotElt.style.top = (pos.y - 38) + "px"
      this.robotElt.style.left = (pos.x - 16) + "px"
      this.text.textContent = ` Turn ${this.turn} `
    }
    /** 
     * <p>Updates the parcels in the village. </p>
     * <ul>
     * <li> parcel2x.png is an image 16 x 176 (a pile of 11 letters of 16px height each).</li>
     * <li> robot_idle2x.png is an image 40 x 40 </li>
     * </ul>
     * We need to stack a piece of the parcel2x image, for each parcel, as a background image.
     * 
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/background-position
     */
    updateParcels() {
      while (this.parcels.length) this.parcels.pop().remove()
      let heights = {}
      for (let {place, address} of this.worldState.parcels) {
        let height = heights[place] || (heights[place] = 0)
        heights[place] += 14
        let node = document.createElement("div")
        let offset = placeKeys.indexOf(address) * 16
        // The background-position property in CSS allows you to move a background image (or gradient) around within its container.
        node.style.cssText = "position: absolute; height: 16px; width: 16px; background-image: url(img/parcel2x.png); background-position: 0 -" + offset + "px";
        if (place == this.worldState.place) {       // parcel stays with the robot
          node.style.left = "25px"                  // more or less at the middle of the robot width
          node.style.bottom = (20 + height) + "px"  // bottom at the middle of the robot height
          this.robotElt.appendChild(node)
        } else {                                    // parcel is put on a village place
          let pos = places[place]
          node.style.left = (pos.x - 5) + "px"
          node.style.top = (pos.y - 10 - height) + "px"
          this.node.appendChild(node)
        }
        this.parcels.push(node)
      }
    }
    /** Draws a frame of the animation. */
    tick() {
      let {direction, memory} = this.robot(this.worldState, this.robotState)
      this.worldState = this.worldState.move(direction)
      this.robotState = memory
      this.turn++
      this.updateView()
      if (this.worldState.parcels.length == 0) {
        this.button.remove()
        this.text.textContent = ` Finished after ${this.turn} turns`
        this.robotElt.firstChild.src = "img/robot_idle2x.png"
      } else {
        this.schedule()
      }
    }
    /** Schedules one frame of the animation. */
    schedule() {
      this.timeout = setTimeout(() => this.tick(), 1000 / speed)
    }
    /** Start / Stop the animation. */
    clicked() {
      if (this.timeout == null) {
        this.schedule()
        this.button.textContent = "Stop"
        this.robotElt.firstChild.src = "img/robot_moving2x.gif"
      } else {
        clearTimeout(this.timeout)
        this.timeout = null
        this.button.textContent = "Start"
        this.robotElt.firstChild.src = "img/robot_idle2x.png"
      }
    }
  }
  /** 
   * Function added to the window object as a property to
   * trigger the animation process. 
   * @function runRobotAnimation
   * 
   * @param {VillageState} worldState state of the village.
   * @param {robotCallback} robot a robot type (algorithm).
   * @param {Array<string>} robotState route to be followed (memory).
   * @param {boolean} start whether the animation should begin immediately.
   * @returns {Animation} animation object. 
   */
  window.runRobotAnimation = function(worldState, robot, robotState, start) {
    if (active && active.timeout != null)
      clearTimeout(active.timeout)
    active = new Animation(worldState, robot, robotState, start)
    return active
  }
})()