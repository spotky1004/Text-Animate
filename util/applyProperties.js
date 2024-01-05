/**
 * @param {HTMLElement} el 
 * @param {{ [K: string]: string }} props 
 */
export default function applyProperties(el, props) {
  for (const prop in props) {
    el.style[prop] = props[prop];
  }
}
