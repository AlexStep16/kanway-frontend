import { ModelsEnum } from '~/enums/ModelsEnum'
import { ProModelsEnum } from '~/enums/ProModelsEnum'

export type ModelProvider = 'chatgpt' | 'gemini'

export interface IAIModelOption {
  value: ModelsEnum
  label: string
  provider: ModelProvider
  /** How smart the model is — rendered as this many "brain" icons (1–5) */
  smart: number
  /** Text label shown after the brain icons */
  smartLabel: string
  /** Speed of generation — rendered as this many "zap" icons (1–5) */
  fast: number
  /** Text label shown after the zap icons */
  fastLabel: string
  cost: string
  isPro: boolean
}

const isProModel = (value: ModelsEnum): boolean =>
  (Object.values(ProModelsEnum) as string[]).includes(value)

const AI_MODEL_BASE_OPTIONS: Omit<IAIModelOption, 'isPro'>[] = [
  {
    value: ModelsEnum.GPT_5_6_LUNA,
    label: 'GPT-5.6 Luna',
    provider: 'chatgpt',
    smart: 2,
    smartLabel: 'Низкий',
    fast: 5,
    fastLabel: 'Быстрый',
    cost: 'x0.3',
  },
  {
    value: ModelsEnum.GPT_5_4_NANO,
    label: 'GPT-5.4 Nano',
    provider: 'chatgpt',
    smart: 2,
    smartLabel: 'Низкий',
    fast: 5,
    fastLabel: 'Быстрый',
    cost: 'x0.3',
  },
  {
    value: ModelsEnum.GPT_5_4_MINI,
    label: 'GPT-5.4 Mini',
    provider: 'chatgpt',
    smart: 3,
    smartLabel: 'Средний',
    fast: 4,
    fastLabel: 'Быстрый',
    cost: 'x1',
  },
  {
    value: ModelsEnum.GPT_5_4,
    label: 'GPT-5.4',
    provider: 'chatgpt',
    smart: 4,
    smartLabel: 'Высокий',
    fast: 3,
    fastLabel: 'Средний',
    cost: 'x3.5',
  },
  {
    value: ModelsEnum.GPT_5_5,
    label: 'GPT-5.5',
    provider: 'chatgpt',
    smart: 5,
    smartLabel: 'Высокий',
    fast: 2,
    fastLabel: 'Медленный',
    cost: 'x6.5',
  },
  {
    value: ModelsEnum.GEMINI_3_7_FLASH,
    label: 'Gemini 3.7 Flash',
    provider: 'gemini',
    smart: 3,
    smartLabel: 'Средний',
    fast: 5,
    fastLabel: 'Быстрый',
    cost: 'x1',
  },
  {
    value: ModelsEnum.GEMINI_3_1_PRO_PREVIEW,
    label: 'Gemini 3.1 Pro',
    provider: 'gemini',
    smart: 4,
    smartLabel: 'Высокий',
    fast: 2,
    fastLabel: 'Медленный',
    cost: 'x3',
  },
]

export const AI_MODEL_OPTIONS: IAIModelOption[] = AI_MODEL_BASE_OPTIONS.map((option) => ({
  ...option,
  isPro: isProModel(option.value),
}))
