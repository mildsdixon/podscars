insert into public.categories (id, title, type, description, nomination_prompt, active, sort_order)
values
  (
    'best-overall-podcast',
    'Best Overall Podcast',
    'podcast',
    'The standout podcast across content, consistency, audience impact, and overall execution.',
    'Nominate the podcast that deserves the top overall Podscars recognition.',
    true,
    0
  ),
  (
    'best-new-podcast',
    'Best New Podcast',
    'podcast',
    'A new show that made a strong first impression with a clear voice and memorable episodes.',
    'Nominate a new podcast that broke through this year.',
    true,
    1
  ),
  (
    'best-podcast-host',
    'Best Podcast Host',
    'person',
    'A host with standout presence, preparation, personality, and connection with listeners.',
    'Nominate a podcast host who carried the microphone with excellence.',
    true,
    2
  ),
  (
    'best-marketing-and-promotions',
    'Best Marketing and Promotions',
    'podcast',
    'A podcast or team with creative campaigns, strong audience growth, and memorable promotion.',
    'Nominate a podcast with standout marketing, promotion, or rollout strategy.',
    true,
    3
  ),
  (
    'best-production-design',
    'Best Production Design',
    'podcast',
    'A podcast with polished structure, pacing, editing, visuals, branding, and listener experience.',
    'Nominate a podcast with exceptional production design.',
    true,
    4
  ),
  (
    'best-podcast-network',
    'Best Podcast Network',
    'podcast',
    'A network with a strong slate of shows, creator support, brand identity, and audience trust.',
    'Nominate a podcast network making a major impact.',
    true,
    5
  ),
  (
    'best-inspirational-and-personal-development-podcast',
    'Best Inspirational and Personal Development Podcast',
    'podcast',
    'A show that motivates growth, healing, discipline, mindset, purpose, or self-improvement.',
    'Nominate an inspirational or personal development podcast.',
    true,
    6
  ),
  (
    'best-original-music-and-sound-design',
    'Best Original Music and Sound Design',
    'podcast',
    'A podcast with memorable original music, soundscapes, scoring, mixing, or sonic identity.',
    'Nominate a podcast with outstanding original music or sound design.',
    true,
    7
  ),
  (
    'best-comedy-podcast',
    'Best Comedy Podcast',
    'podcast',
    'A comedy show with sharp timing, memorable bits, and a loyal audience.',
    'Nominate a comedy podcast that kept listeners laughing.',
    true,
    8
  ),
  (
    'best-sports-podcast',
    'Best Sports Podcast',
    'podcast',
    'A sports show with great analysis, personality, storytelling, and fan engagement.',
    'Nominate a standout sports podcast.',
    true,
    9
  ),
  (
    'best-social-impact-podcast',
    'Best Social Impact Podcast',
    'podcast',
    'A podcast that raises awareness, inspires action, and contributes meaningfully to community or culture.',
    'Nominate a podcast creating meaningful social impact.',
    true,
    10
  ),
  (
    'best-lgbtq-podcast',
    'Best LGBTQ Podcast',
    'podcast',
    'A podcast centering LGBTQ voices, stories, culture, advocacy, or community.',
    'Nominate a standout LGBTQ podcast.',
    true,
    11
  ),
  (
    'best-women-podcast',
    'Best Women''s Podcast',
    'podcast',
    'A podcast centering women''s voices, stories, leadership, culture, or experiences.',
    'Nominate a standout women-focused podcast.',
    true,
    12
  ),
  (
    'best-men-podcast',
    'Best Men''s Podcast',
    'podcast',
    'A podcast centering men''s voices, stories, development, culture, or experiences.',
    'Nominate a standout men-focused podcast.',
    true,
    13
  ),
  (
    'best-tech-podcast',
    'Best Tech Podcast',
    'podcast',
    'A podcast covering technology, innovation, digital culture, startups, AI, or future trends.',
    'Nominate a standout technology podcast.',
    true,
    14
  ),
  (
    'best-food-and-drink-podcast',
    'Best Food and Drink Podcast',
    'podcast',
    'A podcast exploring food, drink, restaurants, cooking, hospitality, or culinary culture.',
    'Nominate a standout food and drink podcast.',
    true,
    15
  ),
  (
    'best-diversity-and-inclusion',
    'Best Diversity and Inclusion',
    'podcast',
    'A podcast that advances representation, equity, inclusion, and underrepresented perspectives.',
    'Nominate a podcast with a strong diversity and inclusion impact.',
    true,
    16
  ),
  (
    'best-political-podcast',
    'Best Political Podcast',
    'podcast',
    'A political show with clear analysis, strong reporting, thoughtful debate, or civic insight.',
    'Nominate a standout political podcast.',
    true,
    17
  ),
  (
    'best-business-podcast',
    'Best Business Podcast',
    'podcast',
    'A podcast covering entrepreneurship, leadership, finance, careers, strategy, or business stories.',
    'Nominate a standout business podcast.',
    true,
    18
  ),
  (
    'best-health-and-fitness-podcast',
    'Best Health and Fitness Podcast',
    'podcast',
    'A podcast covering wellness, fitness, mental health, nutrition, movement, or healthy living.',
    'Nominate a standout health and fitness podcast.',
    true,
    19
  ),
  (
    'best-news-podcast',
    'Best News Podcast',
    'podcast',
    'A podcast delivering timely reporting, useful context, strong interviews, or clear news analysis.',
    'Nominate a standout news podcast.',
    true,
    20
  ),
  (
    'best-spirituality-and-religion-podcast',
    'Best Spirituality and Religion Podcast',
    'podcast',
    'A podcast exploring faith, spirituality, religion, purpose, belief, or sacred practice.',
    'Nominate a standout spirituality or religion podcast.',
    true,
    21
  ),
  (
    'best-travel-podcast',
    'Best Travel Podcast',
    'podcast',
    'A podcast that explores places, cultures, journeys, travel stories, or destination insight.',
    'Nominate a standout travel podcast.',
    true,
    22
  ),
  (
    'best-duo-team-podcast',
    'Best Duo/Team Podcast',
    'podcast',
    'A podcast powered by strong chemistry, collaboration, co-hosting, or ensemble energy.',
    'Nominate a standout duo or team podcast.',
    true,
    23
  ),
  (
    'best-pop-culture-and-entertainment-podcast',
    'Best Pop Culture and Entertainment Podcast',
    'podcast',
    'A podcast covering entertainment, celebrity, film, TV, music, internet culture, or cultural moments.',
    'Nominate a standout pop culture and entertainment podcast.',
    true,
    24
  )
on conflict (id) do update
set
  title = excluded.title,
  type = excluded.type,
  description = excluded.description,
  nomination_prompt = excluded.nomination_prompt,
  active = excluded.active,
  sort_order = excluded.sort_order;
