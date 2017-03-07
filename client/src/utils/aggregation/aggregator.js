// comparator for sorting pairs based on left index
function comparator(a, b) {
    if(a[0] < b[0]) return -1;
    if(a[0] > b[0]) return  1;
    else return 0;
}

// returns the intersection between two overlapping pairs, sorted by their left index
export function intersect(pair1, pair2) {

    let leftIdx  = pair2[0];
    let rightIdx = pair1[1];   

    return [leftIdx, rightIdx];
}

export function aggregate(textLength, allPatches) {
    
    /**
     *
     * find all highlights
     * sort by left index
     * check for overlaps
     * remember that two basic (unmerged) pairs *must* be from different user submissions
     *
     * rather than merging two pairs, save the intersection between them
     * for each pass, increment some counter indicating the depth
     * when the intersection chain breaks, store that depth level and restart
     * that depth level represents the number of users who agree on that patch
     *
     * with the final intersections, move the ends of each pair to the beginning and end of the word so they appear sensible
     * 
     **/

    /**
     * Keep a 'heat map' that records how many occurences a character in the text has been highlighted
     * Update each time a piece of text is submitted
     */

    let flattenedPatches = [].concat.apply([], allPatches);
    flattenedPatches = flattenedPatches.sort(comparator);

    // init heatmap
    let heatmap = [];
    for(let i=0; i<textLength; i++) {
        heatmap.push(0);
    }

    return true;
}