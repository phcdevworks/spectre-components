import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import {
  isAccentEdge,
  isSpacingStep,
  type SpectreAccentEdge,
  type SpectreSpacingStep
} from '../../utils/form'
import { ProjectionController } from '../../utils/projection'

import {
  getCardBleedClasses,
  type CardBleedEdge,
  type CardBleedPaddingSize
} from '@phcdevworks/spectre-ui'

export interface SpectreCardBleedProps {
  edges?: string | undefined
  id?: string | null | undefined
  padded?: SpectreSpacingStep | undefined
  title?: string | null | undefined
}

// Media or a full-width band inside `sp-card` that runs flush through the
// card's padding on the chosen edges.
export class SpectreCardBleedElement
  extends SpectreBaseElement
  implements SpectreCardBleedProps
{
  static properties = {
    edges: { type: String, reflect: true },
    padded: { type: String, reflect: true }
  }

  edges: string | undefined = undefined
  padded: SpectreSpacingStep | undefined = undefined

  private readonly projection = new ProjectionController(this, [
    'data-sp-card-bleed-native'
  ])

  override get id(): string {
    return super.id
  }

  override set id(value: string | null | undefined) {
    super.id = value
  }

  override get title(): string {
    return super.title
  }

  override set title(value: string | null | undefined) {
    super.title = value
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.style.display ||= 'block'
  }

  protected override willUpdate(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    // A bare `padded` attribute means the card's default padding step.
    if (changedProperties.has('padded') && this.padded != null) {
      const padded = this.padded as string
      this.padded =
        padded === '' ? 'md' : isSpacingStep(padded) ? padded : undefined
    }
  }

  // `edges` is a space-separated list of edges, or `all`.
  private get bleedEdges(): CardBleedEdge[] | 'all' {
    const tokens = (this.edges ?? '').split(/\s+/).filter(Boolean)
    if (tokens.includes('all')) {
      return 'all'
    }
    return tokens.filter((token): token is SpectreAccentEdge =>
      isAccentEdge(token)
    ) as CardBleedEdge[]
  }

  override render() {
    return html`<div
      class="${getCardBleedClasses({
        edges: this.bleedEdges,
        ...(this.padded != null && {
          padded: this.padded as CardBleedPaddingSize
        })
      })}"
      data-sp-card-bleed-native
      id="${ifDefined(this.id || undefined)}"
      title="${ifDefined(this.title || undefined)}"
    >
      ${this.projection.nodes()}
    </div>`
  }
}

export function defineSpectreCardBleed(
  tagName = 'sp-card-bleed'
): typeof SpectreCardBleedElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreCardBleedElement
  }

  customElements.define(tagName, SpectreCardBleedElement)
  return SpectreCardBleedElement
}
