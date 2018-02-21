import sinon from "sinon";
import test from "ava";
import avaWrapperSpl from "../src/ava-wrapper-spl";


test("test runs minimal and maximal positive selections", t => {
    var mockAva = function(name, f, ...args) {
        f(name, ...args);
    };
    var uut = new avaWrapperSpl("./test/resources/miniCalc.json", {
        PLUS_simple: {
            PLUS: true,
            INCREMENT_A: false,
            // INCREMENT_B: false, 
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
    }, mockAva);

    var min = 0,
        max = 0;

    return uut(["PLUS_simple", ], "test", (t, sources) => {
        console.log(sources);
        var result = sources.calc(2, 3);
        console.log(result);
        if (result == 5)
            ++min;
        if (result == 6)
            ++max;
    }).then(() => {
        t.is(min, 1);
        t.is(max, 1);
    });
});
