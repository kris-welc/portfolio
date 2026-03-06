export function DualLayerRegimeContent() {
  return (
    <>
      <h2>The Problem Every Automated System Has</h2>
      <p>
        Every system that makes decisions in a changing environment runs on
        assumptions about current conditions. A recommendation engine tuned for
        normal browsing patterns. An autoscaler calibrated for steady growth. An
        ML model trained on one data distribution. A content moderation pipeline
        tuned for English text.
      </p>
      <p>
        When conditions change, these assumptions break. The standard solution is
        a regime detector &mdash; a classifier that tells you which condition
        you&rsquo;re in so you can switch strategies. But here&rsquo;s the
        question nobody asks: <em>&ldquo;Are we <strong>transitioning</strong>{" "}
        between modes right now?&rdquo;</em>
      </p>
      <p>
        Transitions are where the damage happens. Your classifier still says
        &ldquo;NORMAL&rdquo; because it hasn&rsquo;t seen enough data to
        reclassify, but the old regime ended 3 data points ago. You&rsquo;re
        making normal-mode decisions in a system that&rsquo;s already in crisis.
      </p>
      <blockquote>
        <p>
          One detector tells you what mode you&rsquo;re in. You need a second
          detector to tell you when you&rsquo;re leaving it.
        </p>
      </blockquote>

      <h2>Why This Matters for You</h2>
      <p>
        If you run any system that adapts its behavior to conditions &mdash;
        scaling policies, model retraining triggers, feature flags, agent
        confidence thresholds &mdash; you have this problem. The two-layer
        pattern applies directly:
      </p>
      <ul>
        <li>
          <strong>ML model monitoring</strong> &mdash; Layer 1: what distribution
          is the data in? Layer 2: is the distribution shifting right now? Catch
          model drift 1-3 batches before accuracy drops.
        </li>
        <li>
          <strong>Infrastructure scaling</strong> &mdash; Layer 1: what traffic
          pattern are we in (steady, ramp, spike)? Layer 2: are we transitioning?
          Scale conservatively during transitions instead of overcommitting.
        </li>
        <li>
          <strong>A/B tests and feature flags</strong> &mdash; Layer 1: what user
          behavior mode are we in? Layer 2: did a regime change just invalidate
          our test? Pause the test during transitions.
        </li>
        <li>
          <strong>Autonomous agents</strong> &mdash; Layer 1: what task complexity
          regime is the agent in? Layer 2: did the problem difficulty just shift?
          Adjust confidence thresholds before the agent overcommits.
        </li>
        <li>
          <strong>Alerting systems</strong> &mdash; Layer 1: what&rsquo;s the
          baseline error rate? Layer 2: is the baseline itself changing? Prevents
          alert fatigue from threshold drift.
        </li>
      </ul>

      <hr />

      <h2>Layer 1: Classifying What Mode You&rsquo;re In</h2>

      <h3>The Efficiency Ratio</h3>
      <p>
        The core idea is embarrassingly simple: <strong>how much of the total
        movement was productive?</strong> Divide net displacement by total path
        length. A value of 1.0 means every step moved in the same direction (pure
        signal). A value near 0 means the system went nowhere despite lots of
        movement (pure noise).
      </p>
      <pre><code>{`# The formula
ER = |end_value - start_value| / sum_of_all_step_sizes

# Concrete examples over 20 data points:
# Steady increase of 10 units:  ER = 10/10 = 1.0   → TREND (strong signal)
# Up 5, down 5 repeatedly:     ER = 0/10 = 0.0    → DEEP_CHOP (pure noise)
# Slow drift up 3 total:       ER = 3/12 = 0.25   → NORMAL`}</code></pre>
      <p>
        This works for any time series &mdash; server response times, user
        engagement metrics, error rates, model accuracy over time, request
        latency. If you can plot it on a line chart, you can compute ER.
      </p>

      <h3>Why Five Tiers Instead of Two</h3>
      <p>
        Binary classification (signal vs noise) throws away information. There
        are meaningfully different behaviors at different ER levels. Five
        graduated tiers let you respond proportionally:
      </p>
      <table>
        <thead>
          <tr>
            <th>Regime</th>
            <th>ER Range</th>
            <th>Confidence</th>
            <th>What It Means</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>TREND</code></td>
            <td>&ge; 0.35</td>
            <td>100%</td>
            <td>Strong directional signal. Full confidence in decisions.</td>
          </tr>
          <tr>
            <td><code>NORMAL</code></td>
            <td>0.20 &ndash; 0.35</td>
            <td>85%</td>
            <td>Some direction but noisy. Slightly cautious.</td>
          </tr>
          <tr>
            <td><code>VOLATILE</code></td>
            <td>&lt; 0.20, high variance</td>
            <td>70%</td>
            <td>Big movements, no direction. Widen safety margins.</td>
          </tr>
          <tr>
            <td><code>LIGHT_CHOP</code></td>
            <td>0.10 &ndash; 0.20</td>
            <td>60%</td>
            <td>Mostly noise. Block optimistic actions entirely.</td>
          </tr>
          <tr>
            <td><code>DEEP_CHOP</code></td>
            <td>&lt; 0.10</td>
            <td>50%</td>
            <td>Pure noise. Require extreme confirmation to act.</td>
          </tr>
        </tbody>
      </table>

      <h3>The Asymmetry Discovery</h3>
      <p>
        An interesting finding from production data: <strong>defensive actions
        work in noisy regimes, optimistic ones don&rsquo;t</strong>. Pessimistic
        indicators during LIGHT_CHOP had significantly higher accuracy than
        optimistic ones &mdash; which were barely better than random.
      </p>
      <p>
        This makes intuitive sense across domains. Defensive actions are driven
        by urgency, which cuts through noise. Optimistic actions are driven by
        hope, which doesn&rsquo;t. In a noisy environment, urgency-driven
        decisions still follow through. Hope-driven decisions get lost in the
        noise.
      </p>
      <pre><code>{`REGIME_CONFIG = {
    "TREND":      {"confidence": 1.0,  "confirms": 1},
    "NORMAL":     {"confidence": 0.85, "confirms": 1},
    "VOLATILE":   {"confidence": 0.70, "confirms": 2},
    "LIGHT_CHOP": {"confidence": 0.60, "confirms": 1,
                   "optimistic_confirms": 99},  # blocks optimistic actions
    "DEEP_CHOP":  {"confidence": 0.50, "confirms": 3},
}`}</code></pre>

      <hr />

      <h2>Layer 2: Catching the Moment Conditions Change</h2>

      <h3>Adaptive Windowing (ADWIN)</h3>
      <p>
        ADWIN was designed for streaming data: it continuously monitors a data
        stream and fires when it detects that the recent data comes from a
        different distribution than the older data. The key advantage over
        rolling windows: <strong>ADWIN adapts its window size
        automatically</strong>. During stable periods, it grows the window
        (accumulating statistical power, reducing false positives). When it
        detects a shift, it shrinks the window (responding quickly to the new
        reality).
      </p>

      <h3>Why Two Detectors</h3>
      <p>
        Conditions can change in two ways: the average changes (new baseline) or
        the variability changes (calm to volatile). We run two independent ADWIN
        detectors:
      </p>
      <ul>
        <li>
          <strong>Level detector</strong> (<code>delta=0.002</code>, more
          sensitive) &mdash; catches shifts in the <em>mean</em>. Detects when
          the center of the distribution moves.
        </li>
        <li>
          <strong>Variance detector</strong> (<code>delta=0.02</code>, less
          sensitive) &mdash; catches shifts in the <em>spread</em>. Detects when
          the variability changes.
        </li>
      </ul>

      <h3>The Transition Ramp</h3>
      <p>
        When ADWIN fires, we don&rsquo;t instantly switch behavior. Instead, we
        apply a <strong>graduated uncertainty haircut</strong> that ramps from
        60% back to 100% over 3 data points:
      </p>
      <pre><code>{`class DriftDetector:
    def confidence_modifier(self) -> float:
        """How much to trust our current strategy.
        Returns 1.0 when stable, less during transitions."""
        if self.steps_since_drift == 0:  return 0.60  # just detected shift
        elif self.steps_since_drift == 1: return 0.75  # still uncertain
        elif self.steps_since_drift <= 3: return 0.90  # settling down
        return 1.0                                      # stable again`}</code></pre>
      <p>
        This is critical: <strong>the transition period is the most dangerous
        time</strong>. The old assumptions are stale but the new regime
        hasn&rsquo;t been confirmed yet. Reducing confidence during this window
        prevents the biggest mistakes.
      </p>

      <hr />

      <h2>How the Two Layers Compose</h2>
      <p>
        The two layers multiply together. This means they&rsquo;re independent
        &mdash; neither needs to know about the other:
      </p>
      <pre><code>{`# Layer 1: what regime are we in? → base confidence
regime = classify_regime(efficiency_ratio, variance_percentile)
base_confidence = REGIME_CONFIG[regime]["confidence"]

# Layer 2: are we transitioning? → uncertainty modifier
transition_mod = drift_detector.confidence_modifier()

# Composite confidence
effective_confidence = base_confidence * transition_mod`}</code></pre>

      <h3>Worked Example</h3>
      <pre><code>{`# Scenario: system transitioning from NORMAL to TREND

# Time T (drift detected):
#   ER still says NORMAL       → base = 0.85
#   ADWIN says "something changed" → mod = 0.60
#   Effective: 0.85 × 0.60 = 0.51  (conservative — good)

# Time T+1:
#   ER still says NORMAL       → base = 0.85
#   ADWIN ramping              → mod = 0.75
#   Effective: 0.85 × 0.75 = 0.64  (recovering)

# Time T+3 (ER catches up):
#   ER now says TREND           → base = 1.0
#   ADWIN almost settled        → mod = 0.90
#   Effective: 1.0 × 0.90 = 0.90  (near full confidence)

# Time T+4:
#   ER says TREND               → base = 1.0
#   ADWIN settled               → mod = 1.0
#   Effective: 1.0 × 1.0 = 1.0    (full confidence)`}</code></pre>
      <p>
        The system is naturally most conservative when it matters most: during
        transitions in noisy conditions. And most confident when conditions are
        stable and trending. No manual rules needed &mdash; this falls out of the
        multiplication.
      </p>

      <hr />

      <h2>How to Apply This to Your System</h2>
      <p>
        The pattern is the same regardless of domain:
      </p>
      <ol>
        <li>
          <strong>Pick your efficiency metric</strong> &mdash; what time series
          represents the &ldquo;health&rdquo; of your system? Request latency,
          model accuracy, user engagement, error rate.
        </li>
        <li>
          <strong>Compute the efficiency ratio</strong> over a rolling window.
          This gives you the structural classification (trending, normal, noisy).
        </li>
        <li>
          <strong>Run ADWIN on the same stream</strong> to detect transitions.
          You get early warning before the ER reclassifies.
        </li>
        <li>
          <strong>Multiply the two</strong> to get a composite confidence score
          that your system uses to modulate its behavior &mdash; scaling
          aggressiveness, alert thresholds, model retraining triggers, agent
          autonomy.
        </li>
      </ol>

      <hr />

      <h2>Results from Production</h2>
      <p>
        Validated across 5 walk-forward evaluation passes (no lookahead bias):
      </p>
      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Value</th>
            <th>Why It Matters</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Monte Carlo confidence</td>
            <td>98.3%</td>
            <td>Probability the system is effective, not lucky</td>
          </tr>
          <tr>
            <td>Avg improvement per pass</td>
            <td>+25.0%</td>
            <td>Consistent across different time windows</td>
          </tr>
          <tr>
            <td>Max drawdown</td>
            <td>17.8%</td>
            <td>Survived every regime transition</td>
          </tr>
          <tr>
            <td>Noisy regime accuracy</td>
            <td>1.84x baseline</td>
            <td>Effective in the conditions most systems fail</td>
          </tr>
          <tr>
            <td>Trending regime accuracy</td>
            <td>1.98x baseline</td>
            <td>Captures opportunities when confirmed</td>
          </tr>
        </tbody>
      </table>
      <p>
        The noisy regime accuracy of 1.84x baseline is the headline number.
        Traditional systems either perform poorly in noisy conditions or avoid
        them entirely. The graduated classification (blocking optimistic actions,
        requiring more confirmation) turns a losing regime into a cautiously
        effective one.
      </p>
      <blockquote>
        <p>
          The dual-layer detector is the foundation that every other decision
          builds on &mdash; action selection, resource allocation, safety margins,
          and exit rules all adapt based on the composite confidence.
        </p>
      </blockquote>
    </>
  );
}
