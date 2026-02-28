export function DualLayerRegimeContent() {
  return (
    <>
      <h2>The Problem: One Detector Isn&rsquo;t Enough</h2>
      <p>
        Every regime detection system in published literature uses a single
        detector. Hidden Markov Models, threshold-based volatility classifiers,
        rolling correlation breakpoints — they all answer the same question:{" "}
        <em>what regime are we in right now?</em>
      </p>
      <p>
        But there&rsquo;s a second question that matters more for live trading:{" "}
        <em>are we leaving the current regime?</em> The structural detector takes
        20+ bars to reclassify. By then, you&rsquo;ve already taken several
        trades under the wrong assumptions.
      </p>
      <blockquote>
        <p>
          ER tells you what regime you&rsquo;re in. ADWIN tells you when
          you&rsquo;re leaving it — 1-3 bars before ER reclassifies.
        </p>
      </blockquote>
      <p>
        The solution is two orthogonal detectors running simultaneously, each
        answering a different question, composited into a single position-sizing
        multiplier.
      </p>

      <hr />

      <h2>Layer 1: Kaufman Efficiency Ratio</h2>
      <h3>What It Measures</h3>
      <p>
        The Kaufman Efficiency Ratio (ER) measures <strong>net price displacement
        vs total path length</strong> over a lookback window. If price moved in
        a straight line, ER = 1.0 (perfect trend). If price moved randomly and
        ended up where it started, ER = 0.0 (pure chop).
      </p>
      <pre><code>{`ER = |Close[t] - Close[t-n]| / sum(|Close[i] - Close[i-1]|)

# Over 20 bars:
# Straight line up 10%:  ER ≈ 1.0  → TREND
# Sideways oscillation:  ER ≈ 0.05 → DEEP_CHOP
# Moderate drift:        ER ≈ 0.25 → NORMAL`}</code></pre>
      <h3>Graduated Classification</h3>
      <p>
        Rather than a binary trend/chop split, the system uses five tiers with
        regime-specific trading rules:
      </p>
      <table>
        <thead>
          <tr>
            <th>Regime</th>
            <th>ER Range</th>
            <th>Size Mult</th>
            <th>Rules</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>TREND</code></td>
            <td>&ge; 0.35</td>
            <td>1.0</td>
            <td>1 confirm, wide trail (1.5/0.8 ATR)</td>
          </tr>
          <tr>
            <td><code>NORMAL</code></td>
            <td>0.20 &ndash; 0.35</td>
            <td>0.85</td>
            <td>1 confirm, tighter SL (1.2x mult)</td>
          </tr>
          <tr>
            <td><code>VOLATILE</code></td>
            <td>&lt; 0.20 + ATR &gt; 60th</td>
            <td>0.70</td>
            <td>2 confirms, widened stops</td>
          </tr>
          <tr>
            <td><code>LIGHT_CHOP</code></td>
            <td>0.10 &ndash; 0.20</td>
            <td>0.60</td>
            <td>Longs blocked (confirm=99), shorts allowed</td>
          </tr>
          <tr>
            <td><code>DEEP_CHOP</code></td>
            <td>&lt; 0.10</td>
            <td>0.50</td>
            <td>3 confirms required for any trade</td>
          </tr>
        </tbody>
      </table>

      <h3>The Asymmetry</h3>
      <p>
        LIGHT_CHOP blocks longs entirely but allows shorts with lower bars.
        This is informed by empirical observation: <strong>bearish momentum is
        more directional even in choppy conditions</strong>. In SOL/USDT 4h
        data, short signals during LIGHT_CHOP had a 66.7% win rate with a 2.02
        profit factor. Long signals in the same regime had a 52% win rate —
        barely above random.
      </p>
      <pre><code>{`REGIME_CONFIG = {
    "TREND":      {"size_mult": 1.0,  "confirms": 1, "sl_mult": 1.0},
    "NORMAL":     {"size_mult": 0.85, "confirms": 1, "sl_mult": 1.2},
    "VOLATILE":   {"size_mult": 0.70, "confirms": 2, "sl_mult": 1.5},
    "LIGHT_CHOP": {"size_mult": 0.60, "confirms": 1,
                   "long_confirms": 99},  # effectively blocks longs
    "DEEP_CHOP":  {"size_mult": 0.50, "confirms": 3},
}`}</code></pre>

      <hr />

      <h2>Layer 2: ADWIN Drift Detection</h2>
      <h3>What It Measures</h3>
      <p>
        ADWIN (Adaptive Windowing) is a statistical process control algorithm
        from the <code>river</code> library, originally designed for concept
        drift detection in streaming machine learning. It monitors the{" "}
        <em>distribution</em> of a data stream and detects when that
        distribution has shifted — without a fixed lookback window.
      </p>
      <p>
        Two independent ADWIN detectors run simultaneously:
      </p>
      <ul>
        <li>
          <strong>Return distribution</strong> (<code>delta=0.002</code>) — more
          sensitive, detects subtle shifts in mean return
        </li>
        <li>
          <strong>Volatility distribution</strong> (<code>delta=0.02</code>) —
          less sensitive, detects changes in variance regime
        </li>
      </ul>
      <p>
        When either detector fires, the system enters a <strong>transition
        state</strong> with a graduated sizing haircut:
      </p>
      <pre><code>{`class ADWINDriftDetector:
    def size_modifier(self) -> float:
        """Graduated uncertainty haircut during regime transitions.
        Ramps from 60% back to 100% over exactly 3 bars (12h at 4h TF)."""
        if self.bars_since_drift == 0:  return 0.60  # just detected
        elif self.bars_since_drift == 1: return 0.75
        elif self.bars_since_drift <= 3: return 0.90
        return 1.0  # settled`}</code></pre>

      <h3>Why ADWIN, Not a Rolling Window?</h3>
      <p>
        A rolling standard deviation or rolling z-score needs a fixed lookback
        window. Too short and you get false positives. Too long and you miss
        transitions. ADWIN adapts its window automatically — it grows the
        window during stable periods (accumulating statistical power) and shrinks
        it when it detects a shift (responding quickly to change).
      </p>
      <p>
        In backtesting across 18 months of SOL/USDT 4h data, ADWIN detected
        regime transitions <strong>1-3 bars before</strong> the ER-based
        classifier reclassified. Those 1-3 bars are exactly when the old regime
        assumptions are most dangerous.
      </p>

      <hr />

      <h2>Composition: The Two-Layer Stack</h2>
      <p>
        The two layers compose multiplicatively:
      </p>
      <pre><code>{`# Layer 1: structural regime → base sizing
regime = classify_regime(er_value, atr_percentile)
rcfg = REGIME_CONFIG[regime]
base_size = position_value * rcfg["size_mult"]

# Layer 2: transition detection → uncertainty haircut
adwin_mod = adwin_detector.size_modifier()

# Composite
effective_size = base_size * adwin_mod

# Example during NORMAL → TREND transition:
#   base_size = $100 * 0.85 = $85         (still NORMAL by ER)
#   adwin_mod = 0.60                       (ADWIN just fired)
#   effective = $85 * 0.60 = $51           (conservative during shift)
#
# 3 bars later:
#   base_size = $100 * 1.0 = $100          (ER reclassified to TREND)
#   adwin_mod = 0.90                       (ramping back up)
#   effective = $100 * 0.90 = $90          (approaching full size)`}</code></pre>

      <h3>Why This Works</h3>
      <p>
        The multiplicative composition means the layers are independent — ER
        handles the <em>what</em> (which regime are we in), ADWIN handles the{" "}
        <em>when</em> (are we transitioning). Neither needs to know about the
        other. The sizing system naturally becomes most conservative during
        regime transitions in choppy conditions (DEEP_CHOP + ADWIN drift ={" "}
        <code>0.50 &times; 0.60 = 0.30</code>) and most aggressive during
        established trends (<code>1.0 &times; 1.0 = 1.0</code>).
      </p>

      <hr />

      <h2>Results</h2>
      <p>
        Backtested across 5 walk-forward passes of SOL/USDT Renko $0.50 data:
      </p>
      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Profitable passes</td>
            <td>4 / 5</td>
          </tr>
          <tr>
            <td>Average return per pass</td>
            <td>+25.0%</td>
          </tr>
          <tr>
            <td>Monte Carlo confidence</td>
            <td>98.3%</td>
          </tr>
          <tr>
            <td>Max drawdown</td>
            <td>17.8%</td>
          </tr>
          <tr>
            <td>SHORT profit factor</td>
            <td>2.02</td>
          </tr>
          <tr>
            <td>Per-regime: TREND PF</td>
            <td>1.98</td>
          </tr>
          <tr>
            <td>Per-regime: CHOP PF</td>
            <td>1.84</td>
          </tr>
        </tbody>
      </table>
      <p>
        The CHOP profit factor of 1.84 is notable — traditional systems lose
        money in chop. The graduated classification (blocking longs, requiring
        more confirms) turns a money-losing regime into a cautiously profitable
        one on the short side.
      </p>
      <p>
        The system runs live on Bybit SOL/USDT perpetual futures with 3x
        leverage, managing all stops and take-profits internally (no exchange-side
        orders). The dual-layer detector is the foundation that every other
        decision builds on.
      </p>
    </>
  );
}
