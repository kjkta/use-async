import * as React from "react";
var AsyncStates;
(function (AsyncStates) {
    AsyncStates["Idle"] = "Idle";
    AsyncStates["Pending"] = "Pending";
    AsyncStates["Success"] = "Success";
    AsyncStates["Error"] = "Error";
})(AsyncStates || (AsyncStates = {}));
export function useAsyncStatus(asyncFn, successTimeout // How long Success state is active until reverting to Idle
) {
    const [{ status, lastResult, lastError }, updateState] = React.useState({
        status: AsyncStates.Idle,
        lastResult: null,
        lastError: null,
    });
    // Thing that calls the async function
    async function trigger(...args) {
        updateState((state) => ({ ...state, status: AsyncStates.Pending }));
        try {
            const result = await asyncFn(...args);
            updateState((state) => ({
                ...state,
                status: AsyncStates.Success,
                lastResult: result,
            }));
            if (successTimeout !== undefined) {
                // Reset to Idle state
                setTimeout(function () {
                    updateState((state) => ({
                        ...state,
                        status: AsyncStates.Idle,
                    }));
                }, successTimeout);
            }
            // Return the result of the async function
            return result;
        }
        catch (error) {
            updateState((state) => ({
                ...state,
                status: AsyncStates.Error,
                lastError: error,
            }));
            // Return the error
            return error;
        }
    }
    function reset() {
        updateState((state) => ({
            ...state,
            status: AsyncStates.Idle,
            lastResult: null,
            lastError: null,
        }));
    }
    return { trigger, status, lastResult, lastError, reset };
}
