import { StrategyItem, RadarStrategyParm } from "./interfaces";
import { maxBy } from "lodash";

const solver = require('javascript-lp-solver');

export const solve = (strategy: StrategyItem[], axes: RadarStrategyParm): StrategyItem[] => {
    const axesKeys = Object.keys(axes).filter(k => axes[k] === true);
    const retStrategy = strategy.map(h=>({...h,suggestedDelta:0,suggestionAccepted:false}));

    if ( axesKeys.length===0) return retStrategy;

    const maxWeight = Math.min(.5, maxBy(strategy, v=>v.currentWeight)!.currentWeight  * 1.5);

    let variables = retStrategy.reduce((prev, curr) => {
        let item = { 'total': 1, ['weight_' + curr.security.IsinCode]: 1 };
        axesKeys.forEach(ak => {
            item[ak] = curr.radar[ak];
        });
        prev[curr.security.IsinCode] = item;
        return prev;
    }, {});

    let constraints = retStrategy.reduce((prev, curr) => {
        prev['weight_' + curr.security.IsinCode] = {
            min: 0,
            max: maxWeight
        }
        return prev;
    }, { 'total': { 'equal': 1 } });

    let optimize = axesKeys.reduce((prev, curr) => {
        prev[curr] = 'min';
        return prev;
    }, {});

    const model = {
        optimize, constraints, variables
    };
    let ret = solver.MultiObjective (model);

    if ( ret.midpoint.feasible) {
        return retStrategy.map(h => {
            const w = ret.midpoint[h.security.IsinCode]  || 0;
            return {...h, suggestedDelta: w-h.currentWeight};
        });
    }

    return retStrategy.map(h => ({ ...h, suggestedDelta: 0.01 }));
}
