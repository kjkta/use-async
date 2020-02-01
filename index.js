import React from "react";

export const ASYNC_STATES = {
  IDLE: "IDLE",
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR"
};

export function useAsyncStatus(
  asyncFn,
  successTimeout // How long SUCCESS state is active until reverting to IDLE
) {
  const [{ status, lastResult, lastError }, updateState] = React.useState({
    status: ASYNC_STATES.IDLE,
    lastResult: null,
    lastError: null
  });

  // Thing that calls the async function
  async function trigger(...args) {
    updateState(state => ({ ...state, status: ASYNC_STATES.PENDING }));
    try {
      const result = await asyncFn(...args);
      updateState(state => ({
        ...state,
        status: ASYNC_STATES.SUCCESS,
        lastResult: result
      }));
      if (successTimeout !== undefined) {
        // Reset to IDLE state
        setTimeout(function() {
          updateState(state => ({ ...state, status: ASYNC_STATES.IDLE }));
        }, successTimeout);
      }
    } catch (error) {
      updateState(state => ({
        ...state,
        status: ASYNC_STATES.ERROR,
        lastError: error
      }));
    }
  }
  function reset() {
    updateState(state => ({
      ...state,
      status: ASYNC_STATES.IDLE,
      lastResult: null,
      lastError: null
    }));
  }
  return { trigger, status, lastResult, lastError, reset };
}
