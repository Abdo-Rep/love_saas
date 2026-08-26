export interface ReasonCard {
  id: number;
  title: string;
  reason: string;
  detail: string;
  content: string;
  icon?: string;
}

export interface BucketListItem {
  id: number;
  text: string;
  completed?: boolean;
}

export interface OpenWhenLetterItem {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  content: string;
  enabled?: boolean;
}

export interface MemoryPhotoItem {
  id: number;
  image: string;
  date: string;
  caption: string;
  tag: string;
}

export interface CharacterModelOption {
  id: string;
  name: string;
  file: string;
  icon: string;
  description: string;
}

export interface AppConfig {
  // Step 1: Password Gate Landing Page
  sitePassword: string;
  passwordGreeting: string;
  herName: string;
  landingBadge: string;
  landingTitle: string;
  landingSubtitle: string;
  passwordPlaceholder: string;
  enterButtonText: string;

  // Step 2: 3D Entrance Stage (Legacy / Optional)
  selectedCharacterModel?: string;
  theaterWalkMessage?: string;
  theaterButtonText?: string;
  theaterAudioUrl?: string; // Custom audio for theater stage walk (overrides default sound)
  storySongUrl: string; // Custom romantic song - part 1 of potentially chunked base64
  storySongPart2?: string; // Part 2 of base64 audio (for large files)
  storySongPart3?: string; // Part 3 of base64 audio (for large files)

  // Step 3: Star Constellation Name
  constellationName: string;
  constellationTitle: string;
  constellationMessage: string;
  constellationButtonText: string;

  // Step 4: Love Counter
  relationshipStartDate: string;
  counterTitle: string;
  counterQuote: string;
  counterButtonText: string;

  // Step 5: Open When Letters (5 Envelopes)
  openWhenLettersTitle: string;
  openWhenLetters: OpenWhenLetterItem[];
  openWhenLettersButtonText: string;

  // Step 6: Photo Memory Gallery Carousel
  galleryTitle: string;
  memoryPhotos: MemoryPhotoItem[];
  galleryButtonText: string;

  // Step 7: Love Voice Recording
  voiceMessageTitle: string;
  voiceMessageSubtitle: string;
  voicePhotoUrl: string;
  voiceAudioUrl: string;
  voiceButtonText: string;

  // Step 8: Romantic Spin Wheel (Legacy)
  spinWheelOutcomeText: string;
  spinWheelButtonText: string;

  // Step 8: Bucket List (Individual Wish Boxes with Checkmarks)
  bucketListTitle: string;
  bucketListItems: BucketListItem[];
  bucketListButtonText: string;

  // Step 9: Final Heartfelt Letter
  finalLetterTitle: string;
  finalLetterSubtitle: string;
  finalLetterContent: string;
  finalLetterPromise: string;

  // Optional Cinematic & Legacy Helper Fields
  travelSentences?: { text: string; duration: number }[];
  herPortraitUrl?: string;
  couplePhotoUrl?: string;
  countryDateText?: string;
  finalQuote?: string;
  reasons?: ReasonCard[];

  // Legacy Section Fields
  wishes?: any[];
  quizQuestions?: any[];
  mapPins?: any[];
  jarQuotes?: any[];
  memoryPages?: any[];
  surpriseSteps?: any[];
  surpriseFinalMessage?: string;
  writtenQuestions?: any[];

  // Allow extensible keys
  [key: string]: any;
}
