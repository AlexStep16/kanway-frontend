import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'
import * as zxcvbnRuPackage from '@zxcvbn-ts/language-ru'

const zxcvbnOptions = {
  translations: zxcvbnRuPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
    ...zxcvbnRuPackage.dictionary,
  },
}

export const zxcvbn = new ZxcvbnFactory(zxcvbnOptions)
