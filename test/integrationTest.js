import avaWrapperSpl from "../src/ava-wrapper-spl";

var test = new avaWrapperSpl("./test/resources/miniCalc.json", {
    PLUS_simple: {
        PLUS: true,
        INCREMENT_A: false,
        INCREMENT_B: false,
    },
    MINUS_simple: {
        MINUS: true,
        INCREMENT_A: false,
        INCREMENT_B: false,
        SWAP: false,
    },
    MINUS_complex: {
        MINUS: true,
    },
}, {
    calc: "./test/resources/miniCalc.js",
    other: "./test/resources/other.js",
});

test(["PLUS_simple", "MINUS_simple", ], "neutral element for addition and substraction", (t, sources) => {
    t.is(sources.calc(15, 0), 15);
});
