/** The 36 states of the Federation plus the Federal Capital Territory. */
export const NIGERIAN_STATES: string[] = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'Federal Capital Territory',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
];

/** URL-safe slug for a state, e.g. "Akwa Ibom" -> "akwa-ibom". */
export const stateSlug = (state: string): string => state.toLowerCase().replace(/\s+/g, '-');

/** Resolves a slug back to its state name. */
export const stateFromSlug = (slug: string): string | undefined =>
  NIGERIAN_STATES.find((state) => stateSlug(state) === slug.toLowerCase());

/** How a state's superior court of record is styled in a court heading. */
export const highCourtName = (state: string): string =>
  state === 'Federal Capital Territory'
    ? 'High Court of the Federal Capital Territory, Abuja'
    : `High Court of ${state} State`;

/** How a state's magistrate court is styled. */
export const magistrateCourtName = (state: string): string =>
  state === 'Federal Capital Territory'
    ? 'Magistrate Court of the Federal Capital Territory, Abuja'
    : `Magistrate Court of ${state} State`;
