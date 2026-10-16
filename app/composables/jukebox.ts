export const useJukebox = () => {
  // On utilise useState pour que l'état soit partagé entre tous les composants
  const isPlaying = useState('jukebox-playing', () => false)
  const currentTrack = useState('jukebox-track', () => '/audio/plantasia.ogg')
  const audio = ref<HTMLAudioElement | null>(null)

  // Initialisation de l'audio (côté client uniquement)
  onMounted(() => {
    audio.value = new Audio(currentTrack.value)
    audio.value.loop = true
    
    // Si l'état dit que ça joue (ex: retour sur l'onglet), on synchronise
    if (isPlaying.value) audio.value.play()
    
  })

  const toggle = () => {
    if (!audio.value) return
    
    if (isPlaying.value) {
      audio.value.pause()
    } else {
      audio.value.play()
    }
    isPlaying.value = !isPlaying.value
  }

  return { isPlaying, toggle }
}