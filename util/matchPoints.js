/**
 * @typedef {[x: number, y: number][]} PointGroup 
 */

/**
 * match closest 1 -> 2 without duplicates, and match closest 2 -> 1 that didn't matched before
 * @param {PointGroup} group1 
 * @param {PointGroup} group2 
 * @returns {[match1: number[], match2: number[]]} 
 */
export default function matchPoints(group1, group2) {
  const n = group1.length;
  const m = group2.length;

  /** @type {[i: number, j: number, dist: number][]} */
  const dists = [];
  for (let i = 0; i < n; i++) {
    const [x1, y1] = group1[i];
    for (let j = 0; j < m; j++) {
      const [x2, y2] = group2[j];
      dists.push([i, j, (y1 - y2)**2 + (x1 - x2)**2])
    }
  }
  dists.sort((a, b) => a[2] - b[2]);

  /** @type {number[]} */
  const match1 = Array(n).fill(-1);
  /** @type {number[]} */
  const match2 = Array(m).fill(-1);
  for (const [i, j, dist] of dists) {
    if (match1[i] !== -1 || match2[j] !== -1) continue;
    match1[i] = j;
    match2[j] = i;
  }
  for (const [i, j] of dists) {
    if (match2[j] !== -1) continue;
    match2[j] = i;
  }

  return [match1, match2];
}
