import { Tenant } from '@/types/tenant';
import { AppConfig } from '@/types/config';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export const TENANTS_STORAGE_KEY = 'cosmic_love_saas_tenants_v1';
export const MASTER_PASSWORD_KEY = 'cosmic_love_master_pass_v1';

// DEFAULT ROMANTIC CONFIG TEMPLATE FOR NEW TENANTS (GENERIC & UNIVERSAL - NO HARDCODED NAMES)
export const createDefaultConfigForTenant = (herName: string = 'أميرتي', sitePassword: string = 'love'): AppConfig => ({
  sitePassword,
  passwordGreeting: 'أهلاً بكِ في عالمنا الخاص.. أدخلي كلمة السر لتبدأ الرحلة ✨',
  herName: 'أميرتي',
  landingBadge: 'رحلة العشق الملكية 👑',
  landingTitle: 'إلى أميرتي وسر سعادتي 👑💖',
  landingSubtitle: 'عالمٌ خُصص لأجلكِ وحدكِ.. حيث تبتسم الذكريات وتُحكى أجمل حكايات العشق ✨',
  passwordPlaceholder: 'اكتب كلمة السر هنا ✨',
  enterButtonText: 'دخول عالمنا الخاص 🚀',

  selectedCharacterModel: '/models/passive_marker_man.fbx',
  theaterWalkMessage: 'كل خطوة خطيتها في الطريق ده.. كانت عشان أوصل لقلبكِ يا روحي 🌸 أنتي مش مجرد شخص في حياتي، أنتي القصة والروح اللي اتمنيت أعيش معاها طول عمري ✨💖',
  theaterButtonText: 'كلمة حلوة.. تعالي نخش جوه قصة حياتنا 💖✨',
  storySongUrl: '',

  constellationName: 'LOVE',
  constellationTitle: 'نجمتي وأميرتي الغالية... 💫',
  constellationMessage: '"كتبتُ اسمكِ بين النجوم لأنكِ القمر الوحيد الذي ينور سمائي، والسر الجميل الذي يسعد قلبي في كل ثانية." ❤️✨',
  constellationButtonText: 'انتقلي لرحلة عشقنا 💖✨',

  relationshipStartDate: '2024-03-14',
  counterTitle: 'معكِ في كل ثانية ودقيقة من العمر 🌸',
  counterQuote: '"كل ثانية مرت وأنا معاك، كانت تساوي عمر كامل من السعادة والراحة.. ووقفت قلبي يزيد معك في كل دقيقة تمضي" ❤️✨',
  counterButtonText: 'التالي: المظاريف السرية ✉️💖',

  openWhenLettersTitle: 'مظاريف الحب السرية 💌',
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
      title: 'ارتاحي شوية وكل حاجة هتهون... ☕🌸',
      subtitle: 'تهدئة وتخفيف للروح',
      icon: '🎀',
      badge: 'راحة بال ☕',
      content: 'خدي نفس عميق وافتكري إن أي حاجة في الدنيا دي تهون وتعدي.. إنتي شاطرة وقوية ورقيقة، وأنا فخور بيكي في كل حاجة بتعمليها. ارتاحي شوية وكل حاجة هتبقى أحسن طول ما إحنا سوا ✨💖',
      enabled: true
    },
    {
      id: 5,
      title: 'ضحكتكِ هي سر سعادتي... 😊✨',
      subtitle: 'احتفال بسيط بضحكتكِ',
      icon: '👸',
      badge: 'سر السعادة 💖',
      content: 'ضحكتكِ دي هي السحر اللي بينور عتمة الدنيا كلها! يدوملي السعادة والضحكة الحلوة اللي بتخليني أحس إن الدنيا كلها بخير. خليكي دايماً بتضحكي عشان ضحكتكِ هي دوا لقلبي ✨💖',
      enabled: true
    }
  ],
  openWhenLettersButtonText: 'التالي: ألبوم الذكريات 📸💖',

  galleryTitle: 'ذكريات منقوشة في القلب والعقل ✨',
  memoryPhotos: [
    {
      id: 1,
      image: '/images/the_boss.jpg',
      date: '١٤ فبراير ٢٠٢٤',
      caption: 'أول نظرة خطفت قلبي وبداية كل حاجة حلوة في عمري 🌸',
      tag: 'البداية 💖'
    },
    {
      id: 2,
      image: '/images/peasant_girl.jpg',
      date: '٢٠ مارس ٢٠٢٤',
      caption: 'ضحكتكِ اللي بتنور عتمة أيامي وتخليني أسعد إنسان ✨',
      tag: 'سعادة 🌟'
    }
  ],
  galleryButtonText: 'التالي: رسالة بصوتي 🎙️❤️',

  voiceMessageTitle: 'كلمات بصوتي طالعة من قلبي لأجلكِ',
  voiceMessageSubtitle: 'رسالة حب بصوتي 🎙️❤️',
  voicePhotoUrl: '/images/peasant_girl.jpg',
  voiceAudioUrl: '',
  voiceButtonText: 'التالي: قائمة أمنياتنا 🗺️✨',

  spinWheelOutcomeText: 'عليكِ بوسة رقيقة يا أميرتي 💋😘',
  spinWheelButtonText: 'التالي: قائمة أمنياتنا 🗺️✨',

  bucketListTitle: 'أحلام سنحققها معاً خطوة بخطوة 🌸',
  bucketListItems: [
    { id: 1, text: 'نسافر سوا ونشوف شروق الشمس على البحر 🌅', completed: false },
    { id: 2, text: 'نعمل عمرة سوا وإيدينا في إيدين بعض 🕋✨', completed: false },
    { id: 3, text: 'نطبخ مع بعض أكله مجنونة ونضحك على طعمها 🍳❤️', completed: false },
    { id: 4, text: 'نحضر حفلة موسيقية ونغني بأعلى صوتنا 🎶', completed: false },
    { id: 5, text: 'نبني بيتنا الدافئ الصغير المليان حب وراحة 🏡💖', completed: false },
    { id: 6, text: 'نفضل سوا لآخر العمر ونحكي حكايتنا لأولادنا 👵👴', completed: false }
  ],
  bucketListButtonText: 'التالي: الرسالة الأخيرة 💌👑',

  finalLetterTitle: 'كلمات نُقشت بماء الذهب',
  finalLetterSubtitle: 'إلى من ملكت روحي واستقرت في أعماق قلبي 👑',
  finalLetterContent: 'يا أغلى ما عندي في الدنيا ✨ لو كتبتلك كل كلام الحب اللي في العالم مش هيكفي، ولا جزء بسيط اللي حاسس بيه ناحيتك. إنتي النور اللي بينور أيامي، والراحة اللي بدونها الدنيا بتكون صعبة، والسر الوحيد اللي يخليني أبتسم من غير أي سبب. نوعد بعض إننا نفضل سند لبعض، ونعدي أي حاجة، ونضحك سوا ونحقق كل أحلامنا الجاية. بحبك من أعماق قلبي.',
  finalLetterPromise: 'بحبك أوي أوي... ووعد، عمرنا دايماً لا ينتهي 💕💖'
});

export const seedTenants: Tenant[] = [];

export const TenantStore = {
  // Get all tenants
  getAllTenants: (): Tenant[] => {
    if (typeof window === 'undefined') return seedTenants;
    try {
      const saved = localStorage.getItem(TENANTS_STORAGE_KEY);
      if (!saved) {
        return seedTenants;
      }
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error fetching tenants:', e);
      return seedTenants;
    }
  },

  // Get single tenant by slug
  getTenantBySlug: (slug: string): Tenant | null => {
    if (!slug) return null;
    const cleanSlug = slug.toLowerCase().trim();
    const tenants = TenantStore.getAllTenants();
    return tenants.find((t) => t.slug.toLowerCase() === cleanSlug) || null;
  },

  // Create new tenant (Slug & Name do NOT overwrite romantic sentences)
  createTenant: (
    slug: string,
    name: string,
    adminPassword: string,
    sitePassword: string
  ): Tenant => {
    const tenants = TenantStore.getAllTenants();
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    
    // Check if slug exists
    const existing = tenants.find((t) => t.slug === cleanSlug);
    if (existing) {
      throw new Error(`الرابط الخاص (${cleanSlug}) مستخدم بالفعل لنسخة أخرى! يرجى كتابة رابط آخر.`);
    }

    const newTenant: Tenant = {
      id: `tenant_${Date.now()}`,
      slug: cleanSlug,
      name: name || `نسخة ${cleanSlug}`,
      adminPassword: adminPassword || 'love',
      sitePassword: sitePassword || 'love',
      createdAt: new Date().toISOString(),
      status: 'active',
      config: createDefaultConfigForTenant('أميرتي', sitePassword || 'love')
    };

    const updated = [...tenants, newTenant];
    try {
      localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save new tenant:', e);
    }

    // Sync to Supabase in background
    if (isSupabaseConfigured && supabase) {
      supabase.from('tenants').upsert({
        id: newTenant.id,
        slug: newTenant.slug,
        name: newTenant.name,
        admin_password: newTenant.adminPassword,
        site_password: newTenant.sitePassword,
        status: newTenant.status,
        config: newTenant.config,
        created_at: newTenant.createdAt
      }).then(() => {}).catch(console.error);
    }

    return newTenant;
  },

  // Update tenant details or status
  updateTenant: (slug: string, partial: Partial<Tenant>): Tenant | null => {
    const tenants = TenantStore.getAllTenants();
    const idx = tenants.findIndex((t) => t.slug.toLowerCase() === slug.toLowerCase());
    if (idx === -1) return null;

    const updatedTenant = { ...tenants[idx], ...partial };
    tenants[idx] = updatedTenant;

    try {
      localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(tenants));
    } catch (e) {
      console.error('Failed to update tenant:', e);
    }

    // Sync to Supabase in background
    if (isSupabaseConfigured && supabase) {
      supabase.from('tenants').update({
        name: updatedTenant.name,
        admin_password: updatedTenant.adminPassword,
        site_password: updatedTenant.sitePassword,
        status: updatedTenant.status,
        config: updatedTenant.config
      }).eq('slug', slug.toLowerCase()).then(() => {}).catch(console.error);
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

    // Sync to Supabase in background
    if (isSupabaseConfigured && supabase) {
      supabase.from('tenants').update({
        config: updatedConfig,
        site_password: updatedTenant.sitePassword
      }).eq('slug', slug.toLowerCase()).then(() => {}).catch(console.error);
    }

    return updatedTenant;
  },

  // Delete tenant
  deleteTenant: (slug: string): boolean => {
    const tenants = TenantStore.getAllTenants();
    const filtered = tenants.filter((t) => t.slug.toLowerCase() !== slug.toLowerCase());
    if (filtered.length === tenants.length) return false;

    try {
      localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to delete tenant:', e);
    }

    // Sync to Supabase in background
    if (isSupabaseConfigured && supabase) {
      supabase.from('tenants').delete().eq('slug', slug.toLowerCase()).then(() => {}).catch(console.error);
    }

    return true;
  },

  // Fetch and sync all tenants directly from Supabase
  syncFromSupabase: async (): Promise<Tenant[]> => {
    if (!isSupabaseConfigured || !supabase) return TenantStore.getAllTenants();
    try {
      const { data, error } = await supabase.from('tenants').select('*');
      if (data && !error) {
        const mapped: Tenant[] = data.map((row: any) => ({
          id: row.id,
          slug: row.slug,
          name: row.name,
          adminPassword: row.admin_password || row.adminPassword || 'love',
          sitePassword: row.site_password || row.sitePassword || 'love',
          createdAt: row.created_at || new Date().toISOString(),
          status: row.status || 'active',
          config: row.config || createDefaultConfigForTenant('أميرتي', row.site_password || 'love')
        }));
        if (typeof window !== 'undefined') {
          localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(mapped));
        }
        return mapped;
      }
    } catch (e) {
      console.error('Supabase fetch error:', e);
    }
    return TenantStore.getAllTenants();
  },

  // Master password management for super admin (Default: And-a-spi3#)
  getMasterPassword: (): string => {
    if (typeof window === 'undefined') return 'And-a-spi3#';
    return localStorage.getItem(MASTER_PASSWORD_KEY) || 'And-a-spi3#';
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
