import {
    JSONSerializer,
    Model
} from "splconfigurator";
import RollupPluginSpl from "rollup-plugin-spl";
import _ from "underscore";
import {
    readFileSync
} from "fs";

var serializer = new JSONSerializer();

export default function avaWrapperSPL(model, configurations, sources, ava) {
    this.ava = ava || require("ava");
    if (model instanceof Model) {
        model = model.serializeModel(serializer);
    } else if (typeof model === "string") {
        if (model.indexOf(".") >= 0 || model.indexOf("/") >= 0) {
            model = JSON.parse(readFileSync(model, "utf-8"));
        } else {
            model = JSON.parse(model);
        }
    }
    this.configurations = _.mapObject(configurations, val => {
        return {
            max: createContext(model, val, sources, true),
            min: createContext(model, val, sources, false),
        };
    });
    return this.test.bind(this);
}

function createContext(model, config, sources, preference) {
    var rp = new RollupPluginSpl({
        model: serializer.deserializeModel(model),
        config: config,
        autocomplete: {
            preference: preference,
        },
    });
    return Promise.all(_.keys(sources).map(val => rp.quickRollup(sources[val]).then(r => [val, r, ]))).then(_.object);
    //return _.mapObject(sources, val => rp.quickRollup(val));
}

avaWrapperSPL.prototype.test = function(configs, title, implementation, ...args) {
    if (configs instanceof Array) {
        return Promise.all(configs.map(config => {
            config = this.configurations[config];
            if (!config) throw new Error("unknown configuration: " + config);
            return Promise.all(_.map(config, (value, key) => {
                return value.then(v => this.ava(title, t => {
                    implementation(t, v, ...args);
                }, key, ...args));
            }));
        }));
    } else {
        return this.ava(configs, title, implementation, ...args);
    }
};
