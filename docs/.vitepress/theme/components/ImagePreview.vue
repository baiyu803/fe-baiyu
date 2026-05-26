<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type PreviewState = {
  src: string
  alt: string
}

const preview = ref<PreviewState | null>(null)
const previewImageRef = ref<HTMLImageElement | null>(null)

const isOpen = computed(() => Boolean(preview.value))

const getPreviewTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) {
    return null
  }

  const image = target.closest('.vp-doc img')
  if (!(image instanceof HTMLImageElement)) {
    return null
  }

  if (!image.currentSrc && !image.src) {
    return null
  }

  return image
}

const openPreview = (image: HTMLImageElement) => {
  preview.value = {
    src: image.currentSrc || image.src,
    alt: image.alt || '图片预览'
  }
}

const closePreview = () => {
  preview.value = null
}

const handleDocumentClick = (event: MouseEvent) => {
  const image = getPreviewTarget(event.target)
  if (!image) {
    return
  }

  event.preventDefault()
  event.stopPropagation()
  openPreview(image)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closePreview()
  }
}

watch(isOpen, (open) => {
  if (typeof document === 'undefined') {
    return
  }

  document.body.style.overflow = open ? 'hidden' : ''

  if (open) {
    requestAnimationFrame(() => {
      previewImageRef.value?.focus()
    })
  }
})

onMounted(() => {
  document.addEventListener('click', handleDocumentClick, true)
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick, true)
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="image-preview-fade">
      <div
        v-if="preview"
        class="image-preview"
        role="dialog"
        aria-modal="true"
        :aria-label="preview.alt"
        @click.self="closePreview"
      >
        <button
          class="image-preview__close"
          type="button"
          aria-label="关闭图片预览"
          @click="closePreview"
        >
          ×
        </button>

        <figure class="image-preview__figure">
          <img
            ref="previewImageRef"
            class="image-preview__image"
            :src="preview.src"
            :alt="preview.alt"
            tabindex="-1"
          />
          <figcaption
            v-if="preview.alt && preview.alt !== '图片预览'"
            class="image-preview__caption"
          >
            {{ preview.alt }}
          </figcaption>
        </figure>
      </div>
    </Transition>
  </Teleport>
</template>
