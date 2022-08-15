import { parseExposeOptions } from '../utils'
import { parsedOptions } from '../public'

import type { VitePluginFederationOptions } from 'types'
import type { PluginHooks } from '../../types/pluginHooks'

export function devExposePlugin(
  options: VitePluginFederationOptions
): PluginHooks {
  const myOptions = parseExposeOptions(options)
  parsedOptions.devExpose = myOptions
  console.log(myOptions)

  let moduleMap = ''
  for (const item of parsedOptions.devExpose) {
    moduleMap += `\n"${item[0]}":()=>{
      return __federation_import('${item[1].import}').then(module =>Object.keys(module).every(item => exportSet.has(item)) ? () => module.default : () => module)
    },`
  }

  const remoteEntry = `
      const exportSet = new Set(['Module', '__esModule', 'default', '_export_sfc']);
      let moduleMap = {${moduleMap}}
    const seen = {}
    async function __federation_import(name) {
        return import(name);
    };
    export const get =(module) => {
        return moduleMap[module]();
    };
    export const init =(shareScope) => {
      globalThis.__federation_shared__= globalThis.__federation_shared__|| {};
      Object.entries(shareScope).forEach(([key, value]) => {
        const versionKey = Object.keys(value)[0];
        const versionValue = Object.values(value)[0];
        const scope = versionValue.scope || 'default'
        globalThis.__federation_shared__[scope] = globalThis.__federation_shared__[scope] || {};
        const shared= globalThis.__federation_shared__[scope];
        (shared[key] = shared[key]||{})[versionKey] = versionValue;
      });
    }`

  // const item = remoteEntry
  // const filepathMap = new Map()
  // const getFilename = (name) => parse(parse(name).name).name
  // const cssBundlesMap: Map<string, OutputAsset | OutputChunk> = Object.keys(
  //   bundle
  // )
  //   .filter((name) => extname(name) === '.css')
  //   .reduce((res, name) => {
  //     const filename = getFilename(name)
  //     res.set(filename, bundle[name])
  //     return res
  //   }, new Map())
  // item.code = item.code.replace(
  //   new RegExp(`(["'])${DYNAMIC_LOADING_CSS_PREFIX}.*?\\1`, 'g'),
  //   (str) => {
  //     // when build.cssCodeSplit: false, all files are aggregated into style.xxxxxxxx.css
  //     if (viteConfigResolved && !viteConfigResolved.build.cssCodeSplit) {
  //       if (cssBundlesMap.size) {
  //         return `[${[...cssBundlesMap.values()]
  //           .map((cssBundle) => JSON.stringify(basename(cssBundle.fileName)))
  //           .join(',')}]`
  //       } else {
  //         return '[]'
  //       }
  //     }
  //     const filepath = str.slice((`'` + DYNAMIC_LOADING_CSS_PREFIX).length, -1)
  //     if (!filepath || !filepath.length) return str
  //     let fileBundle = filepathMap.get(filepath)
  //     if (!fileBundle) {
  //       fileBundle = Object.values(bundle).find(
  //         (b) => 'facadeModuleId' in b && b.facadeModuleId === filepath
  //       )
  //       if (fileBundle) filepathMap.set(filepath, fileBundle)
  //       else return str
  //     }
  //     const depCssFiles: Set<string> = new Set()
  //     const addDepCss = (bundleName) => {
  //       const filename = getFilename(bundleName)
  //       const cssBundle = cssBundlesMap.get(filename)
  //       if (cssBundle) {
  //         depCssFiles.add(cssBundle.fileName)
  //       }
  //       const theBundle = bundle[bundleName] as OutputChunk
  //       if (theBundle && theBundle.imports && theBundle.imports.length) {
  //         theBundle.imports.forEach((name) => addDepCss(name))
  //       }
  //     }
  //     ;[fileBundle.fileName, ...fileBundle.imports].forEach(addDepCss)
  //     return `[${[...depCssFiles]
  //       .map((d) => JSON.stringify(basename(d)))
  //       .join(',')}]`
  //   }
  // )

  // // remove all __f__dynamic_loading_css__ after replace
  // let ast: AcornNode | null = null
  // try {
  //   ast = this.parse(item.code)
  // } catch (err) {
  //   console.error(err)
  // }
  // if (!ast) {
  //   return
  // }
  // const magicString = new MagicString(item.code)
  // // let cssFunctionName: string = DYNAMIC_LOADING_CSS
  // walk(ast, {
  //   enter(node: any) {
  //     if (
  //       node &&
  //       node.type === 'CallExpression' &&
  //       typeof node.arguments[0]?.value === 'string' &&
  //       node.arguments[0]?.value.indexOf(`${DYNAMIC_LOADING_CSS_PREFIX}`) > -1
  //     ) {
  //       magicString.remove(node.start, node.end + 1)
  //     }
  //   }
  // })
  // item.code = magicString.toString()

  return {
    name: 'originjs:expose-development',

    configureServer(server) {
      return () => {
        server.middlewares.use('/remoteEntry.js', (req, res, next) => {
          res.setHeader('Content-Type', 'application/javascript')
          res.end(remoteEntry)
          next()
        })
      }
    }
  }
}
