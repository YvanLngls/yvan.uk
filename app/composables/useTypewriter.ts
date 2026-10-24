import { ref, watch, onMounted, onUnmounted, type ComputedRef } from 'vue'

// Effet « machine à écrire » réutilisable.
// Retape le texte quand la source change (ex: bascule de langue) et nettoie
// son timer au démontage de la page.
export const useTypewriter = (fullText: ComputedRef<string>, speed = 30) => {
  const displayedText = ref('')
  const isDone = ref(false)
  let timer: ReturnType<typeof setInterval> | null = null

  const type = () => {
    if (timer) clearInterval(timer)

    displayedText.value = ''
    isDone.value = false
    let i = 0

    timer = setInterval(() => {
      if (i < fullText.value.length) {
        displayedText.value += fullText.value.charAt(i)
        i++
      } else {
        if (timer) clearInterval(timer)
        isDone.value = true
      }
    }, speed)
  }

  onMounted(type)
  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  // fullText est typiquement une computed sur t() : elle se recharge quand la locale change
  watch(fullText, () => type())

  return { displayedText, isDone }
}
