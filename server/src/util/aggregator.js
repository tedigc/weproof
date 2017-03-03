
export function aggregate(allPairs) {
    
    let commonPatches = [];
    let flattenedPairs = [];

    for(let i=0; i<allPairs.length; i++) {
        flattenedPairs.push(allPairs);
    }

    // console.log(flattenedPairs);

    // comparator for sorting pairs based on left index
    function comparator(a, b) {
        if(a[0] < b[0]) return -1;
        if(a[0] > b[0]) return  1;
        else return 0;
    }

    return commonPatches;
}
