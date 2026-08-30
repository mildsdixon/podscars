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
    title: "Best Over All Podcast",
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
    id: "best-engineer",
    title: "Best Engineer",
    type: "person",
    description: "An engineer whose sound, technical polish, and production support helped a show stand out.",
    nominationPrompt: "Nominate an engineer with standout podcast production work.",
  },
  {
    id: "best-original-music-and-sound-design",
    title: "Best Original Music and Sound Design",
    type: "podcast",
    description: "A podcast with memorable original music, soundscapes, scoring, mixing, or sonic identity.",
    nominationPrompt: "Nominate a podcast with outstanding original music or sound design.",
  },
  {
    id: "best-producer",
    title: "Best Producer",
    type: "person",
    description: "A producer whose vision, planning, and execution helped bring a standout show to life.",
    nominationPrompt: "Nominate a producer with outstanding podcast production work.",
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
    id: "best-controversial-podcast",
    title: "Best Controversial",
    type: "podcast",
    description: "A podcast that sparked conversation, challenged opinions, and kept audiences talking.",
    nominationPrompt: "Vote for the controversial podcast that made the biggest impact.",
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
    title: "Best Man Podcast",
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
  {
    id: "streaming-best-male",
    title: "Streaming - Best Male",
    type: "person",
    description: "A standout male performer in streaming-first film, series, or digital storytelling.",
    nominationPrompt: "Select the streaming male performer who deserves recognition.",
  },
  {
    id: "streaming-best-female-actor",
    title: "Streaming - Best Female Actor",
    type: "person",
    description: "A standout female actor in streaming-first film, series, or digital storytelling.",
    nominationPrompt: "Select the streaming female actor who deserves recognition.",
  },
  {
    id: "streaming-best-editor",
    title: "Streaming - Best Editor",
    type: "person",
    description: "An editor whose pacing, polish, and storytelling helped a streaming project stand out.",
    nominationPrompt: "Select the streaming editor who deserves recognition.",
  },
  {
    id: "streaming-best-producer",
    title: "Streaming - Best Producer",
    type: "person",
    description: "A producer whose leadership and execution helped bring a streaming project to life.",
    nominationPrompt: "Select the streaming producer who deserves recognition.",
  },
  {
    id: "streaming-best-writer",
    title: "Streaming - Best Writer",
    type: "person",
    description: "A writer whose story, structure, dialogue, or creative vision stood out in streaming.",
    nominationPrompt: "Select the streaming writer who deserves recognition.",
  },
  {
    id: "streaming-best-villan",
    title: "Streaming - Best Villan",
    type: "person",
    description: "A memorable villain performance in a streaming-first film or series.",
    nominationPrompt: "Select the streaming villain performance that deserves recognition.",
  },
  {
    id: "streaming-best-director",
    title: "Streaming - Best Director",
    type: "person",
    description: "A director with standout vision, performances, pacing, and execution in streaming.",
    nominationPrompt: "Select the streaming director who deserves recognition.",
  },
  {
    id: "streaming-best-movie",
    title: "Streaming - Best Movie",
    type: "movie",
    description: "A streaming-first movie with standout story, performances, production, and impact.",
    nominationPrompt: "Select the streaming movie that deserves recognition.",
  },
  {
    id: "streaming-best-supporting-actress",
    title: "Streaming - Best Supporting Actress",
    type: "person",
    description: "A supporting actress whose performance elevated a streaming project.",
    nominationPrompt: "Select the streaming supporting actress who deserves recognition.",
  },
  {
    id: "streaming-best-supporting-actor",
    title: "Streaming - Best Supporting Actor",
    type: "person",
    description: "A supporting actor whose performance elevated a streaming project.",
    nominationPrompt: "Select the streaming supporting actor who deserves recognition.",
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
    window: "Through Aug 25, 9 PM ET",
    description: "Fans submit people, podcasts, and movie picks before nominations stop.",
  },
  {
    phase: "Review + Finalists",
    window: "Week 4",
    description: "Your team removes duplicates, verifies eligibility, and publishes the shortlist.",
  },
  {
    phase: "Public Voting",
    window: "Starts Aug 26",
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
    categoryId: "best-overall-podcast",
    nominees: [
      { name: "Talks Wit Todd and The Hip Hop Nerds", subtitle: "" },
      { name: "Talking Ish With My Boyz", subtitle: "" },
      { name: "Just My Thoughts Podcast", subtitle: "" },
      { name: "RawButReal", subtitle: "" },
      { name: "Ballin With Rich", subtitle: "" },
    ],
  },
  {
    categoryId: "best-new-podcast",
    nominees: [
      { name: "Juss Lissen", subtitle: "" },
      { name: "One Step Closer", subtitle: "" },
      { name: "Estate Of Minds", subtitle: "" },
      { name: "Detroit Equals Family", subtitle: "" },
      { name: "We Listen and We Judge", subtitle: "" },
      { name: "Just My Thoughts Podcast", subtitle: "" },
    ],
  },
  {
    categoryId: "best-podcast-host",
    nominees: [
      { name: "Kevin Whitfeild", subtitle: "" },
      { name: "John Q", subtitle: "" },
      { name: "Yaminah Vasser", subtitle: "" },
      { name: "Freckles on the Fashion", subtitle: "" },
      { name: "Q.Lewis", subtitle: "" },
      { name: "Lake B. Everywhere", subtitle: "" },
    ],
  },
  {
    categoryId: "best-marketing-and-promotions",
    nominees: [
      { name: "Good Game Productions", subtitle: "" },
      { name: "Shawn P. Entertainment", subtitle: "" },
      { name: "Detroit City Deals", subtitle: "" },
    ],
  },
  {
    categoryId: "best-podcast-network",
    nominees: [
      { name: "B2M Studios", subtitle: "" },
      { name: "Podcast Your Voice", subtitle: "" },
      { name: "Lit Studios", subtitle: "" },
      { name: "MVSA Tv", subtitle: "" },
      { name: "Podcastic", subtitle: "" },
      { name: "Evry Media", subtitle: "" },
      { name: "Soul TV", subtitle: "" },
    ],
  },
  {
    categoryId: "best-inspirational-and-personal-development-podcast",
    nominees: [
      { name: "The Carlson Collective", subtitle: "" },
      { name: "Respectfully Speaking", subtitle: "" },
      { name: "Stephanie Jessica Holley", subtitle: "" },
      { name: "Vaquita Kennedy", subtitle: "" },
      { name: "One Step Closer", subtitle: "" },
    ],
  },
  {
    categoryId: "best-engineer",
    nominees: [
      { name: "Super Producer Rico", subtitle: "" },
      { name: "Milds Dixon", subtitle: "" },
      { name: "Monique Heath", subtitle: "" },
      { name: "Mark Pratt", subtitle: "" },
      { name: "Nicole Nelms", subtitle: "" },
      { name: "Chantel Mosley", subtitle: "" },
    ],
  },
  {
    categoryId: "best-original-music-and-sound-design",
    nominees: [
      { name: "G.A.M.G Big Flex", subtitle: "" },
      { name: "We Listen and We Judge Podcast", subtitle: "" },
      { name: "Man Cave Happy Hour", subtitle: "" },
      { name: "Toxic Talk", subtitle: "" },
      { name: "Real Game", subtitle: "" },
    ],
  },
  {
    categoryId: "best-producer",
    nominees: [
      { name: "Calvin Deal", subtitle: "" },
      { name: "Quincy Lewis", subtitle: "" },
      { name: "Chantel Mosley", subtitle: "" },
      { name: "Rhea Conley", subtitle: "" },
      { name: "Super Producer Rico", subtitle: "" },
    ],
  },
  {
    categoryId: "best-sports-podcast",
    nominees: [
      { name: "Real Game", subtitle: "" },
      { name: "The Judge Podcast", subtitle: "" },
      { name: "The Ring Review Wrestling Podcast", subtitle: "" },
    ],
  },
  {
    categoryId: "best-social-impact-podcast",
    nominees: [
      { name: "Talking Ish With My Boyz", subtitle: "" },
      { name: "EMIY/Put Your Family First", subtitle: "" },
      { name: "What Up Doe Podcast", subtitle: "" },
      { name: "This is What We Do", subtitle: "" },
      { name: "Detroit Table Talk", subtitle: "" },
      { name: "Podtalk", subtitle: "" },
    ],
  },
  {
    categoryId: "best-controversial-podcast",
    nominees: [
      { name: "Toxic Talk", subtitle: "" },
      { name: "Talking Ish With My Boyz", subtitle: "" },
      { name: "Girth", subtitle: "" },
      { name: "We Listen and We Judge", subtitle: "" },
    ],
  },
  {
    categoryId: "best-women-podcast",
    nominees: [
      { name: "1 Truth 2 Stories", subtitle: "" },
      { name: "We Listen and We Judge", subtitle: "" },
      { name: "Sisters With Opinion", subtitle: "" },
      { name: "Estate Of Minds", subtitle: "" },
      { name: "Your Inspired Journey", subtitle: "" },
    ],
  },
  {
    categoryId: "best-men-podcast",
    nominees: [
      { name: "Toxic Talk", subtitle: "" },
      { name: "Girth", subtitle: "" },
      { name: "Talks Wit Todd and The Hip Hop Nerds", subtitle: "" },
      { name: "Just My Thoughts", subtitle: "" },
      { name: "Ty Mopkins", subtitle: "" },
    ],
  },
  {
    categoryId: "best-food-and-drink-podcast",
    nominees: [
      { name: "Man Cave Happy Hour", subtitle: "" },
      { name: "Girth", subtitle: "" },
      { name: "We Listen and We Judge", subtitle: "" },
    ],
  },
  {
    categoryId: "best-business-podcast",
    nominees: [
      { name: "Black Fridays", subtitle: "" },
      { name: "Loren Lewis", subtitle: "" },
    ],
  },
  {
    categoryId: "best-health-and-fitness-podcast",
    nominees: [
      { name: "G.A.M.G Big Flex", subtitle: "" },
      { name: "Detroit City Deals", subtitle: "" },
      { name: "Mentally Ill w/Dez Cortez", subtitle: "" },
    ],
  },
  {
    categoryId: "best-news-podcast",
    nominees: [
      { name: "J W/the News", subtitle: "" },
      { name: "My Irish Radio", subtitle: "" },
      { name: "Yaminah Lady Go Getter", subtitle: "" },
      { name: "G.A.M.G", subtitle: "" },
    ],
  },
  {
    categoryId: "best-spirituality-and-religion-podcast",
    nominees: [
      { name: "Creative Emotions", subtitle: "" },
      { name: "Your Inspired Journey", subtitle: "" },
      { name: "Respectfully Speaking", subtitle: "" },
    ],
  },
  {
    categoryId: "best-duo-team-podcast",
    nominees: [
      { name: "Talking Ish With My Boyz", subtitle: "" },
      { name: "RawButReal", subtitle: "" },
      { name: "Respectfully Speaking", subtitle: "" },
      { name: "Grown Folks Talk", subtitle: "" },
      { name: "Houston Genius & Mizzion Smith", subtitle: "" },
    ],
  },
  {
    categoryId: "best-pop-culture-and-entertainment-podcast",
    nominees: [
      { name: "Talking Ish With My Boyz", subtitle: "" },
      { name: "The Rise and Grind Morning Show", subtitle: "" },
      { name: "Roadworks Records Podcast", subtitle: "" },
      { name: "The Work After Dark Podcast", subtitle: "" },
      { name: "Sucka Stroke", subtitle: "" },
    ],
  },
  {
    categoryId: "streaming-best-male",
    nominees: [
      { name: "Kamal Smith", subtitle: "" },
      { name: "LeMaster Spratling", subtitle: "" },
      { name: "Dejuan Ford", subtitle: "" },
      { name: "Denzelle Dandridge", subtitle: "" },
      { name: "Ro-Spit", subtitle: "" },
      { name: "Quiten Sharp", subtitle: "" },
    ],
  },
  {
    categoryId: "streaming-best-female-actor",
    nominees: [
      { name: "NuNu Thurman", subtitle: "" },
      { name: "Robyn Rose", subtitle: "" },
      { name: "Stephanie Crawford", subtitle: "" },
      { name: "Tia Blaque", subtitle: "" },
      { name: "Vida Michelle", subtitle: "" },
    ],
  },
  {
    categoryId: "streaming-best-editor",
    nominees: [
      { name: "Nate Talbot", subtitle: "" },
      { name: "Ju Did It", subtitle: "" },
      { name: "Edit God (Don Bolton)", subtitle: "" },
      { name: "Keith Rice", subtitle: "" },
    ],
  },
  {
    categoryId: "streaming-best-producer",
    nominees: [
      { name: "Michle Moore", subtitle: "" },
      { name: "Rockey Black", subtitle: "" },
      { name: "Wil Lewis III", subtitle: "" },
      { name: "Darren Brown", subtitle: "" },
    ],
  },
  {
    categoryId: "streaming-best-writer",
    nominees: [
      { name: "Tiffani Hardy", subtitle: "" },
      { name: "Jenai Leonard", subtitle: "" },
      { name: "Denise Mon't", subtitle: "" },
      { name: "Joe Smith", subtitle: "" },
      { name: "Dave Doe", subtitle: "" },
    ],
  },
  {
    categoryId: "streaming-best-villan",
    nominees: [
      { name: "Kamal Smith", subtitle: "" },
      { name: "Don Snipes", subtitle: "" },
      { name: "Coke Horner", subtitle: "" },
    ],
  },
  {
    categoryId: "streaming-best-director",
    nominees: [
      { name: "Joe Smith", subtitle: "" },
      { name: "Shelby Leigh", subtitle: "" },
      { name: "Tonja Shoe Lady Ayers", subtitle: "" },
      { name: "Richard Bass", subtitle: "" },
      { name: "Kamal Smith", subtitle: "" },
      { name: "Rockey Black", subtitle: "" },
    ],
  },
  {
    categoryId: "streaming-best-movie",
    nominees: [
      { name: "Heart of a Women", subtitle: "" },
      { name: "Ultimate Vindetta", subtitle: "" },
      { name: "In All The Wrong Places", subtitle: "" },
      { name: "What About Your Friends", subtitle: "" },
      { name: "Kayla", subtitle: "" },
      { name: "Just A Friend", subtitle: "" },
    ],
  },
  {
    categoryId: "streaming-best-supporting-actress",
    nominees: [
      { name: "Lauren Session", subtitle: "" },
      { name: "Tierra Jacole", subtitle: "" },
      { name: "Sabree Whitfield", subtitle: "" },
      { name: "Tia Blaque", subtitle: "" },
      { name: "Kia B", subtitle: "" },
      { name: "Misha Bivons", subtitle: "" },
    ],
  },
  {
    categoryId: "streaming-best-supporting-actor",
    nominees: [
      { name: "Steve White", subtitle: "" },
      { name: "Don Snipes", subtitle: "" },
      { name: "Marrion Hamm III", subtitle: "" },
      { name: "Robert Q Jackson", subtitle: "" },
    ],
  },
]

export const categoryTypeLabels = {
  person: "People",
  podcast: "Podcasts",
  movie: "Movies",
} as const
