# KOL Copilot Project Brief

## Product Goal

KOL Copilot is a hackathon MVP for a protocol-aware conversational agent that helps pharma Medical Affairs and late-stage Clinical Development teams identify, rank, and engage the right external experts for Phase 3 and launch-readiness programs.

The product should answer:

> Given this clinical trial protocol, who are the most relevant KOLs, investigators, sites, and medical experts, why do they matter, and what compliant action should the Medical Affairs team take next?

## Core Domain Concepts

- **Phase 3 protocol:** A late-stage clinical trial document describing the investigational product, indication, study design, endpoints, inclusion/exclusion criteria, patient population, safety monitoring, and statistical plan.
- **Medical Affairs:** The non-promotional scientific function inside pharma that supports scientific exchange, evidence generation, external expert engagement, and launch readiness.
- **MSL:** Medical Science Liaison. A field-based scientific expert who engages healthcare professionals and KOLs in non-promotional scientific conversations.
- **KOL / KEE:** Key Opinion Leader / Key External Expert. A physician, researcher, investigator, guideline contributor, congress speaker, or emerging expert who is scientifically relevant to a therapeutic area.
- **Protocol-aware expert discovery:** Expert identification driven by the actual protocol attributes, not generic celebrity or prescribing-volume rankings.
- **Evidence-backed workflow:** Every recommendation should cite supporting evidence such as trials, publications, guidelines, congress activity, affiliations, or transparency records.
- **Compliance-safe workflow:** The system must avoid pre-approval promotional claims, prescribing-volume targeting, and sales language in Medical Affairs mode.

## Hackathon Positioning

This project is for a Conversational AI Hackathon. The strongest track fit is **Co-Pilot**:

> An ambient Medical Affairs co-pilot that listens to protocol discussions and instantly surfaces relevant KOLs, supporting evidence, and compliant next actions.

The demo should make retrieval feel instant and useful. The user should speak naturally, while the UI updates with ranked KOL cards, citations, compliance notes, and MSL-ready briefs.

## MVP Demo Flow

1. User uploads or selects a Phase 3 protocol PDF.
2. System parses the protocol and extracts key attributes:
   - indication
   - intervention
   - phase
   - patient population
   - geography
   - endpoints
   - inclusion/exclusion criteria
   - relevant specialties
3. User asks a voice question, for example:

   > Find the top infectious disease KOLs for this protocol. Prioritize vaccine trial experience, immunogenicity publications, and adult COVID study relevance.

4. Agent searches the knowledge base and retrieves matching expert evidence.
5. Agent ranks experts with an explainable scoring model.
6. UI displays ranked KOL cards with citations and rationale.
7. User asks a follow-up:

   > Why is Dr. X ranked above Dr. Y?

8. Agent explains the ranking using evidence.
9. User asks:

   > Draft a compliant MSL pre-call brief for Dr. X.

10. Agent generates:
    - scientific background
    - rationale for expert relevance
    - source citations
    - suggested non-promotional questions
    - compliance warnings

## Reference Protocol

Initial reference protocol:

- ClinicalTrials.gov document: `https://cdn.clinicaltrials.gov/large-docs/69/NCT04816669/Prot_000.pdf`
- Trial: Pfizer/BioNTech BNT162b2 COVID-19 vaccine
- Phase: 3
- Example extracted profile:
  - indication: COVID-19 prevention
  - intervention: BNT162b2 RNA-based COVID-19 vaccine
  - population: healthy adults 18-55
  - focus areas: safety, tolerability, immunogenicity
  - relevant specialties: infectious disease, vaccinology, immunology, clinical trial investigators

For a more pharma/KOL-friendly demo, it is acceptable to create a synthetic Phase 3 protocol in a field like oncology, lupus nephritis, obesity, or Alzheimer's disease.

## Knowledge Base Strategy

The protocol is the job description. The knowledge base is the talent pool.

Seed a small curated dataset around one indication. For hackathon speed, prefer 20-40 expert profiles and 50-150 evidence snippets instead of trying to build a comprehensive pharma data warehouse.

Useful public data sources:

- ClinicalTrials.gov investigators, sites, and trial records
- PubMed publications and abstracts
- Open Payments records for US physicians
- Congress abstracts and speaker rosters, if easy
- Guidelines and society pages, if available
- Institution and affiliation metadata

Minimum expert profile fields:

- name
- institution
- specialty
- geography
- publications
- clinical trial involvement
- congress or guideline activity
- Open Payments or transparency signals, if available
- evidence snippets with source URLs

## Ranking Model

Use an explainable scoring model. Keep it simple for the MVP:

```text
KOL Score =
  30% protocol match
+ 25% trial investigator experience
+ 20% publication relevance
+ 10% institution/site relevance
+ 10% congress/guideline influence
+  5% recency
- compliance/conflict risk adjustments
```

The exact weights can be hardcoded for the hackathon. The important part is that each score has visible evidence.

## Compliance Rules

The product must be framed as Medical Affairs software, not sales targeting.

Do not allow outputs like:

- "This doctor is likely to prescribe."
- "Target this physician before approval."
- "Use this KOL to drive commercial adoption."

Prefer outputs like:

- "This expert is scientifically relevant to the protocol."
- "This investigator has related trial experience."
- "This MSL conversation should remain non-promotional."
- "Suggested questions are for scientific exchange only."

Required guardrails:

- Medical Affairs mode by default
- citation-required recommendations
- no pre-approval promotional language
- no prescribing-volume targeting
- clear Medical/Commercial firewall
- audit trail for recommendations
- compliance warning section in generated briefs

## Technology Plan

Use the hackathon sponsors where they naturally fit:

- **LiveKit:** realtime voice conversation and audio session infrastructure
- **Moss:** realtime semantic search over protocol chunks, expert profiles, publications, trial records, and evidence snippets
- **Unsiloed:** parsing PDFs and unstructured protocol documents
- **TrueFoundry:** AI gateway, governance, model routing, and observability if available
- **AWS:** deployment, storage, and backend hosting
- **Qwen / Minimax:** optional voice/model tracks if useful

Suggested app architecture:

```text
Frontend
  - voice interface
  - protocol upload
  - live KOL cards
  - evidence drawer
  - compliance panel

Backend API
  - protocol parser
  - retrieval orchestration
  - expert ranking
  - compliance checker
  - MSL brief generator

Knowledge Base
  - protocol chunks
  - expert profiles
  - trial records
  - publication snippets
  - payment/transparency snippets
  - guideline/congress snippets

Voice + Agent Runtime
  - LiveKit audio session
  - LLM/tool orchestration
  - Moss retrieval calls
  - streaming UI updates
```

## What To Prioritize

Build one polished workflow:

1. Parse a protocol.
2. Ask a voice question.
3. Retrieve relevant KOL evidence.
4. Rank experts.
5. Show citations.
6. Generate a compliance-safe MSL pre-call brief.

Avoid spending hackathon time on:

- full pharma CRM integrations
- exhaustive data ingestion
- perfect entity resolution
- real production compliance review
- broad therapeutic-area support
- commercial prescriber targeting

## Demo Success Criteria

The demo should prove:

- a protocol can drive retrieval
- a voice agent can answer nuanced Medical Affairs questions
- recommendations are evidence-backed
- compliance guardrails are visible
- the workflow is more useful than a static KOL list

The strongest closing line:

> KOL Copilot turns "find the right doctors" into a compliant, explainable, protocol-aware workflow for Medical Affairs and Phase 3 teams.
