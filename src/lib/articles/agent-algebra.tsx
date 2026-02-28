export function AgentAlgebraContent() {
  return (
    <>
      <h2>The Problem: Orchestration Without Guarantees</h2>
      <p>
        The current LLM orchestration landscape is plumbing. Chains, tools, retry
        loops, router agents — none of it comes with a mathematical guarantee
        that the system will converge, improve, or even not degrade.
      </p>
      <p>
        A &ldquo;retry loop&rdquo; re-runs an agent with fresh context hoping for a
        better answer. Sometimes it works. Sometimes it oscillates. There is no
        proof it converges. Compare that to a <strong>contraction mapping</strong>,
        where convergence to a unique fixed point is <em>guaranteed</em> by the
        contraction factor <code>k &lt; 1</code>.
      </p>
      <blockquote>
        <p>
          The difference between hoping your agent improves and proving it
          does is a single inequality: d(T(x), T(y)) &le; k &middot; d(x, y),
          where k &lt; 1.
        </p>
      </blockquote>
      <p>
        Agent Algebra maps six mathematical theorems to six composition primitives.
        Each primitive provides a specific guarantee. Together, they form a
        composable pipeline where every layer has a known convergence property.
      </p>

      <h2>The Framework: Six Theorems, Six Primitives</h2>
      <table>
        <thead>
          <tr>
            <th>Theorem</th>
            <th>Primitive</th>
            <th>Guarantee</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Banach Fixed-Point</td>
            <td><code>contraction_loop</code></td>
            <td>Convergence in O(log(1/&epsilon;)) iterations</td>
          </tr>
          <tr>
            <td>Schapire AdaBoost</td>
            <td><code>boost_cascade</code></td>
            <td>Exponential error reduction</td>
          </tr>
          <tr>
            <td>de Finetti Scoring</td>
            <td><code>ScoringTracker</code></td>
            <td>Incentive-compatible aggregation</td>
          </tr>
          <tr>
            <td>Ole Peters Ergodicity</td>
            <td><code>ergodic_kelly</code></td>
            <td>Survival under path-dependent drawdowns</td>
          </tr>
          <tr>
            <td>Pearl Belief Propagation</td>
            <td><code>propagate</code></td>
            <td>Globally optimal posteriors from local messages</td>
          </tr>
          <tr>
            <td>Kolmogorov MDL</td>
            <td><code>mdl_filter</code></td>
            <td>Principled signal/noise separation</td>
          </tr>
        </tbody>
      </table>

      <p>
        Zero external dependencies. Pure Python standard library — <code>math</code>,{" "}
        <code>sqlite3</code>, <code>zlib</code>, <code>statistics</code>,{" "}
        <code>random</code>. All types are frozen dataclasses.
        All mutations return new objects.
      </p>

      <hr />

      <h2>Theorem 1: Contraction Mapping</h2>
      <h3>The Math</h3>
      <p>
        If a function T satisfies <code>d(T(x), T(y)) &le; k &middot; d(x, y)</code>{" "}
        for <code>k &lt; 1</code>, then repeated application of T converges to a
        unique fixed point. The contraction factor <code>k</code> controls the
        convergence speed.
      </p>
      <h3>The Primitive</h3>
      <pre><code>{`def contraction_step(
    current: dict[str, float],
    realized: dict[str, float],
    k: float = 0.5,
) -> tuple[dict[str, float], float]:
    """One step: blend current values toward realized values.
    k < 1 guarantees convergence to a unique fixed point."""
    new_values: dict[str, float] = {}
    max_dist = 0.0
    for key, old in current.items():
        target = realized.get(key, old)
        new = old + k * (target - old)
        new = max(0.01, min(0.99, new))
        new_values[key] = round(new, 6)
        max_dist = max(max_dist, abs(new - old))
    return new_values, max_dist`}</code></pre>
      <h3>Real-World Use: Bayesian Seed Calibration</h3>
      <p>
        In production, this calibrates Thompson Sampling win-rate priors for a
        live trading system. You start with initial prior estimates, run a
        backtest, observe realized win rates, apply the contraction step, repeat.
        The priors converge to the true win rates in 3-5 iterations.
      </p>
      <pre><code>{`def contraction_loop(generate, initial, k=0.5, tol=1e-3, max_iter=20):
    """Run contraction mapping to convergence.
    generate: run backtest -> compute win rates
    initial: starting parameter estimates"""
    current = dict(initial)
    for i in range(1, max_iter + 1):
        realized = generate(current)
        new_values, distance = contraction_step(current, realized, k)
        if distance < tol:
            return ContractionResult(values=new_values, converged=True, ...)
        current = new_values`}</code></pre>
      <p>
        Compare this to a naive retry loop: run the agent, check the output,
        if bad, retry with fresh context. The retry loop has no convergence
        proof — it might oscillate forever. The contraction mapping provably
        converges because each step reduces the distance by at least{" "}
        <code>1 - k</code>.
      </p>

      <hr />

      <h2>Theorem 2: AdaBoost Cascade</h2>
      <h3>The Math</h3>
      <p>
        Any ensemble of weak learners (accuracy &gt; 50%) can be combined into
        an arbitrarily strong learner. Each successive learner focuses on the
        errors of the previous ones. Error drops exponentially with the number
        of rounds.
      </p>
      <h3>The Primitive</h3>
      <pre><code>{`def boost_cascade(agents, data, outcomes, rounds=3):
    """AdaBoost-style cascade over agent callables.
    Each round:
      1. Current agent predicts on all data
      2. Compute weighted error rate
      3. Derive weight: ln((1-e)/e)
      4. Upweight hard cases for next round"""
    sample_weights = [1.0 / n] * n
    for r in range(num_rounds):
        preds = [agents[r](d) for d in data]
        weighted_error = sum(
            w for i, w in enumerate(sample_weights)
            if abs(preds[i] - float(outcomes[i])) >= threshold
        )
        agent_w = math.log((1 - weighted_error) / weighted_error)

        # Upweight hard cases
        for i in range(n):
            if abs(preds[i] - float(outcomes[i])) >= threshold:
                sample_weights[i] *= math.exp(agent_w)
            else:
                sample_weights[i] *= math.exp(-agent_w)`}</code></pre>
      <h3>Real-World Use: Two-Path Ensemble Voting</h3>
      <p>
        In a prediction market trading system, signals from different feeds
        (NBA Elo model, Binance order book imbalance, ESPN blowout detection)
        are combined through a two-path ensemble — conservative and aggressive.
        Boosting ensures the ensemble focuses on the market conditions where
        individual signals were weakest.
      </p>

      <hr />

      <h2>Theorem 3: Proper Scoring Rules</h2>
      <h3>The Math</h3>
      <p>
        Under a proper scoring rule, an agent&rsquo;s expected payoff is maximized
        by reporting its <em>true</em> belief. Honesty is the dominant strategy.
        The Brier score and logarithmic score are both proper.
      </p>
      <h3>The Primitive</h3>
      <pre><code>{`def brier_skill_score(forecasts, outcomes):
    """Skill relative to climatological (base rate) forecast.
    > 0 means better than always-predicting-the-base-rate.
    1.0 = perfect, 0.0 = no skill, < 0 = worse than base rate."""
    base_rate = sum(float(o) for o in outcomes) / len(outcomes)
    bs_model = brier_score(forecasts, outcomes)
    bs_ref = brier_score([base_rate] * len(outcomes), outcomes)
    return 1.0 - bs_model / bs_ref

def log_pool_aggregate(agent_probs, agent_weights):
    """Logarithmic opinion pool — proper scoring rule preserving.
    Combines multiple probability estimates using
    calibration-derived weights."""
    log_sum = sum(w * math.log(p) for p, w in zip(probs, weights))
    log_sum_c = sum(w * math.log(1 - p) for p, w in zip(probs, weights))
    raw, raw_c = math.exp(log_sum), math.exp(log_sum_c)
    return raw / (raw + raw_c)`}</code></pre>
      <h3>Real-World Use: Signal Weight Calibration</h3>
      <p>
        The <code>ScoringTracker</code> records every prediction and outcome per
        agent. Agents with lower Brier scores (better calibration) receive
        higher weights in the log-pool aggregation. A poorly calibrated
        sentiment signal gets automatically downweighted without manual
        intervention.
      </p>

      <hr />

      <h2>Theorem 4: Ergodicity-Corrected Kelly</h2>
      <h3>The Math</h3>
      <p>
        Standard Kelly criterion maximizes <code>E[log(wealth)]</code> for i.i.d.
        bets. But real trading has serial correlation, regime shifts, and
        path-dependent drawdowns. The ensemble average (what you expect on
        average across all possible universes) is not the time average (what you
        actually experience in your one path through time).
      </p>
      <blockquote>
        <p>
          For multiplicative processes, the time average &ne; the ensemble average.
          Standard Kelly overstates what a single-path agent actually experiences.
          — Ole Peters, 2019
        </p>
      </blockquote>
      <h3>The Primitive</h3>
      <pre><code>{`def ergodic_kelly(win_rate, win_loss_ratio, returns, n_paths=1000):
    """f_ergodic = f_kelly * (median_growth / mean_growth)

    The correction factor is always <= 1.0.
    It accounts for path-dependent drawdowns and serial correlation
    that standard Kelly ignores."""
    f_kelly = kelly_fraction(win_rate, win_loss_ratio)
    paths = simulate_paths(returns, n_paths, seed=seed)
    terminals = [p[-1] for p in paths]

    correction = median(terminals) / mean(terminals)
    correction = max(0.1, min(1.0, correction))

    return ErgodicResult(
        kelly_fraction=f_kelly,
        ergodic_fraction=f_kelly * correction,
        correction_factor=correction,
    )`}</code></pre>
      <h3>Real-World Use: Position Sizing Under Drawdown</h3>
      <p>
        In a live perpetual futures trader, the ergodic correction reduces
        position size during periods of high serial correlation (trending
        drawdowns). A standard Kelly fraction of 0.25 might be corrected
        to 0.18 when the Monte Carlo simulation shows that median terminal
        wealth is only 72% of mean terminal wealth.
      </p>

      <hr />

      <h2>Theorem 5: Belief Propagation</h2>
      <h3>The Math</h3>
      <p>
        On tree-structured graphical models, local message passing between
        neighbors converges to globally optimal posteriors. Each node only
        communicates with its immediate neighbors. For loopy graphs, damping
        provides approximate convergence.
      </p>
      <h3>The Primitive</h3>
      <pre><code>{`agents = [
    BeliefNode("regime", local_prob=0.60),
    BeliefNode("micro", local_prob=0.75),
    BeliefNode("sentiment", local_prob=0.55),
    BeliefNode("macro", local_prob=0.40),
]
edges = [
    ("regime", "micro"),
    ("regime", "sentiment"),
    ("micro", "sentiment"),
    ("sentiment", "macro"),
]
graph = build_graph(agents, edges)
result = propagate(graph, damping=0.3)
# result.beliefs: globally consistent posteriors
# result.converged: True in 8 iterations`}</code></pre>
      <h3>Real-World Use: Multi-Source Signal Fusion</h3>
      <p>
        Four signal sources — regime detector, microstructure (VPIN/CVD),
        sentiment, and macro intelligence — each produce local probability
        estimates. Belief propagation fuses them into globally consistent
        posteriors. The regime node influences both micro and sentiment,
        creating information flow that pure averaging would miss.
      </p>

      <hr />

      <h2>Theorem 6: MDL Compression</h2>
      <h3>The Math</h3>
      <p>
        The Minimum Description Length principle (Kolmogorov/Rissanen): the best
        model is the one that compresses data most. If a pattern can be described
        more concisely than the raw data, it&rsquo;s signal. Otherwise, it&rsquo;s noise.
      </p>
      <h3>The Primitive</h3>
      <pre><code>{`def algorithmic_compression_ratio(data: str | bytes) -> float:
    """Estimate Kolmogorov complexity via zlib compression.
    High compressibility -> structured data -> likely signal.
    Low compressibility -> random data -> likely noise."""
    raw = data.encode() if isinstance(data, str) else data
    compressed = zlib.compress(raw, level=9)
    return len(compressed) / len(raw)

def mdl_filter(items, summarize_fn, reconstruct_fn):
    """Filter items, keeping only those that contain signal.
    Signal = low compression ratio AND decent reconstruction."""
    return [
        item for item in items
        if is_signal(item, summarize_fn(item), reconstruct_fn)
    ]`}</code></pre>
      <h3>Real-World Use: Intelligence Digest Filtering</h3>
      <p>
        An AI-curated news digest processes hundreds of articles daily. The MDL
        filter classifies each article: if an LLM summary compresses the article
        below 50% of its raw size <em>and</em> the summary can reconstruct the
        key facts above 30% fidelity, it&rsquo;s signal. Everything else is noise
        and gets dropped before scoring.
      </p>

      <hr />

      <h2>Composing the Pipeline</h2>
      <p>
        The six primitives compose into a <code>Pipeline</code> — an immutable
        chain where each step transforms data and passes it forward.
      </p>
      <pre><code>{`from agent_algebra import Pipeline, propagate, build_graph

pipeline = (
    Pipeline()
    .add("belief", lambda d: propagate(build_graph(agents, edges)).beliefs)
    .add("aggregate", lambda beliefs: tracker.aggregate(beliefs))
    .add("size", lambda prob: prob * ergodic.ergodic_fraction)
)

# Traced execution shows every intermediate value
trace = pipeline.run_traced(None)
for name, val in trace:
    print(f"  [{name}] {val}")

# [input] None
# [belief] {'regime': 0.5812, 'micro': 0.6634, ...}
# [aggregate] 0.6241
# [size] 0.1123`}</code></pre>
      <p>
        Each <code>.add()</code> returns a new Pipeline (immutable builder pattern).
        The <code>run_traced</code> method captures every intermediate result for
        debugging and auditability.
      </p>

      <hr />

      <h2>The Punchline</h2>
      <p>
        LLM orchestration frameworks give you tools to connect agents. Agent
        Algebra gives you <strong>theorems</strong> that tell you what to expect
        from those connections.
      </p>
      <ul>
        <li>
          <strong>Contraction mapping</strong> guarantees your calibration loop
          converges. A retry loop does not.
        </li>
        <li>
          <strong>Proper scoring</strong> makes honesty the dominant strategy.
          Manual weight tuning does not.
        </li>
        <li>
          <strong>Ergodic correction</strong> prevents ruin under path-dependent
          drawdowns. Standard Kelly does not.
        </li>
        <li>
          <strong>Belief propagation</strong> fuses local estimates into globally
          optimal posteriors. Simple averaging does not.
        </li>
      </ul>
      <p>
        Self-improving systems need proofs, not hopes. The library is open source,
        zero dependencies, and ready for composition.
      </p>
    </>
  );
}
