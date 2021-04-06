import robot from 'robotjs';
import {default as config} from "./config.json";
import parse_ms from 'parse-ms';

//Declaring All variables
const websites = config.websites;
const pos = config.pos;
let times = 0;
let started;

console.log("Launching in 5 seconds...")
setTimeout(function () {
    console.log("Launching...");
    started = Date.now();
    //Init to Search Bar
    robot.moveMouseSmooth(pos.search_bar.x, pos.search_bar.y); //Search Bar
    robot.mouseClick()
    visitAndClose(websites[0], 0)
}, 5000)

function visitAndClose(url, index) {
    if(config.limit !== 0 && times >= config.limit) {
        stop(times);
        return;
    }
    if (index >= websites.length) {
        if(config.loop === true) {
            visitAndClose(websites[0], 0);
        } else {
            stop(times);
            return;
        }
    }
    //Type URL in search Bar
    robot.typeString(url);
    robot.keyTap("enter");
    wait(500);
    //Scroll page to make actions
    robot.moveMouseSmooth(pos.scroll_bar.start.x, pos.scroll_bar.start.y);
    robot.mouseToggle("down");
    robot.moveMouseSmooth(pos.scroll_bar.stop.x, pos.scroll_bar.stop.y);
    robot.mouseToggle("up");
    //Wait a few seconds to load page and close page
    setTimeout(function () {
        console.log("Close tab")
        //Create a new Tab
        robot.moveMouseSmooth(pos.new_tab.x, pos.new_tab.y); //New Tab
        robot.mouseClick();
        wait(500);
        //Go back to the first tab
        robot.moveMouseSmooth(pos.first_tab.x, pos.first_tab.y); //First Tab
        robot.mouseClick()
        wait(500);
        //Close the tab
        robot.keyTap("w", "control")
        wait(500);
        //Come back to the search bar
        robot.moveMouseSmooth(pos.search_bar.x, pos.search_bar.y); //Search Bar
        robot.mouseClick()
        times++
        visitAndClose(websites[index + 1], index + 1);
    }, config.stayOnPage)
}

function wait(ms) {
    const start = new Date().getTime();
    let end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

function stop(times) {
    console.log("Stopping...");
    console.log(`Executed ${times} times!`);
    const elapsed = parse_ms(Date.now() - started);
    let answer = [];
    if(elapsed.days) {
        answer.push(`${elapsed.days} day(s)`);
    }
    if(elapsed.hours) {
        answer.push(`${elapsed.hours} hour(s)`)
    }
    if(elapsed.minutes) {
        answer.push(`${elapsed.minutes} minute(s)`)
    }
    if(elapsed.seconds) {
        answer.push(`${elapsed.seconds} second(s)`)
    }
    console.log(`Elapsed ${answer.join(', ')}`)
}