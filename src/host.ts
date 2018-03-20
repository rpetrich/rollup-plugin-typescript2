import { tsModule } from "./tsproxy";
import * as tsTypes from "typescript";
import * as _ from "lodash";
import { normalize } from "./normalize";
import { FileExistsHook, ReadFileHook } from "./ioptions";

export class LanguageServiceHost implements tsTypes.LanguageServiceHost
{
	private cwd = process.cwd();
	private snapshots: { [fileName: string]: tsTypes.IScriptSnapshot } = {};
	private versions: { [fileName: string]: number } = {};

	constructor(private parsedConfig: tsTypes.ParsedCommandLine, private fileExistsHook: FileExistsHook, private readFileHook: ReadFileHook)
	{
	}

	public reset()
	{
		this.snapshots = {};
		this.versions = {};
	}

	public setSnapshot(fileName: string, data: string): tsTypes.IScriptSnapshot
	{
		fileName = normalize(fileName);

		const snapshot = tsModule.ScriptSnapshot.fromString(data);
		this.snapshots[fileName] = snapshot;
		this.versions[fileName] = (this.versions[fileName] || 0) + 1;
		return snapshot;
	}

	public getScriptSnapshot(fileName: string): tsTypes.IScriptSnapshot | undefined
	{
		fileName = normalize(fileName);

		if (_.has(this.snapshots, fileName))
			return this.snapshots[fileName];

		if (this.fileExists(fileName))
		{
			this.snapshots[fileName] = tsModule.ScriptSnapshot.fromString(this.readFile(fileName)!);
			this.versions[fileName] = (this.versions[fileName] || 0) + 1;
			return this.snapshots[fileName];
		}

		return undefined;
	}

	public getCurrentDirectory()
	{
		return this.cwd;
	}

	public getScriptVersion(fileName: string)
	{
		fileName = normalize(fileName);

		return (this.versions[fileName] || 0).toString();
	}

	public getScriptFileNames()
	{
		return this.parsedConfig.fileNames;
	}

	public getCompilationSettings(): tsTypes.CompilerOptions
	{
		return this.parsedConfig.options;
	}

	public getDefaultLibFileName(opts: tsTypes.CompilerOptions)
	{
		return tsModule.getDefaultLibFilePath(opts);
	}

	public useCaseSensitiveFileNames(): boolean
	{
		return tsModule.sys.useCaseSensitiveFileNames;
	}

	public readDirectory(path: string, extensions?: string[], exclude?: string[], include?: string[]): string[]
	{
		return tsModule.sys.readDirectory(path, extensions, exclude, include);
	}

	public readFile(path: string, encoding?: string): string | undefined
	{
		const result = this.readFileHook(path);
		if (typeof result == "string") {
			return result;
		}
		return tsModule.sys.readFile(path, encoding);
	}

	public fileExists(path: string): boolean
	{
		return this.fileExistsHook(path) || tsModule.sys.fileExists(path);
	}

	public getTypeRootsVersion(): number
	{
		return 0;
	}

	public directoryExists(directoryName: string): boolean
	{
		return tsModule.sys.directoryExists(directoryName);
	}

	public getDirectories(directoryName: string): string[]
	{
		return tsModule.sys.getDirectories(directoryName);
	}
}
