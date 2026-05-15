import { RuntimeConfig as UserRuntimeConfig, PublicRuntimeConfig as UserPublicRuntimeConfig } from 'nuxt/schema'
  interface SharedRuntimeConfig {
   app: {
      buildId: string,

      baseURL: string,

      buildAssetsDir: string,

      cdnURL: string,
   },

   nitro: {
      envPrefix: string,
   },

   icon: {
      serverKnownCssClasses: Array<any>,
   },

   content: {
      databaseVersion: string,

      version: string,

      database: {
         type: string,

         filename: string,
      },

      localDatabase: {
         type: string,

         filename: string,
      },

      integrityCheck: boolean,
   },
  }
  interface SharedPublicRuntimeConfig {
   motion: {
      directives: {
         "pop-in": {
            initial: {
               scale: number,

               opacity: number,
            },

            enter: {
               scale: number,

               opacity: number,
            },
         },
      },
   },

   mdc: {
      components: {
         prose: boolean,

         map: {
            accordion: string,

            "accordion-item": string,

            badge: string,

            callout: string,

            card: string,

            "card-group": string,

            caution: string,

            "code-collapse": string,

            "code-group": string,

            "code-icon": string,

            "code-preview": string,

            "code-tree": string,

            collapsible: string,

            field: string,

            "field-group": string,

            icon: string,

            kbd: string,

            note: string,

            prompt: string,

            steps: string,

            tabs: string,

            "tabs-item": string,

            tip: string,

            warning: string,
         },

         customElements: Array<any>,
      },

      headings: {
         anchorLinks: {
            h1: boolean,

            h2: boolean,

            h3: boolean,

            h4: boolean,

            h5: boolean,

            h6: boolean,
         },
      },

      highlight: {
         noApiRoute: boolean,

         theme: {
            light: string,

            default: string,

            dark: string,
         },

         highlighter: string,

         shikiEngine: string,

         langs: Array<string>,
      },
   },

   i18n: {
      baseUrl: string,

      defaultLocale: string,

      rootRedirect: any,

      redirectStatusCode: number,

      skipSettingLocaleOnNavigate: boolean,

      locales: Array<{

      }>,

      detectBrowserLanguage: boolean,

      experimental: {
         localeDetector: string,

         typedPages: boolean,

         typedOptionsAndMessages: boolean,

         alternateLinkCanonicalQueries: boolean,

         devCache: boolean,

         cacheLifetime: any,

         stripMessagesPayload: boolean,

         preload: boolean,

         strictSeo: boolean,

         nitroContextDetection: boolean,

         httpCacheDuration: number,

         compactRoutes: boolean,
      },

      domainLocales: {
         fr: {
            domain: string,
         },

         en: {
            domain: string,
         },
      },
   },

   content: {
      wsUrl: string,
   },
  }
declare module '@nuxt/schema' {
  interface RuntimeConfig extends UserRuntimeConfig {}
  interface PublicRuntimeConfig extends UserPublicRuntimeConfig {}
}
declare module 'nuxt/schema' {
  interface RuntimeConfig extends SharedRuntimeConfig {}
  interface PublicRuntimeConfig extends SharedPublicRuntimeConfig {}
}
declare module 'vue' {
        interface ComponentCustomProperties {
          $config: UserRuntimeConfig
        }
      }