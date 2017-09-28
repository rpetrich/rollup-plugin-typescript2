# rollup-plugin-typescript2

[![npm-version](https://img.shields.io/npm/v/rollup-plugin-typescript2.svg?maxAge=2592000)](https://npmjs.org/package/rollup-plugin-typescript2)
![npm-dependencies](https://img.shields.io/david/ezolenko/rollup-plugin-typescript2.svg?maxAge=2592000)
![npm-monthly-downloads](https://img.shields.io/npm/dm/rollup-plugin-typescript2.svg?maxAge=2592000)
[![Codeship Status](https://app.codeship.com/projects/fe9cf8f0-e8d4-0134-ec88-4e3d33dcd7ed/status?branch=master)](https://app.codeship.com/projects/207445)

Rollup plugin for typescript with compiler errors.

This is a rewrite of original rollup-plugin-typescript, starting and borrowing from [this fork](https://github.com/alexlur/rollup-plugin-typescript).

This version is somewhat slower than original, but it will print out typescript syntactic and semantic diagnostic messages (the main reason for using typescript after all).

## Usage

```js
// rollup.config.js
import typescript from 'rollup-plugin-typescript2';

export default {
	entry: './main.ts',

	plugins: [
		typescript(/*{ plugin options }*/)
	]
}
```

The plugin inherits all compiler options and file lists from your `tsconfig.json` file. If your tsconfig has another name or another relative path from the root directory, see `tsconfig` and `tsconfigOverride` options below. This also allows for passing in different tsconfig files depending on your build target.

The following compiler options are forced though:

* `module`: `es2015`
* `noEmitHelpers`: true
* `importHelpers`: true
* `noResolve`: false
* `outDir`: `process.cwd()`
* `declarationDir`: `process.cwd()` (*only if `useTsconfigDeclarationDir` is false in the plugin options*)
* `moduleResolution`: `node` (*`classic` is [depreciated](https://www.typescriptlang.org/docs/handbook/module-resolution.html). It also breaks this plugin, see [#12](https://github.com/ezolenko/rollup-plugin-typescript2/issues/12) and [#14](https://github.com/ezolenko/rollup-plugin-typescript2/issues/14)*)

### Plugin options

* `tsconfig`: "tsconfig.json"

    Override this if your tsconfig has another name or relative location from the project directory.

* `tsconfigOverride`: `{}`

	The object passed as `tsconfigOverride` will be merged with loaded tsconfig before parsing. Hard overrides (see above) will be applied on top of that. Theoretically you can put everything you would put in tsconfig proper.

	```js
	const tsconfigOverride = { compilerOptions: { declaration: true } };

	// ...
	plugins: [
		typescript({ tsconfigOverride })
	]
	```

	This is a [deep merge](https://lodash.com/docs/4.17.4#merge) (objects are merged, arrays are concatenated, primitives are replaced, etc), increase verbosity to 3 and look for `parsed tsconfig` if you get something unexpected.

* `check`: true

	Set to false to avoid doing any diagnostic checks on the code.

* `verbosity`: 1

	- 0 -- Error
	- 1 -- Warning
	- 2 -- Info
	- 3 -- Debug

* `clean`: false

	Set to true for clean build (wipes out cache on every build).

* `cacheRoot`: ".rts2_cache"

	Path to cache.

* `include`: `[ "*.ts+(|x)", "**/*.ts+(|x)" ]`

	By default passes all .ts files through typescript compiler.

* `exclude`: `[ "*.d.ts", "**/*.d.ts" ]`

	But excludes type definitions.

* `abortOnError`: true

	Bail out on first syntactic or semantic error. In some cases setting this to false will result in exception in rollup itself (for example for unresolvable imports).

* `rollupCommonJSResolveHack`: false

	On windows typescript resolver favors POSIX path, while commonjs plugin (and maybe others?) uses native path as module id. This can result in `namedExports` being ignored if rollup happened to use typescript's resolution. Set to true to pass resolved module path through `resolve()` to match up with `rollup-plugin-commonjs`.

* `useTsconfigDeclarationDir`: false

	If true, declaration files will be emitted in the directory given in the tsconfig. If false, the declaration files will be placed inside the destination directory given in the Rollup configuration.

* `typescript`: typescript module installed with the plugin

	When typescript version installed by the plugin (latest 2.x) is unacceptable, you can import your own typescript module and pass it in as `typescript: require("typescript")`. Must be 2.0+, things might break if transpiler interfaces changed enough from what the plugin was built against.

* `transformers`: `undefined`

	**experimental**, typescript 2.4.1+

	Transformers will likely be available in tsconfig eventually, so this is not a stable interface, see [Microsoft/TypeScript/issues/14419](https://github.com/Microsoft/TypeScript/issues/14419).

	For example, integrating [kimamula/ts-transformer-keys](https://github.com/kimamula/ts-transformer-keys):

	```js
	const keysTransformer = require('ts-transformer-keys/transformer').default;
	const transformers = (service) =>
	{
  		before: [ keysTransformer(service.getProgram()) ],
  		after: []
	};

	// ...
	plugins: [
		typescript({ transformers })
	]
	```

### Declarations

This plugin respects `declaration: true` in your `tsconfig.json` file. When set, it will emit `*.d.ts` files for your bundle. The resulting file(s) can then be used with the `types` property in your `package.json` file as described [here](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html).
By default, the declaration files will be located in the same directory as the generated Rollup bundle. If you want to override this behavior and instead use the declarationDir set `useTsconfigDeclarationDir` to `true` in the plugin options.

### Watch mode

The way typescript handles type-only imports and ambient types effectively hides them from rollup watch, because import statements are not generated and changing them doesn't trigger a rebuild.

Otherwise the plugin should work in watch mode. Make sure to run a normal build after watch session to catch any type errors.

### Version

This plugin currently requires TypeScript `2.0+`.

### Rollup version

Tested on rollup `0.50.0`.

### Reporting bugs

Report any bugs on github: <https://github.com/ezolenko/rollup-plugin-typescript2/issues>.

Attach your `tsconfig.json`, `package.json` (for versions of dependencies), rollup script and anything else that could influence module resolution, ambient types and typescript compilation.

Check if problem is reproducible after running `npm prune` to clear any rogue types from npm_modules (by default typescript grabs all ambient types).

Check if you get the same problem with `clean` option set to true (might indicate a bug in the cache).

If makes sense, check if running `tsc` directly produces similar results.

Attach plugin output with `verbosity` option set to 3 (this will list all files being transpiled and their imports).
