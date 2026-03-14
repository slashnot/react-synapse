import { useEffect, useState } from "react";
import { effect } from "@preact/signals-core";

/* *** ------------------------------------
// useReactiveSignal takes a Preact Signal
// and returns a reactive state that updates
// ---------------------------------------- */
export const useReactiveSignal = ($signal) => {
    const [signal, setSignal] = useState($signal.value);

    useEffect(() => {
        const unSubscribe = effect(() => {
            setSignal($signal.value)
        })
        return unSubscribe
    }, [$signal])
    // --- xx ----
    return signal;
}