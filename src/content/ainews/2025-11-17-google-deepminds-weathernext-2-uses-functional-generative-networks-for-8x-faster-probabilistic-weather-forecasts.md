---
title: "Google DeepMind’s WeatherNext 2 Uses Functional Generative Networks For 8x Faster Probabilistic Weather Forecasts"
pubDate: 2025-11-17
description: "Google DeepMind’s WeatherNext 2 achieves 6.5% CRPS improvement over GenCast, delivering faster and more accurate probabilistic weather forecasts."
categories: ["AI News", "Machine Learning", "Applications"]
---

## Functional Generative Networks for Enhanced Weather Prediction

Google DeepMind has launched WeatherNext 2, an AI-powered global weather forecasting system now integrated into Google Search, Gemini, Pixel Weather, and Google Maps Platform, with upcoming Maps integration. This system leverages a new Functional Generative Network (FGN) architecture to generate probabilistic forecasts 8x faster than its predecessor.

WeatherNext 2 addresses the limitations of traditional numerical weather prediction (NWP) models, which struggle with computational cost and accurately representing forecast uncertainty. While NWP models rely on complex physics simulations, WeatherNext 2 utilizes a data-driven approach to directly model the distribution of possible weather outcomes, offering a scalable and efficient alternative.

### Why This Matters
Traditional weather models are computationally expensive and often struggle to quantify forecast uncertainty, leading to potentially costly errors in decision-making. WeatherNext 2’s FGN architecture offers a significant speedup and improved accuracy, crucial for applications ranging from personal planning to large-scale disaster preparedness. The improvement in CRPS of 6.5% demonstrates a tangible increase in forecast skill.

### Key Insights
- **FGN Architecture**: WeatherNext 2 utilizes a graph transformer ensemble with approximately 180 million parameters per model seed.
- **Epistemic vs. Aleatoric Uncertainty**: The system explicitly models both types of uncertainty – epistemic via a deep ensemble of models, and aleatoric through functional perturbations.
- **Marginal Training, Joint Structure**: Despite being trained only on per-location marginals, the model learns realistic joint spatial and cross-variable correlations.

### Practical Applications
- **Google Maps**: Improved weather forecasts directly integrated into Google Maps for more accurate travel planning.
- **Disaster Management**: More reliable probabilistic forecasts for better preparation and response to extreme weather events like tropical cyclones.
- **Pitfall**: Over-reliance on marginal CRPS without evaluating joint distributions could lead to underestimation of correlated risks.

**References:**
- https://www.marktechpost.com/2025/11/17/google-deepminds-weathernext-2-uses-functional-generative-networks-for-8x-faster-probabilistic-weather-forecasts/