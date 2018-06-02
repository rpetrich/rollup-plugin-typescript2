import { tsModule } from "./tsproxy";
import * as tsTypes from "typescript";

export interface ICustomTransformer
{
	before?: tsTypes.TransformerFactory<tsTypes.SourceFile>;
	after?: tsTypes.TransformerFactory<tsTypes.SourceFile>;
}

export type TransformerFactoryCreator = (ls: tsTypes.LanguageService) => tsTypes.CustomTransformers | ICustomTransformer;

export type FileExistsHook = (path: string) => boolean;
export type ReadFileHook = (path: string) => string | void;

export interface IOptions
{
	include: string|string[];
	exclude: string|string[];
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
	transformers: TransformerFactoryCreator[];
	tsconfigDefaults: any;
	sourceMapCallback: (id: string, map: string) => void;
	programCreated: (program: tsTypes.Program) => void;
	readFileHook: ReadFileHook;
	fileExistsHook: FileExistsHook;
}
