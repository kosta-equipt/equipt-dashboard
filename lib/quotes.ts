export type Quote = { text: string; author: string }

const QUOTES: ReadonlyArray<Quote> = [
  // Alex Hormozi
  { text: 'The work works.', author: 'Alex Hormozi' },
  { text: 'Boring action beats brilliant inaction every single time.', author: 'Alex Hormozi' },
  { text: 'Your business will only grow to the extent that you do.', author: 'Alex Hormozi' },
  { text: 'You will only ever go as far as the next obstacle in front of you.', author: 'Alex Hormozi' },
  { text: 'Discipline is doing what you said you were going to do, long after the mood you said it in has left.', author: 'Alex Hormozi' },
  { text: 'Volume solves all problems.', author: 'Alex Hormozi' },
  { text: 'You make money in the doing, you keep it in the thinking.', author: 'Alex Hormozi' },
  { text: 'Skills compound. Get one. Get the next. Don’t stop.', author: 'Alex Hormozi' },

  // Naval Ravikant
  { text: 'Play long-term games with long-term people.', author: 'Naval Ravikant' },
  { text: 'Specific knowledge is found by pursuing your genuine curiosity.', author: 'Naval Ravikant' },
  { text: 'Earn with your mind, not your time.', author: 'Naval Ravikant' },
  { text: 'A calm mind, a fit body, and a house full of love. These things cannot be bought — they must be earned.', author: 'Naval Ravikant' },
  { text: 'Reading is faster than listening. Doing is faster than watching.', author: 'Naval Ravikant' },
  { text: 'Inspiration is perishable — act on it immediately.', author: 'Naval Ravikant' },
  { text: 'You’re not going to get rich renting out your time.', author: 'Naval Ravikant' },

  // Charlie Munger
  { text: 'The big money is not in the buying or the selling, but in the waiting.', author: 'Charlie Munger' },
  { text: 'Take a simple idea and take it seriously.', author: 'Charlie Munger' },
  { text: 'It is remarkable how much long-term advantage people like us have gotten by trying to be consistently not stupid.', author: 'Charlie Munger' },
  { text: 'The first rule of compounding: never interrupt it unnecessarily.', author: 'Charlie Munger' },
  { text: 'Show me the incentive and I’ll show you the outcome.', author: 'Charlie Munger' },

  // Warren Buffett
  { text: 'It takes 20 years to build a reputation and five minutes to ruin it.', author: 'Warren Buffett' },
  { text: 'The most important investment you can make is in yourself.', author: 'Warren Buffett' },
  { text: 'Risk comes from not knowing what you’re doing.', author: 'Warren Buffett' },
  { text: 'Price is what you pay. Value is what you get.', author: 'Warren Buffett' },
  { text: 'Someone is sitting in the shade today because someone planted a tree a long time ago.', author: 'Warren Buffett' },

  // Jeff Bezos
  { text: 'Your brand is what other people say about you when you’re not in the room.', author: 'Jeff Bezos' },
  { text: 'A company shouldn’t get addicted to being shiny, because shiny doesn’t last.', author: 'Jeff Bezos' },
  { text: 'If you double the number of experiments you do per year, you’re going to double your inventiveness.', author: 'Jeff Bezos' },
  { text: 'It’s always Day 1.', author: 'Jeff Bezos' },
  { text: 'Be stubborn on vision but flexible on details.', author: 'Jeff Bezos' },

  // Steve Jobs
  { text: 'Quality is more important than quantity. One home run is much better than two doubles.', author: 'Steve Jobs' },
  { text: 'Stay hungry. Stay foolish.', author: 'Steve Jobs' },
  { text: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs' },
  { text: 'Simple can be harder than complex. You have to work hard to get your thinking clean.', author: 'Steve Jobs' },
  { text: 'Details matter. It’s worth waiting to get them right.', author: 'Steve Jobs' },

  // Phil Knight
  { text: 'The cowards never started and the weak died along the way. That leaves us.', author: 'Phil Knight' },
  { text: 'Don’t tell people how to do things, tell them what to do and let them surprise you with their results.', author: 'Phil Knight' },
  { text: 'Beating the competition is relatively easy. Beating yourself is a never-ending commitment.', author: 'Phil Knight' },

  // Sam Walton
  { text: 'High expectations are the key to everything.', author: 'Sam Walton' },
  { text: 'Outstanding leaders go out of their way to boost the self-esteem of their personnel.', author: 'Sam Walton' },
  { text: 'There is only one boss — the customer.', author: 'Sam Walton' },

  // Peter Drucker
  { text: 'The best way to predict the future is to create it.', author: 'Peter Drucker' },
  { text: 'What gets measured gets managed.', author: 'Peter Drucker' },
  { text: 'Efficiency is doing things right. Effectiveness is doing the right things.', author: 'Peter Drucker' },

  // Reid Hoffman
  { text: 'If you’re not embarrassed by the first version of your product, you’ve launched too late.', author: 'Reid Hoffman' },
  { text: 'Starting a company is like jumping off a cliff and assembling the plane on the way down.', author: 'Reid Hoffman' },

  // Paul Graham
  { text: 'Make something people want.', author: 'Paul Graham' },
  { text: 'The most dangerous thing about consulting is the temptation to start small and stay small.', author: 'Paul Graham' },
  { text: 'Live in the future, then build what’s missing.', author: 'Paul Graham' },

  // Ben Horowitz
  { text: 'There is no recipe for the dynamic, scary situations that destroy a company. There is no recipe for building a high-tech company. The only recipe is no recipe.', author: 'Ben Horowitz' },
  { text: 'Hard things are hard because there are no easy answers or recipes.', author: 'Ben Horowitz' },
  { text: 'Take care of the people, the products, and the profits — in that order.', author: 'Ben Horowitz' },

  // Marc Andreessen
  { text: 'Software is eating the world.', author: 'Marc Andreessen' },
  { text: 'Strong opinions, loosely held.', author: 'Marc Andreessen' },

  // Seth Godin
  { text: 'You don’t need more time. You just need to decide.', author: 'Seth Godin' },
  { text: 'Don’t find customers for your products. Find products for your customers.', author: 'Seth Godin' },
  { text: 'Ship often. Ship lousy stuff, but ship.', author: 'Seth Godin' },

  // Stoics — adjacent operator wisdom
  { text: 'What stands in the way becomes the way.', author: 'Marcus Aurelius' },
  { text: 'You become what you give your attention to.', author: 'Epictetus' },
  { text: 'Luck is what happens when preparation meets opportunity.', author: 'Seneca' },

  // Jensen Huang
  { text: 'Pain and suffering — those are the foundations of greatness.', author: 'Jensen Huang' },
  { text: 'You don’t want to be inside a hurricane. You want to be the hurricane.', author: 'Jensen Huang' },

  // Brian Chesky
  { text: 'Build something 100 people love, not something 1 million people kind of like.', author: 'Brian Chesky' },
  { text: 'You don’t scale culture. You hire it, then defend it.', author: 'Brian Chesky' },
]

/**
 * Pick a quote at random. Server-rendered on each request, so a fresh
 * page load yields a fresh quote.
 */
export function getRandomQuote(): Quote {
  const idx = Math.floor(Math.random() * QUOTES.length)
  return QUOTES[idx]
}

export const QUOTE_COUNT = QUOTES.length
