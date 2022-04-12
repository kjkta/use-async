import * as React from "react";

export enum AsyncStates {
  Idle = "Idle",
  Pending = "Pending",
  Success = "Success",
  Error = "Error",
}

interface State<SuccessReturnValue, ErrorReturnValue> {
  lastResult: SuccessReturnValue | null;
  lastError: ErrorReturnValue | null;
  status: AsyncStates;
}

export function useAsyncStatus<SuccessReturnValue, ErrorReturnValue>(
  asyncFn: (...args: any[]) => Promise<SuccessReturnValue>,
  deps: React.DependencyList = [],
  successTimeout?: number // How long Success state is active until reverting to Idle
): {
  trigger: (...args: any[]) => Promise<SuccessReturnValue | ErrorReturnValue>;
  reset: () => void;
} & State<SuccessReturnValue, ErrorReturnValue> {
  const [{ status, lastResult, lastError }, updateState] = React.useState<
    State<SuccessReturnValue, ErrorReturnValue>
  >({
    status: AsyncStates.Idle,
    lastResult: null,
    lastError: null,
  });

  // Thing that calls the async function
  const trigger = React.useCallback(
    async function trigger(
      ...args: any[]
    ): Promise<SuccessReturnValue | ErrorReturnValue> {
      updateState((state: State<SuccessReturnValue, ErrorReturnValue>) => ({
        ...state,
        status: AsyncStates.Pending,
      }));
      try {
        const result = await asyncFn(...args);
        updateState((state: State<SuccessReturnValue, ErrorReturnValue>) => ({
          ...state,
          status: AsyncStates.Success,
          lastResult: result,
        }));
        if (successTimeout !== undefined) {
          // Reset to Idle state
          setTimeout(function () {
            updateState(
              (state: State<SuccessReturnValue, ErrorReturnValue>) => ({
                ...state,
                status: AsyncStates.Idle,
              })
            );
          }, successTimeout);
        }
        // Return the result of the async function
        return result;
      } catch (error) {
        updateState((state: State<SuccessReturnValue, ErrorReturnValue>) => ({
          ...state,
          status: AsyncStates.Error,
          lastError: error,
        }));
        // Return the error
        return error;
      }
    },
    [successTimeout, ...deps]
  );

  const reset = React.useCallback(function reset() {
    updateState((state: State<SuccessReturnValue, ErrorReturnValue>) => ({
      ...state,
      status: AsyncStates.Idle,
      lastResult: null,
      lastError: null,
    }));
  }, [])
  return { trigger, status, lastResult, lastError, reset };
}
