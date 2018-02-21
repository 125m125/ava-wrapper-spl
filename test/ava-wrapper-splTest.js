import sinon from "sinon";
import test from "ava";
import avaWrapperSpl from "../src/ava-wrapper-spl";

var configs = {
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
};

test("all sources are passed to the test case", t => {
    var mockAva = function(name, f, ...args) {
        f(null, ...args);
    };
    var uut = new avaWrapperSpl("./test/resources/miniCalc.json", configs, {
        calc: "./test/resources/miniCalc.js",
        other: "./test/resources/other.js",
    }, mockAva);

    return uut(["PLUS_simple", "MINUS_simple", ], "test", (t2, sources) => {
        t.is(typeof sources.calc, "function");
        t.is(typeof sources.other, "function");
    });
});

test("test runs minimal and maximal positive selections", t => {
    var mockAva = function(name, f, ...args) {
        f(null, ...args);
    };
    var uut = new avaWrapperSpl("./test/resources/miniCalc.json", configs, {
        calc: "./test/resources/miniCalc.js",
        other: "./test/resources/other.js",
    }, mockAva);

    var min = 0,
        max = 0;

    return uut(["PLUS_simple", ], "test", (t, sources) => {
        var result = sources.calc(2, 3);
        if (result == 5)
            ++min;
        if (result == 6)
            ++max;
    }).then(() => {
        t.is(min, 1);
        t.is(max, 1);
    });
});

test("each subtest gets a unique name containing the original name, the configuration name, and the autocompletion type", t => {
    var names = {};
    var mockAva = function(name, f, ...args) {
        t.falsy(names[name]);
        names[name] = true;

        t.true(name.indexOf("testName") >= 0);
        t.true(name.indexOf("PLUS_simple") >= 0 || name.indexOf("MINUS_simple") >= 0);
        t.true(name.indexOf("min") >= 0 || name.indexOf("max") >= 0);
    };
    var uut = new avaWrapperSpl("./test/resources/miniCalc.json", configs, {
        calc: "./test/resources/miniCalc.js",
        other: "./test/resources/other.js",
    }, mockAva);


    return uut(["PLUS_simple", "MINUS_simple", ], "testName");
});
