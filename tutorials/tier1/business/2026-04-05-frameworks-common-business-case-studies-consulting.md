# Frameworks for Common Business Case Studies in Consulting

Consulting case studies test your ability to structure ambiguous business problems, apply the right mental models, and communicate a clear recommendation. This passage covers the frameworks you will encounter most frequently at top firms—McKinsey, BCG, Bain, and their peers—and how to apply them under pressure.

## The Issue Tree: Your Foundation for Everything

Before any framework, you need a logical issue tree. It decomposes the client's problem into mutually exclusive, collectively exhaustive (MECE) branches. Start with a **hypothesis**, then build the tree to test it.

A strong issue tree answers: *"Why might this be happening?"* not *"What data do we have?"*

## 1. Profitability Cases

When a client asks *"Why are our margins declining?"* or *"How do we improve profitability?"*, profitability is almost always decomposed into **revenue** and **cost**.

### Revenue Decomposition

```
Revenue = Volume × Price
Volume = Market Size × Market Share
Price = Average Selling Price (ASP) or Price per Unit
```

Drill into each lever:

- **Volume decline?** Check market share trends, competitive dynamics, customer churn, or geographic coverage.
- **Price pressure?** Segment by customer, product, or channel. Compare to competitors and value perception.

### Cost Decomposition

```
Total Cost = Fixed Cost + Variable Cost
Unit Cost = Fixed Cost / Volume + Variable Cost per Unit
```

Common cost drivers: raw materials, labor, overhead, logistics, and SG&A. Identify which bucket is driving margin compression.

### Profitability Framework (Porter's Value Chain)

Use Porter's five primary activities to find cost leaks:

1. Inbound logistics
2. Operations (manufacturing / delivery)
3. Outbound logistics
4. Marketing & Sales
5. Service

Supporting activities: Firm infrastructure, Human resources, Technology, Procurement.

### Real-World Example: Starbucks Margin Decline

**Situation:** Starbucks reports that its operating margin dropped from 22% to 15% in Q3 2024. The CEO hires McKinsey to diagnose the root cause.

**Applying the framework:**

- **Revenue side:** Volume grew 2% (new store openings) but same-store sales fell 3%. ASP declined 4% due to aggressive discounting in response to competitor price wars. The real issue: discounting is eroding revenue per transaction faster than new store openings can compensate.
- **Cost side:** Raw material costs (coffee beans) rose 18% due to supply chain disruptions. Labor costs increased as stores hired more staff to handle mobile order volume. Rent and overhead per square foot climbed in urban locations.
- **Value chain diagnosis:** Inbound logistics (shipping delays causing premium bean substitutions), operations (mobile order complexity slowing throughput), and marketing & sales (heavy discounting) are the three primary cost-leak points.

**Recommendation:** Stop reactive discounting and invest in loyalty program differentiation instead. Renegotiate supplier contracts for fixed-price coffee bean agreements. Redesign the mobile order workflow to reduce per-store labor overhead.

---

## 2. Market Sizing (Guesstimate) Cases

*"How many tennis rackets are sold in the US per year?"*

### Top-Down Approach

Start with the total population and apply a series of filters:

```
US Population: ~330M
× % in target demographic (e.g., adults who play tennis): ~10%
= Addressable population: ~33M
× Purchase frequency (e.g., replace racket every 3 years): 0.33
= Annual market demand: ~11M units
× Average price: ~$150
= Market size: ~$1.6B
```

### Bottom-Up Approach

Build from known data points:

```
Number of tennis courts in the US: ~260,000
× Average players per court per week: ~10
× Active weeks per year: ~30
= Total player-sessions per year
× Conversion to purchase (1 in 10 per year): X
= Annual units sold
```

### Sanity Checks

Always cross-check against known benchmarks. If your bottom-up gives $5B and the top-down gives $1.6B, investigate the gap. Use industry reports (NPD Group, Statista) as anchors.

### Real-World Example: The Electric Scooter Market in Paris

**Prompt:** *"Size the e-scooter sharing market in Paris."*

**Top-down approach:**

- Paris metropolitan population: ~12M
- Target demographic (18–55, urban commuters): ~40% = 4.8M
- % who would consider micro-mobility for last-mile commute: ~20% = ~960K
- Of those, % willing to use a shared e-scooter service: ~35% = ~336K
- Average rides per user per month: ~8
- Average fare: ~€2.50 per ride
- Annual market size: 336K × 8 × 12 × €2.50 = ~€80M

**Bottom-up approach:**

- Paris currently has ~15,000 licensed shared e-scooters on the street
- Average daily rides per scooter: ~3.5
- Days active per year: ~300
- Total annual rides: 15,000 × 3.5 × 300 = ~15.75M rides
- At €2.50 average fare: ~€39M

**Sanity check:** The gap between top-down (~€80M) and bottom-up (~€39M) is large. Adjust the top-down assumption — not everyone willing to *consider* micro-mobility will actually use it. A more realistic penetration rate of ~20% brings the top-down to ~€58M. The market is likely in the €40–60M range, validating the bottom-up as the anchor.

---

## 3. Market Entry Cases

*"Should we enter market X?"*

Use a structured **3-phase evaluation**:

### Phase 1 — Attractiveness

- Market size and growth rate (CAGR)
- Profitability structure (are margins healthy?)
- Competitive intensity (how fragmented? how entrenched?)
- Regulatory environment
- Macroeconomic stability

### Phase 2 — Accessibility

- Do you have the right capabilities and assets?
- Distribution channel availability
- Brand recognition and customer acquisition cost
- Competitive barriers (patents, switching costs, network effects)

### Phase 3 — Feasibility

- Financial commitment vs. risk profile
- Internal resource capacity
- Alignment with strategic priorities
- Timeline to profitability

### Competitive Positioning (Porter's Generic Strategies)

Choose a clear position before entering:

| Strategy | Description |
|---|---|
| Cost Leadership | Compete on price through scale or efficiency |
| Differentiation | Unique product or service that commands a premium |
| Cost Focus | Cost leadership in a niche segment |
| Differentiation Focus | Differentiation in a niche segment |

### Real-World Example: Disney+ Entering Southeast Asia

**Situation:** Disney+ is evaluating entry into Vietnam, Philippines, and Thailand — three distinct Southeast Asian markets with combined populations of ~200M.

**Phase 1 — Attractiveness:**

- Streaming market in SEA is growing at ~18% CAGR, projected to reach $12B by 2028.
- Profitability is thin — local players like iQIYI and Viu operate on low ARPU (average revenue per user) of $3–5/month.
- Competitive intensity is high: Netflix, Viu, WeTV, and local telco-backed platforms are already entrenched.
- Regulatory environment varies: Vietnam has strict content licensing requirements; Thailand has moderate oversight.

**Phase 2 — Accessibility:**

- Disney's content library (Marvel, Star Wars, Pixar) is a strong differentiator — existing fans in these markets already consume Disney content via VPNs.
- Distribution challenge: payment infrastructure is fragmented (e-carrier billing preferred over credit cards in these markets).
- Brand recognition is moderate — Disney is known, but Disney+ as a streaming product is not yet established.

**Phase 3 — Feasibility:**

- Estimated investment: $150M over 3 years (localization, content licensing, partnerships with telcos).
- Internal capacity: feasible with a lean regional team.
- Strategic fit: aligned with Disney's long-term goal of 230–260M global subscribers.

**Recommendation:** Enter Vietnam and Thailand via telco partnerships to reduce customer acquisition cost and leverage existing billing infrastructure. Position with a **differentiation focus** strategy — bundle Marvel and Star Wars exclusives to command a premium over local players. Philippines can follow in year 2 after learning from the first two launches.

---

## 4. Growth Cases

*"How can we grow 20% next year?"*

The **Ansoff Matrix** provides four growth vectors:

| | Existing Product | New Product |
|---|---|---|
| **Existing Market** | Market Penetration (gain share, increase frequency) | Product Development (new features, variants) |
| **New Market** | Market Development (new geographies, segments) | Diversification |

### Beyond Ansoff — Growth Levers to Consider

- **Geographic expansion** — domestic to international, tier-1 to tier-2 cities
- **Customer segmentation shift** — B2B to SMB, or vice versa
- **Pricing optimization** — bundling, premium tiers, dynamic pricing
- **Channel expansion** — direct to digital, partnership channels
- **Adjacent category entry** — leverage existing brand and capabilities into a new category
- **M&A** — acquire competitors or complementary businesses

For each lever, assess: *What is the incremental revenue? What is the investment required? What is the time to scale?*

### Real-World Example: Shopify's 30% Revenue Growth Plan

**Situation:** Shopify needs to grow revenue by 30% next fiscal year. Current revenue is $7B. BCG is engaged to build the growth plan.

**Applying Ansoff:**

- **Market Penetration (Existing product, existing market):** Upsell existing merchants to higher-tier plans. 40% of Shopify's 2M+ merchants are on Basic plans ($29/mo). Converting 10% to Shopify Plus ($2,000+/mo) would generate ~$200M incremental ARR.
- **Product Development (New product, existing market):** Launch Shopify AI tools (product description generator, demand forecasting). Charge $50/mo as an add-on. 15% adoption among existing merchants = ~$300M incremental revenue.
- **Market Development (Existing product, new market):** Expand into Brazil, Mexico, and Indonesia — high e-commerce growth markets with few local competitors to Shopify. Partner with local payment processors. Target: 500K new merchants in 12 months = ~$150M incremental revenue.
- **Diversification (New product, new market):** Launch Shopify Capital (merchant cash advances) and Shopify Balance (business banking). New revenue stream, new customer segment (underserved SMBs). Estimated contribution: $80M in year 1.

**Recommendation:** Prioritize market penetration and product development (highest ROI, lowest execution risk). Execute geographic expansion in parallel but with a smaller initial investment. Treat diversification as a 12–18 month initiative.

---

## 5. Competitive Strategy Cases

*"Our competitor just launched X. What do we do?"*

Use the **3C Framework**: Company, Competitor, Customer.

### Company (Your strengths and weaknesses)

- What does your current capability allow?
- What would it cost to respond?
- What is your brand positioning?

### Competitor

- What is their objective with this move?
- How sustainable is their advantage?
- What is their track record with similar moves?

### Customer

- What do customers actually want?
- How price-sensitive is the segment they are targeting?
- Is the competitor solving an unmet need, or fighting for existing share?

### Response Options

1. **Do nothing** — if the move is not threatening your core
2. **Match** — if it is a table-stakes capability
3. **Differentiate** — go deeper on the dimension they entered
4. **Counter-attack** — enter their home territory
5. **Partner or Acquire** — neutralize the threat through consolidation

### Real-World Example: Apple Watch vs. Samsung's Health-First Smartwatch

**Situation:** Samsung launches the Galaxy Watch Ultra with advanced blood pressure monitoring, ECG, and a $599 price tag — directly targeting Apple's health leadership. Apple engages Bain to advise on response.

**3C Analysis:**

- **Company (Apple):** Apple Watch holds 30%+ market share in wearables. Health features (ECG, fall detection) are already core to Apple Watch's brand. However, blood pressure monitoring is a gap — Apple Watch does not yet have it. Responding would require hardware iteration.
- **Competitor (Samsung):** Samsung's health sensor differentiation is real but not yet overwhelming. Blood pressure monitoring accuracy has faced regulatory scrutiny in the US (FDA clearance pending in some features). Samsung is trying to move upmarket from fitness trackers into premium health devices.
- **Customer:** High-income health-conscious consumers aged 35–55 are the target segment. They care about accuracy and ecosystem integration. Price sensitivity is moderate — they will pay a premium for trusted health data.

**Response Options Evaluated:**

1. **Do nothing?** — Not viable. Blood pressure monitoring is a high-visibility feature that drives consumer headlines and reviews.
2. **Match?** — Add blood pressure monitoring in the next Apple Watch revision. This is table-stakes but necessary.
3. **Differentiate?** — Go deeper than Samsung by integrating the blood pressure data with Apple's Health app ecosystem, providing longitudinal trend analysis and doctor communication features that Samsung lacks.
4. **Counter-attack?** — Enter Samsung's home market (Android ecosystem) by deepening partnerships with Samsung Galaxy stores and offering exclusive Apple TV+ bundles on Samsung devices.
5. **Partner or Acquire?** — Acquire a blood pressure sensor startup (e.g., Withings) to accelerate hardware development.

**Recommendation:** Pursue a **Match + Differentiate** strategy. Add blood pressure monitoring to Apple Watch Series 11 within 12 months. Simultaneously invest in a differentiated health AI layer — personalized health insights from longitudinal data that Samsung's app cannot match. Avoid a price war. Monitor Samsung's FDA clearance timeline closely.

---

## 6. Operational Cases

*"How do we improve efficiency?"*

Common frameworks:

### The 6 Sigma / Lean DMAIC Process

1. **Define** — What is the problem?
2. **Measure** — What is the current state?
3. **Analyze** — What is causing the problem?
4. **Improve** — Develop and test solutions
5. **Control** — Sustain the improvements

### Value Chain Analysis

Map every step from supplier input to customer delivery. Identify:

- Steps with the most wait time or rework
- Hand-offs that add cost without adding value
- Bottlenecks that constrain throughput

### The Theory of Constraints (TOC)

Find the single constraint that limits throughput (the bottleneck), exploit it, subordinate everything else to it, then repeat. Useful for quick wins in operational restructuring.

### Real-World Example: Amazon Logistics — Reducing Last-Mile Delivery Time

**Situation:** Amazon's regional hub in Dallas is experiencing average delivery times of 2.8 days for Prime orders, while the target is 1.5 days. McKinsey is engaged to cut delivery time by 45%.

**DMAIC Application:**

1. **Define:** Average last-mile delivery time exceeds target by 1.3 days. Customer complaints about "late delivery" are up 22% QoQ.
2. **Measure:** Map the delivery process end-to-end. Current state:
   - Order received → Sorting center: 4 hours
   - Sorting center → Out-for-delivery scan: 18 hours (overnight hold due to route planning)
   - Out-for-delivery → Customer doorstep: 4–8 hours
3. **Analyze:** The 18-hour overnight hold at the sorting center is the largest wait time. Root cause: routes are optimized once per day, not dynamically. Drivers leave at 8 AM; packages arriving from upstream hubs after 9 AM sit overnight.
4. **Improve:** Implement dynamic route re-optimization every 4 hours. Add a second driver shift at 2 PM. Invest in predictive arrival modeling to stage packages at nearby delivery stations before the sort is complete.
5. **Control:** Dashboard monitoring of daily delivery time, alert thresholds at 1.8 days, weekly root cause reviews.

**TOC Application (focused intervention):**

- **Constraint identified:** The overnight hold at the sorting center. All other improvements are subordinate to fixing this bottleneck.
- **Exploit:** Prioritize packages with delivery promise of ≤2 days for immediate sort-and-route, bypassing the queue.
- **Subordinate:** Reallocate driver capacity so afternoon shifts handle overflow, not just morning routes.
- **Result:** Delivery time drops to 1.4 days — below target — within 60 days.

---

## 7. Mergers & Acquisitions Cases

*"Should we acquire this company?"*

The standard M&A framework:

### Strategic Rationale

- Does the target fit your core business or open a new growth vector?
- Is now the right time (market cycle, valuation)?
- Are there synergies—cost or revenue—that justify a premium?

### Valuation

- **DCF (Discounted Cash Flow):** Project free cash flows, apply a discount rate, derive NPV
- **Comparable company analysis (Comps):** Apply multiples (EV/EBITDA, P/E) from similar public companies
- **Precedent transactions:** Apply multiples from recent M&A deals in the same sector
- **LBO (Leveraged Buyout):** Model how much debt the acquisition can support at various purchase prices

### Integration Risk

- Cultural compatibility
- Retention of key talent
- Technology and systems integration
- Regulatory and antitrust concerns

### Real-World Example: Microsoft Acquiring Nuance Communications ($19.7B, 2021)

**Strategic Rationale:**

- Nuance (healthcare AI — transcription, clinical documentation) generated $1.4B in revenue with strong recurring contracts across 77% of US hospitals.
- Fit: Deeply complementary to Microsoft's Cloud for Healthcare. Nuance's Dragon Medical One integrates natively with Microsoft Teams and Azure. This opens a new growth vector in clinical AI rather than diluting Microsoft's core.
- Timing: Nuance's stock had underperformed post-COVID as growth slowed, making it attractively priced at ~8× EV/Revenue versus SaaS peers at 15–20×.

**Valuation:**

- **DCF:** Based on Nuance's existing contracts (90%+ gross margins on SaaS products) and a 5-year projection, DCF implied an intrinsic value of ~$22B.
- **Comps:** Comparable health-tech SaaS companies traded at 8–12× revenue. At $19.7B acquisition price, Microsoft paid ~9× trailing revenue — at the upper end but defensible given the moat in clinical documentation.
- **Precedent transactions:** Recent healthcare AI deals (e.g., Amazon acquiring Health Navigator) had been at similar 8–10× revenue multiples.
- **LBO:** Not the right model here — this was a strategic acquisition, not a financial sponsor-led buyout.

**Synergy Case:**

- Cost synergies: Combined Microsoft-Nuance sales force, eliminating redundant G&A — estimated $200M over 3 years.
- Revenue synergies: Cross-selling Nuance into Microsoft's 168K enterprise customers with Azure contracts — estimated $400M incremental revenue by year 5.

**Integration Risk Assessment:**

- **Cultural:** Nuance was a niche healthcare software company; Microsoft is a massive enterprise platform company. Risk: Nuance's talent may feel absorbed and leave.
- **Retention:** Microsoft committed to retaining Nuance's leadership and brand independence — a deliberate cultural hedge.
- **Technology integration:** Nuance's existing integrations with Epic and Cerner (EHR systems) needed to be maintained — Microsoft pledged investment to keep those relationships intact.
- **Regulatory:** The deal received DOJ approval without a challenge — healthcare AI was not yet a heavily regulated M&A space.

**Recommendation:** Proceed with the acquisition at $19.7B. Strategic rationale is strong, synergies are defensible, and integration risk is manageable given the brand-independent operating model Microsoft committed to.

---

## Structuring Your Recommendation

Every case should close with a clear recommendation. A strong recommendation:

1. **States the answer upfront** — *"You should acquire Company X."*
2. **Gives 3–4 supporting reasons** — structured by impact and urgency
3. **Acknowledges risks** — shows commercial judgment
4. **Outlines next steps** — demonstrates execution mindset

## The 80/20 Rule in Structuring

In most cases, 80% of the problem is explained by 20% of the causes. Your job is to find that 20% quickly. Use the pyramid principle: **summarize first, then support with evidence.** Your interviewer or client wants to know the answer before they want to know how you got there.

## Common Pitfalls

- **Forgetting the client context.** A brilliant generic answer that ignores the client's specific situation will fail.
- **Over-indexing on frameworks.** Frameworks are scaffolding, not the answer. Let the data guide you.
- **Failing to MECE.** If your branches overlap or leave gaps, you will miss key drivers.
- **Not sanity-checking math.** Guesstimate answers that are off by an order of magnitude destroy credibility.
- **Skipping the "so what?"** Every insight needs an implication. *"Market is $10B"* is not a recommendation.
