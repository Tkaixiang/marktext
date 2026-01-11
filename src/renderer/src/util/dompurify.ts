import runSanitize from 'muya/lib/utils/dompurify'

export interface DOMPurifyConfig {
  FORBID_ATTR?: string[]
  ALLOW_DATA_ATTR?: boolean
  ADD_ATTR?: string[]
  USE_PROFILES?: {
    html?: boolean
    svg?: boolean
    svgFilters?: boolean
    mathMl?: boolean
  }
  RETURN_TRUSTED_TYPE?: boolean
  ALLOWED_URI_REGEXP?: RegExp
}

export const PREVIEW_DOMPURIFY_CONFIG: Readonly<DOMPurifyConfig> = Object.freeze({
  FORBID_ATTR: ['style', 'contenteditable'],
  ALLOW_DATA_ATTR: false,
  USE_PROFILES: {
    html: true,
    svg: true,
    svgFilters: true,
    mathMl: false
  },
  RETURN_TRUSTED_TYPE: false
})

export const EXPORT_DOMPURIFY_CONFIG: Readonly<DOMPurifyConfig> = Object.freeze({
  FORBID_ATTR: ['contenteditable'],
  ALLOW_DATA_ATTR: false,
  ADD_ATTR: ['data-align'],
  USE_PROFILES: {
    html: true,
    svg: true,
    svgFilters: true,
    mathMl: false
  },
  RETURN_TRUSTED_TYPE: false,
  // Allow "file" protocol to export images on Windows (#1997).
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|file):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i // eslint-disable-line no-useless-escape
})

export const sanitize = (html: string, purifyOptions?: DOMPurifyConfig): string => {
  return runSanitize(html, purifyOptions)
}
