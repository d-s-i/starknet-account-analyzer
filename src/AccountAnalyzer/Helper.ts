import { BigNumber } from "ethers";
import { RangeMilestones } from "./types";

const _importDynamic = new Function("modulePath", "return import(modulePath)");

export class Helper {

    static HOUR_PER_DAY = 24;
    static MIN_PER_HOUR = 60;
    static MIN_PER_DAY = Helper.HOUR_PER_DAY * Helper.MIN_PER_HOUR;

    static async fetch (...args: any) {
        const { default: fetch } = await _importDynamic("node-fetch");
        return fetch(...args);
    }
    
    static async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    static forceCast(value: any) {
        return value;
    }
    
    static toBigIntStr(str: string) {
        return BigNumber.from(str).toBigInt().toString();
    }
    
    static uint256ToBN(num: { low: string, high: string }) {
        return BigNumber.from(num.low).add(num.high);
    }

    static getFormatedDate() {
        return new Date().toLocaleDateString("fr-FR", { year: 'numeric', month: 'numeric', day: 'numeric' }).split("/").join("-");
    }
    
    static displayProgress(
        { milestoneOne, milestoneTwo, milestoneThree, milestoneFour } : RangeMilestones,
        currentIndex: number,
        actionName: string
    ) {
    
        if(currentIndex === milestoneOne) {
            console.log(`25% of ${actionName} done (${currentIndex}/${milestoneFour})`);
        } else if(currentIndex === milestoneTwo) {
            console.log(`50% of ${actionName} done (${currentIndex}/${milestoneFour})`);
        } else if(currentIndex === milestoneThree) {
            console.log(`75% of ${actionName} done (${currentIndex}/${milestoneFour})`);
        } else if(currentIndex === milestoneFour) {
            console.log(`100% of ${actionName} done (${currentIndex}/${milestoneFour})`);
        } else {
            // console.log(`${currentIndex}/${milestoneFour} done`);
        }
    
    }
    
    /**
        @dev Function to retreive milestones from a range. Used to display progress of a long indexed action.
    */
    static getMilestones(start: number, end: number) {
        const length = end - start;
        let indexes = [];
        for(let i = 0; i <= length; i++) {
            indexes.push(start + i);
        }
    
        const milestones = {
            milestoneOne: indexes[Math.trunc(length / 4)],
            milestoneTwo: indexes[Math.trunc(length / 2)],
            milestoneThree: indexes[Math.trunc(3 * length / 4)],
            milestoneFour: indexes[length]
        };
    
        return milestones;
    }
}