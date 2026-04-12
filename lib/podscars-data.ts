export type PodscarsCategory = {
  id: string
  title: string
  type: "person" | "podcast" | "movie"
  description: string
  nominationPrompt: string
}

export type PodscarsFinalist = {
  name: string
  subtitle: string
}

export type PodscarsFinalistGroup = {
  categoryId: string
  nominees: PodscarsFinalist[]
}

export const defaultPodscarsCategories: PodscarsCategory[] = [
  {
    id: "host-of-the-year",
    title: "Host of the Year",
    type: "person",
    description: "The voice that made listeners feel like they were part of the conversation.",
    nominationPrompt: "Nominate a host, creator, or on-mic personality.",
  },
  {
    id: "breakthrough-voice",
    title: "Breakthrough Voice",
    type: "person",
    description: "A rising talent who broke through with originality, consistency, and point of view.",
    nominationPrompt: "Nominate a new personality who had a breakout year.",
  },
  {
    id: "best-interview-podcast",
    title: "Best Interview Podcast",
    type: "podcast",
    description: "The show that pulled great stories, insight, and chemistry from every guest.",
    nominationPrompt: "Nominate a podcast built around standout conversations.",
  },
  {
    id: "best-storytelling-podcast",
    title: "Best Storytelling Podcast",
    type: "podcast",
    description: "A podcast with memorable arcs, smart editing, and emotional payoff.",
    nominationPrompt: "Nominate a narrative or documentary-style podcast.",
  },
  {
    id: "best-pop-culture-podcast",
    title: "Best Pop Culture Podcast",
    type: "podcast",
    description: "The show everyone quoted, clipped, and texted to friends.",
    nominationPrompt: "Nominate a culture, comedy, recap, or commentary show.",
  },
  {
    id: "scene-stealing-documentary",
    title: "Scene-Stealing Documentary",
    type: "movie",
    description: "A documentary film that sparked conversation and stayed with audiences.",
    nominationPrompt: "Nominate a documentary feature or special.",
  },
  {
    id: "best-podcast-adaptation",
    title: "Best Podcast Adaptation",
    type: "movie",
    description: "A film or special that translated a podcast IP into a visual event.",
    nominationPrompt: "Nominate a movie, special, or visual adaptation tied to podcast culture.",
  },
  {
    id: "fan-favorite-screen-moment",
    title: "Fan Favorite Screen Moment",
    type: "movie",
    description: "A movie moment that dominated group chats, reaction videos, and rewatches.",
    nominationPrompt: "Nominate a specific movie or release that owned the moment.",
  },
]

export const campaignTimeline = [
  {
    phase: "Nominations Open",
    window: "Week 1-3",
    description: "Fans submit people, podcasts, and movie picks across every category.",
  },
  {
    phase: "Review + Finalists",
    window: "Week 4",
    description: "Your team removes duplicates, verifies eligibility, and publishes the shortlist.",
  },
  {
    phase: "Public Voting",
    window: "Week 5-6",
    description: "Fans vote once per category and share their ballot to drive reach.",
  },
  {
    phase: "Winners Reveal",
    window: "Week 7",
    description: "Announce winners in a live stream, newsletter, or social-first reveal package.",
  },
]

export const organizerChecklist = [
  "Decide the awards year and eligibility dates before opening nominations.",
  "Require one verified email or social handle for nominations to reduce spam.",
  "Merge duplicate submissions into one nominee record before voting opens.",
  "Limit voters to one ballot per email and review suspicious voting spikes.",
  "Publish category rules clearly so fans know what qualifies as a person, podcast, or movie entry.",
]

export const defaultSampleFinalists: PodscarsFinalistGroup[] = [
  {
    categoryId: "host-of-the-year",
    nominees: [
      { name: "Ava Monroe", subtitle: "Midnight Mic" },
      { name: "Jordan Fields", subtitle: "The Signal Room" },
      { name: "Maya Ellis", subtitle: "Close Friends Only" },
    ],
  },
  {
    categoryId: "best-storytelling-podcast",
    nominees: [
      { name: "After The Static", subtitle: "Narrative documentary" },
      { name: "Southbound Stories", subtitle: "Human-interest series" },
      { name: "The Last Voicemail", subtitle: "Serialized investigation" },
    ],
  },
  {
    categoryId: "fan-favorite-screen-moment",
    nominees: [
      { name: "Neon Hearts", subtitle: "Indie romance feature" },
      { name: "Signal Lost", subtitle: "Sci-fi thriller" },
      { name: "The Last Encore", subtitle: "Music drama" },
    ],
  },
]

export const categoryTypeLabels = {
  person: "People",
  podcast: "Podcasts",
  movie: "Movies",
} as const
