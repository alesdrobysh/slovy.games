/**
 * Common Belarusian function words that stay visible in the redacted article.
 * Prepositions, conjunctions, particles, and short pronouns/demonstratives.
 * Stored as lemmas (lowercase). Tokens whose lemma is in this set are not
 * redacted.
 */
export const FREE_WORD_LEMMAS = new Set<string>([
	// prepositions
	"у",
	"ў",
	"на",
	"за",
	"па",
	"да",
	"з",
	"са",
	"аб",
	"пра",
	"праз",
	"пад",
	"над",
	"перад",
	"пры",
	"паміж",
	"без",
	"для",
	"апроч",
	"воддаль",
	// conjunctions
	"і",
	"а",
	"але",
	"ды",
	"ці",
	"што",
	"каб",
	"бо",
	"то",
	"нібы",
	"хоць",
	"хоць",
	"калі",
	"бо",
	"бы",
	"быццам",
	// particles
	"не",
	"ні",
	"нават",
	"толькі",
	"амаль",
	"ужо",
	"яшчэ",
	"хіба",
	// short pronouns
	"я",
	"ты",
	"ён",
	"яна",
	"яно",
	"мы",
	"вы",
	"яны",
	// demonstratives
	"гэты",
	"гэта",
	"гэтыя",
	"той",
	"тая",
	"тое",
	"такі",
	"такая",
	"такое",
	"такія",
]);

/** Minimum word length (in letters) for a word token to be considered a
 *  real redacted target. Anything shorter is auto-free. */
export const MIN_REDACTED_LENGTH = 3;

/** Maximum number of guesses a player can make in a single day. */
export const MAX_GUESSES = 200;

/** Maximum number of hints a player can take per game. */
export const MAX_HINTS = 3;
