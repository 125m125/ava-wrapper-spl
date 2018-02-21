//? if (OTHER)
import other from "./other";

export default function op(a, b) {
    //? if (SWAP) {
    var tmp = a;
    a = b;
    b = tmp;
    //? }
    //? if (INCREMENT_A)
    ++a;
    //? if (INCREMENT_B)
    ++b;
    //? if(PLUS) 
    return a + b;
    //? if (MINUS)
    return a - b;
    //? if (OTHER)
    return other(a, b);
}
