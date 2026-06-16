import { cache } from 'react'

import { fetchSanity } from '@/lib/sanityClient'
import {
  DEFAULT_FORM_LABELS,
  DEFAULT_ORDER_VALUE_OPTIONS,
  DEFAULT_PAYMENT_METHOD_OPTIONS,
  DEFAULT_PRODUCT_INTERESTS,
} from '@/lib/wholesale/formSchema'

export type FormLabel = {
  businessNameLabel: string
  businessNameHelp: string
  contactNameLabel: string
  contactNameHelp: string
  emailLabel: string
  emailHelp: string
  phoneLabel: string
  phoneHelp: string
  countryStateLabel: string
  countryStateHelp: string
  productInterestsLabel: string
  productInterestsHelp: string
  orderValueLabel: string
  orderValueHelp: string
  paymentMethodLabel: string
  paymentMethodHelp: string
  notesLabel: string
  notesHelp: string
  submitButtonText: string
}

export type OrderValueOption = {
  rangeLabel: string
  rangeValue: string
  sortOrder: number
}

export type PaymentMethodOption = {
  label: string
  methodValue: string
  helpText?: string
  sortOrder: number
}

export type ProductInterestCategory = {
  _id: string
  _type: 'category'
  name: string
  slug: { current: string }
  group: string
}

export type WholesaleFormConfigData = {
  _id: string
  productInterestCategories: ProductInterestCategory[]
  estimatedOrderValues: OrderValueOption[]
  paymentMethods: PaymentMethodOption[]
  formLabels: FormLabel
}

export type WholesaleFormClientConfig = {
  productInterests: Array<{ value: string; label: string }>
  estimatedOrderValues: Array<{ rangeLabel: string; rangeValue: string; sortOrder: number }>
  paymentMethods: Array<{ label: string; methodValue: string; helpText?: string; sortOrder: number }>
  formLabels: Record<string, string>
}

function sanitizeBusinessNameLabel(value: string | undefined, fallback: string) {
  const source = value?.trim() || fallback
  const withoutTestSuffix = source.replace(/\s*test\s*$/i, "").trim()
  if (/^bussiness\s+name$/i.test(withoutTestSuffix)) {
    return "Business Name"
  }
  return withoutTestSuffix || fallback
}

const FORM_CONFIG_QUERY = `
  *[_type == "wholesaleFormConfig"][0] {
    _id,
    productInterestCategories[] -> {
      _id,
      _type,
      name,
      slug,
      group
    },
    estimatedOrderValues[] {
      rangeLabel,
      rangeValue,
      sortOrder
    },
    paymentMethods[] {
      label,
      methodValue,
      helpText,
      sortOrder
    },
    formLabels {
      businessNameLabel,
      businessNameHelp,
      contactNameLabel,
      contactNameHelp,
      emailLabel,
      emailHelp,
      phoneLabel,
      phoneHelp,
      countryStateLabel,
      countryStateHelp,
      productInterestsLabel,
      productInterestsHelp,
      orderValueLabel,
      orderValueHelp,
      paymentMethodLabel,
      paymentMethodHelp,
      notesLabel,
      notesHelp,
      submitButtonText
    }
  }
`

export const getWholesaleFormConfig = cache(async (): Promise<WholesaleFormConfigData | null> => {
  try {
    return await fetchSanity<WholesaleFormConfigData>(FORM_CONFIG_QUERY)
  } catch (error) {
    console.error('Error fetching wholesale form config:', error)
    return null
  }
})

// Helper to get sorted options
export function getSortedOrderValues(options: OrderValueOption[]): OrderValueOption[] {
  return [...options].sort((a, b) => a.sortOrder - b.sortOrder)
}

export function getSortedPaymentMethods(methods: PaymentMethodOption[]): PaymentMethodOption[] {
  return [...methods].sort((a, b) => a.sortOrder - b.sortOrder)
}

export function getDefaultWholesaleFormClientConfig(): WholesaleFormClientConfig {
  return {
    productInterests: [...DEFAULT_PRODUCT_INTERESTS],
    estimatedOrderValues: DEFAULT_ORDER_VALUE_OPTIONS.map((opt, idx) => ({
      rangeLabel: opt.label,
      rangeValue: opt.value,
      sortOrder: idx,
    })),
    paymentMethods: DEFAULT_PAYMENT_METHOD_OPTIONS.map((opt, idx) => ({
      label: opt.label,
      methodValue: opt.value,
      helpText: undefined,
      sortOrder: idx,
    })),
    formLabels: {...DEFAULT_FORM_LABELS},
  }
}

export function toWholesaleFormClientConfig(data: WholesaleFormConfigData | null): WholesaleFormClientConfig {
  const fallback = getDefaultWholesaleFormClientConfig()
  if (!data) {
    return fallback
  }

  const formLabels = data.formLabels ? {...fallback.formLabels, ...data.formLabels} : {...fallback.formLabels}
  formLabels.businessNameLabel = sanitizeBusinessNameLabel(
    formLabels.businessNameLabel,
    fallback.formLabels.businessNameLabel,
  )

  const rawInterests = data.productInterestCategories?.map((cat) => ({
    value: cat._id,
    label: cat.name,
  })) ?? fallback.productInterests

  const seenValues = new Set<string>()
  const seenLabels = new Set<string>()
  const productInterests = rawInterests.filter((item) => {
    if (!item.value || !item.label) return false
    const valKey = item.value.toLowerCase().trim()
    const lblKey = item.label.toLowerCase().trim()
    if (seenValues.has(valKey) || seenLabels.has(lblKey)) return false
    seenValues.add(valKey)
    seenLabels.add(lblKey)
    return true
  })

  return {
    productInterests,
    estimatedOrderValues:
      data.estimatedOrderValues && data.estimatedOrderValues.length > 0
        ? getSortedOrderValues(data.estimatedOrderValues)
        : fallback.estimatedOrderValues,
    paymentMethods:
      data.paymentMethods && data.paymentMethods.length > 0
        ? getSortedPaymentMethods(data.paymentMethods)
        : fallback.paymentMethods,
    formLabels,
  }
}

export const getWholesaleFormClientConfig = cache(async (): Promise<WholesaleFormClientConfig> => {
  const raw = await getWholesaleFormConfig()
  return toWholesaleFormClientConfig(raw)
})
