import { html, nothing } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import { SpectreBaseElement } from '../../utils/base'
import { normalizeInt } from '../../utils/form'
import { renderIcon } from '../../utils/icons'
import { applyPartClasses } from '../../utils/parts'
import { ProjectionController } from '../../utils/projection'

import {
  getCarouselCaptionClasses,
  getCarouselClasses,
  getCarouselControlClasses,
  getCarouselIndicatorClasses,
  getCarouselIndicatorsClasses,
  getCarouselSlideClasses,
  getCarouselViewportClasses
} from '@phcdevworks/spectre-ui'

export interface SpectreCarouselProps {
  ariaLabel?: string | null
  ariaLabelledBy?: string | null
  fade?: boolean | undefined
  hideControls?: boolean | undefined
  hideIndicators?: boolean | undefined
  id?: string | null | undefined
  index?: number | undefined
  loop?: boolean | undefined
  nextLabel?: string | undefined
  previousLabel?: string | undefined
  title?: string | null | undefined
}

export class SpectreCarouselElement
  extends SpectreBaseElement
  implements SpectreCarouselProps
{
  static properties = {
    fade: { type: Boolean, reflect: true },
    hideControls: { attribute: 'hide-controls', type: Boolean, reflect: true },
    hideIndicators: {
      attribute: 'hide-indicators',
      type: Boolean,
      reflect: true
    },
    index: { type: Number, reflect: true },
    loop: { type: Boolean, reflect: true },
    nextLabel: { attribute: 'next-label', type: String },
    previousLabel: { attribute: 'previous-label', type: String }
  }

  fade: boolean | undefined = false
  hideControls: boolean | undefined = false
  hideIndicators: boolean | undefined = false
  index: number | undefined = 0
  loop: boolean | undefined = false
  nextLabel: string | undefined = 'Next slide'
  previousLabel: string | undefined = 'Previous slide'

  private indexFromScroll = false
  private readonly projection = new ProjectionController(this, [
    'data-sp-carousel-native'
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
    if (changedProperties.has('fade') && this.fade == null) {
      this.fade = false
    }
    if (changedProperties.has('hideControls') && this.hideControls == null) {
      this.hideControls = false
    }
    if (
      changedProperties.has('hideIndicators') &&
      this.hideIndicators == null
    ) {
      this.hideIndicators = false
    }
    if (changedProperties.has('index')) {
      this.index = normalizeInt(this.index, 0)
    }
    if (changedProperties.has('loop') && this.loop == null) {
      this.loop = false
    }
    if (changedProperties.has('nextLabel') && !this.nextLabel) {
      this.nextLabel = 'Next slide'
    }
    if (changedProperties.has('previousLabel') && !this.previousLabel) {
      this.previousLabel = 'Previous slide'
    }
  }

  protected override updated(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    super.updated(changedProperties)
    this.slides.forEach((slide) => {
      applyPartClasses(slide.querySelectorAll('[slot]'), {
        caption: getCarouselCaptionClasses()
      })
    })
    const scrolledByUser = this.indexFromScroll
    this.indexFromScroll = false
    if (this.fade || scrolledByUser || !changedProperties.has('index')) {
      return
    }
    const slide = this.slideWrappers[this.activeIndex]
    if (slide && typeof this.viewport?.scrollTo === 'function') {
      this.viewport.scrollTo({ left: slide.offsetLeft })
    }
  }

  private get slides(): Element[] {
    return this.projection.elements()
  }

  private get activeIndex(): number {
    const last = this.slides.length - 1
    return Math.max(0, Math.min(this.index ?? 0, last))
  }

  private get viewport(): HTMLElement | null {
    return this.querySelector('[data-sp-carousel-viewport]')
  }

  private get slideWrappers(): HTMLElement[] {
    const viewport = this.viewport
    if (!viewport) {
      return []
    }
    return Array.from(viewport.children).filter((child): child is HTMLElement =>
      child.hasAttribute('data-sp-carousel-slide')
    )
  }

  private goTo(target: number): void {
    const count = this.slides.length
    if (count === 0) {
      return
    }
    let next = target
    if (this.loop) {
      next = ((target % count) + count) % count
    } else if (target < 0 || target >= count) {
      return
    }
    if (next === this.activeIndex) {
      return
    }
    this.index = next
    this.dispatchEvent(
      new CustomEvent('sp-change', { bubbles: true, detail: { index: next } })
    )
  }

  private handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      this.goTo(this.activeIndex - 1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      this.goTo(this.activeIndex + 1)
    }
  }

  // Native swipes and scroll-snap move the viewport directly; follow them so
  // the indicators and controls stay in sync.
  private handleScroll = (event: Event): void => {
    const viewport = event.currentTarget as HTMLElement
    if (this.fade || viewport.clientWidth === 0) {
      return
    }
    const target = Math.round(viewport.scrollLeft / viewport.clientWidth)
    if (target === this.activeIndex || target >= this.slides.length) {
      return
    }
    this.indexFromScroll = true
    this.index = target
    this.dispatchEvent(
      new CustomEvent('sp-change', { bubbles: true, detail: { index: target } })
    )
  }

  private get regionLabel(): string | undefined {
    if (this.forwardedAriaLabel) {
      return this.forwardedAriaLabel
    }
    return this.forwardedAriaLabelledBy ? undefined : 'Carousel'
  }

  override render() {
    const slides = this.slides
    const count = slides.length
    const active = this.activeIndex
    const loop = this.loop ?? false

    return html`<div
      aria-label="${ifDefined(this.regionLabel)}"
      aria-labelledby="${ifDefined(this.forwardedAriaLabelledBy)}"
      aria-roledescription="carousel"
      class="${getCarouselClasses({ fade: this.fade ?? false })}"
      data-sp-carousel-native
      id="${ifDefined(this.id || undefined)}"
      role="region"
      title="${ifDefined(this.title || undefined)}"
      @keydown="${this.handleKeydown}"
    >
      <div
        aria-live="polite"
        class="${getCarouselViewportClasses()}"
        data-sp-carousel-viewport
        @scroll="${this.handleScroll}"
      >
        ${slides.map(
          (slide, index) =>
            html`<div
              aria-label="${index + 1} of ${count}"
              aria-roledescription="slide"
              class="${getCarouselSlideClasses({ active: index === active })}"
              data-sp-carousel-slide
              role="group"
            >
              ${slide}
            </div>`
        )}
      </div>
      ${
        !this.hideControls && count > 1
          ? html`<button
                aria-label="${this.previousLabel ?? 'Previous slide'}"
                class="${getCarouselControlClasses({ direction: 'prev' })}"
                data-sp-carousel-prev
                ?disabled="${!loop && active === 0}"
                type="button"
                @click="${() => this.goTo(active - 1)}"
              >
                ${renderIcon('chevronLeft', 'sp-icon-md')}
              </button>
              <button
                aria-label="${this.nextLabel ?? 'Next slide'}"
                class="${getCarouselControlClasses({ direction: 'next' })}"
                data-sp-carousel-next
                ?disabled="${!loop && active === count - 1}"
                type="button"
                @click="${() => this.goTo(active + 1)}"
              >
                ${renderIcon('chevronRight', 'sp-icon-md')}
              </button>`
          : nothing
      }
      ${
        !this.hideIndicators && count > 1
          ? html`<div class="${getCarouselIndicatorsClasses()}">
              ${slides.map(
                (_, index) =>
                  html`<button
                    aria-current="${ifDefined(
                      index === active ? 'true' : undefined
                    )}"
                    aria-label="Go to slide ${index + 1}"
                    class="${getCarouselIndicatorClasses({
                      active: index === active
                    })}"
                    data-sp-carousel-indicator
                    type="button"
                    @click="${() => this.goTo(index)}"
                  ></button>`
              )}
            </div>`
          : nothing
      }
    </div>`
  }
}

export function defineSpectreCarousel(
  tagName = 'sp-carousel'
): typeof SpectreCarouselElement {
  const existingElement = customElements.get(tagName)

  if (existingElement) {
    return existingElement as unknown as typeof SpectreCarouselElement
  }

  customElements.define(tagName, SpectreCarouselElement)
  return SpectreCarouselElement
}
