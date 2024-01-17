import type { BaseWindowImpl } from './window';

export function createConsole(nativeConsole: Console, window: BaseWindowImpl): Console {
  const cdpImpl = window._cdpImplementation;
  return {
    Console: nativeConsole.Console,
    assert(value: any, message?: string, ...optionalParams: any[]): void {
      nativeConsole.assert(value, message, ...optionalParams);
    },
    clear(): void {
      nativeConsole.clear();
    },
    count(label?: string): void {
      nativeConsole.count(label);
    },
    countReset(label?: string): void {
      nativeConsole.countReset(label);
    },
    debug(message?: any, ...optionalParams: any[]): void {
      cdpImpl?.writeLogEntry('verbose', message, optionalParams, 'javascript');
      nativeConsole.debug(message, ...optionalParams);
    },
    dir(value?: any, ...optionalParams: any[]): void {
      nativeConsole.dir(value, ...optionalParams);
    },
    dirxml(value: any): void {
      nativeConsole.dirxml(value);
    },
    error(message?: any, ...optionalParams: any[]): void {
      cdpImpl?.writeLogEntry('verbose', message, optionalParams, 'javascript');
      nativeConsole.error(message, ...optionalParams);
    },
    group(...label: any[]): void {
      nativeConsole.group(...label);
    },
    groupCollapsed(...label: any[]): void {
      nativeConsole.groupCollapsed(...label);
    },
    groupEnd(): void {
      nativeConsole.groupEnd();
    },
    info(message?: any, ...optionalParams: any[]): void {
      cdpImpl?.writeLogEntry('info', message, optionalParams, 'javascript');
      nativeConsole.info(message, ...optionalParams);
    },
    log(message?: any, ...optionalParams: any[]): void {
      cdpImpl?.writeLogEntry('info', message, optionalParams, 'javascript');
      nativeConsole.log(message, ...optionalParams);
    },
    table(tabularData: any, properties?: string[]): void {
      nativeConsole.table(tabularData, properties);
    },
    time(label?: string): void {
      nativeConsole.time(label);
    },
    timeEnd(label?: string): void {
      nativeConsole.timeEnd(label);
    },
    timeLog(label?: string, ...data: any[]): void {
      nativeConsole.timeLog(label, ...data);
    },
    trace(message?: any, ...optionalParams: any[]): void {
      nativeConsole.trace(message, ...optionalParams);
    },
    warn(message?: any, ...optionalParams: any[]): void {
      cdpImpl?.writeLogEntry('warning', message, optionalParams, 'javascript');
      nativeConsole.warn(message, ...optionalParams);
    },
    profile(reportName?: string): void {
      nativeConsole.profile(reportName);
    },
    profileEnd(): void {
      nativeConsole.profileEnd();
    },
    timeStamp(label?: string): void {
      nativeConsole.timeStamp(label);
    },
  };
}