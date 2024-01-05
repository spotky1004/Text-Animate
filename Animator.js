import typeEqualize from "./util/typeEqulize.js";
import matchPoints from "./util/matchPoints.js";
import applyProperties from "./util/applyProperties.js";

/**
 * @typedef {keyof import("./util/csstype").StandardProperties} CSSProps 
 * @typedef {{ [Prop in CSSProps]: string }} Styles 
 * 
 * @typedef TransitionStyle 
 * @prop {Styles} from 
 * @prop {Styles} to 
 * 
 * @typedef AnimatorOptions 
 * @prop {TransitionStyle} createStyle 
 * @prop {TransitionStyle} removeStyle 
 * @prop {number} removeTimeout 
 * @prop {TransitionStyle} moveStyle 
 * @prop {TransitionStyle} cloneStyle 
 */

/** @type {AnimatorOptions} */
const defaultOptions = {
  createStyle: {
    from: {
      opacity: 0,
      transition: "all 0.4s ease-out",
    },
    to: {
      opacity: 1
    }
  },
  removeStyle: {
    from: {
      opacity: 1,
      transition: "all 0.2s ease-out",
    },
    to: {
      opacity: 0
    }
  },
  removeTimeout: 1000,
  moveStyle: {
    from: {},
    to: {}
  },
  cloneStyle: {
    from: {
      transition: "all 0.4s ease-out",
    },
    to: {
      
    }
  }
};

const TRANSITION_DELAY = 20;
const classNames = {
  SIMULATOR: "animator__simulator",
  REMOVED: "animator__removed",
  SEGMENT: "animator__segment",
};

function updateElement(el, from, to, [x1, y1], [x2, y2]) {
  applyProperties(el, from);
  el.style.left = x1 + "px";
  el.style.top = y1 + "px";
  setTimeout(() => {
    applyProperties(el, to);
    el.style.left = x2 + "px";
    el.style.top = y2 + "px";
  }, TRANSITION_DELAY);
}


export default class Animator {
  /** @type {HTMLElement} */
  el = null;
  /** @type {HTMLElement} */
  clone = null;
  /** @type {string[]} */
  curContent = [];
  /** @type {AnimatorOptions} */
  options = JSON.parse(JSON.stringify(defaultOptions));

  /**
   * @param {HTMLElement} el 
   * @param {AnimatorOptions} options 
   */
  constructor(el, options) {
    this.el = el;
    this.el.style.position = "relative !important";

    this.clone = el.cloneNode();
    this.clone.classList.add(classNames.SIMULATOR);
    this.clone.style.display = "none !important";
    this.clone.style.visibility = "hidden !important";

    this.options = typeEqualize(this.options, options);
  }

  /**
   * @param {string[]} content 
   */
  update(content) {
    /** @type {[x: number, y: number][]} */
    const curSegPositions = [];
    /** @type {Map<string, number[]>} */
    const curSegIdxMap = new Map();
    for (let i = 0; i < this.el.children.length; i++) {
      const el = this.el.children[i];

      const text = !el.classList.contains(classNames.REMOVED) ? el.innerText : null;

      curSegPositions.push([el.offsetLeft, el.offsetTop]);
      if (text !== null) {
        if (!curSegIdxMap.has(text)) curSegIdxMap.set(text, []);
        curSegIdxMap.get(text).push(i);
      }
    }

    /** @type {Map<string, number[]>} */
    const simSegIdxMap = new Map();
    this.clone.innerText = "";
    for (let i = 0; i < content.length; i++) {
      const text = content[i];

      const el = document.createElement("span");
      el.innerText = text;
      el.classList.add(classNames.SEGMENT);
      this.clone.appendChild(el);
      
      if (!simSegIdxMap.has(text)) simSegIdxMap.set(text, []);
      simSegIdxMap.get(text).push(i);
    }

    this.el.parentElement.insertBefore(this.clone, this.el);
    this.clone.style.display = "";
    this.el.style.width = this.clone.offsetWidth + "px";
    this.el.style.height = this.clone.offsetHeight + "px";

    for (const [text, simIdxes] of simSegIdxMap) {
      const curIdxes = curSegIdxMap.get(text);
      curSegIdxMap.delete(text);

      const curPoses = curIdxes ? curIdxes.map(idx => curSegPositions[idx]) : [];
      const simPoses = simIdxes.map(idx => {
        const el = this.clone.children[idx];
        return [el.offsetLeft, el.offsetTop];
      });
      
      if (typeof curIdxes !== "undefined") {
        const [curMatch, simMatch] = matchPoints(curPoses, simPoses);
        for (let i = 0; i < curIdxes.length; i++) {
          const curIdx = curIdxes[i];
          const el = this.el.children[curIdx];
          if (curMatch[i] !== -1) {
            // move
            updateElement(
              el,
              this.options.moveStyle.from, this.options.moveStyle.to,
              curPoses[i], simPoses[curMatch[i]]
            );
          } else {
            // remove
            el.classList.add(classNames.REMOVED);
            updateElement(
              el,
              this.options.removeStyle.from, this.options.removeStyle.to,
              curPoses[i], curPoses[i]
            );
            setTimeout(() => {
              el.remove();
            }, TRANSITION_DELAY + this.options.removeTimeout);
          }
        }
        // clone
        for (let i = 0; i < simIdxes.length; i++) {
          if (curMatch[simMatch[i]] === i) continue;

          const el = document.createElement("span");
          el.innerText = text;
          el.style.position = "absolute";
          el.style.left = "0px";
          el.style.top = "0px";
          el.classList.add(classNames.SEGMENT);
          this.el.append(el);
          updateElement(
            el,
            this.options.cloneStyle.from, this.options.cloneStyle.to,
            curPoses[simMatch[i]], simPoses[i]
          );
        }
      } else {
        // create
        for (let i = 0; i < simPoses.length; i++) {
          const el = document.createElement("span");
          el.innerText = text;
          el.style.position = "absolute";
          el.style.left = "0px";
          el.style.top = "0px";
          el.classList.add(classNames.SEGMENT);
          this.el.append(el);
          updateElement(
            el,
            this.options.createStyle.from, this.options.createStyle.to,
            simPoses[i], simPoses[i]
          );
        }
      }
    }
    // remove
    for (const [, curIdxes] of curSegIdxMap) {
      for (const idx of curIdxes) {
        const el = this.el.children[idx];
        el.classList.add(classNames.REMOVED);
        updateElement(
          el,
          this.options.removeStyle.from, this.options.removeStyle.to,
          curSegPositions[idx], curSegPositions[idx]
        );
        setTimeout(() => {
          el.remove();
        }, TRANSITION_DELAY + this.options.removeTimeout);
      }
    }
    this.clone.style.display = "none !important";
    this.clone.remove();
  }
}
