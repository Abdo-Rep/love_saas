import { Tenant } from '@/types/tenant';
import { AppConfig } from '@/types/config';
import { getSupabaseUrl, getSupabaseKey, sanitizeAssetUrl } from './supabaseClient';

function sanitizeConfigUrls(config: Record<string, any>): Record<string, any> {
  if (!config || typeof config !== 'object') return config;
  const clone = { ...config };
  if (typeof clone.storySongUrl === 'string') {
    clone.storySongUrl = sanitizeAssetUrl(clone.storySongUrl);
  }
  if (Array.isArray(clone.gallery)) {
    clone.gallery = clone.gallery.map((g: any) => ({
      ...g,
      image: sanitizeAssetUrl(g?.image || ''),
    }));
  }
  if (Array.isArray(clone.voiceNotes)) {
    clone.voiceNotes = clone.voiceNotes.map((v: any) => ({
      ...v,
      audioUrl: sanitizeAssetUrl(v?.audioUrl || ''),
    }));
  }
  if (Array.isArray(clone.musicList)) {
    clone.musicList = clone.musicList.map((m: any) => ({
      ...m,
      url: sanitizeAssetUrl(m?.url || ''),
    }));
  }
  return clone;
}

// DEFAULT ROMANTIC CONFIG TEMPLATE FOR NEW TENANTS
export const createDefaultConfigForTenant = (herName: string = 'أميرتي', sitePassword: string = 'love', adminPassword: string = 'love'): AppConfig => ({
  sitePassword,
  adminPassword,
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
    const finalAdminPass = (adminPassword || 'love').trim();
    const finalSitePass = (sitePassword || 'love').trim();

    const newTenant: Tenant = {
      id: `tenant-${cleanSlug}`,
      slug: cleanSlug,
      name: name || `موقع ${cleanSlug}`,
      adminPassword: finalAdminPass,
      sitePassword: finalSitePass,
      createdAt: new Date().toISOString(),
      status: 'active',
      config: createDefaultConfigForTenant(herName || 'أميرتي', finalSitePass, finalAdminPass)
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
    const newAdminPass = updates.adminPassword ?? updates.config?.adminPassword ?? currentTenant.adminPassword ?? currentTenant.config?.adminPassword ?? 'love';
    const newSitePass = updates.sitePassword ?? updates.config?.sitePassword ?? currentTenant.sitePassword ?? currentTenant.config?.sitePassword ?? 'love';

    const updatedTenant: Tenant = {
      ...currentTenant,
      ...updates,
      adminPassword: newAdminPass,
      sitePassword: newSitePass,
      config: {
        ...currentTenant.config,
        ...updates.config,
        adminPassword: newAdminPass,
        sitePassword: newSitePass
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
    const newAdminPass = newConfig.adminPassword ?? currentTenant.adminPassword ?? currentTenant.config?.adminPassword ?? 'love';
    const newSitePass = newConfig.sitePassword ?? currentTenant.sitePassword ?? currentTenant.config?.sitePassword ?? 'love';

    const updatedTenant: Tenant = {
      ...currentTenant,
      adminPassword: newAdminPass,
      sitePassword: newSitePass,
      config: {
        ...updatedConfig,
        adminPassword: newAdminPass,
        sitePassword: newSitePass
      }
    };

    inMemoryTenants[idx] = updatedTenant;
    return updatedTenant;
  },

  // Delete tenant from memory and server
  deleteTenant: async (slug: string): Promise<boolean> => {
    const cleanSlug = slug.toLowerCase().trim();
    inMemoryTenants = inMemoryTenants.filter((t) => t.slug.toLowerCase() !== cleanSlug);

    const url = getSupabaseUrl();
    const key = getSupabaseKey();

    try {
      const res = await fetch(`${url}/rest/v1/tenants?slug=eq.${encodeURIComponent(cleanSlug)}`, {
        method: 'DELETE',
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Accept-Profile': 'romantic-new-version',
          'Content-Profile': 'romantic-new-version',
          Prefer: 'return=minimal',
        },
      });

      // Also clean any cached item
      if (typeof window !== 'undefined') {
        try {
          const cached = sessionStorage.getItem('solaf_superadmin_tenants_cache');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed)) {
              const updated = parsed.filter((t: any) => (t.slug || '').toLowerCase().trim() !== cleanSlug);
              sessionStorage.setItem('solaf_superadmin_tenants_cache', JSON.stringify(updated));
            }
          }
        } catch {}
      }

      return res.ok;
    } catch (err) {
      console.warn('Error deleting from Supabase:', err);
      return false;
    }
  },

  // Master password fallback
  getMasterPassword: (): string => {
    return 'love_master_pass_2026';
  },

  // Save single tenant directly to Cloud DB
  saveTenantToCloud: async (tenant: Tenant): Promise<boolean> => {
    const url = getSupabaseUrl();
    const key = getSupabaseKey();
    if (!url || !key) return true;

    try {
      const cleanSlug = (tenant.slug || '').toLowerCase().trim();
      const cfg = (tenant.config || {}) as Record<string, any>;
      const adminPass = tenant.adminPassword ?? cfg.adminPassword ?? 'love';
      const sitePass = tenant.sitePassword ?? cfg.sitePassword ?? 'love';

      const payload = {
        id: tenant.id || `tenant-${cleanSlug}`,
        slug: cleanSlug,
        name: tenant.name || `موقع ${cleanSlug}`,
        admin_password: adminPass,
        site_password: sitePass,
        status: tenant.status ?? 'active',
        config: {
          ...cfg,
          adminPassword: adminPass,
          sitePassword: sitePass,
        },
      };

      const res = await fetch(`${url}/rest/v1/tenants?on_conflict=slug`, {
        method: 'POST',
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Accept-Profile': 'romantic-new-version',
          'Content-Profile': 'romantic-new-version',
          Prefer: 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify(payload),
      });

      return res.ok;
    } catch {
      return false;
    }
  },

  // Sync all tenants from Cloud DB
  syncFromSupabase: async (): Promise<Tenant[]> => {
    const url = getSupabaseUrl();
    const key = getSupabaseKey();

    try {
      const res = await fetch(`${url}/rest/v1/tenants?select=*&order=created_at.desc`, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Accept-Profile': 'romantic-new-version',
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const mapped: Tenant[] = data.map((row: any) => {
            const rawConfig = row.config && typeof row.config === 'object' ? { ...row.config } : {};
            const baseConfig = sanitizeConfigUrls(rawConfig);
            const adminPass = (row.admin_password ?? row.adminPassword ?? baseConfig.adminPassword ?? '').trim();
            const sitePass = (row.site_password ?? row.sitePassword ?? baseConfig.sitePassword ?? '').trim();
            
            return {
              id: row.id || `tenant-${row.slug}`,
              slug: row.slug,
              name: row.name || (row.slug ? `موقع ${row.slug}` : 'موقع أميرتي'),
              adminPassword: adminPass,
              sitePassword: sitePass,
              createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString(),
              status: row.status ?? 'active',
              config: {
                ...baseConfig,
                adminPassword: adminPass,
                sitePassword: sitePass,
              },
            };
          });
          inMemoryTenants = mapped;
          try {
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('solaf_superadmin_tenants_cache', JSON.stringify(mapped));
            }
          } catch {}
          return mapped;
        }
      }
    } catch (err) {
      console.warn('[tenantStore] Sync error:', err);
    }
    return inMemoryTenants;
  }
};

export async function fetchTenantFromSupabaseDirect(slug: string): Promise<Tenant | null> {
  const cleanSlug = (slug || '').toLowerCase().trim();
  if (!cleanSlug) return null;

  // Check in-memory first for 0ms latency
  const inMem = inMemoryTenants.find((t) => t.slug.toLowerCase().trim() === cleanSlug);
  if (inMem && inMem.config && Object.keys(inMem.config).length > 2) {
    return inMem;
  }

  const url = getSupabaseUrl();
  const key = getSupabaseKey();

  try {
    const res = await fetch(`${url}/rest/v1/tenants?slug=eq.${encodeURIComponent(cleanSlug)}&select=*`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Accept-Profile': 'romantic-new-version',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const row = data[0];
        const rawConfig = row.config && typeof row.config === 'object' ? { ...row.config } : {};
        const baseConfig = sanitizeConfigUrls(rawConfig);
        const adminPass = (row.admin_password ?? row.adminPassword ?? baseConfig.adminPassword ?? '').trim();
        const sitePass = (row.site_password ?? row.sitePassword ?? baseConfig.sitePassword ?? '').trim();

        const mapped: Tenant = {
          id: row.id || `tenant-${row.slug}`,
          slug: row.slug,
          name: row.name || (row.slug ? `موقع ${row.slug}` : 'موقع أميرتي'),
          adminPassword: adminPass,
          sitePassword: sitePass,
          createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString(),
          status: row.status ?? 'active',
          config: {
            ...baseConfig,
            adminPassword: adminPass,
            sitePassword: sitePass,
          },
        };

        // Cache in memory
        const existingIdx = inMemoryTenants.findIndex((t) => t.slug.toLowerCase().trim() === cleanSlug);
        if (existingIdx >= 0) {
          inMemoryTenants[existingIdx] = mapped;
        } else {
          inMemoryTenants.push(mapped);
        }

        return mapped;
      }
    }
  } catch (e) {
    console.warn('[tenantStore] Supabase fetch error:', e);
  }

  return null;
}


