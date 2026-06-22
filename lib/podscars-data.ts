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
    id: "best-overall-podcast",
    title: "Best Overall Podcast",
    type: "podcast",
    description: "The standout podcast across content, consistency, audience impact, and overall execution.",
    nominationPrompt: "Nominate the podcast that deserves the top overall Podscars recognition.",
  },
  {
    id: "best-new-podcast",
    title: "Best New Podcast",
    type: "podcast",
    description: "A new show that made a strong first impression with a clear voice and memorable episodes.",
    nominationPrompt: "Nominate a new podcast that broke through this year.",
  },
  {
    id: "best-podcast-host",
    title: "Best Podcast Host",
    type: "person",
    description: "A host with standout presence, preparation, personality, and connection with listeners.",
    nominationPrompt: "Nominate a podcast host who carried the microphone with excellence.",
  },
  {
    id: "best-marketing-and-promotions",
    title: "Best Marketing and Promotions",
    type: "podcast",
    description: "A podcast or team with creative campaigns, strong audience growth, and memorable promotion.",
    nominationPrompt: "Nominate a podcast with standout marketing, promotion, or rollout strategy.",
  },
  {
    id: "best-production-design",
    title: "Best Production Design",
    type: "podcast",
    description: "A podcast with polished structure, pacing, editing, visuals, branding, and listener experience.",
    nominationPrompt: "Nominate a podcast with exceptional production design.",
  },
  {
    id: "best-podcast-network",
    title: "Best Podcast Network",
    type: "podcast",
    description: "A network with a strong slate of shows, creator support, brand identity, and audience trust.",
    nominationPrompt: "Nominate a podcast network making a major impact.",
  },
  {
    id: "best-inspirational-and-personal-development-podcast",
    title: "Best Inspirational and Personal Development Podcast",
    type: "podcast",
    description: "A show that motivates growth, healing, discipline, mindset, purpose, or self-improvement.",
    nominationPrompt: "Nominate an inspirational or personal development podcast.",
  },
  {
    id: "best-original-music-and-sound-design",
    title: "Best Original Music and Sound Design",
    type: "podcast",
    description: "A podcast with memorable original music, soundscapes, scoring, mixing, or sonic identity.",
    nominationPrompt: "Nominate a podcast with outstanding original music or sound design.",
  },
  {
    id: "best-comedy-podcast",
    title: "Best Comedy Podcast",
    type: "podcast",
    description: "A comedy show with sharp timing, memorable bits, and a loyal audience.",
    nominationPrompt: "Nominate a comedy podcast that kept listeners laughing.",
  },
  {
    id: "best-sports-podcast",
    title: "Best Sports Podcast",
    type: "podcast",
    description: "A sports show with great analysis, personality, storytelling, and fan engagement.",
    nominationPrompt: "Nominate a standout sports podcast.",
  },
  {
    id: "best-social-impact-podcast",
    title: "Best Social Impact Podcast",
    type: "podcast",
    description: "A podcast that raises awareness, inspires action, and contributes meaningfully to community or culture.",
    nominationPrompt: "Nominate a podcast creating meaningful social impact.",
  },
  {
    id: "best-lgbtq-podcast",
    title: "Best LGBTQ Podcast",
    type: "podcast",
    description: "A podcast centering LGBTQ voices, stories, culture, advocacy, or community.",
    nominationPrompt: "Nominate a standout LGBTQ podcast.",
  },
  {
    id: "best-women-podcast",
    title: "Best Women's Podcast",
    type: "podcast",
    description: "A podcast centering women's voices, stories, leadership, culture, or experiences.",
    nominationPrompt: "Nominate a standout women-focused podcast.",
  },
  {
    id: "best-men-podcast",
    title: "Best Men's Podcast",
    type: "podcast",
    description: "A podcast centering men's voices, stories, development, culture, or experiences.",
    nominationPrompt: "Nominate a standout men-focused podcast.",
  },
  {
    id: "best-tech-podcast",
    title: "Best Tech Podcast",
    type: "podcast",
    description: "A podcast covering technology, innovation, digital culture, startups, AI, or future trends.",
    nominationPrompt: "Nominate a standout technology podcast.",
  },
  {
    id: "best-food-and-drink-podcast",
    title: "Best Food and Drink Podcast",
    type: "podcast",
    description: "A podcast exploring food, drink, restaurants, cooking, hospitality, or culinary culture.",
    nominationPrompt: "Nominate a standout food and drink podcast.",
  },
  {
    id: "best-diversity-and-inclusion",
    title: "Best Diversity and Inclusion",
    type: "podcast",
    description: "A podcast that advances representation, equity, inclusion, and underrepresented perspectives.",
    nominationPrompt: "Nominate a podcast with a strong diversity and inclusion impact.",
  },
  {
    id: "best-political-podcast",
    title: "Best Political Podcast",
    type: "podcast",
    description: "A political show with clear analysis, strong reporting, thoughtful debate, or civic insight.",
    nominationPrompt: "Nominate a standout political podcast.",
  },
  {
    id: "best-business-podcast",
    title: "Best Business Podcast",
    type: "podcast",
    description: "A podcast covering entrepreneurship, leadership, finance, careers, strategy, or business stories.",
    nominationPrompt: "Nominate a standout business podcast.",
  },
  {
    id: "best-health-and-fitness-podcast",
    title: "Best Health and Fitness Podcast",
    type: "podcast",
    description: "A podcast covering wellness, fitness, mental health, nutrition, movement, or healthy living.",
    nominationPrompt: "Nominate a standout health and fitness podcast.",
  },
  {
    id: "best-news-podcast",
    title: "Best News Podcast",
    type: "podcast",
    description: "A podcast delivering timely reporting, useful context, strong interviews, or clear news analysis.",
    nominationPrompt: "Nominate a standout news podcast.",
  },
  {
    id: "best-spirituality-and-religion-podcast",
    title: "Best Spirituality and Religion Podcast",
    type: "podcast",
    description: "A podcast exploring faith, spirituality, religion, purpose, belief, or sacred practice.",
    nominationPrompt: "Nominate a standout spirituality or religion podcast.",
  },
  {
    id: "best-travel-podcast",
    title: "Best Travel Podcast",
    type: "podcast",
    description: "A podcast that explores places, cultures, journeys, travel stories, or destination insight.",
    nominationPrompt: "Nominate a standout travel podcast.",
  },
  {
    id: "best-duo-team-podcast",
    title: "Best Duo/Team Podcast",
    type: "podcast",
    description: "A podcast powered by strong chemistry, collaboration, co-hosting, or ensemble energy.",
    nominationPrompt: "Nominate a standout duo or team podcast.",
  },
  {
    id: "best-pop-culture-and-entertainment-podcast",
    title: "Best Pop Culture and Entertainment Podcast",
    type: "podcast",
    description: "A podcast covering entertainment, celebrity, film, TV, music, internet culture, or cultural moments.",
    nominationPrompt: "Nominate a standout pop culture and entertainment podcast.",
  },
]

export const streamingNominationCategories: PodscarsCategory[] = [
  {
    id: "best-actor",
    title: "Best Actor",
    type: "person",
    description: "A standout male actor in a streaming movie, show, or original production.",
    nominationPrompt: "Nominate an actor who delivered a memorable streaming performance.",
  },
  {
    id: "best-actress",
    title: "Best Actress",
    type: "person",
    description: "A standout actress in a streaming movie, show, or original production.",
    nominationPrompt: "Nominate an actress who delivered a memorable streaming performance.",
  },
  {
    id: "best-editor",
    title: "Best Editor",
    type: "person",
    description: "An editor whose pacing, structure, and storytelling elevated a streaming production.",
    nominationPrompt: "Nominate an editor with standout work in a streaming movie or show.",
  },
  {
    id: "best-producer",
    title: "Best Producer",
    type: "person",
    description: "A producer who helped bring a strong streaming project to life with vision and execution.",
    nominationPrompt: "Nominate a producer behind an outstanding streaming production.",
  },
  {
    id: "best-writer",
    title: "Best Writer",
    type: "person",
    description: "A writer whose script, dialogue, story, or concept made a streaming production stand out.",
    nominationPrompt: "Nominate a writer with outstanding work in a streaming movie or show.",
  },
  {
    id: "best-villain",
    title: "Best Villain",
    type: "person",
    description: "A performer or character who delivered the most memorable antagonist role.",
    nominationPrompt: "Nominate the best villain from a streaming movie or show.",
  },
  {
    id: "best-director",
    title: "Best Director",
    type: "person",
    description: "A director whose creative vision shaped a standout streaming production.",
    nominationPrompt: "Nominate a director with outstanding streaming work.",
  },
  {
    id: "best-movie",
    title: "Best Movie",
    type: "movie",
    description: "The strongest streaming movie overall, across story, performances, production, and impact.",
    nominationPrompt: "Nominate the best streaming movie.",
  },
  {
    id: "best-supporting-actress",
    title: "Best Supporting Actress",
    type: "person",
    description: "A supporting actress whose performance added depth, emotion, or memorable energy.",
    nominationPrompt: "Nominate a supporting actress from a streaming movie or show.",
  },
  {
    id: "best-supporting-actor",
    title: "Best Supporting Actor",
    type: "person",
    description: "A supporting actor whose performance added depth, emotion, or memorable energy.",
    nominationPrompt: "Nominate a supporting actor from a streaming movie or show.",
  },
  {
    id: "best-director-of-photography",
    title: "Best Director of Photography",
    type: "person",
    description: "A director of photography whose visual style, lighting, framing, and camera work stood out.",
    nominationPrompt: "Nominate a director of photography with outstanding streaming work.",
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
