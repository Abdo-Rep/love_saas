import { Tenant } from '@/types/tenant';
import { AppConfig } from '@/types/config';

export const TENANTS_STORAGE_KEY = 'cosmic_love_saas_tenants_v3';
export const MASTER_PASSWORD_KEY = 'cosmic_love_master_pass_v3';
export const DELETED_SLUGS_KEY = 'cosmic_love_deleted_slugs_v3';

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

  voiceMessageTitle: 'كلمات بصوتي طالعة من قلبي لأجلكِ',
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

export const initialSeedTenants: Tenant[] = [];

export const TenantStore = {
  getDeletedSlugs: (): string[] => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(DELETED_SLUGS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  addDeletedSlug: (slug: string) => {
    if (typeof window === 'undefined') return;
    try {
      const current = TenantStore.getDeletedSlugs();
      const clean = slug.toLowerCase().trim();
      if (!current.includes(clean)) {
        current.push(clean);
        localStorage.setItem(DELETED_SLUGS_KEY, JSON.stringify(current));
      }
    } catch { }
  },

  // Get all tenants (Filtered from deleted slugs, sorted newest first)
  getAllTenants: (): Tenant[] => {
    if (typeof window === 'undefined') return [];
    try {
      const deleted = TenantStore.getDeletedSlugs();
      const saved = localStorage.getItem(TENANTS_STORAGE_KEY);
      if (!saved) {
        const seedTenant: Tenant = {
          id: 't-default-rawda',
          slug: 'rawda',
          name: 'حبيبتي 🌸',
          adminPassword: 'love',
          sitePassword: 'love',
          createdAt: new Date().toISOString(),
          status: 'active',
          config: createDefaultConfigForTenant('حبيبتي', 'love')
        };
        localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify([seedTenant]));
        return [seedTenant];
      }
      const parsed: Tenant[] = JSON.parse(saved);
      const cleanList = parsed.filter((t) => !deleted.includes(t.slug.toLowerCase().trim()));
      cleanList.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      if (cleanList.length !== parsed.length) {
        localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(cleanList));
      }
      return cleanList;
    } catch (e) {
      console.error('Error fetching tenants:', e);
      return [];
    }
  },

  // Get single tenant by slug
  getTenantBySlug: (slug: string): Tenant | null => {
    if (!slug) return null;
    const cleanSlug = slug.toLowerCase().trim();
    const deleted = TenantStore.getDeletedSlugs();
    if (deleted.includes(cleanSlug)) return null;

    const tenants = TenantStore.getAllTenants();
    const found = tenants.find((t) => t.slug.toLowerCase() === cleanSlug);
    if (found) return found;

    // Auto-create tenant on demand for any requested slug
    return TenantStore.createTenant(cleanSlug, `موقع ${cleanSlug}`, 'love', 'love', cleanSlug);
  },

  // Create new tenant
  createTenant: (
    slug: string,
    name: string,
    adminPassword: string,
    sitePassword: string,
    herName: string = 'أميرتي'
  ): Tenant => {
    const tenants = TenantStore.getAllTenants();
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');

    if (typeof window !== 'undefined') {
      const deleted = TenantStore.getDeletedSlugs().filter((s) => s !== cleanSlug);
      localStorage.setItem(DELETED_SLUGS_KEY, JSON.stringify(deleted));
    }

    const newTenant: Tenant = {
      id: `t-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      slug: cleanSlug,
      name: name || `موقع ${cleanSlug}`,
      adminPassword: adminPassword || 'love',
      sitePassword: sitePassword || 'love',
      createdAt: new Date().toISOString(),
      status: 'active',
      config: createDefaultConfigForTenant(herName || 'أميرتي', sitePassword || 'love')
    };

    const existingIdx = tenants.findIndex((t) => t.slug.toLowerCase() === cleanSlug);
    if (existingIdx !== -1) {
      tenants[existingIdx] = newTenant;
    } else {
      tenants.unshift(newTenant);
    }

    try {
      localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(tenants));
    } catch (e) {
      console.error('Failed to save tenant:', e);
    }

    if (typeof window !== 'undefined') {
      fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant: newTenant })
      }).catch(() => { });
    }

    return newTenant;
  },

  // Update tenant properties
  updateTenant: (slug: string, updates: Partial<Tenant>): Tenant | null => {
    const tenants = TenantStore.getAllTenants();
    const idx = tenants.findIndex((t) => t.slug.toLowerCase() === slug.toLowerCase());
    if (idx === -1) return null;

    const currentTenant = tenants[idx];
    const updatedTenant: Tenant = {
      ...currentTenant,
      ...updates,
      config: {
        ...currentTenant.config,
        ...updates.config,
        sitePassword: updates.sitePassword || updates.config?.sitePassword || currentTenant.config.sitePassword
      }
    };

    tenants[idx] = updatedTenant;
    try {
      localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(tenants));
    } catch (e) {
      console.error('Failed to update tenant:', e);
    }

    if (typeof window !== 'undefined') {
      fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant: updatedTenant })
      }).catch(() => { });
    }

    return updatedTenant;
  },

  // Update specific tenant's config
  updateTenantConfig: (slug: string, newConfig: Partial<AppConfig>): Tenant | null => {
    const tenants = TenantStore.getAllTenants();
    const idx = tenants.findIndex((t) => t.slug.toLowerCase() === slug.toLowerCase());
    if (idx === -1) return null;

    const currentTenant = tenants[idx];
    const updatedConfig = { ...currentTenant.config, ...newConfig };
    const updatedTenant = {
      ...currentTenant,
      config: updatedConfig,
      sitePassword: newConfig.sitePassword || currentTenant.sitePassword
    };

    tenants[idx] = updatedTenant;
    try {
      localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(tenants));
    } catch (e) {
      console.error('Failed to update tenant config:', e);
    }

    if (typeof window !== 'undefined') {
      fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant: updatedTenant })
      }).catch(() => { });
    }

    return updatedTenant;
  },

  // Permanent Delete tenant
  deleteTenant: (slug: string): boolean => {
    const cleanSlug = slug.toLowerCase().trim();
    TenantStore.addDeletedSlug(cleanSlug);

    const tenants = TenantStore.getAllTenants();
    const filtered = tenants.filter((t) => t.slug.toLowerCase() !== cleanSlug);

    try {
      localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to delete tenant:', e);
    }

    if (typeof window !== 'undefined') {
      fetch('/api/tenants', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: cleanSlug })
      }).catch(() => { });
    }

    return true;
  },

  // Sync all tenants via API (Safely merges server tenants with local tenants!)
  syncFromSupabase: async (): Promise<Tenant[]> => {
    try {
      const deleted = TenantStore.getDeletedSlugs();
      const localTenants = TenantStore.getAllTenants();
      const mergedMap = new Map<string, Tenant>();

      // 1. Load local tenants into map
      localTenants.forEach((t) => {
        const key = t.slug.toLowerCase().trim();
        if (!deleted.includes(key)) {
          mergedMap.set(key, t);
        }
      });

      // 2. Fetch server tenants and add missing ones
      const res = await fetch('/api/tenants');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.tenants)) {
          json.tenants.forEach((st: Tenant) => {
            const key = st.slug.toLowerCase().trim();
            if (!deleted.includes(key)) {
              if (!mergedMap.has(key)) {
                mergedMap.set(key, st);
              }
            }
          });
        }
      }

      const cleanList = Array.from(mergedMap.values()).filter((t: Tenant) => !deleted.includes(t.slug.toLowerCase().trim()));
      cleanList.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

      if (typeof window !== 'undefined') {
        localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(cleanList));
      }
      return cleanList;
    } catch {}
    return TenantStore.getAllTenants();
  },

  // Master password management for super admin
  getMasterPassword: (): string => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(MASTER_PASSWORD_KEY) || '';
  },

  setMasterPassword: (newPassword: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(MASTER_PASSWORD_KEY, newPassword);
  },

  // Backup JSON export
  exportBackupJSON: (): string => {
    const tenants = TenantStore.getAllTenants();
    return JSON.stringify(tenants, null, 2);
  },

  // Restore JSON import
  importBackupJSON: (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) {
        localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(parsed));
        return true;
      }
    } catch (e) {
      console.error('Invalid backup JSON:', e);
    }
    return false;
  }
};
