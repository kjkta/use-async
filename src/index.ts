import * as React from "react";

export enum AsyncStates {
  Idle = "Idle",
  Pending = "Pending",
  Success = "Success",
  Error = "Error",
}

interface State {
  status: AsyncStates;
  lastResult: any;
  lastError: any;
}

export function useAsyncStatus(
  asyncFn: Function,
  asyncFnDependencies?: any[],
  successTimeout?: number // How long Success state is active until reverting to Idle
) {
  const [{ status, lastResult, lastError }, updateState] = React.useState<
    State
  >({
    status: AsyncStates.Idle,
    lastResult: null,
    lastError: null,
  });

  // Apply dependencies if they are passed
  asyncFn = React.useCallback(asyncFn, asyncFnDependencies)

  // Thing that calls the async function
  async function trigger(...args: any[]) {
    updateState((state: State) => ({ ...state, status: AsyncStates.Pending }));
    try {
      const result = await asyncFn(...args);
      updateState((state: State) => ({
        ...state,
        status: AsyncStates.Success,
        lastResult: result,
      }));
      if (successTimeout !== undefined) {
        // Reset to Idle state
        setTimeout(function () {
          updateState((state: State) => ({
            ...state,
            status: AsyncStates.Idle,
          }));
        }, successTimeout);
      }
      // Return the result of the async function
      return result;
    } catch (error) {
      updateState((state: State) => ({
        ...state,
        status: AsyncStates.Error,
        lastError: error,
      }));
      // Return the error
      return error;
    }
  }
  function reset() {
    updateState((state: State) => ({
      ...state,
      status: AsyncStates.Idle,
      lastResult: null,
      lastError: null,
    }));
  }
  return { trigger, status, lastResult, lastError, reset };
}
