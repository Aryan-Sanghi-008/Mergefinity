# Post-Launch Roadmap (P-20)

## Launch process

1. **EAS production build** — `eas build --profile production` (Android `.aab`, upload keystore in EAS secrets).
2. **Internal testing** — dogfood on the internal track for **3 days**; zero P0 bugs before production promotion.
3. **Staged rollout**
   - Day 1: **10%**
   - Day 3: **25%** if crash-free sessions **>99%**
   - Day 5: **50%**
   - Day 7: **100%**
4. **Analytics** — verify all eight events in Firebase DebugView before 100% (see `docs/ANALYTICS_EVENTS.md`).
5. **Git** — tag `1.0.0`; keep release notes in `CHANGELOG.md`.
6. **Crashlytics** — email alerts for crash-rate spikes above **1%**.

## Definition of done (ops)

| Criterion | Target |
|-----------|--------|
| Crash-free sessions (day 1 production) | **>99.5%** |
| Analytics events in DebugView | All 8 within first hour |
| Rating prompt | After **3rd** lifetime win only (`RATING_PROMPT_AFTER_WINS`) |

## Version roadmap

| Version | Timeline | Feature |
|---------|----------|---------|
| v1.1 | 2 weeks post-launch | Daily Challenge — one board per day; seed from date so all players share the start |
| v1.2 | 6 weeks post-launch | Share Score — shareable final-board image + native share sheet |
| v1.3 | 10 weeks post-launch | iOS release (Expo managed / CNG) |
| v1.4 | 12 weeks post-launch | Leaderboard — Firebase Realtime Database + optional Play Games; weekly top 100 per mode |
| v2.0 | 6 months post-launch | Multiplayer race — shared seed, first to 2048; gate on retention data |

Amend `docs/MERGEFINITY_GAME_PLAN.md` before implementing any post-1.0 feature that is not already scoped above.
