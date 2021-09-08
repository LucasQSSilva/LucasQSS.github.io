/**
 * @file
 *
 * Summary.
 * <p>A mail-delivery robot picking up and dropping off parcels.</p>
 *
 * @author Paulo Roma
 * @since 24/07/2021
 *
 * @see https://techsparx.com/nodejs/esnext/dynamic-import-2.html
 * @see https://nodejs.medium.com/announcing-core-node-js-support-for-ecmascript-modules-c5d6dc29b663
 */

import * as readlineSync from "readline-sync";

import * as robot from "./07a_robot.js"

console.log(robot.roadGraph);

var rtypes = [robot.randomRobot, robot.routeRobot, robot.goalOrientedRobot, robot.lazyRobot, robot.dijkstraRobot, robot.dijkstraRobot2];

var nparcels, type, argv = (process.argv);
if (argv.length > 2) {
   nparcels = argv[2];
   type = (argv[3] % rtypes.length) || 2;
} else {
  nparcels = readlineSync.question('Number of parcels? ') || 15;
  type = readlineSync.question('Robot type? ') % rtypes.length || 2;
}

var task = robot.VillageState.random(nparcels);

console.log(`Robot Type: ${rtypes[type].prototype.constructor.name} `);
console.log(`Number of Parcels: ${nparcels}`);

robot.runRobot(task, rtypes[type], []);

/**
 * Counts the number of steps to deliver all parcels.
 * 
 * @param {VillageState} state village state.
 * @param {robotCallback} robot returns the direction to follow based on the robot type.
 * @param {Array<string>} memory robot route.
 * @returns {number} steps.
 */
function countSteps(state, robot, memory) {
  for (let steps = 0;; steps++) {
    if (state.parcels.length == 0) return steps;
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
  }
}

/**
 * Prints the average number of steps of running a given number of random tasks for each robot to solve.
 * 
 * @param {Array<robot>} r robots to be compared.
 * @param {number} n number of parcels in each task.
 * @param {number} t number of random tasks.
 */
function compareRobots(r,n,t) {
  let total = Array(r.length).fill(0);
  for (let i = 0; i < t; i++) {
    let state = robot.VillageState.random(n);
    for (let [index,robot] of r.entries()) {
       total[index] += countSteps(state, robot, []);
    }
  }
  for (let [index,robot] of r.entries()) {
    console.log(`Robot ${robot.prototype.constructor.name} needed ${total[index] / t} steps per task`)
  }
}

compareRobots(rtypes,nparcels,100);
