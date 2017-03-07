// a comparator that sorts arrays of pairs based on their left index
function comparator(a, b) {
  if(a[0] < b[0]) return -1;
  if(a[0] > b[0]) return  1;
  else return 0;
}

// sort and merge an array of possibly overlapping patches
export default function mergePatches(patches) {
  
  // sort patches based on left index
  patches = patches.sort(comparator);

  let merged = [];
  let currentPair = patches[0];
  for(let i=0; i<patches.length; i++) {
    if(currentPair[1] >= patches[i][0]) {
      // pairs overlap
      currentPair[1] = Math.max(currentPair[1], patches[i][1]);
    } else {
      merged.push(currentPair);
      currentPair = patches[i];
    }
  }
  merged.push(currentPair);

  return merged;
}