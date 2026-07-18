// Medical Affairs Copilot — demo workspace data (plain script -> window.WS)
window.WS = {
  protocol: {
    id: 'RSV-PreF-301',
    nct: 'NCT05•••421',
    title: 'A Phase 3 Study of a Bivalent RSV Prefusion-F Vaccine in Adults ≥60',
    indication: 'Respiratory Syncytial Virus (RSV) — lower respiratory tract disease',
    intervention: 'Bivalent RSV prefusion-F subunit vaccine (single IM dose)',
    phase: '3',
    population: 'Community-dwelling adults aged ≥60, immunocompetent',
    enrollment: '24,800',
    geographies: ['US', 'EU', 'JP', 'AU'],
    specialties: ['Vaccinology', 'Infectious Disease', 'Geriatric Medicine', 'Pulmonology'],
    endpoints: [
      { type: 'Primary', text: 'Vaccine efficacy against RSV-confirmed LRTD (≥2 signs)' },
      { type: 'Secondary', text: 'Immunogenicity — neutralizing titers at day 30' },
      { type: 'Secondary', text: 'Safety & reactogenicity through 6 months' },
    ],
    inclusion: [
      'Age ≥ 60 years at enrollment',
      'Medically stable per investigator',
      'Able to provide informed consent',
    ],
    exclusion: [
      'Prior RSV vaccination of any kind',
      'Immunocompromising condition or therapy',
      'Acute febrile illness within 72h of dosing',
    ],
  },

  experts: [
    {
      rank: 1, id: 'marchetti',
      name: 'Dr. Elena Marchetti', institution: 'Karolinska Institutet',
      specialty: 'Vaccinology', geography: 'EU · Sweden',
      score: 92.4, status: 'validated', citations: 37,
      breakdown: [
        { label: 'Trial experience', value: 30, max: 30 },
        { label: 'Publication relevance', value: 24, max: 25 },
        { label: 'Guideline authorship', value: 18, max: 20 },
        { label: 'Recency', value: 12, max: 15 },
        { label: 'Congress activity', value: 8.4, max: 10 },
      ],
      rationale: 'Direct Phase 3 RSV prefusion-F trial leadership; authored evidence on the protocol\u2019s primary efficacy endpoint in older adults.',
    },
    {
      rank: 2, id: 'tanaka',
      name: 'Prof. Hideo Tanaka', institution: 'University of Tokyo',
      specialty: 'Infectious Disease', geography: 'APAC · Japan',
      score: 88.1, status: 'review', citations: 29,
      breakdown: [
        { label: 'Trial experience', value: 24, max: 30 },
        { label: 'Publication relevance', value: 25, max: 25 },
        { label: 'Guideline authorship', value: 14, max: 20 },
        { label: 'Recency', value: 14, max: 15 },
        { label: 'Congress activity', value: 9, max: 10 },
      ],
      rationale: 'Related trial experience in adult RSV; strong recent publication record relevant to the immunogenicity endpoint.',
    },
    {
      rank: 3, id: 'okonkwo',
      name: 'Dr. Amara Okonkwo', institution: 'Johns Hopkins',
      specialty: 'Geriatric Medicine', geography: 'NA · United States',
      score: 84.6, status: 'validated', citations: 22,
      breakdown: [
        { label: 'Trial experience', value: 21, max: 30 },
        { label: 'Publication relevance', value: 22, max: 25 },
        { label: 'Guideline authorship', value: 17, max: 20 },
        { label: 'Recency', value: 13, max: 15 },
        { label: 'Congress activity', value: 8, max: 10 },
      ],
      rationale: 'Authored geriatric immunization guidance directly relevant to the ≥60 population; active in related LRTD research.',
    },
  ],

  evidence: {
    marchetti: [
      { refId: '1', title: 'Efficacy of a bivalent RSV prefusion F vaccine in older adults', source: 'N Engl J Med', year: '2024', relevance: 'Directly supports the protocol\u2019s primary efficacy endpoint (RSV-confirmed LRTD) in adults ≥60.' },
      { refId: '2', title: 'Neutralizing antibody responses to RSV prefusion F immunization', source: 'Lancet Infect Dis', year: '2023', relevance: 'Establishes day-30 immunogenicity readouts referenced in the secondary endpoint.' },
      { refId: '3', title: 'Safety and reactogenicity of subunit RSV vaccines in the elderly', source: 'Clin Infect Dis', year: '2022', relevance: 'Relevant safety dataset for the ≥60 immunocompetent population.' },
    ],
  },

  transcript: [
    { role: 'user', text: 'Find infectious-disease and vaccinology KOLs with direct experience relevant to this RSV Phase 3 protocol.' },
    {
      role: 'assistant',
      text: 'I ranked experts by scientific relevance to RSV-PreF-301 — weighting direct Phase 3 trial experience, publication relevance to the primary endpoint, and guideline authorship. The top match is Dr. Elena Marchetti, who led prefusion-F efficacy work in adults ≥60 [1] and contributed to the immunogenicity evidence base [2].',
      cites: ['1', '2'],
    },
  ],

  suggested: [
    'Compare the top two experts on trial experience',
    'Which experts have related RSV-LRTD publications?',
    'Draft a non-promotional pre-call brief for Dr. Marchetti',
  ],
};
