import { tsModule } from "./tsproxy";
import * as ts from "typescript";
export declare type FileExistsHook = (path: string) => boolean;
export declare type ReadFileHook = (path: string) => string | void;
export interface IOptions {
    include: string | string[];
    exclude: string | string[];
    check: boolean;
    verbosity: number;
    clean: boolean;
    cacheRoot: string;
    abortOnError: boolean;
    rollupCommonJSResolveHack: boolean;
    tsconfig?: string;
    useTsconfigDeclarationDir: boolean;
    typescript: typeof tsModule;
    tsconfigOverride: any;
    tsconfigDefaults: any;
    sourceMapCallback: (id: string, map: string) => void;
    programCreated: (program: ts.Program) => void;
    readFileHook: ReadFileHook;
    fileExistsHook: FileExistsHook;
}
