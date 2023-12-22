export namespace CdpV8 {
  export type integer = number;

  /**
   * The list of domains.
   */
  export interface Domains {

    Console: ConsoleApi;
    Debugger: DebuggerApi;
    HeapProfiler: HeapProfilerApi;
    Profiler: ProfilerApi;
    Runtime: RuntimeApi;
    Schema: SchemaApi;
  }

  /**
   * Methods and events of the 'Console' domain.
   */
  export interface ConsoleApi {
    requests: {
      /**
       * Does nothing.
       */
      clearMessages: { params: Console.ClearMessagesParams, result: Console.ClearMessagesResult }

      /**
       * Disables console domain, prevents further console messages from being reported to the client.
       */
      disable: { params: Console.DisableParams, result: Console.DisableResult }

      /**
       * Enables console domain, sends the messages collected so far to the client by means of the
       * `messageAdded` notification.
       */
      enable: { params: Console.EnableParams, result: Console.EnableResult }
    };
    events: {

      /**
       * Issued when new console message is added.
       */
      messageAdded: { params: Console.MessageAddedEvent };
    };
  }

  /**
   * Types of the 'Console' domain.
   */
  export namespace Console {
    /**
     * Parameters of the 'Console.clearMessages' method.
     */
    export interface ClearMessagesParams {
    }

    /**
     * Return value of the 'Console.clearMessages' method.
     */
    export interface ClearMessagesResult {
    }

    /**
     * Parameters of the 'Console.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'Console.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'Console.enable' method.
     */
    export interface EnableParams {
    }

    /**
     * Return value of the 'Console.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'Console.messageAdded' event.
     */
    export interface MessageAddedEvent {
      /**
       * Console message that has been added.
       */
      message: ConsoleMessage;
    }

    /**
     * Console message.
     */
    export interface ConsoleMessage {
      /**
       * Message source.
       */
      source: 'xml' | 'javascript' | 'network' | 'console-api' | 'storage' | 'appcache' | 'rendering' | 'security' | 'other' | 'deprecation' | 'worker';

      /**
       * Message severity.
       */
      level: 'log' | 'warning' | 'error' | 'debug' | 'info';

      /**
       * Message text.
       */
      text: string;

      /**
       * URL of the message origin.
       */
      url?: string;

      /**
       * Line number in the resource that generated this message (1-based).
       */
      line?: integer;

      /**
       * Column number in the resource that generated this message (1-based).
       */
      column?: integer;
    }
  }

  /**
   * Methods and events of the 'Debugger' domain.
   */
  export interface DebuggerApi {
    requests: {
      /**
       * Continues execution until specific location is reached.
       */
      continueToLocation: { params: Debugger.ContinueToLocationParams, result: Debugger.ContinueToLocationResult }

      /**
       * Disables debugger for given page.
       */
      disable: { params: Debugger.DisableParams, result: Debugger.DisableResult }

      /**
       * Enables debugger for the given page. Clients should not assume that the debugging has been
       * enabled until the result for this command is received.
       */
      enable: { params: Debugger.EnableParams, result: Debugger.EnableResult }

      /**
       * Evaluates expression on a given call frame.
       */
      evaluateOnCallFrame: { params: Debugger.EvaluateOnCallFrameParams, result: Debugger.EvaluateOnCallFrameResult }

      /**
       * Returns possible locations for breakpoint. scriptId in start and end range locations should be
       * the same.
       */
      getPossibleBreakpoints: { params: Debugger.GetPossibleBreakpointsParams, result: Debugger.GetPossibleBreakpointsResult }

      /**
       * Returns source for the script with given id.
       */
      getScriptSource: { params: Debugger.GetScriptSourceParams, result: Debugger.GetScriptSourceResult }

      disassembleWasmModule: { params: Debugger.DisassembleWasmModuleParams, result: Debugger.DisassembleWasmModuleResult }

      /**
       * Disassemble the next chunk of lines for the module corresponding to the
       * stream. If disassembly is complete, this API will invalidate the streamId
       * and return an empty chunk. Any subsequent calls for the now invalid stream
       * will return errors.
       */
      nextWasmDisassemblyChunk: { params: Debugger.NextWasmDisassemblyChunkParams, result: Debugger.NextWasmDisassemblyChunkResult }

      /**
       * This command is deprecated. Use getScriptSource instead.
       * @deprecated
       */
      getWasmBytecode: { params: Debugger.GetWasmBytecodeParams, result: Debugger.GetWasmBytecodeResult }

      /**
       * Returns stack trace with given `stackTraceId`.
       */
      getStackTrace: { params: Debugger.GetStackTraceParams, result: Debugger.GetStackTraceResult }

      /**
       * Stops on the next JavaScript statement.
       */
      pause: { params: Debugger.PauseParams, result: Debugger.PauseResult }

      /**
       * undefined
       * @deprecated
       */
      pauseOnAsyncCall: { params: Debugger.PauseOnAsyncCallParams, result: Debugger.PauseOnAsyncCallResult }

      /**
       * Removes JavaScript breakpoint.
       */
      removeBreakpoint: { params: Debugger.RemoveBreakpointParams, result: Debugger.RemoveBreakpointResult }

      /**
       * Restarts particular call frame from the beginning. The old, deprecated
       * behavior of `restartFrame` is to stay paused and allow further CDP commands
       * after a restart was scheduled. This can cause problems with restarting, so
       * we now continue execution immediatly after it has been scheduled until we
       * reach the beginning of the restarted frame.
       * 
       * To stay back-wards compatible, `restartFrame` now expects a `mode`
       * parameter to be present. If the `mode` parameter is missing, `restartFrame`
       * errors out.
       * 
       * The various return values are deprecated and `callFrames` is always empty.
       * Use the call frames from the `Debugger#paused` events instead, that fires
       * once V8 pauses at the beginning of the restarted function.
       */
      restartFrame: { params: Debugger.RestartFrameParams, result: Debugger.RestartFrameResult }

      /**
       * Resumes JavaScript execution.
       */
      resume: { params: Debugger.ResumeParams, result: Debugger.ResumeResult }

      /**
       * Searches for given string in script content.
       */
      searchInContent: { params: Debugger.SearchInContentParams, result: Debugger.SearchInContentResult }

      /**
       * Enables or disables async call stacks tracking.
       */
      setAsyncCallStackDepth: { params: Debugger.SetAsyncCallStackDepthParams, result: Debugger.SetAsyncCallStackDepthResult }

      /**
       * Replace previous blackbox patterns with passed ones. Forces backend to skip stepping/pausing in
       * scripts with url matching one of the patterns. VM will try to leave blackboxed script by
       * performing 'step in' several times, finally resorting to 'step out' if unsuccessful.
       */
      setBlackboxPatterns: { params: Debugger.SetBlackboxPatternsParams, result: Debugger.SetBlackboxPatternsResult }

      /**
       * Makes backend skip steps in the script in blackboxed ranges. VM will try leave blacklisted
       * scripts by performing 'step in' several times, finally resorting to 'step out' if unsuccessful.
       * Positions array contains positions where blackbox state is changed. First interval isn't
       * blackboxed. Array should be sorted.
       */
      setBlackboxedRanges: { params: Debugger.SetBlackboxedRangesParams, result: Debugger.SetBlackboxedRangesResult }

      /**
       * Sets JavaScript breakpoint at a given location.
       */
      setBreakpoint: { params: Debugger.SetBreakpointParams, result: Debugger.SetBreakpointResult }

      /**
       * Sets instrumentation breakpoint.
       */
      setInstrumentationBreakpoint: { params: Debugger.SetInstrumentationBreakpointParams, result: Debugger.SetInstrumentationBreakpointResult }

      /**
       * Sets JavaScript breakpoint at given location specified either by URL or URL regex. Once this
       * command is issued, all existing parsed scripts will have breakpoints resolved and returned in
       * `locations` property. Further matching script parsing will result in subsequent
       * `breakpointResolved` events issued. This logical breakpoint will survive page reloads.
       */
      setBreakpointByUrl: { params: Debugger.SetBreakpointByUrlParams, result: Debugger.SetBreakpointByUrlResult }

      /**
       * Sets JavaScript breakpoint before each call to the given function.
       * If another function was created from the same source as a given one,
       * calling it will also trigger the breakpoint.
       */
      setBreakpointOnFunctionCall: { params: Debugger.SetBreakpointOnFunctionCallParams, result: Debugger.SetBreakpointOnFunctionCallResult }

      /**
       * Activates / deactivates all breakpoints on the page.
       */
      setBreakpointsActive: { params: Debugger.SetBreakpointsActiveParams, result: Debugger.SetBreakpointsActiveResult }

      /**
       * Defines pause on exceptions state. Can be set to stop on all exceptions, uncaught exceptions,
       * or caught exceptions, no exceptions. Initial pause on exceptions state is `none`.
       */
      setPauseOnExceptions: { params: Debugger.SetPauseOnExceptionsParams, result: Debugger.SetPauseOnExceptionsResult }

      /**
       * Changes return value in top frame. Available only at return break position.
       */
      setReturnValue: { params: Debugger.SetReturnValueParams, result: Debugger.SetReturnValueResult }

      /**
       * Edits JavaScript source live.
       * 
       * In general, functions that are currently on the stack can not be edited with
       * a single exception: If the edited function is the top-most stack frame and
       * that is the only activation of that function on the stack. In this case
       * the live edit will be successful and a `Debugger.restartFrame` for the
       * top-most function is automatically triggered.
       */
      setScriptSource: { params: Debugger.SetScriptSourceParams, result: Debugger.SetScriptSourceResult }

      /**
       * Makes page not interrupt on any pauses (breakpoint, exception, dom exception etc).
       */
      setSkipAllPauses: { params: Debugger.SetSkipAllPausesParams, result: Debugger.SetSkipAllPausesResult }

      /**
       * Changes value of variable in a callframe. Object-based scopes are not supported and must be
       * mutated manually.
       */
      setVariableValue: { params: Debugger.SetVariableValueParams, result: Debugger.SetVariableValueResult }

      /**
       * Steps into the function call.
       */
      stepInto: { params: Debugger.StepIntoParams, result: Debugger.StepIntoResult }

      /**
       * Steps out of the function call.
       */
      stepOut: { params: Debugger.StepOutParams, result: Debugger.StepOutResult }

      /**
       * Steps over the statement.
       */
      stepOver: { params: Debugger.StepOverParams, result: Debugger.StepOverResult }
    };
    events: {

      /**
       * Fired when breakpoint is resolved to an actual script and location.
       */
      breakpointResolved: { params: Debugger.BreakpointResolvedEvent };

      /**
       * Fired when the virtual machine stopped on breakpoint or exception or any other stop criteria.
       */
      paused: { params: Debugger.PausedEvent };

      /**
       * Fired when the virtual machine resumed execution.
       */
      resumed: { params: Debugger.ResumedEvent };

      /**
       * Fired when virtual machine fails to parse the script.
       */
      scriptFailedToParse: { params: Debugger.ScriptFailedToParseEvent };

      /**
       * Fired when virtual machine parses script. This event is also fired for all known and uncollected
       * scripts upon enabling debugger.
       */
      scriptParsed: { params: Debugger.ScriptParsedEvent };
    };
  }

  /**
   * Types of the 'Debugger' domain.
   */
  export namespace Debugger {
    /**
     * Parameters of the 'Debugger.continueToLocation' method.
     */
    export interface ContinueToLocationParams {
      /**
       * Location to continue to.
       */
      location: Location;

      targetCallFrames?: 'any' | 'current';
    }

    /**
     * Return value of the 'Debugger.continueToLocation' method.
     */
    export interface ContinueToLocationResult {
    }

    /**
     * Parameters of the 'Debugger.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'Debugger.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'Debugger.enable' method.
     */
    export interface EnableParams {
      /**
       * The maximum size in bytes of collected scripts (not referenced by other heap objects)
       * the debugger can hold. Puts no limit if parameter is omitted.
       */
      maxScriptsCacheSize?: number;
    }

    /**
     * Return value of the 'Debugger.enable' method.
     */
    export interface EnableResult {
      /**
       * Unique identifier of the debugger.
       */
      debuggerId: Runtime.UniqueDebuggerId;
    }

    /**
     * Parameters of the 'Debugger.evaluateOnCallFrame' method.
     */
    export interface EvaluateOnCallFrameParams {
      /**
       * Call frame identifier to evaluate on.
       */
      callFrameId: CallFrameId;

      /**
       * Expression to evaluate.
       */
      expression: string;

      /**
       * String object group name to put result into (allows rapid releasing resulting object handles
       * using `releaseObjectGroup`).
       */
      objectGroup?: string;

      /**
       * Specifies whether command line API should be available to the evaluated expression, defaults
       * to false.
       */
      includeCommandLineAPI?: boolean;

      /**
       * In silent mode exceptions thrown during evaluation are not reported and do not pause
       * execution. Overrides `setPauseOnException` state.
       */
      silent?: boolean;

      /**
       * Whether the result is expected to be a JSON object that should be sent by value.
       */
      returnByValue?: boolean;

      /**
       * Whether preview should be generated for the result.
       */
      generatePreview?: boolean;

      /**
       * Whether to throw an exception if side effect cannot be ruled out during evaluation.
       */
      throwOnSideEffect?: boolean;

      /**
       * Terminate execution after timing out (number of milliseconds).
       */
      timeout?: Runtime.TimeDelta;
    }

    /**
     * Return value of the 'Debugger.evaluateOnCallFrame' method.
     */
    export interface EvaluateOnCallFrameResult {
      /**
       * Object wrapper for the evaluation result.
       */
      result: Runtime.RemoteObject;

      /**
       * Exception details.
       */
      exceptionDetails?: Runtime.ExceptionDetails;
    }

    /**
     * Parameters of the 'Debugger.getPossibleBreakpoints' method.
     */
    export interface GetPossibleBreakpointsParams {
      /**
       * Start of range to search possible breakpoint locations in.
       */
      start: Location;

      /**
       * End of range to search possible breakpoint locations in (excluding). When not specified, end
       * of scripts is used as end of range.
       */
      end?: Location;

      /**
       * Only consider locations which are in the same (non-nested) function as start.
       */
      restrictToFunction?: boolean;
    }

    /**
     * Return value of the 'Debugger.getPossibleBreakpoints' method.
     */
    export interface GetPossibleBreakpointsResult {
      /**
       * List of the possible breakpoint locations.
       */
      locations: BreakLocation[];
    }

    /**
     * Parameters of the 'Debugger.getScriptSource' method.
     */
    export interface GetScriptSourceParams {
      /**
       * Id of the script to get source for.
       */
      scriptId: Runtime.ScriptId;
    }

    /**
     * Return value of the 'Debugger.getScriptSource' method.
     */
    export interface GetScriptSourceResult {
      /**
       * Script source (empty in case of Wasm bytecode).
       */
      scriptSource: string;

      /**
       * Wasm bytecode. (Encoded as a base64 string when passed over JSON)
       */
      bytecode?: string;
    }

    /**
     * Parameters of the 'Debugger.disassembleWasmModule' method.
     */
    export interface DisassembleWasmModuleParams {
      /**
       * Id of the script to disassemble
       */
      scriptId: Runtime.ScriptId;
    }

    /**
     * Return value of the 'Debugger.disassembleWasmModule' method.
     */
    export interface DisassembleWasmModuleResult {
      /**
       * For large modules, return a stream from which additional chunks of
       * disassembly can be read successively.
       */
      streamId?: string;

      /**
       * The total number of lines in the disassembly text.
       */
      totalNumberOfLines: integer;

      /**
       * The offsets of all function bodies, in the format [start1, end1,
       * start2, end2, ...] where all ends are exclusive.
       */
      functionBodyOffsets: integer[];

      /**
       * The first chunk of disassembly.
       */
      chunk: WasmDisassemblyChunk;
    }

    /**
     * Parameters of the 'Debugger.nextWasmDisassemblyChunk' method.
     */
    export interface NextWasmDisassemblyChunkParams {
      streamId: string;
    }

    /**
     * Return value of the 'Debugger.nextWasmDisassemblyChunk' method.
     */
    export interface NextWasmDisassemblyChunkResult {
      /**
       * The next chunk of disassembly.
       */
      chunk: WasmDisassemblyChunk;
    }

    /**
     * Parameters of the 'Debugger.getWasmBytecode' method.
     */
    export interface GetWasmBytecodeParams {
      /**
       * Id of the Wasm script to get source for.
       */
      scriptId: Runtime.ScriptId;
    }

    /**
     * Return value of the 'Debugger.getWasmBytecode' method.
     */
    export interface GetWasmBytecodeResult {
      /**
       * Script source. (Encoded as a base64 string when passed over JSON)
       */
      bytecode: string;
    }

    /**
     * Parameters of the 'Debugger.getStackTrace' method.
     */
    export interface GetStackTraceParams {
      stackTraceId: Runtime.StackTraceId;
    }

    /**
     * Return value of the 'Debugger.getStackTrace' method.
     */
    export interface GetStackTraceResult {
      stackTrace: Runtime.StackTrace;
    }

    /**
     * Parameters of the 'Debugger.pause' method.
     */
    export interface PauseParams {
    }

    /**
     * Return value of the 'Debugger.pause' method.
     */
    export interface PauseResult {
    }

    /**
     * Parameters of the 'Debugger.pauseOnAsyncCall' method.
     */
    export interface PauseOnAsyncCallParams {
      /**
       * Debugger will pause when async call with given stack trace is started.
       */
      parentStackTraceId: Runtime.StackTraceId;
    }

    /**
     * Return value of the 'Debugger.pauseOnAsyncCall' method.
     */
    export interface PauseOnAsyncCallResult {
    }

    /**
     * Parameters of the 'Debugger.removeBreakpoint' method.
     */
    export interface RemoveBreakpointParams {
      breakpointId: BreakpointId;
    }

    /**
     * Return value of the 'Debugger.removeBreakpoint' method.
     */
    export interface RemoveBreakpointResult {
    }

    /**
     * Parameters of the 'Debugger.restartFrame' method.
     */
    export interface RestartFrameParams {
      /**
       * Call frame identifier to evaluate on.
       */
      callFrameId: CallFrameId;

      /**
       * The `mode` parameter must be present and set to 'StepInto', otherwise
       * `restartFrame` will error out.
       */
      mode?: 'StepInto';
    }

    /**
     * Return value of the 'Debugger.restartFrame' method.
     */
    export interface RestartFrameResult {
      /**
       * New stack trace.
       * @deprecated
       */
      callFrames: CallFrame[];

      /**
       * Async stack trace, if any.
       * @deprecated
       */
      asyncStackTrace?: Runtime.StackTrace;

      /**
       * Async stack trace, if any.
       * @deprecated
       */
      asyncStackTraceId?: Runtime.StackTraceId;
    }

    /**
     * Parameters of the 'Debugger.resume' method.
     */
    export interface ResumeParams {
      /**
       * Set to true to terminate execution upon resuming execution. In contrast
       * to Runtime.terminateExecution, this will allows to execute further
       * JavaScript (i.e. via evaluation) until execution of the paused code
       * is actually resumed, at which point termination is triggered.
       * If execution is currently not paused, this parameter has no effect.
       */
      terminateOnResume?: boolean;
    }

    /**
     * Return value of the 'Debugger.resume' method.
     */
    export interface ResumeResult {
    }

    /**
     * Parameters of the 'Debugger.searchInContent' method.
     */
    export interface SearchInContentParams {
      /**
       * Id of the script to search in.
       */
      scriptId: Runtime.ScriptId;

      /**
       * String to search for.
       */
      query: string;

      /**
       * If true, search is case sensitive.
       */
      caseSensitive?: boolean;

      /**
       * If true, treats string parameter as regex.
       */
      isRegex?: boolean;
    }

    /**
     * Return value of the 'Debugger.searchInContent' method.
     */
    export interface SearchInContentResult {
      /**
       * List of search matches.
       */
      result: SearchMatch[];
    }

    /**
     * Parameters of the 'Debugger.setAsyncCallStackDepth' method.
     */
    export interface SetAsyncCallStackDepthParams {
      /**
       * Maximum depth of async call stacks. Setting to `0` will effectively disable collecting async
       * call stacks (default).
       */
      maxDepth: integer;
    }

    /**
     * Return value of the 'Debugger.setAsyncCallStackDepth' method.
     */
    export interface SetAsyncCallStackDepthResult {
    }

    /**
     * Parameters of the 'Debugger.setBlackboxPatterns' method.
     */
    export interface SetBlackboxPatternsParams {
      /**
       * Array of regexps that will be used to check script url for blackbox state.
       */
      patterns: string[];
    }

    /**
     * Return value of the 'Debugger.setBlackboxPatterns' method.
     */
    export interface SetBlackboxPatternsResult {
    }

    /**
     * Parameters of the 'Debugger.setBlackboxedRanges' method.
     */
    export interface SetBlackboxedRangesParams {
      /**
       * Id of the script.
       */
      scriptId: Runtime.ScriptId;

      positions: ScriptPosition[];
    }

    /**
     * Return value of the 'Debugger.setBlackboxedRanges' method.
     */
    export interface SetBlackboxedRangesResult {
    }

    /**
     * Parameters of the 'Debugger.setBreakpoint' method.
     */
    export interface SetBreakpointParams {
      /**
       * Location to set breakpoint in.
       */
      location: Location;

      /**
       * Expression to use as a breakpoint condition. When specified, debugger will only stop on the
       * breakpoint if this expression evaluates to true.
       */
      condition?: string;
    }

    /**
     * Return value of the 'Debugger.setBreakpoint' method.
     */
    export interface SetBreakpointResult {
      /**
       * Id of the created breakpoint for further reference.
       */
      breakpointId: BreakpointId;

      /**
       * Location this breakpoint resolved into.
       */
      actualLocation: Location;
    }

    /**
     * Parameters of the 'Debugger.setInstrumentationBreakpoint' method.
     */
    export interface SetInstrumentationBreakpointParams {
      /**
       * Instrumentation name.
       */
      instrumentation: 'beforeScriptExecution' | 'beforeScriptWithSourceMapExecution';
    }

    /**
     * Return value of the 'Debugger.setInstrumentationBreakpoint' method.
     */
    export interface SetInstrumentationBreakpointResult {
      /**
       * Id of the created breakpoint for further reference.
       */
      breakpointId: BreakpointId;
    }

    /**
     * Parameters of the 'Debugger.setBreakpointByUrl' method.
     */
    export interface SetBreakpointByUrlParams {
      /**
       * Line number to set breakpoint at.
       */
      lineNumber: integer;

      /**
       * URL of the resources to set breakpoint on.
       */
      url?: string;

      /**
       * Regex pattern for the URLs of the resources to set breakpoints on. Either `url` or
       * `urlRegex` must be specified.
       */
      urlRegex?: string;

      /**
       * Script hash of the resources to set breakpoint on.
       */
      scriptHash?: string;

      /**
       * Offset in the line to set breakpoint at.
       */
      columnNumber?: integer;

      /**
       * Expression to use as a breakpoint condition. When specified, debugger will only stop on the
       * breakpoint if this expression evaluates to true.
       */
      condition?: string;
    }

    /**
     * Return value of the 'Debugger.setBreakpointByUrl' method.
     */
    export interface SetBreakpointByUrlResult {
      /**
       * Id of the created breakpoint for further reference.
       */
      breakpointId: BreakpointId;

      /**
       * List of the locations this breakpoint resolved into upon addition.
       */
      locations: Location[];
    }

    /**
     * Parameters of the 'Debugger.setBreakpointOnFunctionCall' method.
     */
    export interface SetBreakpointOnFunctionCallParams {
      /**
       * Function object id.
       */
      objectId: Runtime.RemoteObjectId;

      /**
       * Expression to use as a breakpoint condition. When specified, debugger will
       * stop on the breakpoint if this expression evaluates to true.
       */
      condition?: string;
    }

    /**
     * Return value of the 'Debugger.setBreakpointOnFunctionCall' method.
     */
    export interface SetBreakpointOnFunctionCallResult {
      /**
       * Id of the created breakpoint for further reference.
       */
      breakpointId: BreakpointId;
    }

    /**
     * Parameters of the 'Debugger.setBreakpointsActive' method.
     */
    export interface SetBreakpointsActiveParams {
      /**
       * New value for breakpoints active state.
       */
      active: boolean;
    }

    /**
     * Return value of the 'Debugger.setBreakpointsActive' method.
     */
    export interface SetBreakpointsActiveResult {
    }

    /**
     * Parameters of the 'Debugger.setPauseOnExceptions' method.
     */
    export interface SetPauseOnExceptionsParams {
      /**
       * Pause on exceptions mode.
       */
      state: 'none' | 'caught' | 'uncaught' | 'all';
    }

    /**
     * Return value of the 'Debugger.setPauseOnExceptions' method.
     */
    export interface SetPauseOnExceptionsResult {
    }

    /**
     * Parameters of the 'Debugger.setReturnValue' method.
     */
    export interface SetReturnValueParams {
      /**
       * New return value.
       */
      newValue: Runtime.CallArgument;
    }

    /**
     * Return value of the 'Debugger.setReturnValue' method.
     */
    export interface SetReturnValueResult {
    }

    /**
     * Parameters of the 'Debugger.setScriptSource' method.
     */
    export interface SetScriptSourceParams {
      /**
       * Id of the script to edit.
       */
      scriptId: Runtime.ScriptId;

      /**
       * New content of the script.
       */
      scriptSource: string;

      /**
       * If true the change will not actually be applied. Dry run may be used to get result
       * description without actually modifying the code.
       */
      dryRun?: boolean;

      /**
       * If true, then `scriptSource` is allowed to change the function on top of the stack
       * as long as the top-most stack frame is the only activation of that function.
       */
      allowTopFrameEditing?: boolean;
    }

    /**
     * Return value of the 'Debugger.setScriptSource' method.
     */
    export interface SetScriptSourceResult {
      /**
       * New stack trace in case editing has happened while VM was stopped.
       * @deprecated
       */
      callFrames?: CallFrame[];

      /**
       * Whether current call stack  was modified after applying the changes.
       * @deprecated
       */
      stackChanged?: boolean;

      /**
       * Async stack trace, if any.
       * @deprecated
       */
      asyncStackTrace?: Runtime.StackTrace;

      /**
       * Async stack trace, if any.
       * @deprecated
       */
      asyncStackTraceId?: Runtime.StackTraceId;

      /**
       * Whether the operation was successful or not. Only `Ok` denotes a
       * successful live edit while the other enum variants denote why
       * the live edit failed.
       */
      status: 'Ok' | 'CompileError' | 'BlockedByActiveGenerator' | 'BlockedByActiveFunction' | 'BlockedByTopLevelEsModuleChange';

      /**
       * Exception details if any. Only present when `status` is `CompileError`.
       */
      exceptionDetails?: Runtime.ExceptionDetails;
    }

    /**
     * Parameters of the 'Debugger.setSkipAllPauses' method.
     */
    export interface SetSkipAllPausesParams {
      /**
       * New value for skip pauses state.
       */
      skip: boolean;
    }

    /**
     * Return value of the 'Debugger.setSkipAllPauses' method.
     */
    export interface SetSkipAllPausesResult {
    }

    /**
     * Parameters of the 'Debugger.setVariableValue' method.
     */
    export interface SetVariableValueParams {
      /**
       * 0-based number of scope as was listed in scope chain. Only 'local', 'closure' and 'catch'
       * scope types are allowed. Other scopes could be manipulated manually.
       */
      scopeNumber: integer;

      /**
       * Variable name.
       */
      variableName: string;

      /**
       * New variable value.
       */
      newValue: Runtime.CallArgument;

      /**
       * Id of callframe that holds variable.
       */
      callFrameId: CallFrameId;
    }

    /**
     * Return value of the 'Debugger.setVariableValue' method.
     */
    export interface SetVariableValueResult {
    }

    /**
     * Parameters of the 'Debugger.stepInto' method.
     */
    export interface StepIntoParams {
      /**
       * Debugger will pause on the execution of the first async task which was scheduled
       * before next pause.
       */
      breakOnAsyncCall?: boolean;

      /**
       * The skipList specifies location ranges that should be skipped on step into.
       */
      skipList?: LocationRange[];
    }

    /**
     * Return value of the 'Debugger.stepInto' method.
     */
    export interface StepIntoResult {
    }

    /**
     * Parameters of the 'Debugger.stepOut' method.
     */
    export interface StepOutParams {
    }

    /**
     * Return value of the 'Debugger.stepOut' method.
     */
    export interface StepOutResult {
    }

    /**
     * Parameters of the 'Debugger.stepOver' method.
     */
    export interface StepOverParams {
      /**
       * The skipList specifies location ranges that should be skipped on step over.
       */
      skipList?: LocationRange[];
    }

    /**
     * Return value of the 'Debugger.stepOver' method.
     */
    export interface StepOverResult {
    }

    /**
     * Parameters of the 'Debugger.breakpointResolved' event.
     */
    export interface BreakpointResolvedEvent {
      /**
       * Breakpoint unique identifier.
       */
      breakpointId: BreakpointId;

      /**
       * Actual breakpoint location.
       */
      location: Location;
    }

    /**
     * Parameters of the 'Debugger.paused' event.
     */
    export interface PausedEvent {
      /**
       * Call stack the virtual machine stopped on.
       */
      callFrames: CallFrame[];

      /**
       * Pause reason.
       */
      reason: 'ambiguous' | 'assert' | 'CSPViolation' | 'debugCommand' | 'DOM' | 'EventListener' | 'exception' | 'instrumentation' | 'OOM' | 'other' | 'promiseRejection' | 'XHR' | 'step';

      /**
       * Object containing break-specific auxiliary properties.
       */
      data?: Record<string, unknown>;

      /**
       * Hit breakpoints IDs
       */
      hitBreakpoints?: string[];

      /**
       * Async stack trace, if any.
       */
      asyncStackTrace?: Runtime.StackTrace;

      /**
       * Async stack trace, if any.
       */
      asyncStackTraceId?: Runtime.StackTraceId;

      /**
       * Never present, will be removed.
       * @deprecated
       */
      asyncCallStackTraceId?: Runtime.StackTraceId;
    }

    /**
     * Parameters of the 'Debugger.resumed' event.
     */
    export interface ResumedEvent {
    }

    /**
     * Parameters of the 'Debugger.scriptFailedToParse' event.
     */
    export interface ScriptFailedToParseEvent {
      /**
       * Identifier of the script parsed.
       */
      scriptId: Runtime.ScriptId;

      /**
       * URL or name of the script parsed (if any).
       */
      url: string;

      /**
       * Line offset of the script within the resource with given URL (for script tags).
       */
      startLine: integer;

      /**
       * Column offset of the script within the resource with given URL.
       */
      startColumn: integer;

      /**
       * Last line of the script.
       */
      endLine: integer;

      /**
       * Length of the last line of the script.
       */
      endColumn: integer;

      /**
       * Specifies script creation context.
       */
      executionContextId: Runtime.ExecutionContextId;

      /**
       * Content hash of the script, SHA-256.
       */
      hash: string;

      /**
       * Embedder-specific auxiliary data likely matching {isDefault: boolean, type: 'default'|'isolated'|'worker', frameId: string}
       */
      executionContextAuxData?: Record<string, unknown>;

      /**
       * URL of source map associated with script (if any).
       */
      sourceMapURL?: string;

      /**
       * True, if this script has sourceURL.
       */
      hasSourceURL?: boolean;

      /**
       * True, if this script is ES6 module.
       */
      isModule?: boolean;

      /**
       * This script length.
       */
      length?: integer;

      /**
       * JavaScript top stack frame of where the script parsed event was triggered if available.
       */
      stackTrace?: Runtime.StackTrace;

      /**
       * If the scriptLanguage is WebAssembly, the code section offset in the module.
       */
      codeOffset?: integer;

      /**
       * The language of the script.
       */
      scriptLanguage?: Debugger.ScriptLanguage;

      /**
       * The name the embedder supplied for this script.
       */
      embedderName?: string;
    }

    /**
     * Parameters of the 'Debugger.scriptParsed' event.
     */
    export interface ScriptParsedEvent {
      /**
       * Identifier of the script parsed.
       */
      scriptId: Runtime.ScriptId;

      /**
       * URL or name of the script parsed (if any).
       */
      url: string;

      /**
       * Line offset of the script within the resource with given URL (for script tags).
       */
      startLine: integer;

      /**
       * Column offset of the script within the resource with given URL.
       */
      startColumn: integer;

      /**
       * Last line of the script.
       */
      endLine: integer;

      /**
       * Length of the last line of the script.
       */
      endColumn: integer;

      /**
       * Specifies script creation context.
       */
      executionContextId: Runtime.ExecutionContextId;

      /**
       * Content hash of the script, SHA-256.
       */
      hash: string;

      /**
       * Embedder-specific auxiliary data likely matching {isDefault: boolean, type: 'default'|'isolated'|'worker', frameId: string}
       */
      executionContextAuxData?: Record<string, unknown>;

      /**
       * True, if this script is generated as a result of the live edit operation.
       */
      isLiveEdit?: boolean;

      /**
       * URL of source map associated with script (if any).
       */
      sourceMapURL?: string;

      /**
       * True, if this script has sourceURL.
       */
      hasSourceURL?: boolean;

      /**
       * True, if this script is ES6 module.
       */
      isModule?: boolean;

      /**
       * This script length.
       */
      length?: integer;

      /**
       * JavaScript top stack frame of where the script parsed event was triggered if available.
       */
      stackTrace?: Runtime.StackTrace;

      /**
       * If the scriptLanguage is WebAssembly, the code section offset in the module.
       */
      codeOffset?: integer;

      /**
       * The language of the script.
       */
      scriptLanguage?: Debugger.ScriptLanguage;

      /**
       * If the scriptLanguage is WebASsembly, the source of debug symbols for the module.
       */
      debugSymbols?: Debugger.DebugSymbols;

      /**
       * The name the embedder supplied for this script.
       */
      embedderName?: string;
    }

    /**
     * Breakpoint identifier.
     */
    export type BreakpointId = string;

    /**
     * Call frame identifier.
     */
    export type CallFrameId = string;

    /**
     * Location in the source code.
     */
    export interface Location {
      /**
       * Script identifier as reported in the `Debugger.scriptParsed`.
       */
      scriptId: Runtime.ScriptId;

      /**
       * Line number in the script (0-based).
       */
      lineNumber: integer;

      /**
       * Column number in the script (0-based).
       */
      columnNumber?: integer;
    }

    /**
     * Location in the source code.
     */
    export interface ScriptPosition {
      lineNumber: integer;

      columnNumber: integer;
    }

    /**
     * Location range within one script.
     */
    export interface LocationRange {
      scriptId: Runtime.ScriptId;

      start: ScriptPosition;

      end: ScriptPosition;
    }

    /**
     * JavaScript call frame. Array of call frames form the call stack.
     */
    export interface CallFrame {
      /**
       * Call frame identifier. This identifier is only valid while the virtual machine is paused.
       */
      callFrameId: CallFrameId;

      /**
       * Name of the JavaScript function called on this call frame.
       */
      functionName: string;

      /**
       * Location in the source code.
       */
      functionLocation?: Location;

      /**
       * Location in the source code.
       */
      location: Location;

      /**
       * JavaScript script name or url.
       * Deprecated in favor of using the `location.scriptId` to resolve the URL via a previously
       * sent `Debugger.scriptParsed` event.
       * @deprecated
       */
      url: string;

      /**
       * Scope chain for this call frame.
       */
      scopeChain: Scope[];

      /**
       * `this` object for this call frame.
       */
      this: Runtime.RemoteObject;

      /**
       * The value being returned, if the function is at return point.
       */
      returnValue?: Runtime.RemoteObject;

      /**
       * Valid only while the VM is paused and indicates whether this frame
       * can be restarted or not. Note that a `true` value here does not
       * guarantee that Debugger#restartFrame with this CallFrameId will be
       * successful, but it is very likely.
       */
      canBeRestarted?: boolean;
    }

    /**
     * Scope description.
     */
    export interface Scope {
      /**
       * Scope type.
       */
      type: 'global' | 'local' | 'with' | 'closure' | 'catch' | 'block' | 'script' | 'eval' | 'module' | 'wasm-expression-stack';

      /**
       * Object representing the scope. For `global` and `with` scopes it represents the actual
       * object; for the rest of the scopes, it is artificial transient object enumerating scope
       * variables as its properties.
       */
      object: Runtime.RemoteObject;

      name?: string;

      /**
       * Location in the source code where scope starts
       */
      startLocation?: Location;

      /**
       * Location in the source code where scope ends
       */
      endLocation?: Location;
    }

    /**
     * Search match for resource.
     */
    export interface SearchMatch {
      /**
       * Line number in resource content.
       */
      lineNumber: number;

      /**
       * Line with match content.
       */
      lineContent: string;
    }

    export interface BreakLocation {
      /**
       * Script identifier as reported in the `Debugger.scriptParsed`.
       */
      scriptId: Runtime.ScriptId;

      /**
       * Line number in the script (0-based).
       */
      lineNumber: integer;

      /**
       * Column number in the script (0-based).
       */
      columnNumber?: integer;

      type?: 'debuggerStatement' | 'call' | 'return';
    }

    export interface WasmDisassemblyChunk {
      /**
       * The next chunk of disassembled lines.
       */
      lines: string[];

      /**
       * The bytecode offsets describing the start of each line.
       */
      bytecodeOffsets: integer[];
    }

    /**
     * Enum of possible script languages.
     */
    export type ScriptLanguage = 'JavaScript' | 'WebAssembly';

    /**
     * Debug symbols available for a wasm script.
     */
    export interface DebugSymbols {
      /**
       * Type of the debug symbols.
       */
      type: 'None' | 'SourceMap' | 'EmbeddedDWARF' | 'ExternalDWARF';

      /**
       * URL of the external symbol source.
       */
      externalURL?: string;
    }
  }

  /**
   * Methods and events of the 'HeapProfiler' domain.
   */
  export interface HeapProfilerApi {
    requests: {
      /**
       * Enables console to refer to the node with given id via $x (see Command Line API for more details
       * $x functions).
       */
      addInspectedHeapObject: { params: HeapProfiler.AddInspectedHeapObjectParams, result: HeapProfiler.AddInspectedHeapObjectResult }

      collectGarbage: { params: HeapProfiler.CollectGarbageParams, result: HeapProfiler.CollectGarbageResult }

      disable: { params: HeapProfiler.DisableParams, result: HeapProfiler.DisableResult }

      enable: { params: HeapProfiler.EnableParams, result: HeapProfiler.EnableResult }

      getHeapObjectId: { params: HeapProfiler.GetHeapObjectIdParams, result: HeapProfiler.GetHeapObjectIdResult }

      getObjectByHeapObjectId: { params: HeapProfiler.GetObjectByHeapObjectIdParams, result: HeapProfiler.GetObjectByHeapObjectIdResult }

      getSamplingProfile: { params: HeapProfiler.GetSamplingProfileParams, result: HeapProfiler.GetSamplingProfileResult }

      startSampling: { params: HeapProfiler.StartSamplingParams, result: HeapProfiler.StartSamplingResult }

      startTrackingHeapObjects: { params: HeapProfiler.StartTrackingHeapObjectsParams, result: HeapProfiler.StartTrackingHeapObjectsResult }

      stopSampling: { params: HeapProfiler.StopSamplingParams, result: HeapProfiler.StopSamplingResult }

      stopTrackingHeapObjects: { params: HeapProfiler.StopTrackingHeapObjectsParams, result: HeapProfiler.StopTrackingHeapObjectsResult }

      takeHeapSnapshot: { params: HeapProfiler.TakeHeapSnapshotParams, result: HeapProfiler.TakeHeapSnapshotResult }
    };
    events: {

      addHeapSnapshotChunk: { params: HeapProfiler.AddHeapSnapshotChunkEvent };

      /**
       * If heap objects tracking has been started then backend may send update for one or more fragments
       */
      heapStatsUpdate: { params: HeapProfiler.HeapStatsUpdateEvent };

      /**
       * If heap objects tracking has been started then backend regularly sends a current value for last
       * seen object id and corresponding timestamp. If the were changes in the heap since last event
       * then one or more heapStatsUpdate events will be sent before a new lastSeenObjectId event.
       */
      lastSeenObjectId: { params: HeapProfiler.LastSeenObjectIdEvent };

      reportHeapSnapshotProgress: { params: HeapProfiler.ReportHeapSnapshotProgressEvent };

      resetProfiles: { params: HeapProfiler.ResetProfilesEvent };
    };
  }

  /**
   * Types of the 'HeapProfiler' domain.
   */
  export namespace HeapProfiler {
    /**
     * Parameters of the 'HeapProfiler.addInspectedHeapObject' method.
     */
    export interface AddInspectedHeapObjectParams {
      /**
       * Heap snapshot object id to be accessible by means of $x command line API.
       */
      heapObjectId: HeapSnapshotObjectId;
    }

    /**
     * Return value of the 'HeapProfiler.addInspectedHeapObject' method.
     */
    export interface AddInspectedHeapObjectResult {
    }

    /**
     * Parameters of the 'HeapProfiler.collectGarbage' method.
     */
    export interface CollectGarbageParams {
    }

    /**
     * Return value of the 'HeapProfiler.collectGarbage' method.
     */
    export interface CollectGarbageResult {
    }

    /**
     * Parameters of the 'HeapProfiler.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'HeapProfiler.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'HeapProfiler.enable' method.
     */
    export interface EnableParams {
    }

    /**
     * Return value of the 'HeapProfiler.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'HeapProfiler.getHeapObjectId' method.
     */
    export interface GetHeapObjectIdParams {
      /**
       * Identifier of the object to get heap object id for.
       */
      objectId: Runtime.RemoteObjectId;
    }

    /**
     * Return value of the 'HeapProfiler.getHeapObjectId' method.
     */
    export interface GetHeapObjectIdResult {
      /**
       * Id of the heap snapshot object corresponding to the passed remote object id.
       */
      heapSnapshotObjectId: HeapSnapshotObjectId;
    }

    /**
     * Parameters of the 'HeapProfiler.getObjectByHeapObjectId' method.
     */
    export interface GetObjectByHeapObjectIdParams {
      objectId: HeapSnapshotObjectId;

      /**
       * Symbolic group name that can be used to release multiple objects.
       */
      objectGroup?: string;
    }

    /**
     * Return value of the 'HeapProfiler.getObjectByHeapObjectId' method.
     */
    export interface GetObjectByHeapObjectIdResult {
      /**
       * Evaluation result.
       */
      result: Runtime.RemoteObject;
    }

    /**
     * Parameters of the 'HeapProfiler.getSamplingProfile' method.
     */
    export interface GetSamplingProfileParams {
    }

    /**
     * Return value of the 'HeapProfiler.getSamplingProfile' method.
     */
    export interface GetSamplingProfileResult {
      /**
       * Return the sampling profile being collected.
       */
      profile: SamplingHeapProfile;
    }

    /**
     * Parameters of the 'HeapProfiler.startSampling' method.
     */
    export interface StartSamplingParams {
      /**
       * Average sample interval in bytes. Poisson distribution is used for the intervals. The
       * default value is 32768 bytes.
       */
      samplingInterval?: number;

      /**
       * By default, the sampling heap profiler reports only objects which are
       * still alive when the profile is returned via getSamplingProfile or
       * stopSampling, which is useful for determining what functions contribute
       * the most to steady-state memory usage. This flag instructs the sampling
       * heap profiler to also include information about objects discarded by
       * major GC, which will show which functions cause large temporary memory
       * usage or long GC pauses.
       */
      includeObjectsCollectedByMajorGC?: boolean;

      /**
       * By default, the sampling heap profiler reports only objects which are
       * still alive when the profile is returned via getSamplingProfile or
       * stopSampling, which is useful for determining what functions contribute
       * the most to steady-state memory usage. This flag instructs the sampling
       * heap profiler to also include information about objects discarded by
       * minor GC, which is useful when tuning a latency-sensitive application
       * for minimal GC activity.
       */
      includeObjectsCollectedByMinorGC?: boolean;
    }

    /**
     * Return value of the 'HeapProfiler.startSampling' method.
     */
    export interface StartSamplingResult {
    }

    /**
     * Parameters of the 'HeapProfiler.startTrackingHeapObjects' method.
     */
    export interface StartTrackingHeapObjectsParams {
      trackAllocations?: boolean;
    }

    /**
     * Return value of the 'HeapProfiler.startTrackingHeapObjects' method.
     */
    export interface StartTrackingHeapObjectsResult {
    }

    /**
     * Parameters of the 'HeapProfiler.stopSampling' method.
     */
    export interface StopSamplingParams {
    }

    /**
     * Return value of the 'HeapProfiler.stopSampling' method.
     */
    export interface StopSamplingResult {
      /**
       * Recorded sampling heap profile.
       */
      profile: SamplingHeapProfile;
    }

    /**
     * Parameters of the 'HeapProfiler.stopTrackingHeapObjects' method.
     */
    export interface StopTrackingHeapObjectsParams {
      /**
       * If true 'reportHeapSnapshotProgress' events will be generated while snapshot is being taken
       * when the tracking is stopped.
       */
      reportProgress?: boolean;

      /**
       * Deprecated in favor of `exposeInternals`.
       * @deprecated
       */
      treatGlobalObjectsAsRoots?: boolean;

      /**
       * If true, numerical values are included in the snapshot
       */
      captureNumericValue?: boolean;

      /**
       * If true, exposes internals of the snapshot.
       */
      exposeInternals?: boolean;
    }

    /**
     * Return value of the 'HeapProfiler.stopTrackingHeapObjects' method.
     */
    export interface StopTrackingHeapObjectsResult {
    }

    /**
     * Parameters of the 'HeapProfiler.takeHeapSnapshot' method.
     */
    export interface TakeHeapSnapshotParams {
      /**
       * If true 'reportHeapSnapshotProgress' events will be generated while snapshot is being taken.
       */
      reportProgress?: boolean;

      /**
       * If true, a raw snapshot without artificial roots will be generated.
       * Deprecated in favor of `exposeInternals`.
       * @deprecated
       */
      treatGlobalObjectsAsRoots?: boolean;

      /**
       * If true, numerical values are included in the snapshot
       */
      captureNumericValue?: boolean;

      /**
       * If true, exposes internals of the snapshot.
       */
      exposeInternals?: boolean;
    }

    /**
     * Return value of the 'HeapProfiler.takeHeapSnapshot' method.
     */
    export interface TakeHeapSnapshotResult {
    }

    /**
     * Parameters of the 'HeapProfiler.addHeapSnapshotChunk' event.
     */
    export interface AddHeapSnapshotChunkEvent {
      chunk: string;
    }

    /**
     * Parameters of the 'HeapProfiler.heapStatsUpdate' event.
     */
    export interface HeapStatsUpdateEvent {
      /**
       * An array of triplets. Each triplet describes a fragment. The first integer is the fragment
       * index, the second integer is a total count of objects for the fragment, the third integer is
       * a total size of the objects for the fragment.
       */
      statsUpdate: integer[];
    }

    /**
     * Parameters of the 'HeapProfiler.lastSeenObjectId' event.
     */
    export interface LastSeenObjectIdEvent {
      lastSeenObjectId: integer;

      timestamp: number;
    }

    /**
     * Parameters of the 'HeapProfiler.reportHeapSnapshotProgress' event.
     */
    export interface ReportHeapSnapshotProgressEvent {
      done: integer;

      total: integer;

      finished?: boolean;
    }

    /**
     * Parameters of the 'HeapProfiler.resetProfiles' event.
     */
    export interface ResetProfilesEvent {
    }

    /**
     * Heap snapshot object id.
     */
    export type HeapSnapshotObjectId = string;

    /**
     * Sampling Heap Profile node. Holds callsite information, allocation statistics and child nodes.
     */
    export interface SamplingHeapProfileNode {
      /**
       * Function location.
       */
      callFrame: Runtime.CallFrame;

      /**
       * Allocations size in bytes for the node excluding children.
       */
      selfSize: number;

      /**
       * Node id. Ids are unique across all profiles collected between startSampling and stopSampling.
       */
      id: integer;

      /**
       * Child nodes.
       */
      children: SamplingHeapProfileNode[];
    }

    /**
     * A single sample from a sampling profile.
     */
    export interface SamplingHeapProfileSample {
      /**
       * Allocation size in bytes attributed to the sample.
       */
      size: number;

      /**
       * Id of the corresponding profile tree node.
       */
      nodeId: integer;

      /**
       * Time-ordered sample ordinal number. It is unique across all profiles retrieved
       * between startSampling and stopSampling.
       */
      ordinal: number;
    }

    /**
     * Sampling profile.
     */
    export interface SamplingHeapProfile {
      head: SamplingHeapProfileNode;

      samples: SamplingHeapProfileSample[];
    }
  }

  /**
   * Methods and events of the 'Profiler' domain.
   */
  export interface ProfilerApi {
    requests: {
      disable: { params: Profiler.DisableParams, result: Profiler.DisableResult }

      enable: { params: Profiler.EnableParams, result: Profiler.EnableResult }

      /**
       * Collect coverage data for the current isolate. The coverage data may be incomplete due to
       * garbage collection.
       */
      getBestEffortCoverage: { params: Profiler.GetBestEffortCoverageParams, result: Profiler.GetBestEffortCoverageResult }

      /**
       * Changes CPU profiler sampling interval. Must be called before CPU profiles recording started.
       */
      setSamplingInterval: { params: Profiler.SetSamplingIntervalParams, result: Profiler.SetSamplingIntervalResult }

      start: { params: Profiler.StartParams, result: Profiler.StartResult }

      /**
       * Enable precise code coverage. Coverage data for JavaScript executed before enabling precise code
       * coverage may be incomplete. Enabling prevents running optimized code and resets execution
       * counters.
       */
      startPreciseCoverage: { params: Profiler.StartPreciseCoverageParams, result: Profiler.StartPreciseCoverageResult }

      stop: { params: Profiler.StopParams, result: Profiler.StopResult }

      /**
       * Disable precise code coverage. Disabling releases unnecessary execution count records and allows
       * executing optimized code.
       */
      stopPreciseCoverage: { params: Profiler.StopPreciseCoverageParams, result: Profiler.StopPreciseCoverageResult }

      /**
       * Collect coverage data for the current isolate, and resets execution counters. Precise code
       * coverage needs to have started.
       */
      takePreciseCoverage: { params: Profiler.TakePreciseCoverageParams, result: Profiler.TakePreciseCoverageResult }
    };
    events: {

      consoleProfileFinished: { params: Profiler.ConsoleProfileFinishedEvent };

      /**
       * Sent when new profile recording is started using console.profile() call.
       */
      consoleProfileStarted: { params: Profiler.ConsoleProfileStartedEvent };

      /**
       * Reports coverage delta since the last poll (either from an event like this, or from
       * `takePreciseCoverage` for the current isolate. May only be sent if precise code
       * coverage has been started. This event can be trigged by the embedder to, for example,
       * trigger collection of coverage data immediately at a certain point in time.
       */
      preciseCoverageDeltaUpdate: { params: Profiler.PreciseCoverageDeltaUpdateEvent };
    };
  }

  /**
   * Types of the 'Profiler' domain.
   */
  export namespace Profiler {
    /**
     * Parameters of the 'Profiler.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'Profiler.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'Profiler.enable' method.
     */
    export interface EnableParams {
    }

    /**
     * Return value of the 'Profiler.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'Profiler.getBestEffortCoverage' method.
     */
    export interface GetBestEffortCoverageParams {
    }

    /**
     * Return value of the 'Profiler.getBestEffortCoverage' method.
     */
    export interface GetBestEffortCoverageResult {
      /**
       * Coverage data for the current isolate.
       */
      result: ScriptCoverage[];
    }

    /**
     * Parameters of the 'Profiler.setSamplingInterval' method.
     */
    export interface SetSamplingIntervalParams {
      /**
       * New sampling interval in microseconds.
       */
      interval: integer;
    }

    /**
     * Return value of the 'Profiler.setSamplingInterval' method.
     */
    export interface SetSamplingIntervalResult {
    }

    /**
     * Parameters of the 'Profiler.start' method.
     */
    export interface StartParams {
    }

    /**
     * Return value of the 'Profiler.start' method.
     */
    export interface StartResult {
    }

    /**
     * Parameters of the 'Profiler.startPreciseCoverage' method.
     */
    export interface StartPreciseCoverageParams {
      /**
       * Collect accurate call counts beyond simple 'covered' or 'not covered'.
       */
      callCount?: boolean;

      /**
       * Collect block-based coverage.
       */
      detailed?: boolean;

      /**
       * Allow the backend to send updates on its own initiative
       */
      allowTriggeredUpdates?: boolean;
    }

    /**
     * Return value of the 'Profiler.startPreciseCoverage' method.
     */
    export interface StartPreciseCoverageResult {
      /**
       * Monotonically increasing time (in seconds) when the coverage update was taken in the backend.
       */
      timestamp: number;
    }

    /**
     * Parameters of the 'Profiler.stop' method.
     */
    export interface StopParams {
    }

    /**
     * Return value of the 'Profiler.stop' method.
     */
    export interface StopResult {
      /**
       * Recorded profile.
       */
      profile: Profile;
    }

    /**
     * Parameters of the 'Profiler.stopPreciseCoverage' method.
     */
    export interface StopPreciseCoverageParams {
    }

    /**
     * Return value of the 'Profiler.stopPreciseCoverage' method.
     */
    export interface StopPreciseCoverageResult {
    }

    /**
     * Parameters of the 'Profiler.takePreciseCoverage' method.
     */
    export interface TakePreciseCoverageParams {
    }

    /**
     * Return value of the 'Profiler.takePreciseCoverage' method.
     */
    export interface TakePreciseCoverageResult {
      /**
       * Coverage data for the current isolate.
       */
      result: ScriptCoverage[];

      /**
       * Monotonically increasing time (in seconds) when the coverage update was taken in the backend.
       */
      timestamp: number;
    }

    /**
     * Parameters of the 'Profiler.consoleProfileFinished' event.
     */
    export interface ConsoleProfileFinishedEvent {
      id: string;

      /**
       * Location of console.profileEnd().
       */
      location: Debugger.Location;

      profile: Profile;

      /**
       * Profile title passed as an argument to console.profile().
       */
      title?: string;
    }

    /**
     * Parameters of the 'Profiler.consoleProfileStarted' event.
     */
    export interface ConsoleProfileStartedEvent {
      id: string;

      /**
       * Location of console.profile().
       */
      location: Debugger.Location;

      /**
       * Profile title passed as an argument to console.profile().
       */
      title?: string;
    }

    /**
     * Parameters of the 'Profiler.preciseCoverageDeltaUpdate' event.
     */
    export interface PreciseCoverageDeltaUpdateEvent {
      /**
       * Monotonically increasing time (in seconds) when the coverage update was taken in the backend.
       */
      timestamp: number;

      /**
       * Identifier for distinguishing coverage events.
       */
      occasion: string;

      /**
       * Coverage data for the current isolate.
       */
      result: ScriptCoverage[];
    }

    /**
     * Profile node. Holds callsite information, execution statistics and child nodes.
     */
    export interface ProfileNode {
      /**
       * Unique id of the node.
       */
      id: integer;

      /**
       * Function location.
       */
      callFrame: Runtime.CallFrame;

      /**
       * Number of samples where this node was on top of the call stack.
       */
      hitCount?: integer;

      /**
       * Child node ids.
       */
      children?: integer[];

      /**
       * The reason of being not optimized. The function may be deoptimized or marked as don't
       * optimize.
       */
      deoptReason?: string;

      /**
       * An array of source position ticks.
       */
      positionTicks?: PositionTickInfo[];
    }

    /**
     * Profile.
     */
    export interface Profile {
      /**
       * The list of profile nodes. First item is the root node.
       */
      nodes: ProfileNode[];

      /**
       * Profiling start timestamp in microseconds.
       */
      startTime: number;

      /**
       * Profiling end timestamp in microseconds.
       */
      endTime: number;

      /**
       * Ids of samples top nodes.
       */
      samples?: integer[];

      /**
       * Time intervals between adjacent samples in microseconds. The first delta is relative to the
       * profile startTime.
       */
      timeDeltas?: integer[];
    }

    /**
     * Specifies a number of samples attributed to a certain source position.
     */
    export interface PositionTickInfo {
      /**
       * Source line number (1-based).
       */
      line: integer;

      /**
       * Number of samples attributed to the source line.
       */
      ticks: integer;
    }

    /**
     * Coverage data for a source range.
     */
    export interface CoverageRange {
      /**
       * JavaScript script source offset for the range start.
       */
      startOffset: integer;

      /**
       * JavaScript script source offset for the range end.
       */
      endOffset: integer;

      /**
       * Collected execution count of the source range.
       */
      count: integer;
    }

    /**
     * Coverage data for a JavaScript function.
     */
    export interface FunctionCoverage {
      /**
       * JavaScript function name.
       */
      functionName: string;

      /**
       * Source ranges inside the function with coverage data.
       */
      ranges: CoverageRange[];

      /**
       * Whether coverage data for this function has block granularity.
       */
      isBlockCoverage: boolean;
    }

    /**
     * Coverage data for a JavaScript script.
     */
    export interface ScriptCoverage {
      /**
       * JavaScript script id.
       */
      scriptId: Runtime.ScriptId;

      /**
       * JavaScript script name or url.
       */
      url: string;

      /**
       * Functions contained in the script that has coverage data.
       */
      functions: FunctionCoverage[];
    }
  }

  /**
   * Methods and events of the 'Runtime' domain.
   */
  export interface RuntimeApi {
    requests: {
      /**
       * Add handler to promise with given promise object id.
       */
      awaitPromise: { params: Runtime.AwaitPromiseParams, result: Runtime.AwaitPromiseResult }

      /**
       * Calls function with given declaration on the given object. Object group of the result is
       * inherited from the target object.
       */
      callFunctionOn: { params: Runtime.CallFunctionOnParams, result: Runtime.CallFunctionOnResult }

      /**
       * Compiles expression.
       */
      compileScript: { params: Runtime.CompileScriptParams, result: Runtime.CompileScriptResult }

      /**
       * Disables reporting of execution contexts creation.
       */
      disable: { params: Runtime.DisableParams, result: Runtime.DisableResult }

      /**
       * Discards collected exceptions and console API calls.
       */
      discardConsoleEntries: { params: Runtime.DiscardConsoleEntriesParams, result: Runtime.DiscardConsoleEntriesResult }

      /**
       * Enables reporting of execution contexts creation by means of `executionContextCreated` event.
       * When the reporting gets enabled the event will be sent immediately for each existing execution
       * context.
       */
      enable: { params: Runtime.EnableParams, result: Runtime.EnableResult }

      /**
       * Evaluates expression on global object.
       */
      evaluate: { params: Runtime.EvaluateParams, result: Runtime.EvaluateResult }

      /**
       * Returns the isolate id.
       */
      getIsolateId: { params: Runtime.GetIsolateIdParams, result: Runtime.GetIsolateIdResult }

      /**
       * Returns the JavaScript heap usage.
       * It is the total usage of the corresponding isolate not scoped to a particular Runtime.
       */
      getHeapUsage: { params: Runtime.GetHeapUsageParams, result: Runtime.GetHeapUsageResult }

      /**
       * Returns properties of a given object. Object group of the result is inherited from the target
       * object.
       */
      getProperties: { params: Runtime.GetPropertiesParams, result: Runtime.GetPropertiesResult }

      /**
       * Returns all let, const and class variables from global scope.
       */
      globalLexicalScopeNames: { params: Runtime.GlobalLexicalScopeNamesParams, result: Runtime.GlobalLexicalScopeNamesResult }

      queryObjects: { params: Runtime.QueryObjectsParams, result: Runtime.QueryObjectsResult }

      /**
       * Releases remote object with given id.
       */
      releaseObject: { params: Runtime.ReleaseObjectParams, result: Runtime.ReleaseObjectResult }

      /**
       * Releases all remote objects that belong to a given group.
       */
      releaseObjectGroup: { params: Runtime.ReleaseObjectGroupParams, result: Runtime.ReleaseObjectGroupResult }

      /**
       * Tells inspected instance to run if it was waiting for debugger to attach.
       */
      runIfWaitingForDebugger: { params: Runtime.RunIfWaitingForDebuggerParams, result: Runtime.RunIfWaitingForDebuggerResult }

      /**
       * Runs script with given id in a given context.
       */
      runScript: { params: Runtime.RunScriptParams, result: Runtime.RunScriptResult }

      /**
       * Enables or disables async call stacks tracking.
       */
      setAsyncCallStackDepth: { params: Runtime.SetAsyncCallStackDepthParams, result: Runtime.SetAsyncCallStackDepthResult }

      setCustomObjectFormatterEnabled: { params: Runtime.SetCustomObjectFormatterEnabledParams, result: Runtime.SetCustomObjectFormatterEnabledResult }

      setMaxCallStackSizeToCapture: { params: Runtime.SetMaxCallStackSizeToCaptureParams, result: Runtime.SetMaxCallStackSizeToCaptureResult }

      /**
       * Terminate current or next JavaScript execution.
       * Will cancel the termination when the outer-most script execution ends.
       */
      terminateExecution: { params: Runtime.TerminateExecutionParams, result: Runtime.TerminateExecutionResult }

      /**
       * If executionContextId is empty, adds binding with the given name on the
       * global objects of all inspected contexts, including those created later,
       * bindings survive reloads.
       * Binding function takes exactly one argument, this argument should be string,
       * in case of any other input, function throws an exception.
       * Each binding function call produces Runtime.bindingCalled notification.
       */
      addBinding: { params: Runtime.AddBindingParams, result: Runtime.AddBindingResult }

      /**
       * This method does not remove binding function from global object but
       * unsubscribes current runtime agent from Runtime.bindingCalled notifications.
       */
      removeBinding: { params: Runtime.RemoveBindingParams, result: Runtime.RemoveBindingResult }

      /**
       * This method tries to lookup and populate exception details for a
       * JavaScript Error object.
       * Note that the stackTrace portion of the resulting exceptionDetails will
       * only be populated if the Runtime domain was enabled at the time when the
       * Error was thrown.
       */
      getExceptionDetails: { params: Runtime.GetExceptionDetailsParams, result: Runtime.GetExceptionDetailsResult }
    };
    events: {

      /**
       * Notification is issued every time when binding is called.
       */
      bindingCalled: { params: Runtime.BindingCalledEvent };

      /**
       * Issued when console API was called.
       */
      consoleAPICalled: { params: Runtime.ConsoleAPICalledEvent };

      /**
       * Issued when unhandled exception was revoked.
       */
      exceptionRevoked: { params: Runtime.ExceptionRevokedEvent };

      /**
       * Issued when exception was thrown and unhandled.
       */
      exceptionThrown: { params: Runtime.ExceptionThrownEvent };

      /**
       * Issued when new execution context is created.
       */
      executionContextCreated: { params: Runtime.ExecutionContextCreatedEvent };

      /**
       * Issued when execution context is destroyed.
       */
      executionContextDestroyed: { params: Runtime.ExecutionContextDestroyedEvent };

      /**
       * Issued when all executionContexts were cleared in browser
       */
      executionContextsCleared: { params: Runtime.ExecutionContextsClearedEvent };

      /**
       * Issued when object should be inspected (for example, as a result of inspect() command line API
       * call).
       */
      inspectRequested: { params: Runtime.InspectRequestedEvent };
    };
  }

  /**
   * Types of the 'Runtime' domain.
   */
  export namespace Runtime {
    /**
     * Parameters of the 'Runtime.awaitPromise' method.
     */
    export interface AwaitPromiseParams {
      /**
       * Identifier of the promise.
       */
      promiseObjectId: RemoteObjectId;

      /**
       * Whether the result is expected to be a JSON object that should be sent by value.
       */
      returnByValue?: boolean;

      /**
       * Whether preview should be generated for the result.
       */
      generatePreview?: boolean;
    }

    /**
     * Return value of the 'Runtime.awaitPromise' method.
     */
    export interface AwaitPromiseResult {
      /**
       * Promise result. Will contain rejected value if promise was rejected.
       */
      result: RemoteObject;

      /**
       * Exception details if stack strace is available.
       */
      exceptionDetails?: ExceptionDetails;
    }

    /**
     * Parameters of the 'Runtime.callFunctionOn' method.
     */
    export interface CallFunctionOnParams {
      /**
       * Declaration of the function to call.
       */
      functionDeclaration: string;

      /**
       * Identifier of the object to call function on. Either objectId or executionContextId should
       * be specified.
       */
      objectId?: RemoteObjectId;

      /**
       * Call arguments. All call arguments must belong to the same JavaScript world as the target
       * object.
       */
      arguments?: CallArgument[];

      /**
       * In silent mode exceptions thrown during evaluation are not reported and do not pause
       * execution. Overrides `setPauseOnException` state.
       */
      silent?: boolean;

      /**
       * Whether the result is expected to be a JSON object which should be sent by value.
       * Can be overriden by `serializationOptions`.
       */
      returnByValue?: boolean;

      /**
       * Whether preview should be generated for the result.
       */
      generatePreview?: boolean;

      /**
       * Whether execution should be treated as initiated by user in the UI.
       */
      userGesture?: boolean;

      /**
       * Whether execution should `await` for resulting value and return once awaited promise is
       * resolved.
       */
      awaitPromise?: boolean;

      /**
       * Specifies execution context which global object will be used to call function on. Either
       * executionContextId or objectId should be specified.
       */
      executionContextId?: ExecutionContextId;

      /**
       * Symbolic group name that can be used to release multiple objects. If objectGroup is not
       * specified and objectId is, objectGroup will be inherited from object.
       */
      objectGroup?: string;

      /**
       * Whether to throw an exception if side effect cannot be ruled out during evaluation.
       */
      throwOnSideEffect?: boolean;

      /**
       * An alternative way to specify the execution context to call function on.
       * Compared to contextId that may be reused across processes, this is guaranteed to be
       * system-unique, so it can be used to prevent accidental function call
       * in context different than intended (e.g. as a result of navigation across process
       * boundaries).
       * This is mutually exclusive with `executionContextId`.
       */
      uniqueContextId?: string;

      /**
       * Specifies the result serialization. If provided, overrides
       * `generatePreview` and `returnByValue`.
       */
      serializationOptions?: SerializationOptions;
    }

    /**
     * Return value of the 'Runtime.callFunctionOn' method.
     */
    export interface CallFunctionOnResult {
      /**
       * Call result.
       */
      result: RemoteObject;

      /**
       * Exception details.
       */
      exceptionDetails?: ExceptionDetails;
    }

    /**
     * Parameters of the 'Runtime.compileScript' method.
     */
    export interface CompileScriptParams {
      /**
       * Expression to compile.
       */
      expression: string;

      /**
       * Source url to be set for the script.
       */
      sourceURL: string;

      /**
       * Specifies whether the compiled script should be persisted.
       */
      persistScript: boolean;

      /**
       * Specifies in which execution context to perform script run. If the parameter is omitted the
       * evaluation will be performed in the context of the inspected page.
       */
      executionContextId?: ExecutionContextId;
    }

    /**
     * Return value of the 'Runtime.compileScript' method.
     */
    export interface CompileScriptResult {
      /**
       * Id of the script.
       */
      scriptId?: ScriptId;

      /**
       * Exception details.
       */
      exceptionDetails?: ExceptionDetails;
    }

    /**
     * Parameters of the 'Runtime.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'Runtime.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'Runtime.discardConsoleEntries' method.
     */
    export interface DiscardConsoleEntriesParams {
    }

    /**
     * Return value of the 'Runtime.discardConsoleEntries' method.
     */
    export interface DiscardConsoleEntriesResult {
    }

    /**
     * Parameters of the 'Runtime.enable' method.
     */
    export interface EnableParams {
    }

    /**
     * Return value of the 'Runtime.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'Runtime.evaluate' method.
     */
    export interface EvaluateParams {
      /**
       * Expression to evaluate.
       */
      expression: string;

      /**
       * Symbolic group name that can be used to release multiple objects.
       */
      objectGroup?: string;

      /**
       * Determines whether Command Line API should be available during the evaluation.
       */
      includeCommandLineAPI?: boolean;

      /**
       * In silent mode exceptions thrown during evaluation are not reported and do not pause
       * execution. Overrides `setPauseOnException` state.
       */
      silent?: boolean;

      /**
       * Specifies in which execution context to perform evaluation. If the parameter is omitted the
       * evaluation will be performed in the context of the inspected page.
       * This is mutually exclusive with `uniqueContextId`, which offers an
       * alternative way to identify the execution context that is more reliable
       * in a multi-process environment.
       */
      contextId?: ExecutionContextId;

      /**
       * Whether the result is expected to be a JSON object that should be sent by value.
       */
      returnByValue?: boolean;

      /**
       * Whether preview should be generated for the result.
       */
      generatePreview?: boolean;

      /**
       * Whether execution should be treated as initiated by user in the UI.
       */
      userGesture?: boolean;

      /**
       * Whether execution should `await` for resulting value and return once awaited promise is
       * resolved.
       */
      awaitPromise?: boolean;

      /**
       * Whether to throw an exception if side effect cannot be ruled out during evaluation.
       * This implies `disableBreaks` below.
       */
      throwOnSideEffect?: boolean;

      /**
       * Terminate execution after timing out (number of milliseconds).
       */
      timeout?: TimeDelta;

      /**
       * Disable breakpoints during execution.
       */
      disableBreaks?: boolean;

      /**
       * Setting this flag to true enables `let` re-declaration and top-level `await`.
       * Note that `let` variables can only be re-declared if they originate from
       * `replMode` themselves.
       */
      replMode?: boolean;

      /**
       * The Content Security Policy (CSP) for the target might block 'unsafe-eval'
       * which includes eval(), Function(), setTimeout() and setInterval()
       * when called with non-callable arguments. This flag bypasses CSP for this
       * evaluation and allows unsafe-eval. Defaults to true.
       */
      allowUnsafeEvalBlockedByCSP?: boolean;

      /**
       * An alternative way to specify the execution context to evaluate in.
       * Compared to contextId that may be reused across processes, this is guaranteed to be
       * system-unique, so it can be used to prevent accidental evaluation of the expression
       * in context different than intended (e.g. as a result of navigation across process
       * boundaries).
       * This is mutually exclusive with `contextId`.
       */
      uniqueContextId?: string;

      /**
       * Specifies the result serialization. If provided, overrides
       * `generatePreview` and `returnByValue`.
       */
      serializationOptions?: SerializationOptions;
    }

    /**
     * Return value of the 'Runtime.evaluate' method.
     */
    export interface EvaluateResult {
      /**
       * Evaluation result.
       */
      result: RemoteObject;

      /**
       * Exception details.
       */
      exceptionDetails?: ExceptionDetails;
    }

    /**
     * Parameters of the 'Runtime.getIsolateId' method.
     */
    export interface GetIsolateIdParams {
    }

    /**
     * Return value of the 'Runtime.getIsolateId' method.
     */
    export interface GetIsolateIdResult {
      /**
       * The isolate id.
       */
      id: string;
    }

    /**
     * Parameters of the 'Runtime.getHeapUsage' method.
     */
    export interface GetHeapUsageParams {
    }

    /**
     * Return value of the 'Runtime.getHeapUsage' method.
     */
    export interface GetHeapUsageResult {
      /**
       * Used heap size in bytes.
       */
      usedSize: number;

      /**
       * Allocated heap size in bytes.
       */
      totalSize: number;
    }

    /**
     * Parameters of the 'Runtime.getProperties' method.
     */
    export interface GetPropertiesParams {
      /**
       * Identifier of the object to return properties for.
       */
      objectId: RemoteObjectId;

      /**
       * If true, returns properties belonging only to the element itself, not to its prototype
       * chain.
       */
      ownProperties?: boolean;

      /**
       * If true, returns accessor properties (with getter/setter) only; internal properties are not
       * returned either.
       */
      accessorPropertiesOnly?: boolean;

      /**
       * Whether preview should be generated for the results.
       */
      generatePreview?: boolean;

      /**
       * If true, returns non-indexed properties only.
       */
      nonIndexedPropertiesOnly?: boolean;
    }

    /**
     * Return value of the 'Runtime.getProperties' method.
     */
    export interface GetPropertiesResult {
      /**
       * Object properties.
       */
      result: PropertyDescriptor[];

      /**
       * Internal object properties (only of the element itself).
       */
      internalProperties?: InternalPropertyDescriptor[];

      /**
       * Object private properties.
       */
      privateProperties?: PrivatePropertyDescriptor[];

      /**
       * Exception details.
       */
      exceptionDetails?: ExceptionDetails;
    }

    /**
     * Parameters of the 'Runtime.globalLexicalScopeNames' method.
     */
    export interface GlobalLexicalScopeNamesParams {
      /**
       * Specifies in which execution context to lookup global scope variables.
       */
      executionContextId?: ExecutionContextId;
    }

    /**
     * Return value of the 'Runtime.globalLexicalScopeNames' method.
     */
    export interface GlobalLexicalScopeNamesResult {
      names: string[];
    }

    /**
     * Parameters of the 'Runtime.queryObjects' method.
     */
    export interface QueryObjectsParams {
      /**
       * Identifier of the prototype to return objects for.
       */
      prototypeObjectId: RemoteObjectId;

      /**
       * Symbolic group name that can be used to release the results.
       */
      objectGroup?: string;
    }

    /**
     * Return value of the 'Runtime.queryObjects' method.
     */
    export interface QueryObjectsResult {
      /**
       * Array with objects.
       */
      objects: RemoteObject;
    }

    /**
     * Parameters of the 'Runtime.releaseObject' method.
     */
    export interface ReleaseObjectParams {
      /**
       * Identifier of the object to release.
       */
      objectId: RemoteObjectId;
    }

    /**
     * Return value of the 'Runtime.releaseObject' method.
     */
    export interface ReleaseObjectResult {
    }

    /**
     * Parameters of the 'Runtime.releaseObjectGroup' method.
     */
    export interface ReleaseObjectGroupParams {
      /**
       * Symbolic object group name.
       */
      objectGroup: string;
    }

    /**
     * Return value of the 'Runtime.releaseObjectGroup' method.
     */
    export interface ReleaseObjectGroupResult {
    }

    /**
     * Parameters of the 'Runtime.runIfWaitingForDebugger' method.
     */
    export interface RunIfWaitingForDebuggerParams {
    }

    /**
     * Return value of the 'Runtime.runIfWaitingForDebugger' method.
     */
    export interface RunIfWaitingForDebuggerResult {
    }

    /**
     * Parameters of the 'Runtime.runScript' method.
     */
    export interface RunScriptParams {
      /**
       * Id of the script to run.
       */
      scriptId: ScriptId;

      /**
       * Specifies in which execution context to perform script run. If the parameter is omitted the
       * evaluation will be performed in the context of the inspected page.
       */
      executionContextId?: ExecutionContextId;

      /**
       * Symbolic group name that can be used to release multiple objects.
       */
      objectGroup?: string;

      /**
       * In silent mode exceptions thrown during evaluation are not reported and do not pause
       * execution. Overrides `setPauseOnException` state.
       */
      silent?: boolean;

      /**
       * Determines whether Command Line API should be available during the evaluation.
       */
      includeCommandLineAPI?: boolean;

      /**
       * Whether the result is expected to be a JSON object which should be sent by value.
       */
      returnByValue?: boolean;

      /**
       * Whether preview should be generated for the result.
       */
      generatePreview?: boolean;

      /**
       * Whether execution should `await` for resulting value and return once awaited promise is
       * resolved.
       */
      awaitPromise?: boolean;
    }

    /**
     * Return value of the 'Runtime.runScript' method.
     */
    export interface RunScriptResult {
      /**
       * Run result.
       */
      result: RemoteObject;

      /**
       * Exception details.
       */
      exceptionDetails?: ExceptionDetails;
    }

    /**
     * Parameters of the 'Runtime.setAsyncCallStackDepth' method.
     */
    export interface SetAsyncCallStackDepthParams {
      /**
       * Maximum depth of async call stacks. Setting to `0` will effectively disable collecting async
       * call stacks (default).
       */
      maxDepth: integer;
    }

    /**
     * Return value of the 'Runtime.setAsyncCallStackDepth' method.
     */
    export interface SetAsyncCallStackDepthResult {
    }

    /**
     * Parameters of the 'Runtime.setCustomObjectFormatterEnabled' method.
     */
    export interface SetCustomObjectFormatterEnabledParams {
      enabled: boolean;
    }

    /**
     * Return value of the 'Runtime.setCustomObjectFormatterEnabled' method.
     */
    export interface SetCustomObjectFormatterEnabledResult {
    }

    /**
     * Parameters of the 'Runtime.setMaxCallStackSizeToCapture' method.
     */
    export interface SetMaxCallStackSizeToCaptureParams {
      size: integer;
    }

    /**
     * Return value of the 'Runtime.setMaxCallStackSizeToCapture' method.
     */
    export interface SetMaxCallStackSizeToCaptureResult {
    }

    /**
     * Parameters of the 'Runtime.terminateExecution' method.
     */
    export interface TerminateExecutionParams {
    }

    /**
     * Return value of the 'Runtime.terminateExecution' method.
     */
    export interface TerminateExecutionResult {
    }

    /**
     * Parameters of the 'Runtime.addBinding' method.
     */
    export interface AddBindingParams {
      name: string;

      /**
       * If specified, the binding would only be exposed to the specified
       * execution context. If omitted and `executionContextName` is not set,
       * the binding is exposed to all execution contexts of the target.
       * This parameter is mutually exclusive with `executionContextName`.
       * Deprecated in favor of `executionContextName` due to an unclear use case
       * and bugs in implementation (crbug.com/1169639). `executionContextId` will be
       * removed in the future.
       * @deprecated
       */
      executionContextId?: ExecutionContextId;

      /**
       * If specified, the binding is exposed to the executionContext with
       * matching name, even for contexts created after the binding is added.
       * See also `ExecutionContext.name` and `worldName` parameter to
       * `Page.addScriptToEvaluateOnNewDocument`.
       * This parameter is mutually exclusive with `executionContextId`.
       */
      executionContextName?: string;
    }

    /**
     * Return value of the 'Runtime.addBinding' method.
     */
    export interface AddBindingResult {
    }

    /**
     * Parameters of the 'Runtime.removeBinding' method.
     */
    export interface RemoveBindingParams {
      name: string;
    }

    /**
     * Return value of the 'Runtime.removeBinding' method.
     */
    export interface RemoveBindingResult {
    }

    /**
     * Parameters of the 'Runtime.getExceptionDetails' method.
     */
    export interface GetExceptionDetailsParams {
      /**
       * The error object for which to resolve the exception details.
       */
      errorObjectId: RemoteObjectId;
    }

    /**
     * Return value of the 'Runtime.getExceptionDetails' method.
     */
    export interface GetExceptionDetailsResult {
      exceptionDetails?: ExceptionDetails;
    }

    /**
     * Parameters of the 'Runtime.bindingCalled' event.
     */
    export interface BindingCalledEvent {
      name: string;

      payload: string;

      /**
       * Identifier of the context where the call was made.
       */
      executionContextId: ExecutionContextId;
    }

    /**
     * Parameters of the 'Runtime.consoleAPICalled' event.
     */
    export interface ConsoleAPICalledEvent {
      /**
       * Type of the call.
       */
      type: 'log' | 'debug' | 'info' | 'error' | 'warning' | 'dir' | 'dirxml' | 'table' | 'trace' | 'clear' | 'startGroup' | 'startGroupCollapsed' | 'endGroup' | 'assert' | 'profile' | 'profileEnd' | 'count' | 'timeEnd';

      /**
       * Call arguments.
       */
      args: RemoteObject[];

      /**
       * Identifier of the context where the call was made.
       */
      executionContextId: ExecutionContextId;

      /**
       * Call timestamp.
       */
      timestamp: Timestamp;

      /**
       * Stack trace captured when the call was made. The async stack chain is automatically reported for
       * the following call types: `assert`, `error`, `trace`, `warning`. For other types the async call
       * chain can be retrieved using `Debugger.getStackTrace` and `stackTrace.parentId` field.
       */
      stackTrace?: StackTrace;

      /**
       * Console context descriptor for calls on non-default console context (not console.*):
       * 'anonymous#unique-logger-id' for call on unnamed context, 'name#unique-logger-id' for call
       * on named context.
       */
      context?: string;
    }

    /**
     * Parameters of the 'Runtime.exceptionRevoked' event.
     */
    export interface ExceptionRevokedEvent {
      /**
       * Reason describing why exception was revoked.
       */
      reason: string;

      /**
       * The id of revoked exception, as reported in `exceptionThrown`.
       */
      exceptionId: integer;
    }

    /**
     * Parameters of the 'Runtime.exceptionThrown' event.
     */
    export interface ExceptionThrownEvent {
      /**
       * Timestamp of the exception.
       */
      timestamp: Timestamp;

      exceptionDetails: ExceptionDetails;
    }

    /**
     * Parameters of the 'Runtime.executionContextCreated' event.
     */
    export interface ExecutionContextCreatedEvent {
      /**
       * A newly created execution context.
       */
      context: ExecutionContextDescription;
    }

    /**
     * Parameters of the 'Runtime.executionContextDestroyed' event.
     */
    export interface ExecutionContextDestroyedEvent {
      /**
       * Id of the destroyed context
       * @deprecated
       */
      executionContextId: ExecutionContextId;

      /**
       * Unique Id of the destroyed context
       */
      executionContextUniqueId: string;
    }

    /**
     * Parameters of the 'Runtime.executionContextsCleared' event.
     */
    export interface ExecutionContextsClearedEvent {
    }

    /**
     * Parameters of the 'Runtime.inspectRequested' event.
     */
    export interface InspectRequestedEvent {
      object: RemoteObject;

      hints: Record<string, unknown>;

      /**
       * Identifier of the context where the call was made.
       */
      executionContextId?: ExecutionContextId;
    }

    /**
     * Unique script identifier.
     */
    export type ScriptId = string;

    /**
     * Represents options for serialization. Overrides `generatePreview` and `returnByValue`.
     */
    export interface SerializationOptions {
      serialization: 'deep' | 'json' | 'idOnly';

      /**
       * Deep serialization depth. Default is full depth. Respected only in `deep` serialization mode.
       */
      maxDepth?: integer;

      /**
       * Embedder-specific parameters. For example if connected to V8 in Chrome these control DOM
       * serialization via `maxNodeDepth: integer` and `includeShadowTree: "none" | "open" | "all"`.
       * Values can be only of type string or integer.
       */
      additionalParameters?: Record<string, unknown>;
    }

    /**
     * Represents deep serialized value.
     */
    export interface DeepSerializedValue {
      type: 'undefined' | 'null' | 'string' | 'number' | 'boolean' | 'bigint' | 'regexp' | 'date' | 'symbol' | 'array' | 'object' | 'function' | 'map' | 'set' | 'weakmap' | 'weakset' | 'error' | 'proxy' | 'promise' | 'typedarray' | 'arraybuffer' | 'node' | 'window' | 'generator';

      value?: any;

      objectId?: string;

      /**
       * Set if value reference met more then once during serialization. In such
       * case, value is provided only to one of the serialized values. Unique
       * per value in the scope of one CDP call.
       */
      weakLocalObjectReference?: integer;
    }

    /**
     * Unique object identifier.
     */
    export type RemoteObjectId = string;

    /**
     * Primitive value which cannot be JSON-stringified. Includes values `-0`, `NaN`, `Infinity`,
     * `-Infinity`, and bigint literals.
     */
    export type UnserializableValue = string;

    /**
     * Mirror object referencing original JavaScript object.
     */
    export interface RemoteObject {
      /**
       * Object type.
       */
      type: 'object' | 'function' | 'undefined' | 'string' | 'number' | 'boolean' | 'symbol' | 'bigint';

      /**
       * Object subtype hint. Specified for `object` type values only.
       * NOTE: If you change anything here, make sure to also update
       * `subtype` in `ObjectPreview` and `PropertyPreview` below.
       */
      subtype?: 'array' | 'null' | 'node' | 'regexp' | 'date' | 'map' | 'set' | 'weakmap' | 'weakset' | 'iterator' | 'generator' | 'error' | 'proxy' | 'promise' | 'typedarray' | 'arraybuffer' | 'dataview' | 'webassemblymemory' | 'wasmvalue';

      /**
       * Object class (constructor) name. Specified for `object` type values only.
       */
      className?: string;

      /**
       * Remote object value in case of primitive values or JSON values (if it was requested).
       */
      value?: any;

      /**
       * Primitive value which can not be JSON-stringified does not have `value`, but gets this
       * property.
       */
      unserializableValue?: UnserializableValue;

      /**
       * String representation of the object.
       */
      description?: string;

      /**
       * Deep serialized value.
       */
      deepSerializedValue?: DeepSerializedValue;

      /**
       * Unique object identifier (for non-primitive values).
       */
      objectId?: RemoteObjectId;

      /**
       * Preview containing abbreviated property values. Specified for `object` type values only.
       */
      preview?: ObjectPreview;

      customPreview?: CustomPreview;
    }

    export interface CustomPreview {
      /**
       * The JSON-stringified result of formatter.header(object, config) call.
       * It contains json ML array that represents RemoteObject.
       */
      header: string;

      /**
       * If formatter returns true as a result of formatter.hasBody call then bodyGetterId will
       * contain RemoteObjectId for the function that returns result of formatter.body(object, config) call.
       * The result value is json ML array.
       */
      bodyGetterId?: RemoteObjectId;
    }

    /**
     * Object containing abbreviated remote object value.
     */
    export interface ObjectPreview {
      /**
       * Object type.
       */
      type: 'object' | 'function' | 'undefined' | 'string' | 'number' | 'boolean' | 'symbol' | 'bigint';

      /**
       * Object subtype hint. Specified for `object` type values only.
       */
      subtype?: 'array' | 'null' | 'node' | 'regexp' | 'date' | 'map' | 'set' | 'weakmap' | 'weakset' | 'iterator' | 'generator' | 'error' | 'proxy' | 'promise' | 'typedarray' | 'arraybuffer' | 'dataview' | 'webassemblymemory' | 'wasmvalue';

      /**
       * String representation of the object.
       */
      description?: string;

      /**
       * True iff some of the properties or entries of the original object did not fit.
       */
      overflow: boolean;

      /**
       * List of the properties.
       */
      properties: PropertyPreview[];

      /**
       * List of the entries. Specified for `map` and `set` subtype values only.
       */
      entries?: EntryPreview[];
    }

    export interface PropertyPreview {
      /**
       * Property name.
       */
      name: string;

      /**
       * Object type. Accessor means that the property itself is an accessor property.
       */
      type: 'object' | 'function' | 'undefined' | 'string' | 'number' | 'boolean' | 'symbol' | 'accessor' | 'bigint';

      /**
       * User-friendly property value string.
       */
      value?: string;

      /**
       * Nested value preview.
       */
      valuePreview?: ObjectPreview;

      /**
       * Object subtype hint. Specified for `object` type values only.
       */
      subtype?: 'array' | 'null' | 'node' | 'regexp' | 'date' | 'map' | 'set' | 'weakmap' | 'weakset' | 'iterator' | 'generator' | 'error' | 'proxy' | 'promise' | 'typedarray' | 'arraybuffer' | 'dataview' | 'webassemblymemory' | 'wasmvalue';
    }

    export interface EntryPreview {
      /**
       * Preview of the key. Specified for map-like collection entries.
       */
      key?: ObjectPreview;

      /**
       * Preview of the value.
       */
      value: ObjectPreview;
    }

    /**
     * Object property descriptor.
     */
    export interface PropertyDescriptor {
      /**
       * Property name or symbol description.
       */
      name: string;

      /**
       * The value associated with the property.
       */
      value?: RemoteObject;

      /**
       * True if the value associated with the property may be changed (data descriptors only).
       */
      writable?: boolean;

      /**
       * A function which serves as a getter for the property, or `undefined` if there is no getter
       * (accessor descriptors only).
       */
      get?: RemoteObject;

      /**
       * A function which serves as a setter for the property, or `undefined` if there is no setter
       * (accessor descriptors only).
       */
      set?: RemoteObject;

      /**
       * True if the type of this property descriptor may be changed and if the property may be
       * deleted from the corresponding object.
       */
      configurable: boolean;

      /**
       * True if this property shows up during enumeration of the properties on the corresponding
       * object.
       */
      enumerable: boolean;

      /**
       * True if the result was thrown during the evaluation.
       */
      wasThrown?: boolean;

      /**
       * True if the property is owned for the object.
       */
      isOwn?: boolean;

      /**
       * Property symbol object, if the property is of the `symbol` type.
       */
      symbol?: RemoteObject;
    }

    /**
     * Object internal property descriptor. This property isn't normally visible in JavaScript code.
     */
    export interface InternalPropertyDescriptor {
      /**
       * Conventional property name.
       */
      name: string;

      /**
       * The value associated with the property.
       */
      value?: RemoteObject;
    }

    /**
     * Object private field descriptor.
     */
    export interface PrivatePropertyDescriptor {
      /**
       * Private property name.
       */
      name: string;

      /**
       * The value associated with the private property.
       */
      value?: RemoteObject;

      /**
       * A function which serves as a getter for the private property,
       * or `undefined` if there is no getter (accessor descriptors only).
       */
      get?: RemoteObject;

      /**
       * A function which serves as a setter for the private property,
       * or `undefined` if there is no setter (accessor descriptors only).
       */
      set?: RemoteObject;
    }

    /**
     * Represents function call argument. Either remote object id `objectId`, primitive `value`,
     * unserializable primitive value or neither of (for undefined) them should be specified.
     */
    export interface CallArgument {
      /**
       * Primitive value or serializable javascript object.
       */
      value?: any;

      /**
       * Primitive value which can not be JSON-stringified.
       */
      unserializableValue?: UnserializableValue;

      /**
       * Remote object handle.
       */
      objectId?: RemoteObjectId;
    }

    /**
     * Id of an execution context.
     */
    export type ExecutionContextId = integer;

    /**
     * Description of an isolated world.
     */
    export interface ExecutionContextDescription {
      /**
       * Unique id of the execution context. It can be used to specify in which execution context
       * script evaluation should be performed.
       */
      id: ExecutionContextId;

      /**
       * Execution context origin.
       */
      origin: string;

      /**
       * Human readable name describing given context.
       */
      name: string;

      /**
       * A system-unique execution context identifier. Unlike the id, this is unique across
       * multiple processes, so can be reliably used to identify specific context while backend
       * performs a cross-process navigation.
       */
      uniqueId: string;

      /**
       * Embedder-specific auxiliary data likely matching {isDefault: boolean, type: 'default'|'isolated'|'worker', frameId: string}
       */
      auxData?: Record<string, unknown>;
    }

    /**
     * Detailed information about exception (or error) that was thrown during script compilation or
     * execution.
     */
    export interface ExceptionDetails {
      /**
       * Exception id.
       */
      exceptionId: integer;

      /**
       * Exception text, which should be used together with exception object when available.
       */
      text: string;

      /**
       * Line number of the exception location (0-based).
       */
      lineNumber: integer;

      /**
       * Column number of the exception location (0-based).
       */
      columnNumber: integer;

      /**
       * Script ID of the exception location.
       */
      scriptId?: ScriptId;

      /**
       * URL of the exception location, to be used when the script was not reported.
       */
      url?: string;

      /**
       * JavaScript stack trace if available.
       */
      stackTrace?: StackTrace;

      /**
       * Exception object if available.
       */
      exception?: RemoteObject;

      /**
       * Identifier of the context where exception happened.
       */
      executionContextId?: ExecutionContextId;

      /**
       * Dictionary with entries of meta data that the client associated
       * with this exception, such as information about associated network
       * requests, etc.
       */
      exceptionMetaData?: Record<string, unknown>;
    }

    /**
     * Number of milliseconds since epoch.
     */
    export type Timestamp = number;

    /**
     * Number of milliseconds.
     */
    export type TimeDelta = number;

    /**
     * Stack entry for runtime errors and assertions.
     */
    export interface CallFrame {
      /**
       * JavaScript function name.
       */
      functionName: string;

      /**
       * JavaScript script id.
       */
      scriptId: ScriptId;

      /**
       * JavaScript script name or url.
       */
      url: string;

      /**
       * JavaScript script line number (0-based).
       */
      lineNumber: integer;

      /**
       * JavaScript script column number (0-based).
       */
      columnNumber: integer;
    }

    /**
     * Call frames for assertions or error messages.
     */
    export interface StackTrace {
      /**
       * String label of this stack trace. For async traces this may be a name of the function that
       * initiated the async call.
       */
      description?: string;

      /**
       * JavaScript function name.
       */
      callFrames: CallFrame[];

      /**
       * Asynchronous JavaScript stack trace that preceded this stack, if available.
       */
      parent?: StackTrace;

      /**
       * Asynchronous JavaScript stack trace that preceded this stack, if available.
       */
      parentId?: StackTraceId;
    }

    /**
     * Unique identifier of current debugger.
     */
    export type UniqueDebuggerId = string;

    /**
     * If `debuggerId` is set stack trace comes from another debugger and can be resolved there. This
     * allows to track cross-debugger calls. See `Runtime.StackTrace` and `Debugger.paused` for usages.
     */
    export interface StackTraceId {
      id: string;

      debuggerId?: UniqueDebuggerId;
    }
  }

  /**
   * Methods and events of the 'Schema' domain.
   */
  export interface SchemaApi {
    requests: {
      /**
       * Returns supported domains.
       */
      getDomains: { params: Schema.GetDomainsParams, result: Schema.GetDomainsResult }
    };
    events: {
    };
  }

  /**
   * Types of the 'Schema' domain.
   */
  export namespace Schema {
    /**
     * Parameters of the 'Schema.getDomains' method.
     */
    export interface GetDomainsParams {
    }

    /**
     * Return value of the 'Schema.getDomains' method.
     */
    export interface GetDomainsResult {
      /**
       * List of supported domains.
       */
      domains: Domain[];
    }

    /**
     * Description of the protocol domain.
     */
    export interface Domain {
      /**
       * Domain name.
       */
      name: string;

      /**
       * Domain version.
       */
      version: string;
    }
  }
}


export namespace CdpBrowser {
  export type integer = number;

  /**
   * The list of domains.
   */
  export interface Domains {

    Accessibility: AccessibilityApi;
    Animation: AnimationApi;
    Audits: AuditsApi;
    Autofill: AutofillApi;
    BackgroundService: BackgroundServiceApi;
    Browser: BrowserApi;
    CSS: CSSApi;
    CacheStorage: CacheStorageApi;
    Cast: CastApi;
    DOM: DOMApi;
    DOMDebugger: DOMDebuggerApi;
    EventBreakpoints: EventBreakpointsApi;
    DOMSnapshot: DOMSnapshotApi;
    DOMStorage: DOMStorageApi;
    Database: DatabaseApi;
    DeviceOrientation: DeviceOrientationApi;
    Emulation: EmulationApi;
    HeadlessExperimental: HeadlessExperimentalApi;
    IO: IOApi;
    IndexedDB: IndexedDBApi;
    Input: InputApi;
    Inspector: InspectorApi;
    LayerTree: LayerTreeApi;
    Log: LogApi;
    Memory: MemoryApi;
    Network: NetworkApi;
    Overlay: OverlayApi;
    Page: PageApi;
    Performance: PerformanceApi;
    PerformanceTimeline: PerformanceTimelineApi;
    Security: SecurityApi;
    ServiceWorker: ServiceWorkerApi;
    Storage: StorageApi;
    SystemInfo: SystemInfoApi;
    Target: TargetApi;
    Tethering: TetheringApi;
    Tracing: TracingApi;
    Fetch: FetchApi;
    WebAudio: WebAudioApi;
    WebAuthn: WebAuthnApi;
    Media: MediaApi;
    DeviceAccess: DeviceAccessApi;
    Preload: PreloadApi;
    FedCm: FedCmApi;
  }

  /**
   * Methods and events of the 'Accessibility' domain.
   */
  export interface AccessibilityApi {
    requests: {
      /**
       * Disables the accessibility domain.
       */
      disable: { params: Accessibility.DisableParams, result: Accessibility.DisableResult }

      /**
       * Enables the accessibility domain which causes `AXNodeId`s to remain consistent between method calls.
       * This turns on accessibility for the page, which can impact performance until accessibility is disabled.
       */
      enable: { params: Accessibility.EnableParams, result: Accessibility.EnableResult }

      /**
       * Fetches the accessibility node and partial accessibility tree for this DOM node, if it exists.
       */
      getPartialAXTree: { params: Accessibility.GetPartialAXTreeParams, result: Accessibility.GetPartialAXTreeResult }

      /**
       * Fetches the entire accessibility tree for the root Document
       */
      getFullAXTree: { params: Accessibility.GetFullAXTreeParams, result: Accessibility.GetFullAXTreeResult }

      /**
       * Fetches the root node.
       * Requires `enable()` to have been called previously.
       */
      getRootAXNode: { params: Accessibility.GetRootAXNodeParams, result: Accessibility.GetRootAXNodeResult }

      /**
       * Fetches a node and all ancestors up to and including the root.
       * Requires `enable()` to have been called previously.
       */
      getAXNodeAndAncestors: { params: Accessibility.GetAXNodeAndAncestorsParams, result: Accessibility.GetAXNodeAndAncestorsResult }

      /**
       * Fetches a particular accessibility node by AXNodeId.
       * Requires `enable()` to have been called previously.
       */
      getChildAXNodes: { params: Accessibility.GetChildAXNodesParams, result: Accessibility.GetChildAXNodesResult }

      /**
       * Query a DOM node's accessibility subtree for accessible name and role.
       * This command computes the name and role for all nodes in the subtree, including those that are
       * ignored for accessibility, and returns those that mactch the specified name and role. If no DOM
       * node is specified, or the DOM node does not exist, the command returns an error. If neither
       * `accessibleName` or `role` is specified, it returns all the accessibility nodes in the subtree.
       */
      queryAXTree: { params: Accessibility.QueryAXTreeParams, result: Accessibility.QueryAXTreeResult }
    };
    events: {

      /**
       * The loadComplete event mirrors the load complete event sent by the browser to assistive
       * technology when the web page has finished loading.
       */
      loadComplete: { params: Accessibility.LoadCompleteEvent };

      /**
       * The nodesUpdated event is sent every time a previously requested node has changed the in tree.
       */
      nodesUpdated: { params: Accessibility.NodesUpdatedEvent };
    };
  }

  /**
   * Types of the 'Accessibility' domain.
   */
  export namespace Accessibility {
    /**
     * Parameters of the 'Accessibility.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'Accessibility.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'Accessibility.enable' method.
     */
    export interface EnableParams {
    }

    /**
     * Return value of the 'Accessibility.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'Accessibility.getPartialAXTree' method.
     */
    export interface GetPartialAXTreeParams {
      /**
       * Identifier of the node to get the partial accessibility tree for.
       */
      nodeId?: DOM.NodeId;

      /**
       * Identifier of the backend node to get the partial accessibility tree for.
       */
      backendNodeId?: DOM.BackendNodeId;

      /**
       * JavaScript object id of the node wrapper to get the partial accessibility tree for.
       */
      objectId?: CdpV8.Runtime.RemoteObjectId;

      /**
       * Whether to fetch this node's ancestors, siblings and children. Defaults to true.
       */
      fetchRelatives?: boolean;
    }

    /**
     * Return value of the 'Accessibility.getPartialAXTree' method.
     */
    export interface GetPartialAXTreeResult {
      /**
       * The `Accessibility.AXNode` for this DOM node, if it exists, plus its ancestors, siblings and
       * children, if requested.
       */
      nodes: AXNode[];
    }

    /**
     * Parameters of the 'Accessibility.getFullAXTree' method.
     */
    export interface GetFullAXTreeParams {
      /**
       * The maximum depth at which descendants of the root node should be retrieved.
       * If omitted, the full tree is returned.
       */
      depth?: integer;

      /**
       * The frame for whose document the AX tree should be retrieved.
       * If omited, the root frame is used.
       */
      frameId?: Page.FrameId;
    }

    /**
     * Return value of the 'Accessibility.getFullAXTree' method.
     */
    export interface GetFullAXTreeResult {
      nodes: AXNode[];
    }

    /**
     * Parameters of the 'Accessibility.getRootAXNode' method.
     */
    export interface GetRootAXNodeParams {
      /**
       * The frame in whose document the node resides.
       * If omitted, the root frame is used.
       */
      frameId?: Page.FrameId;
    }

    /**
     * Return value of the 'Accessibility.getRootAXNode' method.
     */
    export interface GetRootAXNodeResult {
      node: AXNode;
    }

    /**
     * Parameters of the 'Accessibility.getAXNodeAndAncestors' method.
     */
    export interface GetAXNodeAndAncestorsParams {
      /**
       * Identifier of the node to get.
       */
      nodeId?: DOM.NodeId;

      /**
       * Identifier of the backend node to get.
       */
      backendNodeId?: DOM.BackendNodeId;

      /**
       * JavaScript object id of the node wrapper to get.
       */
      objectId?: CdpV8.Runtime.RemoteObjectId;
    }

    /**
     * Return value of the 'Accessibility.getAXNodeAndAncestors' method.
     */
    export interface GetAXNodeAndAncestorsResult {
      nodes: AXNode[];
    }

    /**
     * Parameters of the 'Accessibility.getChildAXNodes' method.
     */
    export interface GetChildAXNodesParams {
      id: AXNodeId;

      /**
       * The frame in whose document the node resides.
       * If omitted, the root frame is used.
       */
      frameId?: Page.FrameId;
    }

    /**
     * Return value of the 'Accessibility.getChildAXNodes' method.
     */
    export interface GetChildAXNodesResult {
      nodes: AXNode[];
    }

    /**
     * Parameters of the 'Accessibility.queryAXTree' method.
     */
    export interface QueryAXTreeParams {
      /**
       * Identifier of the node for the root to query.
       */
      nodeId?: DOM.NodeId;

      /**
       * Identifier of the backend node for the root to query.
       */
      backendNodeId?: DOM.BackendNodeId;

      /**
       * JavaScript object id of the node wrapper for the root to query.
       */
      objectId?: CdpV8.Runtime.RemoteObjectId;

      /**
       * Find nodes with this computed name.
       */
      accessibleName?: string;

      /**
       * Find nodes with this computed role.
       */
      role?: string;
    }

    /**
     * Return value of the 'Accessibility.queryAXTree' method.
     */
    export interface QueryAXTreeResult {
      /**
       * A list of `Accessibility.AXNode` matching the specified attributes,
       * including nodes that are ignored for accessibility.
       */
      nodes: AXNode[];
    }

    /**
     * Parameters of the 'Accessibility.loadComplete' event.
     */
    export interface LoadCompleteEvent {
      /**
       * New document root node.
       */
      root: AXNode;
    }

    /**
     * Parameters of the 'Accessibility.nodesUpdated' event.
     */
    export interface NodesUpdatedEvent {
      /**
       * Updated node data.
       */
      nodes: AXNode[];
    }

    /**
     * Unique accessibility node identifier.
     */
    export type AXNodeId = string;

    /**
     * Enum of possible property types.
     */
    export type AXValueType = 'boolean' | 'tristate' | 'booleanOrUndefined' | 'idref' | 'idrefList' | 'integer' | 'node' | 'nodeList' | 'number' | 'string' | 'computedString' | 'token' | 'tokenList' | 'domRelation' | 'role' | 'internalRole' | 'valueUndefined';

    /**
     * Enum of possible property sources.
     */
    export type AXValueSourceType = 'attribute' | 'implicit' | 'style' | 'contents' | 'placeholder' | 'relatedElement';

    /**
     * Enum of possible native property sources (as a subtype of a particular AXValueSourceType).
     */
    export type AXValueNativeSourceType = 'description' | 'figcaption' | 'label' | 'labelfor' | 'labelwrapped' | 'legend' | 'rubyannotation' | 'tablecaption' | 'title' | 'other';

    /**
     * A single source for a computed AX property.
     */
    export interface AXValueSource {
      /**
       * What type of source this is.
       */
      type: AXValueSourceType;

      /**
       * The value of this property source.
       */
      value?: AXValue;

      /**
       * The name of the relevant attribute, if any.
       */
      attribute?: string;

      /**
       * The value of the relevant attribute, if any.
       */
      attributeValue?: AXValue;

      /**
       * Whether this source is superseded by a higher priority source.
       */
      superseded?: boolean;

      /**
       * The native markup source for this value, e.g. a `<label>` element.
       */
      nativeSource?: AXValueNativeSourceType;

      /**
       * The value, such as a node or node list, of the native source.
       */
      nativeSourceValue?: AXValue;

      /**
       * Whether the value for this property is invalid.
       */
      invalid?: boolean;

      /**
       * Reason for the value being invalid, if it is.
       */
      invalidReason?: string;
    }

    export interface AXRelatedNode {
      /**
       * The BackendNodeId of the related DOM node.
       */
      backendDOMNodeId: DOM.BackendNodeId;

      /**
       * The IDRef value provided, if any.
       */
      idref?: string;

      /**
       * The text alternative of this node in the current context.
       */
      text?: string;
    }

    export interface AXProperty {
      /**
       * The name of this property.
       */
      name: AXPropertyName;

      /**
       * The value of this property.
       */
      value: AXValue;
    }

    /**
     * A single computed AX property.
     */
    export interface AXValue {
      /**
       * The type of this value.
       */
      type: AXValueType;

      /**
       * The computed value of this property.
       */
      value?: any;

      /**
       * One or more related nodes, if applicable.
       */
      relatedNodes?: AXRelatedNode[];

      /**
       * The sources which contributed to the computation of this property.
       */
      sources?: AXValueSource[];
    }

    /**
     * Values of AXProperty name:
     * - from 'busy' to 'roledescription': states which apply to every AX node
     * - from 'live' to 'root': attributes which apply to nodes in live regions
     * - from 'autocomplete' to 'valuetext': attributes which apply to widgets
     * - from 'checked' to 'selected': states which apply to widgets
     * - from 'activedescendant' to 'owns' - relationships between elements other than parent/child/sibling.
     */
    export type AXPropertyName = 'busy' | 'disabled' | 'editable' | 'focusable' | 'focused' | 'hidden' | 'hiddenRoot' | 'invalid' | 'keyshortcuts' | 'settable' | 'roledescription' | 'live' | 'atomic' | 'relevant' | 'root' | 'autocomplete' | 'hasPopup' | 'level' | 'multiselectable' | 'orientation' | 'multiline' | 'readonly' | 'required' | 'valuemin' | 'valuemax' | 'valuetext' | 'checked' | 'expanded' | 'modal' | 'pressed' | 'selected' | 'activedescendant' | 'controls' | 'describedby' | 'details' | 'errormessage' | 'flowto' | 'labelledby' | 'owns';

    /**
     * A node in the accessibility tree.
     */
    export interface AXNode {
      /**
       * Unique identifier for this node.
       */
      nodeId: AXNodeId;

      /**
       * Whether this node is ignored for accessibility
       */
      ignored: boolean;

      /**
       * Collection of reasons why this node is hidden.
       */
      ignoredReasons?: AXProperty[];

      /**
       * This `Node`'s role, whether explicit or implicit.
       */
      role?: AXValue;

      /**
       * This `Node`'s Chrome raw role.
       */
      chromeRole?: AXValue;

      /**
       * The accessible name for this `Node`.
       */
      name?: AXValue;

      /**
       * The accessible description for this `Node`.
       */
      description?: AXValue;

      /**
       * The value for this `Node`.
       */
      value?: AXValue;

      /**
       * All other properties
       */
      properties?: AXProperty[];

      /**
       * ID for this node's parent.
       */
      parentId?: AXNodeId;

      /**
       * IDs for each of this node's child nodes.
       */
      childIds?: AXNodeId[];

      /**
       * The backend ID for the associated DOM node, if any.
       */
      backendDOMNodeId?: DOM.BackendNodeId;

      /**
       * The frame ID for the frame associated with this nodes document.
       */
      frameId?: Page.FrameId;
    }
  }

  /**
   * Methods and events of the 'Animation' domain.
   */
  export interface AnimationApi {
    requests: {
      /**
       * Disables animation domain notifications.
       */
      disable: { params: Animation.DisableParams, result: Animation.DisableResult }

      /**
       * Enables animation domain notifications.
       */
      enable: { params: Animation.EnableParams, result: Animation.EnableResult }

      /**
       * Returns the current time of the an animation.
       */
      getCurrentTime: { params: Animation.GetCurrentTimeParams, result: Animation.GetCurrentTimeResult }

      /**
       * Gets the playback rate of the document timeline.
       */
      getPlaybackRate: { params: Animation.GetPlaybackRateParams, result: Animation.GetPlaybackRateResult }

      /**
       * Releases a set of animations to no longer be manipulated.
       */
      releaseAnimations: { params: Animation.ReleaseAnimationsParams, result: Animation.ReleaseAnimationsResult }

      /**
       * Gets the remote object of the Animation.
       */
      resolveAnimation: { params: Animation.ResolveAnimationParams, result: Animation.ResolveAnimationResult }

      /**
       * Seek a set of animations to a particular time within each animation.
       */
      seekAnimations: { params: Animation.SeekAnimationsParams, result: Animation.SeekAnimationsResult }

      /**
       * Sets the paused state of a set of animations.
       */
      setPaused: { params: Animation.SetPausedParams, result: Animation.SetPausedResult }

      /**
       * Sets the playback rate of the document timeline.
       */
      setPlaybackRate: { params: Animation.SetPlaybackRateParams, result: Animation.SetPlaybackRateResult }

      /**
       * Sets the timing of an animation node.
       */
      setTiming: { params: Animation.SetTimingParams, result: Animation.SetTimingResult }
    };
    events: {

      /**
       * Event for when an animation has been cancelled.
       */
      animationCanceled: { params: Animation.AnimationCanceledEvent };

      /**
       * Event for each animation that has been created.
       */
      animationCreated: { params: Animation.AnimationCreatedEvent };

      /**
       * Event for animation that has been started.
       */
      animationStarted: { params: Animation.AnimationStartedEvent };
    };
  }

  /**
   * Types of the 'Animation' domain.
   */
  export namespace Animation {
    /**
     * Parameters of the 'Animation.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'Animation.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'Animation.enable' method.
     */
    export interface EnableParams {
    }

    /**
     * Return value of the 'Animation.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'Animation.getCurrentTime' method.
     */
    export interface GetCurrentTimeParams {
      /**
       * Id of animation.
       */
      id: string;
    }

    /**
     * Return value of the 'Animation.getCurrentTime' method.
     */
    export interface GetCurrentTimeResult {
      /**
       * Current time of the page.
       */
      currentTime: number;
    }

    /**
     * Parameters of the 'Animation.getPlaybackRate' method.
     */
    export interface GetPlaybackRateParams {
    }

    /**
     * Return value of the 'Animation.getPlaybackRate' method.
     */
    export interface GetPlaybackRateResult {
      /**
       * Playback rate for animations on page.
       */
      playbackRate: number;
    }

    /**
     * Parameters of the 'Animation.releaseAnimations' method.
     */
    export interface ReleaseAnimationsParams {
      /**
       * List of animation ids to seek.
       */
      animations: string[];
    }

    /**
     * Return value of the 'Animation.releaseAnimations' method.
     */
    export interface ReleaseAnimationsResult {
    }

    /**
     * Parameters of the 'Animation.resolveAnimation' method.
     */
    export interface ResolveAnimationParams {
      /**
       * Animation id.
       */
      animationId: string;
    }

    /**
     * Return value of the 'Animation.resolveAnimation' method.
     */
    export interface ResolveAnimationResult {
      /**
       * Corresponding remote object.
       */
      remoteObject: CdpV8.Runtime.RemoteObject;
    }

    /**
     * Parameters of the 'Animation.seekAnimations' method.
     */
    export interface SeekAnimationsParams {
      /**
       * List of animation ids to seek.
       */
      animations: string[];

      /**
       * Set the current time of each animation.
       */
      currentTime: number;
    }

    /**
     * Return value of the 'Animation.seekAnimations' method.
     */
    export interface SeekAnimationsResult {
    }

    /**
     * Parameters of the 'Animation.setPaused' method.
     */
    export interface SetPausedParams {
      /**
       * Animations to set the pause state of.
       */
      animations: string[];

      /**
       * Paused state to set to.
       */
      paused: boolean;
    }

    /**
     * Return value of the 'Animation.setPaused' method.
     */
    export interface SetPausedResult {
    }

    /**
     * Parameters of the 'Animation.setPlaybackRate' method.
     */
    export interface SetPlaybackRateParams {
      /**
       * Playback rate for animations on page
       */
      playbackRate: number;
    }

    /**
     * Return value of the 'Animation.setPlaybackRate' method.
     */
    export interface SetPlaybackRateResult {
    }

    /**
     * Parameters of the 'Animation.setTiming' method.
     */
    export interface SetTimingParams {
      /**
       * Animation id.
       */
      animationId: string;

      /**
       * Duration of the animation.
       */
      duration: number;

      /**
       * Delay of the animation.
       */
      delay: number;
    }

    /**
     * Return value of the 'Animation.setTiming' method.
     */
    export interface SetTimingResult {
    }

    /**
     * Parameters of the 'Animation.animationCanceled' event.
     */
    export interface AnimationCanceledEvent {
      /**
       * Id of the animation that was cancelled.
       */
      id: string;
    }

    /**
     * Parameters of the 'Animation.animationCreated' event.
     */
    export interface AnimationCreatedEvent {
      /**
       * Id of the animation that was created.
       */
      id: string;
    }

    /**
     * Parameters of the 'Animation.animationStarted' event.
     */
    export interface AnimationStartedEvent {
      /**
       * Animation that was started.
       */
      animation: Animation;
    }

    /**
     * Animation instance.
     */
    export interface Animation {
      /**
       * `Animation`'s id.
       */
      id: string;

      /**
       * `Animation`'s name.
       */
      name: string;

      /**
       * `Animation`'s internal paused state.
       */
      pausedState: boolean;

      /**
       * `Animation`'s play state.
       */
      playState: string;

      /**
       * `Animation`'s playback rate.
       */
      playbackRate: number;

      /**
       * `Animation`'s start time.
       */
      startTime: number;

      /**
       * `Animation`'s current time.
       */
      currentTime: number;

      /**
       * Animation type of `Animation`.
       */
      type: 'CSSTransition' | 'CSSAnimation' | 'WebAnimation';

      /**
       * `Animation`'s source animation node.
       */
      source?: AnimationEffect;

      /**
       * A unique ID for `Animation` representing the sources that triggered this CSS
       * animation/transition.
       */
      cssId?: string;
    }

    /**
     * AnimationEffect instance
     */
    export interface AnimationEffect {
      /**
       * `AnimationEffect`'s delay.
       */
      delay: number;

      /**
       * `AnimationEffect`'s end delay.
       */
      endDelay: number;

      /**
       * `AnimationEffect`'s iteration start.
       */
      iterationStart: number;

      /**
       * `AnimationEffect`'s iterations.
       */
      iterations: number;

      /**
       * `AnimationEffect`'s iteration duration.
       */
      duration: number;

      /**
       * `AnimationEffect`'s playback direction.
       */
      direction: string;

      /**
       * `AnimationEffect`'s fill mode.
       */
      fill: string;

      /**
       * `AnimationEffect`'s target node.
       */
      backendNodeId?: DOM.BackendNodeId;

      /**
       * `AnimationEffect`'s keyframes.
       */
      keyframesRule?: KeyframesRule;

      /**
       * `AnimationEffect`'s timing function.
       */
      easing: string;
    }

    /**
     * Keyframes Rule
     */
    export interface KeyframesRule {
      /**
       * CSS keyframed animation's name.
       */
      name?: string;

      /**
       * List of animation keyframes.
       */
      keyframes: KeyframeStyle[];
    }

    /**
     * Keyframe Style
     */
    export interface KeyframeStyle {
      /**
       * Keyframe's time offset.
       */
      offset: string;

      /**
       * `AnimationEffect`'s timing function.
       */
      easing: string;
    }
  }

  /**
   * Methods and events of the 'Audits' domain.
   */
  export interface AuditsApi {
    requests: {
      /**
       * Returns the response body and size if it were re-encoded with the specified settings. Only
       * applies to images.
       */
      getEncodedResponse: { params: Audits.GetEncodedResponseParams, result: Audits.GetEncodedResponseResult }

      /**
       * Disables issues domain, prevents further issues from being reported to the client.
       */
      disable: { params: Audits.DisableParams, result: Audits.DisableResult }

      /**
       * Enables issues domain, sends the issues collected so far to the client by means of the
       * `issueAdded` event.
       */
      enable: { params: Audits.EnableParams, result: Audits.EnableResult }

      /**
       * Runs the contrast check for the target page. Found issues are reported
       * using Audits.issueAdded event.
       */
      checkContrast: { params: Audits.CheckContrastParams, result: Audits.CheckContrastResult }

      /**
       * Runs the form issues check for the target page. Found issues are reported
       * using Audits.issueAdded event.
       */
      checkFormsIssues: { params: Audits.CheckFormsIssuesParams, result: Audits.CheckFormsIssuesResult }
    };
    events: {

      issueAdded: { params: Audits.IssueAddedEvent };
    };
  }

  /**
   * Types of the 'Audits' domain.
   */
  export namespace Audits {
    /**
     * Parameters of the 'Audits.getEncodedResponse' method.
     */
    export interface GetEncodedResponseParams {
      /**
       * Identifier of the network request to get content for.
       */
      requestId: Network.RequestId;

      /**
       * The encoding to use.
       */
      encoding: 'webp' | 'jpeg' | 'png';

      /**
       * The quality of the encoding (0-1). (defaults to 1)
       */
      quality?: number;

      /**
       * Whether to only return the size information (defaults to false).
       */
      sizeOnly?: boolean;
    }

    /**
     * Return value of the 'Audits.getEncodedResponse' method.
     */
    export interface GetEncodedResponseResult {
      /**
       * The encoded body as a base64 string. Omitted if sizeOnly is true. (Encoded as a base64 string when passed over JSON)
       */
      body?: string;

      /**
       * Size before re-encoding.
       */
      originalSize: integer;

      /**
       * Size after re-encoding.
       */
      encodedSize: integer;
    }

    /**
     * Parameters of the 'Audits.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'Audits.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'Audits.enable' method.
     */
    export interface EnableParams {
    }

    /**
     * Return value of the 'Audits.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'Audits.checkContrast' method.
     */
    export interface CheckContrastParams {
      /**
       * Whether to report WCAG AAA level issues. Default is false.
       */
      reportAAA?: boolean;
    }

    /**
     * Return value of the 'Audits.checkContrast' method.
     */
    export interface CheckContrastResult {
    }

    /**
     * Parameters of the 'Audits.checkFormsIssues' method.
     */
    export interface CheckFormsIssuesParams {
    }

    /**
     * Return value of the 'Audits.checkFormsIssues' method.
     */
    export interface CheckFormsIssuesResult {
      formIssues: GenericIssueDetails[];
    }

    /**
     * Parameters of the 'Audits.issueAdded' event.
     */
    export interface IssueAddedEvent {
      issue: InspectorIssue;
    }

    /**
     * Information about a cookie that is affected by an inspector issue.
     */
    export interface AffectedCookie {
      /**
       * The following three properties uniquely identify a cookie
       */
      name: string;

      path: string;

      domain: string;
    }

    /**
     * Information about a request that is affected by an inspector issue.
     */
    export interface AffectedRequest {
      /**
       * The unique request id.
       */
      requestId: Network.RequestId;

      url?: string;
    }

    /**
     * Information about the frame affected by an inspector issue.
     */
    export interface AffectedFrame {
      frameId: Page.FrameId;
    }

    export type CookieExclusionReason = 'ExcludeSameSiteUnspecifiedTreatedAsLax' | 'ExcludeSameSiteNoneInsecure' | 'ExcludeSameSiteLax' | 'ExcludeSameSiteStrict' | 'ExcludeInvalidSameParty' | 'ExcludeSamePartyCrossPartyContext' | 'ExcludeDomainNonASCII' | 'ExcludeThirdPartyCookieBlockedInFirstPartySet' | 'ExcludeThirdPartyPhaseout';

    export type CookieWarningReason = 'WarnSameSiteUnspecifiedCrossSiteContext' | 'WarnSameSiteNoneInsecure' | 'WarnSameSiteUnspecifiedLaxAllowUnsafe' | 'WarnSameSiteStrictLaxDowngradeStrict' | 'WarnSameSiteStrictCrossDowngradeStrict' | 'WarnSameSiteStrictCrossDowngradeLax' | 'WarnSameSiteLaxCrossDowngradeStrict' | 'WarnSameSiteLaxCrossDowngradeLax' | 'WarnAttributeValueExceedsMaxSize' | 'WarnDomainNonASCII' | 'WarnThirdPartyPhaseout' | 'WarnCrossSiteRedirectDowngradeChangesInclusion';

    export type CookieOperation = 'SetCookie' | 'ReadCookie';

    /**
     * This information is currently necessary, as the front-end has a difficult
     * time finding a specific cookie. With this, we can convey specific error
     * information without the cookie.
     */
    export interface CookieIssueDetails {
      /**
       * If AffectedCookie is not set then rawCookieLine contains the raw
       * Set-Cookie header string. This hints at a problem where the
       * cookie line is syntactically or semantically malformed in a way
       * that no valid cookie could be created.
       */
      cookie?: AffectedCookie;

      rawCookieLine?: string;

      cookieWarningReasons: CookieWarningReason[];

      cookieExclusionReasons: CookieExclusionReason[];

      /**
       * Optionally identifies the site-for-cookies and the cookie url, which
       * may be used by the front-end as additional context.
       */
      operation: CookieOperation;

      siteForCookies?: string;

      cookieUrl?: string;

      request?: AffectedRequest;
    }

    export type MixedContentResolutionStatus = 'MixedContentBlocked' | 'MixedContentAutomaticallyUpgraded' | 'MixedContentWarning';

    export type MixedContentResourceType = 'AttributionSrc' | 'Audio' | 'Beacon' | 'CSPReport' | 'Download' | 'EventSource' | 'Favicon' | 'Font' | 'Form' | 'Frame' | 'Image' | 'Import' | 'Manifest' | 'Ping' | 'PluginData' | 'PluginResource' | 'Prefetch' | 'Resource' | 'Script' | 'ServiceWorker' | 'SharedWorker' | 'SpeculationRules' | 'Stylesheet' | 'Track' | 'Video' | 'Worker' | 'XMLHttpRequest' | 'XSLT';

    export interface MixedContentIssueDetails {
      /**
       * The type of resource causing the mixed content issue (css, js, iframe,
       * form,...). Marked as optional because it is mapped to from
       * blink::mojom::RequestContextType, which will be replaced
       * by network::mojom::RequestDestination
       */
      resourceType?: MixedContentResourceType;

      /**
       * The way the mixed content issue is being resolved.
       */
      resolutionStatus: MixedContentResolutionStatus;

      /**
       * The unsafe http url causing the mixed content issue.
       */
      insecureURL: string;

      /**
       * The url responsible for the call to an unsafe url.
       */
      mainResourceURL: string;

      /**
       * The mixed content request.
       * Does not always exist (e.g. for unsafe form submission urls).
       */
      request?: AffectedRequest;

      /**
       * Optional because not every mixed content issue is necessarily linked to a frame.
       */
      frame?: AffectedFrame;
    }

    /**
     * Enum indicating the reason a response has been blocked. These reasons are
     * refinements of the net error BLOCKED_BY_RESPONSE.
     */
    export type BlockedByResponseReason = 'CoepFrameResourceNeedsCoepHeader' | 'CoopSandboxedIFrameCannotNavigateToCoopPage' | 'CorpNotSameOrigin' | 'CorpNotSameOriginAfterDefaultedToSameOriginByCoep' | 'CorpNotSameSite';

    /**
     * Details for a request that has been blocked with the BLOCKED_BY_RESPONSE
     * code. Currently only used for COEP/COOP, but may be extended to include
     * some CSP errors in the future.
     */
    export interface BlockedByResponseIssueDetails {
      request: AffectedRequest;

      parentFrame?: AffectedFrame;

      blockedFrame?: AffectedFrame;

      reason: BlockedByResponseReason;
    }

    export type HeavyAdResolutionStatus = 'HeavyAdBlocked' | 'HeavyAdWarning';

    export type HeavyAdReason = 'NetworkTotalLimit' | 'CpuTotalLimit' | 'CpuPeakLimit';

    export interface HeavyAdIssueDetails {
      /**
       * The resolution status, either blocking the content or warning.
       */
      resolution: HeavyAdResolutionStatus;

      /**
       * The reason the ad was blocked, total network or cpu or peak cpu.
       */
      reason: HeavyAdReason;

      /**
       * The frame that was blocked.
       */
      frame: AffectedFrame;
    }

    export type ContentSecurityPolicyViolationType = 'kInlineViolation' | 'kEvalViolation' | 'kURLViolation' | 'kTrustedTypesSinkViolation' | 'kTrustedTypesPolicyViolation' | 'kWasmEvalViolation';

    export interface SourceCodeLocation {
      scriptId?: CdpV8.Runtime.ScriptId;

      url: string;

      lineNumber: integer;

      columnNumber: integer;
    }

    export interface ContentSecurityPolicyIssueDetails {
      /**
       * The url not included in allowed sources.
       */
      blockedURL?: string;

      /**
       * Specific directive that is violated, causing the CSP issue.
       */
      violatedDirective: string;

      isReportOnly: boolean;

      contentSecurityPolicyViolationType: ContentSecurityPolicyViolationType;

      frameAncestor?: AffectedFrame;

      sourceCodeLocation?: SourceCodeLocation;

      violatingNodeId?: DOM.BackendNodeId;
    }

    export type SharedArrayBufferIssueType = 'TransferIssue' | 'CreationIssue';

    /**
     * Details for a issue arising from an SAB being instantiated in, or
     * transferred to a context that is not cross-origin isolated.
     */
    export interface SharedArrayBufferIssueDetails {
      sourceCodeLocation: SourceCodeLocation;

      isWarning: boolean;

      type: SharedArrayBufferIssueType;
    }

    export interface LowTextContrastIssueDetails {
      violatingNodeId: DOM.BackendNodeId;

      violatingNodeSelector: string;

      contrastRatio: number;

      thresholdAA: number;

      thresholdAAA: number;

      fontSize: string;

      fontWeight: string;
    }

    /**
     * Details for a CORS related issue, e.g. a warning or error related to
     * CORS RFC1918 enforcement.
     */
    export interface CorsIssueDetails {
      corsErrorStatus: Network.CorsErrorStatus;

      isWarning: boolean;

      request: AffectedRequest;

      location?: SourceCodeLocation;

      initiatorOrigin?: string;

      resourceIPAddressSpace?: Network.IPAddressSpace;

      clientSecurityState?: Network.ClientSecurityState;
    }

    export type AttributionReportingIssueType = 'PermissionPolicyDisabled' | 'UntrustworthyReportingOrigin' | 'InsecureContext' | 'InvalidHeader' | 'InvalidRegisterTriggerHeader' | 'SourceAndTriggerHeaders' | 'SourceIgnored' | 'TriggerIgnored' | 'OsSourceIgnored' | 'OsTriggerIgnored' | 'InvalidRegisterOsSourceHeader' | 'InvalidRegisterOsTriggerHeader' | 'WebAndOsHeaders' | 'NoWebOrOsSupport' | 'NavigationRegistrationWithoutTransientUserActivation';

    /**
     * Details for issues around "Attribution Reporting API" usage.
     * Explainer: https://github.com/WICG/attribution-reporting-api
     */
    export interface AttributionReportingIssueDetails {
      violationType: AttributionReportingIssueType;

      request?: AffectedRequest;

      violatingNodeId?: DOM.BackendNodeId;

      invalidParameter?: string;
    }

    /**
     * Details for issues about documents in Quirks Mode
     * or Limited Quirks Mode that affects page layouting.
     */
    export interface QuirksModeIssueDetails {
      /**
       * If false, it means the document's mode is "quirks"
       * instead of "limited-quirks".
       */
      isLimitedQuirksMode: boolean;

      documentNodeId: DOM.BackendNodeId;

      url: string;

      frameId: Page.FrameId;

      loaderId: Network.LoaderId;
    }

    /**
     * 
     * @deprecated
     */
    export interface NavigatorUserAgentIssueDetails {
      url: string;

      location?: SourceCodeLocation;
    }

    export type GenericIssueErrorType = 'CrossOriginPortalPostMessageError' | 'FormLabelForNameError' | 'FormDuplicateIdForInputError' | 'FormInputWithNoLabelError' | 'FormAutocompleteAttributeEmptyError' | 'FormEmptyIdAndNameAttributesForInputError' | 'FormAriaLabelledByToNonExistingId' | 'FormInputAssignedAutocompleteValueToIdOrNameAttributeError' | 'FormLabelHasNeitherForNorNestedInput' | 'FormLabelForMatchesNonExistingIdError' | 'FormInputHasWrongButWellIntendedAutocompleteValueError' | 'ResponseWasBlockedByORB';

    /**
     * Depending on the concrete errorType, different properties are set.
     */
    export interface GenericIssueDetails {
      /**
       * Issues with the same errorType are aggregated in the frontend.
       */
      errorType: GenericIssueErrorType;

      frameId?: Page.FrameId;

      violatingNodeId?: DOM.BackendNodeId;

      violatingNodeAttribute?: string;

      request?: AffectedRequest;
    }

    /**
     * This issue tracks information needed to print a deprecation message.
     * https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/frame/third_party/blink/renderer/core/frame/deprecation/README.md
     */
    export interface DeprecationIssueDetails {
      affectedFrame?: AffectedFrame;

      sourceCodeLocation: SourceCodeLocation;

      /**
       * One of the deprecation names from third_party/blink/renderer/core/frame/deprecation/deprecation.json5
       */
      type: string;
    }

    /**
     * This issue warns about sites in the redirect chain of a finished navigation
     * that may be flagged as trackers and have their state cleared if they don't
     * receive a user interaction. Note that in this context 'site' means eTLD+1.
     * For example, if the URL `https://example.test:80/bounce` was in the
     * redirect chain, the site reported would be `example.test`.
     */
    export interface BounceTrackingIssueDetails {
      trackingSites: string[];
    }

    /**
     * This issue warns about third-party sites that are accessing cookies on the
     * current page, and have been permitted due to having a global metadata grant.
     * Note that in this context 'site' means eTLD+1. For example, if the URL
     * `https://example.test:80/web_page` was accessing cookies, the site reported
     * would be `example.test`.
     */
    export interface CookieDeprecationMetadataIssueDetails {
      allowedSites: string[];
    }

    export type ClientHintIssueReason = 'MetaTagAllowListInvalidOrigin' | 'MetaTagModifiedHTML';

    export interface FederatedAuthRequestIssueDetails {
      federatedAuthRequestIssueReason: FederatedAuthRequestIssueReason;
    }

    /**
     * Represents the failure reason when a federated authentication reason fails.
     * Should be updated alongside RequestIdTokenStatus in
     * third_party/blink/public/mojom/devtools/inspector_issue.mojom to include
     * all cases except for success.
     */
    export type FederatedAuthRequestIssueReason = 'ShouldEmbargo' | 'TooManyRequests' | 'WellKnownHttpNotFound' | 'WellKnownNoResponse' | 'WellKnownInvalidResponse' | 'WellKnownListEmpty' | 'WellKnownInvalidContentType' | 'ConfigNotInWellKnown' | 'WellKnownTooBig' | 'ConfigHttpNotFound' | 'ConfigNoResponse' | 'ConfigInvalidResponse' | 'ConfigInvalidContentType' | 'ClientMetadataHttpNotFound' | 'ClientMetadataNoResponse' | 'ClientMetadataInvalidResponse' | 'ClientMetadataInvalidContentType' | 'DisabledInSettings' | 'ErrorFetchingSignin' | 'InvalidSigninResponse' | 'AccountsHttpNotFound' | 'AccountsNoResponse' | 'AccountsInvalidResponse' | 'AccountsListEmpty' | 'AccountsInvalidContentType' | 'IdTokenHttpNotFound' | 'IdTokenNoResponse' | 'IdTokenInvalidResponse' | 'IdTokenIdpErrorResponse' | 'IdTokenCrossSiteIdpErrorResponse' | 'IdTokenInvalidRequest' | 'IdTokenInvalidContentType' | 'ErrorIdToken' | 'Canceled' | 'RpPageNotVisible' | 'SilentMediationFailure' | 'ThirdPartyCookiesBlocked' | 'NotSignedInWithIdp';

    export interface FederatedAuthUserInfoRequestIssueDetails {
      federatedAuthUserInfoRequestIssueReason: FederatedAuthUserInfoRequestIssueReason;
    }

    /**
     * Represents the failure reason when a getUserInfo() call fails.
     * Should be updated alongside FederatedAuthUserInfoRequestResult in
     * third_party/blink/public/mojom/devtools/inspector_issue.mojom.
     */
    export type FederatedAuthUserInfoRequestIssueReason = 'NotSameOrigin' | 'NotIframe' | 'NotPotentiallyTrustworthy' | 'NoApiPermission' | 'NotSignedInWithIdp' | 'NoAccountSharingPermission' | 'InvalidConfigOrWellKnown' | 'InvalidAccountsResponse' | 'NoReturningUserFromFetchedAccounts';

    /**
     * This issue tracks client hints related issues. It's used to deprecate old
     * features, encourage the use of new ones, and provide general guidance.
     */
    export interface ClientHintIssueDetails {
      sourceCodeLocation: SourceCodeLocation;

      clientHintIssueReason: ClientHintIssueReason;
    }

    export interface FailedRequestInfo {
      /**
       * The URL that failed to load.
       */
      url: string;

      /**
       * The failure message for the failed request.
       */
      failureMessage: string;

      requestId?: Network.RequestId;
    }

    export type StyleSheetLoadingIssueReason = 'LateImportRule' | 'RequestFailed';

    /**
     * This issue warns when a referenced stylesheet couldn't be loaded.
     */
    export interface StylesheetLoadingIssueDetails {
      /**
       * Source code position that referenced the failing stylesheet.
       */
      sourceCodeLocation: SourceCodeLocation;

      /**
       * Reason why the stylesheet couldn't be loaded.
       */
      styleSheetLoadingIssueReason: StyleSheetLoadingIssueReason;

      /**
       * Contains additional info when the failure was due to a request.
       */
      failedRequestInfo?: FailedRequestInfo;
    }

    export type PropertyRuleIssueReason = 'InvalidSyntax' | 'InvalidInitialValue' | 'InvalidInherits' | 'InvalidName';

    /**
     * This issue warns about errors in property rules that lead to property
     * registrations being ignored.
     */
    export interface PropertyRuleIssueDetails {
      /**
       * Source code position of the property rule.
       */
      sourceCodeLocation: SourceCodeLocation;

      /**
       * Reason why the property rule was discarded.
       */
      propertyRuleIssueReason: PropertyRuleIssueReason;

      /**
       * The value of the property rule property that failed to parse
       */
      propertyValue?: string;
    }

    /**
     * A unique identifier for the type of issue. Each type may use one of the
     * optional fields in InspectorIssueDetails to convey more specific
     * information about the kind of issue.
     */
    export type InspectorIssueCode = 'CookieIssue' | 'MixedContentIssue' | 'BlockedByResponseIssue' | 'HeavyAdIssue' | 'ContentSecurityPolicyIssue' | 'SharedArrayBufferIssue' | 'LowTextContrastIssue' | 'CorsIssue' | 'AttributionReportingIssue' | 'QuirksModeIssue' | 'NavigatorUserAgentIssue' | 'GenericIssue' | 'DeprecationIssue' | 'ClientHintIssue' | 'FederatedAuthRequestIssue' | 'BounceTrackingIssue' | 'CookieDeprecationMetadataIssue' | 'StylesheetLoadingIssue' | 'FederatedAuthUserInfoRequestIssue' | 'PropertyRuleIssue';

    /**
     * This struct holds a list of optional fields with additional information
     * specific to the kind of issue. When adding a new issue code, please also
     * add a new optional field to this type.
     */
    export interface InspectorIssueDetails {
      cookieIssueDetails?: CookieIssueDetails;

      mixedContentIssueDetails?: MixedContentIssueDetails;

      blockedByResponseIssueDetails?: BlockedByResponseIssueDetails;

      heavyAdIssueDetails?: HeavyAdIssueDetails;

      contentSecurityPolicyIssueDetails?: ContentSecurityPolicyIssueDetails;

      sharedArrayBufferIssueDetails?: SharedArrayBufferIssueDetails;

      lowTextContrastIssueDetails?: LowTextContrastIssueDetails;

      corsIssueDetails?: CorsIssueDetails;

      attributionReportingIssueDetails?: AttributionReportingIssueDetails;

      quirksModeIssueDetails?: QuirksModeIssueDetails;

      /**
       * 
       * @deprecated
       */
      navigatorUserAgentIssueDetails?: NavigatorUserAgentIssueDetails;

      genericIssueDetails?: GenericIssueDetails;

      deprecationIssueDetails?: DeprecationIssueDetails;

      clientHintIssueDetails?: ClientHintIssueDetails;

      federatedAuthRequestIssueDetails?: FederatedAuthRequestIssueDetails;

      bounceTrackingIssueDetails?: BounceTrackingIssueDetails;

      cookieDeprecationMetadataIssueDetails?: CookieDeprecationMetadataIssueDetails;

      stylesheetLoadingIssueDetails?: StylesheetLoadingIssueDetails;

      propertyRuleIssueDetails?: PropertyRuleIssueDetails;

      federatedAuthUserInfoRequestIssueDetails?: FederatedAuthUserInfoRequestIssueDetails;
    }

    /**
     * A unique id for a DevTools inspector issue. Allows other entities (e.g.
     * exceptions, CDP message, console messages, etc.) to reference an issue.
     */
    export type IssueId = string;

    /**
     * An inspector issue reported from the back-end.
     */
    export interface InspectorIssue {
      code: InspectorIssueCode;

      details: InspectorIssueDetails;

      /**
       * A unique id for this issue. May be omitted if no other entity (e.g.
       * exception, CDP message, etc.) is referencing this issue.
       */
      issueId?: IssueId;
    }
  }

  /**
   * Methods and events of the 'Autofill' domain.
   */
  export interface AutofillApi {
    requests: {
      /**
       * Trigger autofill on a form identified by the fieldId.
       * If the field and related form cannot be autofilled, returns an error.
       */
      trigger: { params: Autofill.TriggerParams, result: Autofill.TriggerResult }

      /**
       * Set addresses so that developers can verify their forms implementation.
       */
      setAddresses: { params: Autofill.SetAddressesParams, result: Autofill.SetAddressesResult }

      /**
       * Disables autofill domain notifications.
       */
      disable: { params: Autofill.DisableParams, result: Autofill.DisableResult }

      /**
       * Enables autofill domain notifications.
       */
      enable: { params: Autofill.EnableParams, result: Autofill.EnableResult }
    };
    events: {

      /**
       * Emitted when an address form is filled.
       */
      addressFormFilled: { params: Autofill.AddressFormFilledEvent };
    };
  }

  /**
   * Types of the 'Autofill' domain.
   */
  export namespace Autofill {
    /**
     * Parameters of the 'Autofill.trigger' method.
     */
    export interface TriggerParams {
      /**
       * Identifies a field that serves as an anchor for autofill.
       */
      fieldId: DOM.BackendNodeId;

      /**
       * Identifies the frame that field belongs to.
       */
      frameId?: Page.FrameId;

      /**
       * Credit card information to fill out the form. Credit card data is not saved.
       */
      card: CreditCard;
    }

    /**
     * Return value of the 'Autofill.trigger' method.
     */
    export interface TriggerResult {
    }

    /**
     * Parameters of the 'Autofill.setAddresses' method.
     */
    export interface SetAddressesParams {
      addresses: Address[];
    }

    /**
     * Return value of the 'Autofill.setAddresses' method.
     */
    export interface SetAddressesResult {
    }

    /**
     * Parameters of the 'Autofill.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'Autofill.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'Autofill.enable' method.
     */
    export interface EnableParams {
    }

    /**
     * Return value of the 'Autofill.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'Autofill.addressFormFilled' event.
     */
    export interface AddressFormFilledEvent {
      /**
       * Information about the fields that were filled
       */
      filledFields: FilledField[];

      /**
       * An UI representation of the address used to fill the form.
       * Consists of a 2D array where each child represents an address/profile line.
       */
      addressUi: AddressUI;
    }

    export interface CreditCard {
      /**
       * 16-digit credit card number.
       */
      number: string;

      /**
       * Name of the credit card owner.
       */
      name: string;

      /**
       * 2-digit expiry month.
       */
      expiryMonth: string;

      /**
       * 4-digit expiry year.
       */
      expiryYear: string;

      /**
       * 3-digit card verification code.
       */
      cvc: string;
    }

    export interface AddressField {
      /**
       * address field name, for example GIVEN_NAME.
       */
      name: string;

      /**
       * address field value, for example Jon Doe.
       */
      value: string;
    }

    /**
     * A list of address fields.
     */
    export interface AddressFields {
      fields: AddressField[];
    }

    export interface Address {
      /**
       * fields and values defining an address.
       */
      fields: AddressField[];
    }

    /**
     * Defines how an address can be displayed like in chrome://settings/addresses.
     * Address UI is a two dimensional array, each inner array is an "address information line", and when rendered in a UI surface should be displayed as such.
     * The following address UI for instance:
     * [[{name: "GIVE_NAME", value: "Jon"}, {name: "FAMILY_NAME", value: "Doe"}], [{name: "CITY", value: "Munich"}, {name: "ZIP", value: "81456"}]]
     * should allow the receiver to render:
     * Jon Doe
     * Munich 81456
     */
    export interface AddressUI {
      /**
       * A two dimension array containing the repesentation of values from an address profile.
       */
      addressFields: AddressFields[];
    }

    /**
     * Specified whether a filled field was done so by using the html autocomplete attribute or autofill heuristics.
     */
    export type FillingStrategy = 'autocompleteAttribute' | 'autofillInferred';

    export interface FilledField {
      /**
       * The type of the field, e.g text, password etc.
       */
      htmlType: string;

      /**
       * the html id
       */
      id: string;

      /**
       * the html name
       */
      name: string;

      /**
       * the field value
       */
      value: string;

      /**
       * The actual field type, e.g FAMILY_NAME
       */
      autofillType: string;

      /**
       * The filling strategy
       */
      fillingStrategy: FillingStrategy;

      /**
       * The form field's DOM node
       */
      fieldId: DOM.BackendNodeId;
    }
  }

  /**
   * Methods and events of the 'BackgroundService' domain.
   */
  export interface BackgroundServiceApi {
    requests: {
      /**
       * Enables event updates for the service.
       */
      startObserving: { params: BackgroundService.StartObservingParams, result: BackgroundService.StartObservingResult }

      /**
       * Disables event updates for the service.
       */
      stopObserving: { params: BackgroundService.StopObservingParams, result: BackgroundService.StopObservingResult }

      /**
       * Set the recording state for the service.
       */
      setRecording: { params: BackgroundService.SetRecordingParams, result: BackgroundService.SetRecordingResult }

      /**
       * Clears all stored data for the service.
       */
      clearEvents: { params: BackgroundService.ClearEventsParams, result: BackgroundService.ClearEventsResult }
    };
    events: {

      /**
       * Called when the recording state for the service has been updated.
       */
      recordingStateChanged: { params: BackgroundService.RecordingStateChangedEvent };

      /**
       * Called with all existing backgroundServiceEvents when enabled, and all new
       * events afterwards if enabled and recording.
       */
      backgroundServiceEventReceived: { params: BackgroundService.BackgroundServiceEventReceivedEvent };
    };
  }

  /**
   * Types of the 'BackgroundService' domain.
   */
  export namespace BackgroundService {
    /**
     * Parameters of the 'BackgroundService.startObserving' method.
     */
    export interface StartObservingParams {
      service: ServiceName;
    }

    /**
     * Return value of the 'BackgroundService.startObserving' method.
     */
    export interface StartObservingResult {
    }

    /**
     * Parameters of the 'BackgroundService.stopObserving' method.
     */
    export interface StopObservingParams {
      service: ServiceName;
    }

    /**
     * Return value of the 'BackgroundService.stopObserving' method.
     */
    export interface StopObservingResult {
    }

    /**
     * Parameters of the 'BackgroundService.setRecording' method.
     */
    export interface SetRecordingParams {
      shouldRecord: boolean;

      service: ServiceName;
    }

    /**
     * Return value of the 'BackgroundService.setRecording' method.
     */
    export interface SetRecordingResult {
    }

    /**
     * Parameters of the 'BackgroundService.clearEvents' method.
     */
    export interface ClearEventsParams {
      service: ServiceName;
    }

    /**
     * Return value of the 'BackgroundService.clearEvents' method.
     */
    export interface ClearEventsResult {
    }

    /**
     * Parameters of the 'BackgroundService.recordingStateChanged' event.
     */
    export interface RecordingStateChangedEvent {
      isRecording: boolean;

      service: ServiceName;
    }

    /**
     * Parameters of the 'BackgroundService.backgroundServiceEventReceived' event.
     */
    export interface BackgroundServiceEventReceivedEvent {
      backgroundServiceEvent: BackgroundServiceEvent;
    }

    /**
     * The Background Service that will be associated with the commands/events.
     * Every Background Service operates independently, but they share the same
     * API.
     */
    export type ServiceName = 'backgroundFetch' | 'backgroundSync' | 'pushMessaging' | 'notifications' | 'paymentHandler' | 'periodicBackgroundSync';

    /**
     * A key-value pair for additional event information to pass along.
     */
    export interface EventMetadata {
      key: string;

      value: string;
    }

    export interface BackgroundServiceEvent {
      /**
       * Timestamp of the event (in seconds).
       */
      timestamp: Network.TimeSinceEpoch;

      /**
       * The origin this event belongs to.
       */
      origin: string;

      /**
       * The Service Worker ID that initiated the event.
       */
      serviceWorkerRegistrationId: ServiceWorker.RegistrationID;

      /**
       * The Background Service this event belongs to.
       */
      service: ServiceName;

      /**
       * A description of the event.
       */
      eventName: string;

      /**
       * An identifier that groups related events together.
       */
      instanceId: string;

      /**
       * A list of event-specific information.
       */
      eventMetadata: EventMetadata[];

      /**
       * Storage key this event belongs to.
       */
      storageKey: string;
    }
  }

  /**
   * Methods and events of the 'Browser' domain.
   */
  export interface BrowserApi {
    requests: {
      /**
       * Set permission settings for given origin.
       */
      setPermission: { params: Browser.SetPermissionParams, result: Browser.SetPermissionResult }

      /**
       * Grant specific permissions to the given origin and reject all others.
       */
      grantPermissions: { params: Browser.GrantPermissionsParams, result: Browser.GrantPermissionsResult }

      /**
       * Reset all permission management for all origins.
       */
      resetPermissions: { params: Browser.ResetPermissionsParams, result: Browser.ResetPermissionsResult }

      /**
       * Set the behavior when downloading a file.
       */
      setDownloadBehavior: { params: Browser.SetDownloadBehaviorParams, result: Browser.SetDownloadBehaviorResult }

      /**
       * Cancel a download if in progress
       */
      cancelDownload: { params: Browser.CancelDownloadParams, result: Browser.CancelDownloadResult }

      /**
       * Close browser gracefully.
       */
      close: { params: Browser.CloseParams, result: Browser.CloseResult }

      /**
       * Crashes browser on the main thread.
       */
      crash: { params: Browser.CrashParams, result: Browser.CrashResult }

      /**
       * Crashes GPU process.
       */
      crashGpuProcess: { params: Browser.CrashGpuProcessParams, result: Browser.CrashGpuProcessResult }

      /**
       * Returns version information.
       */
      getVersion: { params: Browser.GetVersionParams, result: Browser.GetVersionResult }

      /**
       * Returns the command line switches for the browser process if, and only if
       * --enable-automation is on the commandline.
       */
      getBrowserCommandLine: { params: Browser.GetBrowserCommandLineParams, result: Browser.GetBrowserCommandLineResult }

      /**
       * Get Chrome histograms.
       */
      getHistograms: { params: Browser.GetHistogramsParams, result: Browser.GetHistogramsResult }

      /**
       * Get a Chrome histogram by name.
       */
      getHistogram: { params: Browser.GetHistogramParams, result: Browser.GetHistogramResult }

      /**
       * Get position and size of the browser window.
       */
      getWindowBounds: { params: Browser.GetWindowBoundsParams, result: Browser.GetWindowBoundsResult }

      /**
       * Get the browser window that contains the devtools target.
       */
      getWindowForTarget: { params: Browser.GetWindowForTargetParams, result: Browser.GetWindowForTargetResult }

      /**
       * Set position and/or size of the browser window.
       */
      setWindowBounds: { params: Browser.SetWindowBoundsParams, result: Browser.SetWindowBoundsResult }

      /**
       * Set dock tile details, platform-specific.
       */
      setDockTile: { params: Browser.SetDockTileParams, result: Browser.SetDockTileResult }

      /**
       * Invoke custom browser commands used by telemetry.
       */
      executeBrowserCommand: { params: Browser.ExecuteBrowserCommandParams, result: Browser.ExecuteBrowserCommandResult }

      /**
       * Allows a site to use privacy sandbox features that require enrollment
       * without the site actually being enrolled. Only supported on page targets.
       */
      addPrivacySandboxEnrollmentOverride: { params: Browser.AddPrivacySandboxEnrollmentOverrideParams, result: Browser.AddPrivacySandboxEnrollmentOverrideResult }
    };
    events: {

      /**
       * Fired when page is about to start a download.
       */
      downloadWillBegin: { params: Browser.DownloadWillBeginEvent };

      /**
       * Fired when download makes progress. Last call has |done| == true.
       */
      downloadProgress: { params: Browser.DownloadProgressEvent };
    };
  }

  /**
   * Types of the 'Browser' domain.
   */
  export namespace Browser {
    /**
     * Parameters of the 'Browser.setPermission' method.
     */
    export interface SetPermissionParams {
      /**
       * Descriptor of permission to override.
       */
      permission: PermissionDescriptor;

      /**
       * Setting of the permission.
       */
      setting: PermissionSetting;

      /**
       * Origin the permission applies to, all origins if not specified.
       */
      origin?: string;

      /**
       * Context to override. When omitted, default browser context is used.
       */
      browserContextId?: BrowserContextID;
    }

    /**
     * Return value of the 'Browser.setPermission' method.
     */
    export interface SetPermissionResult {
    }

    /**
     * Parameters of the 'Browser.grantPermissions' method.
     */
    export interface GrantPermissionsParams {
      permissions: PermissionType[];

      /**
       * Origin the permission applies to, all origins if not specified.
       */
      origin?: string;

      /**
       * BrowserContext to override permissions. When omitted, default browser context is used.
       */
      browserContextId?: BrowserContextID;
    }

    /**
     * Return value of the 'Browser.grantPermissions' method.
     */
    export interface GrantPermissionsResult {
    }

    /**
     * Parameters of the 'Browser.resetPermissions' method.
     */
    export interface ResetPermissionsParams {
      /**
       * BrowserContext to reset permissions. When omitted, default browser context is used.
       */
      browserContextId?: BrowserContextID;
    }

    /**
     * Return value of the 'Browser.resetPermissions' method.
     */
    export interface ResetPermissionsResult {
    }

    /**
     * Parameters of the 'Browser.setDownloadBehavior' method.
     */
    export interface SetDownloadBehaviorParams {
      /**
       * Whether to allow all or deny all download requests, or use default Chrome behavior if
       * available (otherwise deny). |allowAndName| allows download and names files according to
       * their dowmload guids.
       */
      behavior: 'deny' | 'allow' | 'allowAndName' | 'default';

      /**
       * BrowserContext to set download behavior. When omitted, default browser context is used.
       */
      browserContextId?: BrowserContextID;

      /**
       * The default path to save downloaded files to. This is required if behavior is set to 'allow'
       * or 'allowAndName'.
       */
      downloadPath?: string;

      /**
       * Whether to emit download events (defaults to false).
       */
      eventsEnabled?: boolean;
    }

    /**
     * Return value of the 'Browser.setDownloadBehavior' method.
     */
    export interface SetDownloadBehaviorResult {
    }

    /**
     * Parameters of the 'Browser.cancelDownload' method.
     */
    export interface CancelDownloadParams {
      /**
       * Global unique identifier of the download.
       */
      guid: string;

      /**
       * BrowserContext to perform the action in. When omitted, default browser context is used.
       */
      browserContextId?: BrowserContextID;
    }

    /**
     * Return value of the 'Browser.cancelDownload' method.
     */
    export interface CancelDownloadResult {
    }

    /**
     * Parameters of the 'Browser.close' method.
     */
    export interface CloseParams {
    }

    /**
     * Return value of the 'Browser.close' method.
     */
    export interface CloseResult {
    }

    /**
     * Parameters of the 'Browser.crash' method.
     */
    export interface CrashParams {
    }

    /**
     * Return value of the 'Browser.crash' method.
     */
    export interface CrashResult {
    }

    /**
     * Parameters of the 'Browser.crashGpuProcess' method.
     */
    export interface CrashGpuProcessParams {
    }

    /**
     * Return value of the 'Browser.crashGpuProcess' method.
     */
    export interface CrashGpuProcessResult {
    }

    /**
     * Parameters of the 'Browser.getVersion' method.
     */
    export interface GetVersionParams {
    }

    /**
     * Return value of the 'Browser.getVersion' method.
     */
    export interface GetVersionResult {
      /**
       * Protocol version.
       */
      protocolVersion: string;

      /**
       * Product name.
       */
      product: string;

      /**
       * Product revision.
       */
      revision: string;

      /**
       * User-Agent.
       */
      userAgent: string;

      /**
       * V8 version.
       */
      jsVersion: string;
    }

    /**
     * Parameters of the 'Browser.getBrowserCommandLine' method.
     */
    export interface GetBrowserCommandLineParams {
    }

    /**
     * Return value of the 'Browser.getBrowserCommandLine' method.
     */
    export interface GetBrowserCommandLineResult {
      /**
       * Commandline parameters
       */
      arguments: string[];
    }

    /**
     * Parameters of the 'Browser.getHistograms' method.
     */
    export interface GetHistogramsParams {
      /**
       * Requested substring in name. Only histograms which have query as a
       * substring in their name are extracted. An empty or absent query returns
       * all histograms.
       */
      query?: string;

      /**
       * If true, retrieve delta since last delta call.
       */
      delta?: boolean;
    }

    /**
     * Return value of the 'Browser.getHistograms' method.
     */
    export interface GetHistogramsResult {
      /**
       * Histograms.
       */
      histograms: Histogram[];
    }

    /**
     * Parameters of the 'Browser.getHistogram' method.
     */
    export interface GetHistogramParams {
      /**
       * Requested histogram name.
       */
      name: string;

      /**
       * If true, retrieve delta since last delta call.
       */
      delta?: boolean;
    }

    /**
     * Return value of the 'Browser.getHistogram' method.
     */
    export interface GetHistogramResult {
      /**
       * Histogram.
       */
      histogram: Histogram;
    }

    /**
     * Parameters of the 'Browser.getWindowBounds' method.
     */
    export interface GetWindowBoundsParams {
      /**
       * Browser window id.
       */
      windowId: WindowID;
    }

    /**
     * Return value of the 'Browser.getWindowBounds' method.
     */
    export interface GetWindowBoundsResult {
      /**
       * Bounds information of the window. When window state is 'minimized', the restored window
       * position and size are returned.
       */
      bounds: Bounds;
    }

    /**
     * Parameters of the 'Browser.getWindowForTarget' method.
     */
    export interface GetWindowForTargetParams {
      /**
       * Devtools agent host id. If called as a part of the session, associated targetId is used.
       */
      targetId?: Target.TargetID;
    }

    /**
     * Return value of the 'Browser.getWindowForTarget' method.
     */
    export interface GetWindowForTargetResult {
      /**
       * Browser window id.
       */
      windowId: WindowID;

      /**
       * Bounds information of the window. When window state is 'minimized', the restored window
       * position and size are returned.
       */
      bounds: Bounds;
    }

    /**
     * Parameters of the 'Browser.setWindowBounds' method.
     */
    export interface SetWindowBoundsParams {
      /**
       * Browser window id.
       */
      windowId: WindowID;

      /**
       * New window bounds. The 'minimized', 'maximized' and 'fullscreen' states cannot be combined
       * with 'left', 'top', 'width' or 'height'. Leaves unspecified fields unchanged.
       */
      bounds: Bounds;
    }

    /**
     * Return value of the 'Browser.setWindowBounds' method.
     */
    export interface SetWindowBoundsResult {
    }

    /**
     * Parameters of the 'Browser.setDockTile' method.
     */
    export interface SetDockTileParams {
      badgeLabel?: string;

      /**
       * Png encoded image. (Encoded as a base64 string when passed over JSON)
       */
      image?: string;
    }

    /**
     * Return value of the 'Browser.setDockTile' method.
     */
    export interface SetDockTileResult {
    }

    /**
     * Parameters of the 'Browser.executeBrowserCommand' method.
     */
    export interface ExecuteBrowserCommandParams {
      commandId: BrowserCommandId;
    }

    /**
     * Return value of the 'Browser.executeBrowserCommand' method.
     */
    export interface ExecuteBrowserCommandResult {
    }

    /**
     * Parameters of the 'Browser.addPrivacySandboxEnrollmentOverride' method.
     */
    export interface AddPrivacySandboxEnrollmentOverrideParams {
      url: string;
    }

    /**
     * Return value of the 'Browser.addPrivacySandboxEnrollmentOverride' method.
     */
    export interface AddPrivacySandboxEnrollmentOverrideResult {
    }

    /**
     * Parameters of the 'Browser.downloadWillBegin' event.
     */
    export interface DownloadWillBeginEvent {
      /**
       * Id of the frame that caused the download to begin.
       */
      frameId: Page.FrameId;

      /**
       * Global unique identifier of the download.
       */
      guid: string;

      /**
       * URL of the resource being downloaded.
       */
      url: string;

      /**
       * Suggested file name of the resource (the actual name of the file saved on disk may differ).
       */
      suggestedFilename: string;
    }

    /**
     * Parameters of the 'Browser.downloadProgress' event.
     */
    export interface DownloadProgressEvent {
      /**
       * Global unique identifier of the download.
       */
      guid: string;

      /**
       * Total expected bytes to download.
       */
      totalBytes: number;

      /**
       * Total bytes received.
       */
      receivedBytes: number;

      /**
       * Download status.
       */
      state: 'inProgress' | 'completed' | 'canceled';
    }

    export type BrowserContextID = string;

    export type WindowID = integer;

    /**
     * The state of the browser window.
     */
    export type WindowState = 'normal' | 'minimized' | 'maximized' | 'fullscreen';

    /**
     * Browser window bounds information
     */
    export interface Bounds {
      /**
       * The offset from the left edge of the screen to the window in pixels.
       */
      left?: integer;

      /**
       * The offset from the top edge of the screen to the window in pixels.
       */
      top?: integer;

      /**
       * The window width in pixels.
       */
      width?: integer;

      /**
       * The window height in pixels.
       */
      height?: integer;

      /**
       * The window state. Default to normal.
       */
      windowState?: WindowState;
    }

    export type PermissionType = 'accessibilityEvents' | 'audioCapture' | 'backgroundSync' | 'backgroundFetch' | 'capturedSurfaceControl' | 'clipboardReadWrite' | 'clipboardSanitizedWrite' | 'displayCapture' | 'durableStorage' | 'flash' | 'geolocation' | 'idleDetection' | 'localFonts' | 'midi' | 'midiSysex' | 'nfc' | 'notifications' | 'paymentHandler' | 'periodicBackgroundSync' | 'protectedMediaIdentifier' | 'sensors' | 'storageAccess' | 'topLevelStorageAccess' | 'videoCapture' | 'videoCapturePanTiltZoom' | 'wakeLockScreen' | 'wakeLockSystem' | 'windowManagement';

    export type PermissionSetting = 'granted' | 'denied' | 'prompt';

    /**
     * Definition of PermissionDescriptor defined in the Permissions API:
     * https://w3c.github.io/permissions/#dom-permissiondescriptor.
     */
    export interface PermissionDescriptor {
      /**
       * Name of permission.
       * See https://cs.chromium.org/chromium/src/third_party/blink/renderer/modules/permissions/permission_descriptor.idl for valid permission names.
       */
      name: string;

      /**
       * For "midi" permission, may also specify sysex control.
       */
      sysex?: boolean;

      /**
       * For "push" permission, may specify userVisibleOnly.
       * Note that userVisibleOnly = true is the only currently supported type.
       */
      userVisibleOnly?: boolean;

      /**
       * For "clipboard" permission, may specify allowWithoutSanitization.
       */
      allowWithoutSanitization?: boolean;

      /**
       * For "camera" permission, may specify panTiltZoom.
       */
      panTiltZoom?: boolean;
    }

    /**
     * Browser command ids used by executeBrowserCommand.
     */
    export type BrowserCommandId = 'openTabSearch' | 'closeTabSearch';

    /**
     * Chrome histogram bucket.
     */
    export interface Bucket {
      /**
       * Minimum value (inclusive).
       */
      low: integer;

      /**
       * Maximum value (exclusive).
       */
      high: integer;

      /**
       * Number of samples.
       */
      count: integer;
    }

    /**
     * Chrome histogram.
     */
    export interface Histogram {
      /**
       * Name.
       */
      name: string;

      /**
       * Sum of sample values.
       */
      sum: integer;

      /**
       * Total number of samples.
       */
      count: integer;

      /**
       * Buckets.
       */
      buckets: Bucket[];
    }
  }

  /**
   * Methods and events of the 'CSS' domain.
   */
  export interface CSSApi {
    requests: {
      /**
       * Inserts a new rule with the given `ruleText` in a stylesheet with given `styleSheetId`, at the
       * position specified by `location`.
       */
      addRule: { params: CSS.AddRuleParams, result: CSS.AddRuleResult }

      /**
       * Returns all class names from specified stylesheet.
       */
      collectClassNames: { params: CSS.CollectClassNamesParams, result: CSS.CollectClassNamesResult }

      /**
       * Creates a new special "via-inspector" stylesheet in the frame with given `frameId`.
       */
      createStyleSheet: { params: CSS.CreateStyleSheetParams, result: CSS.CreateStyleSheetResult }

      /**
       * Disables the CSS agent for the given page.
       */
      disable: { params: CSS.DisableParams, result: CSS.DisableResult }

      /**
       * Enables the CSS agent for the given page. Clients should not assume that the CSS agent has been
       * enabled until the result of this command is received.
       */
      enable: { params: CSS.EnableParams, result: CSS.EnableResult }

      /**
       * Ensures that the given node will have specified pseudo-classes whenever its style is computed by
       * the browser.
       */
      forcePseudoState: { params: CSS.ForcePseudoStateParams, result: CSS.ForcePseudoStateResult }

      getBackgroundColors: { params: CSS.GetBackgroundColorsParams, result: CSS.GetBackgroundColorsResult }

      /**
       * Returns the computed style for a DOM node identified by `nodeId`.
       */
      getComputedStyleForNode: { params: CSS.GetComputedStyleForNodeParams, result: CSS.GetComputedStyleForNodeResult }

      /**
       * Returns the styles defined inline (explicitly in the "style" attribute and implicitly, using DOM
       * attributes) for a DOM node identified by `nodeId`.
       */
      getInlineStylesForNode: { params: CSS.GetInlineStylesForNodeParams, result: CSS.GetInlineStylesForNodeResult }

      /**
       * Returns requested styles for a DOM node identified by `nodeId`.
       */
      getMatchedStylesForNode: { params: CSS.GetMatchedStylesForNodeParams, result: CSS.GetMatchedStylesForNodeResult }

      /**
       * Returns all media queries parsed by the rendering engine.
       */
      getMediaQueries: { params: CSS.GetMediaQueriesParams, result: CSS.GetMediaQueriesResult }

      /**
       * Requests information about platform fonts which we used to render child TextNodes in the given
       * node.
       */
      getPlatformFontsForNode: { params: CSS.GetPlatformFontsForNodeParams, result: CSS.GetPlatformFontsForNodeResult }

      /**
       * Returns the current textual content for a stylesheet.
       */
      getStyleSheetText: { params: CSS.GetStyleSheetTextParams, result: CSS.GetStyleSheetTextResult }

      /**
       * Returns all layers parsed by the rendering engine for the tree scope of a node.
       * Given a DOM element identified by nodeId, getLayersForNode returns the root
       * layer for the nearest ancestor document or shadow root. The layer root contains
       * the full layer tree for the tree scope and their ordering.
       */
      getLayersForNode: { params: CSS.GetLayersForNodeParams, result: CSS.GetLayersForNodeResult }

      /**
       * Starts tracking the given computed styles for updates. The specified array of properties
       * replaces the one previously specified. Pass empty array to disable tracking.
       * Use takeComputedStyleUpdates to retrieve the list of nodes that had properties modified.
       * The changes to computed style properties are only tracked for nodes pushed to the front-end
       * by the DOM agent. If no changes to the tracked properties occur after the node has been pushed
       * to the front-end, no updates will be issued for the node.
       */
      trackComputedStyleUpdates: { params: CSS.TrackComputedStyleUpdatesParams, result: CSS.TrackComputedStyleUpdatesResult }

      /**
       * Polls the next batch of computed style updates.
       */
      takeComputedStyleUpdates: { params: CSS.TakeComputedStyleUpdatesParams, result: CSS.TakeComputedStyleUpdatesResult }

      /**
       * Find a rule with the given active property for the given node and set the new value for this
       * property
       */
      setEffectivePropertyValueForNode: { params: CSS.SetEffectivePropertyValueForNodeParams, result: CSS.SetEffectivePropertyValueForNodeResult }

      /**
       * Modifies the property rule property name.
       */
      setPropertyRulePropertyName: { params: CSS.SetPropertyRulePropertyNameParams, result: CSS.SetPropertyRulePropertyNameResult }

      /**
       * Modifies the keyframe rule key text.
       */
      setKeyframeKey: { params: CSS.SetKeyframeKeyParams, result: CSS.SetKeyframeKeyResult }

      /**
       * Modifies the rule selector.
       */
      setMediaText: { params: CSS.SetMediaTextParams, result: CSS.SetMediaTextResult }

      /**
       * Modifies the expression of a container query.
       */
      setContainerQueryText: { params: CSS.SetContainerQueryTextParams, result: CSS.SetContainerQueryTextResult }

      /**
       * Modifies the expression of a supports at-rule.
       */
      setSupportsText: { params: CSS.SetSupportsTextParams, result: CSS.SetSupportsTextResult }

      /**
       * Modifies the expression of a scope at-rule.
       */
      setScopeText: { params: CSS.SetScopeTextParams, result: CSS.SetScopeTextResult }

      /**
       * Modifies the rule selector.
       */
      setRuleSelector: { params: CSS.SetRuleSelectorParams, result: CSS.SetRuleSelectorResult }

      /**
       * Sets the new stylesheet text.
       */
      setStyleSheetText: { params: CSS.SetStyleSheetTextParams, result: CSS.SetStyleSheetTextResult }

      /**
       * Applies specified style edits one after another in the given order.
       */
      setStyleTexts: { params: CSS.SetStyleTextsParams, result: CSS.SetStyleTextsResult }

      /**
       * Enables the selector recording.
       */
      startRuleUsageTracking: { params: CSS.StartRuleUsageTrackingParams, result: CSS.StartRuleUsageTrackingResult }

      /**
       * Stop tracking rule usage and return the list of rules that were used since last call to
       * `takeCoverageDelta` (or since start of coverage instrumentation).
       */
      stopRuleUsageTracking: { params: CSS.StopRuleUsageTrackingParams, result: CSS.StopRuleUsageTrackingResult }

      /**
       * Obtain list of rules that became used since last call to this method (or since start of coverage
       * instrumentation).
       */
      takeCoverageDelta: { params: CSS.TakeCoverageDeltaParams, result: CSS.TakeCoverageDeltaResult }

      /**
       * Enables/disables rendering of local CSS fonts (enabled by default).
       */
      setLocalFontsEnabled: { params: CSS.SetLocalFontsEnabledParams, result: CSS.SetLocalFontsEnabledResult }
    };
    events: {

      /**
       * Fires whenever a web font is updated.  A non-empty font parameter indicates a successfully loaded
       * web font.
       */
      fontsUpdated: { params: CSS.FontsUpdatedEvent };

      /**
       * Fires whenever a MediaQuery result changes (for example, after a browser window has been
       * resized.) The current implementation considers only viewport-dependent media features.
       */
      mediaQueryResultChanged: { params: CSS.MediaQueryResultChangedEvent };

      /**
       * Fired whenever an active document stylesheet is added.
       */
      styleSheetAdded: { params: CSS.StyleSheetAddedEvent };

      /**
       * Fired whenever a stylesheet is changed as a result of the client operation.
       */
      styleSheetChanged: { params: CSS.StyleSheetChangedEvent };

      /**
       * Fired whenever an active document stylesheet is removed.
       */
      styleSheetRemoved: { params: CSS.StyleSheetRemovedEvent };
    };
  }

  /**
   * Types of the 'CSS' domain.
   */
  export namespace CSS {
    /**
     * Parameters of the 'CSS.addRule' method.
     */
    export interface AddRuleParams {
      /**
       * The css style sheet identifier where a new rule should be inserted.
       */
      styleSheetId: StyleSheetId;

      /**
       * The text of a new rule.
       */
      ruleText: string;

      /**
       * Text position of a new rule in the target style sheet.
       */
      location: SourceRange;

      /**
       * NodeId for the DOM node in whose context custom property declarations for registered properties should be
       * validated. If omitted, declarations in the new rule text can only be validated statically, which may produce
       * incorrect results if the declaration contains a var() for example.
       */
      nodeForPropertySyntaxValidation?: DOM.NodeId;
    }

    /**
     * Return value of the 'CSS.addRule' method.
     */
    export interface AddRuleResult {
      /**
       * The newly created rule.
       */
      rule: CSSRule;
    }

    /**
     * Parameters of the 'CSS.collectClassNames' method.
     */
    export interface CollectClassNamesParams {
      styleSheetId: StyleSheetId;
    }

    /**
     * Return value of the 'CSS.collectClassNames' method.
     */
    export interface CollectClassNamesResult {
      /**
       * Class name list.
       */
      classNames: string[];
    }

    /**
     * Parameters of the 'CSS.createStyleSheet' method.
     */
    export interface CreateStyleSheetParams {
      /**
       * Identifier of the frame where "via-inspector" stylesheet should be created.
       */
      frameId: Page.FrameId;
    }

    /**
     * Return value of the 'CSS.createStyleSheet' method.
     */
    export interface CreateStyleSheetResult {
      /**
       * Identifier of the created "via-inspector" stylesheet.
       */
      styleSheetId: StyleSheetId;
    }

    /**
     * Parameters of the 'CSS.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'CSS.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'CSS.enable' method.
     */
    export interface EnableParams {
    }

    /**
     * Return value of the 'CSS.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'CSS.forcePseudoState' method.
     */
    export interface ForcePseudoStateParams {
      /**
       * The element id for which to force the pseudo state.
       */
      nodeId: DOM.NodeId;

      /**
       * Element pseudo classes to force when computing the element's style.
       */
      forcedPseudoClasses: string[];
    }

    /**
     * Return value of the 'CSS.forcePseudoState' method.
     */
    export interface ForcePseudoStateResult {
    }

    /**
     * Parameters of the 'CSS.getBackgroundColors' method.
     */
    export interface GetBackgroundColorsParams {
      /**
       * Id of the node to get background colors for.
       */
      nodeId: DOM.NodeId;
    }

    /**
     * Return value of the 'CSS.getBackgroundColors' method.
     */
    export interface GetBackgroundColorsResult {
      /**
       * The range of background colors behind this element, if it contains any visible text. If no
       * visible text is present, this will be undefined. In the case of a flat background color,
       * this will consist of simply that color. In the case of a gradient, this will consist of each
       * of the color stops. For anything more complicated, this will be an empty array. Images will
       * be ignored (as if the image had failed to load).
       */
      backgroundColors?: string[];

      /**
       * The computed font size for this node, as a CSS computed value string (e.g. '12px').
       */
      computedFontSize?: string;

      /**
       * The computed font weight for this node, as a CSS computed value string (e.g. 'normal' or
       * '100').
       */
      computedFontWeight?: string;
    }

    /**
     * Parameters of the 'CSS.getComputedStyleForNode' method.
     */
    export interface GetComputedStyleForNodeParams {
      nodeId: DOM.NodeId;
    }

    /**
     * Return value of the 'CSS.getComputedStyleForNode' method.
     */
    export interface GetComputedStyleForNodeResult {
      /**
       * Computed style for the specified DOM node.
       */
      computedStyle: CSSComputedStyleProperty[];
    }

    /**
     * Parameters of the 'CSS.getInlineStylesForNode' method.
     */
    export interface GetInlineStylesForNodeParams {
      nodeId: DOM.NodeId;
    }

    /**
     * Return value of the 'CSS.getInlineStylesForNode' method.
     */
    export interface GetInlineStylesForNodeResult {
      /**
       * Inline style for the specified DOM node.
       */
      inlineStyle?: CSSStyle;

      /**
       * Attribute-defined element style (e.g. resulting from "width=20 height=100%").
       */
      attributesStyle?: CSSStyle;
    }

    /**
     * Parameters of the 'CSS.getMatchedStylesForNode' method.
     */
    export interface GetMatchedStylesForNodeParams {
      nodeId: DOM.NodeId;
    }

    /**
     * Return value of the 'CSS.getMatchedStylesForNode' method.
     */
    export interface GetMatchedStylesForNodeResult {
      /**
       * Inline style for the specified DOM node.
       */
      inlineStyle?: CSSStyle;

      /**
       * Attribute-defined element style (e.g. resulting from "width=20 height=100%").
       */
      attributesStyle?: CSSStyle;

      /**
       * CSS rules matching this node, from all applicable stylesheets.
       */
      matchedCSSRules?: RuleMatch[];

      /**
       * Pseudo style matches for this node.
       */
      pseudoElements?: PseudoElementMatches[];

      /**
       * A chain of inherited styles (from the immediate node parent up to the DOM tree root).
       */
      inherited?: InheritedStyleEntry[];

      /**
       * A chain of inherited pseudo element styles (from the immediate node parent up to the DOM tree root).
       */
      inheritedPseudoElements?: InheritedPseudoElementMatches[];

      /**
       * A list of CSS keyframed animations matching this node.
       */
      cssKeyframesRules?: CSSKeyframesRule[];

      /**
       * A list of CSS position fallbacks matching this node.
       */
      cssPositionFallbackRules?: CSSPositionFallbackRule[];

      /**
       * A list of CSS at-property rules matching this node.
       */
      cssPropertyRules?: CSSPropertyRule[];

      /**
       * A list of CSS property registrations matching this node.
       */
      cssPropertyRegistrations?: CSSPropertyRegistration[];

      /**
       * A font-palette-values rule matching this node.
       */
      cssFontPaletteValuesRule?: CSSFontPaletteValuesRule;

      /**
       * Id of the first parent element that does not have display: contents.
       */
      parentLayoutNodeId?: DOM.NodeId;
    }

    /**
     * Parameters of the 'CSS.getMediaQueries' method.
     */
    export interface GetMediaQueriesParams {
    }

    /**
     * Return value of the 'CSS.getMediaQueries' method.
     */
    export interface GetMediaQueriesResult {
      medias: CSSMedia[];
    }

    /**
     * Parameters of the 'CSS.getPlatformFontsForNode' method.
     */
    export interface GetPlatformFontsForNodeParams {
      nodeId: DOM.NodeId;
    }

    /**
     * Return value of the 'CSS.getPlatformFontsForNode' method.
     */
    export interface GetPlatformFontsForNodeResult {
      /**
       * Usage statistics for every employed platform font.
       */
      fonts: PlatformFontUsage[];
    }

    /**
     * Parameters of the 'CSS.getStyleSheetText' method.
     */
    export interface GetStyleSheetTextParams {
      styleSheetId: StyleSheetId;
    }

    /**
     * Return value of the 'CSS.getStyleSheetText' method.
     */
    export interface GetStyleSheetTextResult {
      /**
       * The stylesheet text.
       */
      text: string;
    }

    /**
     * Parameters of the 'CSS.getLayersForNode' method.
     */
    export interface GetLayersForNodeParams {
      nodeId: DOM.NodeId;
    }

    /**
     * Return value of the 'CSS.getLayersForNode' method.
     */
    export interface GetLayersForNodeResult {
      rootLayer: CSSLayerData;
    }

    /**
     * Parameters of the 'CSS.trackComputedStyleUpdates' method.
     */
    export interface TrackComputedStyleUpdatesParams {
      propertiesToTrack: CSSComputedStyleProperty[];
    }

    /**
     * Return value of the 'CSS.trackComputedStyleUpdates' method.
     */
    export interface TrackComputedStyleUpdatesResult {
    }

    /**
     * Parameters of the 'CSS.takeComputedStyleUpdates' method.
     */
    export interface TakeComputedStyleUpdatesParams {
    }

    /**
     * Return value of the 'CSS.takeComputedStyleUpdates' method.
     */
    export interface TakeComputedStyleUpdatesResult {
      /**
       * The list of node Ids that have their tracked computed styles updated.
       */
      nodeIds: DOM.NodeId[];
    }

    /**
     * Parameters of the 'CSS.setEffectivePropertyValueForNode' method.
     */
    export interface SetEffectivePropertyValueForNodeParams {
      /**
       * The element id for which to set property.
       */
      nodeId: DOM.NodeId;

      propertyName: string;

      value: string;
    }

    /**
     * Return value of the 'CSS.setEffectivePropertyValueForNode' method.
     */
    export interface SetEffectivePropertyValueForNodeResult {
    }

    /**
     * Parameters of the 'CSS.setPropertyRulePropertyName' method.
     */
    export interface SetPropertyRulePropertyNameParams {
      styleSheetId: StyleSheetId;

      range: SourceRange;

      propertyName: string;
    }

    /**
     * Return value of the 'CSS.setPropertyRulePropertyName' method.
     */
    export interface SetPropertyRulePropertyNameResult {
      /**
       * The resulting key text after modification.
       */
      propertyName: Value;
    }

    /**
     * Parameters of the 'CSS.setKeyframeKey' method.
     */
    export interface SetKeyframeKeyParams {
      styleSheetId: StyleSheetId;

      range: SourceRange;

      keyText: string;
    }

    /**
     * Return value of the 'CSS.setKeyframeKey' method.
     */
    export interface SetKeyframeKeyResult {
      /**
       * The resulting key text after modification.
       */
      keyText: Value;
    }

    /**
     * Parameters of the 'CSS.setMediaText' method.
     */
    export interface SetMediaTextParams {
      styleSheetId: StyleSheetId;

      range: SourceRange;

      text: string;
    }

    /**
     * Return value of the 'CSS.setMediaText' method.
     */
    export interface SetMediaTextResult {
      /**
       * The resulting CSS media rule after modification.
       */
      media: CSSMedia;
    }

    /**
     * Parameters of the 'CSS.setContainerQueryText' method.
     */
    export interface SetContainerQueryTextParams {
      styleSheetId: StyleSheetId;

      range: SourceRange;

      text: string;
    }

    /**
     * Return value of the 'CSS.setContainerQueryText' method.
     */
    export interface SetContainerQueryTextResult {
      /**
       * The resulting CSS container query rule after modification.
       */
      containerQuery: CSSContainerQuery;
    }

    /**
     * Parameters of the 'CSS.setSupportsText' method.
     */
    export interface SetSupportsTextParams {
      styleSheetId: StyleSheetId;

      range: SourceRange;

      text: string;
    }

    /**
     * Return value of the 'CSS.setSupportsText' method.
     */
    export interface SetSupportsTextResult {
      /**
       * The resulting CSS Supports rule after modification.
       */
      supports: CSSSupports;
    }

    /**
     * Parameters of the 'CSS.setScopeText' method.
     */
    export interface SetScopeTextParams {
      styleSheetId: StyleSheetId;

      range: SourceRange;

      text: string;
    }

    /**
     * Return value of the 'CSS.setScopeText' method.
     */
    export interface SetScopeTextResult {
      /**
       * The resulting CSS Scope rule after modification.
       */
      scope: CSSScope;
    }

    /**
     * Parameters of the 'CSS.setRuleSelector' method.
     */
    export interface SetRuleSelectorParams {
      styleSheetId: StyleSheetId;

      range: SourceRange;

      selector: string;
    }

    /**
     * Return value of the 'CSS.setRuleSelector' method.
     */
    export interface SetRuleSelectorResult {
      /**
       * The resulting selector list after modification.
       */
      selectorList: SelectorList;
    }

    /**
     * Parameters of the 'CSS.setStyleSheetText' method.
     */
    export interface SetStyleSheetTextParams {
      styleSheetId: StyleSheetId;

      text: string;
    }

    /**
     * Return value of the 'CSS.setStyleSheetText' method.
     */
    export interface SetStyleSheetTextResult {
      /**
       * URL of source map associated with script (if any).
       */
      sourceMapURL?: string;
    }

    /**
     * Parameters of the 'CSS.setStyleTexts' method.
     */
    export interface SetStyleTextsParams {
      edits: StyleDeclarationEdit[];

      /**
       * NodeId for the DOM node in whose context custom property declarations for registered properties should be
       * validated. If omitted, declarations in the new rule text can only be validated statically, which may produce
       * incorrect results if the declaration contains a var() for example.
       */
      nodeForPropertySyntaxValidation?: DOM.NodeId;
    }

    /**
     * Return value of the 'CSS.setStyleTexts' method.
     */
    export interface SetStyleTextsResult {
      /**
       * The resulting styles after modification.
       */
      styles: CSSStyle[];
    }

    /**
     * Parameters of the 'CSS.startRuleUsageTracking' method.
     */
    export interface StartRuleUsageTrackingParams {
    }

    /**
     * Return value of the 'CSS.startRuleUsageTracking' method.
     */
    export interface StartRuleUsageTrackingResult {
    }

    /**
     * Parameters of the 'CSS.stopRuleUsageTracking' method.
     */
    export interface StopRuleUsageTrackingParams {
    }

    /**
     * Return value of the 'CSS.stopRuleUsageTracking' method.
     */
    export interface StopRuleUsageTrackingResult {
      ruleUsage: RuleUsage[];
    }

    /**
     * Parameters of the 'CSS.takeCoverageDelta' method.
     */
    export interface TakeCoverageDeltaParams {
    }

    /**
     * Return value of the 'CSS.takeCoverageDelta' method.
     */
    export interface TakeCoverageDeltaResult {
      coverage: RuleUsage[];

      /**
       * Monotonically increasing time, in seconds.
       */
      timestamp: number;
    }

    /**
     * Parameters of the 'CSS.setLocalFontsEnabled' method.
     */
    export interface SetLocalFontsEnabledParams {
      /**
       * Whether rendering of local fonts is enabled.
       */
      enabled: boolean;
    }

    /**
     * Return value of the 'CSS.setLocalFontsEnabled' method.
     */
    export interface SetLocalFontsEnabledResult {
    }

    /**
     * Parameters of the 'CSS.fontsUpdated' event.
     */
    export interface FontsUpdatedEvent {
      /**
       * The web font that has loaded.
       */
      font?: FontFace;
    }

    /**
     * Parameters of the 'CSS.mediaQueryResultChanged' event.
     */
    export interface MediaQueryResultChangedEvent {
    }

    /**
     * Parameters of the 'CSS.styleSheetAdded' event.
     */
    export interface StyleSheetAddedEvent {
      /**
       * Added stylesheet metainfo.
       */
      header: CSSStyleSheetHeader;
    }

    /**
     * Parameters of the 'CSS.styleSheetChanged' event.
     */
    export interface StyleSheetChangedEvent {
      styleSheetId: StyleSheetId;
    }

    /**
     * Parameters of the 'CSS.styleSheetRemoved' event.
     */
    export interface StyleSheetRemovedEvent {
      /**
       * Identifier of the removed stylesheet.
       */
      styleSheetId: StyleSheetId;
    }

    export type StyleSheetId = string;

    /**
     * Stylesheet type: "injected" for stylesheets injected via extension, "user-agent" for user-agent
     * stylesheets, "inspector" for stylesheets created by the inspector (i.e. those holding the "via
     * inspector" rules), "regular" for regular stylesheets.
     */
    export type StyleSheetOrigin = 'injected' | 'user-agent' | 'inspector' | 'regular';

    /**
     * CSS rule collection for a single pseudo style.
     */
    export interface PseudoElementMatches {
      /**
       * Pseudo element type.
       */
      pseudoType: DOM.PseudoType;

      /**
       * Pseudo element custom ident.
       */
      pseudoIdentifier?: string;

      /**
       * Matches of CSS rules applicable to the pseudo style.
       */
      matches: RuleMatch[];
    }

    /**
     * Inherited CSS rule collection from ancestor node.
     */
    export interface InheritedStyleEntry {
      /**
       * The ancestor node's inline style, if any, in the style inheritance chain.
       */
      inlineStyle?: CSSStyle;

      /**
       * Matches of CSS rules matching the ancestor node in the style inheritance chain.
       */
      matchedCSSRules: RuleMatch[];
    }

    /**
     * Inherited pseudo element matches from pseudos of an ancestor node.
     */
    export interface InheritedPseudoElementMatches {
      /**
       * Matches of pseudo styles from the pseudos of an ancestor node.
       */
      pseudoElements: PseudoElementMatches[];
    }

    /**
     * Match data for a CSS rule.
     */
    export interface RuleMatch {
      /**
       * CSS rule in the match.
       */
      rule: CSSRule;

      /**
       * Matching selector indices in the rule's selectorList selectors (0-based).
       */
      matchingSelectors: integer[];
    }

    /**
     * Data for a simple selector (these are delimited by commas in a selector list).
     */
    export interface Value {
      /**
       * Value text.
       */
      text: string;

      /**
       * Value range in the underlying resource (if available).
       */
      range?: SourceRange;

      /**
       * Specificity of the selector.
       */
      specificity?: Specificity;
    }

    /**
     * Specificity:
     * https://drafts.csswg.org/selectors/#specificity-rules
     */
    export interface Specificity {
      /**
       * The a component, which represents the number of ID selectors.
       */
      a: integer;

      /**
       * The b component, which represents the number of class selectors, attributes selectors, and
       * pseudo-classes.
       */
      b: integer;

      /**
       * The c component, which represents the number of type selectors and pseudo-elements.
       */
      c: integer;
    }

    /**
     * Selector list data.
     */
    export interface SelectorList {
      /**
       * Selectors in the list.
       */
      selectors: Value[];

      /**
       * Rule selector text.
       */
      text: string;
    }

    /**
     * CSS stylesheet metainformation.
     */
    export interface CSSStyleSheetHeader {
      /**
       * The stylesheet identifier.
       */
      styleSheetId: StyleSheetId;

      /**
       * Owner frame identifier.
       */
      frameId: Page.FrameId;

      /**
       * Stylesheet resource URL. Empty if this is a constructed stylesheet created using
       * new CSSStyleSheet() (but non-empty if this is a constructed sylesheet imported
       * as a CSS module script).
       */
      sourceURL: string;

      /**
       * URL of source map associated with the stylesheet (if any).
       */
      sourceMapURL?: string;

      /**
       * Stylesheet origin.
       */
      origin: StyleSheetOrigin;

      /**
       * Stylesheet title.
       */
      title: string;

      /**
       * The backend id for the owner node of the stylesheet.
       */
      ownerNode?: DOM.BackendNodeId;

      /**
       * Denotes whether the stylesheet is disabled.
       */
      disabled: boolean;

      /**
       * Whether the sourceURL field value comes from the sourceURL comment.
       */
      hasSourceURL?: boolean;

      /**
       * Whether this stylesheet is created for STYLE tag by parser. This flag is not set for
       * document.written STYLE tags.
       */
      isInline: boolean;

      /**
       * Whether this stylesheet is mutable. Inline stylesheets become mutable
       * after they have been modified via CSSOM API.
       * `<link>` element's stylesheets become mutable only if DevTools modifies them.
       * Constructed stylesheets (new CSSStyleSheet()) are mutable immediately after creation.
       */
      isMutable: boolean;

      /**
       * True if this stylesheet is created through new CSSStyleSheet() or imported as a
       * CSS module script.
       */
      isConstructed: boolean;

      /**
       * Line offset of the stylesheet within the resource (zero based).
       */
      startLine: number;

      /**
       * Column offset of the stylesheet within the resource (zero based).
       */
      startColumn: number;

      /**
       * Size of the content (in characters).
       */
      length: number;

      /**
       * Line offset of the end of the stylesheet within the resource (zero based).
       */
      endLine: number;

      /**
       * Column offset of the end of the stylesheet within the resource (zero based).
       */
      endColumn: number;

      /**
       * If the style sheet was loaded from a network resource, this indicates when the resource failed to load
       */
      loadingFailed?: boolean;
    }

    /**
     * CSS rule representation.
     */
    export interface CSSRule {
      /**
       * The css style sheet identifier (absent for user agent stylesheet and user-specified
       * stylesheet rules) this rule came from.
       */
      styleSheetId?: StyleSheetId;

      /**
       * Rule selector data.
       */
      selectorList: SelectorList;

      /**
       * Array of selectors from ancestor style rules, sorted by distance from the current rule.
       */
      nestingSelectors?: string[];

      /**
       * Parent stylesheet's origin.
       */
      origin: StyleSheetOrigin;

      /**
       * Associated style declaration.
       */
      style: CSSStyle;

      /**
       * Media list array (for rules involving media queries). The array enumerates media queries
       * starting with the innermost one, going outwards.
       */
      media?: CSSMedia[];

      /**
       * Container query list array (for rules involving container queries).
       * The array enumerates container queries starting with the innermost one, going outwards.
       */
      containerQueries?: CSSContainerQuery[];

      /**
       * @supports CSS at-rule array.
       * The array enumerates @supports at-rules starting with the innermost one, going outwards.
       */
      supports?: CSSSupports[];

      /**
       * Cascade layer array. Contains the layer hierarchy that this rule belongs to starting
       * with the innermost layer and going outwards.
       */
      layers?: CSSLayer[];

      /**
       * @scope CSS at-rule array.
       * The array enumerates @scope at-rules starting with the innermost one, going outwards.
       */
      scopes?: CSSScope[];

      /**
       * The array keeps the types of ancestor CSSRules from the innermost going outwards.
       */
      ruleTypes?: CSSRuleType[];
    }

    /**
     * Enum indicating the type of a CSS rule, used to represent the order of a style rule's ancestors.
     * This list only contains rule types that are collected during the ancestor rule collection.
     */
    export type CSSRuleType = 'MediaRule' | 'SupportsRule' | 'ContainerRule' | 'LayerRule' | 'ScopeRule' | 'StyleRule';

    /**
     * CSS coverage information.
     */
    export interface RuleUsage {
      /**
       * The css style sheet identifier (absent for user agent stylesheet and user-specified
       * stylesheet rules) this rule came from.
       */
      styleSheetId: StyleSheetId;

      /**
       * Offset of the start of the rule (including selector) from the beginning of the stylesheet.
       */
      startOffset: number;

      /**
       * Offset of the end of the rule body from the beginning of the stylesheet.
       */
      endOffset: number;

      /**
       * Indicates whether the rule was actually used by some element in the page.
       */
      used: boolean;
    }

    /**
     * Text range within a resource. All numbers are zero-based.
     */
    export interface SourceRange {
      /**
       * Start line of range.
       */
      startLine: integer;

      /**
       * Start column of range (inclusive).
       */
      startColumn: integer;

      /**
       * End line of range
       */
      endLine: integer;

      /**
       * End column of range (exclusive).
       */
      endColumn: integer;
    }

    export interface ShorthandEntry {
      /**
       * Shorthand name.
       */
      name: string;

      /**
       * Shorthand value.
       */
      value: string;

      /**
       * Whether the property has "!important" annotation (implies `false` if absent).
       */
      important?: boolean;
    }

    export interface CSSComputedStyleProperty {
      /**
       * Computed style property name.
       */
      name: string;

      /**
       * Computed style property value.
       */
      value: string;
    }

    /**
     * CSS style representation.
     */
    export interface CSSStyle {
      /**
       * The css style sheet identifier (absent for user agent stylesheet and user-specified
       * stylesheet rules) this rule came from.
       */
      styleSheetId?: StyleSheetId;

      /**
       * CSS properties in the style.
       */
      cssProperties: CSSProperty[];

      /**
       * Computed values for all shorthands found in the style.
       */
      shorthandEntries: ShorthandEntry[];

      /**
       * Style declaration text (if available).
       */
      cssText?: string;

      /**
       * Style declaration range in the enclosing stylesheet (if available).
       */
      range?: SourceRange;
    }

    /**
     * CSS property declaration data.
     */
    export interface CSSProperty {
      /**
       * The property name.
       */
      name: string;

      /**
       * The property value.
       */
      value: string;

      /**
       * Whether the property has "!important" annotation (implies `false` if absent).
       */
      important?: boolean;

      /**
       * Whether the property is implicit (implies `false` if absent).
       */
      implicit?: boolean;

      /**
       * The full property text as specified in the style.
       */
      text?: string;

      /**
       * Whether the property is understood by the browser (implies `true` if absent).
       */
      parsedOk?: boolean;

      /**
       * Whether the property is disabled by the user (present for source-based properties only).
       */
      disabled?: boolean;

      /**
       * The entire property range in the enclosing style declaration (if available).
       */
      range?: SourceRange;

      /**
       * Parsed longhand components of this property if it is a shorthand.
       * This field will be empty if the given property is not a shorthand.
       */
      longhandProperties?: CSSProperty[];
    }

    /**
     * CSS media rule descriptor.
     */
    export interface CSSMedia {
      /**
       * Media query text.
       */
      text: string;

      /**
       * Source of the media query: "mediaRule" if specified by a @media rule, "importRule" if
       * specified by an @import rule, "linkedSheet" if specified by a "media" attribute in a linked
       * stylesheet's LINK tag, "inlineSheet" if specified by a "media" attribute in an inline
       * stylesheet's STYLE tag.
       */
      source: 'mediaRule' | 'importRule' | 'linkedSheet' | 'inlineSheet';

      /**
       * URL of the document containing the media query description.
       */
      sourceURL?: string;

      /**
       * The associated rule (@media or @import) header range in the enclosing stylesheet (if
       * available).
       */
      range?: SourceRange;

      /**
       * Identifier of the stylesheet containing this object (if exists).
       */
      styleSheetId?: StyleSheetId;

      /**
       * Array of media queries.
       */
      mediaList?: MediaQuery[];
    }

    /**
     * Media query descriptor.
     */
    export interface MediaQuery {
      /**
       * Array of media query expressions.
       */
      expressions: MediaQueryExpression[];

      /**
       * Whether the media query condition is satisfied.
       */
      active: boolean;
    }

    /**
     * Media query expression descriptor.
     */
    export interface MediaQueryExpression {
      /**
       * Media query expression value.
       */
      value: number;

      /**
       * Media query expression units.
       */
      unit: string;

      /**
       * Media query expression feature.
       */
      feature: string;

      /**
       * The associated range of the value text in the enclosing stylesheet (if available).
       */
      valueRange?: SourceRange;

      /**
       * Computed length of media query expression (if applicable).
       */
      computedLength?: number;
    }

    /**
     * CSS container query rule descriptor.
     */
    export interface CSSContainerQuery {
      /**
       * Container query text.
       */
      text: string;

      /**
       * The associated rule header range in the enclosing stylesheet (if
       * available).
       */
      range?: SourceRange;

      /**
       * Identifier of the stylesheet containing this object (if exists).
       */
      styleSheetId?: StyleSheetId;

      /**
       * Optional name for the container.
       */
      name?: string;

      /**
       * Optional physical axes queried for the container.
       */
      physicalAxes?: DOM.PhysicalAxes;

      /**
       * Optional logical axes queried for the container.
       */
      logicalAxes?: DOM.LogicalAxes;
    }

    /**
     * CSS Supports at-rule descriptor.
     */
    export interface CSSSupports {
      /**
       * Supports rule text.
       */
      text: string;

      /**
       * Whether the supports condition is satisfied.
       */
      active: boolean;

      /**
       * The associated rule header range in the enclosing stylesheet (if
       * available).
       */
      range?: SourceRange;

      /**
       * Identifier of the stylesheet containing this object (if exists).
       */
      styleSheetId?: StyleSheetId;
    }

    /**
     * CSS Scope at-rule descriptor.
     */
    export interface CSSScope {
      /**
       * Scope rule text.
       */
      text: string;

      /**
       * The associated rule header range in the enclosing stylesheet (if
       * available).
       */
      range?: SourceRange;

      /**
       * Identifier of the stylesheet containing this object (if exists).
       */
      styleSheetId?: StyleSheetId;
    }

    /**
     * CSS Layer at-rule descriptor.
     */
    export interface CSSLayer {
      /**
       * Layer name.
       */
      text: string;

      /**
       * The associated rule header range in the enclosing stylesheet (if
       * available).
       */
      range?: SourceRange;

      /**
       * Identifier of the stylesheet containing this object (if exists).
       */
      styleSheetId?: StyleSheetId;
    }

    /**
     * CSS Layer data.
     */
    export interface CSSLayerData {
      /**
       * Layer name.
       */
      name: string;

      /**
       * Direct sub-layers
       */
      subLayers?: CSSLayerData[];

      /**
       * Layer order. The order determines the order of the layer in the cascade order.
       * A higher number has higher priority in the cascade order.
       */
      order: number;
    }

    /**
     * Information about amount of glyphs that were rendered with given font.
     */
    export interface PlatformFontUsage {
      /**
       * Font's family name reported by platform.
       */
      familyName: string;

      /**
       * Font's PostScript name reported by platform.
       */
      postScriptName: string;

      /**
       * Indicates if the font was downloaded or resolved locally.
       */
      isCustomFont: boolean;

      /**
       * Amount of glyphs that were rendered with this font.
       */
      glyphCount: number;
    }

    /**
     * Information about font variation axes for variable fonts
     */
    export interface FontVariationAxis {
      /**
       * The font-variation-setting tag (a.k.a. "axis tag").
       */
      tag: string;

      /**
       * Human-readable variation name in the default language (normally, "en").
       */
      name: string;

      /**
       * The minimum value (inclusive) the font supports for this tag.
       */
      minValue: number;

      /**
       * The maximum value (inclusive) the font supports for this tag.
       */
      maxValue: number;

      /**
       * The default value.
       */
      defaultValue: number;
    }

    /**
     * Properties of a web font: https://www.w3.org/TR/2008/REC-CSS2-20080411/fonts.html#font-descriptions
     * and additional information such as platformFontFamily and fontVariationAxes.
     */
    export interface FontFace {
      /**
       * The font-family.
       */
      fontFamily: string;

      /**
       * The font-style.
       */
      fontStyle: string;

      /**
       * The font-variant.
       */
      fontVariant: string;

      /**
       * The font-weight.
       */
      fontWeight: string;

      /**
       * The font-stretch.
       */
      fontStretch: string;

      /**
       * The font-display.
       */
      fontDisplay: string;

      /**
       * The unicode-range.
       */
      unicodeRange: string;

      /**
       * The src.
       */
      src: string;

      /**
       * The resolved platform font family
       */
      platformFontFamily: string;

      /**
       * Available variation settings (a.k.a. "axes").
       */
      fontVariationAxes?: FontVariationAxis[];
    }

    /**
     * CSS try rule representation.
     */
    export interface CSSTryRule {
      /**
       * The css style sheet identifier (absent for user agent stylesheet and user-specified
       * stylesheet rules) this rule came from.
       */
      styleSheetId?: StyleSheetId;

      /**
       * Parent stylesheet's origin.
       */
      origin: StyleSheetOrigin;

      /**
       * Associated style declaration.
       */
      style: CSSStyle;
    }

    /**
     * CSS position-fallback rule representation.
     */
    export interface CSSPositionFallbackRule {
      name: Value;

      /**
       * List of keyframes.
       */
      tryRules: CSSTryRule[];
    }

    /**
     * CSS keyframes rule representation.
     */
    export interface CSSKeyframesRule {
      /**
       * Animation name.
       */
      animationName: Value;

      /**
       * List of keyframes.
       */
      keyframes: CSSKeyframeRule[];
    }

    /**
     * Representation of a custom property registration through CSS.registerProperty
     */
    export interface CSSPropertyRegistration {
      propertyName: string;

      initialValue?: Value;

      inherits: boolean;

      syntax: string;
    }

    /**
     * CSS font-palette-values rule representation.
     */
    export interface CSSFontPaletteValuesRule {
      /**
       * The css style sheet identifier (absent for user agent stylesheet and user-specified
       * stylesheet rules) this rule came from.
       */
      styleSheetId?: StyleSheetId;

      /**
       * Parent stylesheet's origin.
       */
      origin: StyleSheetOrigin;

      /**
       * Associated font palette name.
       */
      fontPaletteName: Value;

      /**
       * Associated style declaration.
       */
      style: CSSStyle;
    }

    /**
     * CSS property at-rule representation.
     */
    export interface CSSPropertyRule {
      /**
       * The css style sheet identifier (absent for user agent stylesheet and user-specified
       * stylesheet rules) this rule came from.
       */
      styleSheetId?: StyleSheetId;

      /**
       * Parent stylesheet's origin.
       */
      origin: StyleSheetOrigin;

      /**
       * Associated property name.
       */
      propertyName: Value;

      /**
       * Associated style declaration.
       */
      style: CSSStyle;
    }

    /**
     * CSS keyframe rule representation.
     */
    export interface CSSKeyframeRule {
      /**
       * The css style sheet identifier (absent for user agent stylesheet and user-specified
       * stylesheet rules) this rule came from.
       */
      styleSheetId?: StyleSheetId;

      /**
       * Parent stylesheet's origin.
       */
      origin: StyleSheetOrigin;

      /**
       * Associated key text.
       */
      keyText: Value;

      /**
       * Associated style declaration.
       */
      style: CSSStyle;
    }

    /**
     * A descriptor of operation to mutate style declaration text.
     */
    export interface StyleDeclarationEdit {
      /**
       * The css style sheet identifier.
       */
      styleSheetId: StyleSheetId;

      /**
       * The range of the style text in the enclosing stylesheet.
       */
      range: SourceRange;

      /**
       * New style text.
       */
      text: string;
    }
  }

  /**
   * Methods and events of the 'CacheStorage' domain.
   */
  export interface CacheStorageApi {
    requests: {
      /**
       * Deletes a cache.
       */
      deleteCache: { params: CacheStorage.DeleteCacheParams, result: CacheStorage.DeleteCacheResult }

      /**
       * Deletes a cache entry.
       */
      deleteEntry: { params: CacheStorage.DeleteEntryParams, result: CacheStorage.DeleteEntryResult }

      /**
       * Requests cache names.
       */
      requestCacheNames: { params: CacheStorage.RequestCacheNamesParams, result: CacheStorage.RequestCacheNamesResult }

      /**
       * Fetches cache entry.
       */
      requestCachedResponse: { params: CacheStorage.RequestCachedResponseParams, result: CacheStorage.RequestCachedResponseResult }

      /**
       * Requests data from cache.
       */
      requestEntries: { params: CacheStorage.RequestEntriesParams, result: CacheStorage.RequestEntriesResult }
    };
    events: {
    };
  }

  /**
   * Types of the 'CacheStorage' domain.
   */
  export namespace CacheStorage {
    /**
     * Parameters of the 'CacheStorage.deleteCache' method.
     */
    export interface DeleteCacheParams {
      /**
       * Id of cache for deletion.
       */
      cacheId: CacheId;
    }

    /**
     * Return value of the 'CacheStorage.deleteCache' method.
     */
    export interface DeleteCacheResult {
    }

    /**
     * Parameters of the 'CacheStorage.deleteEntry' method.
     */
    export interface DeleteEntryParams {
      /**
       * Id of cache where the entry will be deleted.
       */
      cacheId: CacheId;

      /**
       * URL spec of the request.
       */
      request: string;
    }

    /**
     * Return value of the 'CacheStorage.deleteEntry' method.
     */
    export interface DeleteEntryResult {
    }

    /**
     * Parameters of the 'CacheStorage.requestCacheNames' method.
     */
    export interface RequestCacheNamesParams {
      /**
       * At least and at most one of securityOrigin, storageKey, storageBucket must be specified.
       * Security origin.
       */
      securityOrigin?: string;

      /**
       * Storage key.
       */
      storageKey?: string;

      /**
       * Storage bucket. If not specified, it uses the default bucket.
       */
      storageBucket?: Storage.StorageBucket;
    }

    /**
     * Return value of the 'CacheStorage.requestCacheNames' method.
     */
    export interface RequestCacheNamesResult {
      /**
       * Caches for the security origin.
       */
      caches: Cache[];
    }

    /**
     * Parameters of the 'CacheStorage.requestCachedResponse' method.
     */
    export interface RequestCachedResponseParams {
      /**
       * Id of cache that contains the entry.
       */
      cacheId: CacheId;

      /**
       * URL spec of the request.
       */
      requestURL: string;

      /**
       * headers of the request.
       */
      requestHeaders: Header[];
    }

    /**
     * Return value of the 'CacheStorage.requestCachedResponse' method.
     */
    export interface RequestCachedResponseResult {
      /**
       * Response read from the cache.
       */
      response: CachedResponse;
    }

    /**
     * Parameters of the 'CacheStorage.requestEntries' method.
     */
    export interface RequestEntriesParams {
      /**
       * ID of cache to get entries from.
       */
      cacheId: CacheId;

      /**
       * Number of records to skip.
       */
      skipCount?: integer;

      /**
       * Number of records to fetch.
       */
      pageSize?: integer;

      /**
       * If present, only return the entries containing this substring in the path
       */
      pathFilter?: string;
    }

    /**
     * Return value of the 'CacheStorage.requestEntries' method.
     */
    export interface RequestEntriesResult {
      /**
       * Array of object store data entries.
       */
      cacheDataEntries: DataEntry[];

      /**
       * Count of returned entries from this storage. If pathFilter is empty, it
       * is the count of all entries from this storage.
       */
      returnCount: number;
    }

    /**
     * Unique identifier of the Cache object.
     */
    export type CacheId = string;

    /**
     * type of HTTP response cached
     */
    export type CachedResponseType = 'basic' | 'cors' | 'default' | 'error' | 'opaqueResponse' | 'opaqueRedirect';

    /**
     * Data entry.
     */
    export interface DataEntry {
      /**
       * Request URL.
       */
      requestURL: string;

      /**
       * Request method.
       */
      requestMethod: string;

      /**
       * Request headers
       */
      requestHeaders: Header[];

      /**
       * Number of seconds since epoch.
       */
      responseTime: number;

      /**
       * HTTP response status code.
       */
      responseStatus: integer;

      /**
       * HTTP response status text.
       */
      responseStatusText: string;

      /**
       * HTTP response type
       */
      responseType: CachedResponseType;

      /**
       * Response headers
       */
      responseHeaders: Header[];
    }

    /**
     * Cache identifier.
     */
    export interface Cache {
      /**
       * An opaque unique id of the cache.
       */
      cacheId: CacheId;

      /**
       * Security origin of the cache.
       */
      securityOrigin: string;

      /**
       * Storage key of the cache.
       */
      storageKey: string;

      /**
       * Storage bucket of the cache.
       */
      storageBucket?: Storage.StorageBucket;

      /**
       * The name of the cache.
       */
      cacheName: string;
    }

    export interface Header {
      name: string;

      value: string;
    }

    /**
     * Cached response
     */
    export interface CachedResponse {
      /**
       * Entry content, base64-encoded. (Encoded as a base64 string when passed over JSON)
       */
      body: string;
    }
  }

  /**
   * Methods and events of the 'Cast' domain.
   */
  export interface CastApi {
    requests: {
      /**
       * Starts observing for sinks that can be used for tab mirroring, and if set,
       * sinks compatible with |presentationUrl| as well. When sinks are found, a
       * |sinksUpdated| event is fired.
       * Also starts observing for issue messages. When an issue is added or removed,
       * an |issueUpdated| event is fired.
       */
      enable: { params: Cast.EnableParams, result: Cast.EnableResult }

      /**
       * Stops observing for sinks and issues.
       */
      disable: { params: Cast.DisableParams, result: Cast.DisableResult }

      /**
       * Sets a sink to be used when the web page requests the browser to choose a
       * sink via Presentation API, Remote Playback API, or Cast SDK.
       */
      setSinkToUse: { params: Cast.SetSinkToUseParams, result: Cast.SetSinkToUseResult }

      /**
       * Starts mirroring the desktop to the sink.
       */
      startDesktopMirroring: { params: Cast.StartDesktopMirroringParams, result: Cast.StartDesktopMirroringResult }

      /**
       * Starts mirroring the tab to the sink.
       */
      startTabMirroring: { params: Cast.StartTabMirroringParams, result: Cast.StartTabMirroringResult }

      /**
       * Stops the active Cast session on the sink.
       */
      stopCasting: { params: Cast.StopCastingParams, result: Cast.StopCastingResult }
    };
    events: {

      /**
       * This is fired whenever the list of available sinks changes. A sink is a
       * device or a software surface that you can cast to.
       */
      sinksUpdated: { params: Cast.SinksUpdatedEvent };

      /**
       * This is fired whenever the outstanding issue/error message changes.
       * |issueMessage| is empty if there is no issue.
       */
      issueUpdated: { params: Cast.IssueUpdatedEvent };
    };
  }

  /**
   * Types of the 'Cast' domain.
   */
  export namespace Cast {
    /**
     * Parameters of the 'Cast.enable' method.
     */
    export interface EnableParams {
      presentationUrl?: string;
    }

    /**
     * Return value of the 'Cast.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'Cast.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'Cast.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'Cast.setSinkToUse' method.
     */
    export interface SetSinkToUseParams {
      sinkName: string;
    }

    /**
     * Return value of the 'Cast.setSinkToUse' method.
     */
    export interface SetSinkToUseResult {
    }

    /**
     * Parameters of the 'Cast.startDesktopMirroring' method.
     */
    export interface StartDesktopMirroringParams {
      sinkName: string;
    }

    /**
     * Return value of the 'Cast.startDesktopMirroring' method.
     */
    export interface StartDesktopMirroringResult {
    }

    /**
     * Parameters of the 'Cast.startTabMirroring' method.
     */
    export interface StartTabMirroringParams {
      sinkName: string;
    }

    /**
     * Return value of the 'Cast.startTabMirroring' method.
     */
    export interface StartTabMirroringResult {
    }

    /**
     * Parameters of the 'Cast.stopCasting' method.
     */
    export interface StopCastingParams {
      sinkName: string;
    }

    /**
     * Return value of the 'Cast.stopCasting' method.
     */
    export interface StopCastingResult {
    }

    /**
     * Parameters of the 'Cast.sinksUpdated' event.
     */
    export interface SinksUpdatedEvent {
      sinks: Sink[];
    }

    /**
     * Parameters of the 'Cast.issueUpdated' event.
     */
    export interface IssueUpdatedEvent {
      issueMessage: string;
    }

    export interface Sink {
      name: string;

      id: string;

      /**
       * Text describing the current session. Present only if there is an active
       * session on the sink.
       */
      session?: string;
    }
  }

  /**
   * Methods and events of the 'DOM' domain.
   */
  export interface DOMApi {
    requests: {
      /**
       * Collects class names for the node with given id and all of it's child nodes.
       */
      collectClassNamesFromSubtree: { params: DOM.CollectClassNamesFromSubtreeParams, result: DOM.CollectClassNamesFromSubtreeResult }

      /**
       * Creates a deep copy of the specified node and places it into the target container before the
       * given anchor.
       */
      copyTo: { params: DOM.CopyToParams, result: DOM.CopyToResult }

      /**
       * Describes node given its id, does not require domain to be enabled. Does not start tracking any
       * objects, can be used for automation.
       */
      describeNode: { params: DOM.DescribeNodeParams, result: DOM.DescribeNodeResult }

      /**
       * Scrolls the specified rect of the given node into view if not already visible.
       * Note: exactly one between nodeId, backendNodeId and objectId should be passed
       * to identify the node.
       */
      scrollIntoViewIfNeeded: { params: DOM.ScrollIntoViewIfNeededParams, result: DOM.ScrollIntoViewIfNeededResult }

      /**
       * Disables DOM agent for the given page.
       */
      disable: { params: DOM.DisableParams, result: DOM.DisableResult }

      /**
       * Discards search results from the session with the given id. `getSearchResults` should no longer
       * be called for that search.
       */
      discardSearchResults: { params: DOM.DiscardSearchResultsParams, result: DOM.DiscardSearchResultsResult }

      /**
       * Enables DOM agent for the given page.
       */
      enable: { params: DOM.EnableParams, result: DOM.EnableResult }

      /**
       * Focuses the given element.
       */
      focus: { params: DOM.FocusParams, result: DOM.FocusResult }

      /**
       * Returns attributes for the specified node.
       */
      getAttributes: { params: DOM.GetAttributesParams, result: DOM.GetAttributesResult }

      /**
       * Returns boxes for the given node.
       */
      getBoxModel: { params: DOM.GetBoxModelParams, result: DOM.GetBoxModelResult }

      /**
       * Returns quads that describe node position on the page. This method
       * might return multiple quads for inline nodes.
       */
      getContentQuads: { params: DOM.GetContentQuadsParams, result: DOM.GetContentQuadsResult }

      /**
       * Returns the root DOM node (and optionally the subtree) to the caller.
       * Implicitly enables the DOM domain events for the current target.
       */
      getDocument: { params: DOM.GetDocumentParams, result: DOM.GetDocumentResult }

      /**
       * Returns the root DOM node (and optionally the subtree) to the caller.
       * Deprecated, as it is not designed to work well with the rest of the DOM agent.
       * Use DOMSnapshot.captureSnapshot instead.
       * @deprecated
       */
      getFlattenedDocument: { params: DOM.GetFlattenedDocumentParams, result: DOM.GetFlattenedDocumentResult }

      /**
       * Finds nodes with a given computed style in a subtree.
       */
      getNodesForSubtreeByStyle: { params: DOM.GetNodesForSubtreeByStyleParams, result: DOM.GetNodesForSubtreeByStyleResult }

      /**
       * Returns node id at given location. Depending on whether DOM domain is enabled, nodeId is
       * either returned or not.
       */
      getNodeForLocation: { params: DOM.GetNodeForLocationParams, result: DOM.GetNodeForLocationResult }

      /**
       * Returns node's HTML markup.
       */
      getOuterHTML: { params: DOM.GetOuterHTMLParams, result: DOM.GetOuterHTMLResult }

      /**
       * Returns the id of the nearest ancestor that is a relayout boundary.
       */
      getRelayoutBoundary: { params: DOM.GetRelayoutBoundaryParams, result: DOM.GetRelayoutBoundaryResult }

      /**
       * Returns search results from given `fromIndex` to given `toIndex` from the search with the given
       * identifier.
       */
      getSearchResults: { params: DOM.GetSearchResultsParams, result: DOM.GetSearchResultsResult }

      /**
       * Hides any highlight.
       */
      hideHighlight: { params: DOM.HideHighlightParams, result: DOM.HideHighlightResult }

      /**
       * Highlights DOM node.
       */
      highlightNode: { params: DOM.HighlightNodeParams, result: DOM.HighlightNodeResult }

      /**
       * Highlights given rectangle.
       */
      highlightRect: { params: DOM.HighlightRectParams, result: DOM.HighlightRectResult }

      /**
       * Marks last undoable state.
       */
      markUndoableState: { params: DOM.MarkUndoableStateParams, result: DOM.MarkUndoableStateResult }

      /**
       * Moves node into the new container, places it before the given anchor.
       */
      moveTo: { params: DOM.MoveToParams, result: DOM.MoveToResult }

      /**
       * Searches for a given string in the DOM tree. Use `getSearchResults` to access search results or
       * `cancelSearch` to end this search session.
       */
      performSearch: { params: DOM.PerformSearchParams, result: DOM.PerformSearchResult }

      /**
       * Requests that the node is sent to the caller given its path. // FIXME, use XPath
       */
      pushNodeByPathToFrontend: { params: DOM.PushNodeByPathToFrontendParams, result: DOM.PushNodeByPathToFrontendResult }

      /**
       * Requests that a batch of nodes is sent to the caller given their backend node ids.
       */
      pushNodesByBackendIdsToFrontend: { params: DOM.PushNodesByBackendIdsToFrontendParams, result: DOM.PushNodesByBackendIdsToFrontendResult }

      /**
       * Executes `querySelector` on a given node.
       */
      querySelector: { params: DOM.QuerySelectorParams, result: DOM.QuerySelectorResult }

      /**
       * Executes `querySelectorAll` on a given node.
       */
      querySelectorAll: { params: DOM.QuerySelectorAllParams, result: DOM.QuerySelectorAllResult }

      /**
       * Returns NodeIds of current top layer elements.
       * Top layer is rendered closest to the user within a viewport, therefore its elements always
       * appear on top of all other content.
       */
      getTopLayerElements: { params: DOM.GetTopLayerElementsParams, result: DOM.GetTopLayerElementsResult }

      /**
       * Re-does the last undone action.
       */
      redo: { params: DOM.RedoParams, result: DOM.RedoResult }

      /**
       * Removes attribute with given name from an element with given id.
       */
      removeAttribute: { params: DOM.RemoveAttributeParams, result: DOM.RemoveAttributeResult }

      /**
       * Removes node with given id.
       */
      removeNode: { params: DOM.RemoveNodeParams, result: DOM.RemoveNodeResult }

      /**
       * Requests that children of the node with given id are returned to the caller in form of
       * `setChildNodes` events where not only immediate children are retrieved, but all children down to
       * the specified depth.
       */
      requestChildNodes: { params: DOM.RequestChildNodesParams, result: DOM.RequestChildNodesResult }

      /**
       * Requests that the node is sent to the caller given the JavaScript node object reference. All
       * nodes that form the path from the node to the root are also sent to the client as a series of
       * `setChildNodes` notifications.
       */
      requestNode: { params: DOM.RequestNodeParams, result: DOM.RequestNodeResult }

      /**
       * Resolves the JavaScript node object for a given NodeId or BackendNodeId.
       */
      resolveNode: { params: DOM.ResolveNodeParams, result: DOM.ResolveNodeResult }

      /**
       * Sets attribute for an element with given id.
       */
      setAttributeValue: { params: DOM.SetAttributeValueParams, result: DOM.SetAttributeValueResult }

      /**
       * Sets attributes on element with given id. This method is useful when user edits some existing
       * attribute value and types in several attribute name/value pairs.
       */
      setAttributesAsText: { params: DOM.SetAttributesAsTextParams, result: DOM.SetAttributesAsTextResult }

      /**
       * Sets files for the given file input element.
       */
      setFileInputFiles: { params: DOM.SetFileInputFilesParams, result: DOM.SetFileInputFilesResult }

      /**
       * Sets if stack traces should be captured for Nodes. See `Node.getNodeStackTraces`. Default is disabled.
       */
      setNodeStackTracesEnabled: { params: DOM.SetNodeStackTracesEnabledParams, result: DOM.SetNodeStackTracesEnabledResult }

      /**
       * Gets stack traces associated with a Node. As of now, only provides stack trace for Node creation.
       */
      getNodeStackTraces: { params: DOM.GetNodeStackTracesParams, result: DOM.GetNodeStackTracesResult }

      /**
       * Returns file information for the given
       * File wrapper.
       */
      getFileInfo: { params: DOM.GetFileInfoParams, result: DOM.GetFileInfoResult }

      /**
       * Enables console to refer to the node with given id via $x (see Command Line API for more details
       * $x functions).
       */
      setInspectedNode: { params: DOM.SetInspectedNodeParams, result: DOM.SetInspectedNodeResult }

      /**
       * Sets node name for a node with given id.
       */
      setNodeName: { params: DOM.SetNodeNameParams, result: DOM.SetNodeNameResult }

      /**
       * Sets node value for a node with given id.
       */
      setNodeValue: { params: DOM.SetNodeValueParams, result: DOM.SetNodeValueResult }

      /**
       * Sets node HTML markup, returns new node id.
       */
      setOuterHTML: { params: DOM.SetOuterHTMLParams, result: DOM.SetOuterHTMLResult }

      /**
       * Undoes the last performed action.
       */
      undo: { params: DOM.UndoParams, result: DOM.UndoResult }

      /**
       * Returns iframe node that owns iframe with the given domain.
       */
      getFrameOwner: { params: DOM.GetFrameOwnerParams, result: DOM.GetFrameOwnerResult }

      /**
       * Returns the query container of the given node based on container query
       * conditions: containerName, physical, and logical axes. If no axes are
       * provided, the style container is returned, which is the direct parent or the
       * closest element with a matching container-name.
       */
      getContainerForNode: { params: DOM.GetContainerForNodeParams, result: DOM.GetContainerForNodeResult }

      /**
       * Returns the descendants of a container query container that have
       * container queries against this container.
       */
      getQueryingDescendantsForContainer: { params: DOM.GetQueryingDescendantsForContainerParams, result: DOM.GetQueryingDescendantsForContainerResult }
    };
    events: {

      /**
       * Fired when `Element`'s attribute is modified.
       */
      attributeModified: { params: DOM.AttributeModifiedEvent };

      /**
       * Fired when `Element`'s attribute is removed.
       */
      attributeRemoved: { params: DOM.AttributeRemovedEvent };

      /**
       * Mirrors `DOMCharacterDataModified` event.
       */
      characterDataModified: { params: DOM.CharacterDataModifiedEvent };

      /**
       * Fired when `Container`'s child node count has changed.
       */
      childNodeCountUpdated: { params: DOM.ChildNodeCountUpdatedEvent };

      /**
       * Mirrors `DOMNodeInserted` event.
       */
      childNodeInserted: { params: DOM.ChildNodeInsertedEvent };

      /**
       * Mirrors `DOMNodeRemoved` event.
       */
      childNodeRemoved: { params: DOM.ChildNodeRemovedEvent };

      /**
       * Called when distribution is changed.
       */
      distributedNodesUpdated: { params: DOM.DistributedNodesUpdatedEvent };

      /**
       * Fired when `Document` has been totally updated. Node ids are no longer valid.
       */
      documentUpdated: { params: DOM.DocumentUpdatedEvent };

      /**
       * Fired when `Element`'s inline style is modified via a CSS property modification.
       */
      inlineStyleInvalidated: { params: DOM.InlineStyleInvalidatedEvent };

      /**
       * Called when a pseudo element is added to an element.
       */
      pseudoElementAdded: { params: DOM.PseudoElementAddedEvent };

      /**
       * Called when top layer elements are changed.
       */
      topLayerElementsUpdated: { params: DOM.TopLayerElementsUpdatedEvent };

      /**
       * Called when a pseudo element is removed from an element.
       */
      pseudoElementRemoved: { params: DOM.PseudoElementRemovedEvent };

      /**
       * Fired when backend wants to provide client with the missing DOM structure. This happens upon
       * most of the calls requesting node ids.
       */
      setChildNodes: { params: DOM.SetChildNodesEvent };

      /**
       * Called when shadow root is popped from the element.
       */
      shadowRootPopped: { params: DOM.ShadowRootPoppedEvent };

      /**
       * Called when shadow root is pushed into the element.
       */
      shadowRootPushed: { params: DOM.ShadowRootPushedEvent };
    };
  }

  /**
   * Types of the 'DOM' domain.
   */
  export namespace DOM {
    /**
     * Parameters of the 'DOM.collectClassNamesFromSubtree' method.
     */
    export interface CollectClassNamesFromSubtreeParams {
      /**
       * Id of the node to collect class names.
       */
      nodeId: NodeId;
    }

    /**
     * Return value of the 'DOM.collectClassNamesFromSubtree' method.
     */
    export interface CollectClassNamesFromSubtreeResult {
      /**
       * Class name list.
       */
      classNames: string[];
    }

    /**
     * Parameters of the 'DOM.copyTo' method.
     */
    export interface CopyToParams {
      /**
       * Id of the node to copy.
       */
      nodeId: NodeId;

      /**
       * Id of the element to drop the copy into.
       */
      targetNodeId: NodeId;

      /**
       * Drop the copy before this node (if absent, the copy becomes the last child of
       * `targetNodeId`).
       */
      insertBeforeNodeId?: NodeId;
    }

    /**
     * Return value of the 'DOM.copyTo' method.
     */
    export interface CopyToResult {
      /**
       * Id of the node clone.
       */
      nodeId: NodeId;
    }

    /**
     * Parameters of the 'DOM.describeNode' method.
     */
    export interface DescribeNodeParams {
      /**
       * Identifier of the node.
       */
      nodeId?: NodeId;

      /**
       * Identifier of the backend node.
       */
      backendNodeId?: BackendNodeId;

      /**
       * JavaScript object id of the node wrapper.
       */
      objectId?: CdpV8.Runtime.RemoteObjectId;

      /**
       * The maximum depth at which children should be retrieved, defaults to 1. Use -1 for the
       * entire subtree or provide an integer larger than 0.
       */
      depth?: integer;

      /**
       * Whether or not iframes and shadow roots should be traversed when returning the subtree
       * (default is false).
       */
      pierce?: boolean;
    }

    /**
     * Return value of the 'DOM.describeNode' method.
     */
    export interface DescribeNodeResult {
      /**
       * Node description.
       */
      node: Node;
    }

    /**
     * Parameters of the 'DOM.scrollIntoViewIfNeeded' method.
     */
    export interface ScrollIntoViewIfNeededParams {
      /**
       * Identifier of the node.
       */
      nodeId?: NodeId;

      /**
       * Identifier of the backend node.
       */
      backendNodeId?: BackendNodeId;

      /**
       * JavaScript object id of the node wrapper.
       */
      objectId?: CdpV8.Runtime.RemoteObjectId;

      /**
       * The rect to be scrolled into view, relative to the node's border box, in CSS pixels.
       * When omitted, center of the node will be used, similar to Element.scrollIntoView.
       */
      rect?: Rect;
    }

    /**
     * Return value of the 'DOM.scrollIntoViewIfNeeded' method.
     */
    export interface ScrollIntoViewIfNeededResult {
    }

    /**
     * Parameters of the 'DOM.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'DOM.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'DOM.discardSearchResults' method.
     */
    export interface DiscardSearchResultsParams {
      /**
       * Unique search session identifier.
       */
      searchId: string;
    }

    /**
     * Return value of the 'DOM.discardSearchResults' method.
     */
    export interface DiscardSearchResultsResult {
    }

    /**
     * Parameters of the 'DOM.enable' method.
     */
    export interface EnableParams {
      /**
       * Whether to include whitespaces in the children array of returned Nodes.
       */
      includeWhitespace?: 'none' | 'all';
    }

    /**
     * Return value of the 'DOM.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'DOM.focus' method.
     */
    export interface FocusParams {
      /**
       * Identifier of the node.
       */
      nodeId?: NodeId;

      /**
       * Identifier of the backend node.
       */
      backendNodeId?: BackendNodeId;

      /**
       * JavaScript object id of the node wrapper.
       */
      objectId?: CdpV8.Runtime.RemoteObjectId;
    }

    /**
     * Return value of the 'DOM.focus' method.
     */
    export interface FocusResult {
    }

    /**
     * Parameters of the 'DOM.getAttributes' method.
     */
    export interface GetAttributesParams {
      /**
       * Id of the node to retrieve attibutes for.
       */
      nodeId: NodeId;
    }

    /**
     * Return value of the 'DOM.getAttributes' method.
     */
    export interface GetAttributesResult {
      /**
       * An interleaved array of node attribute names and values.
       */
      attributes: string[];
    }

    /**
     * Parameters of the 'DOM.getBoxModel' method.
     */
    export interface GetBoxModelParams {
      /**
       * Identifier of the node.
       */
      nodeId?: NodeId;

      /**
       * Identifier of the backend node.
       */
      backendNodeId?: BackendNodeId;

      /**
       * JavaScript object id of the node wrapper.
       */
      objectId?: CdpV8.Runtime.RemoteObjectId;
    }

    /**
     * Return value of the 'DOM.getBoxModel' method.
     */
    export interface GetBoxModelResult {
      /**
       * Box model for the node.
       */
      model: BoxModel;
    }

    /**
     * Parameters of the 'DOM.getContentQuads' method.
     */
    export interface GetContentQuadsParams {
      /**
       * Identifier of the node.
       */
      nodeId?: NodeId;

      /**
       * Identifier of the backend node.
       */
      backendNodeId?: BackendNodeId;

      /**
       * JavaScript object id of the node wrapper.
       */
      objectId?: CdpV8.Runtime.RemoteObjectId;
    }

    /**
     * Return value of the 'DOM.getContentQuads' method.
     */
    export interface GetContentQuadsResult {
      /**
       * Quads that describe node layout relative to viewport.
       */
      quads: Quad[];
    }

    /**
     * Parameters of the 'DOM.getDocument' method.
     */
    export interface GetDocumentParams {
      /**
       * The maximum depth at which children should be retrieved, defaults to 1. Use -1 for the
       * entire subtree or provide an integer larger than 0.
       */
      depth?: integer;

      /**
       * Whether or not iframes and shadow roots should be traversed when returning the subtree
       * (default is false).
       */
      pierce?: boolean;
    }

    /**
     * Return value of the 'DOM.getDocument' method.
     */
    export interface GetDocumentResult {
      /**
       * Resulting node.
       */
      root: Node;
    }

    /**
     * Parameters of the 'DOM.getFlattenedDocument' method.
     */
    export interface GetFlattenedDocumentParams {
      /**
       * The maximum depth at which children should be retrieved, defaults to 1. Use -1 for the
       * entire subtree or provide an integer larger than 0.
       */
      depth?: integer;

      /**
       * Whether or not iframes and shadow roots should be traversed when returning the subtree
       * (default is false).
       */
      pierce?: boolean;
    }

    /**
     * Return value of the 'DOM.getFlattenedDocument' method.
     */
    export interface GetFlattenedDocumentResult {
      /**
       * Resulting node.
       */
      nodes: Node[];
    }

    /**
     * Parameters of the 'DOM.getNodesForSubtreeByStyle' method.
     */
    export interface GetNodesForSubtreeByStyleParams {
      /**
       * Node ID pointing to the root of a subtree.
       */
      nodeId: NodeId;

      /**
       * The style to filter nodes by (includes nodes if any of properties matches).
       */
      computedStyles: CSSComputedStyleProperty[];

      /**
       * Whether or not iframes and shadow roots in the same target should be traversed when returning the
       * results (default is false).
       */
      pierce?: boolean;
    }

    /**
     * Return value of the 'DOM.getNodesForSubtreeByStyle' method.
     */
    export interface GetNodesForSubtreeByStyleResult {
      /**
       * Resulting nodes.
       */
      nodeIds: NodeId[];
    }

    /**
     * Parameters of the 'DOM.getNodeForLocation' method.
     */
    export interface GetNodeForLocationParams {
      /**
       * X coordinate.
       */
      x: integer;

      /**
       * Y coordinate.
       */
      y: integer;

      /**
       * False to skip to the nearest non-UA shadow root ancestor (default: false).
       */
      includeUserAgentShadowDOM?: boolean;

      /**
       * Whether to ignore pointer-events: none on elements and hit test them.
       */
      ignorePointerEventsNone?: boolean;
    }

    /**
     * Return value of the 'DOM.getNodeForLocation' method.
     */
    export interface GetNodeForLocationResult {
      /**
       * Resulting node.
       */
      backendNodeId: BackendNodeId;

      /**
       * Frame this node belongs to.
       */
      frameId: Page.FrameId;

      /**
       * Id of the node at given coordinates, only when enabled and requested document.
       */
      nodeId?: NodeId;
    }

    /**
     * Parameters of the 'DOM.getOuterHTML' method.
     */
    export interface GetOuterHTMLParams {
      /**
       * Identifier of the node.
       */
      nodeId?: NodeId;

      /**
       * Identifier of the backend node.
       */
      backendNodeId?: BackendNodeId;

      /**
       * JavaScript object id of the node wrapper.
       */
      objectId?: CdpV8.Runtime.RemoteObjectId;
    }

    /**
     * Return value of the 'DOM.getOuterHTML' method.
     */
    export interface GetOuterHTMLResult {
      /**
       * Outer HTML markup.
       */
      outerHTML: string;
    }

    /**
     * Parameters of the 'DOM.getRelayoutBoundary' method.
     */
    export interface GetRelayoutBoundaryParams {
      /**
       * Id of the node.
       */
      nodeId: NodeId;
    }

    /**
     * Return value of the 'DOM.getRelayoutBoundary' method.
     */
    export interface GetRelayoutBoundaryResult {
      /**
       * Relayout boundary node id for the given node.
       */
      nodeId: NodeId;
    }

    /**
     * Parameters of the 'DOM.getSearchResults' method.
     */
    export interface GetSearchResultsParams {
      /**
       * Unique search session identifier.
       */
      searchId: string;

      /**
       * Start index of the search result to be returned.
       */
      fromIndex: integer;

      /**
       * End index of the search result to be returned.
       */
      toIndex: integer;
    }

    /**
     * Return value of the 'DOM.getSearchResults' method.
     */
    export interface GetSearchResultsResult {
      /**
       * Ids of the search result nodes.
       */
      nodeIds: NodeId[];
    }

    /**
     * Parameters of the 'DOM.hideHighlight' method.
     */
    export interface HideHighlightParams {
    }

    /**
     * Return value of the 'DOM.hideHighlight' method.
     */
    export interface HideHighlightResult {
    }

    /**
     * Parameters of the 'DOM.highlightNode' method.
     */
    export interface HighlightNodeParams {
    }

    /**
     * Return value of the 'DOM.highlightNode' method.
     */
    export interface HighlightNodeResult {
    }

    /**
     * Parameters of the 'DOM.highlightRect' method.
     */
    export interface HighlightRectParams {
    }

    /**
     * Return value of the 'DOM.highlightRect' method.
     */
    export interface HighlightRectResult {
    }

    /**
     * Parameters of the 'DOM.markUndoableState' method.
     */
    export interface MarkUndoableStateParams {
    }

    /**
     * Return value of the 'DOM.markUndoableState' method.
     */
    export interface MarkUndoableStateResult {
    }

    /**
     * Parameters of the 'DOM.moveTo' method.
     */
    export interface MoveToParams {
      /**
       * Id of the node to move.
       */
      nodeId: NodeId;

      /**
       * Id of the element to drop the moved node into.
       */
      targetNodeId: NodeId;

      /**
       * Drop node before this one (if absent, the moved node becomes the last child of
       * `targetNodeId`).
       */
      insertBeforeNodeId?: NodeId;
    }

    /**
     * Return value of the 'DOM.moveTo' method.
     */
    export interface MoveToResult {
      /**
       * New id of the moved node.
       */
      nodeId: NodeId;
    }

    /**
     * Parameters of the 'DOM.performSearch' method.
     */
    export interface PerformSearchParams {
      /**
       * Plain text or query selector or XPath search query.
       */
      query: string;

      /**
       * True to search in user agent shadow DOM.
       */
      includeUserAgentShadowDOM?: boolean;
    }

    /**
     * Return value of the 'DOM.performSearch' method.
     */
    export interface PerformSearchResult {
      /**
       * Unique search session identifier.
       */
      searchId: string;

      /**
       * Number of search results.
       */
      resultCount: integer;
    }

    /**
     * Parameters of the 'DOM.pushNodeByPathToFrontend' method.
     */
    export interface PushNodeByPathToFrontendParams {
      /**
       * Path to node in the proprietary format.
       */
      path: string;
    }

    /**
     * Return value of the 'DOM.pushNodeByPathToFrontend' method.
     */
    export interface PushNodeByPathToFrontendResult {
      /**
       * Id of the node for given path.
       */
      nodeId: NodeId;
    }

    /**
     * Parameters of the 'DOM.pushNodesByBackendIdsToFrontend' method.
     */
    export interface PushNodesByBackendIdsToFrontendParams {
      /**
       * The array of backend node ids.
       */
      backendNodeIds: BackendNodeId[];
    }

    /**
     * Return value of the 'DOM.pushNodesByBackendIdsToFrontend' method.
     */
    export interface PushNodesByBackendIdsToFrontendResult {
      /**
       * The array of ids of pushed nodes that correspond to the backend ids specified in
       * backendNodeIds.
       */
      nodeIds: NodeId[];
    }

    /**
     * Parameters of the 'DOM.querySelector' method.
     */
    export interface QuerySelectorParams {
      /**
       * Id of the node to query upon.
       */
      nodeId: NodeId;

      /**
       * Selector string.
       */
      selector: string;
    }

    /**
     * Return value of the 'DOM.querySelector' method.
     */
    export interface QuerySelectorResult {
      /**
       * Query selector result.
       */
      nodeId: NodeId;
    }

    /**
     * Parameters of the 'DOM.querySelectorAll' method.
     */
    export interface QuerySelectorAllParams {
      /**
       * Id of the node to query upon.
       */
      nodeId: NodeId;

      /**
       * Selector string.
       */
      selector: string;
    }

    /**
     * Return value of the 'DOM.querySelectorAll' method.
     */
    export interface QuerySelectorAllResult {
      /**
       * Query selector result.
       */
      nodeIds: NodeId[];
    }

    /**
     * Parameters of the 'DOM.getTopLayerElements' method.
     */
    export interface GetTopLayerElementsParams {
    }

    /**
     * Return value of the 'DOM.getTopLayerElements' method.
     */
    export interface GetTopLayerElementsResult {
      /**
       * NodeIds of top layer elements
       */
      nodeIds: NodeId[];
    }

    /**
     * Parameters of the 'DOM.redo' method.
     */
    export interface RedoParams {
    }

    /**
     * Return value of the 'DOM.redo' method.
     */
    export interface RedoResult {
    }

    /**
     * Parameters of the 'DOM.removeAttribute' method.
     */
    export interface RemoveAttributeParams {
      /**
       * Id of the element to remove attribute from.
       */
      nodeId: NodeId;

      /**
       * Name of the attribute to remove.
       */
      name: string;
    }

    /**
     * Return value of the 'DOM.removeAttribute' method.
     */
    export interface RemoveAttributeResult {
    }

    /**
     * Parameters of the 'DOM.removeNode' method.
     */
    export interface RemoveNodeParams {
      /**
       * Id of the node to remove.
       */
      nodeId: NodeId;
    }

    /**
     * Return value of the 'DOM.removeNode' method.
     */
    export interface RemoveNodeResult {
    }

    /**
     * Parameters of the 'DOM.requestChildNodes' method.
     */
    export interface RequestChildNodesParams {
      /**
       * Id of the node to get children for.
       */
      nodeId: NodeId;

      /**
       * The maximum depth at which children should be retrieved, defaults to 1. Use -1 for the
       * entire subtree or provide an integer larger than 0.
       */
      depth?: integer;

      /**
       * Whether or not iframes and shadow roots should be traversed when returning the sub-tree
       * (default is false).
       */
      pierce?: boolean;
    }

    /**
     * Return value of the 'DOM.requestChildNodes' method.
     */
    export interface RequestChildNodesResult {
    }

    /**
     * Parameters of the 'DOM.requestNode' method.
     */
    export interface RequestNodeParams {
      /**
       * JavaScript object id to convert into node.
       */
      objectId: CdpV8.Runtime.RemoteObjectId;
    }

    /**
     * Return value of the 'DOM.requestNode' method.
     */
    export interface RequestNodeResult {
      /**
       * Node id for given object.
       */
      nodeId: NodeId;
    }

    /**
     * Parameters of the 'DOM.resolveNode' method.
     */
    export interface ResolveNodeParams {
      /**
       * Id of the node to resolve.
       */
      nodeId?: NodeId;

      /**
       * Backend identifier of the node to resolve.
       */
      backendNodeId?: DOM.BackendNodeId;

      /**
       * Symbolic group name that can be used to release multiple objects.
       */
      objectGroup?: string;

      /**
       * Execution context in which to resolve the node.
       */
      executionContextId?: CdpV8.Runtime.ExecutionContextId;
    }

    /**
     * Return value of the 'DOM.resolveNode' method.
     */
    export interface ResolveNodeResult {
      /**
       * JavaScript object wrapper for given node.
       */
      object: CdpV8.Runtime.RemoteObject;
    }

    /**
     * Parameters of the 'DOM.setAttributeValue' method.
     */
    export interface SetAttributeValueParams {
      /**
       * Id of the element to set attribute for.
       */
      nodeId: NodeId;

      /**
       * Attribute name.
       */
      name: string;

      /**
       * Attribute value.
       */
      value: string;
    }

    /**
     * Return value of the 'DOM.setAttributeValue' method.
     */
    export interface SetAttributeValueResult {
    }

    /**
     * Parameters of the 'DOM.setAttributesAsText' method.
     */
    export interface SetAttributesAsTextParams {
      /**
       * Id of the element to set attributes for.
       */
      nodeId: NodeId;

      /**
       * Text with a number of attributes. Will parse this text using HTML parser.
       */
      text: string;

      /**
       * Attribute name to replace with new attributes derived from text in case text parsed
       * successfully.
       */
      name?: string;
    }

    /**
     * Return value of the 'DOM.setAttributesAsText' method.
     */
    export interface SetAttributesAsTextResult {
    }

    /**
     * Parameters of the 'DOM.setFileInputFiles' method.
     */
    export interface SetFileInputFilesParams {
      /**
       * Array of file paths to set.
       */
      files: string[];

      /**
       * Identifier of the node.
       */
      nodeId?: NodeId;

      /**
       * Identifier of the backend node.
       */
      backendNodeId?: BackendNodeId;

      /**
       * JavaScript object id of the node wrapper.
       */
      objectId?: CdpV8.Runtime.RemoteObjectId;
    }

    /**
     * Return value of the 'DOM.setFileInputFiles' method.
     */
    export interface SetFileInputFilesResult {
    }

    /**
     * Parameters of the 'DOM.setNodeStackTracesEnabled' method.
     */
    export interface SetNodeStackTracesEnabledParams {
      /**
       * Enable or disable.
       */
      enable: boolean;
    }

    /**
     * Return value of the 'DOM.setNodeStackTracesEnabled' method.
     */
    export interface SetNodeStackTracesEnabledResult {
    }

    /**
     * Parameters of the 'DOM.getNodeStackTraces' method.
     */
    export interface GetNodeStackTracesParams {
      /**
       * Id of the node to get stack traces for.
       */
      nodeId: NodeId;
    }

    /**
     * Return value of the 'DOM.getNodeStackTraces' method.
     */
    export interface GetNodeStackTracesResult {
      /**
       * Creation stack trace, if available.
       */
      creation?: CdpV8.Runtime.StackTrace;
    }

    /**
     * Parameters of the 'DOM.getFileInfo' method.
     */
    export interface GetFileInfoParams {
      /**
       * JavaScript object id of the node wrapper.
       */
      objectId: CdpV8.Runtime.RemoteObjectId;
    }

    /**
     * Return value of the 'DOM.getFileInfo' method.
     */
    export interface GetFileInfoResult {
      path: string;
    }

    /**
     * Parameters of the 'DOM.setInspectedNode' method.
     */
    export interface SetInspectedNodeParams {
      /**
       * DOM node id to be accessible by means of $x command line API.
       */
      nodeId: NodeId;
    }

    /**
     * Return value of the 'DOM.setInspectedNode' method.
     */
    export interface SetInspectedNodeResult {
    }

    /**
     * Parameters of the 'DOM.setNodeName' method.
     */
    export interface SetNodeNameParams {
      /**
       * Id of the node to set name for.
       */
      nodeId: NodeId;

      /**
       * New node's name.
       */
      name: string;
    }

    /**
     * Return value of the 'DOM.setNodeName' method.
     */
    export interface SetNodeNameResult {
      /**
       * New node's id.
       */
      nodeId: NodeId;
    }

    /**
     * Parameters of the 'DOM.setNodeValue' method.
     */
    export interface SetNodeValueParams {
      /**
       * Id of the node to set value for.
       */
      nodeId: NodeId;

      /**
       * New node's value.
       */
      value: string;
    }

    /**
     * Return value of the 'DOM.setNodeValue' method.
     */
    export interface SetNodeValueResult {
    }

    /**
     * Parameters of the 'DOM.setOuterHTML' method.
     */
    export interface SetOuterHTMLParams {
      /**
       * Id of the node to set markup for.
       */
      nodeId: NodeId;

      /**
       * Outer HTML markup to set.
       */
      outerHTML: string;
    }

    /**
     * Return value of the 'DOM.setOuterHTML' method.
     */
    export interface SetOuterHTMLResult {
    }

    /**
     * Parameters of the 'DOM.undo' method.
     */
    export interface UndoParams {
    }

    /**
     * Return value of the 'DOM.undo' method.
     */
    export interface UndoResult {
    }

    /**
     * Parameters of the 'DOM.getFrameOwner' method.
     */
    export interface GetFrameOwnerParams {
      frameId: Page.FrameId;
    }

    /**
     * Return value of the 'DOM.getFrameOwner' method.
     */
    export interface GetFrameOwnerResult {
      /**
       * Resulting node.
       */
      backendNodeId: BackendNodeId;

      /**
       * Id of the node at given coordinates, only when enabled and requested document.
       */
      nodeId?: NodeId;
    }

    /**
     * Parameters of the 'DOM.getContainerForNode' method.
     */
    export interface GetContainerForNodeParams {
      nodeId: NodeId;

      containerName?: string;

      physicalAxes?: PhysicalAxes;

      logicalAxes?: LogicalAxes;
    }

    /**
     * Return value of the 'DOM.getContainerForNode' method.
     */
    export interface GetContainerForNodeResult {
      /**
       * The container node for the given node, or null if not found.
       */
      nodeId?: NodeId;
    }

    /**
     * Parameters of the 'DOM.getQueryingDescendantsForContainer' method.
     */
    export interface GetQueryingDescendantsForContainerParams {
      /**
       * Id of the container node to find querying descendants from.
       */
      nodeId: NodeId;
    }

    /**
     * Return value of the 'DOM.getQueryingDescendantsForContainer' method.
     */
    export interface GetQueryingDescendantsForContainerResult {
      /**
       * Descendant nodes with container queries against the given container.
       */
      nodeIds: NodeId[];
    }

    /**
     * Parameters of the 'DOM.attributeModified' event.
     */
    export interface AttributeModifiedEvent {
      /**
       * Id of the node that has changed.
       */
      nodeId: NodeId;

      /**
       * Attribute name.
       */
      name: string;

      /**
       * Attribute value.
       */
      value: string;
    }

    /**
     * Parameters of the 'DOM.attributeRemoved' event.
     */
    export interface AttributeRemovedEvent {
      /**
       * Id of the node that has changed.
       */
      nodeId: NodeId;

      /**
       * A ttribute name.
       */
      name: string;
    }

    /**
     * Parameters of the 'DOM.characterDataModified' event.
     */
    export interface CharacterDataModifiedEvent {
      /**
       * Id of the node that has changed.
       */
      nodeId: NodeId;

      /**
       * New text value.
       */
      characterData: string;
    }

    /**
     * Parameters of the 'DOM.childNodeCountUpdated' event.
     */
    export interface ChildNodeCountUpdatedEvent {
      /**
       * Id of the node that has changed.
       */
      nodeId: NodeId;

      /**
       * New node count.
       */
      childNodeCount: integer;
    }

    /**
     * Parameters of the 'DOM.childNodeInserted' event.
     */
    export interface ChildNodeInsertedEvent {
      /**
       * Id of the node that has changed.
       */
      parentNodeId: NodeId;

      /**
       * Id of the previous sibling.
       */
      previousNodeId: NodeId;

      /**
       * Inserted node data.
       */
      node: Node;
    }

    /**
     * Parameters of the 'DOM.childNodeRemoved' event.
     */
    export interface ChildNodeRemovedEvent {
      /**
       * Parent id.
       */
      parentNodeId: NodeId;

      /**
       * Id of the node that has been removed.
       */
      nodeId: NodeId;
    }

    /**
     * Parameters of the 'DOM.distributedNodesUpdated' event.
     */
    export interface DistributedNodesUpdatedEvent {
      /**
       * Insertion point where distributed nodes were updated.
       */
      insertionPointId: NodeId;

      /**
       * Distributed nodes for given insertion point.
       */
      distributedNodes: BackendNode[];
    }

    /**
     * Parameters of the 'DOM.documentUpdated' event.
     */
    export interface DocumentUpdatedEvent {
    }

    /**
     * Parameters of the 'DOM.inlineStyleInvalidated' event.
     */
    export interface InlineStyleInvalidatedEvent {
      /**
       * Ids of the nodes for which the inline styles have been invalidated.
       */
      nodeIds: NodeId[];
    }

    /**
     * Parameters of the 'DOM.pseudoElementAdded' event.
     */
    export interface PseudoElementAddedEvent {
      /**
       * Pseudo element's parent element id.
       */
      parentId: NodeId;

      /**
       * The added pseudo element.
       */
      pseudoElement: Node;
    }

    /**
     * Parameters of the 'DOM.topLayerElementsUpdated' event.
     */
    export interface TopLayerElementsUpdatedEvent {
    }

    /**
     * Parameters of the 'DOM.pseudoElementRemoved' event.
     */
    export interface PseudoElementRemovedEvent {
      /**
       * Pseudo element's parent element id.
       */
      parentId: NodeId;

      /**
       * The removed pseudo element id.
       */
      pseudoElementId: NodeId;
    }

    /**
     * Parameters of the 'DOM.setChildNodes' event.
     */
    export interface SetChildNodesEvent {
      /**
       * Parent node id to populate with children.
       */
      parentId: NodeId;

      /**
       * Child nodes array.
       */
      nodes: Node[];
    }

    /**
     * Parameters of the 'DOM.shadowRootPopped' event.
     */
    export interface ShadowRootPoppedEvent {
      /**
       * Host element id.
       */
      hostId: NodeId;

      /**
       * Shadow root id.
       */
      rootId: NodeId;
    }

    /**
     * Parameters of the 'DOM.shadowRootPushed' event.
     */
    export interface ShadowRootPushedEvent {
      /**
       * Host element id.
       */
      hostId: NodeId;

      /**
       * Shadow root.
       */
      root: Node;
    }

    /**
     * Unique DOM node identifier.
     */
    export type NodeId = integer;

    /**
     * Unique DOM node identifier used to reference a node that may not have been pushed to the
     * front-end.
     */
    export type BackendNodeId = integer;

    /**
     * Backend node with a friendly name.
     */
    export interface BackendNode {
      /**
       * `Node`'s nodeType.
       */
      nodeType: integer;

      /**
       * `Node`'s nodeName.
       */
      nodeName: string;

      backendNodeId: BackendNodeId;
    }

    /**
     * Pseudo element type.
     */
    export type PseudoType = 'first-line' | 'first-letter' | 'before' | 'after' | 'marker' | 'backdrop' | 'selection' | 'target-text' | 'spelling-error' | 'grammar-error' | 'highlight' | 'first-line-inherited' | 'scrollbar' | 'scrollbar-thumb' | 'scrollbar-button' | 'scrollbar-track' | 'scrollbar-track-piece' | 'scrollbar-corner' | 'resizer' | 'input-list-button' | 'view-transition' | 'view-transition-group' | 'view-transition-image-pair' | 'view-transition-old' | 'view-transition-new';

    /**
     * Shadow root type.
     */
    export type ShadowRootType = 'user-agent' | 'open' | 'closed';

    /**
     * Document compatibility mode.
     */
    export type CompatibilityMode = 'QuirksMode' | 'LimitedQuirksMode' | 'NoQuirksMode';

    /**
     * ContainerSelector physical axes
     */
    export type PhysicalAxes = 'Horizontal' | 'Vertical' | 'Both';

    /**
     * ContainerSelector logical axes
     */
    export type LogicalAxes = 'Inline' | 'Block' | 'Both';

    /**
     * DOM interaction is implemented in terms of mirror objects that represent the actual DOM nodes.
     * DOMNode is a base node mirror type.
     */
    export interface Node {
      /**
       * Node identifier that is passed into the rest of the DOM messages as the `nodeId`. Backend
       * will only push node with given `id` once. It is aware of all requested nodes and will only
       * fire DOM events for nodes known to the client.
       */
      nodeId: NodeId;

      /**
       * The id of the parent node if any.
       */
      parentId?: NodeId;

      /**
       * The BackendNodeId for this node.
       */
      backendNodeId: BackendNodeId;

      /**
       * `Node`'s nodeType.
       */
      nodeType: integer;

      /**
       * `Node`'s nodeName.
       */
      nodeName: string;

      /**
       * `Node`'s localName.
       */
      localName: string;

      /**
       * `Node`'s nodeValue.
       */
      nodeValue: string;

      /**
       * Child count for `Container` nodes.
       */
      childNodeCount?: integer;

      /**
       * Child nodes of this node when requested with children.
       */
      children?: Node[];

      /**
       * Attributes of the `Element` node in the form of flat array `[name1, value1, name2, value2]`.
       */
      attributes?: string[];

      /**
       * Document URL that `Document` or `FrameOwner` node points to.
       */
      documentURL?: string;

      /**
       * Base URL that `Document` or `FrameOwner` node uses for URL completion.
       */
      baseURL?: string;

      /**
       * `DocumentType`'s publicId.
       */
      publicId?: string;

      /**
       * `DocumentType`'s systemId.
       */
      systemId?: string;

      /**
       * `DocumentType`'s internalSubset.
       */
      internalSubset?: string;

      /**
       * `Document`'s XML version in case of XML documents.
       */
      xmlVersion?: string;

      /**
       * `Attr`'s name.
       */
      name?: string;

      /**
       * `Attr`'s value.
       */
      value?: string;

      /**
       * Pseudo element type for this node.
       */
      pseudoType?: PseudoType;

      /**
       * Pseudo element identifier for this node. Only present if there is a
       * valid pseudoType.
       */
      pseudoIdentifier?: string;

      /**
       * Shadow root type.
       */
      shadowRootType?: ShadowRootType;

      /**
       * Frame ID for frame owner elements.
       */
      frameId?: Page.FrameId;

      /**
       * Content document for frame owner elements.
       */
      contentDocument?: Node;

      /**
       * Shadow root list for given element host.
       */
      shadowRoots?: Node[];

      /**
       * Content document fragment for template elements.
       */
      templateContent?: Node;

      /**
       * Pseudo elements associated with this node.
       */
      pseudoElements?: Node[];

      /**
       * Deprecated, as the HTML Imports API has been removed (crbug.com/937746).
       * This property used to return the imported document for the HTMLImport links.
       * The property is always undefined now.
       * @deprecated
       */
      importedDocument?: Node;

      /**
       * Distributed nodes for given insertion point.
       */
      distributedNodes?: BackendNode[];

      /**
       * Whether the node is SVG.
       */
      isSVG?: boolean;

      compatibilityMode?: CompatibilityMode;

      assignedSlot?: BackendNode;
    }

    /**
     * A structure holding an RGBA color.
     */
    export interface RGBA {
      /**
       * The red component, in the [0-255] range.
       */
      r: integer;

      /**
       * The green component, in the [0-255] range.
       */
      g: integer;

      /**
       * The blue component, in the [0-255] range.
       */
      b: integer;

      /**
       * The alpha component, in the [0-1] range (default: 1).
       */
      a?: number;
    }

    /**
     * An array of quad vertices, x immediately followed by y for each point, points clock-wise.
     */
    export type Quad = number[];

    /**
     * Box model.
     */
    export interface BoxModel {
      /**
       * Content box
       */
      content: Quad;

      /**
       * Padding box
       */
      padding: Quad;

      /**
       * Border box
       */
      border: Quad;

      /**
       * Margin box
       */
      margin: Quad;

      /**
       * Node width
       */
      width: integer;

      /**
       * Node height
       */
      height: integer;

      /**
       * Shape outside coordinates
       */
      shapeOutside?: ShapeOutsideInfo;
    }

    /**
     * CSS Shape Outside details.
     */
    export interface ShapeOutsideInfo {
      /**
       * Shape bounds
       */
      bounds: Quad;

      /**
       * Shape coordinate details
       */
      shape: any[];

      /**
       * Margin shape bounds
       */
      marginShape: any[];
    }

    /**
     * Rectangle.
     */
    export interface Rect {
      /**
       * X coordinate
       */
      x: number;

      /**
       * Y coordinate
       */
      y: number;

      /**
       * Rectangle width
       */
      width: number;

      /**
       * Rectangle height
       */
      height: number;
    }

    export interface CSSComputedStyleProperty {
      /**
       * Computed style property name.
       */
      name: string;

      /**
       * Computed style property value.
       */
      value: string;
    }
  }

  /**
   * Methods and events of the 'DOMDebugger' domain.
   */
  export interface DOMDebuggerApi {
    requests: {
      /**
       * Returns event listeners of the given object.
       */
      getEventListeners: { params: DOMDebugger.GetEventListenersParams, result: DOMDebugger.GetEventListenersResult }

      /**
       * Removes DOM breakpoint that was set using `setDOMBreakpoint`.
       */
      removeDOMBreakpoint: { params: DOMDebugger.RemoveDOMBreakpointParams, result: DOMDebugger.RemoveDOMBreakpointResult }

      /**
       * Removes breakpoint on particular DOM event.
       */
      removeEventListenerBreakpoint: { params: DOMDebugger.RemoveEventListenerBreakpointParams, result: DOMDebugger.RemoveEventListenerBreakpointResult }

      /**
       * Removes breakpoint on particular native event.
       * @deprecated
       */
      removeInstrumentationBreakpoint: { params: DOMDebugger.RemoveInstrumentationBreakpointParams, result: DOMDebugger.RemoveInstrumentationBreakpointResult }

      /**
       * Removes breakpoint from XMLHttpRequest.
       */
      removeXHRBreakpoint: { params: DOMDebugger.RemoveXHRBreakpointParams, result: DOMDebugger.RemoveXHRBreakpointResult }

      /**
       * Sets breakpoint on particular CSP violations.
       */
      setBreakOnCSPViolation: { params: DOMDebugger.SetBreakOnCSPViolationParams, result: DOMDebugger.SetBreakOnCSPViolationResult }

      /**
       * Sets breakpoint on particular operation with DOM.
       */
      setDOMBreakpoint: { params: DOMDebugger.SetDOMBreakpointParams, result: DOMDebugger.SetDOMBreakpointResult }

      /**
       * Sets breakpoint on particular DOM event.
       */
      setEventListenerBreakpoint: { params: DOMDebugger.SetEventListenerBreakpointParams, result: DOMDebugger.SetEventListenerBreakpointResult }

      /**
       * Sets breakpoint on particular native event.
       * @deprecated
       */
      setInstrumentationBreakpoint: { params: DOMDebugger.SetInstrumentationBreakpointParams, result: DOMDebugger.SetInstrumentationBreakpointResult }

      /**
       * Sets breakpoint on XMLHttpRequest.
       */
      setXHRBreakpoint: { params: DOMDebugger.SetXHRBreakpointParams, result: DOMDebugger.SetXHRBreakpointResult }
    };
    events: {
    };
  }

  /**
   * Types of the 'DOMDebugger' domain.
   */
  export namespace DOMDebugger {
    /**
     * Parameters of the 'DOMDebugger.getEventListeners' method.
     */
    export interface GetEventListenersParams {
      /**
       * Identifier of the object to return listeners for.
       */
      objectId: CdpV8.Runtime.RemoteObjectId;

      /**
       * The maximum depth at which Node children should be retrieved, defaults to 1. Use -1 for the
       * entire subtree or provide an integer larger than 0.
       */
      depth?: integer;

      /**
       * Whether or not iframes and shadow roots should be traversed when returning the subtree
       * (default is false). Reports listeners for all contexts if pierce is enabled.
       */
      pierce?: boolean;
    }

    /**
     * Return value of the 'DOMDebugger.getEventListeners' method.
     */
    export interface GetEventListenersResult {
      /**
       * Array of relevant listeners.
       */
      listeners: EventListener[];
    }

    /**
     * Parameters of the 'DOMDebugger.removeDOMBreakpoint' method.
     */
    export interface RemoveDOMBreakpointParams {
      /**
       * Identifier of the node to remove breakpoint from.
       */
      nodeId: DOM.NodeId;

      /**
       * Type of the breakpoint to remove.
       */
      type: DOMBreakpointType;
    }

    /**
     * Return value of the 'DOMDebugger.removeDOMBreakpoint' method.
     */
    export interface RemoveDOMBreakpointResult {
    }

    /**
     * Parameters of the 'DOMDebugger.removeEventListenerBreakpoint' method.
     */
    export interface RemoveEventListenerBreakpointParams {
      /**
       * Event name.
       */
      eventName: string;

      /**
       * EventTarget interface name.
       */
      targetName?: string;
    }

    /**
     * Return value of the 'DOMDebugger.removeEventListenerBreakpoint' method.
     */
    export interface RemoveEventListenerBreakpointResult {
    }

    /**
     * Parameters of the 'DOMDebugger.removeInstrumentationBreakpoint' method.
     */
    export interface RemoveInstrumentationBreakpointParams {
      /**
       * Instrumentation name to stop on.
       */
      eventName: string;
    }

    /**
     * Return value of the 'DOMDebugger.removeInstrumentationBreakpoint' method.
     */
    export interface RemoveInstrumentationBreakpointResult {
    }

    /**
     * Parameters of the 'DOMDebugger.removeXHRBreakpoint' method.
     */
    export interface RemoveXHRBreakpointParams {
      /**
       * Resource URL substring.
       */
      url: string;
    }

    /**
     * Return value of the 'DOMDebugger.removeXHRBreakpoint' method.
     */
    export interface RemoveXHRBreakpointResult {
    }

    /**
     * Parameters of the 'DOMDebugger.setBreakOnCSPViolation' method.
     */
    export interface SetBreakOnCSPViolationParams {
      /**
       * CSP Violations to stop upon.
       */
      violationTypes: CSPViolationType[];
    }

    /**
     * Return value of the 'DOMDebugger.setBreakOnCSPViolation' method.
     */
    export interface SetBreakOnCSPViolationResult {
    }

    /**
     * Parameters of the 'DOMDebugger.setDOMBreakpoint' method.
     */
    export interface SetDOMBreakpointParams {
      /**
       * Identifier of the node to set breakpoint on.
       */
      nodeId: DOM.NodeId;

      /**
       * Type of the operation to stop upon.
       */
      type: DOMBreakpointType;
    }

    /**
     * Return value of the 'DOMDebugger.setDOMBreakpoint' method.
     */
    export interface SetDOMBreakpointResult {
    }

    /**
     * Parameters of the 'DOMDebugger.setEventListenerBreakpoint' method.
     */
    export interface SetEventListenerBreakpointParams {
      /**
       * DOM Event name to stop on (any DOM event will do).
       */
      eventName: string;

      /**
       * EventTarget interface name to stop on. If equal to `"*"` or not provided, will stop on any
       * EventTarget.
       */
      targetName?: string;
    }

    /**
     * Return value of the 'DOMDebugger.setEventListenerBreakpoint' method.
     */
    export interface SetEventListenerBreakpointResult {
    }

    /**
     * Parameters of the 'DOMDebugger.setInstrumentationBreakpoint' method.
     */
    export interface SetInstrumentationBreakpointParams {
      /**
       * Instrumentation name to stop on.
       */
      eventName: string;
    }

    /**
     * Return value of the 'DOMDebugger.setInstrumentationBreakpoint' method.
     */
    export interface SetInstrumentationBreakpointResult {
    }

    /**
     * Parameters of the 'DOMDebugger.setXHRBreakpoint' method.
     */
    export interface SetXHRBreakpointParams {
      /**
       * Resource URL substring. All XHRs having this substring in the URL will get stopped upon.
       */
      url: string;
    }

    /**
     * Return value of the 'DOMDebugger.setXHRBreakpoint' method.
     */
    export interface SetXHRBreakpointResult {
    }

    /**
     * DOM breakpoint type.
     */
    export type DOMBreakpointType = 'subtree-modified' | 'attribute-modified' | 'node-removed';

    /**
     * CSP Violation type.
     */
    export type CSPViolationType = 'trustedtype-sink-violation' | 'trustedtype-policy-violation';

    /**
     * Object event listener.
     */
    export interface EventListener {
      /**
       * `EventListener`'s type.
       */
      type: string;

      /**
       * `EventListener`'s useCapture.
       */
      useCapture: boolean;

      /**
       * `EventListener`'s passive flag.
       */
      passive: boolean;

      /**
       * `EventListener`'s once flag.
       */
      once: boolean;

      /**
       * Script id of the handler code.
       */
      scriptId: CdpV8.Runtime.ScriptId;

      /**
       * Line number in the script (0-based).
       */
      lineNumber: integer;

      /**
       * Column number in the script (0-based).
       */
      columnNumber: integer;

      /**
       * Event handler function value.
       */
      handler?: CdpV8.Runtime.RemoteObject;

      /**
       * Event original handler function value.
       */
      originalHandler?: CdpV8.Runtime.RemoteObject;

      /**
       * Node the listener is added to (if any).
       */
      backendNodeId?: DOM.BackendNodeId;
    }
  }

  /**
   * Methods and events of the 'EventBreakpoints' domain.
   */
  export interface EventBreakpointsApi {
    requests: {
      /**
       * Sets breakpoint on particular native event.
       */
      setInstrumentationBreakpoint: { params: EventBreakpoints.SetInstrumentationBreakpointParams, result: EventBreakpoints.SetInstrumentationBreakpointResult }

      /**
       * Removes breakpoint on particular native event.
       */
      removeInstrumentationBreakpoint: { params: EventBreakpoints.RemoveInstrumentationBreakpointParams, result: EventBreakpoints.RemoveInstrumentationBreakpointResult }

      /**
       * Removes all breakpoints
       */
      disable: { params: EventBreakpoints.DisableParams, result: EventBreakpoints.DisableResult }
    };
    events: {
    };
  }

  /**
   * Types of the 'EventBreakpoints' domain.
   */
  export namespace EventBreakpoints {
    /**
     * Parameters of the 'EventBreakpoints.setInstrumentationBreakpoint' method.
     */
    export interface SetInstrumentationBreakpointParams {
      /**
       * Instrumentation name to stop on.
       */
      eventName: string;
    }

    /**
     * Return value of the 'EventBreakpoints.setInstrumentationBreakpoint' method.
     */
    export interface SetInstrumentationBreakpointResult {
    }

    /**
     * Parameters of the 'EventBreakpoints.removeInstrumentationBreakpoint' method.
     */
    export interface RemoveInstrumentationBreakpointParams {
      /**
       * Instrumentation name to stop on.
       */
      eventName: string;
    }

    /**
     * Return value of the 'EventBreakpoints.removeInstrumentationBreakpoint' method.
     */
    export interface RemoveInstrumentationBreakpointResult {
    }

    /**
     * Parameters of the 'EventBreakpoints.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'EventBreakpoints.disable' method.
     */
    export interface DisableResult {
    }
  }

  /**
   * Methods and events of the 'DOMSnapshot' domain.
   */
  export interface DOMSnapshotApi {
    requests: {
      /**
       * Disables DOM snapshot agent for the given page.
       */
      disable: { params: DOMSnapshot.DisableParams, result: DOMSnapshot.DisableResult }

      /**
       * Enables DOM snapshot agent for the given page.
       */
      enable: { params: DOMSnapshot.EnableParams, result: DOMSnapshot.EnableResult }

      /**
       * Returns a document snapshot, including the full DOM tree of the root node (including iframes,
       * template contents, and imported documents) in a flattened array, as well as layout and
       * white-listed computed style information for the nodes. Shadow DOM in the returned DOM tree is
       * flattened.
       * @deprecated
       */
      getSnapshot: { params: DOMSnapshot.GetSnapshotParams, result: DOMSnapshot.GetSnapshotResult }

      /**
       * Returns a document snapshot, including the full DOM tree of the root node (including iframes,
       * template contents, and imported documents) in a flattened array, as well as layout and
       * white-listed computed style information for the nodes. Shadow DOM in the returned DOM tree is
       * flattened.
       */
      captureSnapshot: { params: DOMSnapshot.CaptureSnapshotParams, result: DOMSnapshot.CaptureSnapshotResult }
    };
    events: {
    };
  }

  /**
   * Types of the 'DOMSnapshot' domain.
   */
  export namespace DOMSnapshot {
    /**
     * Parameters of the 'DOMSnapshot.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'DOMSnapshot.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'DOMSnapshot.enable' method.
     */
    export interface EnableParams {
    }

    /**
     * Return value of the 'DOMSnapshot.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'DOMSnapshot.getSnapshot' method.
     */
    export interface GetSnapshotParams {
      /**
       * Whitelist of computed styles to return.
       */
      computedStyleWhitelist: string[];

      /**
       * Whether or not to retrieve details of DOM listeners (default false).
       */
      includeEventListeners?: boolean;

      /**
       * Whether to determine and include the paint order index of LayoutTreeNodes (default false).
       */
      includePaintOrder?: boolean;

      /**
       * Whether to include UA shadow tree in the snapshot (default false).
       */
      includeUserAgentShadowTree?: boolean;
    }

    /**
     * Return value of the 'DOMSnapshot.getSnapshot' method.
     */
    export interface GetSnapshotResult {
      /**
       * The nodes in the DOM tree. The DOMNode at index 0 corresponds to the root document.
       */
      domNodes: DOMNode[];

      /**
       * The nodes in the layout tree.
       */
      layoutTreeNodes: LayoutTreeNode[];

      /**
       * Whitelisted ComputedStyle properties for each node in the layout tree.
       */
      computedStyles: ComputedStyle[];
    }

    /**
     * Parameters of the 'DOMSnapshot.captureSnapshot' method.
     */
    export interface CaptureSnapshotParams {
      /**
       * Whitelist of computed styles to return.
       */
      computedStyles: string[];

      /**
       * Whether to include layout object paint orders into the snapshot.
       */
      includePaintOrder?: boolean;

      /**
       * Whether to include DOM rectangles (offsetRects, clientRects, scrollRects) into the snapshot
       */
      includeDOMRects?: boolean;

      /**
       * Whether to include blended background colors in the snapshot (default: false).
       * Blended background color is achieved by blending background colors of all elements
       * that overlap with the current element.
       */
      includeBlendedBackgroundColors?: boolean;

      /**
       * Whether to include text color opacity in the snapshot (default: false).
       * An element might have the opacity property set that affects the text color of the element.
       * The final text color opacity is computed based on the opacity of all overlapping elements.
       */
      includeTextColorOpacities?: boolean;
    }

    /**
     * Return value of the 'DOMSnapshot.captureSnapshot' method.
     */
    export interface CaptureSnapshotResult {
      /**
       * The nodes in the DOM tree. The DOMNode at index 0 corresponds to the root document.
       */
      documents: DocumentSnapshot[];

      /**
       * Shared string table that all string properties refer to with indexes.
       */
      strings: string[];
    }

    /**
     * A Node in the DOM tree.
     */
    export interface DOMNode {
      /**
       * `Node`'s nodeType.
       */
      nodeType: integer;

      /**
       * `Node`'s nodeName.
       */
      nodeName: string;

      /**
       * `Node`'s nodeValue.
       */
      nodeValue: string;

      /**
       * Only set for textarea elements, contains the text value.
       */
      textValue?: string;

      /**
       * Only set for input elements, contains the input's associated text value.
       */
      inputValue?: string;

      /**
       * Only set for radio and checkbox input elements, indicates if the element has been checked
       */
      inputChecked?: boolean;

      /**
       * Only set for option elements, indicates if the element has been selected
       */
      optionSelected?: boolean;

      /**
       * `Node`'s id, corresponds to DOM.Node.backendNodeId.
       */
      backendNodeId: DOM.BackendNodeId;

      /**
       * The indexes of the node's child nodes in the `domNodes` array returned by `getSnapshot`, if
       * any.
       */
      childNodeIndexes?: integer[];

      /**
       * Attributes of an `Element` node.
       */
      attributes?: NameValue[];

      /**
       * Indexes of pseudo elements associated with this node in the `domNodes` array returned by
       * `getSnapshot`, if any.
       */
      pseudoElementIndexes?: integer[];

      /**
       * The index of the node's related layout tree node in the `layoutTreeNodes` array returned by
       * `getSnapshot`, if any.
       */
      layoutNodeIndex?: integer;

      /**
       * Document URL that `Document` or `FrameOwner` node points to.
       */
      documentURL?: string;

      /**
       * Base URL that `Document` or `FrameOwner` node uses for URL completion.
       */
      baseURL?: string;

      /**
       * Only set for documents, contains the document's content language.
       */
      contentLanguage?: string;

      /**
       * Only set for documents, contains the document's character set encoding.
       */
      documentEncoding?: string;

      /**
       * `DocumentType` node's publicId.
       */
      publicId?: string;

      /**
       * `DocumentType` node's systemId.
       */
      systemId?: string;

      /**
       * Frame ID for frame owner elements and also for the document node.
       */
      frameId?: Page.FrameId;

      /**
       * The index of a frame owner element's content document in the `domNodes` array returned by
       * `getSnapshot`, if any.
       */
      contentDocumentIndex?: integer;

      /**
       * Type of a pseudo element node.
       */
      pseudoType?: DOM.PseudoType;

      /**
       * Shadow root type.
       */
      shadowRootType?: DOM.ShadowRootType;

      /**
       * Whether this DOM node responds to mouse clicks. This includes nodes that have had click
       * event listeners attached via JavaScript as well as anchor tags that naturally navigate when
       * clicked.
       */
      isClickable?: boolean;

      /**
       * Details of the node's event listeners, if any.
       */
      eventListeners?: DOMDebugger.EventListener[];

      /**
       * The selected url for nodes with a srcset attribute.
       */
      currentSourceURL?: string;

      /**
       * The url of the script (if any) that generates this node.
       */
      originURL?: string;

      /**
       * Scroll offsets, set when this node is a Document.
       */
      scrollOffsetX?: number;

      scrollOffsetY?: number;
    }

    /**
     * Details of post layout rendered text positions. The exact layout should not be regarded as
     * stable and may change between versions.
     */
    export interface InlineTextBox {
      /**
       * The bounding box in document coordinates. Note that scroll offset of the document is ignored.
       */
      boundingBox: DOM.Rect;

      /**
       * The starting index in characters, for this post layout textbox substring. Characters that
       * would be represented as a surrogate pair in UTF-16 have length 2.
       */
      startCharacterIndex: integer;

      /**
       * The number of characters in this post layout textbox substring. Characters that would be
       * represented as a surrogate pair in UTF-16 have length 2.
       */
      numCharacters: integer;
    }

    /**
     * Details of an element in the DOM tree with a LayoutObject.
     */
    export interface LayoutTreeNode {
      /**
       * The index of the related DOM node in the `domNodes` array returned by `getSnapshot`.
       */
      domNodeIndex: integer;

      /**
       * The bounding box in document coordinates. Note that scroll offset of the document is ignored.
       */
      boundingBox: DOM.Rect;

      /**
       * Contents of the LayoutText, if any.
       */
      layoutText?: string;

      /**
       * The post-layout inline text nodes, if any.
       */
      inlineTextNodes?: InlineTextBox[];

      /**
       * Index into the `computedStyles` array returned by `getSnapshot`.
       */
      styleIndex?: integer;

      /**
       * Global paint order index, which is determined by the stacking order of the nodes. Nodes
       * that are painted together will have the same index. Only provided if includePaintOrder in
       * getSnapshot was true.
       */
      paintOrder?: integer;

      /**
       * Set to true to indicate the element begins a new stacking context.
       */
      isStackingContext?: boolean;
    }

    /**
     * A subset of the full ComputedStyle as defined by the request whitelist.
     */
    export interface ComputedStyle {
      /**
       * Name/value pairs of computed style properties.
       */
      properties: NameValue[];
    }

    /**
     * A name/value pair.
     */
    export interface NameValue {
      /**
       * Attribute/property name.
       */
      name: string;

      /**
       * Attribute/property value.
       */
      value: string;
    }

    /**
     * Index of the string in the strings table.
     */
    export type StringIndex = integer;

    /**
     * Index of the string in the strings table.
     */
    export type ArrayOfStrings = StringIndex[];

    /**
     * Data that is only present on rare nodes.
     */
    export interface RareStringData {
      index: integer[];

      value: StringIndex[];
    }

    export interface RareBooleanData {
      index: integer[];
    }

    export interface RareIntegerData {
      index: integer[];

      value: integer[];
    }

    export type Rectangle = number[];

    /**
     * Document snapshot.
     */
    export interface DocumentSnapshot {
      /**
       * Document URL that `Document` or `FrameOwner` node points to.
       */
      documentURL: StringIndex;

      /**
       * Document title.
       */
      title: StringIndex;

      /**
       * Base URL that `Document` or `FrameOwner` node uses for URL completion.
       */
      baseURL: StringIndex;

      /**
       * Contains the document's content language.
       */
      contentLanguage: StringIndex;

      /**
       * Contains the document's character set encoding.
       */
      encodingName: StringIndex;

      /**
       * `DocumentType` node's publicId.
       */
      publicId: StringIndex;

      /**
       * `DocumentType` node's systemId.
       */
      systemId: StringIndex;

      /**
       * Frame ID for frame owner elements and also for the document node.
       */
      frameId: StringIndex;

      /**
       * A table with dom nodes.
       */
      nodes: NodeTreeSnapshot;

      /**
       * The nodes in the layout tree.
       */
      layout: LayoutTreeSnapshot;

      /**
       * The post-layout inline text nodes.
       */
      textBoxes: TextBoxSnapshot;

      /**
       * Horizontal scroll offset.
       */
      scrollOffsetX?: number;

      /**
       * Vertical scroll offset.
       */
      scrollOffsetY?: number;

      /**
       * Document content width.
       */
      contentWidth?: number;

      /**
       * Document content height.
       */
      contentHeight?: number;
    }

    /**
     * Table containing nodes.
     */
    export interface NodeTreeSnapshot {
      /**
       * Parent node index.
       */
      parentIndex?: integer[];

      /**
       * `Node`'s nodeType.
       */
      nodeType?: integer[];

      /**
       * Type of the shadow root the `Node` is in. String values are equal to the `ShadowRootType` enum.
       */
      shadowRootType?: RareStringData;

      /**
       * `Node`'s nodeName.
       */
      nodeName?: StringIndex[];

      /**
       * `Node`'s nodeValue.
       */
      nodeValue?: StringIndex[];

      /**
       * `Node`'s id, corresponds to DOM.Node.backendNodeId.
       */
      backendNodeId?: DOM.BackendNodeId[];

      /**
       * Attributes of an `Element` node. Flatten name, value pairs.
       */
      attributes?: ArrayOfStrings[];

      /**
       * Only set for textarea elements, contains the text value.
       */
      textValue?: RareStringData;

      /**
       * Only set for input elements, contains the input's associated text value.
       */
      inputValue?: RareStringData;

      /**
       * Only set for radio and checkbox input elements, indicates if the element has been checked
       */
      inputChecked?: RareBooleanData;

      /**
       * Only set for option elements, indicates if the element has been selected
       */
      optionSelected?: RareBooleanData;

      /**
       * The index of the document in the list of the snapshot documents.
       */
      contentDocumentIndex?: RareIntegerData;

      /**
       * Type of a pseudo element node.
       */
      pseudoType?: RareStringData;

      /**
       * Pseudo element identifier for this node. Only present if there is a
       * valid pseudoType.
       */
      pseudoIdentifier?: RareStringData;

      /**
       * Whether this DOM node responds to mouse clicks. This includes nodes that have had click
       * event listeners attached via JavaScript as well as anchor tags that naturally navigate when
       * clicked.
       */
      isClickable?: RareBooleanData;

      /**
       * The selected url for nodes with a srcset attribute.
       */
      currentSourceURL?: RareStringData;

      /**
       * The url of the script (if any) that generates this node.
       */
      originURL?: RareStringData;
    }

    /**
     * Table of details of an element in the DOM tree with a LayoutObject.
     */
    export interface LayoutTreeSnapshot {
      /**
       * Index of the corresponding node in the `NodeTreeSnapshot` array returned by `captureSnapshot`.
       */
      nodeIndex: integer[];

      /**
       * Array of indexes specifying computed style strings, filtered according to the `computedStyles` parameter passed to `captureSnapshot`.
       */
      styles: ArrayOfStrings[];

      /**
       * The absolute position bounding box.
       */
      bounds: Rectangle[];

      /**
       * Contents of the LayoutText, if any.
       */
      text: StringIndex[];

      /**
       * Stacking context information.
       */
      stackingContexts: RareBooleanData;

      /**
       * Global paint order index, which is determined by the stacking order of the nodes. Nodes
       * that are painted together will have the same index. Only provided if includePaintOrder in
       * captureSnapshot was true.
       */
      paintOrders?: integer[];

      /**
       * The offset rect of nodes. Only available when includeDOMRects is set to true
       */
      offsetRects?: Rectangle[];

      /**
       * The scroll rect of nodes. Only available when includeDOMRects is set to true
       */
      scrollRects?: Rectangle[];

      /**
       * The client rect of nodes. Only available when includeDOMRects is set to true
       */
      clientRects?: Rectangle[];

      /**
       * The list of background colors that are blended with colors of overlapping elements.
       */
      blendedBackgroundColors?: StringIndex[];

      /**
       * The list of computed text opacities.
       */
      textColorOpacities?: number[];
    }

    /**
     * Table of details of the post layout rendered text positions. The exact layout should not be regarded as
     * stable and may change between versions.
     */
    export interface TextBoxSnapshot {
      /**
       * Index of the layout tree node that owns this box collection.
       */
      layoutIndex: integer[];

      /**
       * The absolute position bounding box.
       */
      bounds: Rectangle[];

      /**
       * The starting index in characters, for this post layout textbox substring. Characters that
       * would be represented as a surrogate pair in UTF-16 have length 2.
       */
      start: integer[];

      /**
       * The number of characters in this post layout textbox substring. Characters that would be
       * represented as a surrogate pair in UTF-16 have length 2.
       */
      length: integer[];
    }
  }

  /**
   * Methods and events of the 'DOMStorage' domain.
   */
  export interface DOMStorageApi {
    requests: {
      clear: { params: DOMStorage.ClearParams, result: DOMStorage.ClearResult }

      /**
       * Disables storage tracking, prevents storage events from being sent to the client.
       */
      disable: { params: DOMStorage.DisableParams, result: DOMStorage.DisableResult }

      /**
       * Enables storage tracking, storage events will now be delivered to the client.
       */
      enable: { params: DOMStorage.EnableParams, result: DOMStorage.EnableResult }

      getDOMStorageItems: { params: DOMStorage.GetDOMStorageItemsParams, result: DOMStorage.GetDOMStorageItemsResult }

      removeDOMStorageItem: { params: DOMStorage.RemoveDOMStorageItemParams, result: DOMStorage.RemoveDOMStorageItemResult }

      setDOMStorageItem: { params: DOMStorage.SetDOMStorageItemParams, result: DOMStorage.SetDOMStorageItemResult }
    };
    events: {

      domStorageItemAdded: { params: DOMStorage.DomStorageItemAddedEvent };

      domStorageItemRemoved: { params: DOMStorage.DomStorageItemRemovedEvent };

      domStorageItemUpdated: { params: DOMStorage.DomStorageItemUpdatedEvent };

      domStorageItemsCleared: { params: DOMStorage.DomStorageItemsClearedEvent };
    };
  }

  /**
   * Types of the 'DOMStorage' domain.
   */
  export namespace DOMStorage {
    /**
     * Parameters of the 'DOMStorage.clear' method.
     */
    export interface ClearParams {
      storageId: StorageId;
    }

    /**
     * Return value of the 'DOMStorage.clear' method.
     */
    export interface ClearResult {
    }

    /**
     * Parameters of the 'DOMStorage.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'DOMStorage.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'DOMStorage.enable' method.
     */
    export interface EnableParams {
    }

    /**
     * Return value of the 'DOMStorage.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'DOMStorage.getDOMStorageItems' method.
     */
    export interface GetDOMStorageItemsParams {
      storageId: StorageId;
    }

    /**
     * Return value of the 'DOMStorage.getDOMStorageItems' method.
     */
    export interface GetDOMStorageItemsResult {
      entries: Item[];
    }

    /**
     * Parameters of the 'DOMStorage.removeDOMStorageItem' method.
     */
    export interface RemoveDOMStorageItemParams {
      storageId: StorageId;

      key: string;
    }

    /**
     * Return value of the 'DOMStorage.removeDOMStorageItem' method.
     */
    export interface RemoveDOMStorageItemResult {
    }

    /**
     * Parameters of the 'DOMStorage.setDOMStorageItem' method.
     */
    export interface SetDOMStorageItemParams {
      storageId: StorageId;

      key: string;

      value: string;
    }

    /**
     * Return value of the 'DOMStorage.setDOMStorageItem' method.
     */
    export interface SetDOMStorageItemResult {
    }

    /**
     * Parameters of the 'DOMStorage.domStorageItemAdded' event.
     */
    export interface DomStorageItemAddedEvent {
      storageId: StorageId;

      key: string;

      newValue: string;
    }

    /**
     * Parameters of the 'DOMStorage.domStorageItemRemoved' event.
     */
    export interface DomStorageItemRemovedEvent {
      storageId: StorageId;

      key: string;
    }

    /**
     * Parameters of the 'DOMStorage.domStorageItemUpdated' event.
     */
    export interface DomStorageItemUpdatedEvent {
      storageId: StorageId;

      key: string;

      oldValue: string;

      newValue: string;
    }

    /**
     * Parameters of the 'DOMStorage.domStorageItemsCleared' event.
     */
    export interface DomStorageItemsClearedEvent {
      storageId: StorageId;
    }

    export type SerializedStorageKey = string;

    /**
     * DOM Storage identifier.
     */
    export interface StorageId {
      /**
       * Security origin for the storage.
       */
      securityOrigin?: string;

      /**
       * Represents a key by which DOM Storage keys its CachedStorageAreas
       */
      storageKey?: SerializedStorageKey;

      /**
       * Whether the storage is local storage (not session storage).
       */
      isLocalStorage: boolean;
    }

    /**
     * DOM Storage item.
     */
    export type Item = string[];
  }

  /**
   * Methods and events of the 'Database' domain.
   */
  export interface DatabaseApi {
    requests: {
      /**
       * Disables database tracking, prevents database events from being sent to the client.
       */
      disable: { params: Database.DisableParams, result: Database.DisableResult }

      /**
       * Enables database tracking, database events will now be delivered to the client.
       */
      enable: { params: Database.EnableParams, result: Database.EnableResult }

      executeSQL: { params: Database.ExecuteSQLParams, result: Database.ExecuteSQLResult }

      getDatabaseTableNames: { params: Database.GetDatabaseTableNamesParams, result: Database.GetDatabaseTableNamesResult }
    };
    events: {

      addDatabase: { params: Database.AddDatabaseEvent };
    };
  }

  /**
   * Types of the 'Database' domain.
   */
  export namespace Database {
    /**
     * Parameters of the 'Database.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'Database.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'Database.enable' method.
     */
    export interface EnableParams {
    }

    /**
     * Return value of the 'Database.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'Database.executeSQL' method.
     */
    export interface ExecuteSQLParams {
      databaseId: DatabaseId;

      query: string;
    }

    /**
     * Return value of the 'Database.executeSQL' method.
     */
    export interface ExecuteSQLResult {
      columnNames?: string[];

      values?: any[];

      sqlError?: Error;
    }

    /**
     * Parameters of the 'Database.getDatabaseTableNames' method.
     */
    export interface GetDatabaseTableNamesParams {
      databaseId: DatabaseId;
    }

    /**
     * Return value of the 'Database.getDatabaseTableNames' method.
     */
    export interface GetDatabaseTableNamesResult {
      tableNames: string[];
    }

    /**
     * Parameters of the 'Database.addDatabase' event.
     */
    export interface AddDatabaseEvent {
      database: Database;
    }

    /**
     * Unique identifier of Database object.
     */
    export type DatabaseId = string;

    /**
     * Database object.
     */
    export interface Database {
      /**
       * Database ID.
       */
      id: DatabaseId;

      /**
       * Database domain.
       */
      domain: string;

      /**
       * Database name.
       */
      name: string;

      /**
       * Database version.
       */
      version: string;
    }

    /**
     * Database error.
     */
    export interface Error {
      /**
       * Error message.
       */
      message: string;

      /**
       * Error code.
       */
      code: integer;
    }
  }

  /**
   * Methods and events of the 'DeviceOrientation' domain.
   */
  export interface DeviceOrientationApi {
    requests: {
      /**
       * Clears the overridden Device Orientation.
       */
      clearDeviceOrientationOverride: { params: DeviceOrientation.ClearDeviceOrientationOverrideParams, result: DeviceOrientation.ClearDeviceOrientationOverrideResult }

      /**
       * Overrides the Device Orientation.
       */
      setDeviceOrientationOverride: { params: DeviceOrientation.SetDeviceOrientationOverrideParams, result: DeviceOrientation.SetDeviceOrientationOverrideResult }
    };
    events: {
    };
  }

  /**
   * Types of the 'DeviceOrientation' domain.
   */
  export namespace DeviceOrientation {
    /**
     * Parameters of the 'DeviceOrientation.clearDeviceOrientationOverride' method.
     */
    export interface ClearDeviceOrientationOverrideParams {
    }

    /**
     * Return value of the 'DeviceOrientation.clearDeviceOrientationOverride' method.
     */
    export interface ClearDeviceOrientationOverrideResult {
    }

    /**
     * Parameters of the 'DeviceOrientation.setDeviceOrientationOverride' method.
     */
    export interface SetDeviceOrientationOverrideParams {
      /**
       * Mock alpha
       */
      alpha: number;

      /**
       * Mock beta
       */
      beta: number;

      /**
       * Mock gamma
       */
      gamma: number;
    }

    /**
     * Return value of the 'DeviceOrientation.setDeviceOrientationOverride' method.
     */
    export interface SetDeviceOrientationOverrideResult {
    }
  }

  /**
   * Methods and events of the 'Emulation' domain.
   */
  export interface EmulationApi {
    requests: {
      /**
       * Tells whether emulation is supported.
       */
      canEmulate: { params: Emulation.CanEmulateParams, result: Emulation.CanEmulateResult }

      /**
       * Clears the overridden device metrics.
       */
      clearDeviceMetricsOverride: { params: Emulation.ClearDeviceMetricsOverrideParams, result: Emulation.ClearDeviceMetricsOverrideResult }

      /**
       * Clears the overridden Geolocation Position and Error.
       */
      clearGeolocationOverride: { params: Emulation.ClearGeolocationOverrideParams, result: Emulation.ClearGeolocationOverrideResult }

      /**
       * Requests that page scale factor is reset to initial values.
       */
      resetPageScaleFactor: { params: Emulation.ResetPageScaleFactorParams, result: Emulation.ResetPageScaleFactorResult }

      /**
       * Enables or disables simulating a focused and active page.
       */
      setFocusEmulationEnabled: { params: Emulation.SetFocusEmulationEnabledParams, result: Emulation.SetFocusEmulationEnabledResult }

      /**
       * Automatically render all web contents using a dark theme.
       */
      setAutoDarkModeOverride: { params: Emulation.SetAutoDarkModeOverrideParams, result: Emulation.SetAutoDarkModeOverrideResult }

      /**
       * Enables CPU throttling to emulate slow CPUs.
       */
      setCPUThrottlingRate: { params: Emulation.SetCPUThrottlingRateParams, result: Emulation.SetCPUThrottlingRateResult }

      /**
       * Sets or clears an override of the default background color of the frame. This override is used
       * if the content does not specify one.
       */
      setDefaultBackgroundColorOverride: { params: Emulation.SetDefaultBackgroundColorOverrideParams, result: Emulation.SetDefaultBackgroundColorOverrideResult }

      /**
       * Overrides the values of device screen dimensions (window.screen.width, window.screen.height,
       * window.innerWidth, window.innerHeight, and "device-width"/"device-height"-related CSS media
       * query results).
       */
      setDeviceMetricsOverride: { params: Emulation.SetDeviceMetricsOverrideParams, result: Emulation.SetDeviceMetricsOverrideResult }

      setScrollbarsHidden: { params: Emulation.SetScrollbarsHiddenParams, result: Emulation.SetScrollbarsHiddenResult }

      setDocumentCookieDisabled: { params: Emulation.SetDocumentCookieDisabledParams, result: Emulation.SetDocumentCookieDisabledResult }

      setEmitTouchEventsForMouse: { params: Emulation.SetEmitTouchEventsForMouseParams, result: Emulation.SetEmitTouchEventsForMouseResult }

      /**
       * Emulates the given media type or media feature for CSS media queries.
       */
      setEmulatedMedia: { params: Emulation.SetEmulatedMediaParams, result: Emulation.SetEmulatedMediaResult }

      /**
       * Emulates the given vision deficiency.
       */
      setEmulatedVisionDeficiency: { params: Emulation.SetEmulatedVisionDeficiencyParams, result: Emulation.SetEmulatedVisionDeficiencyResult }

      /**
       * Overrides the Geolocation Position or Error. Omitting any of the parameters emulates position
       * unavailable.
       */
      setGeolocationOverride: { params: Emulation.SetGeolocationOverrideParams, result: Emulation.SetGeolocationOverrideResult }

      getOverriddenSensorInformation: { params: Emulation.GetOverriddenSensorInformationParams, result: Emulation.GetOverriddenSensorInformationResult }

      /**
       * Overrides a platform sensor of a given type. If |enabled| is true, calls to
       * Sensor.start() will use a virtual sensor as backend rather than fetching
       * data from a real hardware sensor. Otherwise, existing virtual
       * sensor-backend Sensor objects will fire an error event and new calls to
       * Sensor.start() will attempt to use a real sensor instead.
       */
      setSensorOverrideEnabled: { params: Emulation.SetSensorOverrideEnabledParams, result: Emulation.SetSensorOverrideEnabledResult }

      /**
       * Updates the sensor readings reported by a sensor type previously overriden
       * by setSensorOverrideEnabled.
       */
      setSensorOverrideReadings: { params: Emulation.SetSensorOverrideReadingsParams, result: Emulation.SetSensorOverrideReadingsResult }

      /**
       * Overrides the Idle state.
       */
      setIdleOverride: { params: Emulation.SetIdleOverrideParams, result: Emulation.SetIdleOverrideResult }

      /**
       * Clears Idle state overrides.
       */
      clearIdleOverride: { params: Emulation.ClearIdleOverrideParams, result: Emulation.ClearIdleOverrideResult }

      /**
       * Overrides value returned by the javascript navigator object.
       * @deprecated
       */
      setNavigatorOverrides: { params: Emulation.SetNavigatorOverridesParams, result: Emulation.SetNavigatorOverridesResult }

      /**
       * Sets a specified page scale factor.
       */
      setPageScaleFactor: { params: Emulation.SetPageScaleFactorParams, result: Emulation.SetPageScaleFactorResult }

      /**
       * Switches script execution in the page.
       */
      setScriptExecutionDisabled: { params: Emulation.SetScriptExecutionDisabledParams, result: Emulation.SetScriptExecutionDisabledResult }

      /**
       * Enables touch on platforms which do not support them.
       */
      setTouchEmulationEnabled: { params: Emulation.SetTouchEmulationEnabledParams, result: Emulation.SetTouchEmulationEnabledResult }

      /**
       * Turns on virtual time for all frames (replacing real-time with a synthetic time source) and sets
       * the current virtual time policy.  Note this supersedes any previous time budget.
       */
      setVirtualTimePolicy: { params: Emulation.SetVirtualTimePolicyParams, result: Emulation.SetVirtualTimePolicyResult }

      /**
       * Overrides default host system locale with the specified one.
       */
      setLocaleOverride: { params: Emulation.SetLocaleOverrideParams, result: Emulation.SetLocaleOverrideResult }

      /**
       * Overrides default host system timezone with the specified one.
       */
      setTimezoneOverride: { params: Emulation.SetTimezoneOverrideParams, result: Emulation.SetTimezoneOverrideResult }

      /**
       * Resizes the frame/viewport of the page. Note that this does not affect the frame's container
       * (e.g. browser window). Can be used to produce screenshots of the specified size. Not supported
       * on Android.
       * @deprecated
       */
      setVisibleSize: { params: Emulation.SetVisibleSizeParams, result: Emulation.SetVisibleSizeResult }

      setDisabledImageTypes: { params: Emulation.SetDisabledImageTypesParams, result: Emulation.SetDisabledImageTypesResult }

      setHardwareConcurrencyOverride: { params: Emulation.SetHardwareConcurrencyOverrideParams, result: Emulation.SetHardwareConcurrencyOverrideResult }

      /**
       * Allows overriding user agent with the given string.
       */
      setUserAgentOverride: { params: Emulation.SetUserAgentOverrideParams, result: Emulation.SetUserAgentOverrideResult }

      /**
       * Allows overriding the automation flag.
       */
      setAutomationOverride: { params: Emulation.SetAutomationOverrideParams, result: Emulation.SetAutomationOverrideResult }
    };
    events: {

      /**
       * Notification sent after the virtual time budget for the current VirtualTimePolicy has run out.
       */
      virtualTimeBudgetExpired: { params: Emulation.VirtualTimeBudgetExpiredEvent };
    };
  }

  /**
   * Types of the 'Emulation' domain.
   */
  export namespace Emulation {
    /**
     * Parameters of the 'Emulation.canEmulate' method.
     */
    export interface CanEmulateParams {
    }

    /**
     * Return value of the 'Emulation.canEmulate' method.
     */
    export interface CanEmulateResult {
      /**
       * True if emulation is supported.
       */
      result: boolean;
    }

    /**
     * Parameters of the 'Emulation.clearDeviceMetricsOverride' method.
     */
    export interface ClearDeviceMetricsOverrideParams {
    }

    /**
     * Return value of the 'Emulation.clearDeviceMetricsOverride' method.
     */
    export interface ClearDeviceMetricsOverrideResult {
    }

    /**
     * Parameters of the 'Emulation.clearGeolocationOverride' method.
     */
    export interface ClearGeolocationOverrideParams {
    }

    /**
     * Return value of the 'Emulation.clearGeolocationOverride' method.
     */
    export interface ClearGeolocationOverrideResult {
    }

    /**
     * Parameters of the 'Emulation.resetPageScaleFactor' method.
     */
    export interface ResetPageScaleFactorParams {
    }

    /**
     * Return value of the 'Emulation.resetPageScaleFactor' method.
     */
    export interface ResetPageScaleFactorResult {
    }

    /**
     * Parameters of the 'Emulation.setFocusEmulationEnabled' method.
     */
    export interface SetFocusEmulationEnabledParams {
      /**
       * Whether to enable to disable focus emulation.
       */
      enabled: boolean;
    }

    /**
     * Return value of the 'Emulation.setFocusEmulationEnabled' method.
     */
    export interface SetFocusEmulationEnabledResult {
    }

    /**
     * Parameters of the 'Emulation.setAutoDarkModeOverride' method.
     */
    export interface SetAutoDarkModeOverrideParams {
      /**
       * Whether to enable or disable automatic dark mode.
       * If not specified, any existing override will be cleared.
       */
      enabled?: boolean;
    }

    /**
     * Return value of the 'Emulation.setAutoDarkModeOverride' method.
     */
    export interface SetAutoDarkModeOverrideResult {
    }

    /**
     * Parameters of the 'Emulation.setCPUThrottlingRate' method.
     */
    export interface SetCPUThrottlingRateParams {
      /**
       * Throttling rate as a slowdown factor (1 is no throttle, 2 is 2x slowdown, etc).
       */
      rate: number;
    }

    /**
     * Return value of the 'Emulation.setCPUThrottlingRate' method.
     */
    export interface SetCPUThrottlingRateResult {
    }

    /**
     * Parameters of the 'Emulation.setDefaultBackgroundColorOverride' method.
     */
    export interface SetDefaultBackgroundColorOverrideParams {
      /**
       * RGBA of the default background color. If not specified, any existing override will be
       * cleared.
       */
      color?: DOM.RGBA;
    }

    /**
     * Return value of the 'Emulation.setDefaultBackgroundColorOverride' method.
     */
    export interface SetDefaultBackgroundColorOverrideResult {
    }

    /**
     * Parameters of the 'Emulation.setDeviceMetricsOverride' method.
     */
    export interface SetDeviceMetricsOverrideParams {
      /**
       * Overriding width value in pixels (minimum 0, maximum 10000000). 0 disables the override.
       */
      width: integer;

      /**
       * Overriding height value in pixels (minimum 0, maximum 10000000). 0 disables the override.
       */
      height: integer;

      /**
       * Overriding device scale factor value. 0 disables the override.
       */
      deviceScaleFactor: number;

      /**
       * Whether to emulate mobile device. This includes viewport meta tag, overlay scrollbars, text
       * autosizing and more.
       */
      mobile: boolean;

      /**
       * Scale to apply to resulting view image.
       */
      scale?: number;

      /**
       * Overriding screen width value in pixels (minimum 0, maximum 10000000).
       */
      screenWidth?: integer;

      /**
       * Overriding screen height value in pixels (minimum 0, maximum 10000000).
       */
      screenHeight?: integer;

      /**
       * Overriding view X position on screen in pixels (minimum 0, maximum 10000000).
       */
      positionX?: integer;

      /**
       * Overriding view Y position on screen in pixels (minimum 0, maximum 10000000).
       */
      positionY?: integer;

      /**
       * Do not set visible view size, rely upon explicit setVisibleSize call.
       */
      dontSetVisibleSize?: boolean;

      /**
       * Screen orientation override.
       */
      screenOrientation?: ScreenOrientation;

      /**
       * If set, the visible area of the page will be overridden to this viewport. This viewport
       * change is not observed by the page, e.g. viewport-relative elements do not change positions.
       */
      viewport?: Page.Viewport;

      /**
       * If set, the display feature of a multi-segment screen. If not set, multi-segment support
       * is turned-off.
       */
      displayFeature?: DisplayFeature;

      /**
       * If set, the posture of a foldable device. If not set the posture is set
       * to continuous.
       */
      devicePosture?: DevicePosture;
    }

    /**
     * Return value of the 'Emulation.setDeviceMetricsOverride' method.
     */
    export interface SetDeviceMetricsOverrideResult {
    }

    /**
     * Parameters of the 'Emulation.setScrollbarsHidden' method.
     */
    export interface SetScrollbarsHiddenParams {
      /**
       * Whether scrollbars should be always hidden.
       */
      hidden: boolean;
    }

    /**
     * Return value of the 'Emulation.setScrollbarsHidden' method.
     */
    export interface SetScrollbarsHiddenResult {
    }

    /**
     * Parameters of the 'Emulation.setDocumentCookieDisabled' method.
     */
    export interface SetDocumentCookieDisabledParams {
      /**
       * Whether document.coookie API should be disabled.
       */
      disabled: boolean;
    }

    /**
     * Return value of the 'Emulation.setDocumentCookieDisabled' method.
     */
    export interface SetDocumentCookieDisabledResult {
    }

    /**
     * Parameters of the 'Emulation.setEmitTouchEventsForMouse' method.
     */
    export interface SetEmitTouchEventsForMouseParams {
      /**
       * Whether touch emulation based on mouse input should be enabled.
       */
      enabled: boolean;

      /**
       * Touch/gesture events configuration. Default: current platform.
       */
      configuration?: 'mobile' | 'desktop';
    }

    /**
     * Return value of the 'Emulation.setEmitTouchEventsForMouse' method.
     */
    export interface SetEmitTouchEventsForMouseResult {
    }

    /**
     * Parameters of the 'Emulation.setEmulatedMedia' method.
     */
    export interface SetEmulatedMediaParams {
      /**
       * Media type to emulate. Empty string disables the override.
       */
      media?: string;

      /**
       * Media features to emulate.
       */
      features?: MediaFeature[];
    }

    /**
     * Return value of the 'Emulation.setEmulatedMedia' method.
     */
    export interface SetEmulatedMediaResult {
    }

    /**
     * Parameters of the 'Emulation.setEmulatedVisionDeficiency' method.
     */
    export interface SetEmulatedVisionDeficiencyParams {
      /**
       * Vision deficiency to emulate. Order: best-effort emulations come first, followed by any
       * physiologically accurate emulations for medically recognized color vision deficiencies.
       */
      type: 'none' | 'blurredVision' | 'reducedContrast' | 'achromatopsia' | 'deuteranopia' | 'protanopia' | 'tritanopia';
    }

    /**
     * Return value of the 'Emulation.setEmulatedVisionDeficiency' method.
     */
    export interface SetEmulatedVisionDeficiencyResult {
    }

    /**
     * Parameters of the 'Emulation.setGeolocationOverride' method.
     */
    export interface SetGeolocationOverrideParams {
      /**
       * Mock latitude
       */
      latitude?: number;

      /**
       * Mock longitude
       */
      longitude?: number;

      /**
       * Mock accuracy
       */
      accuracy?: number;
    }

    /**
     * Return value of the 'Emulation.setGeolocationOverride' method.
     */
    export interface SetGeolocationOverrideResult {
    }

    /**
     * Parameters of the 'Emulation.getOverriddenSensorInformation' method.
     */
    export interface GetOverriddenSensorInformationParams {
      type: SensorType;
    }

    /**
     * Return value of the 'Emulation.getOverriddenSensorInformation' method.
     */
    export interface GetOverriddenSensorInformationResult {
      requestedSamplingFrequency: number;
    }

    /**
     * Parameters of the 'Emulation.setSensorOverrideEnabled' method.
     */
    export interface SetSensorOverrideEnabledParams {
      enabled: boolean;

      type: SensorType;

      metadata?: SensorMetadata;
    }

    /**
     * Return value of the 'Emulation.setSensorOverrideEnabled' method.
     */
    export interface SetSensorOverrideEnabledResult {
    }

    /**
     * Parameters of the 'Emulation.setSensorOverrideReadings' method.
     */
    export interface SetSensorOverrideReadingsParams {
      type: SensorType;

      reading: SensorReading;
    }

    /**
     * Return value of the 'Emulation.setSensorOverrideReadings' method.
     */
    export interface SetSensorOverrideReadingsResult {
    }

    /**
     * Parameters of the 'Emulation.setIdleOverride' method.
     */
    export interface SetIdleOverrideParams {
      /**
       * Mock isUserActive
       */
      isUserActive: boolean;

      /**
       * Mock isScreenUnlocked
       */
      isScreenUnlocked: boolean;
    }

    /**
     * Return value of the 'Emulation.setIdleOverride' method.
     */
    export interface SetIdleOverrideResult {
    }

    /**
     * Parameters of the 'Emulation.clearIdleOverride' method.
     */
    export interface ClearIdleOverrideParams {
    }

    /**
     * Return value of the 'Emulation.clearIdleOverride' method.
     */
    export interface ClearIdleOverrideResult {
    }

    /**
     * Parameters of the 'Emulation.setNavigatorOverrides' method.
     */
    export interface SetNavigatorOverridesParams {
      /**
       * The platform navigator.platform should return.
       */
      platform: string;
    }

    /**
     * Return value of the 'Emulation.setNavigatorOverrides' method.
     */
    export interface SetNavigatorOverridesResult {
    }

    /**
     * Parameters of the 'Emulation.setPageScaleFactor' method.
     */
    export interface SetPageScaleFactorParams {
      /**
       * Page scale factor.
       */
      pageScaleFactor: number;
    }

    /**
     * Return value of the 'Emulation.setPageScaleFactor' method.
     */
    export interface SetPageScaleFactorResult {
    }

    /**
     * Parameters of the 'Emulation.setScriptExecutionDisabled' method.
     */
    export interface SetScriptExecutionDisabledParams {
      /**
       * Whether script execution should be disabled in the page.
       */
      value: boolean;
    }

    /**
     * Return value of the 'Emulation.setScriptExecutionDisabled' method.
     */
    export interface SetScriptExecutionDisabledResult {
    }

    /**
     * Parameters of the 'Emulation.setTouchEmulationEnabled' method.
     */
    export interface SetTouchEmulationEnabledParams {
      /**
       * Whether the touch event emulation should be enabled.
       */
      enabled: boolean;

      /**
       * Maximum touch points supported. Defaults to one.
       */
      maxTouchPoints?: integer;
    }

    /**
     * Return value of the 'Emulation.setTouchEmulationEnabled' method.
     */
    export interface SetTouchEmulationEnabledResult {
    }

    /**
     * Parameters of the 'Emulation.setVirtualTimePolicy' method.
     */
    export interface SetVirtualTimePolicyParams {
      policy: VirtualTimePolicy;

      /**
       * If set, after this many virtual milliseconds have elapsed virtual time will be paused and a
       * virtualTimeBudgetExpired event is sent.
       */
      budget?: number;

      /**
       * If set this specifies the maximum number of tasks that can be run before virtual is forced
       * forwards to prevent deadlock.
       */
      maxVirtualTimeTaskStarvationCount?: integer;

      /**
       * If set, base::Time::Now will be overridden to initially return this value.
       */
      initialVirtualTime?: Network.TimeSinceEpoch;
    }

    /**
     * Return value of the 'Emulation.setVirtualTimePolicy' method.
     */
    export interface SetVirtualTimePolicyResult {
      /**
       * Absolute timestamp at which virtual time was first enabled (up time in milliseconds).
       */
      virtualTimeTicksBase: number;
    }

    /**
     * Parameters of the 'Emulation.setLocaleOverride' method.
     */
    export interface SetLocaleOverrideParams {
      /**
       * ICU style C locale (e.g. "en_US"). If not specified or empty, disables the override and
       * restores default host system locale.
       */
      locale?: string;
    }

    /**
     * Return value of the 'Emulation.setLocaleOverride' method.
     */
    export interface SetLocaleOverrideResult {
    }

    /**
     * Parameters of the 'Emulation.setTimezoneOverride' method.
     */
    export interface SetTimezoneOverrideParams {
      /**
       * The timezone identifier. If empty, disables the override and
       * restores default host system timezone.
       */
      timezoneId: string;
    }

    /**
     * Return value of the 'Emulation.setTimezoneOverride' method.
     */
    export interface SetTimezoneOverrideResult {
    }

    /**
     * Parameters of the 'Emulation.setVisibleSize' method.
     */
    export interface SetVisibleSizeParams {
      /**
       * Frame width (DIP).
       */
      width: integer;

      /**
       * Frame height (DIP).
       */
      height: integer;
    }

    /**
     * Return value of the 'Emulation.setVisibleSize' method.
     */
    export interface SetVisibleSizeResult {
    }

    /**
     * Parameters of the 'Emulation.setDisabledImageTypes' method.
     */
    export interface SetDisabledImageTypesParams {
      /**
       * Image types to disable.
       */
      imageTypes: DisabledImageType[];
    }

    /**
     * Return value of the 'Emulation.setDisabledImageTypes' method.
     */
    export interface SetDisabledImageTypesResult {
    }

    /**
     * Parameters of the 'Emulation.setHardwareConcurrencyOverride' method.
     */
    export interface SetHardwareConcurrencyOverrideParams {
      /**
       * Hardware concurrency to report
       */
      hardwareConcurrency: integer;
    }

    /**
     * Return value of the 'Emulation.setHardwareConcurrencyOverride' method.
     */
    export interface SetHardwareConcurrencyOverrideResult {
    }

    /**
     * Parameters of the 'Emulation.setUserAgentOverride' method.
     */
    export interface SetUserAgentOverrideParams {
      /**
       * User agent to use.
       */
      userAgent: string;

      /**
       * Browser language to emulate.
       */
      acceptLanguage?: string;

      /**
       * The platform navigator.platform should return.
       */
      platform?: string;

      /**
       * To be sent in Sec-CH-UA-* headers and returned in navigator.userAgentData
       */
      userAgentMetadata?: UserAgentMetadata;
    }

    /**
     * Return value of the 'Emulation.setUserAgentOverride' method.
     */
    export interface SetUserAgentOverrideResult {
    }

    /**
     * Parameters of the 'Emulation.setAutomationOverride' method.
     */
    export interface SetAutomationOverrideParams {
      /**
       * Whether the override should be enabled.
       */
      enabled: boolean;
    }

    /**
     * Return value of the 'Emulation.setAutomationOverride' method.
     */
    export interface SetAutomationOverrideResult {
    }

    /**
     * Parameters of the 'Emulation.virtualTimeBudgetExpired' event.
     */
    export interface VirtualTimeBudgetExpiredEvent {
    }

    /**
     * Screen orientation.
     */
    export interface ScreenOrientation {
      /**
       * Orientation type.
       */
      type: 'portraitPrimary' | 'portraitSecondary' | 'landscapePrimary' | 'landscapeSecondary';

      /**
       * Orientation angle.
       */
      angle: integer;
    }

    export interface DisplayFeature {
      /**
       * Orientation of a display feature in relation to screen
       */
      orientation: 'vertical' | 'horizontal';

      /**
       * The offset from the screen origin in either the x (for vertical
       * orientation) or y (for horizontal orientation) direction.
       */
      offset: integer;

      /**
       * A display feature may mask content such that it is not physically
       * displayed - this length along with the offset describes this area.
       * A display feature that only splits content will have a 0 mask_length.
       */
      maskLength: integer;
    }

    export interface DevicePosture {
      /**
       * Current posture of the device
       */
      type: 'continuous' | 'folded';
    }

    export interface MediaFeature {
      name: string;

      value: string;
    }

    /**
     * advance: If the scheduler runs out of immediate work, the virtual time base may fast forward to
     * allow the next delayed task (if any) to run; pause: The virtual time base may not advance;
     * pauseIfNetworkFetchesPending: The virtual time base may not advance if there are any pending
     * resource fetches.
     */
    export type VirtualTimePolicy = 'advance' | 'pause' | 'pauseIfNetworkFetchesPending';

    /**
     * Used to specify User Agent Cient Hints to emulate. See https://wicg.github.io/ua-client-hints
     */
    export interface UserAgentBrandVersion {
      brand: string;

      version: string;
    }

    /**
     * Used to specify User Agent Cient Hints to emulate. See https://wicg.github.io/ua-client-hints
     * Missing optional values will be filled in by the target with what it would normally use.
     */
    export interface UserAgentMetadata {
      /**
       * Brands appearing in Sec-CH-UA.
       */
      brands?: UserAgentBrandVersion[];

      /**
       * Brands appearing in Sec-CH-UA-Full-Version-List.
       */
      fullVersionList?: UserAgentBrandVersion[];

      /**
       * 
       * @deprecated
       */
      fullVersion?: string;

      platform: string;

      platformVersion: string;

      architecture: string;

      model: string;

      mobile: boolean;

      bitness?: string;

      wow64?: boolean;
    }

    /**
     * Used to specify sensor types to emulate.
     * See https://w3c.github.io/sensors/#automation for more information.
     */
    export type SensorType = 'absolute-orientation' | 'accelerometer' | 'ambient-light' | 'gravity' | 'gyroscope' | 'linear-acceleration' | 'magnetometer' | 'proximity' | 'relative-orientation';

    export interface SensorMetadata {
      available?: boolean;

      minimumFrequency?: number;

      maximumFrequency?: number;
    }

    export interface SensorReadingSingle {
      value: number;
    }

    export interface SensorReadingXYZ {
      x: number;

      y: number;

      z: number;
    }

    export interface SensorReadingQuaternion {
      x: number;

      y: number;

      z: number;

      w: number;
    }

    export interface SensorReading {
      single?: SensorReadingSingle;

      xyz?: SensorReadingXYZ;

      quaternion?: SensorReadingQuaternion;
    }

    /**
     * Enum of image types that can be disabled.
     */
    export type DisabledImageType = 'avif' | 'webp';
  }

  /**
   * Methods and events of the 'HeadlessExperimental' domain.
   */
  export interface HeadlessExperimentalApi {
    requests: {
      /**
       * Sends a BeginFrame to the target and returns when the frame was completed. Optionally captures a
       * screenshot from the resulting frame. Requires that the target was created with enabled
       * BeginFrameControl. Designed for use with --run-all-compositor-stages-before-draw, see also
       * https://goo.gle/chrome-headless-rendering for more background.
       */
      beginFrame: { params: HeadlessExperimental.BeginFrameParams, result: HeadlessExperimental.BeginFrameResult }

      /**
       * Disables headless events for the target.
       * @deprecated
       */
      disable: { params: HeadlessExperimental.DisableParams, result: HeadlessExperimental.DisableResult }

      /**
       * Enables headless events for the target.
       * @deprecated
       */
      enable: { params: HeadlessExperimental.EnableParams, result: HeadlessExperimental.EnableResult }
    };
    events: {
    };
  }

  /**
   * Types of the 'HeadlessExperimental' domain.
   */
  export namespace HeadlessExperimental {
    /**
     * Parameters of the 'HeadlessExperimental.beginFrame' method.
     */
    export interface BeginFrameParams {
      /**
       * Timestamp of this BeginFrame in Renderer TimeTicks (milliseconds of uptime). If not set,
       * the current time will be used.
       */
      frameTimeTicks?: number;

      /**
       * The interval between BeginFrames that is reported to the compositor, in milliseconds.
       * Defaults to a 60 frames/second interval, i.e. about 16.666 milliseconds.
       */
      interval?: number;

      /**
       * Whether updates should not be committed and drawn onto the display. False by default. If
       * true, only side effects of the BeginFrame will be run, such as layout and animations, but
       * any visual updates may not be visible on the display or in screenshots.
       */
      noDisplayUpdates?: boolean;

      /**
       * If set, a screenshot of the frame will be captured and returned in the response. Otherwise,
       * no screenshot will be captured. Note that capturing a screenshot can fail, for example,
       * during renderer initialization. In such a case, no screenshot data will be returned.
       */
      screenshot?: ScreenshotParams;
    }

    /**
     * Return value of the 'HeadlessExperimental.beginFrame' method.
     */
    export interface BeginFrameResult {
      /**
       * Whether the BeginFrame resulted in damage and, thus, a new frame was committed to the
       * display. Reported for diagnostic uses, may be removed in the future.
       */
      hasDamage: boolean;

      /**
       * Base64-encoded image data of the screenshot, if one was requested and successfully taken. (Encoded as a base64 string when passed over JSON)
       */
      screenshotData?: string;
    }

    /**
     * Parameters of the 'HeadlessExperimental.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'HeadlessExperimental.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'HeadlessExperimental.enable' method.
     */
    export interface EnableParams {
    }

    /**
     * Return value of the 'HeadlessExperimental.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Encoding options for a screenshot.
     */
    export interface ScreenshotParams {
      /**
       * Image compression format (defaults to png).
       */
      format?: 'jpeg' | 'png' | 'webp';

      /**
       * Compression quality from range [0..100] (jpeg and webp only).
       */
      quality?: integer;

      /**
       * Optimize image encoding for speed, not for resulting size (defaults to false)
       */
      optimizeForSpeed?: boolean;
    }
  }

  /**
   * Methods and events of the 'IO' domain.
   */
  export interface IOApi {
    requests: {
      /**
       * Close the stream, discard any temporary backing storage.
       */
      close: { params: IO.CloseParams, result: IO.CloseResult }

      /**
       * Read a chunk of the stream
       */
      read: { params: IO.ReadParams, result: IO.ReadResult }

      /**
       * Return UUID of Blob object specified by a remote object id.
       */
      resolveBlob: { params: IO.ResolveBlobParams, result: IO.ResolveBlobResult }
    };
    events: {
    };
  }

  /**
   * Types of the 'IO' domain.
   */
  export namespace IO {
    /**
     * Parameters of the 'IO.close' method.
     */
    export interface CloseParams {
      /**
       * Handle of the stream to close.
       */
      handle: StreamHandle;
    }

    /**
     * Return value of the 'IO.close' method.
     */
    export interface CloseResult {
    }

    /**
     * Parameters of the 'IO.read' method.
     */
    export interface ReadParams {
      /**
       * Handle of the stream to read.
       */
      handle: StreamHandle;

      /**
       * Seek to the specified offset before reading (if not specificed, proceed with offset
       * following the last read). Some types of streams may only support sequential reads.
       */
      offset?: integer;

      /**
       * Maximum number of bytes to read (left upon the agent discretion if not specified).
       */
      size?: integer;
    }

    /**
     * Return value of the 'IO.read' method.
     */
    export interface ReadResult {
      /**
       * Set if the data is base64-encoded
       */
      base64Encoded?: boolean;

      /**
       * Data that were read.
       */
      data: string;

      /**
       * Set if the end-of-file condition occurred while reading.
       */
      eof: boolean;
    }

    /**
     * Parameters of the 'IO.resolveBlob' method.
     */
    export interface ResolveBlobParams {
      /**
       * Object id of a Blob object wrapper.
       */
      objectId: CdpV8.Runtime.RemoteObjectId;
    }

    /**
     * Return value of the 'IO.resolveBlob' method.
     */
    export interface ResolveBlobResult {
      /**
       * UUID of the specified Blob.
       */
      uuid: string;
    }

    /**
     * This is either obtained from another method or specified as `blob:<uuid>` where
     * `<uuid>` is an UUID of a Blob.
     */
    export type StreamHandle = string;
  }

  /**
   * Methods and events of the 'IndexedDB' domain.
   */
  export interface IndexedDBApi {
    requests: {
      /**
       * Clears all entries from an object store.
       */
      clearObjectStore: { params: IndexedDB.ClearObjectStoreParams, result: IndexedDB.ClearObjectStoreResult }

      /**
       * Deletes a database.
       */
      deleteDatabase: { params: IndexedDB.DeleteDatabaseParams, result: IndexedDB.DeleteDatabaseResult }

      /**
       * Delete a range of entries from an object store
       */
      deleteObjectStoreEntries: { params: IndexedDB.DeleteObjectStoreEntriesParams, result: IndexedDB.DeleteObjectStoreEntriesResult }

      /**
       * Disables events from backend.
       */
      disable: { params: IndexedDB.DisableParams, result: IndexedDB.DisableResult }

      /**
       * Enables events from backend.
       */
      enable: { params: IndexedDB.EnableParams, result: IndexedDB.EnableResult }

      /**
       * Requests data from object store or index.
       */
      requestData: { params: IndexedDB.RequestDataParams, result: IndexedDB.RequestDataResult }

      /**
       * Gets metadata of an object store.
       */
      getMetadata: { params: IndexedDB.GetMetadataParams, result: IndexedDB.GetMetadataResult }

      /**
       * Requests database with given name in given frame.
       */
      requestDatabase: { params: IndexedDB.RequestDatabaseParams, result: IndexedDB.RequestDatabaseResult }

      /**
       * Requests database names for given security origin.
       */
      requestDatabaseNames: { params: IndexedDB.RequestDatabaseNamesParams, result: IndexedDB.RequestDatabaseNamesResult }
    };
    events: {
    };
  }

  /**
   * Types of the 'IndexedDB' domain.
   */
  export namespace IndexedDB {
    /**
     * Parameters of the 'IndexedDB.clearObjectStore' method.
     */
    export interface ClearObjectStoreParams {
      /**
       * At least and at most one of securityOrigin, storageKey, or storageBucket must be specified.
       * Security origin.
       */
      securityOrigin?: string;

      /**
       * Storage key.
       */
      storageKey?: string;

      /**
       * Storage bucket. If not specified, it uses the default bucket.
       */
      storageBucket?: Storage.StorageBucket;

      /**
       * Database name.
       */
      databaseName: string;

      /**
       * Object store name.
       */
      objectStoreName: string;
    }

    /**
     * Return value of the 'IndexedDB.clearObjectStore' method.
     */
    export interface ClearObjectStoreResult {
    }

    /**
     * Parameters of the 'IndexedDB.deleteDatabase' method.
     */
    export interface DeleteDatabaseParams {
      /**
       * At least and at most one of securityOrigin, storageKey, or storageBucket must be specified.
       * Security origin.
       */
      securityOrigin?: string;

      /**
       * Storage key.
       */
      storageKey?: string;

      /**
       * Storage bucket. If not specified, it uses the default bucket.
       */
      storageBucket?: Storage.StorageBucket;

      /**
       * Database name.
       */
      databaseName: string;
    }

    /**
     * Return value of the 'IndexedDB.deleteDatabase' method.
     */
    export interface DeleteDatabaseResult {
    }

    /**
     * Parameters of the 'IndexedDB.deleteObjectStoreEntries' method.
     */
    export interface DeleteObjectStoreEntriesParams {
      /**
       * At least and at most one of securityOrigin, storageKey, or storageBucket must be specified.
       * Security origin.
       */
      securityOrigin?: string;

      /**
       * Storage key.
       */
      storageKey?: string;

      /**
       * Storage bucket. If not specified, it uses the default bucket.
       */
      storageBucket?: Storage.StorageBucket;

      databaseName: string;

      objectStoreName: string;

      /**
       * Range of entry keys to delete
       */
      keyRange: KeyRange;
    }

    /**
     * Return value of the 'IndexedDB.deleteObjectStoreEntries' method.
     */
    export interface DeleteObjectStoreEntriesResult {
    }

    /**
     * Parameters of the 'IndexedDB.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'IndexedDB.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'IndexedDB.enable' method.
     */
    export interface EnableParams {
    }

    /**
     * Return value of the 'IndexedDB.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'IndexedDB.requestData' method.
     */
    export interface RequestDataParams {
      /**
       * At least and at most one of securityOrigin, storageKey, or storageBucket must be specified.
       * Security origin.
       */
      securityOrigin?: string;

      /**
       * Storage key.
       */
      storageKey?: string;

      /**
       * Storage bucket. If not specified, it uses the default bucket.
       */
      storageBucket?: Storage.StorageBucket;

      /**
       * Database name.
       */
      databaseName: string;

      /**
       * Object store name.
       */
      objectStoreName: string;

      /**
       * Index name, empty string for object store data requests.
       */
      indexName: string;

      /**
       * Number of records to skip.
       */
      skipCount: integer;

      /**
       * Number of records to fetch.
       */
      pageSize: integer;

      /**
       * Key range.
       */
      keyRange?: KeyRange;
    }

    /**
     * Return value of the 'IndexedDB.requestData' method.
     */
    export interface RequestDataResult {
      /**
       * Array of object store data entries.
       */
      objectStoreDataEntries: DataEntry[];

      /**
       * If true, there are more entries to fetch in the given range.
       */
      hasMore: boolean;
    }

    /**
     * Parameters of the 'IndexedDB.getMetadata' method.
     */
    export interface GetMetadataParams {
      /**
       * At least and at most one of securityOrigin, storageKey, or storageBucket must be specified.
       * Security origin.
       */
      securityOrigin?: string;

      /**
       * Storage key.
       */
      storageKey?: string;

      /**
       * Storage bucket. If not specified, it uses the default bucket.
       */
      storageBucket?: Storage.StorageBucket;

      /**
       * Database name.
       */
      databaseName: string;

      /**
       * Object store name.
       */
      objectStoreName: string;
    }

    /**
     * Return value of the 'IndexedDB.getMetadata' method.
     */
    export interface GetMetadataResult {
      /**
       * the entries count
       */
      entriesCount: number;

      /**
       * the current value of key generator, to become the next inserted
       * key into the object store. Valid if objectStore.autoIncrement
       * is true.
       */
      keyGeneratorValue: number;
    }

    /**
     * Parameters of the 'IndexedDB.requestDatabase' method.
     */
    export interface RequestDatabaseParams {
      /**
       * At least and at most one of securityOrigin, storageKey, or storageBucket must be specified.
       * Security origin.
       */
      securityOrigin?: string;

      /**
       * Storage key.
       */
      storageKey?: string;

      /**
       * Storage bucket. If not specified, it uses the default bucket.
       */
      storageBucket?: Storage.StorageBucket;

      /**
       * Database name.
       */
      databaseName: string;
    }

    /**
     * Return value of the 'IndexedDB.requestDatabase' method.
     */
    export interface RequestDatabaseResult {
      /**
       * Database with an array of object stores.
       */
      databaseWithObjectStores: DatabaseWithObjectStores;
    }

    /**
     * Parameters of the 'IndexedDB.requestDatabaseNames' method.
     */
    export interface RequestDatabaseNamesParams {
      /**
       * At least and at most one of securityOrigin, storageKey, or storageBucket must be specified.
       * Security origin.
       */
      securityOrigin?: string;

      /**
       * Storage key.
       */
      storageKey?: string;

      /**
       * Storage bucket. If not specified, it uses the default bucket.
       */
      storageBucket?: Storage.StorageBucket;
    }

    /**
     * Return value of the 'IndexedDB.requestDatabaseNames' method.
     */
    export interface RequestDatabaseNamesResult {
      /**
       * Database names for origin.
       */
      databaseNames: string[];
    }

    /**
     * Database with an array of object stores.
     */
    export interface DatabaseWithObjectStores {
      /**
       * Database name.
       */
      name: string;

      /**
       * Database version (type is not 'integer', as the standard
       * requires the version number to be 'unsigned long long')
       */
      version: number;

      /**
       * Object stores in this database.
       */
      objectStores: ObjectStore[];
    }

    /**
     * Object store.
     */
    export interface ObjectStore {
      /**
       * Object store name.
       */
      name: string;

      /**
       * Object store key path.
       */
      keyPath: KeyPath;

      /**
       * If true, object store has auto increment flag set.
       */
      autoIncrement: boolean;

      /**
       * Indexes in this object store.
       */
      indexes: ObjectStoreIndex[];
    }

    /**
     * Object store index.
     */
    export interface ObjectStoreIndex {
      /**
       * Index name.
       */
      name: string;

      /**
       * Index key path.
       */
      keyPath: KeyPath;

      /**
       * If true, index is unique.
       */
      unique: boolean;

      /**
       * If true, index allows multiple entries for a key.
       */
      multiEntry: boolean;
    }

    /**
     * Key.
     */
    export interface Key {
      /**
       * Key type.
       */
      type: 'number' | 'string' | 'date' | 'array';

      /**
       * Number value.
       */
      number?: number;

      /**
       * String value.
       */
      string?: string;

      /**
       * Date value.
       */
      date?: number;

      /**
       * Array value.
       */
      array?: Key[];
    }

    /**
     * Key range.
     */
    export interface KeyRange {
      /**
       * Lower bound.
       */
      lower?: Key;

      /**
       * Upper bound.
       */
      upper?: Key;

      /**
       * If true lower bound is open.
       */
      lowerOpen: boolean;

      /**
       * If true upper bound is open.
       */
      upperOpen: boolean;
    }

    /**
     * Data entry.
     */
    export interface DataEntry {
      /**
       * Key object.
       */
      key: CdpV8.Runtime.RemoteObject;

      /**
       * Primary key object.
       */
      primaryKey: CdpV8.Runtime.RemoteObject;

      /**
       * Value object.
       */
      value: CdpV8.Runtime.RemoteObject;
    }

    /**
     * Key path.
     */
    export interface KeyPath {
      /**
       * Key path type.
       */
      type: 'null' | 'string' | 'array';

      /**
       * String value.
       */
      string?: string;

      /**
       * Array value.
       */
      array?: string[];
    }
  }

  /**
   * Methods and events of the 'Input' domain.
   */
  export interface InputApi {
    requests: {
      /**
       * Dispatches a drag event into the page.
       */
      dispatchDragEvent: { params: Input.DispatchDragEventParams, result: Input.DispatchDragEventResult }

      /**
       * Dispatches a key event to the page.
       */
      dispatchKeyEvent: { params: Input.DispatchKeyEventParams, result: Input.DispatchKeyEventResult }

      /**
       * This method emulates inserting text that doesn't come from a key press,
       * for example an emoji keyboard or an IME.
       */
      insertText: { params: Input.InsertTextParams, result: Input.InsertTextResult }

      /**
       * This method sets the current candidate text for ime.
       * Use imeCommitComposition to commit the final text.
       * Use imeSetComposition with empty string as text to cancel composition.
       */
      imeSetComposition: { params: Input.ImeSetCompositionParams, result: Input.ImeSetCompositionResult }

      /**
       * Dispatches a mouse event to the page.
       */
      dispatchMouseEvent: { params: Input.DispatchMouseEventParams, result: Input.DispatchMouseEventResult }

      /**
       * Dispatches a touch event to the page.
       */
      dispatchTouchEvent: { params: Input.DispatchTouchEventParams, result: Input.DispatchTouchEventResult }

      /**
       * Cancels any active dragging in the page.
       */
      cancelDragging: { params: Input.CancelDraggingParams, result: Input.CancelDraggingResult }

      /**
       * Emulates touch event from the mouse event parameters.
       */
      emulateTouchFromMouseEvent: { params: Input.EmulateTouchFromMouseEventParams, result: Input.EmulateTouchFromMouseEventResult }

      /**
       * Ignores input events (useful while auditing page).
       */
      setIgnoreInputEvents: { params: Input.SetIgnoreInputEventsParams, result: Input.SetIgnoreInputEventsResult }

      /**
       * Prevents default drag and drop behavior and instead emits `Input.dragIntercepted` events.
       * Drag and drop behavior can be directly controlled via `Input.dispatchDragEvent`.
       */
      setInterceptDrags: { params: Input.SetInterceptDragsParams, result: Input.SetInterceptDragsResult }

      /**
       * Synthesizes a pinch gesture over a time period by issuing appropriate touch events.
       */
      synthesizePinchGesture: { params: Input.SynthesizePinchGestureParams, result: Input.SynthesizePinchGestureResult }

      /**
       * Synthesizes a scroll gesture over a time period by issuing appropriate touch events.
       */
      synthesizeScrollGesture: { params: Input.SynthesizeScrollGestureParams, result: Input.SynthesizeScrollGestureResult }

      /**
       * Synthesizes a tap gesture over a time period by issuing appropriate touch events.
       */
      synthesizeTapGesture: { params: Input.SynthesizeTapGestureParams, result: Input.SynthesizeTapGestureResult }
    };
    events: {

      /**
       * Emitted only when `Input.setInterceptDrags` is enabled. Use this data with `Input.dispatchDragEvent` to
       * restore normal drag and drop behavior.
       */
      dragIntercepted: { params: Input.DragInterceptedEvent };
    };
  }

  /**
   * Types of the 'Input' domain.
   */
  export namespace Input {
    /**
     * Parameters of the 'Input.dispatchDragEvent' method.
     */
    export interface DispatchDragEventParams {
      /**
       * Type of the drag event.
       */
      type: 'dragEnter' | 'dragOver' | 'drop' | 'dragCancel';

      /**
       * X coordinate of the event relative to the main frame's viewport in CSS pixels.
       */
      x: number;

      /**
       * Y coordinate of the event relative to the main frame's viewport in CSS pixels. 0 refers to
       * the top of the viewport and Y increases as it proceeds towards the bottom of the viewport.
       */
      y: number;

      data: DragData;

      /**
       * Bit field representing pressed modifier keys. Alt=1, Ctrl=2, Meta/Command=4, Shift=8
       * (default: 0).
       */
      modifiers?: integer;
    }

    /**
     * Return value of the 'Input.dispatchDragEvent' method.
     */
    export interface DispatchDragEventResult {
    }

    /**
     * Parameters of the 'Input.dispatchKeyEvent' method.
     */
    export interface DispatchKeyEventParams {
      /**
       * Type of the key event.
       */
      type: 'keyDown' | 'keyUp' | 'rawKeyDown' | 'char';

      /**
       * Bit field representing pressed modifier keys. Alt=1, Ctrl=2, Meta/Command=4, Shift=8
       * (default: 0).
       */
      modifiers?: integer;

      /**
       * Time at which the event occurred.
       */
      timestamp?: TimeSinceEpoch;

      /**
       * Text as generated by processing a virtual key code with a keyboard layout. Not needed for
       * for `keyUp` and `rawKeyDown` events (default: "")
       */
      text?: string;

      /**
       * Text that would have been generated by the keyboard if no modifiers were pressed (except for
       * shift). Useful for shortcut (accelerator) key handling (default: "").
       */
      unmodifiedText?: string;

      /**
       * Unique key identifier (e.g., 'U+0041') (default: "").
       */
      keyIdentifier?: string;

      /**
       * Unique DOM defined string value for each physical key (e.g., 'KeyA') (default: "").
       */
      code?: string;

      /**
       * Unique DOM defined string value describing the meaning of the key in the context of active
       * modifiers, keyboard layout, etc (e.g., 'AltGr') (default: "").
       */
      key?: string;

      /**
       * Windows virtual key code (default: 0).
       */
      windowsVirtualKeyCode?: integer;

      /**
       * Native virtual key code (default: 0).
       */
      nativeVirtualKeyCode?: integer;

      /**
       * Whether the event was generated from auto repeat (default: false).
       */
      autoRepeat?: boolean;

      /**
       * Whether the event was generated from the keypad (default: false).
       */
      isKeypad?: boolean;

      /**
       * Whether the event was a system key event (default: false).
       */
      isSystemKey?: boolean;

      /**
       * Whether the event was from the left or right side of the keyboard. 1=Left, 2=Right (default:
       * 0).
       */
      location?: integer;

      /**
       * Editing commands to send with the key event (e.g., 'selectAll') (default: []).
       * These are related to but not equal the command names used in `document.execCommand` and NSStandardKeyBindingResponding.
       * See https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/editing/commands/editor_command_names.h for valid command names.
       */
      commands?: string[];
    }

    /**
     * Return value of the 'Input.dispatchKeyEvent' method.
     */
    export interface DispatchKeyEventResult {
    }

    /**
     * Parameters of the 'Input.insertText' method.
     */
    export interface InsertTextParams {
      /**
       * The text to insert.
       */
      text: string;
    }

    /**
     * Return value of the 'Input.insertText' method.
     */
    export interface InsertTextResult {
    }

    /**
     * Parameters of the 'Input.imeSetComposition' method.
     */
    export interface ImeSetCompositionParams {
      /**
       * The text to insert
       */
      text: string;

      /**
       * selection start
       */
      selectionStart: integer;

      /**
       * selection end
       */
      selectionEnd: integer;

      /**
       * replacement start
       */
      replacementStart?: integer;

      /**
       * replacement end
       */
      replacementEnd?: integer;
    }

    /**
     * Return value of the 'Input.imeSetComposition' method.
     */
    export interface ImeSetCompositionResult {
    }

    /**
     * Parameters of the 'Input.dispatchMouseEvent' method.
     */
    export interface DispatchMouseEventParams {
      /**
       * Type of the mouse event.
       */
      type: 'mousePressed' | 'mouseReleased' | 'mouseMoved' | 'mouseWheel';

      /**
       * X coordinate of the event relative to the main frame's viewport in CSS pixels.
       */
      x: number;

      /**
       * Y coordinate of the event relative to the main frame's viewport in CSS pixels. 0 refers to
       * the top of the viewport and Y increases as it proceeds towards the bottom of the viewport.
       */
      y: number;

      /**
       * Bit field representing pressed modifier keys. Alt=1, Ctrl=2, Meta/Command=4, Shift=8
       * (default: 0).
       */
      modifiers?: integer;

      /**
       * Time at which the event occurred.
       */
      timestamp?: TimeSinceEpoch;

      /**
       * Mouse button (default: "none").
       */
      button?: MouseButton;

      /**
       * A number indicating which buttons are pressed on the mouse when a mouse event is triggered.
       * Left=1, Right=2, Middle=4, Back=8, Forward=16, None=0.
       */
      buttons?: integer;

      /**
       * Number of times the mouse button was clicked (default: 0).
       */
      clickCount?: integer;

      /**
       * The normalized pressure, which has a range of [0,1] (default: 0).
       */
      force?: number;

      /**
       * The normalized tangential pressure, which has a range of [-1,1] (default: 0).
       */
      tangentialPressure?: number;

      /**
       * The plane angle between the Y-Z plane and the plane containing both the stylus axis and the Y axis, in degrees of the range [-90,90], a positive tiltX is to the right (default: 0).
       */
      tiltX?: number;

      /**
       * The plane angle between the X-Z plane and the plane containing both the stylus axis and the X axis, in degrees of the range [-90,90], a positive tiltY is towards the user (default: 0).
       */
      tiltY?: number;

      /**
       * The clockwise rotation of a pen stylus around its own major axis, in degrees in the range [0,359] (default: 0).
       */
      twist?: integer;

      /**
       * X delta in CSS pixels for mouse wheel event (default: 0).
       */
      deltaX?: number;

      /**
       * Y delta in CSS pixels for mouse wheel event (default: 0).
       */
      deltaY?: number;

      /**
       * Pointer type (default: "mouse").
       */
      pointerType?: 'mouse' | 'pen';
    }

    /**
     * Return value of the 'Input.dispatchMouseEvent' method.
     */
    export interface DispatchMouseEventResult {
    }

    /**
     * Parameters of the 'Input.dispatchTouchEvent' method.
     */
    export interface DispatchTouchEventParams {
      /**
       * Type of the touch event. TouchEnd and TouchCancel must not contain any touch points, while
       * TouchStart and TouchMove must contains at least one.
       */
      type: 'touchStart' | 'touchEnd' | 'touchMove' | 'touchCancel';

      /**
       * Active touch points on the touch device. One event per any changed point (compared to
       * previous touch event in a sequence) is generated, emulating pressing/moving/releasing points
       * one by one.
       */
      touchPoints: TouchPoint[];

      /**
       * Bit field representing pressed modifier keys. Alt=1, Ctrl=2, Meta/Command=4, Shift=8
       * (default: 0).
       */
      modifiers?: integer;

      /**
       * Time at which the event occurred.
       */
      timestamp?: TimeSinceEpoch;
    }

    /**
     * Return value of the 'Input.dispatchTouchEvent' method.
     */
    export interface DispatchTouchEventResult {
    }

    /**
     * Parameters of the 'Input.cancelDragging' method.
     */
    export interface CancelDraggingParams {
    }

    /**
     * Return value of the 'Input.cancelDragging' method.
     */
    export interface CancelDraggingResult {
    }

    /**
     * Parameters of the 'Input.emulateTouchFromMouseEvent' method.
     */
    export interface EmulateTouchFromMouseEventParams {
      /**
       * Type of the mouse event.
       */
      type: 'mousePressed' | 'mouseReleased' | 'mouseMoved' | 'mouseWheel';

      /**
       * X coordinate of the mouse pointer in DIP.
       */
      x: integer;

      /**
       * Y coordinate of the mouse pointer in DIP.
       */
      y: integer;

      /**
       * Mouse button. Only "none", "left", "right" are supported.
       */
      button: MouseButton;

      /**
       * Time at which the event occurred (default: current time).
       */
      timestamp?: TimeSinceEpoch;

      /**
       * X delta in DIP for mouse wheel event (default: 0).
       */
      deltaX?: number;

      /**
       * Y delta in DIP for mouse wheel event (default: 0).
       */
      deltaY?: number;

      /**
       * Bit field representing pressed modifier keys. Alt=1, Ctrl=2, Meta/Command=4, Shift=8
       * (default: 0).
       */
      modifiers?: integer;

      /**
       * Number of times the mouse button was clicked (default: 0).
       */
      clickCount?: integer;
    }

    /**
     * Return value of the 'Input.emulateTouchFromMouseEvent' method.
     */
    export interface EmulateTouchFromMouseEventResult {
    }

    /**
     * Parameters of the 'Input.setIgnoreInputEvents' method.
     */
    export interface SetIgnoreInputEventsParams {
      /**
       * Ignores input events processing when set to true.
       */
      ignore: boolean;
    }

    /**
     * Return value of the 'Input.setIgnoreInputEvents' method.
     */
    export interface SetIgnoreInputEventsResult {
    }

    /**
     * Parameters of the 'Input.setInterceptDrags' method.
     */
    export interface SetInterceptDragsParams {
      enabled: boolean;
    }

    /**
     * Return value of the 'Input.setInterceptDrags' method.
     */
    export interface SetInterceptDragsResult {
    }

    /**
     * Parameters of the 'Input.synthesizePinchGesture' method.
     */
    export interface SynthesizePinchGestureParams {
      /**
       * X coordinate of the start of the gesture in CSS pixels.
       */
      x: number;

      /**
       * Y coordinate of the start of the gesture in CSS pixels.
       */
      y: number;

      /**
       * Relative scale factor after zooming (>1.0 zooms in, <1.0 zooms out).
       */
      scaleFactor: number;

      /**
       * Relative pointer speed in pixels per second (default: 800).
       */
      relativeSpeed?: integer;

      /**
       * Which type of input events to be generated (default: 'default', which queries the platform
       * for the preferred input type).
       */
      gestureSourceType?: GestureSourceType;
    }

    /**
     * Return value of the 'Input.synthesizePinchGesture' method.
     */
    export interface SynthesizePinchGestureResult {
    }

    /**
     * Parameters of the 'Input.synthesizeScrollGesture' method.
     */
    export interface SynthesizeScrollGestureParams {
      /**
       * X coordinate of the start of the gesture in CSS pixels.
       */
      x: number;

      /**
       * Y coordinate of the start of the gesture in CSS pixels.
       */
      y: number;

      /**
       * The distance to scroll along the X axis (positive to scroll left).
       */
      xDistance?: number;

      /**
       * The distance to scroll along the Y axis (positive to scroll up).
       */
      yDistance?: number;

      /**
       * The number of additional pixels to scroll back along the X axis, in addition to the given
       * distance.
       */
      xOverscroll?: number;

      /**
       * The number of additional pixels to scroll back along the Y axis, in addition to the given
       * distance.
       */
      yOverscroll?: number;

      /**
       * Prevent fling (default: true).
       */
      preventFling?: boolean;

      /**
       * Swipe speed in pixels per second (default: 800).
       */
      speed?: integer;

      /**
       * Which type of input events to be generated (default: 'default', which queries the platform
       * for the preferred input type).
       */
      gestureSourceType?: GestureSourceType;

      /**
       * The number of times to repeat the gesture (default: 0).
       */
      repeatCount?: integer;

      /**
       * The number of milliseconds delay between each repeat. (default: 250).
       */
      repeatDelayMs?: integer;

      /**
       * The name of the interaction markers to generate, if not empty (default: "").
       */
      interactionMarkerName?: string;
    }

    /**
     * Return value of the 'Input.synthesizeScrollGesture' method.
     */
    export interface SynthesizeScrollGestureResult {
    }

    /**
     * Parameters of the 'Input.synthesizeTapGesture' method.
     */
    export interface SynthesizeTapGestureParams {
      /**
       * X coordinate of the start of the gesture in CSS pixels.
       */
      x: number;

      /**
       * Y coordinate of the start of the gesture in CSS pixels.
       */
      y: number;

      /**
       * Duration between touchdown and touchup events in ms (default: 50).
       */
      duration?: integer;

      /**
       * Number of times to perform the tap (e.g. 2 for double tap, default: 1).
       */
      tapCount?: integer;

      /**
       * Which type of input events to be generated (default: 'default', which queries the platform
       * for the preferred input type).
       */
      gestureSourceType?: GestureSourceType;
    }

    /**
     * Return value of the 'Input.synthesizeTapGesture' method.
     */
    export interface SynthesizeTapGestureResult {
    }

    /**
     * Parameters of the 'Input.dragIntercepted' event.
     */
    export interface DragInterceptedEvent {
      data: DragData;
    }

    export interface TouchPoint {
      /**
       * X coordinate of the event relative to the main frame's viewport in CSS pixels.
       */
      x: number;

      /**
       * Y coordinate of the event relative to the main frame's viewport in CSS pixels. 0 refers to
       * the top of the viewport and Y increases as it proceeds towards the bottom of the viewport.
       */
      y: number;

      /**
       * X radius of the touch area (default: 1.0).
       */
      radiusX?: number;

      /**
       * Y radius of the touch area (default: 1.0).
       */
      radiusY?: number;

      /**
       * Rotation angle (default: 0.0).
       */
      rotationAngle?: number;

      /**
       * Force (default: 1.0).
       */
      force?: number;

      /**
       * The normalized tangential pressure, which has a range of [-1,1] (default: 0).
       */
      tangentialPressure?: number;

      /**
       * The plane angle between the Y-Z plane and the plane containing both the stylus axis and the Y axis, in degrees of the range [-90,90], a positive tiltX is to the right (default: 0)
       */
      tiltX?: number;

      /**
       * The plane angle between the X-Z plane and the plane containing both the stylus axis and the X axis, in degrees of the range [-90,90], a positive tiltY is towards the user (default: 0).
       */
      tiltY?: number;

      /**
       * The clockwise rotation of a pen stylus around its own major axis, in degrees in the range [0,359] (default: 0).
       */
      twist?: integer;

      /**
       * Identifier used to track touch sources between events, must be unique within an event.
       */
      id?: number;
    }

    export type GestureSourceType = 'default' | 'touch' | 'mouse';

    export type MouseButton = 'none' | 'left' | 'middle' | 'right' | 'back' | 'forward';

    /**
     * UTC time in seconds, counted from January 1, 1970.
     */
    export type TimeSinceEpoch = number;

    export interface DragDataItem {
      /**
       * Mime type of the dragged data.
       */
      mimeType: string;

      /**
       * Depending of the value of `mimeType`, it contains the dragged link,
       * text, HTML markup or any other data.
       */
      data: string;

      /**
       * Title associated with a link. Only valid when `mimeType` == "text/uri-list".
       */
      title?: string;

      /**
       * Stores the base URL for the contained markup. Only valid when `mimeType`
       * == "text/html".
       */
      baseURL?: string;
    }

    export interface DragData {
      items: DragDataItem[];

      /**
       * List of filenames that should be included when dropping
       */
      files?: string[];

      /**
       * Bit field representing allowed drag operations. Copy = 1, Link = 2, Move = 16
       */
      dragOperationsMask: integer;
    }
  }

  /**
   * Methods and events of the 'Inspector' domain.
   */
  export interface InspectorApi {
    requests: {
      /**
       * Disables inspector domain notifications.
       */
      disable: { params: Inspector.DisableParams, result: Inspector.DisableResult }

      /**
       * Enables inspector domain notifications.
       */
      enable: { params: Inspector.EnableParams, result: Inspector.EnableResult }
    };
    events: {

      /**
       * Fired when remote debugging connection is about to be terminated. Contains detach reason.
       */
      detached: { params: Inspector.DetachedEvent };

      /**
       * Fired when debugging target has crashed
       */
      targetCrashed: { params: Inspector.TargetCrashedEvent };

      /**
       * Fired when debugging target has reloaded after crash
       */
      targetReloadedAfterCrash: { params: Inspector.TargetReloadedAfterCrashEvent };
    };
  }

  /**
   * Types of the 'Inspector' domain.
   */
  export namespace Inspector {
    /**
     * Parameters of the 'Inspector.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'Inspector.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'Inspector.enable' method.
     */
    export interface EnableParams {
    }

    /**
     * Return value of the 'Inspector.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'Inspector.detached' event.
     */
    export interface DetachedEvent {
      /**
       * The reason why connection has been terminated.
       */
      reason: string;
    }

    /**
     * Parameters of the 'Inspector.targetCrashed' event.
     */
    export interface TargetCrashedEvent {
    }

    /**
     * Parameters of the 'Inspector.targetReloadedAfterCrash' event.
     */
    export interface TargetReloadedAfterCrashEvent {
    }
  }

  /**
   * Methods and events of the 'LayerTree' domain.
   */
  export interface LayerTreeApi {
    requests: {
      /**
       * Provides the reasons why the given layer was composited.
       */
      compositingReasons: { params: LayerTree.CompositingReasonsParams, result: LayerTree.CompositingReasonsResult }

      /**
       * Disables compositing tree inspection.
       */
      disable: { params: LayerTree.DisableParams, result: LayerTree.DisableResult }

      /**
       * Enables compositing tree inspection.
       */
      enable: { params: LayerTree.EnableParams, result: LayerTree.EnableResult }

      /**
       * Returns the snapshot identifier.
       */
      loadSnapshot: { params: LayerTree.LoadSnapshotParams, result: LayerTree.LoadSnapshotResult }

      /**
       * Returns the layer snapshot identifier.
       */
      makeSnapshot: { params: LayerTree.MakeSnapshotParams, result: LayerTree.MakeSnapshotResult }

      profileSnapshot: { params: LayerTree.ProfileSnapshotParams, result: LayerTree.ProfileSnapshotResult }

      /**
       * Releases layer snapshot captured by the back-end.
       */
      releaseSnapshot: { params: LayerTree.ReleaseSnapshotParams, result: LayerTree.ReleaseSnapshotResult }

      /**
       * Replays the layer snapshot and returns the resulting bitmap.
       */
      replaySnapshot: { params: LayerTree.ReplaySnapshotParams, result: LayerTree.ReplaySnapshotResult }

      /**
       * Replays the layer snapshot and returns canvas log.
       */
      snapshotCommandLog: { params: LayerTree.SnapshotCommandLogParams, result: LayerTree.SnapshotCommandLogResult }
    };
    events: {

      layerPainted: { params: LayerTree.LayerPaintedEvent };

      layerTreeDidChange: { params: LayerTree.LayerTreeDidChangeEvent };
    };
  }

  /**
   * Types of the 'LayerTree' domain.
   */
  export namespace LayerTree {
    /**
     * Parameters of the 'LayerTree.compositingReasons' method.
     */
    export interface CompositingReasonsParams {
      /**
       * The id of the layer for which we want to get the reasons it was composited.
       */
      layerId: LayerId;
    }

    /**
     * Return value of the 'LayerTree.compositingReasons' method.
     */
    export interface CompositingReasonsResult {
      /**
       * A list of strings specifying reasons for the given layer to become composited.
       */
      compositingReasons: string[];

      /**
       * A list of strings specifying reason IDs for the given layer to become composited.
       */
      compositingReasonIds: string[];
    }

    /**
     * Parameters of the 'LayerTree.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'LayerTree.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'LayerTree.enable' method.
     */
    export interface EnableParams {
    }

    /**
     * Return value of the 'LayerTree.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'LayerTree.loadSnapshot' method.
     */
    export interface LoadSnapshotParams {
      /**
       * An array of tiles composing the snapshot.
       */
      tiles: PictureTile[];
    }

    /**
     * Return value of the 'LayerTree.loadSnapshot' method.
     */
    export interface LoadSnapshotResult {
      /**
       * The id of the snapshot.
       */
      snapshotId: SnapshotId;
    }

    /**
     * Parameters of the 'LayerTree.makeSnapshot' method.
     */
    export interface MakeSnapshotParams {
      /**
       * The id of the layer.
       */
      layerId: LayerId;
    }

    /**
     * Return value of the 'LayerTree.makeSnapshot' method.
     */
    export interface MakeSnapshotResult {
      /**
       * The id of the layer snapshot.
       */
      snapshotId: SnapshotId;
    }

    /**
     * Parameters of the 'LayerTree.profileSnapshot' method.
     */
    export interface ProfileSnapshotParams {
      /**
       * The id of the layer snapshot.
       */
      snapshotId: SnapshotId;

      /**
       * The maximum number of times to replay the snapshot (1, if not specified).
       */
      minRepeatCount?: integer;

      /**
       * The minimum duration (in seconds) to replay the snapshot.
       */
      minDuration?: number;

      /**
       * The clip rectangle to apply when replaying the snapshot.
       */
      clipRect?: DOM.Rect;
    }

    /**
     * Return value of the 'LayerTree.profileSnapshot' method.
     */
    export interface ProfileSnapshotResult {
      /**
       * The array of paint profiles, one per run.
       */
      timings: PaintProfile[];
    }

    /**
     * Parameters of the 'LayerTree.releaseSnapshot' method.
     */
    export interface ReleaseSnapshotParams {
      /**
       * The id of the layer snapshot.
       */
      snapshotId: SnapshotId;
    }

    /**
     * Return value of the 'LayerTree.releaseSnapshot' method.
     */
    export interface ReleaseSnapshotResult {
    }

    /**
     * Parameters of the 'LayerTree.replaySnapshot' method.
     */
    export interface ReplaySnapshotParams {
      /**
       * The id of the layer snapshot.
       */
      snapshotId: SnapshotId;

      /**
       * The first step to replay from (replay from the very start if not specified).
       */
      fromStep?: integer;

      /**
       * The last step to replay to (replay till the end if not specified).
       */
      toStep?: integer;

      /**
       * The scale to apply while replaying (defaults to 1).
       */
      scale?: number;
    }

    /**
     * Return value of the 'LayerTree.replaySnapshot' method.
     */
    export interface ReplaySnapshotResult {
      /**
       * A data: URL for resulting image.
       */
      dataURL: string;
    }

    /**
     * Parameters of the 'LayerTree.snapshotCommandLog' method.
     */
    export interface SnapshotCommandLogParams {
      /**
       * The id of the layer snapshot.
       */
      snapshotId: SnapshotId;
    }

    /**
     * Return value of the 'LayerTree.snapshotCommandLog' method.
     */
    export interface SnapshotCommandLogResult {
      /**
       * The array of canvas function calls.
       */
      commandLog: Record<string, unknown>[];
    }

    /**
     * Parameters of the 'LayerTree.layerPainted' event.
     */
    export interface LayerPaintedEvent {
      /**
       * The id of the painted layer.
       */
      layerId: LayerId;

      /**
       * Clip rectangle.
       */
      clip: DOM.Rect;
    }

    /**
     * Parameters of the 'LayerTree.layerTreeDidChange' event.
     */
    export interface LayerTreeDidChangeEvent {
      /**
       * Layer tree, absent if not in the comspositing mode.
       */
      layers?: Layer[];
    }

    /**
     * Unique Layer identifier.
     */
    export type LayerId = string;

    /**
     * Unique snapshot identifier.
     */
    export type SnapshotId = string;

    /**
     * Rectangle where scrolling happens on the main thread.
     */
    export interface ScrollRect {
      /**
       * Rectangle itself.
       */
      rect: DOM.Rect;

      /**
       * Reason for rectangle to force scrolling on the main thread
       */
      type: 'RepaintsOnScroll' | 'TouchEventHandler' | 'WheelEventHandler';
    }

    /**
     * Sticky position constraints.
     */
    export interface StickyPositionConstraint {
      /**
       * Layout rectangle of the sticky element before being shifted
       */
      stickyBoxRect: DOM.Rect;

      /**
       * Layout rectangle of the containing block of the sticky element
       */
      containingBlockRect: DOM.Rect;

      /**
       * The nearest sticky layer that shifts the sticky box
       */
      nearestLayerShiftingStickyBox?: LayerId;

      /**
       * The nearest sticky layer that shifts the containing block
       */
      nearestLayerShiftingContainingBlock?: LayerId;
    }

    /**
     * Serialized fragment of layer picture along with its offset within the layer.
     */
    export interface PictureTile {
      /**
       * Offset from owning layer left boundary
       */
      x: number;

      /**
       * Offset from owning layer top boundary
       */
      y: number;

      /**
       * Base64-encoded snapshot data. (Encoded as a base64 string when passed over JSON)
       */
      picture: string;
    }

    /**
     * Information about a compositing layer.
     */
    export interface Layer {
      /**
       * The unique id for this layer.
       */
      layerId: LayerId;

      /**
       * The id of parent (not present for root).
       */
      parentLayerId?: LayerId;

      /**
       * The backend id for the node associated with this layer.
       */
      backendNodeId?: DOM.BackendNodeId;

      /**
       * Offset from parent layer, X coordinate.
       */
      offsetX: number;

      /**
       * Offset from parent layer, Y coordinate.
       */
      offsetY: number;

      /**
       * Layer width.
       */
      width: number;

      /**
       * Layer height.
       */
      height: number;

      /**
       * Transformation matrix for layer, default is identity matrix
       */
      transform?: number[];

      /**
       * Transform anchor point X, absent if no transform specified
       */
      anchorX?: number;

      /**
       * Transform anchor point Y, absent if no transform specified
       */
      anchorY?: number;

      /**
       * Transform anchor point Z, absent if no transform specified
       */
      anchorZ?: number;

      /**
       * Indicates how many time this layer has painted.
       */
      paintCount: integer;

      /**
       * Indicates whether this layer hosts any content, rather than being used for
       * transform/scrolling purposes only.
       */
      drawsContent: boolean;

      /**
       * Set if layer is not visible.
       */
      invisible?: boolean;

      /**
       * Rectangles scrolling on main thread only.
       */
      scrollRects?: ScrollRect[];

      /**
       * Sticky position constraint information
       */
      stickyPositionConstraint?: StickyPositionConstraint;
    }

    /**
     * Array of timings, one per paint step.
     */
    export type PaintProfile = number[];
  }

  /**
   * Methods and events of the 'Log' domain.
   */
  export interface LogApi {
    requests: {
      /**
       * Clears the log.
       */
      clear: { params: Log.ClearParams, result: Log.ClearResult }

      /**
       * Disables log domain, prevents further log entries from being reported to the client.
       */
      disable: { params: Log.DisableParams, result: Log.DisableResult }

      /**
       * Enables log domain, sends the entries collected so far to the client by means of the
       * `entryAdded` notification.
       */
      enable: { params: Log.EnableParams, result: Log.EnableResult }

      /**
       * start violation reporting.
       */
      startViolationsReport: { params: Log.StartViolationsReportParams, result: Log.StartViolationsReportResult }

      /**
       * Stop violation reporting.
       */
      stopViolationsReport: { params: Log.StopViolationsReportParams, result: Log.StopViolationsReportResult }
    };
    events: {

      /**
       * Issued when new message was logged.
       */
      entryAdded: { params: Log.EntryAddedEvent };
    };
  }

  /**
   * Types of the 'Log' domain.
   */
  export namespace Log {
    /**
     * Parameters of the 'Log.clear' method.
     */
    export interface ClearParams {
    }

    /**
     * Return value of the 'Log.clear' method.
     */
    export interface ClearResult {
    }

    /**
     * Parameters of the 'Log.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'Log.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'Log.enable' method.
     */
    export interface EnableParams {
    }

    /**
     * Return value of the 'Log.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'Log.startViolationsReport' method.
     */
    export interface StartViolationsReportParams {
      /**
       * Configuration for violations.
       */
      config: ViolationSetting[];
    }

    /**
     * Return value of the 'Log.startViolationsReport' method.
     */
    export interface StartViolationsReportResult {
    }

    /**
     * Parameters of the 'Log.stopViolationsReport' method.
     */
    export interface StopViolationsReportParams {
    }

    /**
     * Return value of the 'Log.stopViolationsReport' method.
     */
    export interface StopViolationsReportResult {
    }

    /**
     * Parameters of the 'Log.entryAdded' event.
     */
    export interface EntryAddedEvent {
      /**
       * The entry.
       */
      entry: LogEntry;
    }

    /**
     * Log entry.
     */
    export interface LogEntry {
      /**
       * Log entry source.
       */
      source: 'xml' | 'javascript' | 'network' | 'storage' | 'appcache' | 'rendering' | 'security' | 'deprecation' | 'worker' | 'violation' | 'intervention' | 'recommendation' | 'other';

      /**
       * Log entry severity.
       */
      level: 'verbose' | 'info' | 'warning' | 'error';

      /**
       * Logged text.
       */
      text: string;

      category?: 'cors';

      /**
       * Timestamp when this entry was added.
       */
      timestamp: CdpV8.Runtime.Timestamp;

      /**
       * URL of the resource if known.
       */
      url?: string;

      /**
       * Line number in the resource.
       */
      lineNumber?: integer;

      /**
       * JavaScript stack trace.
       */
      stackTrace?: CdpV8.Runtime.StackTrace;

      /**
       * Identifier of the network request associated with this entry.
       */
      networkRequestId?: Network.RequestId;

      /**
       * Identifier of the worker associated with this entry.
       */
      workerId?: string;

      /**
       * Call arguments.
       */
      args?: CdpV8.Runtime.RemoteObject[];
    }

    /**
     * Violation configuration setting.
     */
    export interface ViolationSetting {
      /**
       * Violation type.
       */
      name: 'longTask' | 'longLayout' | 'blockedEvent' | 'blockedParser' | 'discouragedAPIUse' | 'handler' | 'recurringHandler';

      /**
       * Time threshold to trigger upon.
       */
      threshold: number;
    }
  }

  /**
   * Methods and events of the 'Memory' domain.
   */
  export interface MemoryApi {
    requests: {
      getDOMCounters: { params: Memory.GetDOMCountersParams, result: Memory.GetDOMCountersResult }

      prepareForLeakDetection: { params: Memory.PrepareForLeakDetectionParams, result: Memory.PrepareForLeakDetectionResult }

      /**
       * Simulate OomIntervention by purging V8 memory.
       */
      forciblyPurgeJavaScriptMemory: { params: Memory.ForciblyPurgeJavaScriptMemoryParams, result: Memory.ForciblyPurgeJavaScriptMemoryResult }

      /**
       * Enable/disable suppressing memory pressure notifications in all processes.
       */
      setPressureNotificationsSuppressed: { params: Memory.SetPressureNotificationsSuppressedParams, result: Memory.SetPressureNotificationsSuppressedResult }

      /**
       * Simulate a memory pressure notification in all processes.
       */
      simulatePressureNotification: { params: Memory.SimulatePressureNotificationParams, result: Memory.SimulatePressureNotificationResult }

      /**
       * Start collecting native memory profile.
       */
      startSampling: { params: Memory.StartSamplingParams, result: Memory.StartSamplingResult }

      /**
       * Stop collecting native memory profile.
       */
      stopSampling: { params: Memory.StopSamplingParams, result: Memory.StopSamplingResult }

      /**
       * Retrieve native memory allocations profile
       * collected since renderer process startup.
       */
      getAllTimeSamplingProfile: { params: Memory.GetAllTimeSamplingProfileParams, result: Memory.GetAllTimeSamplingProfileResult }

      /**
       * Retrieve native memory allocations profile
       * collected since browser process startup.
       */
      getBrowserSamplingProfile: { params: Memory.GetBrowserSamplingProfileParams, result: Memory.GetBrowserSamplingProfileResult }

      /**
       * Retrieve native memory allocations profile collected since last
       * `startSampling` call.
       */
      getSamplingProfile: { params: Memory.GetSamplingProfileParams, result: Memory.GetSamplingProfileResult }
    };
    events: {
    };
  }

  /**
   * Types of the 'Memory' domain.
   */
  export namespace Memory {
    /**
     * Parameters of the 'Memory.getDOMCounters' method.
     */
    export interface GetDOMCountersParams {
    }

    /**
     * Return value of the 'Memory.getDOMCounters' method.
     */
    export interface GetDOMCountersResult {
      documents: integer;

      nodes: integer;

      jsEventListeners: integer;
    }

    /**
     * Parameters of the 'Memory.prepareForLeakDetection' method.
     */
    export interface PrepareForLeakDetectionParams {
    }

    /**
     * Return value of the 'Memory.prepareForLeakDetection' method.
     */
    export interface PrepareForLeakDetectionResult {
    }

    /**
     * Parameters of the 'Memory.forciblyPurgeJavaScriptMemory' method.
     */
    export interface ForciblyPurgeJavaScriptMemoryParams {
    }

    /**
     * Return value of the 'Memory.forciblyPurgeJavaScriptMemory' method.
     */
    export interface ForciblyPurgeJavaScriptMemoryResult {
    }

    /**
     * Parameters of the 'Memory.setPressureNotificationsSuppressed' method.
     */
    export interface SetPressureNotificationsSuppressedParams {
      /**
       * If true, memory pressure notifications will be suppressed.
       */
      suppressed: boolean;
    }

    /**
     * Return value of the 'Memory.setPressureNotificationsSuppressed' method.
     */
    export interface SetPressureNotificationsSuppressedResult {
    }

    /**
     * Parameters of the 'Memory.simulatePressureNotification' method.
     */
    export interface SimulatePressureNotificationParams {
      /**
       * Memory pressure level of the notification.
       */
      level: PressureLevel;
    }

    /**
     * Return value of the 'Memory.simulatePressureNotification' method.
     */
    export interface SimulatePressureNotificationResult {
    }

    /**
     * Parameters of the 'Memory.startSampling' method.
     */
    export interface StartSamplingParams {
      /**
       * Average number of bytes between samples.
       */
      samplingInterval?: integer;

      /**
       * Do not randomize intervals between samples.
       */
      suppressRandomness?: boolean;
    }

    /**
     * Return value of the 'Memory.startSampling' method.
     */
    export interface StartSamplingResult {
    }

    /**
     * Parameters of the 'Memory.stopSampling' method.
     */
    export interface StopSamplingParams {
    }

    /**
     * Return value of the 'Memory.stopSampling' method.
     */
    export interface StopSamplingResult {
    }

    /**
     * Parameters of the 'Memory.getAllTimeSamplingProfile' method.
     */
    export interface GetAllTimeSamplingProfileParams {
    }

    /**
     * Return value of the 'Memory.getAllTimeSamplingProfile' method.
     */
    export interface GetAllTimeSamplingProfileResult {
      profile: SamplingProfile;
    }

    /**
     * Parameters of the 'Memory.getBrowserSamplingProfile' method.
     */
    export interface GetBrowserSamplingProfileParams {
    }

    /**
     * Return value of the 'Memory.getBrowserSamplingProfile' method.
     */
    export interface GetBrowserSamplingProfileResult {
      profile: SamplingProfile;
    }

    /**
     * Parameters of the 'Memory.getSamplingProfile' method.
     */
    export interface GetSamplingProfileParams {
    }

    /**
     * Return value of the 'Memory.getSamplingProfile' method.
     */
    export interface GetSamplingProfileResult {
      profile: SamplingProfile;
    }

    /**
     * Memory pressure level.
     */
    export type PressureLevel = 'moderate' | 'critical';

    /**
     * Heap profile sample.
     */
    export interface SamplingProfileNode {
      /**
       * Size of the sampled allocation.
       */
      size: number;

      /**
       * Total bytes attributed to this sample.
       */
      total: number;

      /**
       * Execution stack at the point of allocation.
       */
      stack: string[];
    }

    /**
     * Array of heap profile samples.
     */
    export interface SamplingProfile {
      samples: SamplingProfileNode[];

      modules: Module[];
    }

    /**
     * Executable module information
     */
    export interface Module {
      /**
       * Name of the module.
       */
      name: string;

      /**
       * UUID of the module.
       */
      uuid: string;

      /**
       * Base address where the module is loaded into memory. Encoded as a decimal
       * or hexadecimal (0x prefixed) string.
       */
      baseAddress: string;

      /**
       * Size of the module in bytes.
       */
      size: number;
    }
  }

  /**
   * Methods and events of the 'Network' domain.
   */
  export interface NetworkApi {
    requests: {
      /**
       * Sets a list of content encodings that will be accepted. Empty list means no encoding is accepted.
       */
      setAcceptedEncodings: { params: Network.SetAcceptedEncodingsParams, result: Network.SetAcceptedEncodingsResult }

      /**
       * Clears accepted encodings set by setAcceptedEncodings
       */
      clearAcceptedEncodingsOverride: { params: Network.ClearAcceptedEncodingsOverrideParams, result: Network.ClearAcceptedEncodingsOverrideResult }

      /**
       * Tells whether clearing browser cache is supported.
       * @deprecated
       */
      canClearBrowserCache: { params: Network.CanClearBrowserCacheParams, result: Network.CanClearBrowserCacheResult }

      /**
       * Tells whether clearing browser cookies is supported.
       * @deprecated
       */
      canClearBrowserCookies: { params: Network.CanClearBrowserCookiesParams, result: Network.CanClearBrowserCookiesResult }

      /**
       * Tells whether emulation of network conditions is supported.
       * @deprecated
       */
      canEmulateNetworkConditions: { params: Network.CanEmulateNetworkConditionsParams, result: Network.CanEmulateNetworkConditionsResult }

      /**
       * Clears browser cache.
       */
      clearBrowserCache: { params: Network.ClearBrowserCacheParams, result: Network.ClearBrowserCacheResult }

      /**
       * Clears browser cookies.
       */
      clearBrowserCookies: { params: Network.ClearBrowserCookiesParams, result: Network.ClearBrowserCookiesResult }

      /**
       * Response to Network.requestIntercepted which either modifies the request to continue with any
       * modifications, or blocks it, or completes it with the provided response bytes. If a network
       * fetch occurs as a result which encounters a redirect an additional Network.requestIntercepted
       * event will be sent with the same InterceptionId.
       * Deprecated, use Fetch.continueRequest, Fetch.fulfillRequest and Fetch.failRequest instead.
       * @deprecated
       */
      continueInterceptedRequest: { params: Network.ContinueInterceptedRequestParams, result: Network.ContinueInterceptedRequestResult }

      /**
       * Deletes browser cookies with matching name and url or domain/path pair.
       */
      deleteCookies: { params: Network.DeleteCookiesParams, result: Network.DeleteCookiesResult }

      /**
       * Disables network tracking, prevents network events from being sent to the client.
       */
      disable: { params: Network.DisableParams, result: Network.DisableResult }

      /**
       * Activates emulation of network conditions.
       */
      emulateNetworkConditions: { params: Network.EmulateNetworkConditionsParams, result: Network.EmulateNetworkConditionsResult }

      /**
       * Enables network tracking, network events will now be delivered to the client.
       */
      enable: { params: Network.EnableParams, result: Network.EnableResult }

      /**
       * Returns all browser cookies. Depending on the backend support, will return detailed cookie
       * information in the `cookies` field.
       * Deprecated. Use Storage.getCookies instead.
       * @deprecated
       */
      getAllCookies: { params: Network.GetAllCookiesParams, result: Network.GetAllCookiesResult }

      /**
       * Returns the DER-encoded certificate.
       */
      getCertificate: { params: Network.GetCertificateParams, result: Network.GetCertificateResult }

      /**
       * Returns all browser cookies for the current URL. Depending on the backend support, will return
       * detailed cookie information in the `cookies` field.
       */
      getCookies: { params: Network.GetCookiesParams, result: Network.GetCookiesResult }

      /**
       * Returns content served for the given request.
       */
      getResponseBody: { params: Network.GetResponseBodyParams, result: Network.GetResponseBodyResult }

      /**
       * Returns post data sent with the request. Returns an error when no data was sent with the request.
       */
      getRequestPostData: { params: Network.GetRequestPostDataParams, result: Network.GetRequestPostDataResult }

      /**
       * Returns content served for the given currently intercepted request.
       */
      getResponseBodyForInterception: { params: Network.GetResponseBodyForInterceptionParams, result: Network.GetResponseBodyForInterceptionResult }

      /**
       * Returns a handle to the stream representing the response body. Note that after this command,
       * the intercepted request can't be continued as is -- you either need to cancel it or to provide
       * the response body. The stream only supports sequential read, IO.read will fail if the position
       * is specified.
       */
      takeResponseBodyForInterceptionAsStream: { params: Network.TakeResponseBodyForInterceptionAsStreamParams, result: Network.TakeResponseBodyForInterceptionAsStreamResult }

      /**
       * This method sends a new XMLHttpRequest which is identical to the original one. The following
       * parameters should be identical: method, url, async, request body, extra headers, withCredentials
       * attribute, user, password.
       */
      replayXHR: { params: Network.ReplayXHRParams, result: Network.ReplayXHRResult }

      /**
       * Searches for given string in response content.
       */
      searchInResponseBody: { params: Network.SearchInResponseBodyParams, result: Network.SearchInResponseBodyResult }

      /**
       * Blocks URLs from loading.
       */
      setBlockedURLs: { params: Network.SetBlockedURLsParams, result: Network.SetBlockedURLsResult }

      /**
       * Toggles ignoring of service worker for each request.
       */
      setBypassServiceWorker: { params: Network.SetBypassServiceWorkerParams, result: Network.SetBypassServiceWorkerResult }

      /**
       * Toggles ignoring cache for each request. If `true`, cache will not be used.
       */
      setCacheDisabled: { params: Network.SetCacheDisabledParams, result: Network.SetCacheDisabledResult }

      /**
       * Sets a cookie with the given cookie data; may overwrite equivalent cookies if they exist.
       */
      setCookie: { params: Network.SetCookieParams, result: Network.SetCookieResult }

      /**
       * Sets given cookies.
       */
      setCookies: { params: Network.SetCookiesParams, result: Network.SetCookiesResult }

      /**
       * Specifies whether to always send extra HTTP headers with the requests from this page.
       */
      setExtraHTTPHeaders: { params: Network.SetExtraHTTPHeadersParams, result: Network.SetExtraHTTPHeadersResult }

      /**
       * Specifies whether to attach a page script stack id in requests
       */
      setAttachDebugStack: { params: Network.SetAttachDebugStackParams, result: Network.SetAttachDebugStackResult }

      /**
       * Sets the requests to intercept that match the provided patterns and optionally resource types.
       * Deprecated, please use Fetch.enable instead.
       * @deprecated
       */
      setRequestInterception: { params: Network.SetRequestInterceptionParams, result: Network.SetRequestInterceptionResult }

      /**
       * Allows overriding user agent with the given string.
       */
      setUserAgentOverride: { params: Network.SetUserAgentOverrideParams, result: Network.SetUserAgentOverrideResult }

      /**
       * Enables streaming of the response for the given requestId.
       * If enabled, the dataReceived event contains the data that was received during streaming.
       */
      streamResourceContent: { params: Network.StreamResourceContentParams, result: Network.StreamResourceContentResult }

      /**
       * Returns information about the COEP/COOP isolation status.
       */
      getSecurityIsolationStatus: { params: Network.GetSecurityIsolationStatusParams, result: Network.GetSecurityIsolationStatusResult }

      /**
       * Enables tracking for the Reporting API, events generated by the Reporting API will now be delivered to the client.
       * Enabling triggers 'reportingApiReportAdded' for all existing reports.
       */
      enableReportingApi: { params: Network.EnableReportingApiParams, result: Network.EnableReportingApiResult }

      /**
       * Fetches the resource and returns the content.
       */
      loadNetworkResource: { params: Network.LoadNetworkResourceParams, result: Network.LoadNetworkResourceResult }
    };
    events: {

      /**
       * Fired when data chunk was received over the network.
       */
      dataReceived: { params: Network.DataReceivedEvent };

      /**
       * Fired when EventSource message is received.
       */
      eventSourceMessageReceived: { params: Network.EventSourceMessageReceivedEvent };

      /**
       * Fired when HTTP request has failed to load.
       */
      loadingFailed: { params: Network.LoadingFailedEvent };

      /**
       * Fired when HTTP request has finished loading.
       */
      loadingFinished: { params: Network.LoadingFinishedEvent };

      /**
       * Details of an intercepted HTTP request, which must be either allowed, blocked, modified or
       * mocked.
       * Deprecated, use Fetch.requestPaused instead.
       * @deprecated
       */
      requestIntercepted: { params: Network.RequestInterceptedEvent };

      /**
       * Fired if request ended up loading from cache.
       */
      requestServedFromCache: { params: Network.RequestServedFromCacheEvent };

      /**
       * Fired when page is about to send HTTP request.
       */
      requestWillBeSent: { params: Network.RequestWillBeSentEvent };

      /**
       * Fired when resource loading priority is changed
       */
      resourceChangedPriority: { params: Network.ResourceChangedPriorityEvent };

      /**
       * Fired when a signed exchange was received over the network
       */
      signedExchangeReceived: { params: Network.SignedExchangeReceivedEvent };

      /**
       * Fired when HTTP response is available.
       */
      responseReceived: { params: Network.ResponseReceivedEvent };

      /**
       * Fired when WebSocket is closed.
       */
      webSocketClosed: { params: Network.WebSocketClosedEvent };

      /**
       * Fired upon WebSocket creation.
       */
      webSocketCreated: { params: Network.WebSocketCreatedEvent };

      /**
       * Fired when WebSocket message error occurs.
       */
      webSocketFrameError: { params: Network.WebSocketFrameErrorEvent };

      /**
       * Fired when WebSocket message is received.
       */
      webSocketFrameReceived: { params: Network.WebSocketFrameReceivedEvent };

      /**
       * Fired when WebSocket message is sent.
       */
      webSocketFrameSent: { params: Network.WebSocketFrameSentEvent };

      /**
       * Fired when WebSocket handshake response becomes available.
       */
      webSocketHandshakeResponseReceived: { params: Network.WebSocketHandshakeResponseReceivedEvent };

      /**
       * Fired when WebSocket is about to initiate handshake.
       */
      webSocketWillSendHandshakeRequest: { params: Network.WebSocketWillSendHandshakeRequestEvent };

      /**
       * Fired upon WebTransport creation.
       */
      webTransportCreated: { params: Network.WebTransportCreatedEvent };

      /**
       * Fired when WebTransport handshake is finished.
       */
      webTransportConnectionEstablished: { params: Network.WebTransportConnectionEstablishedEvent };

      /**
       * Fired when WebTransport is disposed.
       */
      webTransportClosed: { params: Network.WebTransportClosedEvent };

      /**
       * Fired when additional information about a requestWillBeSent event is available from the
       * network stack. Not every requestWillBeSent event will have an additional
       * requestWillBeSentExtraInfo fired for it, and there is no guarantee whether requestWillBeSent
       * or requestWillBeSentExtraInfo will be fired first for the same request.
       */
      requestWillBeSentExtraInfo: { params: Network.RequestWillBeSentExtraInfoEvent };

      /**
       * Fired when additional information about a responseReceived event is available from the network
       * stack. Not every responseReceived event will have an additional responseReceivedExtraInfo for
       * it, and responseReceivedExtraInfo may be fired before or after responseReceived.
       */
      responseReceivedExtraInfo: { params: Network.ResponseReceivedExtraInfoEvent };

      /**
       * Fired exactly once for each Trust Token operation. Depending on
       * the type of the operation and whether the operation succeeded or
       * failed, the event is fired before the corresponding request was sent
       * or after the response was received.
       */
      trustTokenOperationDone: { params: Network.TrustTokenOperationDoneEvent };

      /**
       * Fired once when parsing the .wbn file has succeeded.
       * The event contains the information about the web bundle contents.
       */
      subresourceWebBundleMetadataReceived: { params: Network.SubresourceWebBundleMetadataReceivedEvent };

      /**
       * Fired once when parsing the .wbn file has failed.
       */
      subresourceWebBundleMetadataError: { params: Network.SubresourceWebBundleMetadataErrorEvent };

      /**
       * Fired when handling requests for resources within a .wbn file.
       * Note: this will only be fired for resources that are requested by the webpage.
       */
      subresourceWebBundleInnerResponseParsed: { params: Network.SubresourceWebBundleInnerResponseParsedEvent };

      /**
       * Fired when request for resources within a .wbn file failed.
       */
      subresourceWebBundleInnerResponseError: { params: Network.SubresourceWebBundleInnerResponseErrorEvent };

      /**
       * Is sent whenever a new report is added.
       * And after 'enableReportingApi' for all existing reports.
       */
      reportingApiReportAdded: { params: Network.ReportingApiReportAddedEvent };

      reportingApiReportUpdated: { params: Network.ReportingApiReportUpdatedEvent };

      reportingApiEndpointsChangedForOrigin: { params: Network.ReportingApiEndpointsChangedForOriginEvent };
    };
  }

  /**
   * Types of the 'Network' domain.
   */
  export namespace Network {
    /**
     * Parameters of the 'Network.setAcceptedEncodings' method.
     */
    export interface SetAcceptedEncodingsParams {
      /**
       * List of accepted content encodings.
       */
      encodings: ContentEncoding[];
    }

    /**
     * Return value of the 'Network.setAcceptedEncodings' method.
     */
    export interface SetAcceptedEncodingsResult {
    }

    /**
     * Parameters of the 'Network.clearAcceptedEncodingsOverride' method.
     */
    export interface ClearAcceptedEncodingsOverrideParams {
    }

    /**
     * Return value of the 'Network.clearAcceptedEncodingsOverride' method.
     */
    export interface ClearAcceptedEncodingsOverrideResult {
    }

    /**
     * Parameters of the 'Network.canClearBrowserCache' method.
     */
    export interface CanClearBrowserCacheParams {
    }

    /**
     * Return value of the 'Network.canClearBrowserCache' method.
     */
    export interface CanClearBrowserCacheResult {
      /**
       * True if browser cache can be cleared.
       */
      result: boolean;
    }

    /**
     * Parameters of the 'Network.canClearBrowserCookies' method.
     */
    export interface CanClearBrowserCookiesParams {
    }

    /**
     * Return value of the 'Network.canClearBrowserCookies' method.
     */
    export interface CanClearBrowserCookiesResult {
      /**
       * True if browser cookies can be cleared.
       */
      result: boolean;
    }

    /**
     * Parameters of the 'Network.canEmulateNetworkConditions' method.
     */
    export interface CanEmulateNetworkConditionsParams {
    }

    /**
     * Return value of the 'Network.canEmulateNetworkConditions' method.
     */
    export interface CanEmulateNetworkConditionsResult {
      /**
       * True if emulation of network conditions is supported.
       */
      result: boolean;
    }

    /**
     * Parameters of the 'Network.clearBrowserCache' method.
     */
    export interface ClearBrowserCacheParams {
    }

    /**
     * Return value of the 'Network.clearBrowserCache' method.
     */
    export interface ClearBrowserCacheResult {
    }

    /**
     * Parameters of the 'Network.clearBrowserCookies' method.
     */
    export interface ClearBrowserCookiesParams {
    }

    /**
     * Return value of the 'Network.clearBrowserCookies' method.
     */
    export interface ClearBrowserCookiesResult {
    }

    /**
     * Parameters of the 'Network.continueInterceptedRequest' method.
     */
    export interface ContinueInterceptedRequestParams {
      interceptionId: InterceptionId;

      /**
       * If set this causes the request to fail with the given reason. Passing `Aborted` for requests
       * marked with `isNavigationRequest` also cancels the navigation. Must not be set in response
       * to an authChallenge.
       */
      errorReason?: ErrorReason;

      /**
       * If set the requests completes using with the provided base64 encoded raw response, including
       * HTTP status line and headers etc... Must not be set in response to an authChallenge. (Encoded as a base64 string when passed over JSON)
       */
      rawResponse?: string;

      /**
       * If set the request url will be modified in a way that's not observable by page. Must not be
       * set in response to an authChallenge.
       */
      url?: string;

      /**
       * If set this allows the request method to be overridden. Must not be set in response to an
       * authChallenge.
       */
      method?: string;

      /**
       * If set this allows postData to be set. Must not be set in response to an authChallenge.
       */
      postData?: string;

      /**
       * If set this allows the request headers to be changed. Must not be set in response to an
       * authChallenge.
       */
      headers?: Headers;

      /**
       * Response to a requestIntercepted with an authChallenge. Must not be set otherwise.
       */
      authChallengeResponse?: AuthChallengeResponse;
    }

    /**
     * Return value of the 'Network.continueInterceptedRequest' method.
     */
    export interface ContinueInterceptedRequestResult {
    }

    /**
     * Parameters of the 'Network.deleteCookies' method.
     */
    export interface DeleteCookiesParams {
      /**
       * Name of the cookies to remove.
       */
      name: string;

      /**
       * If specified, deletes all the cookies with the given name where domain and path match
       * provided URL.
       */
      url?: string;

      /**
       * If specified, deletes only cookies with the exact domain.
       */
      domain?: string;

      /**
       * If specified, deletes only cookies with the exact path.
       */
      path?: string;
    }

    /**
     * Return value of the 'Network.deleteCookies' method.
     */
    export interface DeleteCookiesResult {
    }

    /**
     * Parameters of the 'Network.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'Network.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'Network.emulateNetworkConditions' method.
     */
    export interface EmulateNetworkConditionsParams {
      /**
       * True to emulate internet disconnection.
       */
      offline: boolean;

      /**
       * Minimum latency from request sent to response headers received (ms).
       */
      latency: number;

      /**
       * Maximal aggregated download throughput (bytes/sec). -1 disables download throttling.
       */
      downloadThroughput: number;

      /**
       * Maximal aggregated upload throughput (bytes/sec).  -1 disables upload throttling.
       */
      uploadThroughput: number;

      /**
       * Connection type if known.
       */
      connectionType?: ConnectionType;
    }

    /**
     * Return value of the 'Network.emulateNetworkConditions' method.
     */
    export interface EmulateNetworkConditionsResult {
    }

    /**
     * Parameters of the 'Network.enable' method.
     */
    export interface EnableParams {
      /**
       * Buffer size in bytes to use when preserving network payloads (XHRs, etc).
       */
      maxTotalBufferSize?: integer;

      /**
       * Per-resource buffer size in bytes to use when preserving network payloads (XHRs, etc).
       */
      maxResourceBufferSize?: integer;

      /**
       * Longest post body size (in bytes) that would be included in requestWillBeSent notification
       */
      maxPostDataSize?: integer;
    }

    /**
     * Return value of the 'Network.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'Network.getAllCookies' method.
     */
    export interface GetAllCookiesParams {
    }

    /**
     * Return value of the 'Network.getAllCookies' method.
     */
    export interface GetAllCookiesResult {
      /**
       * Array of cookie objects.
       */
      cookies: Cookie[];
    }

    /**
     * Parameters of the 'Network.getCertificate' method.
     */
    export interface GetCertificateParams {
      /**
       * Origin to get certificate for.
       */
      origin: string;
    }

    /**
     * Return value of the 'Network.getCertificate' method.
     */
    export interface GetCertificateResult {
      tableNames: string[];
    }

    /**
     * Parameters of the 'Network.getCookies' method.
     */
    export interface GetCookiesParams {
      /**
       * The list of URLs for which applicable cookies will be fetched.
       * If not specified, it's assumed to be set to the list containing
       * the URLs of the page and all of its subframes.
       */
      urls?: string[];
    }

    /**
     * Return value of the 'Network.getCookies' method.
     */
    export interface GetCookiesResult {
      /**
       * Array of cookie objects.
       */
      cookies: Cookie[];
    }

    /**
     * Parameters of the 'Network.getResponseBody' method.
     */
    export interface GetResponseBodyParams {
      /**
       * Identifier of the network request to get content for.
       */
      requestId: RequestId;
    }

    /**
     * Return value of the 'Network.getResponseBody' method.
     */
    export interface GetResponseBodyResult {
      /**
       * Response body.
       */
      body: string;

      /**
       * True, if content was sent as base64.
       */
      base64Encoded: boolean;
    }

    /**
     * Parameters of the 'Network.getRequestPostData' method.
     */
    export interface GetRequestPostDataParams {
      /**
       * Identifier of the network request to get content for.
       */
      requestId: RequestId;
    }

    /**
     * Return value of the 'Network.getRequestPostData' method.
     */
    export interface GetRequestPostDataResult {
      /**
       * Request body string, omitting files from multipart requests
       */
      postData: string;
    }

    /**
     * Parameters of the 'Network.getResponseBodyForInterception' method.
     */
    export interface GetResponseBodyForInterceptionParams {
      /**
       * Identifier for the intercepted request to get body for.
       */
      interceptionId: InterceptionId;
    }

    /**
     * Return value of the 'Network.getResponseBodyForInterception' method.
     */
    export interface GetResponseBodyForInterceptionResult {
      /**
       * Response body.
       */
      body: string;

      /**
       * True, if content was sent as base64.
       */
      base64Encoded: boolean;
    }

    /**
     * Parameters of the 'Network.takeResponseBodyForInterceptionAsStream' method.
     */
    export interface TakeResponseBodyForInterceptionAsStreamParams {
      interceptionId: InterceptionId;
    }

    /**
     * Return value of the 'Network.takeResponseBodyForInterceptionAsStream' method.
     */
    export interface TakeResponseBodyForInterceptionAsStreamResult {
      stream: IO.StreamHandle;
    }

    /**
     * Parameters of the 'Network.replayXHR' method.
     */
    export interface ReplayXHRParams {
      /**
       * Identifier of XHR to replay.
       */
      requestId: RequestId;
    }

    /**
     * Return value of the 'Network.replayXHR' method.
     */
    export interface ReplayXHRResult {
    }

    /**
     * Parameters of the 'Network.searchInResponseBody' method.
     */
    export interface SearchInResponseBodyParams {
      /**
       * Identifier of the network response to search.
       */
      requestId: RequestId;

      /**
       * String to search for.
       */
      query: string;

      /**
       * If true, search is case sensitive.
       */
      caseSensitive?: boolean;

      /**
       * If true, treats string parameter as regex.
       */
      isRegex?: boolean;
    }

    /**
     * Return value of the 'Network.searchInResponseBody' method.
     */
    export interface SearchInResponseBodyResult {
      /**
       * List of search matches.
       */
      result: CdpV8.Debugger.SearchMatch[];
    }

    /**
     * Parameters of the 'Network.setBlockedURLs' method.
     */
    export interface SetBlockedURLsParams {
      /**
       * URL patterns to block. Wildcards ('*') are allowed.
       */
      urls: string[];
    }

    /**
     * Return value of the 'Network.setBlockedURLs' method.
     */
    export interface SetBlockedURLsResult {
    }

    /**
     * Parameters of the 'Network.setBypassServiceWorker' method.
     */
    export interface SetBypassServiceWorkerParams {
      /**
       * Bypass service worker and load from network.
       */
      bypass: boolean;
    }

    /**
     * Return value of the 'Network.setBypassServiceWorker' method.
     */
    export interface SetBypassServiceWorkerResult {
    }

    /**
     * Parameters of the 'Network.setCacheDisabled' method.
     */
    export interface SetCacheDisabledParams {
      /**
       * Cache disabled state.
       */
      cacheDisabled: boolean;
    }

    /**
     * Return value of the 'Network.setCacheDisabled' method.
     */
    export interface SetCacheDisabledResult {
    }

    /**
     * Parameters of the 'Network.setCookie' method.
     */
    export interface SetCookieParams {
      /**
       * Cookie name.
       */
      name: string;

      /**
       * Cookie value.
       */
      value: string;

      /**
       * The request-URI to associate with the setting of the cookie. This value can affect the
       * default domain, path, source port, and source scheme values of the created cookie.
       */
      url?: string;

      /**
       * Cookie domain.
       */
      domain?: string;

      /**
       * Cookie path.
       */
      path?: string;

      /**
       * True if cookie is secure.
       */
      secure?: boolean;

      /**
       * True if cookie is http-only.
       */
      httpOnly?: boolean;

      /**
       * Cookie SameSite type.
       */
      sameSite?: CookieSameSite;

      /**
       * Cookie expiration date, session cookie if not set
       */
      expires?: TimeSinceEpoch;

      /**
       * Cookie Priority type.
       */
      priority?: CookiePriority;

      /**
       * True if cookie is SameParty.
       */
      sameParty?: boolean;

      /**
       * Cookie source scheme type.
       */
      sourceScheme?: CookieSourceScheme;

      /**
       * Cookie source port. Valid values are {-1, [1, 65535]}, -1 indicates an unspecified port.
       * An unspecified port value allows protocol clients to emulate legacy cookie scope for the port.
       * This is a temporary ability and it will be removed in the future.
       */
      sourcePort?: integer;

      /**
       * Cookie partition key. The site of the top-level URL the browser was visiting at the start
       * of the request to the endpoint that set the cookie.
       * If not set, the cookie will be set as not partitioned.
       */
      partitionKey?: string;
    }

    /**
     * Return value of the 'Network.setCookie' method.
     */
    export interface SetCookieResult {
      /**
       * Always set to true. If an error occurs, the response indicates protocol error.
       * @deprecated
       */
      success: boolean;
    }

    /**
     * Parameters of the 'Network.setCookies' method.
     */
    export interface SetCookiesParams {
      /**
       * Cookies to be set.
       */
      cookies: CookieParam[];
    }

    /**
     * Return value of the 'Network.setCookies' method.
     */
    export interface SetCookiesResult {
    }

    /**
     * Parameters of the 'Network.setExtraHTTPHeaders' method.
     */
    export interface SetExtraHTTPHeadersParams {
      /**
       * Map with extra HTTP headers.
       */
      headers: Headers;
    }

    /**
     * Return value of the 'Network.setExtraHTTPHeaders' method.
     */
    export interface SetExtraHTTPHeadersResult {
    }

    /**
     * Parameters of the 'Network.setAttachDebugStack' method.
     */
    export interface SetAttachDebugStackParams {
      /**
       * Whether to attach a page script stack for debugging purpose.
       */
      enabled: boolean;
    }

    /**
     * Return value of the 'Network.setAttachDebugStack' method.
     */
    export interface SetAttachDebugStackResult {
    }

    /**
     * Parameters of the 'Network.setRequestInterception' method.
     */
    export interface SetRequestInterceptionParams {
      /**
       * Requests matching any of these patterns will be forwarded and wait for the corresponding
       * continueInterceptedRequest call.
       */
      patterns: RequestPattern[];
    }

    /**
     * Return value of the 'Network.setRequestInterception' method.
     */
    export interface SetRequestInterceptionResult {
    }

    /**
     * Parameters of the 'Network.setUserAgentOverride' method.
     */
    export interface SetUserAgentOverrideParams {
      /**
       * User agent to use.
       */
      userAgent: string;

      /**
       * Browser language to emulate.
       */
      acceptLanguage?: string;

      /**
       * The platform navigator.platform should return.
       */
      platform?: string;

      /**
       * To be sent in Sec-CH-UA-* headers and returned in navigator.userAgentData
       */
      userAgentMetadata?: Emulation.UserAgentMetadata;
    }

    /**
     * Return value of the 'Network.setUserAgentOverride' method.
     */
    export interface SetUserAgentOverrideResult {
    }

    /**
     * Parameters of the 'Network.streamResourceContent' method.
     */
    export interface StreamResourceContentParams {
      /**
       * Identifier of the request to stream.
       */
      requestId: RequestId;
    }

    /**
     * Return value of the 'Network.streamResourceContent' method.
     */
    export interface StreamResourceContentResult {
      /**
       * Data that has been buffered until streaming is enabled. (Encoded as a base64 string when passed over JSON)
       */
      bufferedData: string;
    }

    /**
     * Parameters of the 'Network.getSecurityIsolationStatus' method.
     */
    export interface GetSecurityIsolationStatusParams {
      /**
       * If no frameId is provided, the status of the target is provided.
       */
      frameId?: Page.FrameId;
    }

    /**
     * Return value of the 'Network.getSecurityIsolationStatus' method.
     */
    export interface GetSecurityIsolationStatusResult {
      status: SecurityIsolationStatus;
    }

    /**
     * Parameters of the 'Network.enableReportingApi' method.
     */
    export interface EnableReportingApiParams {
      /**
       * Whether to enable or disable events for the Reporting API
       */
      enable: boolean;
    }

    /**
     * Return value of the 'Network.enableReportingApi' method.
     */
    export interface EnableReportingApiResult {
    }

    /**
     * Parameters of the 'Network.loadNetworkResource' method.
     */
    export interface LoadNetworkResourceParams {
      /**
       * Frame id to get the resource for. Mandatory for frame targets, and
       * should be omitted for worker targets.
       */
      frameId?: Page.FrameId;

      /**
       * URL of the resource to get content for.
       */
      url: string;

      /**
       * Options for the request.
       */
      options: LoadNetworkResourceOptions;
    }

    /**
     * Return value of the 'Network.loadNetworkResource' method.
     */
    export interface LoadNetworkResourceResult {
      resource: LoadNetworkResourcePageResult;
    }

    /**
     * Parameters of the 'Network.dataReceived' event.
     */
    export interface DataReceivedEvent {
      /**
       * Request identifier.
       */
      requestId: RequestId;

      /**
       * Timestamp.
       */
      timestamp: MonotonicTime;

      /**
       * Data chunk length.
       */
      dataLength: integer;

      /**
       * Actual bytes received (might be less than dataLength for compressed encodings).
       */
      encodedDataLength: integer;

      /**
       * Data that was received. (Encoded as a base64 string when passed over JSON)
       */
      data?: string;
    }

    /**
     * Parameters of the 'Network.eventSourceMessageReceived' event.
     */
    export interface EventSourceMessageReceivedEvent {
      /**
       * Request identifier.
       */
      requestId: RequestId;

      /**
       * Timestamp.
       */
      timestamp: MonotonicTime;

      /**
       * Message type.
       */
      eventName: string;

      /**
       * Message identifier.
       */
      eventId: string;

      /**
       * Message content.
       */
      data: string;
    }

    /**
     * Parameters of the 'Network.loadingFailed' event.
     */
    export interface LoadingFailedEvent {
      /**
       * Request identifier.
       */
      requestId: RequestId;

      /**
       * Timestamp.
       */
      timestamp: MonotonicTime;

      /**
       * Resource type.
       */
      type: ResourceType;

      /**
       * User friendly error message.
       */
      errorText: string;

      /**
       * True if loading was canceled.
       */
      canceled?: boolean;

      /**
       * The reason why loading was blocked, if any.
       */
      blockedReason?: BlockedReason;

      /**
       * The reason why loading was blocked by CORS, if any.
       */
      corsErrorStatus?: CorsErrorStatus;
    }

    /**
     * Parameters of the 'Network.loadingFinished' event.
     */
    export interface LoadingFinishedEvent {
      /**
       * Request identifier.
       */
      requestId: RequestId;

      /**
       * Timestamp.
       */
      timestamp: MonotonicTime;

      /**
       * Total number of bytes received for this request.
       */
      encodedDataLength: number;
    }

    /**
     * Parameters of the 'Network.requestIntercepted' event.
     */
    export interface RequestInterceptedEvent {
      /**
       * Each request the page makes will have a unique id, however if any redirects are encountered
       * while processing that fetch, they will be reported with the same id as the original fetch.
       * Likewise if HTTP authentication is needed then the same fetch id will be used.
       */
      interceptionId: InterceptionId;

      request: Request;

      /**
       * The id of the frame that initiated the request.
       */
      frameId: Page.FrameId;

      /**
       * How the requested resource will be used.
       */
      resourceType: ResourceType;

      /**
       * Whether this is a navigation request, which can abort the navigation completely.
       */
      isNavigationRequest: boolean;

      /**
       * Set if the request is a navigation that will result in a download.
       * Only present after response is received from the server (i.e. HeadersReceived stage).
       */
      isDownload?: boolean;

      /**
       * Redirect location, only sent if a redirect was intercepted.
       */
      redirectUrl?: string;

      /**
       * Details of the Authorization Challenge encountered. If this is set then
       * continueInterceptedRequest must contain an authChallengeResponse.
       */
      authChallenge?: AuthChallenge;

      /**
       * Response error if intercepted at response stage or if redirect occurred while intercepting
       * request.
       */
      responseErrorReason?: ErrorReason;

      /**
       * Response code if intercepted at response stage or if redirect occurred while intercepting
       * request or auth retry occurred.
       */
      responseStatusCode?: integer;

      /**
       * Response headers if intercepted at the response stage or if redirect occurred while
       * intercepting request or auth retry occurred.
       */
      responseHeaders?: Headers;

      /**
       * If the intercepted request had a corresponding requestWillBeSent event fired for it, then
       * this requestId will be the same as the requestId present in the requestWillBeSent event.
       */
      requestId?: RequestId;
    }

    /**
     * Parameters of the 'Network.requestServedFromCache' event.
     */
    export interface RequestServedFromCacheEvent {
      /**
       * Request identifier.
       */
      requestId: RequestId;
    }

    /**
     * Parameters of the 'Network.requestWillBeSent' event.
     */
    export interface RequestWillBeSentEvent {
      /**
       * Request identifier.
       */
      requestId: RequestId;

      /**
       * Loader identifier. Empty string if the request is fetched from worker.
       */
      loaderId: LoaderId;

      /**
       * URL of the document this request is loaded for.
       */
      documentURL: string;

      /**
       * Request data.
       */
      request: Request;

      /**
       * Timestamp.
       */
      timestamp: MonotonicTime;

      /**
       * Timestamp.
       */
      wallTime: TimeSinceEpoch;

      /**
       * Request initiator.
       */
      initiator: Initiator;

      /**
       * In the case that redirectResponse is populated, this flag indicates whether
       * requestWillBeSentExtraInfo and responseReceivedExtraInfo events will be or were emitted
       * for the request which was just redirected.
       */
      redirectHasExtraInfo: boolean;

      /**
       * Redirect response data.
       */
      redirectResponse?: Response;

      /**
       * Type of this resource.
       */
      type?: ResourceType;

      /**
       * Frame identifier.
       */
      frameId?: Page.FrameId;

      /**
       * Whether the request is initiated by a user gesture. Defaults to false.
       */
      hasUserGesture?: boolean;
    }

    /**
     * Parameters of the 'Network.resourceChangedPriority' event.
     */
    export interface ResourceChangedPriorityEvent {
      /**
       * Request identifier.
       */
      requestId: RequestId;

      /**
       * New priority
       */
      newPriority: ResourcePriority;

      /**
       * Timestamp.
       */
      timestamp: MonotonicTime;
    }

    /**
     * Parameters of the 'Network.signedExchangeReceived' event.
     */
    export interface SignedExchangeReceivedEvent {
      /**
       * Request identifier.
       */
      requestId: RequestId;

      /**
       * Information about the signed exchange response.
       */
      info: SignedExchangeInfo;
    }

    /**
     * Parameters of the 'Network.responseReceived' event.
     */
    export interface ResponseReceivedEvent {
      /**
       * Request identifier.
       */
      requestId: RequestId;

      /**
       * Loader identifier. Empty string if the request is fetched from worker.
       */
      loaderId: LoaderId;

      /**
       * Timestamp.
       */
      timestamp: MonotonicTime;

      /**
       * Resource type.
       */
      type: ResourceType;

      /**
       * Response data.
       */
      response: Response;

      /**
       * Indicates whether requestWillBeSentExtraInfo and responseReceivedExtraInfo events will be
       * or were emitted for this request.
       */
      hasExtraInfo: boolean;

      /**
       * Frame identifier.
       */
      frameId?: Page.FrameId;
    }

    /**
     * Parameters of the 'Network.webSocketClosed' event.
     */
    export interface WebSocketClosedEvent {
      /**
       * Request identifier.
       */
      requestId: RequestId;

      /**
       * Timestamp.
       */
      timestamp: MonotonicTime;
    }

    /**
     * Parameters of the 'Network.webSocketCreated' event.
     */
    export interface WebSocketCreatedEvent {
      /**
       * Request identifier.
       */
      requestId: RequestId;

      /**
       * WebSocket request URL.
       */
      url: string;

      /**
       * Request initiator.
       */
      initiator?: Initiator;
    }

    /**
     * Parameters of the 'Network.webSocketFrameError' event.
     */
    export interface WebSocketFrameErrorEvent {
      /**
       * Request identifier.
       */
      requestId: RequestId;

      /**
       * Timestamp.
       */
      timestamp: MonotonicTime;

      /**
       * WebSocket error message.
       */
      errorMessage: string;
    }

    /**
     * Parameters of the 'Network.webSocketFrameReceived' event.
     */
    export interface WebSocketFrameReceivedEvent {
      /**
       * Request identifier.
       */
      requestId: RequestId;

      /**
       * Timestamp.
       */
      timestamp: MonotonicTime;

      /**
       * WebSocket response data.
       */
      response: WebSocketFrame;
    }

    /**
     * Parameters of the 'Network.webSocketFrameSent' event.
     */
    export interface WebSocketFrameSentEvent {
      /**
       * Request identifier.
       */
      requestId: RequestId;

      /**
       * Timestamp.
       */
      timestamp: MonotonicTime;

      /**
       * WebSocket response data.
       */
      response: WebSocketFrame;
    }

    /**
     * Parameters of the 'Network.webSocketHandshakeResponseReceived' event.
     */
    export interface WebSocketHandshakeResponseReceivedEvent {
      /**
       * Request identifier.
       */
      requestId: RequestId;

      /**
       * Timestamp.
       */
      timestamp: MonotonicTime;

      /**
       * WebSocket response data.
       */
      response: WebSocketResponse;
    }

    /**
     * Parameters of the 'Network.webSocketWillSendHandshakeRequest' event.
     */
    export interface WebSocketWillSendHandshakeRequestEvent {
      /**
       * Request identifier.
       */
      requestId: RequestId;

      /**
       * Timestamp.
       */
      timestamp: MonotonicTime;

      /**
       * UTC Timestamp.
       */
      wallTime: TimeSinceEpoch;

      /**
       * WebSocket request data.
       */
      request: WebSocketRequest;
    }

    /**
     * Parameters of the 'Network.webTransportCreated' event.
     */
    export interface WebTransportCreatedEvent {
      /**
       * WebTransport identifier.
       */
      transportId: RequestId;

      /**
       * WebTransport request URL.
       */
      url: string;

      /**
       * Timestamp.
       */
      timestamp: MonotonicTime;

      /**
       * Request initiator.
       */
      initiator?: Initiator;
    }

    /**
     * Parameters of the 'Network.webTransportConnectionEstablished' event.
     */
    export interface WebTransportConnectionEstablishedEvent {
      /**
       * WebTransport identifier.
       */
      transportId: RequestId;

      /**
       * Timestamp.
       */
      timestamp: MonotonicTime;
    }

    /**
     * Parameters of the 'Network.webTransportClosed' event.
     */
    export interface WebTransportClosedEvent {
      /**
       * WebTransport identifier.
       */
      transportId: RequestId;

      /**
       * Timestamp.
       */
      timestamp: MonotonicTime;
    }

    /**
     * Parameters of the 'Network.requestWillBeSentExtraInfo' event.
     */
    export interface RequestWillBeSentExtraInfoEvent {
      /**
       * Request identifier. Used to match this information to an existing requestWillBeSent event.
       */
      requestId: RequestId;

      /**
       * A list of cookies potentially associated to the requested URL. This includes both cookies sent with
       * the request and the ones not sent; the latter are distinguished by having blockedReason field set.
       */
      associatedCookies: BlockedCookieWithReason[];

      /**
       * Raw request headers as they will be sent over the wire.
       */
      headers: Headers;

      /**
       * Connection timing information for the request.
       */
      connectTiming: ConnectTiming;

      /**
       * The client security state set for the request.
       */
      clientSecurityState?: ClientSecurityState;

      /**
       * Whether the site has partitioned cookies stored in a partition different than the current one.
       */
      siteHasCookieInOtherPartition?: boolean;
    }

    /**
     * Parameters of the 'Network.responseReceivedExtraInfo' event.
     */
    export interface ResponseReceivedExtraInfoEvent {
      /**
       * Request identifier. Used to match this information to another responseReceived event.
       */
      requestId: RequestId;

      /**
       * A list of cookies which were not stored from the response along with the corresponding
       * reasons for blocking. The cookies here may not be valid due to syntax errors, which
       * are represented by the invalid cookie line string instead of a proper cookie.
       */
      blockedCookies: BlockedSetCookieWithReason[];

      /**
       * Raw response headers as they were received over the wire.
       */
      headers: Headers;

      /**
       * The IP address space of the resource. The address space can only be determined once the transport
       * established the connection, so we can't send it in `requestWillBeSentExtraInfo`.
       */
      resourceIPAddressSpace: IPAddressSpace;

      /**
       * The status code of the response. This is useful in cases the request failed and no responseReceived
       * event is triggered, which is the case for, e.g., CORS errors. This is also the correct status code
       * for cached requests, where the status in responseReceived is a 200 and this will be 304.
       */
      statusCode: integer;

      /**
       * Raw response header text as it was received over the wire. The raw text may not always be
       * available, such as in the case of HTTP/2 or QUIC.
       */
      headersText?: string;

      /**
       * The cookie partition key that will be used to store partitioned cookies set in this response.
       * Only sent when partitioned cookies are enabled.
       */
      cookiePartitionKey?: string;

      /**
       * True if partitioned cookies are enabled, but the partition key is not serializeable to string.
       */
      cookiePartitionKeyOpaque?: boolean;
    }

    /**
     * Parameters of the 'Network.trustTokenOperationDone' event.
     */
    export interface TrustTokenOperationDoneEvent {
      /**
       * Detailed success or error status of the operation.
       * 'AlreadyExists' also signifies a successful operation, as the result
       * of the operation already exists und thus, the operation was abort
       * preemptively (e.g. a cache hit).
       */
      status: 'Ok' | 'InvalidArgument' | 'MissingIssuerKeys' | 'FailedPrecondition' | 'ResourceExhausted' | 'AlreadyExists' | 'Unavailable' | 'Unauthorized' | 'BadResponse' | 'InternalError' | 'UnknownError' | 'FulfilledLocally';

      type: TrustTokenOperationType;

      requestId: RequestId;

      /**
       * Top level origin. The context in which the operation was attempted.
       */
      topLevelOrigin?: string;

      /**
       * Origin of the issuer in case of a "Issuance" or "Redemption" operation.
       */
      issuerOrigin?: string;

      /**
       * The number of obtained Trust Tokens on a successful "Issuance" operation.
       */
      issuedTokenCount?: integer;
    }

    /**
     * Parameters of the 'Network.subresourceWebBundleMetadataReceived' event.
     */
    export interface SubresourceWebBundleMetadataReceivedEvent {
      /**
       * Request identifier. Used to match this information to another event.
       */
      requestId: RequestId;

      /**
       * A list of URLs of resources in the subresource Web Bundle.
       */
      urls: string[];
    }

    /**
     * Parameters of the 'Network.subresourceWebBundleMetadataError' event.
     */
    export interface SubresourceWebBundleMetadataErrorEvent {
      /**
       * Request identifier. Used to match this information to another event.
       */
      requestId: RequestId;

      /**
       * Error message
       */
      errorMessage: string;
    }

    /**
     * Parameters of the 'Network.subresourceWebBundleInnerResponseParsed' event.
     */
    export interface SubresourceWebBundleInnerResponseParsedEvent {
      /**
       * Request identifier of the subresource request
       */
      innerRequestId: RequestId;

      /**
       * URL of the subresource resource.
       */
      innerRequestURL: string;

      /**
       * Bundle request identifier. Used to match this information to another event.
       * This made be absent in case when the instrumentation was enabled only
       * after webbundle was parsed.
       */
      bundleRequestId?: RequestId;
    }

    /**
     * Parameters of the 'Network.subresourceWebBundleInnerResponseError' event.
     */
    export interface SubresourceWebBundleInnerResponseErrorEvent {
      /**
       * Request identifier of the subresource request
       */
      innerRequestId: RequestId;

      /**
       * URL of the subresource resource.
       */
      innerRequestURL: string;

      /**
       * Error message
       */
      errorMessage: string;

      /**
       * Bundle request identifier. Used to match this information to another event.
       * This made be absent in case when the instrumentation was enabled only
       * after webbundle was parsed.
       */
      bundleRequestId?: RequestId;
    }

    /**
     * Parameters of the 'Network.reportingApiReportAdded' event.
     */
    export interface ReportingApiReportAddedEvent {
      report: ReportingApiReport;
    }

    /**
     * Parameters of the 'Network.reportingApiReportUpdated' event.
     */
    export interface ReportingApiReportUpdatedEvent {
      report: ReportingApiReport;
    }

    /**
     * Parameters of the 'Network.reportingApiEndpointsChangedForOrigin' event.
     */
    export interface ReportingApiEndpointsChangedForOriginEvent {
      /**
       * Origin of the document(s) which configured the endpoints.
       */
      origin: string;

      endpoints: ReportingApiEndpoint[];
    }

    /**
     * Resource type as it was perceived by the rendering engine.
     */
    export type ResourceType = 'Document' | 'Stylesheet' | 'Image' | 'Media' | 'Font' | 'Script' | 'TextTrack' | 'XHR' | 'Fetch' | 'Prefetch' | 'EventSource' | 'WebSocket' | 'Manifest' | 'SignedExchange' | 'Ping' | 'CSPViolationReport' | 'Preflight' | 'Other';

    /**
     * Unique loader identifier.
     */
    export type LoaderId = string;

    /**
     * Unique request identifier.
     */
    export type RequestId = string;

    /**
     * Unique intercepted request identifier.
     */
    export type InterceptionId = string;

    /**
     * Network level fetch failure reason.
     */
    export type ErrorReason = 'Failed' | 'Aborted' | 'TimedOut' | 'AccessDenied' | 'ConnectionClosed' | 'ConnectionReset' | 'ConnectionRefused' | 'ConnectionAborted' | 'ConnectionFailed' | 'NameNotResolved' | 'InternetDisconnected' | 'AddressUnreachable' | 'BlockedByClient' | 'BlockedByResponse';

    /**
     * UTC time in seconds, counted from January 1, 1970.
     */
    export type TimeSinceEpoch = number;

    /**
     * Monotonically increasing time in seconds since an arbitrary point in the past.
     */
    export type MonotonicTime = number;

    /**
     * Request / response headers as keys / values of JSON object.
     */
    export interface Headers {
      [key: string]: any;
    }

    /**
     * The underlying connection technology that the browser is supposedly using.
     */
    export type ConnectionType = 'none' | 'cellular2g' | 'cellular3g' | 'cellular4g' | 'bluetooth' | 'ethernet' | 'wifi' | 'wimax' | 'other';

    /**
     * Represents the cookie's 'SameSite' status:
     * https://tools.ietf.org/html/draft-west-first-party-cookies
     */
    export type CookieSameSite = 'Strict' | 'Lax' | 'None';

    /**
     * Represents the cookie's 'Priority' status:
     * https://tools.ietf.org/html/draft-west-cookie-priority-00
     */
    export type CookiePriority = 'Low' | 'Medium' | 'High';

    /**
     * Represents the source scheme of the origin that originally set the cookie.
     * A value of "Unset" allows protocol clients to emulate legacy cookie scope for the scheme.
     * This is a temporary ability and it will be removed in the future.
     */
    export type CookieSourceScheme = 'Unset' | 'NonSecure' | 'Secure';

    /**
     * Timing information for the request.
     */
    export interface ResourceTiming {
      /**
       * Timing's requestTime is a baseline in seconds, while the other numbers are ticks in
       * milliseconds relatively to this requestTime.
       */
      requestTime: number;

      /**
       * Started resolving proxy.
       */
      proxyStart: number;

      /**
       * Finished resolving proxy.
       */
      proxyEnd: number;

      /**
       * Started DNS address resolve.
       */
      dnsStart: number;

      /**
       * Finished DNS address resolve.
       */
      dnsEnd: number;

      /**
       * Started connecting to the remote host.
       */
      connectStart: number;

      /**
       * Connected to the remote host.
       */
      connectEnd: number;

      /**
       * Started SSL handshake.
       */
      sslStart: number;

      /**
       * Finished SSL handshake.
       */
      sslEnd: number;

      /**
       * Started running ServiceWorker.
       */
      workerStart: number;

      /**
       * Finished Starting ServiceWorker.
       */
      workerReady: number;

      /**
       * Started fetch event.
       */
      workerFetchStart: number;

      /**
       * Settled fetch event respondWith promise.
       */
      workerRespondWithSettled: number;

      /**
       * Started sending request.
       */
      sendStart: number;

      /**
       * Finished sending request.
       */
      sendEnd: number;

      /**
       * Time the server started pushing request.
       */
      pushStart: number;

      /**
       * Time the server finished pushing request.
       */
      pushEnd: number;

      /**
       * Started receiving response headers.
       */
      receiveHeadersStart: number;

      /**
       * Finished receiving response headers.
       */
      receiveHeadersEnd: number;
    }

    /**
     * Loading priority of a resource request.
     */
    export type ResourcePriority = 'VeryLow' | 'Low' | 'Medium' | 'High' | 'VeryHigh';

    /**
     * Post data entry for HTTP request
     */
    export interface PostDataEntry {
      bytes?: string;
    }

    /**
     * HTTP request data.
     */
    export interface Request {
      /**
       * Request URL (without fragment).
       */
      url: string;

      /**
       * Fragment of the requested URL starting with hash, if present.
       */
      urlFragment?: string;

      /**
       * HTTP request method.
       */
      method: string;

      /**
       * HTTP request headers.
       */
      headers: Headers;

      /**
       * HTTP POST request data.
       */
      postData?: string;

      /**
       * True when the request has POST data. Note that postData might still be omitted when this flag is true when the data is too long.
       */
      hasPostData?: boolean;

      /**
       * Request body elements. This will be converted from base64 to binary
       */
      postDataEntries?: PostDataEntry[];

      /**
       * The mixed content type of the request.
       */
      mixedContentType?: Security.MixedContentType;

      /**
       * Priority of the resource request at the time request is sent.
       */
      initialPriority: ResourcePriority;

      /**
       * The referrer policy of the request, as defined in https://www.w3.org/TR/referrer-policy/
       */
      referrerPolicy: 'unsafe-url' | 'no-referrer-when-downgrade' | 'no-referrer' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin';

      /**
       * Whether is loaded via link preload.
       */
      isLinkPreload?: boolean;

      /**
       * Set for requests when the TrustToken API is used. Contains the parameters
       * passed by the developer (e.g. via "fetch") as understood by the backend.
       */
      trustTokenParams?: TrustTokenParams;

      /**
       * True if this resource request is considered to be the 'same site' as the
       * request correspondinfg to the main frame.
       */
      isSameSite?: boolean;
    }

    /**
     * Details of a signed certificate timestamp (SCT).
     */
    export interface SignedCertificateTimestamp {
      /**
       * Validation status.
       */
      status: string;

      /**
       * Origin.
       */
      origin: string;

      /**
       * Log name / description.
       */
      logDescription: string;

      /**
       * Log ID.
       */
      logId: string;

      /**
       * Issuance date. Unlike TimeSinceEpoch, this contains the number of
       * milliseconds since January 1, 1970, UTC, not the number of seconds.
       */
      timestamp: number;

      /**
       * Hash algorithm.
       */
      hashAlgorithm: string;

      /**
       * Signature algorithm.
       */
      signatureAlgorithm: string;

      /**
       * Signature data.
       */
      signatureData: string;
    }

    /**
     * Security details about a request.
     */
    export interface SecurityDetails {
      /**
       * Protocol name (e.g. "TLS 1.2" or "QUIC").
       */
      protocol: string;

      /**
       * Key Exchange used by the connection, or the empty string if not applicable.
       */
      keyExchange: string;

      /**
       * (EC)DH group used by the connection, if applicable.
       */
      keyExchangeGroup?: string;

      /**
       * Cipher name.
       */
      cipher: string;

      /**
       * TLS MAC. Note that AEAD ciphers do not have separate MACs.
       */
      mac?: string;

      /**
       * Certificate ID value.
       */
      certificateId: Security.CertificateId;

      /**
       * Certificate subject name.
       */
      subjectName: string;

      /**
       * Subject Alternative Name (SAN) DNS names and IP addresses.
       */
      sanList: string[];

      /**
       * Name of the issuing CA.
       */
      issuer: string;

      /**
       * Certificate valid from date.
       */
      validFrom: TimeSinceEpoch;

      /**
       * Certificate valid to (expiration) date
       */
      validTo: TimeSinceEpoch;

      /**
       * List of signed certificate timestamps (SCTs).
       */
      signedCertificateTimestampList: SignedCertificateTimestamp[];

      /**
       * Whether the request complied with Certificate Transparency policy
       */
      certificateTransparencyCompliance: CertificateTransparencyCompliance;

      /**
       * The signature algorithm used by the server in the TLS server signature,
       * represented as a TLS SignatureScheme code point. Omitted if not
       * applicable or not known.
       */
      serverSignatureAlgorithm?: integer;

      /**
       * Whether the connection used Encrypted ClientHello
       */
      encryptedClientHello: boolean;
    }

    /**
     * Whether the request complied with Certificate Transparency policy.
     */
    export type CertificateTransparencyCompliance = 'unknown' | 'not-compliant' | 'compliant';

    /**
     * The reason why request was blocked.
     */
    export type BlockedReason = 'other' | 'csp' | 'mixed-content' | 'origin' | 'inspector' | 'subresource-filter' | 'content-type' | 'coep-frame-resource-needs-coep-header' | 'coop-sandboxed-iframe-cannot-navigate-to-coop-page' | 'corp-not-same-origin' | 'corp-not-same-origin-after-defaulted-to-same-origin-by-coep' | 'corp-not-same-site';

    /**
     * The reason why request was blocked.
     */
    export type CorsError = 'DisallowedByMode' | 'InvalidResponse' | 'WildcardOriginNotAllowed' | 'MissingAllowOriginHeader' | 'MultipleAllowOriginValues' | 'InvalidAllowOriginValue' | 'AllowOriginMismatch' | 'InvalidAllowCredentials' | 'CorsDisabledScheme' | 'PreflightInvalidStatus' | 'PreflightDisallowedRedirect' | 'PreflightWildcardOriginNotAllowed' | 'PreflightMissingAllowOriginHeader' | 'PreflightMultipleAllowOriginValues' | 'PreflightInvalidAllowOriginValue' | 'PreflightAllowOriginMismatch' | 'PreflightInvalidAllowCredentials' | 'PreflightMissingAllowExternal' | 'PreflightInvalidAllowExternal' | 'PreflightMissingAllowPrivateNetwork' | 'PreflightInvalidAllowPrivateNetwork' | 'InvalidAllowMethodsPreflightResponse' | 'InvalidAllowHeadersPreflightResponse' | 'MethodDisallowedByPreflightResponse' | 'HeaderDisallowedByPreflightResponse' | 'RedirectContainsCredentials' | 'InsecurePrivateNetwork' | 'InvalidPrivateNetworkAccess' | 'UnexpectedPrivateNetworkAccess' | 'NoCorsRedirectModeNotFollow' | 'PreflightMissingPrivateNetworkAccessId' | 'PreflightMissingPrivateNetworkAccessName' | 'PrivateNetworkAccessPermissionUnavailable' | 'PrivateNetworkAccessPermissionDenied';

    export interface CorsErrorStatus {
      corsError: CorsError;

      failedParameter: string;
    }

    /**
     * Source of serviceworker response.
     */
    export type ServiceWorkerResponseSource = 'cache-storage' | 'http-cache' | 'fallback-code' | 'network';

    /**
     * Determines what type of Trust Token operation is executed and
     * depending on the type, some additional parameters. The values
     * are specified in third_party/blink/renderer/core/fetch/trust_token.idl.
     */
    export interface TrustTokenParams {
      operation: TrustTokenOperationType;

      /**
       * Only set for "token-redemption" operation and determine whether
       * to request a fresh SRR or use a still valid cached SRR.
       */
      refreshPolicy: 'UseCached' | 'Refresh';

      /**
       * Origins of issuers from whom to request tokens or redemption
       * records.
       */
      issuers?: string[];
    }

    export type TrustTokenOperationType = 'Issuance' | 'Redemption' | 'Signing';

    /**
     * The reason why Chrome uses a specific transport protocol for HTTP semantics.
     */
    export type AlternateProtocolUsage = 'alternativeJobWonWithoutRace' | 'alternativeJobWonRace' | 'mainJobWonRace' | 'mappingMissing' | 'broken' | 'dnsAlpnH3JobWonWithoutRace' | 'dnsAlpnH3JobWonRace' | 'unspecifiedReason';

    export interface ServiceWorkerRouterInfo {
      ruleIdMatched: integer;
    }

    /**
     * HTTP response data.
     */
    export interface Response {
      /**
       * Response URL. This URL can be different from CachedResource.url in case of redirect.
       */
      url: string;

      /**
       * HTTP response status code.
       */
      status: integer;

      /**
       * HTTP response status text.
       */
      statusText: string;

      /**
       * HTTP response headers.
       */
      headers: Headers;

      /**
       * HTTP response headers text. This has been replaced by the headers in Network.responseReceivedExtraInfo.
       * @deprecated
       */
      headersText?: string;

      /**
       * Resource mimeType as determined by the browser.
       */
      mimeType: string;

      /**
       * Refined HTTP request headers that were actually transmitted over the network.
       */
      requestHeaders?: Headers;

      /**
       * HTTP request headers text. This has been replaced by the headers in Network.requestWillBeSentExtraInfo.
       * @deprecated
       */
      requestHeadersText?: string;

      /**
       * Specifies whether physical connection was actually reused for this request.
       */
      connectionReused: boolean;

      /**
       * Physical connection id that was actually used for this request.
       */
      connectionId: number;

      /**
       * Remote IP address.
       */
      remoteIPAddress?: string;

      /**
       * Remote port.
       */
      remotePort?: integer;

      /**
       * Specifies that the request was served from the disk cache.
       */
      fromDiskCache?: boolean;

      /**
       * Specifies that the request was served from the ServiceWorker.
       */
      fromServiceWorker?: boolean;

      /**
       * Specifies that the request was served from the prefetch cache.
       */
      fromPrefetchCache?: boolean;

      /**
       * Infomation about how Service Worker Static Router was used.
       */
      serviceWorkerRouterInfo?: ServiceWorkerRouterInfo;

      /**
       * Total number of bytes received for this request so far.
       */
      encodedDataLength: number;

      /**
       * Timing information for the given request.
       */
      timing?: ResourceTiming;

      /**
       * Response source of response from ServiceWorker.
       */
      serviceWorkerResponseSource?: ServiceWorkerResponseSource;

      /**
       * The time at which the returned response was generated.
       */
      responseTime?: TimeSinceEpoch;

      /**
       * Cache Storage Cache Name.
       */
      cacheStorageCacheName?: string;

      /**
       * Protocol used to fetch this request.
       */
      protocol?: string;

      /**
       * The reason why Chrome uses a specific transport protocol for HTTP semantics.
       */
      alternateProtocolUsage?: AlternateProtocolUsage;

      /**
       * Security state of the request resource.
       */
      securityState: Security.SecurityState;

      /**
       * Security details for the request.
       */
      securityDetails?: SecurityDetails;
    }

    /**
     * WebSocket request data.
     */
    export interface WebSocketRequest {
      /**
       * HTTP request headers.
       */
      headers: Headers;
    }

    /**
     * WebSocket response data.
     */
    export interface WebSocketResponse {
      /**
       * HTTP response status code.
       */
      status: integer;

      /**
       * HTTP response status text.
       */
      statusText: string;

      /**
       * HTTP response headers.
       */
      headers: Headers;

      /**
       * HTTP response headers text.
       */
      headersText?: string;

      /**
       * HTTP request headers.
       */
      requestHeaders?: Headers;

      /**
       * HTTP request headers text.
       */
      requestHeadersText?: string;
    }

    /**
     * WebSocket message data. This represents an entire WebSocket message, not just a fragmented frame as the name suggests.
     */
    export interface WebSocketFrame {
      /**
       * WebSocket message opcode.
       */
      opcode: number;

      /**
       * WebSocket message mask.
       */
      mask: boolean;

      /**
       * WebSocket message payload data.
       * If the opcode is 1, this is a text message and payloadData is a UTF-8 string.
       * If the opcode isn't 1, then payloadData is a base64 encoded string representing binary data.
       */
      payloadData: string;
    }

    /**
     * Information about the cached resource.
     */
    export interface CachedResource {
      /**
       * Resource URL. This is the url of the original network request.
       */
      url: string;

      /**
       * Type of this resource.
       */
      type: ResourceType;

      /**
       * Cached response data.
       */
      response?: Response;

      /**
       * Cached response body size.
       */
      bodySize: number;
    }

    /**
     * Information about the request initiator.
     */
    export interface Initiator {
      /**
       * Type of this initiator.
       */
      type: 'parser' | 'script' | 'preload' | 'SignedExchange' | 'preflight' | 'other';

      /**
       * Initiator JavaScript stack trace, set for Script only.
       */
      stack?: CdpV8.Runtime.StackTrace;

      /**
       * Initiator URL, set for Parser type or for Script type (when script is importing module) or for SignedExchange type.
       */
      url?: string;

      /**
       * Initiator line number, set for Parser type or for Script type (when script is importing
       * module) (0-based).
       */
      lineNumber?: number;

      /**
       * Initiator column number, set for Parser type or for Script type (when script is importing
       * module) (0-based).
       */
      columnNumber?: number;

      /**
       * Set if another request triggered this request (e.g. preflight).
       */
      requestId?: RequestId;
    }

    /**
     * Cookie object
     */
    export interface Cookie {
      /**
       * Cookie name.
       */
      name: string;

      /**
       * Cookie value.
       */
      value: string;

      /**
       * Cookie domain.
       */
      domain: string;

      /**
       * Cookie path.
       */
      path: string;

      /**
       * Cookie expiration date as the number of seconds since the UNIX epoch.
       */
      expires: number;

      /**
       * Cookie size.
       */
      size: integer;

      /**
       * True if cookie is http-only.
       */
      httpOnly: boolean;

      /**
       * True if cookie is secure.
       */
      secure: boolean;

      /**
       * True in case of session cookie.
       */
      session: boolean;

      /**
       * Cookie SameSite type.
       */
      sameSite?: CookieSameSite;

      /**
       * Cookie Priority
       */
      priority: CookiePriority;

      /**
       * True if cookie is SameParty.
       * @deprecated
       */
      sameParty: boolean;

      /**
       * Cookie source scheme type.
       */
      sourceScheme: CookieSourceScheme;

      /**
       * Cookie source port. Valid values are {-1, [1, 65535]}, -1 indicates an unspecified port.
       * An unspecified port value allows protocol clients to emulate legacy cookie scope for the port.
       * This is a temporary ability and it will be removed in the future.
       */
      sourcePort: integer;

      /**
       * Cookie partition key. The site of the top-level URL the browser was visiting at the start
       * of the request to the endpoint that set the cookie.
       */
      partitionKey?: string;

      /**
       * True if cookie partition key is opaque.
       */
      partitionKeyOpaque?: boolean;
    }

    /**
     * Types of reasons why a cookie may not be stored from a response.
     */
    export type SetCookieBlockedReason = 'SecureOnly' | 'SameSiteStrict' | 'SameSiteLax' | 'SameSiteUnspecifiedTreatedAsLax' | 'SameSiteNoneInsecure' | 'UserPreferences' | 'ThirdPartyPhaseout' | 'ThirdPartyBlockedInFirstPartySet' | 'SyntaxError' | 'SchemeNotSupported' | 'OverwriteSecure' | 'InvalidDomain' | 'InvalidPrefix' | 'UnknownError' | 'SchemefulSameSiteStrict' | 'SchemefulSameSiteLax' | 'SchemefulSameSiteUnspecifiedTreatedAsLax' | 'SamePartyFromCrossPartyContext' | 'SamePartyConflictsWithOtherAttributes' | 'NameValuePairExceedsMaxSize' | 'DisallowedCharacter' | 'NoCookieContent';

    /**
     * Types of reasons why a cookie may not be sent with a request.
     */
    export type CookieBlockedReason = 'SecureOnly' | 'NotOnPath' | 'DomainMismatch' | 'SameSiteStrict' | 'SameSiteLax' | 'SameSiteUnspecifiedTreatedAsLax' | 'SameSiteNoneInsecure' | 'UserPreferences' | 'ThirdPartyPhaseout' | 'ThirdPartyBlockedInFirstPartySet' | 'UnknownError' | 'SchemefulSameSiteStrict' | 'SchemefulSameSiteLax' | 'SchemefulSameSiteUnspecifiedTreatedAsLax' | 'SamePartyFromCrossPartyContext' | 'NameValuePairExceedsMaxSize';

    /**
     * A cookie which was not stored from a response with the corresponding reason.
     */
    export interface BlockedSetCookieWithReason {
      /**
       * The reason(s) this cookie was blocked.
       */
      blockedReasons: SetCookieBlockedReason[];

      /**
       * The string representing this individual cookie as it would appear in the header.
       * This is not the entire "cookie" or "set-cookie" header which could have multiple cookies.
       */
      cookieLine: string;

      /**
       * The cookie object which represents the cookie which was not stored. It is optional because
       * sometimes complete cookie information is not available, such as in the case of parsing
       * errors.
       */
      cookie?: Cookie;
    }

    /**
     * A cookie with was not sent with a request with the corresponding reason.
     */
    export interface BlockedCookieWithReason {
      /**
       * The reason(s) the cookie was blocked.
       */
      blockedReasons: CookieBlockedReason[];

      /**
       * The cookie object representing the cookie which was not sent.
       */
      cookie: Cookie;
    }

    /**
     * Cookie parameter object
     */
    export interface CookieParam {
      /**
       * Cookie name.
       */
      name: string;

      /**
       * Cookie value.
       */
      value: string;

      /**
       * The request-URI to associate with the setting of the cookie. This value can affect the
       * default domain, path, source port, and source scheme values of the created cookie.
       */
      url?: string;

      /**
       * Cookie domain.
       */
      domain?: string;

      /**
       * Cookie path.
       */
      path?: string;

      /**
       * True if cookie is secure.
       */
      secure?: boolean;

      /**
       * True if cookie is http-only.
       */
      httpOnly?: boolean;

      /**
       * Cookie SameSite type.
       */
      sameSite?: CookieSameSite;

      /**
       * Cookie expiration date, session cookie if not set
       */
      expires?: TimeSinceEpoch;

      /**
       * Cookie Priority.
       */
      priority?: CookiePriority;

      /**
       * True if cookie is SameParty.
       */
      sameParty?: boolean;

      /**
       * Cookie source scheme type.
       */
      sourceScheme?: CookieSourceScheme;

      /**
       * Cookie source port. Valid values are {-1, [1, 65535]}, -1 indicates an unspecified port.
       * An unspecified port value allows protocol clients to emulate legacy cookie scope for the port.
       * This is a temporary ability and it will be removed in the future.
       */
      sourcePort?: integer;

      /**
       * Cookie partition key. The site of the top-level URL the browser was visiting at the start
       * of the request to the endpoint that set the cookie.
       * If not set, the cookie will be set as not partitioned.
       */
      partitionKey?: string;
    }

    /**
     * Authorization challenge for HTTP status code 401 or 407.
     */
    export interface AuthChallenge {
      /**
       * Source of the authentication challenge.
       */
      source?: 'Server' | 'Proxy';

      /**
       * Origin of the challenger.
       */
      origin: string;

      /**
       * The authentication scheme used, such as basic or digest
       */
      scheme: string;

      /**
       * The realm of the challenge. May be empty.
       */
      realm: string;
    }

    /**
     * Response to an AuthChallenge.
     */
    export interface AuthChallengeResponse {
      /**
       * The decision on what to do in response to the authorization challenge.  Default means
       * deferring to the default behavior of the net stack, which will likely either the Cancel
       * authentication or display a popup dialog box.
       */
      response: 'Default' | 'CancelAuth' | 'ProvideCredentials';

      /**
       * The username to provide, possibly empty. Should only be set if response is
       * ProvideCredentials.
       */
      username?: string;

      /**
       * The password to provide, possibly empty. Should only be set if response is
       * ProvideCredentials.
       */
      password?: string;
    }

    /**
     * Stages of the interception to begin intercepting. Request will intercept before the request is
     * sent. Response will intercept after the response is received.
     */
    export type InterceptionStage = 'Request' | 'HeadersReceived';

    /**
     * Request pattern for interception.
     */
    export interface RequestPattern {
      /**
       * Wildcards (`'*'` -> zero or more, `'?'` -> exactly one) are allowed. Escape character is
       * backslash. Omitting is equivalent to `"*"`.
       */
      urlPattern?: string;

      /**
       * If set, only requests for matching resource types will be intercepted.
       */
      resourceType?: ResourceType;

      /**
       * Stage at which to begin intercepting requests. Default is Request.
       */
      interceptionStage?: InterceptionStage;
    }

    /**
     * Information about a signed exchange signature.
     * https://wicg.github.io/webpackage/draft-yasskin-httpbis-origin-signed-exchanges-impl.html#rfc.section.3.1
     */
    export interface SignedExchangeSignature {
      /**
       * Signed exchange signature label.
       */
      label: string;

      /**
       * The hex string of signed exchange signature.
       */
      signature: string;

      /**
       * Signed exchange signature integrity.
       */
      integrity: string;

      /**
       * Signed exchange signature cert Url.
       */
      certUrl?: string;

      /**
       * The hex string of signed exchange signature cert sha256.
       */
      certSha256?: string;

      /**
       * Signed exchange signature validity Url.
       */
      validityUrl: string;

      /**
       * Signed exchange signature date.
       */
      date: integer;

      /**
       * Signed exchange signature expires.
       */
      expires: integer;

      /**
       * The encoded certificates.
       */
      certificates?: string[];
    }

    /**
     * Information about a signed exchange header.
     * https://wicg.github.io/webpackage/draft-yasskin-httpbis-origin-signed-exchanges-impl.html#cbor-representation
     */
    export interface SignedExchangeHeader {
      /**
       * Signed exchange request URL.
       */
      requestUrl: string;

      /**
       * Signed exchange response code.
       */
      responseCode: integer;

      /**
       * Signed exchange response headers.
       */
      responseHeaders: Headers;

      /**
       * Signed exchange response signature.
       */
      signatures: SignedExchangeSignature[];

      /**
       * Signed exchange header integrity hash in the form of `sha256-<base64-hash-value>`.
       */
      headerIntegrity: string;
    }

    /**
     * Field type for a signed exchange related error.
     */
    export type SignedExchangeErrorField = 'signatureSig' | 'signatureIntegrity' | 'signatureCertUrl' | 'signatureCertSha256' | 'signatureValidityUrl' | 'signatureTimestamps';

    /**
     * Information about a signed exchange response.
     */
    export interface SignedExchangeError {
      /**
       * Error message.
       */
      message: string;

      /**
       * The index of the signature which caused the error.
       */
      signatureIndex?: integer;

      /**
       * The field which caused the error.
       */
      errorField?: SignedExchangeErrorField;
    }

    /**
     * Information about a signed exchange response.
     */
    export interface SignedExchangeInfo {
      /**
       * The outer response of signed HTTP exchange which was received from network.
       */
      outerResponse: Response;

      /**
       * Information about the signed exchange header.
       */
      header?: SignedExchangeHeader;

      /**
       * Security details for the signed exchange header.
       */
      securityDetails?: SecurityDetails;

      /**
       * Errors occurred while handling the signed exchagne.
       */
      errors?: SignedExchangeError[];
    }

    /**
     * List of content encodings supported by the backend.
     */
    export type ContentEncoding = 'deflate' | 'gzip' | 'br' | 'zstd';

    export type PrivateNetworkRequestPolicy = 'Allow' | 'BlockFromInsecureToMorePrivate' | 'WarnFromInsecureToMorePrivate' | 'PreflightBlock' | 'PreflightWarn';

    export type IPAddressSpace = 'Local' | 'Private' | 'Public' | 'Unknown';

    export interface ConnectTiming {
      /**
       * Timing's requestTime is a baseline in seconds, while the other numbers are ticks in
       * milliseconds relatively to this requestTime. Matches ResourceTiming's requestTime for
       * the same request (but not for redirected requests).
       */
      requestTime: number;
    }

    export interface ClientSecurityState {
      initiatorIsSecureContext: boolean;

      initiatorIPAddressSpace: IPAddressSpace;

      privateNetworkRequestPolicy: PrivateNetworkRequestPolicy;
    }

    export type CrossOriginOpenerPolicyValue = 'SameOrigin' | 'SameOriginAllowPopups' | 'RestrictProperties' | 'UnsafeNone' | 'SameOriginPlusCoep' | 'RestrictPropertiesPlusCoep';

    export interface CrossOriginOpenerPolicyStatus {
      value: CrossOriginOpenerPolicyValue;

      reportOnlyValue: CrossOriginOpenerPolicyValue;

      reportingEndpoint?: string;

      reportOnlyReportingEndpoint?: string;
    }

    export type CrossOriginEmbedderPolicyValue = 'None' | 'Credentialless' | 'RequireCorp';

    export interface CrossOriginEmbedderPolicyStatus {
      value: CrossOriginEmbedderPolicyValue;

      reportOnlyValue: CrossOriginEmbedderPolicyValue;

      reportingEndpoint?: string;

      reportOnlyReportingEndpoint?: string;
    }

    export type ContentSecurityPolicySource = 'HTTP' | 'Meta';

    export interface ContentSecurityPolicyStatus {
      effectiveDirectives: string;

      isEnforced: boolean;

      source: ContentSecurityPolicySource;
    }

    export interface SecurityIsolationStatus {
      coop?: CrossOriginOpenerPolicyStatus;

      coep?: CrossOriginEmbedderPolicyStatus;

      csp?: ContentSecurityPolicyStatus[];
    }

    /**
     * The status of a Reporting API report.
     */
    export type ReportStatus = 'Queued' | 'Pending' | 'MarkedForRemoval' | 'Success';

    export type ReportId = string;

    /**
     * An object representing a report generated by the Reporting API.
     */
    export interface ReportingApiReport {
      id: ReportId;

      /**
       * The URL of the document that triggered the report.
       */
      initiatorUrl: string;

      /**
       * The name of the endpoint group that should be used to deliver the report.
       */
      destination: string;

      /**
       * The type of the report (specifies the set of data that is contained in the report body).
       */
      type: string;

      /**
       * When the report was generated.
       */
      timestamp: Network.TimeSinceEpoch;

      /**
       * How many uploads deep the related request was.
       */
      depth: integer;

      /**
       * The number of delivery attempts made so far, not including an active attempt.
       */
      completedAttempts: integer;

      body: Record<string, unknown>;

      status: ReportStatus;
    }

    export interface ReportingApiEndpoint {
      /**
       * The URL of the endpoint to which reports may be delivered.
       */
      url: string;

      /**
       * Name of the endpoint group.
       */
      groupName: string;
    }

    /**
     * An object providing the result of a network resource load.
     */
    export interface LoadNetworkResourcePageResult {
      success: boolean;

      /**
       * Optional values used for error reporting.
       */
      netError?: number;

      netErrorName?: string;

      httpStatusCode?: number;

      /**
       * If successful, one of the following two fields holds the result.
       */
      stream?: IO.StreamHandle;

      /**
       * Response headers.
       */
      headers?: Network.Headers;
    }

    /**
     * An options object that may be extended later to better support CORS,
     * CORB and streaming.
     */
    export interface LoadNetworkResourceOptions {
      disableCache: boolean;

      includeCredentials: boolean;
    }
  }

  /**
   * Methods and events of the 'Overlay' domain.
   */
  export interface OverlayApi {
    requests: {
      /**
       * Disables domain notifications.
       */
      disable: { params: Overlay.DisableParams, result: Overlay.DisableResult }

      /**
       * Enables domain notifications.
       */
      enable: { params: Overlay.EnableParams, result: Overlay.EnableResult }

      /**
       * For testing.
       */
      getHighlightObjectForTest: { params: Overlay.GetHighlightObjectForTestParams, result: Overlay.GetHighlightObjectForTestResult }

      /**
       * For Persistent Grid testing.
       */
      getGridHighlightObjectsForTest: { params: Overlay.GetGridHighlightObjectsForTestParams, result: Overlay.GetGridHighlightObjectsForTestResult }

      /**
       * For Source Order Viewer testing.
       */
      getSourceOrderHighlightObjectForTest: { params: Overlay.GetSourceOrderHighlightObjectForTestParams, result: Overlay.GetSourceOrderHighlightObjectForTestResult }

      /**
       * Hides any highlight.
       */
      hideHighlight: { params: Overlay.HideHighlightParams, result: Overlay.HideHighlightResult }

      /**
       * Highlights owner element of the frame with given id.
       * Deprecated: Doesn't work reliablity and cannot be fixed due to process
       * separatation (the owner node might be in a different process). Determine
       * the owner node in the client and use highlightNode.
       * @deprecated
       */
      highlightFrame: { params: Overlay.HighlightFrameParams, result: Overlay.HighlightFrameResult }

      /**
       * Highlights DOM node with given id or with the given JavaScript object wrapper. Either nodeId or
       * objectId must be specified.
       */
      highlightNode: { params: Overlay.HighlightNodeParams, result: Overlay.HighlightNodeResult }

      /**
       * Highlights given quad. Coordinates are absolute with respect to the main frame viewport.
       */
      highlightQuad: { params: Overlay.HighlightQuadParams, result: Overlay.HighlightQuadResult }

      /**
       * Highlights given rectangle. Coordinates are absolute with respect to the main frame viewport.
       */
      highlightRect: { params: Overlay.HighlightRectParams, result: Overlay.HighlightRectResult }

      /**
       * Highlights the source order of the children of the DOM node with given id or with the given
       * JavaScript object wrapper. Either nodeId or objectId must be specified.
       */
      highlightSourceOrder: { params: Overlay.HighlightSourceOrderParams, result: Overlay.HighlightSourceOrderResult }

      /**
       * Enters the 'inspect' mode. In this mode, elements that user is hovering over are highlighted.
       * Backend then generates 'inspectNodeRequested' event upon element selection.
       */
      setInspectMode: { params: Overlay.SetInspectModeParams, result: Overlay.SetInspectModeResult }

      /**
       * Highlights owner element of all frames detected to be ads.
       */
      setShowAdHighlights: { params: Overlay.SetShowAdHighlightsParams, result: Overlay.SetShowAdHighlightsResult }

      setPausedInDebuggerMessage: { params: Overlay.SetPausedInDebuggerMessageParams, result: Overlay.SetPausedInDebuggerMessageResult }

      /**
       * Requests that backend shows debug borders on layers
       */
      setShowDebugBorders: { params: Overlay.SetShowDebugBordersParams, result: Overlay.SetShowDebugBordersResult }

      /**
       * Requests that backend shows the FPS counter
       */
      setShowFPSCounter: { params: Overlay.SetShowFPSCounterParams, result: Overlay.SetShowFPSCounterResult }

      /**
       * Highlight multiple elements with the CSS Grid overlay.
       */
      setShowGridOverlays: { params: Overlay.SetShowGridOverlaysParams, result: Overlay.SetShowGridOverlaysResult }

      setShowFlexOverlays: { params: Overlay.SetShowFlexOverlaysParams, result: Overlay.SetShowFlexOverlaysResult }

      setShowScrollSnapOverlays: { params: Overlay.SetShowScrollSnapOverlaysParams, result: Overlay.SetShowScrollSnapOverlaysResult }

      setShowContainerQueryOverlays: { params: Overlay.SetShowContainerQueryOverlaysParams, result: Overlay.SetShowContainerQueryOverlaysResult }

      /**
       * Requests that backend shows paint rectangles
       */
      setShowPaintRects: { params: Overlay.SetShowPaintRectsParams, result: Overlay.SetShowPaintRectsResult }

      /**
       * Requests that backend shows layout shift regions
       */
      setShowLayoutShiftRegions: { params: Overlay.SetShowLayoutShiftRegionsParams, result: Overlay.SetShowLayoutShiftRegionsResult }

      /**
       * Requests that backend shows scroll bottleneck rects
       */
      setShowScrollBottleneckRects: { params: Overlay.SetShowScrollBottleneckRectsParams, result: Overlay.SetShowScrollBottleneckRectsResult }

      /**
       * Deprecated, no longer has any effect.
       * @deprecated
       */
      setShowHitTestBorders: { params: Overlay.SetShowHitTestBordersParams, result: Overlay.SetShowHitTestBordersResult }

      /**
       * Request that backend shows an overlay with web vital metrics.
       */
      setShowWebVitals: { params: Overlay.SetShowWebVitalsParams, result: Overlay.SetShowWebVitalsResult }

      /**
       * Paints viewport size upon main frame resize.
       */
      setShowViewportSizeOnResize: { params: Overlay.SetShowViewportSizeOnResizeParams, result: Overlay.SetShowViewportSizeOnResizeResult }

      /**
       * Add a dual screen device hinge
       */
      setShowHinge: { params: Overlay.SetShowHingeParams, result: Overlay.SetShowHingeResult }

      /**
       * Show elements in isolation mode with overlays.
       */
      setShowIsolatedElements: { params: Overlay.SetShowIsolatedElementsParams, result: Overlay.SetShowIsolatedElementsResult }

      /**
       * Show Window Controls Overlay for PWA
       */
      setShowWindowControlsOverlay: { params: Overlay.SetShowWindowControlsOverlayParams, result: Overlay.SetShowWindowControlsOverlayResult }
    };
    events: {

      /**
       * Fired when the node should be inspected. This happens after call to `setInspectMode` or when
       * user manually inspects an element.
       */
      inspectNodeRequested: { params: Overlay.InspectNodeRequestedEvent };

      /**
       * Fired when the node should be highlighted. This happens after call to `setInspectMode`.
       */
      nodeHighlightRequested: { params: Overlay.NodeHighlightRequestedEvent };

      /**
       * Fired when user asks to capture screenshot of some area on the page.
       */
      screenshotRequested: { params: Overlay.ScreenshotRequestedEvent };

      /**
       * Fired when user cancels the inspect mode.
       */
      inspectModeCanceled: { params: Overlay.InspectModeCanceledEvent };
    };
  }

  /**
   * Types of the 'Overlay' domain.
   */
  export namespace Overlay {
    /**
     * Parameters of the 'Overlay.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'Overlay.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'Overlay.enable' method.
     */
    export interface EnableParams {
    }

    /**
     * Return value of the 'Overlay.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'Overlay.getHighlightObjectForTest' method.
     */
    export interface GetHighlightObjectForTestParams {
      /**
       * Id of the node to get highlight object for.
       */
      nodeId: DOM.NodeId;

      /**
       * Whether to include distance info.
       */
      includeDistance?: boolean;

      /**
       * Whether to include style info.
       */
      includeStyle?: boolean;

      /**
       * The color format to get config with (default: hex).
       */
      colorFormat?: ColorFormat;

      /**
       * Whether to show accessibility info (default: true).
       */
      showAccessibilityInfo?: boolean;
    }

    /**
     * Return value of the 'Overlay.getHighlightObjectForTest' method.
     */
    export interface GetHighlightObjectForTestResult {
      /**
       * Highlight data for the node.
       */
      highlight: Record<string, unknown>;
    }

    /**
     * Parameters of the 'Overlay.getGridHighlightObjectsForTest' method.
     */
    export interface GetGridHighlightObjectsForTestParams {
      /**
       * Ids of the node to get highlight object for.
       */
      nodeIds: DOM.NodeId[];
    }

    /**
     * Return value of the 'Overlay.getGridHighlightObjectsForTest' method.
     */
    export interface GetGridHighlightObjectsForTestResult {
      /**
       * Grid Highlight data for the node ids provided.
       */
      highlights: Record<string, unknown>;
    }

    /**
     * Parameters of the 'Overlay.getSourceOrderHighlightObjectForTest' method.
     */
    export interface GetSourceOrderHighlightObjectForTestParams {
      /**
       * Id of the node to highlight.
       */
      nodeId: DOM.NodeId;
    }

    /**
     * Return value of the 'Overlay.getSourceOrderHighlightObjectForTest' method.
     */
    export interface GetSourceOrderHighlightObjectForTestResult {
      /**
       * Source order highlight data for the node id provided.
       */
      highlight: Record<string, unknown>;
    }

    /**
     * Parameters of the 'Overlay.hideHighlight' method.
     */
    export interface HideHighlightParams {
    }

    /**
     * Return value of the 'Overlay.hideHighlight' method.
     */
    export interface HideHighlightResult {
    }

    /**
     * Parameters of the 'Overlay.highlightFrame' method.
     */
    export interface HighlightFrameParams {
      /**
       * Identifier of the frame to highlight.
       */
      frameId: Page.FrameId;

      /**
       * The content box highlight fill color (default: transparent).
       */
      contentColor?: DOM.RGBA;

      /**
       * The content box highlight outline color (default: transparent).
       */
      contentOutlineColor?: DOM.RGBA;
    }

    /**
     * Return value of the 'Overlay.highlightFrame' method.
     */
    export interface HighlightFrameResult {
    }

    /**
     * Parameters of the 'Overlay.highlightNode' method.
     */
    export interface HighlightNodeParams {
      /**
       * A descriptor for the highlight appearance.
       */
      highlightConfig: HighlightConfig;

      /**
       * Identifier of the node to highlight.
       */
      nodeId?: DOM.NodeId;

      /**
       * Identifier of the backend node to highlight.
       */
      backendNodeId?: DOM.BackendNodeId;

      /**
       * JavaScript object id of the node to be highlighted.
       */
      objectId?: CdpV8.Runtime.RemoteObjectId;

      /**
       * Selectors to highlight relevant nodes.
       */
      selector?: string;
    }

    /**
     * Return value of the 'Overlay.highlightNode' method.
     */
    export interface HighlightNodeResult {
    }

    /**
     * Parameters of the 'Overlay.highlightQuad' method.
     */
    export interface HighlightQuadParams {
      /**
       * Quad to highlight
       */
      quad: DOM.Quad;

      /**
       * The highlight fill color (default: transparent).
       */
      color?: DOM.RGBA;

      /**
       * The highlight outline color (default: transparent).
       */
      outlineColor?: DOM.RGBA;
    }

    /**
     * Return value of the 'Overlay.highlightQuad' method.
     */
    export interface HighlightQuadResult {
    }

    /**
     * Parameters of the 'Overlay.highlightRect' method.
     */
    export interface HighlightRectParams {
      /**
       * X coordinate
       */
      x: integer;

      /**
       * Y coordinate
       */
      y: integer;

      /**
       * Rectangle width
       */
      width: integer;

      /**
       * Rectangle height
       */
      height: integer;

      /**
       * The highlight fill color (default: transparent).
       */
      color?: DOM.RGBA;

      /**
       * The highlight outline color (default: transparent).
       */
      outlineColor?: DOM.RGBA;
    }

    /**
     * Return value of the 'Overlay.highlightRect' method.
     */
    export interface HighlightRectResult {
    }

    /**
     * Parameters of the 'Overlay.highlightSourceOrder' method.
     */
    export interface HighlightSourceOrderParams {
      /**
       * A descriptor for the appearance of the overlay drawing.
       */
      sourceOrderConfig: SourceOrderConfig;

      /**
       * Identifier of the node to highlight.
       */
      nodeId?: DOM.NodeId;

      /**
       * Identifier of the backend node to highlight.
       */
      backendNodeId?: DOM.BackendNodeId;

      /**
       * JavaScript object id of the node to be highlighted.
       */
      objectId?: CdpV8.Runtime.RemoteObjectId;
    }

    /**
     * Return value of the 'Overlay.highlightSourceOrder' method.
     */
    export interface HighlightSourceOrderResult {
    }

    /**
     * Parameters of the 'Overlay.setInspectMode' method.
     */
    export interface SetInspectModeParams {
      /**
       * Set an inspection mode.
       */
      mode: InspectMode;

      /**
       * A descriptor for the highlight appearance of hovered-over nodes. May be omitted if `enabled
       * == false`.
       */
      highlightConfig?: HighlightConfig;
    }

    /**
     * Return value of the 'Overlay.setInspectMode' method.
     */
    export interface SetInspectModeResult {
    }

    /**
     * Parameters of the 'Overlay.setShowAdHighlights' method.
     */
    export interface SetShowAdHighlightsParams {
      /**
       * True for showing ad highlights
       */
      show: boolean;
    }

    /**
     * Return value of the 'Overlay.setShowAdHighlights' method.
     */
    export interface SetShowAdHighlightsResult {
    }

    /**
     * Parameters of the 'Overlay.setPausedInDebuggerMessage' method.
     */
    export interface SetPausedInDebuggerMessageParams {
      /**
       * The message to display, also triggers resume and step over controls.
       */
      message?: string;
    }

    /**
     * Return value of the 'Overlay.setPausedInDebuggerMessage' method.
     */
    export interface SetPausedInDebuggerMessageResult {
    }

    /**
     * Parameters of the 'Overlay.setShowDebugBorders' method.
     */
    export interface SetShowDebugBordersParams {
      /**
       * True for showing debug borders
       */
      show: boolean;
    }

    /**
     * Return value of the 'Overlay.setShowDebugBorders' method.
     */
    export interface SetShowDebugBordersResult {
    }

    /**
     * Parameters of the 'Overlay.setShowFPSCounter' method.
     */
    export interface SetShowFPSCounterParams {
      /**
       * True for showing the FPS counter
       */
      show: boolean;
    }

    /**
     * Return value of the 'Overlay.setShowFPSCounter' method.
     */
    export interface SetShowFPSCounterResult {
    }

    /**
     * Parameters of the 'Overlay.setShowGridOverlays' method.
     */
    export interface SetShowGridOverlaysParams {
      /**
       * An array of node identifiers and descriptors for the highlight appearance.
       */
      gridNodeHighlightConfigs: GridNodeHighlightConfig[];
    }

    /**
     * Return value of the 'Overlay.setShowGridOverlays' method.
     */
    export interface SetShowGridOverlaysResult {
    }

    /**
     * Parameters of the 'Overlay.setShowFlexOverlays' method.
     */
    export interface SetShowFlexOverlaysParams {
      /**
       * An array of node identifiers and descriptors for the highlight appearance.
       */
      flexNodeHighlightConfigs: FlexNodeHighlightConfig[];
    }

    /**
     * Return value of the 'Overlay.setShowFlexOverlays' method.
     */
    export interface SetShowFlexOverlaysResult {
    }

    /**
     * Parameters of the 'Overlay.setShowScrollSnapOverlays' method.
     */
    export interface SetShowScrollSnapOverlaysParams {
      /**
       * An array of node identifiers and descriptors for the highlight appearance.
       */
      scrollSnapHighlightConfigs: ScrollSnapHighlightConfig[];
    }

    /**
     * Return value of the 'Overlay.setShowScrollSnapOverlays' method.
     */
    export interface SetShowScrollSnapOverlaysResult {
    }

    /**
     * Parameters of the 'Overlay.setShowContainerQueryOverlays' method.
     */
    export interface SetShowContainerQueryOverlaysParams {
      /**
       * An array of node identifiers and descriptors for the highlight appearance.
       */
      containerQueryHighlightConfigs: ContainerQueryHighlightConfig[];
    }

    /**
     * Return value of the 'Overlay.setShowContainerQueryOverlays' method.
     */
    export interface SetShowContainerQueryOverlaysResult {
    }

    /**
     * Parameters of the 'Overlay.setShowPaintRects' method.
     */
    export interface SetShowPaintRectsParams {
      /**
       * True for showing paint rectangles
       */
      result: boolean;
    }

    /**
     * Return value of the 'Overlay.setShowPaintRects' method.
     */
    export interface SetShowPaintRectsResult {
    }

    /**
     * Parameters of the 'Overlay.setShowLayoutShiftRegions' method.
     */
    export interface SetShowLayoutShiftRegionsParams {
      /**
       * True for showing layout shift regions
       */
      result: boolean;
    }

    /**
     * Return value of the 'Overlay.setShowLayoutShiftRegions' method.
     */
    export interface SetShowLayoutShiftRegionsResult {
    }

    /**
     * Parameters of the 'Overlay.setShowScrollBottleneckRects' method.
     */
    export interface SetShowScrollBottleneckRectsParams {
      /**
       * True for showing scroll bottleneck rects
       */
      show: boolean;
    }

    /**
     * Return value of the 'Overlay.setShowScrollBottleneckRects' method.
     */
    export interface SetShowScrollBottleneckRectsResult {
    }

    /**
     * Parameters of the 'Overlay.setShowHitTestBorders' method.
     */
    export interface SetShowHitTestBordersParams {
      /**
       * True for showing hit-test borders
       */
      show: boolean;
    }

    /**
     * Return value of the 'Overlay.setShowHitTestBorders' method.
     */
    export interface SetShowHitTestBordersResult {
    }

    /**
     * Parameters of the 'Overlay.setShowWebVitals' method.
     */
    export interface SetShowWebVitalsParams {
      show: boolean;
    }

    /**
     * Return value of the 'Overlay.setShowWebVitals' method.
     */
    export interface SetShowWebVitalsResult {
    }

    /**
     * Parameters of the 'Overlay.setShowViewportSizeOnResize' method.
     */
    export interface SetShowViewportSizeOnResizeParams {
      /**
       * Whether to paint size or not.
       */
      show: boolean;
    }

    /**
     * Return value of the 'Overlay.setShowViewportSizeOnResize' method.
     */
    export interface SetShowViewportSizeOnResizeResult {
    }

    /**
     * Parameters of the 'Overlay.setShowHinge' method.
     */
    export interface SetShowHingeParams {
      /**
       * hinge data, null means hideHinge
       */
      hingeConfig?: HingeConfig;
    }

    /**
     * Return value of the 'Overlay.setShowHinge' method.
     */
    export interface SetShowHingeResult {
    }

    /**
     * Parameters of the 'Overlay.setShowIsolatedElements' method.
     */
    export interface SetShowIsolatedElementsParams {
      /**
       * An array of node identifiers and descriptors for the highlight appearance.
       */
      isolatedElementHighlightConfigs: IsolatedElementHighlightConfig[];
    }

    /**
     * Return value of the 'Overlay.setShowIsolatedElements' method.
     */
    export interface SetShowIsolatedElementsResult {
    }

    /**
     * Parameters of the 'Overlay.setShowWindowControlsOverlay' method.
     */
    export interface SetShowWindowControlsOverlayParams {
      /**
       * Window Controls Overlay data, null means hide Window Controls Overlay
       */
      windowControlsOverlayConfig?: WindowControlsOverlayConfig;
    }

    /**
     * Return value of the 'Overlay.setShowWindowControlsOverlay' method.
     */
    export interface SetShowWindowControlsOverlayResult {
    }

    /**
     * Parameters of the 'Overlay.inspectNodeRequested' event.
     */
    export interface InspectNodeRequestedEvent {
      /**
       * Id of the node to inspect.
       */
      backendNodeId: DOM.BackendNodeId;
    }

    /**
     * Parameters of the 'Overlay.nodeHighlightRequested' event.
     */
    export interface NodeHighlightRequestedEvent {
      nodeId: DOM.NodeId;
    }

    /**
     * Parameters of the 'Overlay.screenshotRequested' event.
     */
    export interface ScreenshotRequestedEvent {
      /**
       * Viewport to capture, in device independent pixels (dip).
       */
      viewport: Page.Viewport;
    }

    /**
     * Parameters of the 'Overlay.inspectModeCanceled' event.
     */
    export interface InspectModeCanceledEvent {
    }

    /**
     * Configuration data for drawing the source order of an elements children.
     */
    export interface SourceOrderConfig {
      /**
       * the color to outline the givent element in.
       */
      parentOutlineColor: DOM.RGBA;

      /**
       * the color to outline the child elements in.
       */
      childOutlineColor: DOM.RGBA;
    }

    /**
     * Configuration data for the highlighting of Grid elements.
     */
    export interface GridHighlightConfig {
      /**
       * Whether the extension lines from grid cells to the rulers should be shown (default: false).
       */
      showGridExtensionLines?: boolean;

      /**
       * Show Positive line number labels (default: false).
       */
      showPositiveLineNumbers?: boolean;

      /**
       * Show Negative line number labels (default: false).
       */
      showNegativeLineNumbers?: boolean;

      /**
       * Show area name labels (default: false).
       */
      showAreaNames?: boolean;

      /**
       * Show line name labels (default: false).
       */
      showLineNames?: boolean;

      /**
       * Show track size labels (default: false).
       */
      showTrackSizes?: boolean;

      /**
       * The grid container border highlight color (default: transparent).
       */
      gridBorderColor?: DOM.RGBA;

      /**
       * The cell border color (default: transparent). Deprecated, please use rowLineColor and columnLineColor instead.
       * @deprecated
       */
      cellBorderColor?: DOM.RGBA;

      /**
       * The row line color (default: transparent).
       */
      rowLineColor?: DOM.RGBA;

      /**
       * The column line color (default: transparent).
       */
      columnLineColor?: DOM.RGBA;

      /**
       * Whether the grid border is dashed (default: false).
       */
      gridBorderDash?: boolean;

      /**
       * Whether the cell border is dashed (default: false). Deprecated, please us rowLineDash and columnLineDash instead.
       * @deprecated
       */
      cellBorderDash?: boolean;

      /**
       * Whether row lines are dashed (default: false).
       */
      rowLineDash?: boolean;

      /**
       * Whether column lines are dashed (default: false).
       */
      columnLineDash?: boolean;

      /**
       * The row gap highlight fill color (default: transparent).
       */
      rowGapColor?: DOM.RGBA;

      /**
       * The row gap hatching fill color (default: transparent).
       */
      rowHatchColor?: DOM.RGBA;

      /**
       * The column gap highlight fill color (default: transparent).
       */
      columnGapColor?: DOM.RGBA;

      /**
       * The column gap hatching fill color (default: transparent).
       */
      columnHatchColor?: DOM.RGBA;

      /**
       * The named grid areas border color (Default: transparent).
       */
      areaBorderColor?: DOM.RGBA;

      /**
       * The grid container background color (Default: transparent).
       */
      gridBackgroundColor?: DOM.RGBA;
    }

    /**
     * Configuration data for the highlighting of Flex container elements.
     */
    export interface FlexContainerHighlightConfig {
      /**
       * The style of the container border
       */
      containerBorder?: LineStyle;

      /**
       * The style of the separator between lines
       */
      lineSeparator?: LineStyle;

      /**
       * The style of the separator between items
       */
      itemSeparator?: LineStyle;

      /**
       * Style of content-distribution space on the main axis (justify-content).
       */
      mainDistributedSpace?: BoxStyle;

      /**
       * Style of content-distribution space on the cross axis (align-content).
       */
      crossDistributedSpace?: BoxStyle;

      /**
       * Style of empty space caused by row gaps (gap/row-gap).
       */
      rowGapSpace?: BoxStyle;

      /**
       * Style of empty space caused by columns gaps (gap/column-gap).
       */
      columnGapSpace?: BoxStyle;

      /**
       * Style of the self-alignment line (align-items).
       */
      crossAlignment?: LineStyle;
    }

    /**
     * Configuration data for the highlighting of Flex item elements.
     */
    export interface FlexItemHighlightConfig {
      /**
       * Style of the box representing the item's base size
       */
      baseSizeBox?: BoxStyle;

      /**
       * Style of the border around the box representing the item's base size
       */
      baseSizeBorder?: LineStyle;

      /**
       * Style of the arrow representing if the item grew or shrank
       */
      flexibilityArrow?: LineStyle;
    }

    /**
     * Style information for drawing a line.
     */
    export interface LineStyle {
      /**
       * The color of the line (default: transparent)
       */
      color?: DOM.RGBA;

      /**
       * The line pattern (default: solid)
       */
      pattern?: 'dashed' | 'dotted';
    }

    /**
     * Style information for drawing a box.
     */
    export interface BoxStyle {
      /**
       * The background color for the box (default: transparent)
       */
      fillColor?: DOM.RGBA;

      /**
       * The hatching color for the box (default: transparent)
       */
      hatchColor?: DOM.RGBA;
    }

    export type ContrastAlgorithm = 'aa' | 'aaa' | 'apca';

    /**
     * Configuration data for the highlighting of page elements.
     */
    export interface HighlightConfig {
      /**
       * Whether the node info tooltip should be shown (default: false).
       */
      showInfo?: boolean;

      /**
       * Whether the node styles in the tooltip (default: false).
       */
      showStyles?: boolean;

      /**
       * Whether the rulers should be shown (default: false).
       */
      showRulers?: boolean;

      /**
       * Whether the a11y info should be shown (default: true).
       */
      showAccessibilityInfo?: boolean;

      /**
       * Whether the extension lines from node to the rulers should be shown (default: false).
       */
      showExtensionLines?: boolean;

      /**
       * The content box highlight fill color (default: transparent).
       */
      contentColor?: DOM.RGBA;

      /**
       * The padding highlight fill color (default: transparent).
       */
      paddingColor?: DOM.RGBA;

      /**
       * The border highlight fill color (default: transparent).
       */
      borderColor?: DOM.RGBA;

      /**
       * The margin highlight fill color (default: transparent).
       */
      marginColor?: DOM.RGBA;

      /**
       * The event target element highlight fill color (default: transparent).
       */
      eventTargetColor?: DOM.RGBA;

      /**
       * The shape outside fill color (default: transparent).
       */
      shapeColor?: DOM.RGBA;

      /**
       * The shape margin fill color (default: transparent).
       */
      shapeMarginColor?: DOM.RGBA;

      /**
       * The grid layout color (default: transparent).
       */
      cssGridColor?: DOM.RGBA;

      /**
       * The color format used to format color styles (default: hex).
       */
      colorFormat?: ColorFormat;

      /**
       * The grid layout highlight configuration (default: all transparent).
       */
      gridHighlightConfig?: GridHighlightConfig;

      /**
       * The flex container highlight configuration (default: all transparent).
       */
      flexContainerHighlightConfig?: FlexContainerHighlightConfig;

      /**
       * The flex item highlight configuration (default: all transparent).
       */
      flexItemHighlightConfig?: FlexItemHighlightConfig;

      /**
       * The contrast algorithm to use for the contrast ratio (default: aa).
       */
      contrastAlgorithm?: ContrastAlgorithm;

      /**
       * The container query container highlight configuration (default: all transparent).
       */
      containerQueryContainerHighlightConfig?: ContainerQueryContainerHighlightConfig;
    }

    export type ColorFormat = 'rgb' | 'hsl' | 'hwb' | 'hex';

    /**
     * Configurations for Persistent Grid Highlight
     */
    export interface GridNodeHighlightConfig {
      /**
       * A descriptor for the highlight appearance.
       */
      gridHighlightConfig: GridHighlightConfig;

      /**
       * Identifier of the node to highlight.
       */
      nodeId: DOM.NodeId;
    }

    export interface FlexNodeHighlightConfig {
      /**
       * A descriptor for the highlight appearance of flex containers.
       */
      flexContainerHighlightConfig: FlexContainerHighlightConfig;

      /**
       * Identifier of the node to highlight.
       */
      nodeId: DOM.NodeId;
    }

    export interface ScrollSnapContainerHighlightConfig {
      /**
       * The style of the snapport border (default: transparent)
       */
      snapportBorder?: LineStyle;

      /**
       * The style of the snap area border (default: transparent)
       */
      snapAreaBorder?: LineStyle;

      /**
       * The margin highlight fill color (default: transparent).
       */
      scrollMarginColor?: DOM.RGBA;

      /**
       * The padding highlight fill color (default: transparent).
       */
      scrollPaddingColor?: DOM.RGBA;
    }

    export interface ScrollSnapHighlightConfig {
      /**
       * A descriptor for the highlight appearance of scroll snap containers.
       */
      scrollSnapContainerHighlightConfig: ScrollSnapContainerHighlightConfig;

      /**
       * Identifier of the node to highlight.
       */
      nodeId: DOM.NodeId;
    }

    /**
     * Configuration for dual screen hinge
     */
    export interface HingeConfig {
      /**
       * A rectangle represent hinge
       */
      rect: DOM.Rect;

      /**
       * The content box highlight fill color (default: a dark color).
       */
      contentColor?: DOM.RGBA;

      /**
       * The content box highlight outline color (default: transparent).
       */
      outlineColor?: DOM.RGBA;
    }

    /**
     * Configuration for Window Controls Overlay
     */
    export interface WindowControlsOverlayConfig {
      /**
       * Whether the title bar CSS should be shown when emulating the Window Controls Overlay.
       */
      showCSS: boolean;

      /**
       * Seleted platforms to show the overlay.
       */
      selectedPlatform: string;

      /**
       * The theme color defined in app manifest.
       */
      themeColor: string;
    }

    export interface ContainerQueryHighlightConfig {
      /**
       * A descriptor for the highlight appearance of container query containers.
       */
      containerQueryContainerHighlightConfig: ContainerQueryContainerHighlightConfig;

      /**
       * Identifier of the container node to highlight.
       */
      nodeId: DOM.NodeId;
    }

    export interface ContainerQueryContainerHighlightConfig {
      /**
       * The style of the container border.
       */
      containerBorder?: LineStyle;

      /**
       * The style of the descendants' borders.
       */
      descendantBorder?: LineStyle;
    }

    export interface IsolatedElementHighlightConfig {
      /**
       * A descriptor for the highlight appearance of an element in isolation mode.
       */
      isolationModeHighlightConfig: IsolationModeHighlightConfig;

      /**
       * Identifier of the isolated element to highlight.
       */
      nodeId: DOM.NodeId;
    }

    export interface IsolationModeHighlightConfig {
      /**
       * The fill color of the resizers (default: transparent).
       */
      resizerColor?: DOM.RGBA;

      /**
       * The fill color for resizer handles (default: transparent).
       */
      resizerHandleColor?: DOM.RGBA;

      /**
       * The fill color for the mask covering non-isolated elements (default: transparent).
       */
      maskColor?: DOM.RGBA;
    }

    export type InspectMode = 'searchForNode' | 'searchForUAShadowDOM' | 'captureAreaScreenshot' | 'showDistances' | 'none';
  }

  /**
   * Methods and events of the 'Page' domain.
   */
  export interface PageApi {
    requests: {
      /**
       * Deprecated, please use addScriptToEvaluateOnNewDocument instead.
       * @deprecated
       */
      addScriptToEvaluateOnLoad: { params: Page.AddScriptToEvaluateOnLoadParams, result: Page.AddScriptToEvaluateOnLoadResult }

      /**
       * Evaluates given script in every frame upon creation (before loading frame's scripts).
       */
      addScriptToEvaluateOnNewDocument: { params: Page.AddScriptToEvaluateOnNewDocumentParams, result: Page.AddScriptToEvaluateOnNewDocumentResult }

      /**
       * Brings page to front (activates tab).
       */
      bringToFront: { params: Page.BringToFrontParams, result: Page.BringToFrontResult }

      /**
       * Capture page screenshot.
       */
      captureScreenshot: { params: Page.CaptureScreenshotParams, result: Page.CaptureScreenshotResult }

      /**
       * Returns a snapshot of the page as a string. For MHTML format, the serialization includes
       * iframes, shadow DOM, external resources, and element-inline styles.
       */
      captureSnapshot: { params: Page.CaptureSnapshotParams, result: Page.CaptureSnapshotResult }

      /**
       * Clears the overridden device metrics.
       * @deprecated
       */
      clearDeviceMetricsOverride: { params: Page.ClearDeviceMetricsOverrideParams, result: Page.ClearDeviceMetricsOverrideResult }

      /**
       * Clears the overridden Device Orientation.
       * @deprecated
       */
      clearDeviceOrientationOverride: { params: Page.ClearDeviceOrientationOverrideParams, result: Page.ClearDeviceOrientationOverrideResult }

      /**
       * Clears the overridden Geolocation Position and Error.
       * @deprecated
       */
      clearGeolocationOverride: { params: Page.ClearGeolocationOverrideParams, result: Page.ClearGeolocationOverrideResult }

      /**
       * Creates an isolated world for the given frame.
       */
      createIsolatedWorld: { params: Page.CreateIsolatedWorldParams, result: Page.CreateIsolatedWorldResult }

      /**
       * Deletes browser cookie with given name, domain and path.
       * @deprecated
       */
      deleteCookie: { params: Page.DeleteCookieParams, result: Page.DeleteCookieResult }

      /**
       * Disables page domain notifications.
       */
      disable: { params: Page.DisableParams, result: Page.DisableResult }

      /**
       * Enables page domain notifications.
       */
      enable: { params: Page.EnableParams, result: Page.EnableResult }

      getAppManifest: { params: Page.GetAppManifestParams, result: Page.GetAppManifestResult }

      getInstallabilityErrors: { params: Page.GetInstallabilityErrorsParams, result: Page.GetInstallabilityErrorsResult }

      /**
       * Deprecated because it's not guaranteed that the returned icon is in fact the one used for PWA installation.
       * @deprecated
       */
      getManifestIcons: { params: Page.GetManifestIconsParams, result: Page.GetManifestIconsResult }

      /**
       * Returns the unique (PWA) app id.
       * Only returns values if the feature flag 'WebAppEnableManifestId' is enabled
       */
      getAppId: { params: Page.GetAppIdParams, result: Page.GetAppIdResult }

      getAdScriptId: { params: Page.GetAdScriptIdParams, result: Page.GetAdScriptIdResult }

      /**
       * Returns present frame tree structure.
       */
      getFrameTree: { params: Page.GetFrameTreeParams, result: Page.GetFrameTreeResult }

      /**
       * Returns metrics relating to the layouting of the page, such as viewport bounds/scale.
       */
      getLayoutMetrics: { params: Page.GetLayoutMetricsParams, result: Page.GetLayoutMetricsResult }

      /**
       * Returns navigation history for the current page.
       */
      getNavigationHistory: { params: Page.GetNavigationHistoryParams, result: Page.GetNavigationHistoryResult }

      /**
       * Resets navigation history for the current page.
       */
      resetNavigationHistory: { params: Page.ResetNavigationHistoryParams, result: Page.ResetNavigationHistoryResult }

      /**
       * Returns content of the given resource.
       */
      getResourceContent: { params: Page.GetResourceContentParams, result: Page.GetResourceContentResult }

      /**
       * Returns present frame / resource tree structure.
       */
      getResourceTree: { params: Page.GetResourceTreeParams, result: Page.GetResourceTreeResult }

      /**
       * Accepts or dismisses a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload).
       */
      handleJavaScriptDialog: { params: Page.HandleJavaScriptDialogParams, result: Page.HandleJavaScriptDialogResult }

      /**
       * Navigates current page to the given URL.
       */
      navigate: { params: Page.NavigateParams, result: Page.NavigateResult }

      /**
       * Navigates current page to the given history entry.
       */
      navigateToHistoryEntry: { params: Page.NavigateToHistoryEntryParams, result: Page.NavigateToHistoryEntryResult }

      /**
       * Print page as PDF.
       */
      printToPDF: { params: Page.PrintToPDFParams, result: Page.PrintToPDFResult }

      /**
       * Reloads given page optionally ignoring the cache.
       */
      reload: { params: Page.ReloadParams, result: Page.ReloadResult }

      /**
       * Deprecated, please use removeScriptToEvaluateOnNewDocument instead.
       * @deprecated
       */
      removeScriptToEvaluateOnLoad: { params: Page.RemoveScriptToEvaluateOnLoadParams, result: Page.RemoveScriptToEvaluateOnLoadResult }

      /**
       * Removes given script from the list.
       */
      removeScriptToEvaluateOnNewDocument: { params: Page.RemoveScriptToEvaluateOnNewDocumentParams, result: Page.RemoveScriptToEvaluateOnNewDocumentResult }

      /**
       * Acknowledges that a screencast frame has been received by the frontend.
       */
      screencastFrameAck: { params: Page.ScreencastFrameAckParams, result: Page.ScreencastFrameAckResult }

      /**
       * Searches for given string in resource content.
       */
      searchInResource: { params: Page.SearchInResourceParams, result: Page.SearchInResourceResult }

      /**
       * Enable Chrome's experimental ad filter on all sites.
       */
      setAdBlockingEnabled: { params: Page.SetAdBlockingEnabledParams, result: Page.SetAdBlockingEnabledResult }

      /**
       * Enable page Content Security Policy by-passing.
       */
      setBypassCSP: { params: Page.SetBypassCSPParams, result: Page.SetBypassCSPResult }

      /**
       * Get Permissions Policy state on given frame.
       */
      getPermissionsPolicyState: { params: Page.GetPermissionsPolicyStateParams, result: Page.GetPermissionsPolicyStateResult }

      /**
       * Get Origin Trials on given frame.
       */
      getOriginTrials: { params: Page.GetOriginTrialsParams, result: Page.GetOriginTrialsResult }

      /**
       * Overrides the values of device screen dimensions (window.screen.width, window.screen.height,
       * window.innerWidth, window.innerHeight, and "device-width"/"device-height"-related CSS media
       * query results).
       * @deprecated
       */
      setDeviceMetricsOverride: { params: Page.SetDeviceMetricsOverrideParams, result: Page.SetDeviceMetricsOverrideResult }

      /**
       * Overrides the Device Orientation.
       * @deprecated
       */
      setDeviceOrientationOverride: { params: Page.SetDeviceOrientationOverrideParams, result: Page.SetDeviceOrientationOverrideResult }

      /**
       * Set generic font families.
       */
      setFontFamilies: { params: Page.SetFontFamiliesParams, result: Page.SetFontFamiliesResult }

      /**
       * Set default font sizes.
       */
      setFontSizes: { params: Page.SetFontSizesParams, result: Page.SetFontSizesResult }

      /**
       * Sets given markup as the document's HTML.
       */
      setDocumentContent: { params: Page.SetDocumentContentParams, result: Page.SetDocumentContentResult }

      /**
       * Set the behavior when downloading a file.
       * @deprecated
       */
      setDownloadBehavior: { params: Page.SetDownloadBehaviorParams, result: Page.SetDownloadBehaviorResult }

      /**
       * Overrides the Geolocation Position or Error. Omitting any of the parameters emulates position
       * unavailable.
       * @deprecated
       */
      setGeolocationOverride: { params: Page.SetGeolocationOverrideParams, result: Page.SetGeolocationOverrideResult }

      /**
       * Controls whether page will emit lifecycle events.
       */
      setLifecycleEventsEnabled: { params: Page.SetLifecycleEventsEnabledParams, result: Page.SetLifecycleEventsEnabledResult }

      /**
       * Toggles mouse event-based touch event emulation.
       * @deprecated
       */
      setTouchEmulationEnabled: { params: Page.SetTouchEmulationEnabledParams, result: Page.SetTouchEmulationEnabledResult }

      /**
       * Starts sending each frame using the `screencastFrame` event.
       */
      startScreencast: { params: Page.StartScreencastParams, result: Page.StartScreencastResult }

      /**
       * Force the page stop all navigations and pending resource fetches.
       */
      stopLoading: { params: Page.StopLoadingParams, result: Page.StopLoadingResult }

      /**
       * Crashes renderer on the IO thread, generates minidumps.
       */
      crash: { params: Page.CrashParams, result: Page.CrashResult }

      /**
       * Tries to close page, running its beforeunload hooks, if any.
       */
      close: { params: Page.CloseParams, result: Page.CloseResult }

      /**
       * Tries to update the web lifecycle state of the page.
       * It will transition the page to the given state according to:
       * https://github.com/WICG/web-lifecycle/
       */
      setWebLifecycleState: { params: Page.SetWebLifecycleStateParams, result: Page.SetWebLifecycleStateResult }

      /**
       * Stops sending each frame in the `screencastFrame`.
       */
      stopScreencast: { params: Page.StopScreencastParams, result: Page.StopScreencastResult }

      /**
       * Requests backend to produce compilation cache for the specified scripts.
       * `scripts` are appeneded to the list of scripts for which the cache
       * would be produced. The list may be reset during page navigation.
       * When script with a matching URL is encountered, the cache is optionally
       * produced upon backend discretion, based on internal heuristics.
       * See also: `Page.compilationCacheProduced`.
       */
      produceCompilationCache: { params: Page.ProduceCompilationCacheParams, result: Page.ProduceCompilationCacheResult }

      /**
       * Seeds compilation cache for given url. Compilation cache does not survive
       * cross-process navigation.
       */
      addCompilationCache: { params: Page.AddCompilationCacheParams, result: Page.AddCompilationCacheResult }

      /**
       * Clears seeded compilation cache.
       */
      clearCompilationCache: { params: Page.ClearCompilationCacheParams, result: Page.ClearCompilationCacheResult }

      /**
       * Sets the Secure Payment Confirmation transaction mode.
       * https://w3c.github.io/secure-payment-confirmation/#sctn-automation-set-spc-transaction-mode
       */
      setSPCTransactionMode: { params: Page.SetSPCTransactionModeParams, result: Page.SetSPCTransactionModeResult }

      /**
       * Extensions for Custom Handlers API:
       * https://html.spec.whatwg.org/multipage/system-state.html#rph-automation
       */
      setRPHRegistrationMode: { params: Page.SetRPHRegistrationModeParams, result: Page.SetRPHRegistrationModeResult }

      /**
       * Generates a report for testing.
       */
      generateTestReport: { params: Page.GenerateTestReportParams, result: Page.GenerateTestReportResult }

      /**
       * Pauses page execution. Can be resumed using generic Runtime.runIfWaitingForDebugger.
       */
      waitForDebugger: { params: Page.WaitForDebuggerParams, result: Page.WaitForDebuggerResult }

      /**
       * Intercept file chooser requests and transfer control to protocol clients.
       * When file chooser interception is enabled, native file chooser dialog is not shown.
       * Instead, a protocol event `Page.fileChooserOpened` is emitted.
       */
      setInterceptFileChooserDialog: { params: Page.SetInterceptFileChooserDialogParams, result: Page.SetInterceptFileChooserDialogResult }

      /**
       * Enable/disable prerendering manually.
       * 
       * This command is a short-term solution for https://crbug.com/1440085.
       * See https://docs.google.com/document/d/12HVmFxYj5Jc-eJr5OmWsa2bqTJsbgGLKI6ZIyx0_wpA
       * for more details.
       * 
       * TODO(https://crbug.com/1440085): Remove this once Puppeteer supports tab targets.
       */
      setPrerenderingAllowed: { params: Page.SetPrerenderingAllowedParams, result: Page.SetPrerenderingAllowedResult }
    };
    events: {

      domContentEventFired: { params: Page.DomContentEventFiredEvent };

      /**
       * Emitted only when `page.interceptFileChooser` is enabled.
       */
      fileChooserOpened: { params: Page.FileChooserOpenedEvent };

      /**
       * Fired when frame has been attached to its parent.
       */
      frameAttached: { params: Page.FrameAttachedEvent };

      /**
       * Fired when frame no longer has a scheduled navigation.
       * @deprecated
       */
      frameClearedScheduledNavigation: { params: Page.FrameClearedScheduledNavigationEvent };

      /**
       * Fired when frame has been detached from its parent.
       */
      frameDetached: { params: Page.FrameDetachedEvent };

      /**
       * Fired once navigation of the frame has completed. Frame is now associated with the new loader.
       */
      frameNavigated: { params: Page.FrameNavigatedEvent };

      /**
       * Fired when opening document to write to.
       */
      documentOpened: { params: Page.DocumentOpenedEvent };

      frameResized: { params: Page.FrameResizedEvent };

      /**
       * Fired when a renderer-initiated navigation is requested.
       * Navigation may still be cancelled after the event is issued.
       */
      frameRequestedNavigation: { params: Page.FrameRequestedNavigationEvent };

      /**
       * Fired when frame schedules a potential navigation.
       * @deprecated
       */
      frameScheduledNavigation: { params: Page.FrameScheduledNavigationEvent };

      /**
       * Fired when frame has started loading.
       */
      frameStartedLoading: { params: Page.FrameStartedLoadingEvent };

      /**
       * Fired when frame has stopped loading.
       */
      frameStoppedLoading: { params: Page.FrameStoppedLoadingEvent };

      /**
       * Fired when page is about to start a download.
       * Deprecated. Use Browser.downloadWillBegin instead.
       * @deprecated
       */
      downloadWillBegin: { params: Page.DownloadWillBeginEvent };

      /**
       * Fired when download makes progress. Last call has |done| == true.
       * Deprecated. Use Browser.downloadProgress instead.
       * @deprecated
       */
      downloadProgress: { params: Page.DownloadProgressEvent };

      /**
       * Fired when interstitial page was hidden
       */
      interstitialHidden: { params: Page.InterstitialHiddenEvent };

      /**
       * Fired when interstitial page was shown
       */
      interstitialShown: { params: Page.InterstitialShownEvent };

      /**
       * Fired when a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload) has been
       * closed.
       */
      javascriptDialogClosed: { params: Page.JavascriptDialogClosedEvent };

      /**
       * Fired when a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload) is about to
       * open.
       */
      javascriptDialogOpening: { params: Page.JavascriptDialogOpeningEvent };

      /**
       * Fired for top level page lifecycle events such as navigation, load, paint, etc.
       */
      lifecycleEvent: { params: Page.LifecycleEventEvent };

      /**
       * Fired for failed bfcache history navigations if BackForwardCache feature is enabled. Do
       * not assume any ordering with the Page.frameNavigated event. This event is fired only for
       * main-frame history navigation where the document changes (non-same-document navigations),
       * when bfcache navigation fails.
       */
      backForwardCacheNotUsed: { params: Page.BackForwardCacheNotUsedEvent };

      loadEventFired: { params: Page.LoadEventFiredEvent };

      /**
       * Fired when same-document navigation happens, e.g. due to history API usage or anchor navigation.
       */
      navigatedWithinDocument: { params: Page.NavigatedWithinDocumentEvent };

      /**
       * Compressed image data requested by the `startScreencast`.
       */
      screencastFrame: { params: Page.ScreencastFrameEvent };

      /**
       * Fired when the page with currently enabled screencast was shown or hidden `.
       */
      screencastVisibilityChanged: { params: Page.ScreencastVisibilityChangedEvent };

      /**
       * Fired when a new window is going to be opened, via window.open(), link click, form submission,
       * etc.
       */
      windowOpen: { params: Page.WindowOpenEvent };

      /**
       * Issued for every compilation cache generated. Is only available
       * if Page.setGenerateCompilationCache is enabled.
       */
      compilationCacheProduced: { params: Page.CompilationCacheProducedEvent };
    };
  }

  /**
   * Types of the 'Page' domain.
   */
  export namespace Page {
    /**
     * Parameters of the 'Page.addScriptToEvaluateOnLoad' method.
     */
    export interface AddScriptToEvaluateOnLoadParams {
      scriptSource: string;
    }

    /**
     * Return value of the 'Page.addScriptToEvaluateOnLoad' method.
     */
    export interface AddScriptToEvaluateOnLoadResult {
      /**
       * Identifier of the added script.
       */
      identifier: ScriptIdentifier;
    }

    /**
     * Parameters of the 'Page.addScriptToEvaluateOnNewDocument' method.
     */
    export interface AddScriptToEvaluateOnNewDocumentParams {
      source: string;

      /**
       * If specified, creates an isolated world with the given name and evaluates given script in it.
       * This world name will be used as the ExecutionContextDescription::name when the corresponding
       * event is emitted.
       */
      worldName?: string;

      /**
       * Specifies whether command line API should be available to the script, defaults
       * to false.
       */
      includeCommandLineAPI?: boolean;

      /**
       * If true, runs the script immediately on existing execution contexts or worlds.
       * Default: false.
       */
      runImmediately?: boolean;
    }

    /**
     * Return value of the 'Page.addScriptToEvaluateOnNewDocument' method.
     */
    export interface AddScriptToEvaluateOnNewDocumentResult {
      /**
       * Identifier of the added script.
       */
      identifier: ScriptIdentifier;
    }

    /**
     * Parameters of the 'Page.bringToFront' method.
     */
    export interface BringToFrontParams {
    }

    /**
     * Return value of the 'Page.bringToFront' method.
     */
    export interface BringToFrontResult {
    }

    /**
     * Parameters of the 'Page.captureScreenshot' method.
     */
    export interface CaptureScreenshotParams {
      /**
       * Image compression format (defaults to png).
       */
      format?: 'jpeg' | 'png' | 'webp';

      /**
       * Compression quality from range [0..100] (jpeg only).
       */
      quality?: integer;

      /**
       * Capture the screenshot of a given region only.
       */
      clip?: Viewport;

      /**
       * Capture the screenshot from the surface, rather than the view. Defaults to true.
       */
      fromSurface?: boolean;

      /**
       * Capture the screenshot beyond the viewport. Defaults to false.
       */
      captureBeyondViewport?: boolean;

      /**
       * Optimize image encoding for speed, not for resulting size (defaults to false)
       */
      optimizeForSpeed?: boolean;
    }

    /**
     * Return value of the 'Page.captureScreenshot' method.
     */
    export interface CaptureScreenshotResult {
      /**
       * Base64-encoded image data. (Encoded as a base64 string when passed over JSON)
       */
      data: string;
    }

    /**
     * Parameters of the 'Page.captureSnapshot' method.
     */
    export interface CaptureSnapshotParams {
      /**
       * Format (defaults to mhtml).
       */
      format?: 'mhtml';
    }

    /**
     * Return value of the 'Page.captureSnapshot' method.
     */
    export interface CaptureSnapshotResult {
      /**
       * Serialized page data.
       */
      data: string;
    }

    /**
     * Parameters of the 'Page.clearDeviceMetricsOverride' method.
     */
    export interface ClearDeviceMetricsOverrideParams {
    }

    /**
     * Return value of the 'Page.clearDeviceMetricsOverride' method.
     */
    export interface ClearDeviceMetricsOverrideResult {
    }

    /**
     * Parameters of the 'Page.clearDeviceOrientationOverride' method.
     */
    export interface ClearDeviceOrientationOverrideParams {
    }

    /**
     * Return value of the 'Page.clearDeviceOrientationOverride' method.
     */
    export interface ClearDeviceOrientationOverrideResult {
    }

    /**
     * Parameters of the 'Page.clearGeolocationOverride' method.
     */
    export interface ClearGeolocationOverrideParams {
    }

    /**
     * Return value of the 'Page.clearGeolocationOverride' method.
     */
    export interface ClearGeolocationOverrideResult {
    }

    /**
     * Parameters of the 'Page.createIsolatedWorld' method.
     */
    export interface CreateIsolatedWorldParams {
      /**
       * Id of the frame in which the isolated world should be created.
       */
      frameId: FrameId;

      /**
       * An optional name which is reported in the Execution Context.
       */
      worldName?: string;

      /**
       * Whether or not universal access should be granted to the isolated world. This is a powerful
       * option, use with caution.
       */
      grantUniveralAccess?: boolean;
    }

    /**
     * Return value of the 'Page.createIsolatedWorld' method.
     */
    export interface CreateIsolatedWorldResult {
      /**
       * Execution context of the isolated world.
       */
      executionContextId: CdpV8.Runtime.ExecutionContextId;
    }

    /**
     * Parameters of the 'Page.deleteCookie' method.
     */
    export interface DeleteCookieParams {
      /**
       * Name of the cookie to remove.
       */
      cookieName: string;

      /**
       * URL to match cooke domain and path.
       */
      url: string;
    }

    /**
     * Return value of the 'Page.deleteCookie' method.
     */
    export interface DeleteCookieResult {
    }

    /**
     * Parameters of the 'Page.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'Page.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'Page.enable' method.
     */
    export interface EnableParams {
    }

    /**
     * Return value of the 'Page.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'Page.getAppManifest' method.
     */
    export interface GetAppManifestParams {
    }

    /**
     * Return value of the 'Page.getAppManifest' method.
     */
    export interface GetAppManifestResult {
      /**
       * Manifest location.
       */
      url: string;

      errors: AppManifestError[];

      /**
       * Manifest content.
       */
      data?: string;

      /**
       * Parsed manifest properties
       */
      parsed?: AppManifestParsedProperties;
    }

    /**
     * Parameters of the 'Page.getInstallabilityErrors' method.
     */
    export interface GetInstallabilityErrorsParams {
    }

    /**
     * Return value of the 'Page.getInstallabilityErrors' method.
     */
    export interface GetInstallabilityErrorsResult {
      installabilityErrors: InstallabilityError[];
    }

    /**
     * Parameters of the 'Page.getManifestIcons' method.
     */
    export interface GetManifestIconsParams {
    }

    /**
     * Return value of the 'Page.getManifestIcons' method.
     */
    export interface GetManifestIconsResult {
      primaryIcon?: string;
    }

    /**
     * Parameters of the 'Page.getAppId' method.
     */
    export interface GetAppIdParams {
    }

    /**
     * Return value of the 'Page.getAppId' method.
     */
    export interface GetAppIdResult {
      /**
       * App id, either from manifest's id attribute or computed from start_url
       */
      appId?: string;

      /**
       * Recommendation for manifest's id attribute to match current id computed from start_url
       */
      recommendedId?: string;
    }

    /**
     * Parameters of the 'Page.getAdScriptId' method.
     */
    export interface GetAdScriptIdParams {
      frameId: FrameId;
    }

    /**
     * Return value of the 'Page.getAdScriptId' method.
     */
    export interface GetAdScriptIdResult {
      /**
       * Identifies the bottom-most script which caused the frame to be labelled
       * as an ad. Only sent if frame is labelled as an ad and id is available.
       */
      adScriptId?: AdScriptId;
    }

    /**
     * Parameters of the 'Page.getFrameTree' method.
     */
    export interface GetFrameTreeParams {
    }

    /**
     * Return value of the 'Page.getFrameTree' method.
     */
    export interface GetFrameTreeResult {
      /**
       * Present frame tree structure.
       */
      frameTree: FrameTree;
    }

    /**
     * Parameters of the 'Page.getLayoutMetrics' method.
     */
    export interface GetLayoutMetricsParams {
    }

    /**
     * Return value of the 'Page.getLayoutMetrics' method.
     */
    export interface GetLayoutMetricsResult {
      /**
       * Deprecated metrics relating to the layout viewport. Is in device pixels. Use `cssLayoutViewport` instead.
       * @deprecated
       */
      layoutViewport: LayoutViewport;

      /**
       * Deprecated metrics relating to the visual viewport. Is in device pixels. Use `cssVisualViewport` instead.
       * @deprecated
       */
      visualViewport: VisualViewport;

      /**
       * Deprecated size of scrollable area. Is in DP. Use `cssContentSize` instead.
       * @deprecated
       */
      contentSize: DOM.Rect;

      /**
       * Metrics relating to the layout viewport in CSS pixels.
       */
      cssLayoutViewport: LayoutViewport;

      /**
       * Metrics relating to the visual viewport in CSS pixels.
       */
      cssVisualViewport: VisualViewport;

      /**
       * Size of scrollable area in CSS pixels.
       */
      cssContentSize: DOM.Rect;
    }

    /**
     * Parameters of the 'Page.getNavigationHistory' method.
     */
    export interface GetNavigationHistoryParams {
    }

    /**
     * Return value of the 'Page.getNavigationHistory' method.
     */
    export interface GetNavigationHistoryResult {
      /**
       * Index of the current navigation history entry.
       */
      currentIndex: integer;

      /**
       * Array of navigation history entries.
       */
      entries: NavigationEntry[];
    }

    /**
     * Parameters of the 'Page.resetNavigationHistory' method.
     */
    export interface ResetNavigationHistoryParams {
    }

    /**
     * Return value of the 'Page.resetNavigationHistory' method.
     */
    export interface ResetNavigationHistoryResult {
    }

    /**
     * Parameters of the 'Page.getResourceContent' method.
     */
    export interface GetResourceContentParams {
      /**
       * Frame id to get resource for.
       */
      frameId: FrameId;

      /**
       * URL of the resource to get content for.
       */
      url: string;
    }

    /**
     * Return value of the 'Page.getResourceContent' method.
     */
    export interface GetResourceContentResult {
      /**
       * Resource content.
       */
      content: string;

      /**
       * True, if content was served as base64.
       */
      base64Encoded: boolean;
    }

    /**
     * Parameters of the 'Page.getResourceTree' method.
     */
    export interface GetResourceTreeParams {
    }

    /**
     * Return value of the 'Page.getResourceTree' method.
     */
    export interface GetResourceTreeResult {
      /**
       * Present frame / resource tree structure.
       */
      frameTree: FrameResourceTree;
    }

    /**
     * Parameters of the 'Page.handleJavaScriptDialog' method.
     */
    export interface HandleJavaScriptDialogParams {
      /**
       * Whether to accept or dismiss the dialog.
       */
      accept: boolean;

      /**
       * The text to enter into the dialog prompt before accepting. Used only if this is a prompt
       * dialog.
       */
      promptText?: string;
    }

    /**
     * Return value of the 'Page.handleJavaScriptDialog' method.
     */
    export interface HandleJavaScriptDialogResult {
    }

    /**
     * Parameters of the 'Page.navigate' method.
     */
    export interface NavigateParams {
      /**
       * URL to navigate the page to.
       */
      url: string;

      /**
       * Referrer URL.
       */
      referrer?: string;

      /**
       * Intended transition type.
       */
      transitionType?: TransitionType;

      /**
       * Frame id to navigate, if not specified navigates the top frame.
       */
      frameId?: FrameId;

      /**
       * Referrer-policy used for the navigation.
       */
      referrerPolicy?: ReferrerPolicy;
    }

    /**
     * Return value of the 'Page.navigate' method.
     */
    export interface NavigateResult {
      /**
       * Frame id that has navigated (or failed to navigate)
       */
      frameId: FrameId;

      /**
       * Loader identifier. This is omitted in case of same-document navigation,
       * as the previously committed loaderId would not change.
       */
      loaderId?: Network.LoaderId;

      /**
       * User friendly error message, present if and only if navigation has failed.
       */
      errorText?: string;
    }

    /**
     * Parameters of the 'Page.navigateToHistoryEntry' method.
     */
    export interface NavigateToHistoryEntryParams {
      /**
       * Unique id of the entry to navigate to.
       */
      entryId: integer;
    }

    /**
     * Return value of the 'Page.navigateToHistoryEntry' method.
     */
    export interface NavigateToHistoryEntryResult {
    }

    /**
     * Parameters of the 'Page.printToPDF' method.
     */
    export interface PrintToPDFParams {
      /**
       * Paper orientation. Defaults to false.
       */
      landscape?: boolean;

      /**
       * Display header and footer. Defaults to false.
       */
      displayHeaderFooter?: boolean;

      /**
       * Print background graphics. Defaults to false.
       */
      printBackground?: boolean;

      /**
       * Scale of the webpage rendering. Defaults to 1.
       */
      scale?: number;

      /**
       * Paper width in inches. Defaults to 8.5 inches.
       */
      paperWidth?: number;

      /**
       * Paper height in inches. Defaults to 11 inches.
       */
      paperHeight?: number;

      /**
       * Top margin in inches. Defaults to 1cm (~0.4 inches).
       */
      marginTop?: number;

      /**
       * Bottom margin in inches. Defaults to 1cm (~0.4 inches).
       */
      marginBottom?: number;

      /**
       * Left margin in inches. Defaults to 1cm (~0.4 inches).
       */
      marginLeft?: number;

      /**
       * Right margin in inches. Defaults to 1cm (~0.4 inches).
       */
      marginRight?: number;

      /**
       * Paper ranges to print, one based, e.g., '1-5, 8, 11-13'. Pages are
       * printed in the document order, not in the order specified, and no
       * more than once.
       * Defaults to empty string, which implies the entire document is printed.
       * The page numbers are quietly capped to actual page count of the
       * document, and ranges beyond the end of the document are ignored.
       * If this results in no pages to print, an error is reported.
       * It is an error to specify a range with start greater than end.
       */
      pageRanges?: string;

      /**
       * HTML template for the print header. Should be valid HTML markup with following
       * classes used to inject printing values into them:
       * - `date`: formatted print date
       * - `title`: document title
       * - `url`: document location
       * - `pageNumber`: current page number
       * - `totalPages`: total pages in the document
       * 
       * For example, `<span class=title></span>` would generate span containing the title.
       */
      headerTemplate?: string;

      /**
       * HTML template for the print footer. Should use the same format as the `headerTemplate`.
       */
      footerTemplate?: string;

      /**
       * Whether or not to prefer page size as defined by css. Defaults to false,
       * in which case the content will be scaled to fit the paper size.
       */
      preferCSSPageSize?: boolean;

      /**
       * return as stream
       */
      transferMode?: 'ReturnAsBase64' | 'ReturnAsStream';

      /**
       * Whether or not to generate tagged (accessible) PDF. Defaults to embedder choice.
       */
      generateTaggedPDF?: boolean;

      /**
       * Whether or not to embed the document outline into the PDF.
       */
      generateDocumentOutline?: boolean;
    }

    /**
     * Return value of the 'Page.printToPDF' method.
     */
    export interface PrintToPDFResult {
      /**
       * Base64-encoded pdf data. Empty if |returnAsStream| is specified. (Encoded as a base64 string when passed over JSON)
       */
      data: string;

      /**
       * A handle of the stream that holds resulting PDF data.
       */
      stream?: IO.StreamHandle;
    }

    /**
     * Parameters of the 'Page.reload' method.
     */
    export interface ReloadParams {
      /**
       * If true, browser cache is ignored (as if the user pressed Shift+refresh).
       */
      ignoreCache?: boolean;

      /**
       * If set, the script will be injected into all frames of the inspected page after reload.
       * Argument will be ignored if reloading dataURL origin.
       */
      scriptToEvaluateOnLoad?: string;
    }

    /**
     * Return value of the 'Page.reload' method.
     */
    export interface ReloadResult {
    }

    /**
     * Parameters of the 'Page.removeScriptToEvaluateOnLoad' method.
     */
    export interface RemoveScriptToEvaluateOnLoadParams {
      identifier: ScriptIdentifier;
    }

    /**
     * Return value of the 'Page.removeScriptToEvaluateOnLoad' method.
     */
    export interface RemoveScriptToEvaluateOnLoadResult {
    }

    /**
     * Parameters of the 'Page.removeScriptToEvaluateOnNewDocument' method.
     */
    export interface RemoveScriptToEvaluateOnNewDocumentParams {
      identifier: ScriptIdentifier;
    }

    /**
     * Return value of the 'Page.removeScriptToEvaluateOnNewDocument' method.
     */
    export interface RemoveScriptToEvaluateOnNewDocumentResult {
    }

    /**
     * Parameters of the 'Page.screencastFrameAck' method.
     */
    export interface ScreencastFrameAckParams {
      /**
       * Frame number.
       */
      sessionId: integer;
    }

    /**
     * Return value of the 'Page.screencastFrameAck' method.
     */
    export interface ScreencastFrameAckResult {
    }

    /**
     * Parameters of the 'Page.searchInResource' method.
     */
    export interface SearchInResourceParams {
      /**
       * Frame id for resource to search in.
       */
      frameId: FrameId;

      /**
       * URL of the resource to search in.
       */
      url: string;

      /**
       * String to search for.
       */
      query: string;

      /**
       * If true, search is case sensitive.
       */
      caseSensitive?: boolean;

      /**
       * If true, treats string parameter as regex.
       */
      isRegex?: boolean;
    }

    /**
     * Return value of the 'Page.searchInResource' method.
     */
    export interface SearchInResourceResult {
      /**
       * List of search matches.
       */
      result: CdpV8.Debugger.SearchMatch[];
    }

    /**
     * Parameters of the 'Page.setAdBlockingEnabled' method.
     */
    export interface SetAdBlockingEnabledParams {
      /**
       * Whether to block ads.
       */
      enabled: boolean;
    }

    /**
     * Return value of the 'Page.setAdBlockingEnabled' method.
     */
    export interface SetAdBlockingEnabledResult {
    }

    /**
     * Parameters of the 'Page.setBypassCSP' method.
     */
    export interface SetBypassCSPParams {
      /**
       * Whether to bypass page CSP.
       */
      enabled: boolean;
    }

    /**
     * Return value of the 'Page.setBypassCSP' method.
     */
    export interface SetBypassCSPResult {
    }

    /**
     * Parameters of the 'Page.getPermissionsPolicyState' method.
     */
    export interface GetPermissionsPolicyStateParams {
      frameId: FrameId;
    }

    /**
     * Return value of the 'Page.getPermissionsPolicyState' method.
     */
    export interface GetPermissionsPolicyStateResult {
      states: PermissionsPolicyFeatureState[];
    }

    /**
     * Parameters of the 'Page.getOriginTrials' method.
     */
    export interface GetOriginTrialsParams {
      frameId: FrameId;
    }

    /**
     * Return value of the 'Page.getOriginTrials' method.
     */
    export interface GetOriginTrialsResult {
      originTrials: OriginTrial[];
    }

    /**
     * Parameters of the 'Page.setDeviceMetricsOverride' method.
     */
    export interface SetDeviceMetricsOverrideParams {
      /**
       * Overriding width value in pixels (minimum 0, maximum 10000000). 0 disables the override.
       */
      width: integer;

      /**
       * Overriding height value in pixels (minimum 0, maximum 10000000). 0 disables the override.
       */
      height: integer;

      /**
       * Overriding device scale factor value. 0 disables the override.
       */
      deviceScaleFactor: number;

      /**
       * Whether to emulate mobile device. This includes viewport meta tag, overlay scrollbars, text
       * autosizing and more.
       */
      mobile: boolean;

      /**
       * Scale to apply to resulting view image.
       */
      scale?: number;

      /**
       * Overriding screen width value in pixels (minimum 0, maximum 10000000).
       */
      screenWidth?: integer;

      /**
       * Overriding screen height value in pixels (minimum 0, maximum 10000000).
       */
      screenHeight?: integer;

      /**
       * Overriding view X position on screen in pixels (minimum 0, maximum 10000000).
       */
      positionX?: integer;

      /**
       * Overriding view Y position on screen in pixels (minimum 0, maximum 10000000).
       */
      positionY?: integer;

      /**
       * Do not set visible view size, rely upon explicit setVisibleSize call.
       */
      dontSetVisibleSize?: boolean;

      /**
       * Screen orientation override.
       */
      screenOrientation?: Emulation.ScreenOrientation;

      /**
       * The viewport dimensions and scale. If not set, the override is cleared.
       */
      viewport?: Viewport;
    }

    /**
     * Return value of the 'Page.setDeviceMetricsOverride' method.
     */
    export interface SetDeviceMetricsOverrideResult {
    }

    /**
     * Parameters of the 'Page.setDeviceOrientationOverride' method.
     */
    export interface SetDeviceOrientationOverrideParams {
      /**
       * Mock alpha
       */
      alpha: number;

      /**
       * Mock beta
       */
      beta: number;

      /**
       * Mock gamma
       */
      gamma: number;
    }

    /**
     * Return value of the 'Page.setDeviceOrientationOverride' method.
     */
    export interface SetDeviceOrientationOverrideResult {
    }

    /**
     * Parameters of the 'Page.setFontFamilies' method.
     */
    export interface SetFontFamiliesParams {
      /**
       * Specifies font families to set. If a font family is not specified, it won't be changed.
       */
      fontFamilies: FontFamilies;

      /**
       * Specifies font families to set for individual scripts.
       */
      forScripts?: ScriptFontFamilies[];
    }

    /**
     * Return value of the 'Page.setFontFamilies' method.
     */
    export interface SetFontFamiliesResult {
    }

    /**
     * Parameters of the 'Page.setFontSizes' method.
     */
    export interface SetFontSizesParams {
      /**
       * Specifies font sizes to set. If a font size is not specified, it won't be changed.
       */
      fontSizes: FontSizes;
    }

    /**
     * Return value of the 'Page.setFontSizes' method.
     */
    export interface SetFontSizesResult {
    }

    /**
     * Parameters of the 'Page.setDocumentContent' method.
     */
    export interface SetDocumentContentParams {
      /**
       * Frame id to set HTML for.
       */
      frameId: FrameId;

      /**
       * HTML content to set.
       */
      html: string;
    }

    /**
     * Return value of the 'Page.setDocumentContent' method.
     */
    export interface SetDocumentContentResult {
    }

    /**
     * Parameters of the 'Page.setDownloadBehavior' method.
     */
    export interface SetDownloadBehaviorParams {
      /**
       * Whether to allow all or deny all download requests, or use default Chrome behavior if
       * available (otherwise deny).
       */
      behavior: 'deny' | 'allow' | 'default';

      /**
       * The default path to save downloaded files to. This is required if behavior is set to 'allow'
       */
      downloadPath?: string;
    }

    /**
     * Return value of the 'Page.setDownloadBehavior' method.
     */
    export interface SetDownloadBehaviorResult {
    }

    /**
     * Parameters of the 'Page.setGeolocationOverride' method.
     */
    export interface SetGeolocationOverrideParams {
      /**
       * Mock latitude
       */
      latitude?: number;

      /**
       * Mock longitude
       */
      longitude?: number;

      /**
       * Mock accuracy
       */
      accuracy?: number;
    }

    /**
     * Return value of the 'Page.setGeolocationOverride' method.
     */
    export interface SetGeolocationOverrideResult {
    }

    /**
     * Parameters of the 'Page.setLifecycleEventsEnabled' method.
     */
    export interface SetLifecycleEventsEnabledParams {
      /**
       * If true, starts emitting lifecycle events.
       */
      enabled: boolean;
    }

    /**
     * Return value of the 'Page.setLifecycleEventsEnabled' method.
     */
    export interface SetLifecycleEventsEnabledResult {
    }

    /**
     * Parameters of the 'Page.setTouchEmulationEnabled' method.
     */
    export interface SetTouchEmulationEnabledParams {
      /**
       * Whether the touch event emulation should be enabled.
       */
      enabled: boolean;

      /**
       * Touch/gesture events configuration. Default: current platform.
       */
      configuration?: 'mobile' | 'desktop';
    }

    /**
     * Return value of the 'Page.setTouchEmulationEnabled' method.
     */
    export interface SetTouchEmulationEnabledResult {
    }

    /**
     * Parameters of the 'Page.startScreencast' method.
     */
    export interface StartScreencastParams {
      /**
       * Image compression format.
       */
      format?: 'jpeg' | 'png';

      /**
       * Compression quality from range [0..100].
       */
      quality?: integer;

      /**
       * Maximum screenshot width.
       */
      maxWidth?: integer;

      /**
       * Maximum screenshot height.
       */
      maxHeight?: integer;

      /**
       * Send every n-th frame.
       */
      everyNthFrame?: integer;
    }

    /**
     * Return value of the 'Page.startScreencast' method.
     */
    export interface StartScreencastResult {
    }

    /**
     * Parameters of the 'Page.stopLoading' method.
     */
    export interface StopLoadingParams {
    }

    /**
     * Return value of the 'Page.stopLoading' method.
     */
    export interface StopLoadingResult {
    }

    /**
     * Parameters of the 'Page.crash' method.
     */
    export interface CrashParams {
    }

    /**
     * Return value of the 'Page.crash' method.
     */
    export interface CrashResult {
    }

    /**
     * Parameters of the 'Page.close' method.
     */
    export interface CloseParams {
    }

    /**
     * Return value of the 'Page.close' method.
     */
    export interface CloseResult {
    }

    /**
     * Parameters of the 'Page.setWebLifecycleState' method.
     */
    export interface SetWebLifecycleStateParams {
      /**
       * Target lifecycle state
       */
      state: 'frozen' | 'active';
    }

    /**
     * Return value of the 'Page.setWebLifecycleState' method.
     */
    export interface SetWebLifecycleStateResult {
    }

    /**
     * Parameters of the 'Page.stopScreencast' method.
     */
    export interface StopScreencastParams {
    }

    /**
     * Return value of the 'Page.stopScreencast' method.
     */
    export interface StopScreencastResult {
    }

    /**
     * Parameters of the 'Page.produceCompilationCache' method.
     */
    export interface ProduceCompilationCacheParams {
      scripts: CompilationCacheParams[];
    }

    /**
     * Return value of the 'Page.produceCompilationCache' method.
     */
    export interface ProduceCompilationCacheResult {
    }

    /**
     * Parameters of the 'Page.addCompilationCache' method.
     */
    export interface AddCompilationCacheParams {
      url: string;

      /**
       * Base64-encoded data (Encoded as a base64 string when passed over JSON)
       */
      data: string;
    }

    /**
     * Return value of the 'Page.addCompilationCache' method.
     */
    export interface AddCompilationCacheResult {
    }

    /**
     * Parameters of the 'Page.clearCompilationCache' method.
     */
    export interface ClearCompilationCacheParams {
    }

    /**
     * Return value of the 'Page.clearCompilationCache' method.
     */
    export interface ClearCompilationCacheResult {
    }

    /**
     * Parameters of the 'Page.setSPCTransactionMode' method.
     */
    export interface SetSPCTransactionModeParams {
      mode: AutoResponseMode;
    }

    /**
     * Return value of the 'Page.setSPCTransactionMode' method.
     */
    export interface SetSPCTransactionModeResult {
    }

    /**
     * Parameters of the 'Page.setRPHRegistrationMode' method.
     */
    export interface SetRPHRegistrationModeParams {
      mode: AutoResponseMode;
    }

    /**
     * Return value of the 'Page.setRPHRegistrationMode' method.
     */
    export interface SetRPHRegistrationModeResult {
    }

    /**
     * Parameters of the 'Page.generateTestReport' method.
     */
    export interface GenerateTestReportParams {
      /**
       * Message to be displayed in the report.
       */
      message: string;

      /**
       * Specifies the endpoint group to deliver the report to.
       */
      group?: string;
    }

    /**
     * Return value of the 'Page.generateTestReport' method.
     */
    export interface GenerateTestReportResult {
    }

    /**
     * Parameters of the 'Page.waitForDebugger' method.
     */
    export interface WaitForDebuggerParams {
    }

    /**
     * Return value of the 'Page.waitForDebugger' method.
     */
    export interface WaitForDebuggerResult {
    }

    /**
     * Parameters of the 'Page.setInterceptFileChooserDialog' method.
     */
    export interface SetInterceptFileChooserDialogParams {
      enabled: boolean;
    }

    /**
     * Return value of the 'Page.setInterceptFileChooserDialog' method.
     */
    export interface SetInterceptFileChooserDialogResult {
    }

    /**
     * Parameters of the 'Page.setPrerenderingAllowed' method.
     */
    export interface SetPrerenderingAllowedParams {
      isAllowed: boolean;
    }

    /**
     * Return value of the 'Page.setPrerenderingAllowed' method.
     */
    export interface SetPrerenderingAllowedResult {
    }

    /**
     * Parameters of the 'Page.domContentEventFired' event.
     */
    export interface DomContentEventFiredEvent {
      timestamp: Network.MonotonicTime;
    }

    /**
     * Parameters of the 'Page.fileChooserOpened' event.
     */
    export interface FileChooserOpenedEvent {
      /**
       * Id of the frame containing input node.
       */
      frameId: FrameId;

      /**
       * Input mode.
       */
      mode: 'selectSingle' | 'selectMultiple';

      /**
       * Input node id. Only present for file choosers opened via an `<input type="file">` element.
       */
      backendNodeId?: DOM.BackendNodeId;
    }

    /**
     * Parameters of the 'Page.frameAttached' event.
     */
    export interface FrameAttachedEvent {
      /**
       * Id of the frame that has been attached.
       */
      frameId: FrameId;

      /**
       * Parent frame identifier.
       */
      parentFrameId: FrameId;

      /**
       * JavaScript stack trace of when frame was attached, only set if frame initiated from script.
       */
      stack?: CdpV8.Runtime.StackTrace;
    }

    /**
     * Parameters of the 'Page.frameClearedScheduledNavigation' event.
     */
    export interface FrameClearedScheduledNavigationEvent {
      /**
       * Id of the frame that has cleared its scheduled navigation.
       */
      frameId: FrameId;
    }

    /**
     * Parameters of the 'Page.frameDetached' event.
     */
    export interface FrameDetachedEvent {
      /**
       * Id of the frame that has been detached.
       */
      frameId: FrameId;

      reason: 'remove' | 'swap';
    }

    /**
     * Parameters of the 'Page.frameNavigated' event.
     */
    export interface FrameNavigatedEvent {
      /**
       * Frame object.
       */
      frame: Frame;

      type: NavigationType;
    }

    /**
     * Parameters of the 'Page.documentOpened' event.
     */
    export interface DocumentOpenedEvent {
      /**
       * Frame object.
       */
      frame: Frame;
    }

    /**
     * Parameters of the 'Page.frameResized' event.
     */
    export interface FrameResizedEvent {
    }

    /**
     * Parameters of the 'Page.frameRequestedNavigation' event.
     */
    export interface FrameRequestedNavigationEvent {
      /**
       * Id of the frame that is being navigated.
       */
      frameId: FrameId;

      /**
       * The reason for the navigation.
       */
      reason: ClientNavigationReason;

      /**
       * The destination URL for the requested navigation.
       */
      url: string;

      /**
       * The disposition for the navigation.
       */
      disposition: ClientNavigationDisposition;
    }

    /**
     * Parameters of the 'Page.frameScheduledNavigation' event.
     */
    export interface FrameScheduledNavigationEvent {
      /**
       * Id of the frame that has scheduled a navigation.
       */
      frameId: FrameId;

      /**
       * Delay (in seconds) until the navigation is scheduled to begin. The navigation is not
       * guaranteed to start.
       */
      delay: number;

      /**
       * The reason for the navigation.
       */
      reason: ClientNavigationReason;

      /**
       * The destination URL for the scheduled navigation.
       */
      url: string;
    }

    /**
     * Parameters of the 'Page.frameStartedLoading' event.
     */
    export interface FrameStartedLoadingEvent {
      /**
       * Id of the frame that has started loading.
       */
      frameId: FrameId;
    }

    /**
     * Parameters of the 'Page.frameStoppedLoading' event.
     */
    export interface FrameStoppedLoadingEvent {
      /**
       * Id of the frame that has stopped loading.
       */
      frameId: FrameId;
    }

    /**
     * Parameters of the 'Page.downloadWillBegin' event.
     */
    export interface DownloadWillBeginEvent {
      /**
       * Id of the frame that caused download to begin.
       */
      frameId: FrameId;

      /**
       * Global unique identifier of the download.
       */
      guid: string;

      /**
       * URL of the resource being downloaded.
       */
      url: string;

      /**
       * Suggested file name of the resource (the actual name of the file saved on disk may differ).
       */
      suggestedFilename: string;
    }

    /**
     * Parameters of the 'Page.downloadProgress' event.
     */
    export interface DownloadProgressEvent {
      /**
       * Global unique identifier of the download.
       */
      guid: string;

      /**
       * Total expected bytes to download.
       */
      totalBytes: number;

      /**
       * Total bytes received.
       */
      receivedBytes: number;

      /**
       * Download status.
       */
      state: 'inProgress' | 'completed' | 'canceled';
    }

    /**
     * Parameters of the 'Page.interstitialHidden' event.
     */
    export interface InterstitialHiddenEvent {
    }

    /**
     * Parameters of the 'Page.interstitialShown' event.
     */
    export interface InterstitialShownEvent {
    }

    /**
     * Parameters of the 'Page.javascriptDialogClosed' event.
     */
    export interface JavascriptDialogClosedEvent {
      /**
       * Whether dialog was confirmed.
       */
      result: boolean;

      /**
       * User input in case of prompt.
       */
      userInput: string;
    }

    /**
     * Parameters of the 'Page.javascriptDialogOpening' event.
     */
    export interface JavascriptDialogOpeningEvent {
      /**
       * Frame url.
       */
      url: string;

      /**
       * Message that will be displayed by the dialog.
       */
      message: string;

      /**
       * Dialog type.
       */
      type: DialogType;

      /**
       * True iff browser is capable showing or acting on the given dialog. When browser has no
       * dialog handler for given target, calling alert while Page domain is engaged will stall
       * the page execution. Execution can be resumed via calling Page.handleJavaScriptDialog.
       */
      hasBrowserHandler: boolean;

      /**
       * Default dialog prompt.
       */
      defaultPrompt?: string;
    }

    /**
     * Parameters of the 'Page.lifecycleEvent' event.
     */
    export interface LifecycleEventEvent {
      /**
       * Id of the frame.
       */
      frameId: FrameId;

      /**
       * Loader identifier. Empty string if the request is fetched from worker.
       */
      loaderId: Network.LoaderId;

      name: string;

      timestamp: Network.MonotonicTime;
    }

    /**
     * Parameters of the 'Page.backForwardCacheNotUsed' event.
     */
    export interface BackForwardCacheNotUsedEvent {
      /**
       * The loader id for the associated navgation.
       */
      loaderId: Network.LoaderId;

      /**
       * The frame id of the associated frame.
       */
      frameId: FrameId;

      /**
       * Array of reasons why the page could not be cached. This must not be empty.
       */
      notRestoredExplanations: BackForwardCacheNotRestoredExplanation[];

      /**
       * Tree structure of reasons why the page could not be cached for each frame.
       */
      notRestoredExplanationsTree?: BackForwardCacheNotRestoredExplanationTree;
    }

    /**
     * Parameters of the 'Page.loadEventFired' event.
     */
    export interface LoadEventFiredEvent {
      timestamp: Network.MonotonicTime;
    }

    /**
     * Parameters of the 'Page.navigatedWithinDocument' event.
     */
    export interface NavigatedWithinDocumentEvent {
      /**
       * Id of the frame.
       */
      frameId: FrameId;

      /**
       * Frame's new url.
       */
      url: string;
    }

    /**
     * Parameters of the 'Page.screencastFrame' event.
     */
    export interface ScreencastFrameEvent {
      /**
       * Base64-encoded compressed image. (Encoded as a base64 string when passed over JSON)
       */
      data: string;

      /**
       * Screencast frame metadata.
       */
      metadata: ScreencastFrameMetadata;

      /**
       * Frame number.
       */
      sessionId: integer;
    }

    /**
     * Parameters of the 'Page.screencastVisibilityChanged' event.
     */
    export interface ScreencastVisibilityChangedEvent {
      /**
       * True if the page is visible.
       */
      visible: boolean;
    }

    /**
     * Parameters of the 'Page.windowOpen' event.
     */
    export interface WindowOpenEvent {
      /**
       * The URL for the new window.
       */
      url: string;

      /**
       * Window name.
       */
      windowName: string;

      /**
       * An array of enabled window features.
       */
      windowFeatures: string[];

      /**
       * Whether or not it was triggered by user gesture.
       */
      userGesture: boolean;
    }

    /**
     * Parameters of the 'Page.compilationCacheProduced' event.
     */
    export interface CompilationCacheProducedEvent {
      url: string;

      /**
       * Base64-encoded data (Encoded as a base64 string when passed over JSON)
       */
      data: string;
    }

    /**
     * Unique frame identifier.
     */
    export type FrameId = string;

    /**
     * Indicates whether a frame has been identified as an ad.
     */
    export type AdFrameType = 'none' | 'child' | 'root';

    export type AdFrameExplanation = 'ParentIsAd' | 'CreatedByAdScript' | 'MatchedBlockingRule';

    /**
     * Indicates whether a frame has been identified as an ad and why.
     */
    export interface AdFrameStatus {
      adFrameType: AdFrameType;

      explanations?: AdFrameExplanation[];
    }

    /**
     * Identifies the bottom-most script which caused the frame to be labelled
     * as an ad.
     */
    export interface AdScriptId {
      /**
       * Script Id of the bottom-most script which caused the frame to be labelled
       * as an ad.
       */
      scriptId: CdpV8.Runtime.ScriptId;

      /**
       * Id of adScriptId's debugger.
       */
      debuggerId: CdpV8.Runtime.UniqueDebuggerId;
    }

    /**
     * Indicates whether the frame is a secure context and why it is the case.
     */
    export type SecureContextType = 'Secure' | 'SecureLocalhost' | 'InsecureScheme' | 'InsecureAncestor';

    /**
     * Indicates whether the frame is cross-origin isolated and why it is the case.
     */
    export type CrossOriginIsolatedContextType = 'Isolated' | 'NotIsolated' | 'NotIsolatedFeatureDisabled';

    export type GatedAPIFeatures = 'SharedArrayBuffers' | 'SharedArrayBuffersTransferAllowed' | 'PerformanceMeasureMemory' | 'PerformanceProfile';

    /**
     * All Permissions Policy features. This enum should match the one defined
     * in third_party/blink/renderer/core/permissions_policy/permissions_policy_features.json5.
     */
    export type PermissionsPolicyFeature = 'accelerometer' | 'ambient-light-sensor' | 'attribution-reporting' | 'autoplay' | 'bluetooth' | 'browsing-topics' | 'camera' | 'captured-surface-control' | 'ch-dpr' | 'ch-device-memory' | 'ch-downlink' | 'ch-ect' | 'ch-prefers-color-scheme' | 'ch-prefers-reduced-motion' | 'ch-prefers-reduced-transparency' | 'ch-rtt' | 'ch-save-data' | 'ch-ua' | 'ch-ua-arch' | 'ch-ua-bitness' | 'ch-ua-platform' | 'ch-ua-model' | 'ch-ua-mobile' | 'ch-ua-form-factor' | 'ch-ua-full-version' | 'ch-ua-full-version-list' | 'ch-ua-platform-version' | 'ch-ua-wow64' | 'ch-viewport-height' | 'ch-viewport-width' | 'ch-width' | 'clipboard-read' | 'clipboard-write' | 'compute-pressure' | 'cross-origin-isolated' | 'direct-sockets' | 'display-capture' | 'document-domain' | 'encrypted-media' | 'execution-while-out-of-viewport' | 'execution-while-not-rendered' | 'focus-without-user-activation' | 'fullscreen' | 'frobulate' | 'gamepad' | 'geolocation' | 'gyroscope' | 'hid' | 'identity-credentials-get' | 'idle-detection' | 'interest-cohort' | 'join-ad-interest-group' | 'keyboard-map' | 'local-fonts' | 'magnetometer' | 'microphone' | 'midi' | 'otp-credentials' | 'payment' | 'picture-in-picture' | 'private-aggregation' | 'private-state-token-issuance' | 'private-state-token-redemption' | 'publickey-credentials-create' | 'publickey-credentials-get' | 'run-ad-auction' | 'screen-wake-lock' | 'serial' | 'shared-autofill' | 'shared-storage' | 'shared-storage-select-url' | 'smart-card' | 'storage-access' | 'sub-apps' | 'sync-xhr' | 'unload' | 'usb' | 'usb-unrestricted' | 'vertical-scroll' | 'web-printing' | 'web-share' | 'window-management' | 'window-placement' | 'xr-spatial-tracking';

    /**
     * Reason for a permissions policy feature to be disabled.
     */
    export type PermissionsPolicyBlockReason = 'Header' | 'IframeAttribute' | 'InFencedFrameTree' | 'InIsolatedApp';

    export interface PermissionsPolicyBlockLocator {
      frameId: FrameId;

      blockReason: PermissionsPolicyBlockReason;
    }

    export interface PermissionsPolicyFeatureState {
      feature: PermissionsPolicyFeature;

      allowed: boolean;

      locator?: PermissionsPolicyBlockLocator;
    }

    /**
     * Origin Trial(https://www.chromium.org/blink/origin-trials) support.
     * Status for an Origin Trial token.
     */
    export type OriginTrialTokenStatus = 'Success' | 'NotSupported' | 'Insecure' | 'Expired' | 'WrongOrigin' | 'InvalidSignature' | 'Malformed' | 'WrongVersion' | 'FeatureDisabled' | 'TokenDisabled' | 'FeatureDisabledForUser' | 'UnknownTrial';

    /**
     * Status for an Origin Trial.
     */
    export type OriginTrialStatus = 'Enabled' | 'ValidTokenNotProvided' | 'OSNotSupported' | 'TrialNotAllowed';

    export type OriginTrialUsageRestriction = 'None' | 'Subset';

    export interface OriginTrialToken {
      origin: string;

      matchSubDomains: boolean;

      trialName: string;

      expiryTime: Network.TimeSinceEpoch;

      isThirdParty: boolean;

      usageRestriction: OriginTrialUsageRestriction;
    }

    export interface OriginTrialTokenWithStatus {
      rawTokenText: string;

      /**
       * `parsedToken` is present only when the token is extractable and
       * parsable.
       */
      parsedToken?: OriginTrialToken;

      status: OriginTrialTokenStatus;
    }

    export interface OriginTrial {
      trialName: string;

      status: OriginTrialStatus;

      tokensWithStatus: OriginTrialTokenWithStatus[];
    }

    /**
     * Information about the Frame on the page.
     */
    export interface Frame {
      /**
       * Frame unique identifier.
       */
      id: FrameId;

      /**
       * Parent frame identifier.
       */
      parentId?: FrameId;

      /**
       * Identifier of the loader associated with this frame.
       */
      loaderId: Network.LoaderId;

      /**
       * Frame's name as specified in the tag.
       */
      name?: string;

      /**
       * Frame document's URL without fragment.
       */
      url: string;

      /**
       * Frame document's URL fragment including the '#'.
       */
      urlFragment?: string;

      /**
       * Frame document's registered domain, taking the public suffixes list into account.
       * Extracted from the Frame's url.
       * Example URLs: http://www.google.com/file.html -> "google.com"
       *               http://a.b.co.uk/file.html      -> "b.co.uk"
       */
      domainAndRegistry: string;

      /**
       * Frame document's security origin.
       */
      securityOrigin: string;

      /**
       * Frame document's mimeType as determined by the browser.
       */
      mimeType: string;

      /**
       * If the frame failed to load, this contains the URL that could not be loaded. Note that unlike url above, this URL may contain a fragment.
       */
      unreachableUrl?: string;

      /**
       * Indicates whether this frame was tagged as an ad and why.
       */
      adFrameStatus?: AdFrameStatus;

      /**
       * Indicates whether the main document is a secure context and explains why that is the case.
       */
      secureContextType: SecureContextType;

      /**
       * Indicates whether this is a cross origin isolated context.
       */
      crossOriginIsolatedContextType: CrossOriginIsolatedContextType;

      /**
       * Indicated which gated APIs / features are available.
       */
      gatedAPIFeatures: GatedAPIFeatures[];
    }

    /**
     * Information about the Resource on the page.
     */
    export interface FrameResource {
      /**
       * Resource URL.
       */
      url: string;

      /**
       * Type of this resource.
       */
      type: Network.ResourceType;

      /**
       * Resource mimeType as determined by the browser.
       */
      mimeType: string;

      /**
       * last-modified timestamp as reported by server.
       */
      lastModified?: Network.TimeSinceEpoch;

      /**
       * Resource content size.
       */
      contentSize?: number;

      /**
       * True if the resource failed to load.
       */
      failed?: boolean;

      /**
       * True if the resource was canceled during loading.
       */
      canceled?: boolean;
    }

    /**
     * Information about the Frame hierarchy along with their cached resources.
     */
    export interface FrameResourceTree {
      /**
       * Frame information for this tree item.
       */
      frame: Frame;

      /**
       * Child frames.
       */
      childFrames?: FrameResourceTree[];

      /**
       * Information about frame resources.
       */
      resources: FrameResource[];
    }

    /**
     * Information about the Frame hierarchy.
     */
    export interface FrameTree {
      /**
       * Frame information for this tree item.
       */
      frame: Frame;

      /**
       * Child frames.
       */
      childFrames?: FrameTree[];
    }

    /**
     * Unique script identifier.
     */
    export type ScriptIdentifier = string;

    /**
     * Transition type.
     */
    export type TransitionType = 'link' | 'typed' | 'address_bar' | 'auto_bookmark' | 'auto_subframe' | 'manual_subframe' | 'generated' | 'auto_toplevel' | 'form_submit' | 'reload' | 'keyword' | 'keyword_generated' | 'other';

    /**
     * Navigation history entry.
     */
    export interface NavigationEntry {
      /**
       * Unique id of the navigation history entry.
       */
      id: integer;

      /**
       * URL of the navigation history entry.
       */
      url: string;

      /**
       * URL that the user typed in the url bar.
       */
      userTypedURL: string;

      /**
       * Title of the navigation history entry.
       */
      title: string;

      /**
       * Transition type.
       */
      transitionType: TransitionType;
    }

    /**
     * Screencast frame metadata.
     */
    export interface ScreencastFrameMetadata {
      /**
       * Top offset in DIP.
       */
      offsetTop: number;

      /**
       * Page scale factor.
       */
      pageScaleFactor: number;

      /**
       * Device screen width in DIP.
       */
      deviceWidth: number;

      /**
       * Device screen height in DIP.
       */
      deviceHeight: number;

      /**
       * Position of horizontal scroll in CSS pixels.
       */
      scrollOffsetX: number;

      /**
       * Position of vertical scroll in CSS pixels.
       */
      scrollOffsetY: number;

      /**
       * Frame swap timestamp.
       */
      timestamp?: Network.TimeSinceEpoch;
    }

    /**
     * Javascript dialog type.
     */
    export type DialogType = 'alert' | 'confirm' | 'prompt' | 'beforeunload';

    /**
     * Error while paring app manifest.
     */
    export interface AppManifestError {
      /**
       * Error message.
       */
      message: string;

      /**
       * If criticial, this is a non-recoverable parse error.
       */
      critical: integer;

      /**
       * Error line.
       */
      line: integer;

      /**
       * Error column.
       */
      column: integer;
    }

    /**
     * Parsed app manifest properties.
     */
    export interface AppManifestParsedProperties {
      /**
       * Computed scope value
       */
      scope: string;
    }

    /**
     * Layout viewport position and dimensions.
     */
    export interface LayoutViewport {
      /**
       * Horizontal offset relative to the document (CSS pixels).
       */
      pageX: integer;

      /**
       * Vertical offset relative to the document (CSS pixels).
       */
      pageY: integer;

      /**
       * Width (CSS pixels), excludes scrollbar if present.
       */
      clientWidth: integer;

      /**
       * Height (CSS pixels), excludes scrollbar if present.
       */
      clientHeight: integer;
    }

    /**
     * Visual viewport position, dimensions, and scale.
     */
    export interface VisualViewport {
      /**
       * Horizontal offset relative to the layout viewport (CSS pixels).
       */
      offsetX: number;

      /**
       * Vertical offset relative to the layout viewport (CSS pixels).
       */
      offsetY: number;

      /**
       * Horizontal offset relative to the document (CSS pixels).
       */
      pageX: number;

      /**
       * Vertical offset relative to the document (CSS pixels).
       */
      pageY: number;

      /**
       * Width (CSS pixels), excludes scrollbar if present.
       */
      clientWidth: number;

      /**
       * Height (CSS pixels), excludes scrollbar if present.
       */
      clientHeight: number;

      /**
       * Scale relative to the ideal viewport (size at width=device-width).
       */
      scale: number;

      /**
       * Page zoom factor (CSS to device independent pixels ratio).
       */
      zoom?: number;
    }

    /**
     * Viewport for capturing screenshot.
     */
    export interface Viewport {
      /**
       * X offset in device independent pixels (dip).
       */
      x: number;

      /**
       * Y offset in device independent pixels (dip).
       */
      y: number;

      /**
       * Rectangle width in device independent pixels (dip).
       */
      width: number;

      /**
       * Rectangle height in device independent pixels (dip).
       */
      height: number;

      /**
       * Page scale factor.
       */
      scale: number;
    }

    /**
     * Generic font families collection.
     */
    export interface FontFamilies {
      /**
       * The standard font-family.
       */
      standard?: string;

      /**
       * The fixed font-family.
       */
      fixed?: string;

      /**
       * The serif font-family.
       */
      serif?: string;

      /**
       * The sansSerif font-family.
       */
      sansSerif?: string;

      /**
       * The cursive font-family.
       */
      cursive?: string;

      /**
       * The fantasy font-family.
       */
      fantasy?: string;

      /**
       * The math font-family.
       */
      math?: string;
    }

    /**
     * Font families collection for a script.
     */
    export interface ScriptFontFamilies {
      /**
       * Name of the script which these font families are defined for.
       */
      script: string;

      /**
       * Generic font families collection for the script.
       */
      fontFamilies: FontFamilies;
    }

    /**
     * Default font sizes.
     */
    export interface FontSizes {
      /**
       * Default standard font size.
       */
      standard?: integer;

      /**
       * Default fixed font size.
       */
      fixed?: integer;
    }

    export type ClientNavigationReason = 'formSubmissionGet' | 'formSubmissionPost' | 'httpHeaderRefresh' | 'scriptInitiated' | 'metaTagRefresh' | 'pageBlockInterstitial' | 'reload' | 'anchorClick';

    export type ClientNavigationDisposition = 'currentTab' | 'newTab' | 'newWindow' | 'download';

    export interface InstallabilityErrorArgument {
      /**
       * Argument name (e.g. name:'minimum-icon-size-in-pixels').
       */
      name: string;

      /**
       * Argument value (e.g. value:'64').
       */
      value: string;
    }

    /**
     * The installability error
     */
    export interface InstallabilityError {
      /**
       * The error id (e.g. 'manifest-missing-suitable-icon').
       */
      errorId: string;

      /**
       * The list of error arguments (e.g. {name:'minimum-icon-size-in-pixels', value:'64'}).
       */
      errorArguments: InstallabilityErrorArgument[];
    }

    /**
     * The referring-policy used for the navigation.
     */
    export type ReferrerPolicy = 'noReferrer' | 'noReferrerWhenDowngrade' | 'origin' | 'originWhenCrossOrigin' | 'sameOrigin' | 'strictOrigin' | 'strictOriginWhenCrossOrigin' | 'unsafeUrl';

    /**
     * Per-script compilation cache parameters for `Page.produceCompilationCache`
     */
    export interface CompilationCacheParams {
      /**
       * The URL of the script to produce a compilation cache entry for.
       */
      url: string;

      /**
       * A hint to the backend whether eager compilation is recommended.
       * (the actual compilation mode used is upon backend discretion).
       */
      eager?: boolean;
    }

    /**
     * Enum of possible auto-reponse for permisison / prompt dialogs.
     */
    export type AutoResponseMode = 'none' | 'autoAccept' | 'autoReject' | 'autoOptOut';

    /**
     * The type of a frameNavigated event.
     */
    export type NavigationType = 'Navigation' | 'BackForwardCacheRestore';

    /**
     * List of not restored reasons for back-forward cache.
     */
    export type BackForwardCacheNotRestoredReason = 'NotPrimaryMainFrame' | 'BackForwardCacheDisabled' | 'RelatedActiveContentsExist' | 'HTTPStatusNotOK' | 'SchemeNotHTTPOrHTTPS' | 'Loading' | 'WasGrantedMediaAccess' | 'DisableForRenderFrameHostCalled' | 'DomainNotAllowed' | 'HTTPMethodNotGET' | 'SubframeIsNavigating' | 'Timeout' | 'CacheLimit' | 'JavaScriptExecution' | 'RendererProcessKilled' | 'RendererProcessCrashed' | 'SchedulerTrackedFeatureUsed' | 'ConflictingBrowsingInstance' | 'CacheFlushed' | 'ServiceWorkerVersionActivation' | 'SessionRestored' | 'ServiceWorkerPostMessage' | 'EnteredBackForwardCacheBeforeServiceWorkerHostAdded' | 'RenderFrameHostReused_SameSite' | 'RenderFrameHostReused_CrossSite' | 'ServiceWorkerClaim' | 'IgnoreEventAndEvict' | 'HaveInnerContents' | 'TimeoutPuttingInCache' | 'BackForwardCacheDisabledByLowMemory' | 'BackForwardCacheDisabledByCommandLine' | 'NetworkRequestDatapipeDrainedAsBytesConsumer' | 'NetworkRequestRedirected' | 'NetworkRequestTimeout' | 'NetworkExceedsBufferLimit' | 'NavigationCancelledWhileRestoring' | 'NotMostRecentNavigationEntry' | 'BackForwardCacheDisabledForPrerender' | 'UserAgentOverrideDiffers' | 'ForegroundCacheLimit' | 'BrowsingInstanceNotSwapped' | 'BackForwardCacheDisabledForDelegate' | 'UnloadHandlerExistsInMainFrame' | 'UnloadHandlerExistsInSubFrame' | 'ServiceWorkerUnregistration' | 'CacheControlNoStore' | 'CacheControlNoStoreCookieModified' | 'CacheControlNoStoreHTTPOnlyCookieModified' | 'NoResponseHead' | 'Unknown' | 'ActivationNavigationsDisallowedForBug1234857' | 'ErrorDocument' | 'FencedFramesEmbedder' | 'CookieDisabled' | 'HTTPAuthRequired' | 'CookieFlushed' | 'WebSocket' | 'WebTransport' | 'WebRTC' | 'MainResourceHasCacheControlNoStore' | 'MainResourceHasCacheControlNoCache' | 'SubresourceHasCacheControlNoStore' | 'SubresourceHasCacheControlNoCache' | 'ContainsPlugins' | 'DocumentLoaded' | 'DedicatedWorkerOrWorklet' | 'OutstandingNetworkRequestOthers' | 'RequestedMIDIPermission' | 'RequestedAudioCapturePermission' | 'RequestedVideoCapturePermission' | 'RequestedBackForwardCacheBlockedSensors' | 'RequestedBackgroundWorkPermission' | 'BroadcastChannel' | 'WebXR' | 'SharedWorker' | 'WebLocks' | 'WebHID' | 'WebShare' | 'RequestedStorageAccessGrant' | 'WebNfc' | 'OutstandingNetworkRequestFetch' | 'OutstandingNetworkRequestXHR' | 'AppBanner' | 'Printing' | 'WebDatabase' | 'PictureInPicture' | 'Portal' | 'SpeechRecognizer' | 'IdleManager' | 'PaymentManager' | 'SpeechSynthesis' | 'KeyboardLock' | 'WebOTPService' | 'OutstandingNetworkRequestDirectSocket' | 'InjectedJavascript' | 'InjectedStyleSheet' | 'KeepaliveRequest' | 'IndexedDBEvent' | 'Dummy' | 'JsNetworkRequestReceivedCacheControlNoStoreResource' | 'WebRTCSticky' | 'WebTransportSticky' | 'WebSocketSticky' | 'SmartCard' | 'LiveMediaStreamTrack' | 'ContentSecurityHandler' | 'ContentWebAuthenticationAPI' | 'ContentFileChooser' | 'ContentSerial' | 'ContentFileSystemAccess' | 'ContentMediaDevicesDispatcherHost' | 'ContentWebBluetooth' | 'ContentWebUSB' | 'ContentMediaSessionService' | 'ContentScreenReader' | 'EmbedderPopupBlockerTabHelper' | 'EmbedderSafeBrowsingTriggeredPopupBlocker' | 'EmbedderSafeBrowsingThreatDetails' | 'EmbedderAppBannerManager' | 'EmbedderDomDistillerViewerSource' | 'EmbedderDomDistillerSelfDeletingRequestDelegate' | 'EmbedderOomInterventionTabHelper' | 'EmbedderOfflinePage' | 'EmbedderChromePasswordManagerClientBindCredentialManager' | 'EmbedderPermissionRequestManager' | 'EmbedderModalDialog' | 'EmbedderExtensions' | 'EmbedderExtensionMessaging' | 'EmbedderExtensionMessagingForOpenPort' | 'EmbedderExtensionSentMessageToCachedFrame';

    /**
     * Types of not restored reasons for back-forward cache.
     */
    export type BackForwardCacheNotRestoredReasonType = 'SupportPending' | 'PageSupportNeeded' | 'Circumstantial';

    export interface BackForwardCacheBlockingDetails {
      /**
       * Url of the file where blockage happened. Optional because of tests.
       */
      url?: string;

      /**
       * Function name where blockage happened. Optional because of anonymous functions and tests.
       */
      function?: string;

      /**
       * Line number in the script (0-based).
       */
      lineNumber: integer;

      /**
       * Column number in the script (0-based).
       */
      columnNumber: integer;
    }

    export interface BackForwardCacheNotRestoredExplanation {
      /**
       * Type of the reason
       */
      type: BackForwardCacheNotRestoredReasonType;

      /**
       * Not restored reason
       */
      reason: BackForwardCacheNotRestoredReason;

      /**
       * Context associated with the reason. The meaning of this context is
       * dependent on the reason:
       * - EmbedderExtensionSentMessageToCachedFrame: the extension ID.
       */
      context?: string;

      details?: BackForwardCacheBlockingDetails[];
    }

    export interface BackForwardCacheNotRestoredExplanationTree {
      /**
       * URL of each frame
       */
      url: string;

      /**
       * Not restored reasons of each frame
       */
      explanations: BackForwardCacheNotRestoredExplanation[];

      /**
       * Array of children frame
       */
      children: BackForwardCacheNotRestoredExplanationTree[];
    }
  }

  /**
   * Methods and events of the 'Performance' domain.
   */
  export interface PerformanceApi {
    requests: {
      /**
       * Disable collecting and reporting metrics.
       */
      disable: { params: Performance.DisableParams, result: Performance.DisableResult }

      /**
       * Enable collecting and reporting metrics.
       */
      enable: { params: Performance.EnableParams, result: Performance.EnableResult }

      /**
       * Sets time domain to use for collecting and reporting duration metrics.
       * Note that this must be called before enabling metrics collection. Calling
       * this method while metrics collection is enabled returns an error.
       * @deprecated
       */
      setTimeDomain: { params: Performance.SetTimeDomainParams, result: Performance.SetTimeDomainResult }

      /**
       * Retrieve current values of run-time metrics.
       */
      getMetrics: { params: Performance.GetMetricsParams, result: Performance.GetMetricsResult }
    };
    events: {

      /**
       * Current values of the metrics.
       */
      metrics: { params: Performance.MetricsEvent };
    };
  }

  /**
   * Types of the 'Performance' domain.
   */
  export namespace Performance {
    /**
     * Parameters of the 'Performance.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'Performance.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'Performance.enable' method.
     */
    export interface EnableParams {
      /**
       * Time domain to use for collecting and reporting duration metrics.
       */
      timeDomain?: 'timeTicks' | 'threadTicks';
    }

    /**
     * Return value of the 'Performance.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'Performance.setTimeDomain' method.
     */
    export interface SetTimeDomainParams {
      /**
       * Time domain
       */
      timeDomain: 'timeTicks' | 'threadTicks';
    }

    /**
     * Return value of the 'Performance.setTimeDomain' method.
     */
    export interface SetTimeDomainResult {
    }

    /**
     * Parameters of the 'Performance.getMetrics' method.
     */
    export interface GetMetricsParams {
    }

    /**
     * Return value of the 'Performance.getMetrics' method.
     */
    export interface GetMetricsResult {
      /**
       * Current values for run-time metrics.
       */
      metrics: Metric[];
    }

    /**
     * Parameters of the 'Performance.metrics' event.
     */
    export interface MetricsEvent {
      /**
       * Current values of the metrics.
       */
      metrics: Metric[];

      /**
       * Timestamp title.
       */
      title: string;
    }

    /**
     * Run-time execution metric.
     */
    export interface Metric {
      /**
       * Metric name.
       */
      name: string;

      /**
       * Metric value.
       */
      value: number;
    }
  }

  /**
   * Methods and events of the 'PerformanceTimeline' domain.
   */
  export interface PerformanceTimelineApi {
    requests: {
      /**
       * Previously buffered events would be reported before method returns.
       * See also: timelineEventAdded
       */
      enable: { params: PerformanceTimeline.EnableParams, result: PerformanceTimeline.EnableResult }
    };
    events: {

      /**
       * Sent when a performance timeline event is added. See reportPerformanceTimeline method.
       */
      timelineEventAdded: { params: PerformanceTimeline.TimelineEventAddedEvent };
    };
  }

  /**
   * Types of the 'PerformanceTimeline' domain.
   */
  export namespace PerformanceTimeline {
    /**
     * Parameters of the 'PerformanceTimeline.enable' method.
     */
    export interface EnableParams {
      /**
       * The types of event to report, as specified in
       * https://w3c.github.io/performance-timeline/#dom-performanceentry-entrytype
       * The specified filter overrides any previous filters, passing empty
       * filter disables recording.
       * Note that not all types exposed to the web platform are currently supported.
       */
      eventTypes: string[];
    }

    /**
     * Return value of the 'PerformanceTimeline.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'PerformanceTimeline.timelineEventAdded' event.
     */
    export interface TimelineEventAddedEvent {
      event: TimelineEvent;
    }

    /**
     * See https://github.com/WICG/LargestContentfulPaint and largest_contentful_paint.idl
     */
    export interface LargestContentfulPaint {
      renderTime: Network.TimeSinceEpoch;

      loadTime: Network.TimeSinceEpoch;

      /**
       * The number of pixels being painted.
       */
      size: number;

      /**
       * The id attribute of the element, if available.
       */
      elementId?: string;

      /**
       * The URL of the image (may be trimmed).
       */
      url?: string;

      nodeId?: DOM.BackendNodeId;
    }

    export interface LayoutShiftAttribution {
      previousRect: DOM.Rect;

      currentRect: DOM.Rect;

      nodeId?: DOM.BackendNodeId;
    }

    /**
     * See https://wicg.github.io/layout-instability/#sec-layout-shift and layout_shift.idl
     */
    export interface LayoutShift {
      /**
       * Score increment produced by this event.
       */
      value: number;

      hadRecentInput: boolean;

      lastInputTime: Network.TimeSinceEpoch;

      sources: LayoutShiftAttribution[];
    }

    export interface TimelineEvent {
      /**
       * Identifies the frame that this event is related to. Empty for non-frame targets.
       */
      frameId: Page.FrameId;

      /**
       * The event type, as specified in https://w3c.github.io/performance-timeline/#dom-performanceentry-entrytype
       * This determines which of the optional "details" fiedls is present.
       */
      type: string;

      /**
       * Name may be empty depending on the type.
       */
      name: string;

      /**
       * Time in seconds since Epoch, monotonically increasing within document lifetime.
       */
      time: Network.TimeSinceEpoch;

      /**
       * Event duration, if applicable.
       */
      duration?: number;

      lcpDetails?: LargestContentfulPaint;

      layoutShiftDetails?: LayoutShift;
    }
  }

  /**
   * Methods and events of the 'Security' domain.
   */
  export interface SecurityApi {
    requests: {
      /**
       * Disables tracking security state changes.
       */
      disable: { params: Security.DisableParams, result: Security.DisableResult }

      /**
       * Enables tracking security state changes.
       */
      enable: { params: Security.EnableParams, result: Security.EnableResult }

      /**
       * Enable/disable whether all certificate errors should be ignored.
       */
      setIgnoreCertificateErrors: { params: Security.SetIgnoreCertificateErrorsParams, result: Security.SetIgnoreCertificateErrorsResult }

      /**
       * Handles a certificate error that fired a certificateError event.
       * @deprecated
       */
      handleCertificateError: { params: Security.HandleCertificateErrorParams, result: Security.HandleCertificateErrorResult }

      /**
       * Enable/disable overriding certificate errors. If enabled, all certificate error events need to
       * be handled by the DevTools client and should be answered with `handleCertificateError` commands.
       * @deprecated
       */
      setOverrideCertificateErrors: { params: Security.SetOverrideCertificateErrorsParams, result: Security.SetOverrideCertificateErrorsResult }
    };
    events: {

      /**
       * There is a certificate error. If overriding certificate errors is enabled, then it should be
       * handled with the `handleCertificateError` command. Note: this event does not fire if the
       * certificate error has been allowed internally. Only one client per target should override
       * certificate errors at the same time.
       * @deprecated
       */
      certificateError: { params: Security.CertificateErrorEvent };

      /**
       * The security state of the page changed.
       */
      visibleSecurityStateChanged: { params: Security.VisibleSecurityStateChangedEvent };

      /**
       * The security state of the page changed. No longer being sent.
       * @deprecated
       */
      securityStateChanged: { params: Security.SecurityStateChangedEvent };
    };
  }

  /**
   * Types of the 'Security' domain.
   */
  export namespace Security {
    /**
     * Parameters of the 'Security.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'Security.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'Security.enable' method.
     */
    export interface EnableParams {
    }

    /**
     * Return value of the 'Security.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'Security.setIgnoreCertificateErrors' method.
     */
    export interface SetIgnoreCertificateErrorsParams {
      /**
       * If true, all certificate errors will be ignored.
       */
      ignore: boolean;
    }

    /**
     * Return value of the 'Security.setIgnoreCertificateErrors' method.
     */
    export interface SetIgnoreCertificateErrorsResult {
    }

    /**
     * Parameters of the 'Security.handleCertificateError' method.
     */
    export interface HandleCertificateErrorParams {
      /**
       * The ID of the event.
       */
      eventId: integer;

      /**
       * The action to take on the certificate error.
       */
      action: CertificateErrorAction;
    }

    /**
     * Return value of the 'Security.handleCertificateError' method.
     */
    export interface HandleCertificateErrorResult {
    }

    /**
     * Parameters of the 'Security.setOverrideCertificateErrors' method.
     */
    export interface SetOverrideCertificateErrorsParams {
      /**
       * If true, certificate errors will be overridden.
       */
      override: boolean;
    }

    /**
     * Return value of the 'Security.setOverrideCertificateErrors' method.
     */
    export interface SetOverrideCertificateErrorsResult {
    }

    /**
     * Parameters of the 'Security.certificateError' event.
     */
    export interface CertificateErrorEvent {
      /**
       * The ID of the event.
       */
      eventId: integer;

      /**
       * The type of the error.
       */
      errorType: string;

      /**
       * The url that was requested.
       */
      requestURL: string;
    }

    /**
     * Parameters of the 'Security.visibleSecurityStateChanged' event.
     */
    export interface VisibleSecurityStateChangedEvent {
      /**
       * Security state information about the page.
       */
      visibleSecurityState: VisibleSecurityState;
    }

    /**
     * Parameters of the 'Security.securityStateChanged' event.
     */
    export interface SecurityStateChangedEvent {
      /**
       * Security state.
       */
      securityState: SecurityState;

      /**
       * True if the page was loaded over cryptographic transport such as HTTPS.
       * @deprecated
       */
      schemeIsCryptographic: boolean;

      /**
       * Previously a list of explanations for the security state. Now always
       * empty.
       * @deprecated
       */
      explanations: SecurityStateExplanation[];

      /**
       * Information about insecure content on the page.
       * @deprecated
       */
      insecureContentStatus: InsecureContentStatus;

      /**
       * Overrides user-visible description of the state. Always omitted.
       * @deprecated
       */
      summary?: string;
    }

    /**
     * An internal certificate ID value.
     */
    export type CertificateId = integer;

    /**
     * A description of mixed content (HTTP resources on HTTPS pages), as defined by
     * https://www.w3.org/TR/mixed-content/#categories
     */
    export type MixedContentType = 'blockable' | 'optionally-blockable' | 'none';

    /**
     * The security level of a page or resource.
     */
    export type SecurityState = 'unknown' | 'neutral' | 'insecure' | 'secure' | 'info' | 'insecure-broken';

    /**
     * Details about the security state of the page certificate.
     */
    export interface CertificateSecurityState {
      /**
       * Protocol name (e.g. "TLS 1.2" or "QUIC").
       */
      protocol: string;

      /**
       * Key Exchange used by the connection, or the empty string if not applicable.
       */
      keyExchange: string;

      /**
       * (EC)DH group used by the connection, if applicable.
       */
      keyExchangeGroup?: string;

      /**
       * Cipher name.
       */
      cipher: string;

      /**
       * TLS MAC. Note that AEAD ciphers do not have separate MACs.
       */
      mac?: string;

      /**
       * Page certificate.
       */
      certificate: string[];

      /**
       * Certificate subject name.
       */
      subjectName: string;

      /**
       * Name of the issuing CA.
       */
      issuer: string;

      /**
       * Certificate valid from date.
       */
      validFrom: Network.TimeSinceEpoch;

      /**
       * Certificate valid to (expiration) date
       */
      validTo: Network.TimeSinceEpoch;

      /**
       * The highest priority network error code, if the certificate has an error.
       */
      certificateNetworkError?: string;

      /**
       * True if the certificate uses a weak signature aglorithm.
       */
      certificateHasWeakSignature: boolean;

      /**
       * True if the certificate has a SHA1 signature in the chain.
       */
      certificateHasSha1Signature: boolean;

      /**
       * True if modern SSL
       */
      modernSSL: boolean;

      /**
       * True if the connection is using an obsolete SSL protocol.
       */
      obsoleteSslProtocol: boolean;

      /**
       * True if the connection is using an obsolete SSL key exchange.
       */
      obsoleteSslKeyExchange: boolean;

      /**
       * True if the connection is using an obsolete SSL cipher.
       */
      obsoleteSslCipher: boolean;

      /**
       * True if the connection is using an obsolete SSL signature.
       */
      obsoleteSslSignature: boolean;
    }

    export type SafetyTipStatus = 'badReputation' | 'lookalike';

    export interface SafetyTipInfo {
      /**
       * Describes whether the page triggers any safety tips or reputation warnings. Default is unknown.
       */
      safetyTipStatus: SafetyTipStatus;

      /**
       * The URL the safety tip suggested ("Did you mean?"). Only filled in for lookalike matches.
       */
      safeUrl?: string;
    }

    /**
     * Security state information about the page.
     */
    export interface VisibleSecurityState {
      /**
       * The security level of the page.
       */
      securityState: SecurityState;

      /**
       * Security state details about the page certificate.
       */
      certificateSecurityState?: CertificateSecurityState;

      /**
       * The type of Safety Tip triggered on the page. Note that this field will be set even if the Safety Tip UI was not actually shown.
       */
      safetyTipInfo?: SafetyTipInfo;

      /**
       * Array of security state issues ids.
       */
      securityStateIssueIds: string[];
    }

    /**
     * An explanation of an factor contributing to the security state.
     */
    export interface SecurityStateExplanation {
      /**
       * Security state representing the severity of the factor being explained.
       */
      securityState: SecurityState;

      /**
       * Title describing the type of factor.
       */
      title: string;

      /**
       * Short phrase describing the type of factor.
       */
      summary: string;

      /**
       * Full text explanation of the factor.
       */
      description: string;

      /**
       * The type of mixed content described by the explanation.
       */
      mixedContentType: MixedContentType;

      /**
       * Page certificate.
       */
      certificate: string[];

      /**
       * Recommendations to fix any issues.
       */
      recommendations?: string[];
    }

    /**
     * Information about insecure content on the page.
     * @deprecated
     */
    export interface InsecureContentStatus {
      /**
       * Always false.
       */
      ranMixedContent: boolean;

      /**
       * Always false.
       */
      displayedMixedContent: boolean;

      /**
       * Always false.
       */
      containedMixedForm: boolean;

      /**
       * Always false.
       */
      ranContentWithCertErrors: boolean;

      /**
       * Always false.
       */
      displayedContentWithCertErrors: boolean;

      /**
       * Always set to unknown.
       */
      ranInsecureContentStyle: SecurityState;

      /**
       * Always set to unknown.
       */
      displayedInsecureContentStyle: SecurityState;
    }

    /**
     * The action to take when a certificate error occurs. continue will continue processing the
     * request and cancel will cancel the request.
     */
    export type CertificateErrorAction = 'continue' | 'cancel';
  }

  /**
   * Methods and events of the 'ServiceWorker' domain.
   */
  export interface ServiceWorkerApi {
    requests: {
      deliverPushMessage: { params: ServiceWorker.DeliverPushMessageParams, result: ServiceWorker.DeliverPushMessageResult }

      disable: { params: ServiceWorker.DisableParams, result: ServiceWorker.DisableResult }

      dispatchSyncEvent: { params: ServiceWorker.DispatchSyncEventParams, result: ServiceWorker.DispatchSyncEventResult }

      dispatchPeriodicSyncEvent: { params: ServiceWorker.DispatchPeriodicSyncEventParams, result: ServiceWorker.DispatchPeriodicSyncEventResult }

      enable: { params: ServiceWorker.EnableParams, result: ServiceWorker.EnableResult }

      inspectWorker: { params: ServiceWorker.InspectWorkerParams, result: ServiceWorker.InspectWorkerResult }

      setForceUpdateOnPageLoad: { params: ServiceWorker.SetForceUpdateOnPageLoadParams, result: ServiceWorker.SetForceUpdateOnPageLoadResult }

      skipWaiting: { params: ServiceWorker.SkipWaitingParams, result: ServiceWorker.SkipWaitingResult }

      startWorker: { params: ServiceWorker.StartWorkerParams, result: ServiceWorker.StartWorkerResult }

      stopAllWorkers: { params: ServiceWorker.StopAllWorkersParams, result: ServiceWorker.StopAllWorkersResult }

      stopWorker: { params: ServiceWorker.StopWorkerParams, result: ServiceWorker.StopWorkerResult }

      unregister: { params: ServiceWorker.UnregisterParams, result: ServiceWorker.UnregisterResult }

      updateRegistration: { params: ServiceWorker.UpdateRegistrationParams, result: ServiceWorker.UpdateRegistrationResult }
    };
    events: {

      workerErrorReported: { params: ServiceWorker.WorkerErrorReportedEvent };

      workerRegistrationUpdated: { params: ServiceWorker.WorkerRegistrationUpdatedEvent };

      workerVersionUpdated: { params: ServiceWorker.WorkerVersionUpdatedEvent };
    };
  }

  /**
   * Types of the 'ServiceWorker' domain.
   */
  export namespace ServiceWorker {
    /**
     * Parameters of the 'ServiceWorker.deliverPushMessage' method.
     */
    export interface DeliverPushMessageParams {
      origin: string;

      registrationId: RegistrationID;

      data: string;
    }

    /**
     * Return value of the 'ServiceWorker.deliverPushMessage' method.
     */
    export interface DeliverPushMessageResult {
    }

    /**
     * Parameters of the 'ServiceWorker.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'ServiceWorker.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'ServiceWorker.dispatchSyncEvent' method.
     */
    export interface DispatchSyncEventParams {
      origin: string;

      registrationId: RegistrationID;

      tag: string;

      lastChance: boolean;
    }

    /**
     * Return value of the 'ServiceWorker.dispatchSyncEvent' method.
     */
    export interface DispatchSyncEventResult {
    }

    /**
     * Parameters of the 'ServiceWorker.dispatchPeriodicSyncEvent' method.
     */
    export interface DispatchPeriodicSyncEventParams {
      origin: string;

      registrationId: RegistrationID;

      tag: string;
    }

    /**
     * Return value of the 'ServiceWorker.dispatchPeriodicSyncEvent' method.
     */
    export interface DispatchPeriodicSyncEventResult {
    }

    /**
     * Parameters of the 'ServiceWorker.enable' method.
     */
    export interface EnableParams {
    }

    /**
     * Return value of the 'ServiceWorker.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'ServiceWorker.inspectWorker' method.
     */
    export interface InspectWorkerParams {
      versionId: string;
    }

    /**
     * Return value of the 'ServiceWorker.inspectWorker' method.
     */
    export interface InspectWorkerResult {
    }

    /**
     * Parameters of the 'ServiceWorker.setForceUpdateOnPageLoad' method.
     */
    export interface SetForceUpdateOnPageLoadParams {
      forceUpdateOnPageLoad: boolean;
    }

    /**
     * Return value of the 'ServiceWorker.setForceUpdateOnPageLoad' method.
     */
    export interface SetForceUpdateOnPageLoadResult {
    }

    /**
     * Parameters of the 'ServiceWorker.skipWaiting' method.
     */
    export interface SkipWaitingParams {
      scopeURL: string;
    }

    /**
     * Return value of the 'ServiceWorker.skipWaiting' method.
     */
    export interface SkipWaitingResult {
    }

    /**
     * Parameters of the 'ServiceWorker.startWorker' method.
     */
    export interface StartWorkerParams {
      scopeURL: string;
    }

    /**
     * Return value of the 'ServiceWorker.startWorker' method.
     */
    export interface StartWorkerResult {
    }

    /**
     * Parameters of the 'ServiceWorker.stopAllWorkers' method.
     */
    export interface StopAllWorkersParams {
    }

    /**
     * Return value of the 'ServiceWorker.stopAllWorkers' method.
     */
    export interface StopAllWorkersResult {
    }

    /**
     * Parameters of the 'ServiceWorker.stopWorker' method.
     */
    export interface StopWorkerParams {
      versionId: string;
    }

    /**
     * Return value of the 'ServiceWorker.stopWorker' method.
     */
    export interface StopWorkerResult {
    }

    /**
     * Parameters of the 'ServiceWorker.unregister' method.
     */
    export interface UnregisterParams {
      scopeURL: string;
    }

    /**
     * Return value of the 'ServiceWorker.unregister' method.
     */
    export interface UnregisterResult {
    }

    /**
     * Parameters of the 'ServiceWorker.updateRegistration' method.
     */
    export interface UpdateRegistrationParams {
      scopeURL: string;
    }

    /**
     * Return value of the 'ServiceWorker.updateRegistration' method.
     */
    export interface UpdateRegistrationResult {
    }

    /**
     * Parameters of the 'ServiceWorker.workerErrorReported' event.
     */
    export interface WorkerErrorReportedEvent {
      errorMessage: ServiceWorkerErrorMessage;
    }

    /**
     * Parameters of the 'ServiceWorker.workerRegistrationUpdated' event.
     */
    export interface WorkerRegistrationUpdatedEvent {
      registrations: ServiceWorkerRegistration[];
    }

    /**
     * Parameters of the 'ServiceWorker.workerVersionUpdated' event.
     */
    export interface WorkerVersionUpdatedEvent {
      versions: ServiceWorkerVersion[];
    }

    export type RegistrationID = string;

    /**
     * ServiceWorker registration.
     */
    export interface ServiceWorkerRegistration {
      registrationId: RegistrationID;

      scopeURL: string;

      isDeleted: boolean;
    }

    export type ServiceWorkerVersionRunningStatus = 'stopped' | 'starting' | 'running' | 'stopping';

    export type ServiceWorkerVersionStatus = 'new' | 'installing' | 'installed' | 'activating' | 'activated' | 'redundant';

    /**
     * ServiceWorker version.
     */
    export interface ServiceWorkerVersion {
      versionId: string;

      registrationId: RegistrationID;

      scriptURL: string;

      runningStatus: ServiceWorkerVersionRunningStatus;

      status: ServiceWorkerVersionStatus;

      /**
       * The Last-Modified header value of the main script.
       */
      scriptLastModified?: number;

      /**
       * The time at which the response headers of the main script were received from the server.
       * For cached script it is the last time the cache entry was validated.
       */
      scriptResponseTime?: number;

      controlledClients?: Target.TargetID[];

      targetId?: Target.TargetID;

      routerRules?: string;
    }

    /**
     * ServiceWorker error message.
     */
    export interface ServiceWorkerErrorMessage {
      errorMessage: string;

      registrationId: RegistrationID;

      versionId: string;

      sourceURL: string;

      lineNumber: integer;

      columnNumber: integer;
    }
  }

  /**
   * Methods and events of the 'Storage' domain.
   */
  export interface StorageApi {
    requests: {
      /**
       * Returns a storage key given a frame id.
       */
      getStorageKeyForFrame: { params: Storage.GetStorageKeyForFrameParams, result: Storage.GetStorageKeyForFrameResult }

      /**
       * Clears storage for origin.
       */
      clearDataForOrigin: { params: Storage.ClearDataForOriginParams, result: Storage.ClearDataForOriginResult }

      /**
       * Clears storage for storage key.
       */
      clearDataForStorageKey: { params: Storage.ClearDataForStorageKeyParams, result: Storage.ClearDataForStorageKeyResult }

      /**
       * Returns all browser cookies.
       */
      getCookies: { params: Storage.GetCookiesParams, result: Storage.GetCookiesResult }

      /**
       * Sets given cookies.
       */
      setCookies: { params: Storage.SetCookiesParams, result: Storage.SetCookiesResult }

      /**
       * Clears cookies.
       */
      clearCookies: { params: Storage.ClearCookiesParams, result: Storage.ClearCookiesResult }

      /**
       * Returns usage and quota in bytes.
       */
      getUsageAndQuota: { params: Storage.GetUsageAndQuotaParams, result: Storage.GetUsageAndQuotaResult }

      /**
       * Override quota for the specified origin
       */
      overrideQuotaForOrigin: { params: Storage.OverrideQuotaForOriginParams, result: Storage.OverrideQuotaForOriginResult }

      /**
       * Registers origin to be notified when an update occurs to its cache storage list.
       */
      trackCacheStorageForOrigin: { params: Storage.TrackCacheStorageForOriginParams, result: Storage.TrackCacheStorageForOriginResult }

      /**
       * Registers storage key to be notified when an update occurs to its cache storage list.
       */
      trackCacheStorageForStorageKey: { params: Storage.TrackCacheStorageForStorageKeyParams, result: Storage.TrackCacheStorageForStorageKeyResult }

      /**
       * Registers origin to be notified when an update occurs to its IndexedDB.
       */
      trackIndexedDBForOrigin: { params: Storage.TrackIndexedDBForOriginParams, result: Storage.TrackIndexedDBForOriginResult }

      /**
       * Registers storage key to be notified when an update occurs to its IndexedDB.
       */
      trackIndexedDBForStorageKey: { params: Storage.TrackIndexedDBForStorageKeyParams, result: Storage.TrackIndexedDBForStorageKeyResult }

      /**
       * Unregisters origin from receiving notifications for cache storage.
       */
      untrackCacheStorageForOrigin: { params: Storage.UntrackCacheStorageForOriginParams, result: Storage.UntrackCacheStorageForOriginResult }

      /**
       * Unregisters storage key from receiving notifications for cache storage.
       */
      untrackCacheStorageForStorageKey: { params: Storage.UntrackCacheStorageForStorageKeyParams, result: Storage.UntrackCacheStorageForStorageKeyResult }

      /**
       * Unregisters origin from receiving notifications for IndexedDB.
       */
      untrackIndexedDBForOrigin: { params: Storage.UntrackIndexedDBForOriginParams, result: Storage.UntrackIndexedDBForOriginResult }

      /**
       * Unregisters storage key from receiving notifications for IndexedDB.
       */
      untrackIndexedDBForStorageKey: { params: Storage.UntrackIndexedDBForStorageKeyParams, result: Storage.UntrackIndexedDBForStorageKeyResult }

      /**
       * Returns the number of stored Trust Tokens per issuer for the
       * current browsing context.
       */
      getTrustTokens: { params: Storage.GetTrustTokensParams, result: Storage.GetTrustTokensResult }

      /**
       * Removes all Trust Tokens issued by the provided issuerOrigin.
       * Leaves other stored data, including the issuer's Redemption Records, intact.
       */
      clearTrustTokens: { params: Storage.ClearTrustTokensParams, result: Storage.ClearTrustTokensResult }

      /**
       * Gets details for a named interest group.
       */
      getInterestGroupDetails: { params: Storage.GetInterestGroupDetailsParams, result: Storage.GetInterestGroupDetailsResult }

      /**
       * Enables/Disables issuing of interestGroupAccessed events.
       */
      setInterestGroupTracking: { params: Storage.SetInterestGroupTrackingParams, result: Storage.SetInterestGroupTrackingResult }

      /**
       * Gets metadata for an origin's shared storage.
       */
      getSharedStorageMetadata: { params: Storage.GetSharedStorageMetadataParams, result: Storage.GetSharedStorageMetadataResult }

      /**
       * Gets the entries in an given origin's shared storage.
       */
      getSharedStorageEntries: { params: Storage.GetSharedStorageEntriesParams, result: Storage.GetSharedStorageEntriesResult }

      /**
       * Sets entry with `key` and `value` for a given origin's shared storage.
       */
      setSharedStorageEntry: { params: Storage.SetSharedStorageEntryParams, result: Storage.SetSharedStorageEntryResult }

      /**
       * Deletes entry for `key` (if it exists) for a given origin's shared storage.
       */
      deleteSharedStorageEntry: { params: Storage.DeleteSharedStorageEntryParams, result: Storage.DeleteSharedStorageEntryResult }

      /**
       * Clears all entries for a given origin's shared storage.
       */
      clearSharedStorageEntries: { params: Storage.ClearSharedStorageEntriesParams, result: Storage.ClearSharedStorageEntriesResult }

      /**
       * Resets the budget for `ownerOrigin` by clearing all budget withdrawals.
       */
      resetSharedStorageBudget: { params: Storage.ResetSharedStorageBudgetParams, result: Storage.ResetSharedStorageBudgetResult }

      /**
       * Enables/disables issuing of sharedStorageAccessed events.
       */
      setSharedStorageTracking: { params: Storage.SetSharedStorageTrackingParams, result: Storage.SetSharedStorageTrackingResult }

      /**
       * Set tracking for a storage key's buckets.
       */
      setStorageBucketTracking: { params: Storage.SetStorageBucketTrackingParams, result: Storage.SetStorageBucketTrackingResult }

      /**
       * Deletes the Storage Bucket with the given storage key and bucket name.
       */
      deleteStorageBucket: { params: Storage.DeleteStorageBucketParams, result: Storage.DeleteStorageBucketResult }

      /**
       * Deletes state for sites identified as potential bounce trackers, immediately.
       */
      runBounceTrackingMitigations: { params: Storage.RunBounceTrackingMitigationsParams, result: Storage.RunBounceTrackingMitigationsResult }

      /**
       * https://wicg.github.io/attribution-reporting-api/
       */
      setAttributionReportingLocalTestingMode: { params: Storage.SetAttributionReportingLocalTestingModeParams, result: Storage.SetAttributionReportingLocalTestingModeResult }

      /**
       * Enables/disables issuing of Attribution Reporting events.
       */
      setAttributionReportingTracking: { params: Storage.SetAttributionReportingTrackingParams, result: Storage.SetAttributionReportingTrackingResult }
    };
    events: {

      /**
       * A cache's contents have been modified.
       */
      cacheStorageContentUpdated: { params: Storage.CacheStorageContentUpdatedEvent };

      /**
       * A cache has been added/deleted.
       */
      cacheStorageListUpdated: { params: Storage.CacheStorageListUpdatedEvent };

      /**
       * The origin's IndexedDB object store has been modified.
       */
      indexedDBContentUpdated: { params: Storage.IndexedDBContentUpdatedEvent };

      /**
       * The origin's IndexedDB database list has been modified.
       */
      indexedDBListUpdated: { params: Storage.IndexedDBListUpdatedEvent };

      /**
       * One of the interest groups was accessed by the associated page.
       */
      interestGroupAccessed: { params: Storage.InterestGroupAccessedEvent };

      /**
       * Shared storage was accessed by the associated page.
       * The following parameters are included in all events.
       */
      sharedStorageAccessed: { params: Storage.SharedStorageAccessedEvent };

      storageBucketCreatedOrUpdated: { params: Storage.StorageBucketCreatedOrUpdatedEvent };

      storageBucketDeleted: { params: Storage.StorageBucketDeletedEvent };

      attributionReportingSourceRegistered: { params: Storage.AttributionReportingSourceRegisteredEvent };

      attributionReportingTriggerRegistered: { params: Storage.AttributionReportingTriggerRegisteredEvent };
    };
  }

  /**
   * Types of the 'Storage' domain.
   */
  export namespace Storage {
    /**
     * Parameters of the 'Storage.getStorageKeyForFrame' method.
     */
    export interface GetStorageKeyForFrameParams {
      frameId: Page.FrameId;
    }

    /**
     * Return value of the 'Storage.getStorageKeyForFrame' method.
     */
    export interface GetStorageKeyForFrameResult {
      storageKey: SerializedStorageKey;
    }

    /**
     * Parameters of the 'Storage.clearDataForOrigin' method.
     */
    export interface ClearDataForOriginParams {
      /**
       * Security origin.
       */
      origin: string;

      /**
       * Comma separated list of StorageType to clear.
       */
      storageTypes: string;
    }

    /**
     * Return value of the 'Storage.clearDataForOrigin' method.
     */
    export interface ClearDataForOriginResult {
    }

    /**
     * Parameters of the 'Storage.clearDataForStorageKey' method.
     */
    export interface ClearDataForStorageKeyParams {
      /**
       * Storage key.
       */
      storageKey: string;

      /**
       * Comma separated list of StorageType to clear.
       */
      storageTypes: string;
    }

    /**
     * Return value of the 'Storage.clearDataForStorageKey' method.
     */
    export interface ClearDataForStorageKeyResult {
    }

    /**
     * Parameters of the 'Storage.getCookies' method.
     */
    export interface GetCookiesParams {
      /**
       * Browser context to use when called on the browser endpoint.
       */
      browserContextId?: Browser.BrowserContextID;
    }

    /**
     * Return value of the 'Storage.getCookies' method.
     */
    export interface GetCookiesResult {
      /**
       * Array of cookie objects.
       */
      cookies: Network.Cookie[];
    }

    /**
     * Parameters of the 'Storage.setCookies' method.
     */
    export interface SetCookiesParams {
      /**
       * Cookies to be set.
       */
      cookies: Network.CookieParam[];

      /**
       * Browser context to use when called on the browser endpoint.
       */
      browserContextId?: Browser.BrowserContextID;
    }

    /**
     * Return value of the 'Storage.setCookies' method.
     */
    export interface SetCookiesResult {
    }

    /**
     * Parameters of the 'Storage.clearCookies' method.
     */
    export interface ClearCookiesParams {
      /**
       * Browser context to use when called on the browser endpoint.
       */
      browserContextId?: Browser.BrowserContextID;
    }

    /**
     * Return value of the 'Storage.clearCookies' method.
     */
    export interface ClearCookiesResult {
    }

    /**
     * Parameters of the 'Storage.getUsageAndQuota' method.
     */
    export interface GetUsageAndQuotaParams {
      /**
       * Security origin.
       */
      origin: string;
    }

    /**
     * Return value of the 'Storage.getUsageAndQuota' method.
     */
    export interface GetUsageAndQuotaResult {
      /**
       * Storage usage (bytes).
       */
      usage: number;

      /**
       * Storage quota (bytes).
       */
      quota: number;

      /**
       * Whether or not the origin has an active storage quota override
       */
      overrideActive: boolean;

      /**
       * Storage usage per type (bytes).
       */
      usageBreakdown: UsageForType[];
    }

    /**
     * Parameters of the 'Storage.overrideQuotaForOrigin' method.
     */
    export interface OverrideQuotaForOriginParams {
      /**
       * Security origin.
       */
      origin: string;

      /**
       * The quota size (in bytes) to override the original quota with.
       * If this is called multiple times, the overridden quota will be equal to
       * the quotaSize provided in the final call. If this is called without
       * specifying a quotaSize, the quota will be reset to the default value for
       * the specified origin. If this is called multiple times with different
       * origins, the override will be maintained for each origin until it is
       * disabled (called without a quotaSize).
       */
      quotaSize?: number;
    }

    /**
     * Return value of the 'Storage.overrideQuotaForOrigin' method.
     */
    export interface OverrideQuotaForOriginResult {
    }

    /**
     * Parameters of the 'Storage.trackCacheStorageForOrigin' method.
     */
    export interface TrackCacheStorageForOriginParams {
      /**
       * Security origin.
       */
      origin: string;
    }

    /**
     * Return value of the 'Storage.trackCacheStorageForOrigin' method.
     */
    export interface TrackCacheStorageForOriginResult {
    }

    /**
     * Parameters of the 'Storage.trackCacheStorageForStorageKey' method.
     */
    export interface TrackCacheStorageForStorageKeyParams {
      /**
       * Storage key.
       */
      storageKey: string;
    }

    /**
     * Return value of the 'Storage.trackCacheStorageForStorageKey' method.
     */
    export interface TrackCacheStorageForStorageKeyResult {
    }

    /**
     * Parameters of the 'Storage.trackIndexedDBForOrigin' method.
     */
    export interface TrackIndexedDBForOriginParams {
      /**
       * Security origin.
       */
      origin: string;
    }

    /**
     * Return value of the 'Storage.trackIndexedDBForOrigin' method.
     */
    export interface TrackIndexedDBForOriginResult {
    }

    /**
     * Parameters of the 'Storage.trackIndexedDBForStorageKey' method.
     */
    export interface TrackIndexedDBForStorageKeyParams {
      /**
       * Storage key.
       */
      storageKey: string;
    }

    /**
     * Return value of the 'Storage.trackIndexedDBForStorageKey' method.
     */
    export interface TrackIndexedDBForStorageKeyResult {
    }

    /**
     * Parameters of the 'Storage.untrackCacheStorageForOrigin' method.
     */
    export interface UntrackCacheStorageForOriginParams {
      /**
       * Security origin.
       */
      origin: string;
    }

    /**
     * Return value of the 'Storage.untrackCacheStorageForOrigin' method.
     */
    export interface UntrackCacheStorageForOriginResult {
    }

    /**
     * Parameters of the 'Storage.untrackCacheStorageForStorageKey' method.
     */
    export interface UntrackCacheStorageForStorageKeyParams {
      /**
       * Storage key.
       */
      storageKey: string;
    }

    /**
     * Return value of the 'Storage.untrackCacheStorageForStorageKey' method.
     */
    export interface UntrackCacheStorageForStorageKeyResult {
    }

    /**
     * Parameters of the 'Storage.untrackIndexedDBForOrigin' method.
     */
    export interface UntrackIndexedDBForOriginParams {
      /**
       * Security origin.
       */
      origin: string;
    }

    /**
     * Return value of the 'Storage.untrackIndexedDBForOrigin' method.
     */
    export interface UntrackIndexedDBForOriginResult {
    }

    /**
     * Parameters of the 'Storage.untrackIndexedDBForStorageKey' method.
     */
    export interface UntrackIndexedDBForStorageKeyParams {
      /**
       * Storage key.
       */
      storageKey: string;
    }

    /**
     * Return value of the 'Storage.untrackIndexedDBForStorageKey' method.
     */
    export interface UntrackIndexedDBForStorageKeyResult {
    }

    /**
     * Parameters of the 'Storage.getTrustTokens' method.
     */
    export interface GetTrustTokensParams {
    }

    /**
     * Return value of the 'Storage.getTrustTokens' method.
     */
    export interface GetTrustTokensResult {
      tokens: TrustTokens[];
    }

    /**
     * Parameters of the 'Storage.clearTrustTokens' method.
     */
    export interface ClearTrustTokensParams {
      issuerOrigin: string;
    }

    /**
     * Return value of the 'Storage.clearTrustTokens' method.
     */
    export interface ClearTrustTokensResult {
      /**
       * True if any tokens were deleted, false otherwise.
       */
      didDeleteTokens: boolean;
    }

    /**
     * Parameters of the 'Storage.getInterestGroupDetails' method.
     */
    export interface GetInterestGroupDetailsParams {
      ownerOrigin: string;

      name: string;
    }

    /**
     * Return value of the 'Storage.getInterestGroupDetails' method.
     */
    export interface GetInterestGroupDetailsResult {
      details: InterestGroupDetails;
    }

    /**
     * Parameters of the 'Storage.setInterestGroupTracking' method.
     */
    export interface SetInterestGroupTrackingParams {
      enable: boolean;
    }

    /**
     * Return value of the 'Storage.setInterestGroupTracking' method.
     */
    export interface SetInterestGroupTrackingResult {
    }

    /**
     * Parameters of the 'Storage.getSharedStorageMetadata' method.
     */
    export interface GetSharedStorageMetadataParams {
      ownerOrigin: string;
    }

    /**
     * Return value of the 'Storage.getSharedStorageMetadata' method.
     */
    export interface GetSharedStorageMetadataResult {
      metadata: SharedStorageMetadata;
    }

    /**
     * Parameters of the 'Storage.getSharedStorageEntries' method.
     */
    export interface GetSharedStorageEntriesParams {
      ownerOrigin: string;
    }

    /**
     * Return value of the 'Storage.getSharedStorageEntries' method.
     */
    export interface GetSharedStorageEntriesResult {
      entries: SharedStorageEntry[];
    }

    /**
     * Parameters of the 'Storage.setSharedStorageEntry' method.
     */
    export interface SetSharedStorageEntryParams {
      ownerOrigin: string;

      key: string;

      value: string;

      /**
       * If `ignoreIfPresent` is included and true, then only sets the entry if
       * `key` doesn't already exist.
       */
      ignoreIfPresent?: boolean;
    }

    /**
     * Return value of the 'Storage.setSharedStorageEntry' method.
     */
    export interface SetSharedStorageEntryResult {
    }

    /**
     * Parameters of the 'Storage.deleteSharedStorageEntry' method.
     */
    export interface DeleteSharedStorageEntryParams {
      ownerOrigin: string;

      key: string;
    }

    /**
     * Return value of the 'Storage.deleteSharedStorageEntry' method.
     */
    export interface DeleteSharedStorageEntryResult {
    }

    /**
     * Parameters of the 'Storage.clearSharedStorageEntries' method.
     */
    export interface ClearSharedStorageEntriesParams {
      ownerOrigin: string;
    }

    /**
     * Return value of the 'Storage.clearSharedStorageEntries' method.
     */
    export interface ClearSharedStorageEntriesResult {
    }

    /**
     * Parameters of the 'Storage.resetSharedStorageBudget' method.
     */
    export interface ResetSharedStorageBudgetParams {
      ownerOrigin: string;
    }

    /**
     * Return value of the 'Storage.resetSharedStorageBudget' method.
     */
    export interface ResetSharedStorageBudgetResult {
    }

    /**
     * Parameters of the 'Storage.setSharedStorageTracking' method.
     */
    export interface SetSharedStorageTrackingParams {
      enable: boolean;
    }

    /**
     * Return value of the 'Storage.setSharedStorageTracking' method.
     */
    export interface SetSharedStorageTrackingResult {
    }

    /**
     * Parameters of the 'Storage.setStorageBucketTracking' method.
     */
    export interface SetStorageBucketTrackingParams {
      storageKey: string;

      enable: boolean;
    }

    /**
     * Return value of the 'Storage.setStorageBucketTracking' method.
     */
    export interface SetStorageBucketTrackingResult {
    }

    /**
     * Parameters of the 'Storage.deleteStorageBucket' method.
     */
    export interface DeleteStorageBucketParams {
      bucket: StorageBucket;
    }

    /**
     * Return value of the 'Storage.deleteStorageBucket' method.
     */
    export interface DeleteStorageBucketResult {
    }

    /**
     * Parameters of the 'Storage.runBounceTrackingMitigations' method.
     */
    export interface RunBounceTrackingMitigationsParams {
    }

    /**
     * Return value of the 'Storage.runBounceTrackingMitigations' method.
     */
    export interface RunBounceTrackingMitigationsResult {
      deletedSites: string[];
    }

    /**
     * Parameters of the 'Storage.setAttributionReportingLocalTestingMode' method.
     */
    export interface SetAttributionReportingLocalTestingModeParams {
      /**
       * If enabled, noise is suppressed and reports are sent immediately.
       */
      enabled: boolean;
    }

    /**
     * Return value of the 'Storage.setAttributionReportingLocalTestingMode' method.
     */
    export interface SetAttributionReportingLocalTestingModeResult {
    }

    /**
     * Parameters of the 'Storage.setAttributionReportingTracking' method.
     */
    export interface SetAttributionReportingTrackingParams {
      enable: boolean;
    }

    /**
     * Return value of the 'Storage.setAttributionReportingTracking' method.
     */
    export interface SetAttributionReportingTrackingResult {
    }

    /**
     * Parameters of the 'Storage.cacheStorageContentUpdated' event.
     */
    export interface CacheStorageContentUpdatedEvent {
      /**
       * Origin to update.
       */
      origin: string;

      /**
       * Storage key to update.
       */
      storageKey: string;

      /**
       * Storage bucket to update.
       */
      bucketId: string;

      /**
       * Name of cache in origin.
       */
      cacheName: string;
    }

    /**
     * Parameters of the 'Storage.cacheStorageListUpdated' event.
     */
    export interface CacheStorageListUpdatedEvent {
      /**
       * Origin to update.
       */
      origin: string;

      /**
       * Storage key to update.
       */
      storageKey: string;

      /**
       * Storage bucket to update.
       */
      bucketId: string;
    }

    /**
     * Parameters of the 'Storage.indexedDBContentUpdated' event.
     */
    export interface IndexedDBContentUpdatedEvent {
      /**
       * Origin to update.
       */
      origin: string;

      /**
       * Storage key to update.
       */
      storageKey: string;

      /**
       * Storage bucket to update.
       */
      bucketId: string;

      /**
       * Database to update.
       */
      databaseName: string;

      /**
       * ObjectStore to update.
       */
      objectStoreName: string;
    }

    /**
     * Parameters of the 'Storage.indexedDBListUpdated' event.
     */
    export interface IndexedDBListUpdatedEvent {
      /**
       * Origin to update.
       */
      origin: string;

      /**
       * Storage key to update.
       */
      storageKey: string;

      /**
       * Storage bucket to update.
       */
      bucketId: string;
    }

    /**
     * Parameters of the 'Storage.interestGroupAccessed' event.
     */
    export interface InterestGroupAccessedEvent {
      accessTime: Network.TimeSinceEpoch;

      type: InterestGroupAccessType;

      ownerOrigin: string;

      name: string;
    }

    /**
     * Parameters of the 'Storage.sharedStorageAccessed' event.
     */
    export interface SharedStorageAccessedEvent {
      /**
       * Time of the access.
       */
      accessTime: Network.TimeSinceEpoch;

      /**
       * Enum value indicating the Shared Storage API method invoked.
       */
      type: SharedStorageAccessType;

      /**
       * DevTools Frame Token for the primary frame tree's root.
       */
      mainFrameId: Page.FrameId;

      /**
       * Serialized origin for the context that invoked the Shared Storage API.
       */
      ownerOrigin: string;

      /**
       * The sub-parameters warapped by `params` are all optional and their
       * presence/absence depends on `type`.
       */
      params: SharedStorageAccessParams;
    }

    /**
     * Parameters of the 'Storage.storageBucketCreatedOrUpdated' event.
     */
    export interface StorageBucketCreatedOrUpdatedEvent {
      bucketInfo: StorageBucketInfo;
    }

    /**
     * Parameters of the 'Storage.storageBucketDeleted' event.
     */
    export interface StorageBucketDeletedEvent {
      bucketId: string;
    }

    /**
     * Parameters of the 'Storage.attributionReportingSourceRegistered' event.
     */
    export interface AttributionReportingSourceRegisteredEvent {
      registration: AttributionReportingSourceRegistration;

      result: AttributionReportingSourceRegistrationResult;
    }

    /**
     * Parameters of the 'Storage.attributionReportingTriggerRegistered' event.
     */
    export interface AttributionReportingTriggerRegisteredEvent {
      registration: AttributionReportingTriggerRegistration;

      eventLevel: AttributionReportingEventLevelResult;

      aggregatable: AttributionReportingAggregatableResult;
    }

    export type SerializedStorageKey = string;

    /**
     * Enum of possible storage types.
     */
    export type StorageType = 'appcache' | 'cookies' | 'file_systems' | 'indexeddb' | 'local_storage' | 'shader_cache' | 'websql' | 'service_workers' | 'cache_storage' | 'interest_groups' | 'shared_storage' | 'storage_buckets' | 'all' | 'other';

    /**
     * Usage for a storage type.
     */
    export interface UsageForType {
      /**
       * Name of storage type.
       */
      storageType: StorageType;

      /**
       * Storage usage (bytes).
       */
      usage: number;
    }

    /**
     * Pair of issuer origin and number of available (signed, but not used) Trust
     * Tokens from that issuer.
     */
    export interface TrustTokens {
      issuerOrigin: string;

      count: number;
    }

    /**
     * Enum of interest group access types.
     */
    export type InterestGroupAccessType = 'join' | 'leave' | 'update' | 'loaded' | 'bid' | 'win' | 'additionalBid' | 'additionalBidWin' | 'clear';

    /**
     * Ad advertising element inside an interest group.
     */
    export interface InterestGroupAd {
      renderURL: string;

      metadata?: string;
    }

    /**
     * The full details of an interest group.
     */
    export interface InterestGroupDetails {
      ownerOrigin: string;

      name: string;

      expirationTime: Network.TimeSinceEpoch;

      joiningOrigin: string;

      biddingLogicURL?: string;

      biddingWasmHelperURL?: string;

      updateURL?: string;

      trustedBiddingSignalsURL?: string;

      trustedBiddingSignalsKeys: string[];

      userBiddingSignals?: string;

      ads: InterestGroupAd[];

      adComponents: InterestGroupAd[];
    }

    /**
     * Enum of shared storage access types.
     */
    export type SharedStorageAccessType = 'documentAddModule' | 'documentSelectURL' | 'documentRun' | 'documentSet' | 'documentAppend' | 'documentDelete' | 'documentClear' | 'workletSet' | 'workletAppend' | 'workletDelete' | 'workletClear' | 'workletGet' | 'workletKeys' | 'workletEntries' | 'workletLength' | 'workletRemainingBudget';

    /**
     * Struct for a single key-value pair in an origin's shared storage.
     */
    export interface SharedStorageEntry {
      key: string;

      value: string;
    }

    /**
     * Details for an origin's shared storage.
     */
    export interface SharedStorageMetadata {
      creationTime: Network.TimeSinceEpoch;

      length: integer;

      remainingBudget: number;
    }

    /**
     * Pair of reporting metadata details for a candidate URL for `selectURL()`.
     */
    export interface SharedStorageReportingMetadata {
      eventType: string;

      reportingUrl: string;
    }

    /**
     * Bundles a candidate URL with its reporting metadata.
     */
    export interface SharedStorageUrlWithMetadata {
      /**
       * Spec of candidate URL.
       */
      url: string;

      /**
       * Any associated reporting metadata.
       */
      reportingMetadata: SharedStorageReportingMetadata[];
    }

    /**
     * Bundles the parameters for shared storage access events whose
     * presence/absence can vary according to SharedStorageAccessType.
     */
    export interface SharedStorageAccessParams {
      /**
       * Spec of the module script URL.
       * Present only for SharedStorageAccessType.documentAddModule.
       */
      scriptSourceUrl?: string;

      /**
       * Name of the registered operation to be run.
       * Present only for SharedStorageAccessType.documentRun and
       * SharedStorageAccessType.documentSelectURL.
       */
      operationName?: string;

      /**
       * The operation's serialized data in bytes (converted to a string).
       * Present only for SharedStorageAccessType.documentRun and
       * SharedStorageAccessType.documentSelectURL.
       */
      serializedData?: string;

      /**
       * Array of candidate URLs' specs, along with any associated metadata.
       * Present only for SharedStorageAccessType.documentSelectURL.
       */
      urlsWithMetadata?: SharedStorageUrlWithMetadata[];

      /**
       * Key for a specific entry in an origin's shared storage.
       * Present only for SharedStorageAccessType.documentSet,
       * SharedStorageAccessType.documentAppend,
       * SharedStorageAccessType.documentDelete,
       * SharedStorageAccessType.workletSet,
       * SharedStorageAccessType.workletAppend,
       * SharedStorageAccessType.workletDelete, and
       * SharedStorageAccessType.workletGet.
       */
      key?: string;

      /**
       * Value for a specific entry in an origin's shared storage.
       * Present only for SharedStorageAccessType.documentSet,
       * SharedStorageAccessType.documentAppend,
       * SharedStorageAccessType.workletSet, and
       * SharedStorageAccessType.workletAppend.
       */
      value?: string;

      /**
       * Whether or not to set an entry for a key if that key is already present.
       * Present only for SharedStorageAccessType.documentSet and
       * SharedStorageAccessType.workletSet.
       */
      ignoreIfPresent?: boolean;
    }

    export type StorageBucketsDurability = 'relaxed' | 'strict';

    export interface StorageBucket {
      storageKey: SerializedStorageKey;

      /**
       * If not specified, it is the default bucket of the storageKey.
       */
      name?: string;
    }

    export interface StorageBucketInfo {
      bucket: StorageBucket;

      id: string;

      expiration: Network.TimeSinceEpoch;

      /**
       * Storage quota (bytes).
       */
      quota: number;

      persistent: boolean;

      durability: StorageBucketsDurability;
    }

    export type AttributionReportingSourceType = 'navigation' | 'event';

    export type UnsignedInt64AsBase10 = string;

    export type UnsignedInt128AsBase16 = string;

    export type SignedInt64AsBase10 = string;

    export interface AttributionReportingFilterDataEntry {
      key: string;

      values: string[];
    }

    export interface AttributionReportingFilterConfig {
      filterValues: AttributionReportingFilterDataEntry[];

      /**
       * duration in seconds
       */
      lookbackWindow?: integer;
    }

    export interface AttributionReportingFilterPair {
      filters: AttributionReportingFilterConfig[];

      notFilters: AttributionReportingFilterConfig[];
    }

    export interface AttributionReportingAggregationKeysEntry {
      key: string;

      value: UnsignedInt128AsBase16;
    }

    export interface AttributionReportingEventReportWindows {
      /**
       * duration in seconds
       */
      start: integer;

      /**
       * duration in seconds
       */
      ends: integer[];
    }

    export interface AttributionReportingTriggerSpec {
      /**
       * number instead of integer because not all uint32 can be represented by
       * int
       */
      triggerData: number[];

      eventReportWindows: AttributionReportingEventReportWindows;
    }

    export type AttributionReportingTriggerDataMatching = 'exact' | 'modulus';

    export interface AttributionReportingSourceRegistration {
      time: Network.TimeSinceEpoch;

      /**
       * duration in seconds
       */
      expiry: integer;

      triggerSpecs: AttributionReportingTriggerSpec[];

      /**
       * duration in seconds
       */
      aggregatableReportWindow: integer;

      type: AttributionReportingSourceType;

      sourceOrigin: string;

      reportingOrigin: string;

      destinationSites: string[];

      eventId: UnsignedInt64AsBase10;

      priority: SignedInt64AsBase10;

      filterData: AttributionReportingFilterDataEntry[];

      aggregationKeys: AttributionReportingAggregationKeysEntry[];

      debugKey?: UnsignedInt64AsBase10;

      triggerDataMatching: AttributionReportingTriggerDataMatching;
    }

    export type AttributionReportingSourceRegistrationResult = 'success' | 'internalError' | 'insufficientSourceCapacity' | 'insufficientUniqueDestinationCapacity' | 'excessiveReportingOrigins' | 'prohibitedByBrowserPolicy' | 'successNoised' | 'destinationReportingLimitReached' | 'destinationGlobalLimitReached' | 'destinationBothLimitsReached' | 'reportingOriginsPerSiteLimitReached' | 'exceedsMaxChannelCapacity';

    export type AttributionReportingSourceRegistrationTimeConfig = 'include' | 'exclude';

    export interface AttributionReportingAggregatableValueEntry {
      key: string;

      /**
       * number instead of integer because not all uint32 can be represented by
       * int
       */
      value: number;
    }

    export interface AttributionReportingEventTriggerData {
      data: UnsignedInt64AsBase10;

      priority: SignedInt64AsBase10;

      dedupKey?: UnsignedInt64AsBase10;

      filters: AttributionReportingFilterPair;
    }

    export interface AttributionReportingAggregatableTriggerData {
      keyPiece: UnsignedInt128AsBase16;

      sourceKeys: string[];

      filters: AttributionReportingFilterPair;
    }

    export interface AttributionReportingAggregatableDedupKey {
      dedupKey?: UnsignedInt64AsBase10;

      filters: AttributionReportingFilterPair;
    }

    export interface AttributionReportingTriggerRegistration {
      filters: AttributionReportingFilterPair;

      debugKey?: UnsignedInt64AsBase10;

      aggregatableDedupKeys: AttributionReportingAggregatableDedupKey[];

      eventTriggerData: AttributionReportingEventTriggerData[];

      aggregatableTriggerData: AttributionReportingAggregatableTriggerData[];

      aggregatableValues: AttributionReportingAggregatableValueEntry[];

      debugReporting: boolean;

      aggregationCoordinatorOrigin?: string;

      sourceRegistrationTimeConfig: AttributionReportingSourceRegistrationTimeConfig;

      triggerContextId?: string;
    }

    export type AttributionReportingEventLevelResult = 'success' | 'successDroppedLowerPriority' | 'internalError' | 'noCapacityForAttributionDestination' | 'noMatchingSources' | 'deduplicated' | 'excessiveAttributions' | 'priorityTooLow' | 'neverAttributedSource' | 'excessiveReportingOrigins' | 'noMatchingSourceFilterData' | 'prohibitedByBrowserPolicy' | 'noMatchingConfigurations' | 'excessiveReports' | 'falselyAttributedSource' | 'reportWindowPassed' | 'notRegistered' | 'reportWindowNotStarted' | 'noMatchingTriggerData';

    export type AttributionReportingAggregatableResult = 'success' | 'internalError' | 'noCapacityForAttributionDestination' | 'noMatchingSources' | 'excessiveAttributions' | 'excessiveReportingOrigins' | 'noHistograms' | 'insufficientBudget' | 'noMatchingSourceFilterData' | 'notRegistered' | 'prohibitedByBrowserPolicy' | 'deduplicated' | 'reportWindowPassed' | 'excessiveReports';
  }

  /**
   * Methods and events of the 'SystemInfo' domain.
   */
  export interface SystemInfoApi {
    requests: {
      /**
       * Returns information about the system.
       */
      getInfo: { params: SystemInfo.GetInfoParams, result: SystemInfo.GetInfoResult }

      /**
       * Returns information about the feature state.
       */
      getFeatureState: { params: SystemInfo.GetFeatureStateParams, result: SystemInfo.GetFeatureStateResult }

      /**
       * Returns information about all running processes.
       */
      getProcessInfo: { params: SystemInfo.GetProcessInfoParams, result: SystemInfo.GetProcessInfoResult }
    };
    events: {
    };
  }

  /**
   * Types of the 'SystemInfo' domain.
   */
  export namespace SystemInfo {
    /**
     * Parameters of the 'SystemInfo.getInfo' method.
     */
    export interface GetInfoParams {
    }

    /**
     * Return value of the 'SystemInfo.getInfo' method.
     */
    export interface GetInfoResult {
      /**
       * Information about the GPUs on the system.
       */
      gpu: GPUInfo;

      /**
       * A platform-dependent description of the model of the machine. On Mac OS, this is, for
       * example, 'MacBookPro'. Will be the empty string if not supported.
       */
      modelName: string;

      /**
       * A platform-dependent description of the version of the machine. On Mac OS, this is, for
       * example, '10.1'. Will be the empty string if not supported.
       */
      modelVersion: string;

      /**
       * The command line string used to launch the browser. Will be the empty string if not
       * supported.
       */
      commandLine: string;
    }

    /**
     * Parameters of the 'SystemInfo.getFeatureState' method.
     */
    export interface GetFeatureStateParams {
      featureState: string;
    }

    /**
     * Return value of the 'SystemInfo.getFeatureState' method.
     */
    export interface GetFeatureStateResult {
      featureEnabled: boolean;
    }

    /**
     * Parameters of the 'SystemInfo.getProcessInfo' method.
     */
    export interface GetProcessInfoParams {
    }

    /**
     * Return value of the 'SystemInfo.getProcessInfo' method.
     */
    export interface GetProcessInfoResult {
      /**
       * An array of process info blocks.
       */
      processInfo: ProcessInfo[];
    }

    /**
     * Describes a single graphics processor (GPU).
     */
    export interface GPUDevice {
      /**
       * PCI ID of the GPU vendor, if available; 0 otherwise.
       */
      vendorId: number;

      /**
       * PCI ID of the GPU device, if available; 0 otherwise.
       */
      deviceId: number;

      /**
       * Sub sys ID of the GPU, only available on Windows.
       */
      subSysId?: number;

      /**
       * Revision of the GPU, only available on Windows.
       */
      revision?: number;

      /**
       * String description of the GPU vendor, if the PCI ID is not available.
       */
      vendorString: string;

      /**
       * String description of the GPU device, if the PCI ID is not available.
       */
      deviceString: string;

      /**
       * String description of the GPU driver vendor.
       */
      driverVendor: string;

      /**
       * String description of the GPU driver version.
       */
      driverVersion: string;
    }

    /**
     * Describes the width and height dimensions of an entity.
     */
    export interface Size {
      /**
       * Width in pixels.
       */
      width: integer;

      /**
       * Height in pixels.
       */
      height: integer;
    }

    /**
     * Describes a supported video decoding profile with its associated minimum and
     * maximum resolutions.
     */
    export interface VideoDecodeAcceleratorCapability {
      /**
       * Video codec profile that is supported, e.g. VP9 Profile 2.
       */
      profile: string;

      /**
       * Maximum video dimensions in pixels supported for this |profile|.
       */
      maxResolution: Size;

      /**
       * Minimum video dimensions in pixels supported for this |profile|.
       */
      minResolution: Size;
    }

    /**
     * Describes a supported video encoding profile with its associated maximum
     * resolution and maximum framerate.
     */
    export interface VideoEncodeAcceleratorCapability {
      /**
       * Video codec profile that is supported, e.g H264 Main.
       */
      profile: string;

      /**
       * Maximum video dimensions in pixels supported for this |profile|.
       */
      maxResolution: Size;

      /**
       * Maximum encoding framerate in frames per second supported for this
       * |profile|, as fraction's numerator and denominator, e.g. 24/1 fps,
       * 24000/1001 fps, etc.
       */
      maxFramerateNumerator: integer;

      maxFramerateDenominator: integer;
    }

    /**
     * YUV subsampling type of the pixels of a given image.
     */
    export type SubsamplingFormat = 'yuv420' | 'yuv422' | 'yuv444';

    /**
     * Image format of a given image.
     */
    export type ImageType = 'jpeg' | 'webp' | 'unknown';

    /**
     * Describes a supported image decoding profile with its associated minimum and
     * maximum resolutions and subsampling.
     */
    export interface ImageDecodeAcceleratorCapability {
      /**
       * Image coded, e.g. Jpeg.
       */
      imageType: ImageType;

      /**
       * Maximum supported dimensions of the image in pixels.
       */
      maxDimensions: Size;

      /**
       * Minimum supported dimensions of the image in pixels.
       */
      minDimensions: Size;

      /**
       * Optional array of supported subsampling formats, e.g. 4:2:0, if known.
       */
      subsamplings: SubsamplingFormat[];
    }

    /**
     * Provides information about the GPU(s) on the system.
     */
    export interface GPUInfo {
      /**
       * The graphics devices on the system. Element 0 is the primary GPU.
       */
      devices: GPUDevice[];

      /**
       * An optional dictionary of additional GPU related attributes.
       */
      auxAttributes?: Record<string, unknown>;

      /**
       * An optional dictionary of graphics features and their status.
       */
      featureStatus?: Record<string, unknown>;

      /**
       * An optional array of GPU driver bug workarounds.
       */
      driverBugWorkarounds: string[];

      /**
       * Supported accelerated video decoding capabilities.
       */
      videoDecoding: VideoDecodeAcceleratorCapability[];

      /**
       * Supported accelerated video encoding capabilities.
       */
      videoEncoding: VideoEncodeAcceleratorCapability[];

      /**
       * Supported accelerated image decoding capabilities.
       */
      imageDecoding: ImageDecodeAcceleratorCapability[];
    }

    /**
     * Represents process info.
     */
    export interface ProcessInfo {
      /**
       * Specifies process type.
       */
      type: string;

      /**
       * Specifies process id.
       */
      id: integer;

      /**
       * Specifies cumulative CPU usage in seconds across all threads of the
       * process since the process start.
       */
      cpuTime: number;
    }
  }

  /**
   * Methods and events of the 'Target' domain.
   */
  export interface TargetApi {
    requests: {
      /**
       * Activates (focuses) the target.
       */
      activateTarget: { params: Target.ActivateTargetParams, result: Target.ActivateTargetResult }

      /**
       * Attaches to the target with given id.
       */
      attachToTarget: { params: Target.AttachToTargetParams, result: Target.AttachToTargetResult }

      /**
       * Attaches to the browser target, only uses flat sessionId mode.
       */
      attachToBrowserTarget: { params: Target.AttachToBrowserTargetParams, result: Target.AttachToBrowserTargetResult }

      /**
       * Closes the target. If the target is a page that gets closed too.
       */
      closeTarget: { params: Target.CloseTargetParams, result: Target.CloseTargetResult }

      /**
       * Inject object to the target's main frame that provides a communication
       * channel with browser target.
       * 
       * Injected object will be available as `window[bindingName]`.
       * 
       * The object has the follwing API:
       * - `binding.send(json)` - a method to send messages over the remote debugging protocol
       * - `binding.onmessage = json => handleMessage(json)` - a callback that will be called for the protocol notifications and command responses.
       */
      exposeDevToolsProtocol: { params: Target.ExposeDevToolsProtocolParams, result: Target.ExposeDevToolsProtocolResult }

      /**
       * Creates a new empty BrowserContext. Similar to an incognito profile but you can have more than
       * one.
       */
      createBrowserContext: { params: Target.CreateBrowserContextParams, result: Target.CreateBrowserContextResult }

      /**
       * Returns all browser contexts created with `Target.createBrowserContext` method.
       */
      getBrowserContexts: { params: Target.GetBrowserContextsParams, result: Target.GetBrowserContextsResult }

      /**
       * Creates a new page.
       */
      createTarget: { params: Target.CreateTargetParams, result: Target.CreateTargetResult }

      /**
       * Detaches session with given id.
       */
      detachFromTarget: { params: Target.DetachFromTargetParams, result: Target.DetachFromTargetResult }

      /**
       * Deletes a BrowserContext. All the belonging pages will be closed without calling their
       * beforeunload hooks.
       */
      disposeBrowserContext: { params: Target.DisposeBrowserContextParams, result: Target.DisposeBrowserContextResult }

      /**
       * Returns information about a target.
       */
      getTargetInfo: { params: Target.GetTargetInfoParams, result: Target.GetTargetInfoResult }

      /**
       * Retrieves a list of available targets.
       */
      getTargets: { params: Target.GetTargetsParams, result: Target.GetTargetsResult }

      /**
       * Sends protocol message over session with given id.
       * Consider using flat mode instead; see commands attachToTarget, setAutoAttach,
       * and crbug.com/991325.
       * @deprecated
       */
      sendMessageToTarget: { params: Target.SendMessageToTargetParams, result: Target.SendMessageToTargetResult }

      /**
       * Controls whether to automatically attach to new targets which are considered to be related to
       * this one. When turned on, attaches to all existing related targets as well. When turned off,
       * automatically detaches from all currently attached targets.
       * This also clears all targets added by `autoAttachRelated` from the list of targets to watch
       * for creation of related targets.
       */
      setAutoAttach: { params: Target.SetAutoAttachParams, result: Target.SetAutoAttachResult }

      /**
       * Adds the specified target to the list of targets that will be monitored for any related target
       * creation (such as child frames, child workers and new versions of service worker) and reported
       * through `attachedToTarget`. The specified target is also auto-attached.
       * This cancels the effect of any previous `setAutoAttach` and is also cancelled by subsequent
       * `setAutoAttach`. Only available at the Browser target.
       */
      autoAttachRelated: { params: Target.AutoAttachRelatedParams, result: Target.AutoAttachRelatedResult }

      /**
       * Controls whether to discover available targets and notify via
       * `targetCreated/targetInfoChanged/targetDestroyed` events.
       */
      setDiscoverTargets: { params: Target.SetDiscoverTargetsParams, result: Target.SetDiscoverTargetsResult }

      /**
       * Enables target discovery for the specified locations, when `setDiscoverTargets` was set to
       * `true`.
       */
      setRemoteLocations: { params: Target.SetRemoteLocationsParams, result: Target.SetRemoteLocationsResult }
    };
    events: {

      /**
       * Issued when attached to target because of auto-attach or `attachToTarget` command.
       */
      attachedToTarget: { params: Target.AttachedToTargetEvent };

      /**
       * Issued when detached from target for any reason (including `detachFromTarget` command). Can be
       * issued multiple times per target if multiple sessions have been attached to it.
       */
      detachedFromTarget: { params: Target.DetachedFromTargetEvent };

      /**
       * Notifies about a new protocol message received from the session (as reported in
       * `attachedToTarget` event).
       */
      receivedMessageFromTarget: { params: Target.ReceivedMessageFromTargetEvent };

      /**
       * Issued when a possible inspection target is created.
       */
      targetCreated: { params: Target.TargetCreatedEvent };

      /**
       * Issued when a target is destroyed.
       */
      targetDestroyed: { params: Target.TargetDestroyedEvent };

      /**
       * Issued when a target has crashed.
       */
      targetCrashed: { params: Target.TargetCrashedEvent };

      /**
       * Issued when some information about a target has changed. This only happens between
       * `targetCreated` and `targetDestroyed`.
       */
      targetInfoChanged: { params: Target.TargetInfoChangedEvent };
    };
  }

  /**
   * Types of the 'Target' domain.
   */
  export namespace Target {
    /**
     * Parameters of the 'Target.activateTarget' method.
     */
    export interface ActivateTargetParams {
      targetId: TargetID;
    }

    /**
     * Return value of the 'Target.activateTarget' method.
     */
    export interface ActivateTargetResult {
    }

    /**
     * Parameters of the 'Target.attachToTarget' method.
     */
    export interface AttachToTargetParams {
      targetId: TargetID;

      /**
       * Enables "flat" access to the session via specifying sessionId attribute in the commands.
       * We plan to make this the default, deprecate non-flattened mode,
       * and eventually retire it. See crbug.com/991325.
       */
      flatten?: boolean;
    }

    /**
     * Return value of the 'Target.attachToTarget' method.
     */
    export interface AttachToTargetResult {
      /**
       * Id assigned to the session.
       */
      sessionId: SessionID;
    }

    /**
     * Parameters of the 'Target.attachToBrowserTarget' method.
     */
    export interface AttachToBrowserTargetParams {
    }

    /**
     * Return value of the 'Target.attachToBrowserTarget' method.
     */
    export interface AttachToBrowserTargetResult {
      /**
       * Id assigned to the session.
       */
      sessionId: SessionID;
    }

    /**
     * Parameters of the 'Target.closeTarget' method.
     */
    export interface CloseTargetParams {
      targetId: TargetID;
    }

    /**
     * Return value of the 'Target.closeTarget' method.
     */
    export interface CloseTargetResult {
      /**
       * Always set to true. If an error occurs, the response indicates protocol error.
       * @deprecated
       */
      success: boolean;
    }

    /**
     * Parameters of the 'Target.exposeDevToolsProtocol' method.
     */
    export interface ExposeDevToolsProtocolParams {
      targetId: TargetID;

      /**
       * Binding name, 'cdp' if not specified.
       */
      bindingName?: string;
    }

    /**
     * Return value of the 'Target.exposeDevToolsProtocol' method.
     */
    export interface ExposeDevToolsProtocolResult {
    }

    /**
     * Parameters of the 'Target.createBrowserContext' method.
     */
    export interface CreateBrowserContextParams {
      /**
       * If specified, disposes this context when debugging session disconnects.
       */
      disposeOnDetach?: boolean;

      /**
       * Proxy server, similar to the one passed to --proxy-server
       */
      proxyServer?: string;

      /**
       * Proxy bypass list, similar to the one passed to --proxy-bypass-list
       */
      proxyBypassList?: string;

      /**
       * An optional list of origins to grant unlimited cross-origin access to.
       * Parts of the URL other than those constituting origin are ignored.
       */
      originsWithUniversalNetworkAccess?: string[];
    }

    /**
     * Return value of the 'Target.createBrowserContext' method.
     */
    export interface CreateBrowserContextResult {
      /**
       * The id of the context created.
       */
      browserContextId: Browser.BrowserContextID;
    }

    /**
     * Parameters of the 'Target.getBrowserContexts' method.
     */
    export interface GetBrowserContextsParams {
    }

    /**
     * Return value of the 'Target.getBrowserContexts' method.
     */
    export interface GetBrowserContextsResult {
      /**
       * An array of browser context ids.
       */
      browserContextIds: Browser.BrowserContextID[];
    }

    /**
     * Parameters of the 'Target.createTarget' method.
     */
    export interface CreateTargetParams {
      /**
       * The initial URL the page will be navigated to. An empty string indicates about:blank.
       */
      url: string;

      /**
       * Frame width in DIP (headless chrome only).
       */
      width?: integer;

      /**
       * Frame height in DIP (headless chrome only).
       */
      height?: integer;

      /**
       * The browser context to create the page in.
       */
      browserContextId?: Browser.BrowserContextID;

      /**
       * Whether BeginFrames for this target will be controlled via DevTools (headless chrome only,
       * not supported on MacOS yet, false by default).
       */
      enableBeginFrameControl?: boolean;

      /**
       * Whether to create a new Window or Tab (chrome-only, false by default).
       */
      newWindow?: boolean;

      /**
       * Whether to create the target in background or foreground (chrome-only,
       * false by default).
       */
      background?: boolean;

      /**
       * Whether to create the target of type "tab".
       */
      forTab?: boolean;
    }

    /**
     * Return value of the 'Target.createTarget' method.
     */
    export interface CreateTargetResult {
      /**
       * The id of the page opened.
       */
      targetId: TargetID;
    }

    /**
     * Parameters of the 'Target.detachFromTarget' method.
     */
    export interface DetachFromTargetParams {
      /**
       * Session to detach.
       */
      sessionId?: SessionID;

      /**
       * Deprecated.
       * @deprecated
       */
      targetId?: TargetID;
    }

    /**
     * Return value of the 'Target.detachFromTarget' method.
     */
    export interface DetachFromTargetResult {
    }

    /**
     * Parameters of the 'Target.disposeBrowserContext' method.
     */
    export interface DisposeBrowserContextParams {
      browserContextId: Browser.BrowserContextID;
    }

    /**
     * Return value of the 'Target.disposeBrowserContext' method.
     */
    export interface DisposeBrowserContextResult {
    }

    /**
     * Parameters of the 'Target.getTargetInfo' method.
     */
    export interface GetTargetInfoParams {
      targetId?: TargetID;
    }

    /**
     * Return value of the 'Target.getTargetInfo' method.
     */
    export interface GetTargetInfoResult {
      targetInfo: TargetInfo;
    }

    /**
     * Parameters of the 'Target.getTargets' method.
     */
    export interface GetTargetsParams {
      /**
       * Only targets matching filter will be reported. If filter is not specified
       * and target discovery is currently enabled, a filter used for target discovery
       * is used for consistency.
       */
      filter?: TargetFilter;
    }

    /**
     * Return value of the 'Target.getTargets' method.
     */
    export interface GetTargetsResult {
      /**
       * The list of targets.
       */
      targetInfos: TargetInfo[];
    }

    /**
     * Parameters of the 'Target.sendMessageToTarget' method.
     */
    export interface SendMessageToTargetParams {
      message: string;

      /**
       * Identifier of the session.
       */
      sessionId?: SessionID;

      /**
       * Deprecated.
       * @deprecated
       */
      targetId?: TargetID;
    }

    /**
     * Return value of the 'Target.sendMessageToTarget' method.
     */
    export interface SendMessageToTargetResult {
    }

    /**
     * Parameters of the 'Target.setAutoAttach' method.
     */
    export interface SetAutoAttachParams {
      /**
       * Whether to auto-attach to related targets.
       */
      autoAttach: boolean;

      /**
       * Whether to pause new targets when attaching to them. Use `Runtime.runIfWaitingForDebugger`
       * to run paused targets.
       */
      waitForDebuggerOnStart: boolean;

      /**
       * Enables "flat" access to the session via specifying sessionId attribute in the commands.
       * We plan to make this the default, deprecate non-flattened mode,
       * and eventually retire it. See crbug.com/991325.
       */
      flatten?: boolean;

      /**
       * Only targets matching filter will be attached.
       */
      filter?: TargetFilter;
    }

    /**
     * Return value of the 'Target.setAutoAttach' method.
     */
    export interface SetAutoAttachResult {
    }

    /**
     * Parameters of the 'Target.autoAttachRelated' method.
     */
    export interface AutoAttachRelatedParams {
      targetId: TargetID;

      /**
       * Whether to pause new targets when attaching to them. Use `Runtime.runIfWaitingForDebugger`
       * to run paused targets.
       */
      waitForDebuggerOnStart: boolean;

      /**
       * Only targets matching filter will be attached.
       */
      filter?: TargetFilter;
    }

    /**
     * Return value of the 'Target.autoAttachRelated' method.
     */
    export interface AutoAttachRelatedResult {
    }

    /**
     * Parameters of the 'Target.setDiscoverTargets' method.
     */
    export interface SetDiscoverTargetsParams {
      /**
       * Whether to discover available targets.
       */
      discover: boolean;

      /**
       * Only targets matching filter will be attached. If `discover` is false,
       * `filter` must be omitted or empty.
       */
      filter?: TargetFilter;
    }

    /**
     * Return value of the 'Target.setDiscoverTargets' method.
     */
    export interface SetDiscoverTargetsResult {
    }

    /**
     * Parameters of the 'Target.setRemoteLocations' method.
     */
    export interface SetRemoteLocationsParams {
      /**
       * List of remote locations.
       */
      locations: RemoteLocation[];
    }

    /**
     * Return value of the 'Target.setRemoteLocations' method.
     */
    export interface SetRemoteLocationsResult {
    }

    /**
     * Parameters of the 'Target.attachedToTarget' event.
     */
    export interface AttachedToTargetEvent {
      /**
       * Identifier assigned to the session used to send/receive messages.
       */
      sessionId: SessionID;

      targetInfo: TargetInfo;

      waitingForDebugger: boolean;
    }

    /**
     * Parameters of the 'Target.detachedFromTarget' event.
     */
    export interface DetachedFromTargetEvent {
      /**
       * Detached session identifier.
       */
      sessionId: SessionID;

      /**
       * Deprecated.
       * @deprecated
       */
      targetId?: TargetID;
    }

    /**
     * Parameters of the 'Target.receivedMessageFromTarget' event.
     */
    export interface ReceivedMessageFromTargetEvent {
      /**
       * Identifier of a session which sends a message.
       */
      sessionId: SessionID;

      message: string;

      /**
       * Deprecated.
       * @deprecated
       */
      targetId?: TargetID;
    }

    /**
     * Parameters of the 'Target.targetCreated' event.
     */
    export interface TargetCreatedEvent {
      targetInfo: TargetInfo;
    }

    /**
     * Parameters of the 'Target.targetDestroyed' event.
     */
    export interface TargetDestroyedEvent {
      targetId: TargetID;
    }

    /**
     * Parameters of the 'Target.targetCrashed' event.
     */
    export interface TargetCrashedEvent {
      targetId: TargetID;

      /**
       * Termination status type.
       */
      status: string;

      /**
       * Termination error code.
       */
      errorCode: integer;
    }

    /**
     * Parameters of the 'Target.targetInfoChanged' event.
     */
    export interface TargetInfoChangedEvent {
      targetInfo: TargetInfo;
    }

    export type TargetID = string;

    /**
     * Unique identifier of attached debugging session.
     */
    export type SessionID = string;

    export interface TargetInfo {
      targetId: TargetID;

      type: string;

      title: string;

      url: string;

      /**
       * Whether the target has an attached client.
       */
      attached: boolean;

      /**
       * Opener target Id
       */
      openerId?: TargetID;

      /**
       * Whether the target has access to the originating window.
       */
      canAccessOpener: boolean;

      /**
       * Frame id of originating window (is only set if target has an opener).
       */
      openerFrameId?: Page.FrameId;

      browserContextId?: Browser.BrowserContextID;

      /**
       * Provides additional details for specific target types. For example, for
       * the type of "page", this may be set to "portal" or "prerender".
       */
      subtype?: string;
    }

    /**
     * A filter used by target query/discovery/auto-attach operations.
     */
    export interface FilterEntry {
      /**
       * If set, causes exclusion of mathcing targets from the list.
       */
      exclude?: boolean;

      /**
       * If not present, matches any type.
       */
      type?: string;
    }

    /**
     * The entries in TargetFilter are matched sequentially against targets and
     * the first entry that matches determines if the target is included or not,
     * depending on the value of `exclude` field in the entry.
     * If filter is not specified, the one assumed is
     * [{type: "browser", exclude: true}, {type: "tab", exclude: true}, {}]
     * (i.e. include everything but `browser` and `tab`).
     */
    export type TargetFilter = FilterEntry[];

    export interface RemoteLocation {
      host: string;

      port: integer;
    }
  }

  /**
   * Methods and events of the 'Tethering' domain.
   */
  export interface TetheringApi {
    requests: {
      /**
       * Request browser port binding.
       */
      bind: { params: Tethering.BindParams, result: Tethering.BindResult }

      /**
       * Request browser port unbinding.
       */
      unbind: { params: Tethering.UnbindParams, result: Tethering.UnbindResult }
    };
    events: {

      /**
       * Informs that port was successfully bound and got a specified connection id.
       */
      accepted: { params: Tethering.AcceptedEvent };
    };
  }

  /**
   * Types of the 'Tethering' domain.
   */
  export namespace Tethering {
    /**
     * Parameters of the 'Tethering.bind' method.
     */
    export interface BindParams {
      /**
       * Port number to bind.
       */
      port: integer;
    }

    /**
     * Return value of the 'Tethering.bind' method.
     */
    export interface BindResult {
    }

    /**
     * Parameters of the 'Tethering.unbind' method.
     */
    export interface UnbindParams {
      /**
       * Port number to unbind.
       */
      port: integer;
    }

    /**
     * Return value of the 'Tethering.unbind' method.
     */
    export interface UnbindResult {
    }

    /**
     * Parameters of the 'Tethering.accepted' event.
     */
    export interface AcceptedEvent {
      /**
       * Port number that was successfully bound.
       */
      port: integer;

      /**
       * Connection id to be used.
       */
      connectionId: string;
    }
  }

  /**
   * Methods and events of the 'Tracing' domain.
   */
  export interface TracingApi {
    requests: {
      /**
       * Stop trace events collection.
       */
      end: { params: Tracing.EndParams, result: Tracing.EndResult }

      /**
       * Gets supported tracing categories.
       */
      getCategories: { params: Tracing.GetCategoriesParams, result: Tracing.GetCategoriesResult }

      /**
       * Record a clock sync marker in the trace.
       */
      recordClockSyncMarker: { params: Tracing.RecordClockSyncMarkerParams, result: Tracing.RecordClockSyncMarkerResult }

      /**
       * Request a global memory dump.
       */
      requestMemoryDump: { params: Tracing.RequestMemoryDumpParams, result: Tracing.RequestMemoryDumpResult }

      /**
       * Start trace events collection.
       */
      start: { params: Tracing.StartParams, result: Tracing.StartResult }
    };
    events: {

      bufferUsage: { params: Tracing.BufferUsageEvent };

      /**
       * Contains a bucket of collected trace events. When tracing is stopped collected events will be
       * sent as a sequence of dataCollected events followed by tracingComplete event.
       */
      dataCollected: { params: Tracing.DataCollectedEvent };

      /**
       * Signals that tracing is stopped and there is no trace buffers pending flush, all data were
       * delivered via dataCollected events.
       */
      tracingComplete: { params: Tracing.TracingCompleteEvent };
    };
  }

  /**
   * Types of the 'Tracing' domain.
   */
  export namespace Tracing {
    /**
     * Parameters of the 'Tracing.end' method.
     */
    export interface EndParams {
    }

    /**
     * Return value of the 'Tracing.end' method.
     */
    export interface EndResult {
    }

    /**
     * Parameters of the 'Tracing.getCategories' method.
     */
    export interface GetCategoriesParams {
    }

    /**
     * Return value of the 'Tracing.getCategories' method.
     */
    export interface GetCategoriesResult {
      /**
       * A list of supported tracing categories.
       */
      categories: string[];
    }

    /**
     * Parameters of the 'Tracing.recordClockSyncMarker' method.
     */
    export interface RecordClockSyncMarkerParams {
      /**
       * The ID of this clock sync marker
       */
      syncId: string;
    }

    /**
     * Return value of the 'Tracing.recordClockSyncMarker' method.
     */
    export interface RecordClockSyncMarkerResult {
    }

    /**
     * Parameters of the 'Tracing.requestMemoryDump' method.
     */
    export interface RequestMemoryDumpParams {
      /**
       * Enables more deterministic results by forcing garbage collection
       */
      deterministic?: boolean;

      /**
       * Specifies level of details in memory dump. Defaults to "detailed".
       */
      levelOfDetail?: MemoryDumpLevelOfDetail;
    }

    /**
     * Return value of the 'Tracing.requestMemoryDump' method.
     */
    export interface RequestMemoryDumpResult {
      /**
       * GUID of the resulting global memory dump.
       */
      dumpGuid: string;

      /**
       * True iff the global memory dump succeeded.
       */
      success: boolean;
    }

    /**
     * Parameters of the 'Tracing.start' method.
     */
    export interface StartParams {
      /**
       * Category/tag filter
       * @deprecated
       */
      categories?: string;

      /**
       * Tracing options
       * @deprecated
       */
      options?: string;

      /**
       * If set, the agent will issue bufferUsage events at this interval, specified in milliseconds
       */
      bufferUsageReportingInterval?: number;

      /**
       * Whether to report trace events as series of dataCollected events or to save trace to a
       * stream (defaults to `ReportEvents`).
       */
      transferMode?: 'ReportEvents' | 'ReturnAsStream';

      /**
       * Trace data format to use. This only applies when using `ReturnAsStream`
       * transfer mode (defaults to `json`).
       */
      streamFormat?: StreamFormat;

      /**
       * Compression format to use. This only applies when using `ReturnAsStream`
       * transfer mode (defaults to `none`)
       */
      streamCompression?: StreamCompression;

      traceConfig?: TraceConfig;

      /**
       * Base64-encoded serialized perfetto.protos.TraceConfig protobuf message
       * When specified, the parameters `categories`, `options`, `traceConfig`
       * are ignored. (Encoded as a base64 string when passed over JSON)
       */
      perfettoConfig?: string;

      /**
       * Backend type (defaults to `auto`)
       */
      tracingBackend?: TracingBackend;
    }

    /**
     * Return value of the 'Tracing.start' method.
     */
    export interface StartResult {
    }

    /**
     * Parameters of the 'Tracing.bufferUsage' event.
     */
    export interface BufferUsageEvent {
      /**
       * A number in range [0..1] that indicates the used size of event buffer as a fraction of its
       * total size.
       */
      percentFull?: number;

      /**
       * An approximate number of events in the trace log.
       */
      eventCount?: number;

      /**
       * A number in range [0..1] that indicates the used size of event buffer as a fraction of its
       * total size.
       */
      value?: number;
    }

    /**
     * Parameters of the 'Tracing.dataCollected' event.
     */
    export interface DataCollectedEvent {
      value: Record<string, unknown>[];
    }

    /**
     * Parameters of the 'Tracing.tracingComplete' event.
     */
    export interface TracingCompleteEvent {
      /**
       * Indicates whether some trace data is known to have been lost, e.g. because the trace ring
       * buffer wrapped around.
       */
      dataLossOccurred: boolean;

      /**
       * A handle of the stream that holds resulting trace data.
       */
      stream?: IO.StreamHandle;

      /**
       * Trace data format of returned stream.
       */
      traceFormat?: StreamFormat;

      /**
       * Compression format of returned stream.
       */
      streamCompression?: StreamCompression;
    }

    /**
     * Configuration for memory dump. Used only when "memory-infra" category is enabled.
     */
    export interface MemoryDumpConfig {
      [key: string]: any;
    }

    export interface TraceConfig {
      /**
       * Controls how the trace buffer stores data.
       */
      recordMode?: 'recordUntilFull' | 'recordContinuously' | 'recordAsMuchAsPossible' | 'echoToConsole';

      /**
       * Size of the trace buffer in kilobytes. If not specified or zero is passed, a default value
       * of 200 MB would be used.
       */
      traceBufferSizeInKb?: number;

      /**
       * Turns on JavaScript stack sampling.
       */
      enableSampling?: boolean;

      /**
       * Turns on system tracing.
       */
      enableSystrace?: boolean;

      /**
       * Turns on argument filter.
       */
      enableArgumentFilter?: boolean;

      /**
       * Included category filters.
       */
      includedCategories?: string[];

      /**
       * Excluded category filters.
       */
      excludedCategories?: string[];

      /**
       * Configuration to synthesize the delays in tracing.
       */
      syntheticDelays?: string[];

      /**
       * Configuration for memory dump triggers. Used only when "memory-infra" category is enabled.
       */
      memoryDumpConfig?: MemoryDumpConfig;
    }

    /**
     * Data format of a trace. Can be either the legacy JSON format or the
     * protocol buffer format. Note that the JSON format will be deprecated soon.
     */
    export type StreamFormat = 'json' | 'proto';

    /**
     * Compression type to use for traces returned via streams.
     */
    export type StreamCompression = 'none' | 'gzip';

    /**
     * Details exposed when memory request explicitly declared.
     * Keep consistent with memory_dump_request_args.h and
     * memory_instrumentation.mojom
     */
    export type MemoryDumpLevelOfDetail = 'background' | 'light' | 'detailed';

    /**
     * Backend type to use for tracing. `chrome` uses the Chrome-integrated
     * tracing service and is supported on all platforms. `system` is only
     * supported on Chrome OS and uses the Perfetto system tracing service.
     * `auto` chooses `system` when the perfettoConfig provided to Tracing.start
     * specifies at least one non-Chrome data source; otherwise uses `chrome`.
     */
    export type TracingBackend = 'auto' | 'chrome' | 'system';
  }

  /**
   * Methods and events of the 'Fetch' domain.
   */
  export interface FetchApi {
    requests: {
      /**
       * Disables the fetch domain.
       */
      disable: { params: Fetch.DisableParams, result: Fetch.DisableResult }

      /**
       * Enables issuing of requestPaused events. A request will be paused until client
       * calls one of failRequest, fulfillRequest or continueRequest/continueWithAuth.
       */
      enable: { params: Fetch.EnableParams, result: Fetch.EnableResult }

      /**
       * Causes the request to fail with specified reason.
       */
      failRequest: { params: Fetch.FailRequestParams, result: Fetch.FailRequestResult }

      /**
       * Provides response to the request.
       */
      fulfillRequest: { params: Fetch.FulfillRequestParams, result: Fetch.FulfillRequestResult }

      /**
       * Continues the request, optionally modifying some of its parameters.
       */
      continueRequest: { params: Fetch.ContinueRequestParams, result: Fetch.ContinueRequestResult }

      /**
       * Continues a request supplying authChallengeResponse following authRequired event.
       */
      continueWithAuth: { params: Fetch.ContinueWithAuthParams, result: Fetch.ContinueWithAuthResult }

      /**
       * Continues loading of the paused response, optionally modifying the
       * response headers. If either responseCode or headers are modified, all of them
       * must be present.
       */
      continueResponse: { params: Fetch.ContinueResponseParams, result: Fetch.ContinueResponseResult }

      /**
       * Causes the body of the response to be received from the server and
       * returned as a single string. May only be issued for a request that
       * is paused in the Response stage and is mutually exclusive with
       * takeResponseBodyForInterceptionAsStream. Calling other methods that
       * affect the request or disabling fetch domain before body is received
       * results in an undefined behavior.
       * Note that the response body is not available for redirects. Requests
       * paused in the _redirect received_ state may be differentiated by
       * `responseCode` and presence of `location` response header, see
       * comments to `requestPaused` for details.
       */
      getResponseBody: { params: Fetch.GetResponseBodyParams, result: Fetch.GetResponseBodyResult }

      /**
       * Returns a handle to the stream representing the response body.
       * The request must be paused in the HeadersReceived stage.
       * Note that after this command the request can't be continued
       * as is -- client either needs to cancel it or to provide the
       * response body.
       * The stream only supports sequential read, IO.read will fail if the position
       * is specified.
       * This method is mutually exclusive with getResponseBody.
       * Calling other methods that affect the request or disabling fetch
       * domain before body is received results in an undefined behavior.
       */
      takeResponseBodyAsStream: { params: Fetch.TakeResponseBodyAsStreamParams, result: Fetch.TakeResponseBodyAsStreamResult }
    };
    events: {

      /**
       * Issued when the domain is enabled and the request URL matches the
       * specified filter. The request is paused until the client responds
       * with one of continueRequest, failRequest or fulfillRequest.
       * The stage of the request can be determined by presence of responseErrorReason
       * and responseStatusCode -- the request is at the response stage if either
       * of these fields is present and in the request stage otherwise.
       * Redirect responses and subsequent requests are reported similarly to regular
       * responses and requests. Redirect responses may be distinguished by the value
       * of `responseStatusCode` (which is one of 301, 302, 303, 307, 308) along with
       * presence of the `location` header. Requests resulting from a redirect will
       * have `redirectedRequestId` field set.
       */
      requestPaused: { params: Fetch.RequestPausedEvent };

      /**
       * Issued when the domain is enabled with handleAuthRequests set to true.
       * The request is paused until client responds with continueWithAuth.
       */
      authRequired: { params: Fetch.AuthRequiredEvent };
    };
  }

  /**
   * Types of the 'Fetch' domain.
   */
  export namespace Fetch {
    /**
     * Parameters of the 'Fetch.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'Fetch.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'Fetch.enable' method.
     */
    export interface EnableParams {
      /**
       * If specified, only requests matching any of these patterns will produce
       * fetchRequested event and will be paused until clients response. If not set,
       * all requests will be affected.
       */
      patterns?: RequestPattern[];

      /**
       * If true, authRequired events will be issued and requests will be paused
       * expecting a call to continueWithAuth.
       */
      handleAuthRequests?: boolean;
    }

    /**
     * Return value of the 'Fetch.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'Fetch.failRequest' method.
     */
    export interface FailRequestParams {
      /**
       * An id the client received in requestPaused event.
       */
      requestId: RequestId;

      /**
       * Causes the request to fail with the given reason.
       */
      errorReason: Network.ErrorReason;
    }

    /**
     * Return value of the 'Fetch.failRequest' method.
     */
    export interface FailRequestResult {
    }

    /**
     * Parameters of the 'Fetch.fulfillRequest' method.
     */
    export interface FulfillRequestParams {
      /**
       * An id the client received in requestPaused event.
       */
      requestId: RequestId;

      /**
       * An HTTP response code.
       */
      responseCode: integer;

      /**
       * Response headers.
       */
      responseHeaders?: HeaderEntry[];

      /**
       * Alternative way of specifying response headers as a \0-separated
       * series of name: value pairs. Prefer the above method unless you
       * need to represent some non-UTF8 values that can't be transmitted
       * over the protocol as text. (Encoded as a base64 string when passed over JSON)
       */
      binaryResponseHeaders?: string;

      /**
       * A response body. If absent, original response body will be used if
       * the request is intercepted at the response stage and empty body
       * will be used if the request is intercepted at the request stage. (Encoded as a base64 string when passed over JSON)
       */
      body?: string;

      /**
       * A textual representation of responseCode.
       * If absent, a standard phrase matching responseCode is used.
       */
      responsePhrase?: string;
    }

    /**
     * Return value of the 'Fetch.fulfillRequest' method.
     */
    export interface FulfillRequestResult {
    }

    /**
     * Parameters of the 'Fetch.continueRequest' method.
     */
    export interface ContinueRequestParams {
      /**
       * An id the client received in requestPaused event.
       */
      requestId: RequestId;

      /**
       * If set, the request url will be modified in a way that's not observable by page.
       */
      url?: string;

      /**
       * If set, the request method is overridden.
       */
      method?: string;

      /**
       * If set, overrides the post data in the request. (Encoded as a base64 string when passed over JSON)
       */
      postData?: string;

      /**
       * If set, overrides the request headers. Note that the overrides do not
       * extend to subsequent redirect hops, if a redirect happens. Another override
       * may be applied to a different request produced by a redirect.
       */
      headers?: HeaderEntry[];

      /**
       * If set, overrides response interception behavior for this request.
       */
      interceptResponse?: boolean;
    }

    /**
     * Return value of the 'Fetch.continueRequest' method.
     */
    export interface ContinueRequestResult {
    }

    /**
     * Parameters of the 'Fetch.continueWithAuth' method.
     */
    export interface ContinueWithAuthParams {
      /**
       * An id the client received in authRequired event.
       */
      requestId: RequestId;

      /**
       * Response to  with an authChallenge.
       */
      authChallengeResponse: AuthChallengeResponse;
    }

    /**
     * Return value of the 'Fetch.continueWithAuth' method.
     */
    export interface ContinueWithAuthResult {
    }

    /**
     * Parameters of the 'Fetch.continueResponse' method.
     */
    export interface ContinueResponseParams {
      /**
       * An id the client received in requestPaused event.
       */
      requestId: RequestId;

      /**
       * An HTTP response code. If absent, original response code will be used.
       */
      responseCode?: integer;

      /**
       * A textual representation of responseCode.
       * If absent, a standard phrase matching responseCode is used.
       */
      responsePhrase?: string;

      /**
       * Response headers. If absent, original response headers will be used.
       */
      responseHeaders?: HeaderEntry[];

      /**
       * Alternative way of specifying response headers as a \0-separated
       * series of name: value pairs. Prefer the above method unless you
       * need to represent some non-UTF8 values that can't be transmitted
       * over the protocol as text. (Encoded as a base64 string when passed over JSON)
       */
      binaryResponseHeaders?: string;
    }

    /**
     * Return value of the 'Fetch.continueResponse' method.
     */
    export interface ContinueResponseResult {
    }

    /**
     * Parameters of the 'Fetch.getResponseBody' method.
     */
    export interface GetResponseBodyParams {
      /**
       * Identifier for the intercepted request to get body for.
       */
      requestId: RequestId;
    }

    /**
     * Return value of the 'Fetch.getResponseBody' method.
     */
    export interface GetResponseBodyResult {
      /**
       * Response body.
       */
      body: string;

      /**
       * True, if content was sent as base64.
       */
      base64Encoded: boolean;
    }

    /**
     * Parameters of the 'Fetch.takeResponseBodyAsStream' method.
     */
    export interface TakeResponseBodyAsStreamParams {
      requestId: RequestId;
    }

    /**
     * Return value of the 'Fetch.takeResponseBodyAsStream' method.
     */
    export interface TakeResponseBodyAsStreamResult {
      stream: IO.StreamHandle;
    }

    /**
     * Parameters of the 'Fetch.requestPaused' event.
     */
    export interface RequestPausedEvent {
      /**
       * Each request the page makes will have a unique id.
       */
      requestId: RequestId;

      /**
       * The details of the request.
       */
      request: Network.Request;

      /**
       * The id of the frame that initiated the request.
       */
      frameId: Page.FrameId;

      /**
       * How the requested resource will be used.
       */
      resourceType: Network.ResourceType;

      /**
       * Response error if intercepted at response stage.
       */
      responseErrorReason?: Network.ErrorReason;

      /**
       * Response code if intercepted at response stage.
       */
      responseStatusCode?: integer;

      /**
       * Response status text if intercepted at response stage.
       */
      responseStatusText?: string;

      /**
       * Response headers if intercepted at the response stage.
       */
      responseHeaders?: HeaderEntry[];

      /**
       * If the intercepted request had a corresponding Network.requestWillBeSent event fired for it,
       * then this networkId will be the same as the requestId present in the requestWillBeSent event.
       */
      networkId?: Network.RequestId;

      /**
       * If the request is due to a redirect response from the server, the id of the request that
       * has caused the redirect.
       */
      redirectedRequestId?: RequestId;
    }

    /**
     * Parameters of the 'Fetch.authRequired' event.
     */
    export interface AuthRequiredEvent {
      /**
       * Each request the page makes will have a unique id.
       */
      requestId: RequestId;

      /**
       * The details of the request.
       */
      request: Network.Request;

      /**
       * The id of the frame that initiated the request.
       */
      frameId: Page.FrameId;

      /**
       * How the requested resource will be used.
       */
      resourceType: Network.ResourceType;

      /**
       * Details of the Authorization Challenge encountered.
       * If this is set, client should respond with continueRequest that
       * contains AuthChallengeResponse.
       */
      authChallenge: AuthChallenge;
    }

    /**
     * Unique request identifier.
     */
    export type RequestId = string;

    /**
     * Stages of the request to handle. Request will intercept before the request is
     * sent. Response will intercept after the response is received (but before response
     * body is received).
     */
    export type RequestStage = 'Request' | 'Response';

    export interface RequestPattern {
      /**
       * Wildcards (`'*'` -> zero or more, `'?'` -> exactly one) are allowed. Escape character is
       * backslash. Omitting is equivalent to `"*"`.
       */
      urlPattern?: string;

      /**
       * If set, only requests for matching resource types will be intercepted.
       */
      resourceType?: Network.ResourceType;

      /**
       * Stage at which to begin intercepting requests. Default is Request.
       */
      requestStage?: RequestStage;
    }

    /**
     * Response HTTP header entry
     */
    export interface HeaderEntry {
      name: string;

      value: string;
    }

    /**
     * Authorization challenge for HTTP status code 401 or 407.
     */
    export interface AuthChallenge {
      /**
       * Source of the authentication challenge.
       */
      source?: 'Server' | 'Proxy';

      /**
       * Origin of the challenger.
       */
      origin: string;

      /**
       * The authentication scheme used, such as basic or digest
       */
      scheme: string;

      /**
       * The realm of the challenge. May be empty.
       */
      realm: string;
    }

    /**
     * Response to an AuthChallenge.
     */
    export interface AuthChallengeResponse {
      /**
       * The decision on what to do in response to the authorization challenge.  Default means
       * deferring to the default behavior of the net stack, which will likely either the Cancel
       * authentication or display a popup dialog box.
       */
      response: 'Default' | 'CancelAuth' | 'ProvideCredentials';

      /**
       * The username to provide, possibly empty. Should only be set if response is
       * ProvideCredentials.
       */
      username?: string;

      /**
       * The password to provide, possibly empty. Should only be set if response is
       * ProvideCredentials.
       */
      password?: string;
    }
  }

  /**
   * Methods and events of the 'WebAudio' domain.
   */
  export interface WebAudioApi {
    requests: {
      /**
       * Enables the WebAudio domain and starts sending context lifetime events.
       */
      enable: { params: WebAudio.EnableParams, result: WebAudio.EnableResult }

      /**
       * Disables the WebAudio domain.
       */
      disable: { params: WebAudio.DisableParams, result: WebAudio.DisableResult }

      /**
       * Fetch the realtime data from the registered contexts.
       */
      getRealtimeData: { params: WebAudio.GetRealtimeDataParams, result: WebAudio.GetRealtimeDataResult }
    };
    events: {

      /**
       * Notifies that a new BaseAudioContext has been created.
       */
      contextCreated: { params: WebAudio.ContextCreatedEvent };

      /**
       * Notifies that an existing BaseAudioContext will be destroyed.
       */
      contextWillBeDestroyed: { params: WebAudio.ContextWillBeDestroyedEvent };

      /**
       * Notifies that existing BaseAudioContext has changed some properties (id stays the same)..
       */
      contextChanged: { params: WebAudio.ContextChangedEvent };

      /**
       * Notifies that the construction of an AudioListener has finished.
       */
      audioListenerCreated: { params: WebAudio.AudioListenerCreatedEvent };

      /**
       * Notifies that a new AudioListener has been created.
       */
      audioListenerWillBeDestroyed: { params: WebAudio.AudioListenerWillBeDestroyedEvent };

      /**
       * Notifies that a new AudioNode has been created.
       */
      audioNodeCreated: { params: WebAudio.AudioNodeCreatedEvent };

      /**
       * Notifies that an existing AudioNode has been destroyed.
       */
      audioNodeWillBeDestroyed: { params: WebAudio.AudioNodeWillBeDestroyedEvent };

      /**
       * Notifies that a new AudioParam has been created.
       */
      audioParamCreated: { params: WebAudio.AudioParamCreatedEvent };

      /**
       * Notifies that an existing AudioParam has been destroyed.
       */
      audioParamWillBeDestroyed: { params: WebAudio.AudioParamWillBeDestroyedEvent };

      /**
       * Notifies that two AudioNodes are connected.
       */
      nodesConnected: { params: WebAudio.NodesConnectedEvent };

      /**
       * Notifies that AudioNodes are disconnected. The destination can be null, and it means all the outgoing connections from the source are disconnected.
       */
      nodesDisconnected: { params: WebAudio.NodesDisconnectedEvent };

      /**
       * Notifies that an AudioNode is connected to an AudioParam.
       */
      nodeParamConnected: { params: WebAudio.NodeParamConnectedEvent };

      /**
       * Notifies that an AudioNode is disconnected to an AudioParam.
       */
      nodeParamDisconnected: { params: WebAudio.NodeParamDisconnectedEvent };
    };
  }

  /**
   * Types of the 'WebAudio' domain.
   */
  export namespace WebAudio {
    /**
     * Parameters of the 'WebAudio.enable' method.
     */
    export interface EnableParams {
    }

    /**
     * Return value of the 'WebAudio.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'WebAudio.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'WebAudio.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'WebAudio.getRealtimeData' method.
     */
    export interface GetRealtimeDataParams {
      contextId: GraphObjectId;
    }

    /**
     * Return value of the 'WebAudio.getRealtimeData' method.
     */
    export interface GetRealtimeDataResult {
      realtimeData: ContextRealtimeData;
    }

    /**
     * Parameters of the 'WebAudio.contextCreated' event.
     */
    export interface ContextCreatedEvent {
      context: BaseAudioContext;
    }

    /**
     * Parameters of the 'WebAudio.contextWillBeDestroyed' event.
     */
    export interface ContextWillBeDestroyedEvent {
      contextId: GraphObjectId;
    }

    /**
     * Parameters of the 'WebAudio.contextChanged' event.
     */
    export interface ContextChangedEvent {
      context: BaseAudioContext;
    }

    /**
     * Parameters of the 'WebAudio.audioListenerCreated' event.
     */
    export interface AudioListenerCreatedEvent {
      listener: AudioListener;
    }

    /**
     * Parameters of the 'WebAudio.audioListenerWillBeDestroyed' event.
     */
    export interface AudioListenerWillBeDestroyedEvent {
      contextId: GraphObjectId;

      listenerId: GraphObjectId;
    }

    /**
     * Parameters of the 'WebAudio.audioNodeCreated' event.
     */
    export interface AudioNodeCreatedEvent {
      node: AudioNode;
    }

    /**
     * Parameters of the 'WebAudio.audioNodeWillBeDestroyed' event.
     */
    export interface AudioNodeWillBeDestroyedEvent {
      contextId: GraphObjectId;

      nodeId: GraphObjectId;
    }

    /**
     * Parameters of the 'WebAudio.audioParamCreated' event.
     */
    export interface AudioParamCreatedEvent {
      param: AudioParam;
    }

    /**
     * Parameters of the 'WebAudio.audioParamWillBeDestroyed' event.
     */
    export interface AudioParamWillBeDestroyedEvent {
      contextId: GraphObjectId;

      nodeId: GraphObjectId;

      paramId: GraphObjectId;
    }

    /**
     * Parameters of the 'WebAudio.nodesConnected' event.
     */
    export interface NodesConnectedEvent {
      contextId: GraphObjectId;

      sourceId: GraphObjectId;

      destinationId: GraphObjectId;

      sourceOutputIndex?: number;

      destinationInputIndex?: number;
    }

    /**
     * Parameters of the 'WebAudio.nodesDisconnected' event.
     */
    export interface NodesDisconnectedEvent {
      contextId: GraphObjectId;

      sourceId: GraphObjectId;

      destinationId: GraphObjectId;

      sourceOutputIndex?: number;

      destinationInputIndex?: number;
    }

    /**
     * Parameters of the 'WebAudio.nodeParamConnected' event.
     */
    export interface NodeParamConnectedEvent {
      contextId: GraphObjectId;

      sourceId: GraphObjectId;

      destinationId: GraphObjectId;

      sourceOutputIndex?: number;
    }

    /**
     * Parameters of the 'WebAudio.nodeParamDisconnected' event.
     */
    export interface NodeParamDisconnectedEvent {
      contextId: GraphObjectId;

      sourceId: GraphObjectId;

      destinationId: GraphObjectId;

      sourceOutputIndex?: number;
    }

    /**
     * An unique ID for a graph object (AudioContext, AudioNode, AudioParam) in Web Audio API
     */
    export type GraphObjectId = string;

    /**
     * Enum of BaseAudioContext types
     */
    export type ContextType = 'realtime' | 'offline';

    /**
     * Enum of AudioContextState from the spec
     */
    export type ContextState = 'suspended' | 'running' | 'closed';

    /**
     * Enum of AudioNode types
     */
    export type NodeType = string;

    /**
     * Enum of AudioNode::ChannelCountMode from the spec
     */
    export type ChannelCountMode = 'clamped-max' | 'explicit' | 'max';

    /**
     * Enum of AudioNode::ChannelInterpretation from the spec
     */
    export type ChannelInterpretation = 'discrete' | 'speakers';

    /**
     * Enum of AudioParam types
     */
    export type ParamType = string;

    /**
     * Enum of AudioParam::AutomationRate from the spec
     */
    export type AutomationRate = 'a-rate' | 'k-rate';

    /**
     * Fields in AudioContext that change in real-time.
     */
    export interface ContextRealtimeData {
      /**
       * The current context time in second in BaseAudioContext.
       */
      currentTime: number;

      /**
       * The time spent on rendering graph divided by render quantum duration,
       * and multiplied by 100. 100 means the audio renderer reached the full
       * capacity and glitch may occur.
       */
      renderCapacity: number;

      /**
       * A running mean of callback interval.
       */
      callbackIntervalMean: number;

      /**
       * A running variance of callback interval.
       */
      callbackIntervalVariance: number;
    }

    /**
     * Protocol object for BaseAudioContext
     */
    export interface BaseAudioContext {
      contextId: GraphObjectId;

      contextType: ContextType;

      contextState: ContextState;

      realtimeData?: ContextRealtimeData;

      /**
       * Platform-dependent callback buffer size.
       */
      callbackBufferSize: number;

      /**
       * Number of output channels supported by audio hardware in use.
       */
      maxOutputChannelCount: number;

      /**
       * Context sample rate.
       */
      sampleRate: number;
    }

    /**
     * Protocol object for AudioListener
     */
    export interface AudioListener {
      listenerId: GraphObjectId;

      contextId: GraphObjectId;
    }

    /**
     * Protocol object for AudioNode
     */
    export interface AudioNode {
      nodeId: GraphObjectId;

      contextId: GraphObjectId;

      nodeType: NodeType;

      numberOfInputs: number;

      numberOfOutputs: number;

      channelCount: number;

      channelCountMode: ChannelCountMode;

      channelInterpretation: ChannelInterpretation;
    }

    /**
     * Protocol object for AudioParam
     */
    export interface AudioParam {
      paramId: GraphObjectId;

      nodeId: GraphObjectId;

      contextId: GraphObjectId;

      paramType: ParamType;

      rate: AutomationRate;

      defaultValue: number;

      minValue: number;

      maxValue: number;
    }
  }

  /**
   * Methods and events of the 'WebAuthn' domain.
   */
  export interface WebAuthnApi {
    requests: {
      /**
       * Enable the WebAuthn domain and start intercepting credential storage and
       * retrieval with a virtual authenticator.
       */
      enable: { params: WebAuthn.EnableParams, result: WebAuthn.EnableResult }

      /**
       * Disable the WebAuthn domain.
       */
      disable: { params: WebAuthn.DisableParams, result: WebAuthn.DisableResult }

      /**
       * Creates and adds a virtual authenticator.
       */
      addVirtualAuthenticator: { params: WebAuthn.AddVirtualAuthenticatorParams, result: WebAuthn.AddVirtualAuthenticatorResult }

      /**
       * Resets parameters isBogusSignature, isBadUV, isBadUP to false if they are not present.
       */
      setResponseOverrideBits: { params: WebAuthn.SetResponseOverrideBitsParams, result: WebAuthn.SetResponseOverrideBitsResult }

      /**
       * Removes the given authenticator.
       */
      removeVirtualAuthenticator: { params: WebAuthn.RemoveVirtualAuthenticatorParams, result: WebAuthn.RemoveVirtualAuthenticatorResult }

      /**
       * Adds the credential to the specified authenticator.
       */
      addCredential: { params: WebAuthn.AddCredentialParams, result: WebAuthn.AddCredentialResult }

      /**
       * Returns a single credential stored in the given virtual authenticator that
       * matches the credential ID.
       */
      getCredential: { params: WebAuthn.GetCredentialParams, result: WebAuthn.GetCredentialResult }

      /**
       * Returns all the credentials stored in the given virtual authenticator.
       */
      getCredentials: { params: WebAuthn.GetCredentialsParams, result: WebAuthn.GetCredentialsResult }

      /**
       * Removes a credential from the authenticator.
       */
      removeCredential: { params: WebAuthn.RemoveCredentialParams, result: WebAuthn.RemoveCredentialResult }

      /**
       * Clears all the credentials from the specified device.
       */
      clearCredentials: { params: WebAuthn.ClearCredentialsParams, result: WebAuthn.ClearCredentialsResult }

      /**
       * Sets whether User Verification succeeds or fails for an authenticator.
       * The default is true.
       */
      setUserVerified: { params: WebAuthn.SetUserVerifiedParams, result: WebAuthn.SetUserVerifiedResult }

      /**
       * Sets whether tests of user presence will succeed immediately (if true) or fail to resolve (if false) for an authenticator.
       * The default is true.
       */
      setAutomaticPresenceSimulation: { params: WebAuthn.SetAutomaticPresenceSimulationParams, result: WebAuthn.SetAutomaticPresenceSimulationResult }
    };
    events: {

      /**
       * Triggered when a credential is added to an authenticator.
       */
      credentialAdded: { params: WebAuthn.CredentialAddedEvent };

      /**
       * Triggered when a credential is used in a webauthn assertion.
       */
      credentialAsserted: { params: WebAuthn.CredentialAssertedEvent };
    };
  }

  /**
   * Types of the 'WebAuthn' domain.
   */
  export namespace WebAuthn {
    /**
     * Parameters of the 'WebAuthn.enable' method.
     */
    export interface EnableParams {
      /**
       * Whether to enable the WebAuthn user interface. Enabling the UI is
       * recommended for debugging and demo purposes, as it is closer to the real
       * experience. Disabling the UI is recommended for automated testing.
       * Supported at the embedder's discretion if UI is available.
       * Defaults to false.
       */
      enableUI?: boolean;
    }

    /**
     * Return value of the 'WebAuthn.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'WebAuthn.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'WebAuthn.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'WebAuthn.addVirtualAuthenticator' method.
     */
    export interface AddVirtualAuthenticatorParams {
      options: VirtualAuthenticatorOptions;
    }

    /**
     * Return value of the 'WebAuthn.addVirtualAuthenticator' method.
     */
    export interface AddVirtualAuthenticatorResult {
      authenticatorId: AuthenticatorId;
    }

    /**
     * Parameters of the 'WebAuthn.setResponseOverrideBits' method.
     */
    export interface SetResponseOverrideBitsParams {
      authenticatorId: AuthenticatorId;

      /**
       * If isBogusSignature is set, overrides the signature in the authenticator response to be zero.
       * Defaults to false.
       */
      isBogusSignature?: boolean;

      /**
       * If isBadUV is set, overrides the UV bit in the flags in the authenticator response to
       * be zero. Defaults to false.
       */
      isBadUV?: boolean;

      /**
       * If isBadUP is set, overrides the UP bit in the flags in the authenticator response to
       * be zero. Defaults to false.
       */
      isBadUP?: boolean;
    }

    /**
     * Return value of the 'WebAuthn.setResponseOverrideBits' method.
     */
    export interface SetResponseOverrideBitsResult {
    }

    /**
     * Parameters of the 'WebAuthn.removeVirtualAuthenticator' method.
     */
    export interface RemoveVirtualAuthenticatorParams {
      authenticatorId: AuthenticatorId;
    }

    /**
     * Return value of the 'WebAuthn.removeVirtualAuthenticator' method.
     */
    export interface RemoveVirtualAuthenticatorResult {
    }

    /**
     * Parameters of the 'WebAuthn.addCredential' method.
     */
    export interface AddCredentialParams {
      authenticatorId: AuthenticatorId;

      credential: Credential;
    }

    /**
     * Return value of the 'WebAuthn.addCredential' method.
     */
    export interface AddCredentialResult {
    }

    /**
     * Parameters of the 'WebAuthn.getCredential' method.
     */
    export interface GetCredentialParams {
      authenticatorId: AuthenticatorId;

      credentialId: string;
    }

    /**
     * Return value of the 'WebAuthn.getCredential' method.
     */
    export interface GetCredentialResult {
      credential: Credential;
    }

    /**
     * Parameters of the 'WebAuthn.getCredentials' method.
     */
    export interface GetCredentialsParams {
      authenticatorId: AuthenticatorId;
    }

    /**
     * Return value of the 'WebAuthn.getCredentials' method.
     */
    export interface GetCredentialsResult {
      credentials: Credential[];
    }

    /**
     * Parameters of the 'WebAuthn.removeCredential' method.
     */
    export interface RemoveCredentialParams {
      authenticatorId: AuthenticatorId;

      credentialId: string;
    }

    /**
     * Return value of the 'WebAuthn.removeCredential' method.
     */
    export interface RemoveCredentialResult {
    }

    /**
     * Parameters of the 'WebAuthn.clearCredentials' method.
     */
    export interface ClearCredentialsParams {
      authenticatorId: AuthenticatorId;
    }

    /**
     * Return value of the 'WebAuthn.clearCredentials' method.
     */
    export interface ClearCredentialsResult {
    }

    /**
     * Parameters of the 'WebAuthn.setUserVerified' method.
     */
    export interface SetUserVerifiedParams {
      authenticatorId: AuthenticatorId;

      isUserVerified: boolean;
    }

    /**
     * Return value of the 'WebAuthn.setUserVerified' method.
     */
    export interface SetUserVerifiedResult {
    }

    /**
     * Parameters of the 'WebAuthn.setAutomaticPresenceSimulation' method.
     */
    export interface SetAutomaticPresenceSimulationParams {
      authenticatorId: AuthenticatorId;

      enabled: boolean;
    }

    /**
     * Return value of the 'WebAuthn.setAutomaticPresenceSimulation' method.
     */
    export interface SetAutomaticPresenceSimulationResult {
    }

    /**
     * Parameters of the 'WebAuthn.credentialAdded' event.
     */
    export interface CredentialAddedEvent {
      authenticatorId: AuthenticatorId;

      credential: Credential;
    }

    /**
     * Parameters of the 'WebAuthn.credentialAsserted' event.
     */
    export interface CredentialAssertedEvent {
      authenticatorId: AuthenticatorId;

      credential: Credential;
    }

    export type AuthenticatorId = string;

    export type AuthenticatorProtocol = 'u2f' | 'ctap2';

    export type Ctap2Version = 'ctap2_0' | 'ctap2_1';

    export type AuthenticatorTransport = 'usb' | 'nfc' | 'ble' | 'cable' | 'internal';

    export interface VirtualAuthenticatorOptions {
      protocol: AuthenticatorProtocol;

      /**
       * Defaults to ctap2_0. Ignored if |protocol| == u2f.
       */
      ctap2Version?: Ctap2Version;

      transport: AuthenticatorTransport;

      /**
       * Defaults to false.
       */
      hasResidentKey?: boolean;

      /**
       * Defaults to false.
       */
      hasUserVerification?: boolean;

      /**
       * If set to true, the authenticator will support the largeBlob extension.
       * https://w3c.github.io/webauthn#largeBlob
       * Defaults to false.
       */
      hasLargeBlob?: boolean;

      /**
       * If set to true, the authenticator will support the credBlob extension.
       * https://fidoalliance.org/specs/fido-v2.1-rd-20201208/fido-client-to-authenticator-protocol-v2.1-rd-20201208.html#sctn-credBlob-extension
       * Defaults to false.
       */
      hasCredBlob?: boolean;

      /**
       * If set to true, the authenticator will support the minPinLength extension.
       * https://fidoalliance.org/specs/fido-v2.1-ps-20210615/fido-client-to-authenticator-protocol-v2.1-ps-20210615.html#sctn-minpinlength-extension
       * Defaults to false.
       */
      hasMinPinLength?: boolean;

      /**
       * If set to true, the authenticator will support the prf extension.
       * https://w3c.github.io/webauthn/#prf-extension
       * Defaults to false.
       */
      hasPrf?: boolean;

      /**
       * If set to true, tests of user presence will succeed immediately.
       * Otherwise, they will not be resolved. Defaults to true.
       */
      automaticPresenceSimulation?: boolean;

      /**
       * Sets whether User Verification succeeds or fails for an authenticator.
       * Defaults to false.
       */
      isUserVerified?: boolean;

      /**
       * Credentials created by this authenticator will have the backup
       * eligibility (BE) flag set to this value. Defaults to false.
       * https://w3c.github.io/webauthn/#sctn-credential-backup
       */
      defaultBackupEligibility?: boolean;

      /**
       * Credentials created by this authenticator will have the backup state
       * (BS) flag set to this value. Defaults to false.
       * https://w3c.github.io/webauthn/#sctn-credential-backup
       */
      defaultBackupState?: boolean;
    }

    export interface Credential {
      credentialId: string;

      isResidentCredential: boolean;

      /**
       * Relying Party ID the credential is scoped to. Must be set when adding a
       * credential.
       */
      rpId?: string;

      /**
       * The ECDSA P-256 private key in PKCS#8 format. (Encoded as a base64 string when passed over JSON)
       */
      privateKey: string;

      /**
       * An opaque byte sequence with a maximum size of 64 bytes mapping the
       * credential to a specific user. (Encoded as a base64 string when passed over JSON)
       */
      userHandle?: string;

      /**
       * Signature counter. This is incremented by one for each successful
       * assertion.
       * See https://w3c.github.io/webauthn/#signature-counter
       */
      signCount: integer;

      /**
       * The large blob associated with the credential.
       * See https://w3c.github.io/webauthn/#sctn-large-blob-extension (Encoded as a base64 string when passed over JSON)
       */
      largeBlob?: string;
    }
  }

  /**
   * Methods and events of the 'Media' domain.
   */
  export interface MediaApi {
    requests: {
      /**
       * Enables the Media domain
       */
      enable: { params: Media.EnableParams, result: Media.EnableResult }

      /**
       * Disables the Media domain.
       */
      disable: { params: Media.DisableParams, result: Media.DisableResult }
    };
    events: {

      /**
       * This can be called multiple times, and can be used to set / override /
       * remove player properties. A null propValue indicates removal.
       */
      playerPropertiesChanged: { params: Media.PlayerPropertiesChangedEvent };

      /**
       * Send events as a list, allowing them to be batched on the browser for less
       * congestion. If batched, events must ALWAYS be in chronological order.
       */
      playerEventsAdded: { params: Media.PlayerEventsAddedEvent };

      /**
       * Send a list of any messages that need to be delivered.
       */
      playerMessagesLogged: { params: Media.PlayerMessagesLoggedEvent };

      /**
       * Send a list of any errors that need to be delivered.
       */
      playerErrorsRaised: { params: Media.PlayerErrorsRaisedEvent };

      /**
       * Called whenever a player is created, or when a new agent joins and receives
       * a list of active players. If an agent is restored, it will receive the full
       * list of player ids and all events again.
       */
      playersCreated: { params: Media.PlayersCreatedEvent };
    };
  }

  /**
   * Types of the 'Media' domain.
   */
  export namespace Media {
    /**
     * Parameters of the 'Media.enable' method.
     */
    export interface EnableParams {
    }

    /**
     * Return value of the 'Media.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'Media.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'Media.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'Media.playerPropertiesChanged' event.
     */
    export interface PlayerPropertiesChangedEvent {
      playerId: PlayerId;

      properties: PlayerProperty[];
    }

    /**
     * Parameters of the 'Media.playerEventsAdded' event.
     */
    export interface PlayerEventsAddedEvent {
      playerId: PlayerId;

      events: PlayerEvent[];
    }

    /**
     * Parameters of the 'Media.playerMessagesLogged' event.
     */
    export interface PlayerMessagesLoggedEvent {
      playerId: PlayerId;

      messages: PlayerMessage[];
    }

    /**
     * Parameters of the 'Media.playerErrorsRaised' event.
     */
    export interface PlayerErrorsRaisedEvent {
      playerId: PlayerId;

      errors: PlayerError[];
    }

    /**
     * Parameters of the 'Media.playersCreated' event.
     */
    export interface PlayersCreatedEvent {
      players: PlayerId[];
    }

    /**
     * Players will get an ID that is unique within the agent context.
     */
    export type PlayerId = string;

    export type Timestamp = number;

    /**
     * Have one type per entry in MediaLogRecord::Type
     * Corresponds to kMessage
     */
    export interface PlayerMessage {
      /**
       * Keep in sync with MediaLogMessageLevel
       * We are currently keeping the message level 'error' separate from the
       * PlayerError type because right now they represent different things,
       * this one being a DVLOG(ERROR) style log message that gets printed
       * based on what log level is selected in the UI, and the other is a
       * representation of a media::PipelineStatus object. Soon however we're
       * going to be moving away from using PipelineStatus for errors and
       * introducing a new error type which should hopefully let us integrate
       * the error log level into the PlayerError type.
       */
      level: 'error' | 'warning' | 'info' | 'debug';

      message: string;
    }

    /**
     * Corresponds to kMediaPropertyChange
     */
    export interface PlayerProperty {
      name: string;

      value: string;
    }

    /**
     * Corresponds to kMediaEventTriggered
     */
    export interface PlayerEvent {
      timestamp: Timestamp;

      value: string;
    }

    /**
     * Represents logged source line numbers reported in an error.
     * NOTE: file and line are from chromium c++ implementation code, not js.
     */
    export interface PlayerErrorSourceLocation {
      file: string;

      line: integer;
    }

    /**
     * Corresponds to kMediaError
     */
    export interface PlayerError {
      errorType: string;

      /**
       * Code is the numeric enum entry for a specific set of error codes, such
       * as PipelineStatusCodes in media/base/pipeline_status.h
       */
      code: integer;

      /**
       * A trace of where this error was caused / where it passed through.
       */
      stack: PlayerErrorSourceLocation[];

      /**
       * Errors potentially have a root cause error, ie, a DecoderError might be
       * caused by an WindowsError
       */
      cause: PlayerError[];

      /**
       * Extra data attached to an error, such as an HRESULT, Video Codec, etc.
       */
      data: Record<string, unknown>;
    }
  }

  /**
   * Methods and events of the 'DeviceAccess' domain.
   */
  export interface DeviceAccessApi {
    requests: {
      /**
       * Enable events in this domain.
       */
      enable: { params: DeviceAccess.EnableParams, result: DeviceAccess.EnableResult }

      /**
       * Disable events in this domain.
       */
      disable: { params: DeviceAccess.DisableParams, result: DeviceAccess.DisableResult }

      /**
       * Select a device in response to a DeviceAccess.deviceRequestPrompted event.
       */
      selectPrompt: { params: DeviceAccess.SelectPromptParams, result: DeviceAccess.SelectPromptResult }

      /**
       * Cancel a prompt in response to a DeviceAccess.deviceRequestPrompted event.
       */
      cancelPrompt: { params: DeviceAccess.CancelPromptParams, result: DeviceAccess.CancelPromptResult }
    };
    events: {

      /**
       * A device request opened a user prompt to select a device. Respond with the
       * selectPrompt or cancelPrompt command.
       */
      deviceRequestPrompted: { params: DeviceAccess.DeviceRequestPromptedEvent };
    };
  }

  /**
   * Types of the 'DeviceAccess' domain.
   */
  export namespace DeviceAccess {
    /**
     * Parameters of the 'DeviceAccess.enable' method.
     */
    export interface EnableParams {
    }

    /**
     * Return value of the 'DeviceAccess.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'DeviceAccess.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'DeviceAccess.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'DeviceAccess.selectPrompt' method.
     */
    export interface SelectPromptParams {
      id: RequestId;

      deviceId: DeviceId;
    }

    /**
     * Return value of the 'DeviceAccess.selectPrompt' method.
     */
    export interface SelectPromptResult {
    }

    /**
     * Parameters of the 'DeviceAccess.cancelPrompt' method.
     */
    export interface CancelPromptParams {
      id: RequestId;
    }

    /**
     * Return value of the 'DeviceAccess.cancelPrompt' method.
     */
    export interface CancelPromptResult {
    }

    /**
     * Parameters of the 'DeviceAccess.deviceRequestPrompted' event.
     */
    export interface DeviceRequestPromptedEvent {
      id: RequestId;

      devices: PromptDevice[];
    }

    /**
     * Device request id.
     */
    export type RequestId = string;

    /**
     * A device id.
     */
    export type DeviceId = string;

    /**
     * Device information displayed in a user prompt to select a device.
     */
    export interface PromptDevice {
      id: DeviceId;

      /**
       * Display name as it appears in a device request user prompt.
       */
      name: string;
    }
  }

  /**
   * Methods and events of the 'Preload' domain.
   */
  export interface PreloadApi {
    requests: {
      enable: { params: Preload.EnableParams, result: Preload.EnableResult }

      disable: { params: Preload.DisableParams, result: Preload.DisableResult }
    };
    events: {

      /**
       * Upsert. Currently, it is only emitted when a rule set added.
       */
      ruleSetUpdated: { params: Preload.RuleSetUpdatedEvent };

      ruleSetRemoved: { params: Preload.RuleSetRemovedEvent };

      /**
       * Fired when a preload enabled state is updated.
       */
      preloadEnabledStateUpdated: { params: Preload.PreloadEnabledStateUpdatedEvent };

      /**
       * Fired when a prefetch attempt is updated.
       */
      prefetchStatusUpdated: { params: Preload.PrefetchStatusUpdatedEvent };

      /**
       * Fired when a prerender attempt is updated.
       */
      prerenderStatusUpdated: { params: Preload.PrerenderStatusUpdatedEvent };

      /**
       * Send a list of sources for all preloading attempts in a document.
       */
      preloadingAttemptSourcesUpdated: { params: Preload.PreloadingAttemptSourcesUpdatedEvent };
    };
  }

  /**
   * Types of the 'Preload' domain.
   */
  export namespace Preload {
    /**
     * Parameters of the 'Preload.enable' method.
     */
    export interface EnableParams {
    }

    /**
     * Return value of the 'Preload.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'Preload.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'Preload.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'Preload.ruleSetUpdated' event.
     */
    export interface RuleSetUpdatedEvent {
      ruleSet: RuleSet;
    }

    /**
     * Parameters of the 'Preload.ruleSetRemoved' event.
     */
    export interface RuleSetRemovedEvent {
      id: RuleSetId;
    }

    /**
     * Parameters of the 'Preload.preloadEnabledStateUpdated' event.
     */
    export interface PreloadEnabledStateUpdatedEvent {
      disabledByPreference: boolean;

      disabledByDataSaver: boolean;

      disabledByBatterySaver: boolean;

      disabledByHoldbackPrefetchSpeculationRules: boolean;

      disabledByHoldbackPrerenderSpeculationRules: boolean;
    }

    /**
     * Parameters of the 'Preload.prefetchStatusUpdated' event.
     */
    export interface PrefetchStatusUpdatedEvent {
      key: PreloadingAttemptKey;

      /**
       * The frame id of the frame initiating prefetch.
       */
      initiatingFrameId: Page.FrameId;

      prefetchUrl: string;

      status: PreloadingStatus;

      prefetchStatus: PrefetchStatus;

      requestId: Network.RequestId;
    }

    /**
     * Parameters of the 'Preload.prerenderStatusUpdated' event.
     */
    export interface PrerenderStatusUpdatedEvent {
      key: PreloadingAttemptKey;

      status: PreloadingStatus;

      prerenderStatus?: PrerenderFinalStatus;

      /**
       * This is used to give users more information about the name of Mojo interface
       * that is incompatible with prerender and has caused the cancellation of the attempt.
       */
      disallowedMojoInterface?: string;

      mismatchedHeaders?: PrerenderMismatchedHeaders[];
    }

    /**
     * Parameters of the 'Preload.preloadingAttemptSourcesUpdated' event.
     */
    export interface PreloadingAttemptSourcesUpdatedEvent {
      loaderId: Network.LoaderId;

      preloadingAttemptSources: PreloadingAttemptSource[];
    }

    /**
     * Unique id
     */
    export type RuleSetId = string;

    /**
     * Corresponds to SpeculationRuleSet
     */
    export interface RuleSet {
      id: RuleSetId;

      /**
       * Identifies a document which the rule set is associated with.
       */
      loaderId: Network.LoaderId;

      /**
       * Source text of JSON representing the rule set. If it comes from
       * `<script>` tag, it is the textContent of the node. Note that it is
       * a JSON for valid case.
       * 
       * See also:
       * - https://wicg.github.io/nav-speculation/speculation-rules.html
       * - https://github.com/WICG/nav-speculation/blob/main/triggers.md
       */
      sourceText: string;

      /**
       * A speculation rule set is either added through an inline
       * `<script>` tag or through an external resource via the
       * 'Speculation-Rules' HTTP header. For the first case, we include
       * the BackendNodeId of the relevant `<script>` tag. For the second
       * case, we include the external URL where the rule set was loaded
       * from, and also RequestId if Network domain is enabled.
       * 
       * See also:
       * - https://wicg.github.io/nav-speculation/speculation-rules.html#speculation-rules-script
       * - https://wicg.github.io/nav-speculation/speculation-rules.html#speculation-rules-header
       */
      backendNodeId?: DOM.BackendNodeId;

      url?: string;

      requestId?: Network.RequestId;

      /**
       * Error information
       * `errorMessage` is null iff `errorType` is null.
       */
      errorType?: RuleSetErrorType;

      /**
       * TODO(https://crbug.com/1425354): Replace this property with structured error.
       * @deprecated
       */
      errorMessage?: string;
    }

    export type RuleSetErrorType = 'SourceIsNotJsonObject' | 'InvalidRulesSkipped';

    /**
     * The type of preloading attempted. It corresponds to
     * mojom::SpeculationAction (although PrefetchWithSubresources is omitted as it
     * isn't being used by clients).
     */
    export type SpeculationAction = 'Prefetch' | 'Prerender';

    /**
     * Corresponds to mojom::SpeculationTargetHint.
     * See https://github.com/WICG/nav-speculation/blob/main/triggers.md#window-name-targeting-hints
     */
    export type SpeculationTargetHint = 'Blank' | 'Self';

    /**
     * A key that identifies a preloading attempt.
     * 
     * The url used is the url specified by the trigger (i.e. the initial URL), and
     * not the final url that is navigated to. For example, prerendering allows
     * same-origin main frame navigations during the attempt, but the attempt is
     * still keyed with the initial URL.
     */
    export interface PreloadingAttemptKey {
      loaderId: Network.LoaderId;

      action: SpeculationAction;

      url: string;

      targetHint?: SpeculationTargetHint;
    }

    /**
     * Lists sources for a preloading attempt, specifically the ids of rule sets
     * that had a speculation rule that triggered the attempt, and the
     * BackendNodeIds of <a href> or <area href> elements that triggered the
     * attempt (in the case of attempts triggered by a document rule). It is
     * possible for mulitple rule sets and links to trigger a single attempt.
     */
    export interface PreloadingAttemptSource {
      key: PreloadingAttemptKey;

      ruleSetIds: RuleSetId[];

      nodeIds: DOM.BackendNodeId[];
    }

    /**
     * List of FinalStatus reasons for Prerender2.
     */
    export type PrerenderFinalStatus = 'Activated' | 'Destroyed' | 'LowEndDevice' | 'InvalidSchemeRedirect' | 'InvalidSchemeNavigation' | 'NavigationRequestBlockedByCsp' | 'MainFrameNavigation' | 'MojoBinderPolicy' | 'RendererProcessCrashed' | 'RendererProcessKilled' | 'Download' | 'TriggerDestroyed' | 'NavigationNotCommitted' | 'NavigationBadHttpStatus' | 'ClientCertRequested' | 'NavigationRequestNetworkError' | 'CancelAllHostsForTesting' | 'DidFailLoad' | 'Stop' | 'SslCertificateError' | 'LoginAuthRequested' | 'UaChangeRequiresReload' | 'BlockedByClient' | 'AudioOutputDeviceRequested' | 'MixedContent' | 'TriggerBackgrounded' | 'MemoryLimitExceeded' | 'DataSaverEnabled' | 'TriggerUrlHasEffectiveUrl' | 'ActivatedBeforeStarted' | 'InactivePageRestriction' | 'StartFailed' | 'TimeoutBackgrounded' | 'CrossSiteRedirectInInitialNavigation' | 'CrossSiteNavigationInInitialNavigation' | 'SameSiteCrossOriginRedirectNotOptInInInitialNavigation' | 'SameSiteCrossOriginNavigationNotOptInInInitialNavigation' | 'ActivationNavigationParameterMismatch' | 'ActivatedInBackground' | 'EmbedderHostDisallowed' | 'ActivationNavigationDestroyedBeforeSuccess' | 'TabClosedByUserGesture' | 'TabClosedWithoutUserGesture' | 'PrimaryMainFrameRendererProcessCrashed' | 'PrimaryMainFrameRendererProcessKilled' | 'ActivationFramePolicyNotCompatible' | 'PreloadingDisabled' | 'BatterySaverEnabled' | 'ActivatedDuringMainFrameNavigation' | 'PreloadingUnsupportedByWebContents' | 'CrossSiteRedirectInMainFrameNavigation' | 'CrossSiteNavigationInMainFrameNavigation' | 'SameSiteCrossOriginRedirectNotOptInInMainFrameNavigation' | 'SameSiteCrossOriginNavigationNotOptInInMainFrameNavigation' | 'MemoryPressureOnTrigger' | 'MemoryPressureAfterTriggered' | 'PrerenderingDisabledByDevTools' | 'SpeculationRuleRemoved' | 'ActivatedWithAuxiliaryBrowsingContexts' | 'MaxNumOfRunningEagerPrerendersExceeded' | 'MaxNumOfRunningNonEagerPrerendersExceeded' | 'MaxNumOfRunningEmbedderPrerendersExceeded' | 'PrerenderingUrlHasEffectiveUrl' | 'RedirectedPrerenderingUrlHasEffectiveUrl' | 'ActivationUrlHasEffectiveUrl';

    /**
     * Preloading status values, see also PreloadingTriggeringOutcome. This
     * status is shared by prefetchStatusUpdated and prerenderStatusUpdated.
     */
    export type PreloadingStatus = 'Pending' | 'Running' | 'Ready' | 'Success' | 'Failure' | 'NotSupported';

    /**
     * TODO(https://crbug.com/1384419): revisit the list of PrefetchStatus and
     * filter out the ones that aren't necessary to the developers.
     */
    export type PrefetchStatus = 'PrefetchAllowed' | 'PrefetchFailedIneligibleRedirect' | 'PrefetchFailedInvalidRedirect' | 'PrefetchFailedMIMENotSupported' | 'PrefetchFailedNetError' | 'PrefetchFailedNon2XX' | 'PrefetchFailedPerPageLimitExceeded' | 'PrefetchEvictedAfterCandidateRemoved' | 'PrefetchEvictedForNewerPrefetch' | 'PrefetchHeldback' | 'PrefetchIneligibleRetryAfter' | 'PrefetchIsPrivacyDecoy' | 'PrefetchIsStale' | 'PrefetchNotEligibleBrowserContextOffTheRecord' | 'PrefetchNotEligibleDataSaverEnabled' | 'PrefetchNotEligibleExistingProxy' | 'PrefetchNotEligibleHostIsNonUnique' | 'PrefetchNotEligibleNonDefaultStoragePartition' | 'PrefetchNotEligibleSameSiteCrossOriginPrefetchRequiredProxy' | 'PrefetchNotEligibleSchemeIsNotHttps' | 'PrefetchNotEligibleUserHasCookies' | 'PrefetchNotEligibleUserHasServiceWorker' | 'PrefetchNotEligibleBatterySaverEnabled' | 'PrefetchNotEligiblePreloadingDisabled' | 'PrefetchNotFinishedInTime' | 'PrefetchNotStarted' | 'PrefetchNotUsedCookiesChanged' | 'PrefetchProxyNotAvailable' | 'PrefetchResponseUsed' | 'PrefetchSuccessfulButNotUsed' | 'PrefetchNotUsedProbeFailed';

    /**
     * Information of headers to be displayed when the header mismatch occurred.
     */
    export interface PrerenderMismatchedHeaders {
      headerName: string;

      initialValue?: string;

      activationValue?: string;
    }
  }

  /**
   * Methods and events of the 'FedCm' domain.
   */
  export interface FedCmApi {
    requests: {
      enable: { params: FedCm.EnableParams, result: FedCm.EnableResult }

      disable: { params: FedCm.DisableParams, result: FedCm.DisableResult }

      selectAccount: { params: FedCm.SelectAccountParams, result: FedCm.SelectAccountResult }

      clickDialogButton: { params: FedCm.ClickDialogButtonParams, result: FedCm.ClickDialogButtonResult }

      dismissDialog: { params: FedCm.DismissDialogParams, result: FedCm.DismissDialogResult }

      /**
       * Resets the cooldown time, if any, to allow the next FedCM call to show
       * a dialog even if one was recently dismissed by the user.
       */
      resetCooldown: { params: FedCm.ResetCooldownParams, result: FedCm.ResetCooldownResult }
    };
    events: {

      dialogShown: { params: FedCm.DialogShownEvent };

      /**
       * Triggered when a dialog is closed, either by user action, JS abort,
       * or a command below.
       */
      dialogClosed: { params: FedCm.DialogClosedEvent };
    };
  }

  /**
   * Types of the 'FedCm' domain.
   */
  export namespace FedCm {
    /**
     * Parameters of the 'FedCm.enable' method.
     */
    export interface EnableParams {
      /**
       * Allows callers to disable the promise rejection delay that would
       * normally happen, if this is unimportant to what's being tested.
       * (step 4 of https://fedidcg.github.io/FedCM/#browser-api-rp-sign-in)
       */
      disableRejectionDelay?: boolean;
    }

    /**
     * Return value of the 'FedCm.enable' method.
     */
    export interface EnableResult {
    }

    /**
     * Parameters of the 'FedCm.disable' method.
     */
    export interface DisableParams {
    }

    /**
     * Return value of the 'FedCm.disable' method.
     */
    export interface DisableResult {
    }

    /**
     * Parameters of the 'FedCm.selectAccount' method.
     */
    export interface SelectAccountParams {
      dialogId: string;

      accountIndex: integer;
    }

    /**
     * Return value of the 'FedCm.selectAccount' method.
     */
    export interface SelectAccountResult {
    }

    /**
     * Parameters of the 'FedCm.clickDialogButton' method.
     */
    export interface ClickDialogButtonParams {
      dialogId: string;

      dialogButton: DialogButton;
    }

    /**
     * Return value of the 'FedCm.clickDialogButton' method.
     */
    export interface ClickDialogButtonResult {
    }

    /**
     * Parameters of the 'FedCm.dismissDialog' method.
     */
    export interface DismissDialogParams {
      dialogId: string;

      triggerCooldown?: boolean;
    }

    /**
     * Return value of the 'FedCm.dismissDialog' method.
     */
    export interface DismissDialogResult {
    }

    /**
     * Parameters of the 'FedCm.resetCooldown' method.
     */
    export interface ResetCooldownParams {
    }

    /**
     * Return value of the 'FedCm.resetCooldown' method.
     */
    export interface ResetCooldownResult {
    }

    /**
     * Parameters of the 'FedCm.dialogShown' event.
     */
    export interface DialogShownEvent {
      dialogId: string;

      dialogType: DialogType;

      accounts: Account[];

      /**
       * These exist primarily so that the caller can verify the
       * RP context was used appropriately.
       */
      title: string;

      subtitle?: string;
    }

    /**
     * Parameters of the 'FedCm.dialogClosed' event.
     */
    export interface DialogClosedEvent {
      dialogId: string;
    }

    /**
     * Whether this is a sign-up or sign-in action for this account, i.e.
     * whether this account has ever been used to sign in to this RP before.
     */
    export type LoginState = 'SignIn' | 'SignUp';

    /**
     * The types of FedCM dialogs.
     */
    export type DialogType = 'AccountChooser' | 'AutoReauthn' | 'ConfirmIdpLogin' | 'Error';

    /**
     * The buttons on the FedCM dialog.
     */
    export type DialogButton = 'ConfirmIdpLoginContinue' | 'ErrorGotIt' | 'ErrorMoreDetails';

    /**
     * Corresponds to IdentityRequestAccount
     */
    export interface Account {
      accountId: string;

      email: string;

      name: string;

      givenName: string;

      pictureUrl: string;

      idpConfigUrl: string;

      idpLoginUrl: string;

      loginState: LoginState;

      /**
       * These two are only set if the loginState is signUp
       */
      termsOfServiceUrl?: string;

      privacyPolicyUrl?: string;
    }
  }
}