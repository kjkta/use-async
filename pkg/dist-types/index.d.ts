declare enum AsyncStates {
    Idle = "Idle",
    Pending = "Pending",
    Success = "Success",
    Error = "Error"
}
export declare function useAsyncStatus(asyncFn: Function, successTimeout: number): {
    trigger: (...args: any[]) => Promise<any>;
    status: AsyncStates;
    lastResult: any;
    lastError: any;
    reset: () => void;
};
export {};
