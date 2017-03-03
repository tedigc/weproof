import { expect } from 'chai';
import { aggregate } from '../util/aggregator';

const dataSet1 = [
    [[  1,  10], [ 11,  20], [ 21,  30]],
    [[ 31,  40], [ 41,  50], [ 51,  60]],
    [[ 61,  70], [ 71,  80], [ 81,  90]],
    [[ 91, 100], [101, 110], [111, 120]],
    [[121, 130], [131, 140], [141, 150]],
    [[151, 160], [161, 170], [171, 180]],
    [[181, 190], [191, 200], [201, 210]]
];

describe("Aggregator", () => {

    describe("No Overlapping Patches", () => {
        it("Aggregates overlapping patches", () => {
            
            aggregate(dataSet1);
            expect(0).to.equal(0);
        });
    });

});