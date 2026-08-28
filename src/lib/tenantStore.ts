import { Tenant } from '@/types/tenant';
import { AppConfig } from '@/types/config';

// DEFAULT ROMANTIC CONFIG TEMPLATE FOR NEW TENANTS
export const createDefaultConfigForTenant = (herName: string = 'أميرتي', sitePassword: string = 'love'): AppConfig => ({
  sitePassword,
  passwordGreeting: 'أهلاً بكِ في عالمنا الخاص.. أدخلي كلمة السر لتبدأ الرحلة ✨',
  herName: 'أميرتي',
  landingBadge: 'رحلة العشق الملكية 👑',
  landingTitle: 'إلى أميرتي وسر سعادتي 👑💖',
  landingSubtitle: 'عالمٌ خُصص لأجلكِ وحدكِ.. حيث تبتسم الذكريات وتُحكى أجمل حكايات العشق ✨',
  passwordPlaceholder: 'اكتب كلمة السر هنا ✨',
  enterButtonText: 'دخول عالمنا الخاص 🚀',

  storySongUrl: '',

  constellationName: 'بحبك',
  constellationTitle: 'نجمتي وأميرتي الغالية... 💫',
  constellationMessage: '"كتبتُ اسمكِ بين النجوم لأنكِ القمر الوحيد الذي ينور سمائي، والسر الجميل الذي يسعد قلبي في كل ثانية." ❤️✨',
  constellationButtonText: 'عداد الحب',

  relationshipStartDate: '2024-03-14',
  counterTitle: 'معكِ في كل ثانية ودقيقة من العمر 🌸',
  counterQuote: '"كل ثانية مرت وأنا معاك، كانت تساوي عمر كامل من السعادة والراحة.. ووقفت قلبي يزيد معك في كل دقيقة تمضي" ❤️✨',
  counterButtonText: 'الرسائل',

  openWhenLettersTitle: 'رسايل الحب السرية 💌',
  openWhenLetters: [
    {
      id: 1,
      title: 'ماتزعليش مني... 🥺💔',
      subtitle: 'رسالة اعتذار وحنية من قلبي',
      icon: '💔',
      badge: 'حقك عليا 🌸',
      content: 'حبيبتي وروحي يا أغلى ما في حياتي.. عيني وحشتني وقلبي اتوجع أكثر لو كنت سبب في زعلكِ لحظة واحدة، أتمنى دايماً تكوني أسعد إنسانة عندي في الدنيا، سامحيني يا قمر.. ✨💖',
      enabled: true
    },
    {
      id: 2,
      title: 'أنتي بتوحشيني أوي أوي... 💭💖',
      subtitle: 'جرعة حب واشتياق فورية',
      icon: '💌',
      badge: 'توحشيني 🌷',
      content: 'لو أنا مش جنبكِ دلوقتي، غمضي عينيكي وتخيلي إنكِ في حضني.. افتكري إن تفكيري معاكي في كل ثانية، وكل دقيقة بتعدي من غيركِ بتكون ناقصة حاجة حلوة. بحبكِ أوي أوي وما بتبطليش توحشيني ✨💖',
      enabled: true
    },
    {
      id: 3,
      title: 'أنا سندكِ ووطنكِ للأبد... 🛡️❤️',
      subtitle: 'وعد بالبقـاء والوطن المضمون',
      icon: '🕊️',
      badge: 'سندكِ للأبد 👑',
      content: 'أنا هنا دايماً وسندكِ وظاهركِ في كل خطوة في الحياة.. مهما كانت الظروف أو الصعاب، افتكري إن كتفي ملككِ وقلبي بيتكِ الأمني اللي عمري ما هسمح لحد يضايقكِ فيه. إنتي في أمان معايا للأبد ✨💖',
      enabled: true
    },
    {
      id: 4,
      title: 'يوم ما تحسي بضيق أو خنقة... 🌧️🌸',
      subtitle: 'حضن دافئ وطمأنينة فورية',
      icon: '🌧️',
      badge: 'هونيها على نفسكِ 🌸',
      content: 'خدي نفس عميق وافتكري إن مفيش حاجة في الدنيا تستاهل زعلكِ أو حزنكِ. الدنيا دي كلها تروح فدا ضحكتكِ ولمعة عينيكي. أنا جنبكِ ومعاكي ومش هسيبكِ لوحدكِ أبداً، كل مر هيمر وإحنا سوا ✨💖',
      enabled: true
    },
    {
      id: 5,
      title: 'لما تحتاجي تفتكري أنا بحبكِ قد إيه... ♾️💖',
      subtitle: 'اعتراف بالحب اللانهائي',
      icon: '♾️',
      badge: 'حبي الأبدي 💎',
      content: 'بحبكِ بعدد دقات قلبي، وبعدد النجوم اللي في السما، وبكل ثانية عدت من عمري من يوم ما عرفتكِ. إنتي مش بس حبيبتي، إنتي أجمل نصيب ربنا رزقني بيه، وأكبر نعمة بحمد ربنا عليها كل يوم ✨💖',
      enabled: true
    }
  ],
  openWhenLettersButtonText: 'ألبوم الصور',

  galleryTitle: 'ذكريات منقوشة في أعماق القلب',
  memoryPhotos: [
    {
      id: 1,
      image: '/images/peasant_girl.jpg',
      date: '١٤ فبراير ٢٠٢٤',
      caption: 'أول ليلة حسينا فيها إن قلوبنا اتلاقت وعمر جديد بدأ سوا ✨',
      tag: 'بدايتنا 🌸'
    },
    {
      id: 2,
      image: '/images/peasant_girl.jpg',
      date: '١ مارس ٢٠٢٤',
      caption: 'يوم ما عيونكِ ضحكت، نسيت كل تعب الدنيا في ثانية واحدة ❤️',
      tag: 'عشق 💖'
    },
    {
      id: 3,
      image: '/images/peasant_girl.jpg',
      date: '٢٠ مارس ٢٠٢٤',
      caption: 'ضحكتكِ اللي بتنور عتمة أيامي وتخليني أسعد إنسان ✨',
      tag: 'سعادة 🌟'
    }
  ],
  galleryButtonText: 'الرسائل الصوتية',

  voiceMessageTitle: 'فويس بصوتي من قلبي ليكي يروحي',
  voiceMessageSubtitle: 'رسالة حب بصوتي 🎙️❤️',
  voicePhotoUrl: '/images/peasant_girl.jpg',
  voiceAudioUrl: '',
  voiceButtonText: 'أمنيات المستقبل',

  spinWheelOutcomeText: 'عليكِ بوسة رقيقة يا أميرتي 💋😘',
  spinWheelButtonText: 'أمنيات المستقبل',

  bucketListTitle: 'أحلام سنحققها معاً خطوة بخطوة 🌸',
  bucketListItems: [
    { id: 1, text: 'نسافر سوا ونشوف شروق الشمس على البحر 🌅', completed: false },
    { id: 2, text: 'نعمل عمرة سوا وإيدينا في إيدين بعض 🕋✨', completed: false },
    { id: 3, text: 'نطبخ مع بعض أكله مجنونة ونضحك على طعمها 🍳❤️', completed: false },
    { id: 4, text: 'نحضر حفلة موسيقية ونغني بأعلى صوتنا 🎶', completed: false },
    { id: 5, text: 'نبني بيتنا الدافئ الصغير المليان حب وراحة 🏡💖', completed: false },
    { id: 6, text: 'نفضل سوا لآخر العمر ونحكي حكايتنا لأولادنا 👵👴', completed: false }
  ],
  bucketListButtonText: 'الرسالة الختامية',

  finalLetterTitle: 'كلمات نُقشت بماء الذهب',
  finalLetterSubtitle: 'إلى من ملكت روحي واستقرت في أعماق قلبي 👑',
  finalLetterContent: 'يا أغلى ما عندي في الدنيا ✨ لو كتبتلك كل كلام الحب اللي في العالم مش هيكفي، ولا جزء بسيط اللي حاسس بيه ناحيتك. إنتي النور اللي بينور أيامي، والراحة اللي بدونها الدنيا بتكون صعبة، والسر الوحيد اللي يخليني أبتسم من غير أي سبب. نوعد بعض إننا نفضل سند لبعض، ونعدي أي حاجة، ونضحك سوا ونحقق كل أحلامنا الجاية. بحبك من أعماق قلبي.',
  finalLetterPromise: 'بحبك أوي أوي... ووعد، عمرنا دايماً لا ينتهي 💕💖'
});

// In-Memory Tenants Registry (NO localStorage)
let inMemoryTenants: Tenant[] = [];

export const TenantStore = {
  // Get all tenants (sorted newest first)
  getAllTenants: (): Tenant[] => {
    return inMemoryTenants;
  },

  // Set memory tenants directly
  setTenants: (tenants: Tenant[]): void => {
    inMemoryTenants = tenants;
  },

  // Get single tenant by slug
  getTenantBySlug: (slug: string): Tenant | null => {
    if (!slug) return null;
    const cleanSlug = slug.toLowerCase().trim();
    return inMemoryTenants.find((t) => t.slug.toLowerCase() === cleanSlug) || null;
  },

  // Create new tenant in memory
  createTenant: (
    slug: string,
    name: string,
    adminPassword: string,
    sitePassword: string,
    herName: string = 'أميرتي'
  ): Tenant => {
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');

    const newTenant: Tenant = {
      id: `tenant-${cleanSlug}`,
      slug: cleanSlug,
      name: name || `موقع ${cleanSlug}`,
      adminPassword: adminPassword || 'love',
      sitePassword: sitePassword || 'love',
      createdAt: new Date().toISOString(),
      status: 'active',
      config: createDefaultConfigForTenant(herName || 'أميرتي', sitePassword || 'love')
    };

    const existingIdx = inMemoryTenants.findIndex((t) => t.slug.toLowerCase() === cleanSlug);
    if (existingIdx !== -1) {
      inMemoryTenants[existingIdx] = newTenant;
    } else {
      inMemoryTenants.unshift(newTenant);
    }

    return newTenant;
  },

  // Update tenant properties
  updateTenant: (slug: string, updates: Partial<Tenant>): Tenant | null => {
    const idx = inMemoryTenants.findIndex((t) => t.slug.toLowerCase() === slug.toLowerCase());
    if (idx === -1) return null;

    const currentTenant = inMemoryTenants[idx];
    const updatedTenant: Tenant = {
      ...currentTenant,
      ...updates,
      config: {
        ...currentTenant.config,
        ...updates.config,
        sitePassword: updates.sitePassword || updates.config?.sitePassword || currentTenant.config.sitePassword
      }
    };

    inMemoryTenants[idx] = updatedTenant;
    return updatedTenant;
  },

  // Update specific tenant's config
  updateTenantConfig: (slug: string, newConfig: Partial<AppConfig>): Tenant | null => {
    const idx = inMemoryTenants.findIndex((t) => t.slug.toLowerCase() === slug.toLowerCase());
    if (idx === -1) return null;

    const currentTenant = inMemoryTenants[idx];
    const updatedConfig = { ...currentTenant.config, ...newConfig };
    const updatedTenant = {
      ...currentTenant,
      config: updatedConfig,
      sitePassword: newConfig.sitePassword || currentTenant.sitePassword
    };

    inMemoryTenants[idx] = updatedTenant;
    return updatedTenant;
  },

  // Delete tenant from memory and server
  deleteTenant: (slug: string): boolean => {
    const cleanSlug = slug.toLowerCase().trim();
    inMemoryTenants = inMemoryTenants.filter((t) => t.slug.toLowerCase() !== cleanSlug);

    if (typeof window !== 'undefined') {
      fetch('/api/tenants', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: cleanSlug })
      }).catch(() => { });
    }

    return true;
  },

  // Master password fallback
  getMasterPassword: (): string => {
    return 'love_master_pass_2026';
  },

  // Sync all tenants from Cloud DB
  syncFromSupabase: async (): Promise<Tenant[]> => {
    try {
      const res = await fetch(`/api/tenants?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.tenants)) {
          inMemoryTenants = json.tenants;
          return json.tenants;
        }
      }
    } catch {}
    return inMemoryTenants;
  }
};
