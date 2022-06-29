import { parseExposeOptions } from '../utils'
import { parsedOptions } from '../public'
import type { VitePluginFederationOptions } from 'types'
import type { PluginHooks } from '../../types/pluginHooks'
import type { ViteDevServer } from '../../types/viteDevServer'

export function devExposePlugin(
  options: VitePluginFederationOptions
): PluginHooks {
  parsedOptions.devExpose = parseExposeOptions(options)

  return {
    name: 'originjs:expose-development',

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    configureServer(server: ViteDevServer) {}
  }
}
