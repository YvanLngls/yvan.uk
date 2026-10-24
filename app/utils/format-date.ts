// Formate une date ISO (YYYY-MM-DD) selon la locale du visiteur.
// Construction via les composants (heure locale) pour éviter tout piège de fuseau horaire.
export const formatDate = (isoDate: string, locale: string): string => {
  const [year, month, day] = isoDate.split('-').map(Number)

  if (!year || !month || !day) return isoDate

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(year, month - 1, day))
}
