# Graph Report - FitAgent  (2026-04-30)

## Corpus Check
- 42 files · ~40,679 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 127 nodes · 119 edges · 9 communities detected
- Extraction: 77% EXTRACTED · 23% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.72)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 9|Community 9]]

## God Nodes (most connected - your core abstractions)
1. `AnalyzeMealRequest` - 6 edges
2. `WeeklyReportRequest` - 5 edges
3. `generate_weekly_report()` - 4 edges
4. `analyze_meal()` - 4 edges
5. `Dashboard()` - 4 edges
6. `Progress()` - 4 edges
7. `get_weather()` - 3 edges
8. `analyze_food()` - 3 edges
9. `weekly_report()` - 3 edges
10. `meal_analysis()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `AnalyzeMealRequest` --uses--> `Use Gemini to estimate macros from a food description.     Accepts Indian vegeta`  [INFERRED]
  backend\models\schemas.py → backend\routers\meals.py
- `get_weather()` --calls--> `fetch_weather()`  [INFERRED]
  backend\main.py → backend\services\weather_service.py
- `test_gemini()` --calls--> `stream_chat()`  [INFERRED]
  backend\test_gemini_service.py → backend\services\gemini_service.py
- `WeeklyReportRequest` --uses--> `F8 — Generate weekly correlation report using Gemini Flash`  [INFERRED]
  backend\models\schemas.py → backend\routers\reports.py
- `WeeklyReportRequest` --uses--> `Use Gemini to identify food and estimate macros from text description`  [INFERRED]
  backend\models\schemas.py → backend\routers\reports.py

## Communities

### Community 0 - "Community 0"
Cohesion: 0.16
Nodes (16): BaseModel, analyze_meal(), generate_weekly_report(), Use Gemini to estimate macros from food description, F8 — Generate weekly correlation insights, analyze_food(), Use Gemini to estimate macros from a food description.     Accepts Indian vegeta, find_correlations() (+8 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (10): DeficitDebtCard(), calcDebtPlan(), calcProteinGap(), formatWater(), getMilestoneStatus(), isToday(), todayStr(), HydrationBar() (+2 more)

### Community 2 - "Community 2"
Cohesion: 0.18
Nodes (8): Dashboard(), calcBMI(), calcProgressPercent(), calcWaterGoal(), calcWeeksToGoal(), calcWeightLost(), CustomTooltip(), Progress()

### Community 3 - "Community 3"
Cohesion: 0.25
Nodes (5): get_weather(), health_check(), Quick health check — also verifies Gemini key is loaded, Proxy for OpenWeatherMap — hides API key from frontend, fetch_weather()

### Community 4 - "Community 4"
Cohesion: 0.29
Nodes (6): Redirect to Strava OAuth, Handle Strava OAuth callback, Fetch recent Strava activities, strava_activities(), strava_auth(), strava_callback()

### Community 5 - "Community 5"
Cohesion: 0.33
Nodes (4): calcReadinessScore(), getReadinessLevel(), MorningCheckIn(), ReadinessCard()

### Community 6 - "Community 6"
Cohesion: 0.4
Nodes (3): Stream Gemini Flash response chunk by chunk using new google-genai SDK, stream_chat(), test_gemini()

### Community 7 - "Community 7"
Cohesion: 0.7
Nodes (4): getFoodEmoji(), searchFood(), searchOpenFoodFacts(), searchWithAI()

### Community 9 - "Community 9"
Cohesion: 1.0
Nodes (2): build_system_prompt(), chat()

## Knowledge Gaps
- **8 isolated node(s):** `Quick health check — also verifies Gemini key is loaded`, `Proxy for OpenWeatherMap — hides API key from frontend`, `Redirect to Strava OAuth`, `Handle Strava OAuth callback`, `Fetch recent Strava activities` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 9`** (3 nodes): `chat.py`, `build_system_prompt()`, `chat()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getReadinessLevel()` connect `Community 5` to `Community 1`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `analyze_meal()` connect `Community 0` to `Community 6`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `AnalyzeMealRequest` (e.g. with `Use Gemini to estimate macros from a food description.     Accepts Indian vegeta` and `F8 — Generate weekly correlation report using Gemini Flash`) actually correct?**
  _`AnalyzeMealRequest` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `WeeklyReportRequest` (e.g. with `F8 — Generate weekly correlation report using Gemini Flash` and `Use Gemini to identify food and estimate macros from text description`) actually correct?**
  _`WeeklyReportRequest` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `generate_weekly_report()` (e.g. with `weekly_report()` and `find_correlations()`) actually correct?**
  _`generate_weekly_report()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `analyze_meal()` (e.g. with `analyze_food()` and `meal_analysis()`) actually correct?**
  _`analyze_meal()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `Dashboard()` (e.g. with `calcWaterGoal()` and `calcWeightLost()`) actually correct?**
  _`Dashboard()` has 3 INFERRED edges - model-reasoned connections that need verification._