import Animator from "./Animator.js";

const el1 = document.getElementById("test1");
const anim1 = new Animator(el1);
let acc1 = 0;
const strs = ["PRODUCTIVE", "TRIODE", "CERVID", "TRIPOD", "COEDIT", "TROPIC", "COPIED", "TROUPE", "COPIER", "TRUCED", "COPTER", "UPDIVE", "CORVET", "UPDOVE", "CORVID", "UPTORE", "COUPED", "URETIC", "COUTER", "VECTOR", "COVERT", "VICTOR", "CREDIT", "VIRTUE", "CROUPE", "VOICED", "CROUTE", "VOICER", "CURITE", "VOIDER", "CURVED", "CODRIVE", "CURVET", "CORDITE", "DEPICT", "COURTED", "DEPORT", "COVERUP", "DETOUR", "CUPRITE", "DEVOIR", "CUTOVER", "DEVOUR", "DIOPTER", "DEVOUT", "DIOPTRE", "DIRECT", "DIVORCE", "DIVERT", "EDUCTOR", "DOPIER", "EVICTOR", "DOTIER", "OUTRIDE", "EDITOR", "OUTVIED", "EROTIC", "OVERCUT", "OUTVIE", "OVERTIP", "PERIOD", "OVIDUCT", "PODITE", "PERCOID", "POETIC", "PERIDOT", "PORTED", "PICOTED", "POURED", "PICTURE", "POUTED", "PIVOTED", "POUTER", "POUTIER", "PRECUT", "PREDICT", "PRICED", "PRODUCE", "PRIVET", "PRODUCT", "PROTEI", "PROTEID", "PROVED", "PROVIDE", "PUTRID", "TROUPED", "RECOUP", "VERDICT", "REDIPT", "DEPICTOR", "REDOUT", "OUTCRIED", "REDTOP", "OUTDRIVE", "RIOTED", "OUTPRICE", "ROUPED", "PICTURED", "ROUPET", "OUTPRICED", "ROUTED", "PRODUCTIVE", "TORPID", "TOURED", "TREPID", "TRICED", "TRICEP"];
setInterval(() => {
  anim1.update(strs[acc1++ % strs.length].toString().split(""));
}, 500);

const el2 = document.getElementById("test2");
const anim2 = new Animator(el2,
  {
    createStyle: {
      from: {
        filter: "blur(0.8vmin)",
      },
      to: {
        filter: "blur(0.3vmin)",
        transition: "all 0.8s ease-out",
      }
    },
    removeStyle: {
      from: {
        filter: "blur(0.3vmin)",
      },
      to: {
        filter: "blur(0.8vmin)",
      }
    },
    removeTimeout: 1000,
    moveStyle: {
      from: {
      },
      to: {
      }
    },
    cloneStyle: {
      from: {
        filter: "blur(0.8vmin)",
      },
      to: {
        filter: "blur(0.3vmin)",
        transition: "all 0.8s ease-out",
      }
    }
  }
);
const el2Btn = document.getElementById("increment-btn");
function romanize(num) {
  if (isNaN(num))
      return NaN;
  var digits = String(+num).split(""),
      key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
             "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
             "","I","II","III","IV","V","VI","VII","VIII","IX"],
      roman = "",
      i = 3;
  while (i--)
      roman = (key[+digits.pop() + (i * 10)] || "") + roman;
  return Array(+digits.join("") + 1).join("M") + roman;
}
let acc2 = 0;
el2Btn.addEventListener("click", () => {
  anim2.update(romanize(++acc2).split(""));
  if (acc2 >= 100) el2Btn.innerText = "Incremental";
});


const el3 = document.getElementById("test3");
const anim3 = new Animator(
  el3,
  {
    createStyle: {
      from: {
        opacity: 0,
        transform: "translateY(500%)",
        transition: "all 0.3s ease-in",
      },
      to: {
        transform: "translateY(0)",
        color: "#eee",
        opacity: 1
      }
    },
    removeStyle: {
      from: {
        transform: "scale(1)",
        transition: "all 0.2s ease-out",
      },
      to: {
        opacity: 0,
        transform: "scale(3)",
      }
    },
    removeTimeout: 200,
    moveStyle: {
      from: {
        transform: "rotate(0deg) scale(1.2)",
        transition: "none",
      },
      to: {
        transform: "rotate(360deg) scale(1)",
        transition: "all 0.3s ease-in",
      }
    },
    cloneStyle: {
      from: {
        color: "#37c6fa",
        textShadow: "0 0 5px #37c6fa, 0 0 5px #37c6fa, 0 0 5px #37c6fa",
        transition: "all 0.3s ease-in",
      },
      to: {
        color: "#eee",
        textShadow: "0 0 0 #222, 0 0 0 #222, 0 0 0 #222",
        textShadow: "none",
      }
    }
  }
);
let acc3 = 1;
let g = 5;
const mod = 1_000_000_007;
setInterval(() => {
  anim3.update(acc3.toString().split(""));
  acc3 = (acc3 * g) % mod;
}, 700);
