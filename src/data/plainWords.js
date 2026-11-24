// Plain words (Nov 24, Jade). VWB's own names, each with a short plain meaning.
// When plain words are on, the meaning shows in ( ) after the name the first time
// it comes up in a sentence: "Start a Campfire (a team chat) for your crew."
// Longer names go first, so "Sister Campfire" is matched before "Campfire".
// en and es: every way the name is written (one, more than one).
// plain: [English, Spanish] for one. many: the same for more than one (the second spelling).

export const PLAIN_WORDS = [
  { en: ['Sister Campfire', 'Sister Campfires'], es: ['Fogata hermana', 'Fogatas hermanas'], plain: ['a chat for two linked villages', 'un chat para dos aldeas unidas'], many: ['chats for two linked villages', 'chats para dos aldeas unidas'] },
  { en: ['Cottage Chat', 'Cottage Chats'], es: ['Chat de la casita', 'Chats de la casita'], plain: ['a private chat with people you pick', 'un chat privado con personas que usted elige'], many: ['private chats with people you pick', 'chats privados con personas que usted elige'] },
  { en: ['Response Camp', 'Response Camps'], es: ['Campamento de respuesta', 'Campamentos de respuesta'], plain: ['the chat for one emergency', 'el chat de una emergencia'], many: ['chats for one emergency each', 'chats de una emergencia cada uno'] },
  { en: ['Village Square'], es: ['Plaza de la aldea'], plain: ['news and village chats', 'noticias y chats de la aldea'] },
  { en: ['Hope Ambassador', 'Hope Ambassadors'], es: ['Embajador de Esperanza', 'Embajadores de Esperanza'], plain: ['a trusted neighbor who helps in your area', 'un vecino de confianza que ayuda en su zona'], many: ['trusted neighbors who help in your area', 'vecinos de confianza que ayudan en su zona'] },
  { en: ['emergency crew', 'emergency crews'], es: ['equipo de emergencia', 'equipos de emergencia'], plain: ['a team that helps in disasters', 'un equipo que ayuda en desastres'], many: ['teams that help in disasters', 'equipos que ayudan en desastres'] },
  { en: ['Campfire', 'Campfires'], es: ['Fogata', 'Fogatas'], plain: ['a team chat', 'un chat de equipo'], many: ['team chats', 'chats de equipo'] },
  { en: ['Keeper', 'Keepers'], es: ['Guardián', 'Guardianes'], plain: ['a village or crew leader', 'líder de una aldea o equipo'], many: ['village or crew leaders', 'líderes de aldeas o equipos'] },
  { en: ['Spark', 'Sparks'], es: ['Chispa', 'Chispas'], plain: ['a quick, kind reply', 'una respuesta rápida y amable'], many: ['quick, kind replies', 'respuestas rápidas y amables'] },
]
