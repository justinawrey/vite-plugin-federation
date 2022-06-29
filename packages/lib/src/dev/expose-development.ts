import { parseExposeOptions } from '../utils'
import { parsedOptions } from '../public'
import type { VitePluginFederationOptions } from 'types'
import type { PluginHooks } from '../../types/pluginHooks'

export function devExposePlugin(
  options: VitePluginFederationOptions
): PluginHooks {
  let myOptions = parseExposeOptions(options)
  parsedOptions.devExpose = myOptions

  console.log(myOptions)

  return {
    name: 'originjs:expose-development',

    configureServer(server) {
      return () => {
        server.middlewares.use('/remoteEntry.js', (req, res, next) => {
          res.end('okay doneeeee')
          next()
        })
      }
    }
  }
}
