export function VpinConvictionContent() {
  return (
    <>
      <h2>The Core Idea</h2>
      <p>
        Imagine you&rsquo;re about to make an important decision. You have your
        own analysis and you&rsquo;re 70% confident. Then you learn that the
        people with the <em>best</em> information &mdash; domain experts,
        experienced operators, the ones who consistently know first &mdash; are
        acting in the <strong>opposite direction</strong>.
      </p>
      <p>
        Do you still have 70% confidence? Of course not. Your confidence should
        drop. And if those informed actors were acting in the <em>same</em>{" "}
        direction as you? Your confidence should increase.
      </p>
      <p>
        This is what this article is about: <strong>measuring the actions of
        informed participants and using that signal to adjust your own
        confidence in real time</strong>. You don&rsquo;t need to know what
        they know. You just need to detect when they&rsquo;re acting and in
        which direction.
      </p>

      <h2>Why This Matters for You</h2>
      <p>
        This pattern applies anywhere some actors are better informed than
        others &mdash; which is almost every domain:
      </p>
      <ul>
        <li>
          <strong>Content platforms</strong> &mdash; expert users who
          consistently find quality content early are &ldquo;informed
          participants.&rdquo; If they&rsquo;re engaging with content,
          it&rsquo;s probably good. If they&rsquo;re ignoring it, your
          recommendation confidence should drop.
        </li>
        <li>
          <strong>Fraud detection</strong> &mdash; sophisticated actors who
          consistently exploit systems reveal their knowledge through behavior
          patterns. A surge of activity from known-sophisticated accounts is
          high informed flow.
        </li>
        <li>
          <strong>Hiring decisions</strong> &mdash; when multiple experienced
          interviewers independently reach the same conclusion, that&rsquo;s
          high &ldquo;informed flow.&rdquo; Your confidence in the signal should
          increase proportionally.
        </li>
        <li>
          <strong>Open source ecosystems</strong> &mdash; when respected
          maintainers start adopting a library, that&rsquo;s informed action.
          When they abandon one, that&rsquo;s an informed exit signal.
        </li>
        <li>
          <strong>Product decisions</strong> &mdash; when your most engaged
          power users suddenly change behavior, that tells you more than
          aggregate analytics from casual users.
        </li>
      </ul>
      <blockquote>
        <p>
          The question isn&rsquo;t &ldquo;what do I think?&rdquo; It&rsquo;s
          &ldquo;what do the people who know best think?&rdquo; And the answer
          is in their actions, not their words.
        </p>
      </blockquote>

      <hr />

      <h2>Measuring Informed Activity</h2>
      <p>
        The technique comes from academic research by Easley, L&oacute;pez de
        Prado, and O&rsquo;Hara (2012). They showed you could estimate the
        probability that an action was driven by informed actors just from
        publicly observable data &mdash; by looking at the <strong>imbalance
        between opposing flows</strong>.
      </p>
      <p>
        If both sides are roughly balanced, all participants have similar
        information (low informed flow). If one side dominates, someone knows
        something (high informed flow). The direction of the imbalance tells you
        which side the informed actors favor.
      </p>
      <pre><code>{`# The formula is simple:
informed_ratio = abs(positive_flow - negative_flow) / total_flow

# informed_ratio = 0.0  → perfectly balanced, no informed activity
# informed_ratio = 0.05 → normal noise
# informed_ratio = 0.20 → significant imbalance, informed actors present
# informed_ratio = 0.50 → extreme, one side completely dominates`}</code></pre>
      <p>
        The limitation of the original research: <strong>it was
        retrospective</strong>. Studies computed this over daily buckets and
        analyzed it after the fact. Useful for academic understanding, not for
        real-time decisions. The contribution here is running it at 1-hour
        resolution from a live event stream, feeding it directly into the
        decision loop.
      </p>

      <hr />

      <h2>The Confidence Adjustment Rules</h2>
      <p>
        Once you have the informed flow measurement, you use it to adjust your
        confidence. The rules are deliberately <strong>asymmetric</strong>:
      </p>
      <pre><code>{`def adjust_confidence(confidence, my_direction, informed_ratio, imbalance):
    """Modify confidence based on informed actor behavior.

    confidence: current confidence level (0.0 to 2.0)
    my_direction: which way I want to act (+1 or -1)
    informed_ratio: intensity of informed activity (0.0 to 1.0)
    imbalance: which direction the informed actors favor"""

    # Determine informed flow direction
    informed_dir = +1 if imbalance > 0.05 else (-1 if imbalance < -0.05 else 0)

    if informed_ratio > 0.20:  # strong informed activity
        if informed_dir * my_direction > 0:      # they agree with me
            confidence += 0.15                    # modest boost
        elif informed_dir * my_direction < 0:    # they disagree with me
            confidence -= 0.20                    # larger cut

    elif informed_ratio > 0.10:  # moderate informed activity
        if informed_dir * my_direction > 0:
            confidence += 0.05                    # small boost

    return max(0.0, min(2.0, confidence))`}</code></pre>

      <h3>Why the Asymmetry?</h3>
      <p>
        Confirming flow boosts confidence by <code>+0.15</code>. Opposing flow
        cuts by <code>-0.20</code>. The cut is deliberately larger because the
        costs are different:
      </p>
      <ul>
        <li>
          <strong>False positive on the cut</strong> &mdash; you reduce your
          commitment slightly. Cost: a smaller action that might have been fine.
        </li>
        <li>
          <strong>False positive on the boost</strong> &mdash; you increase your
          commitment. Cost: a larger action that might go wrong.
        </li>
      </ul>
      <p>
        The asymmetry encodes a <strong>risk-management-first</strong> philosophy:
        it&rsquo;s cheaper to miss a good opportunity than to overcommit to a bad
        one. When the best-informed actors disagree with you, the smart response
        is to reduce exposure more than you increase it when they agree.
      </p>
      <p>
        This applies far beyond any single domain. In hiring: a dissenting expert
        opinion should reduce your confidence more than a confirming one boosts
        it. In product launches: power users disengaging should alarm you more
        than power users engaging reassures you.
      </p>

      <hr />

      <h2>Contrarian Signals from Forced Exits</h2>
      <p>
        There&rsquo;s another signal hidden in the data: <strong>forced
        exits</strong> &mdash; when participants are forced out of their
        positions due to adverse conditions. A cluster of forced exits in one
        direction means the pressure that caused them is likely{" "}
        <em>overextended</em>. The capitulation that forces exits often marks
        the extreme.
      </p>
      <p>
        This generalizes to any system with cascading failures: a wave of
        automated alerts triggering escalations, a surge of user churn after a
        bad release, a cluster of CI pipeline failures. The signal is the same:
        when forced reactions cluster, the underlying condition is often at its
        peak and about to reverse.
      </p>

      <hr />

      <h2>The Architecture: Decouple Collection from Decisions</h2>
      <p>
        The most reusable part of this system isn&rsquo;t the formula &mdash;
        it&rsquo;s the <strong>two-process architecture</strong>:
      </p>
      <pre><code>{`┌─────────────────────┐     ┌──────────────────────┐
│   DATA COLLECTOR    │     │   DECISION MAKER     │
│                     │     │                      │
│  Stream connection  │     │  Reads enrichment DB │
│  Real-time ingest   ├────►│  with 2s timeout     │
│  Aggregation        │write│                      │read
│  Writes to SQLite   │     │  If stale/locked:    │
│                     │     │  proceed without it  │
└─────────────────────┘     └──────────────────────┘

Key design decisions:
• SQLite in WAL mode → concurrent reads during writes
• 2-second read timeout → graceful degradation
• No shared state → either process can restart independently
• 1-hour aggregation window → balance between signal and noise`}</code></pre>

      <h3>Why This Matters</h3>
      <p>
        The two-process pattern solves a general problem: <strong>how do you
        enrich a decision system with real-time data without coupling the data
        collection to the decision logic?</strong>
      </p>
      <p>
        The collector and the decision maker have completely different
        requirements. The collector needs to be always-on, handle connection
        drops, and write efficiently. The decision maker needs to read quickly,
        handle missing data gracefully, and never block on I/O.
      </p>
      <p>
        SQLite in WAL mode is the bridge. The collector writes without blocking
        readers. The decision maker reads with a timeout &mdash; if the data is
        stale or the database is locked, it proceeds without the enrichment
        rather than waiting. The enrichment is <strong>always additive, never
        blocking</strong>.
      </p>

      <h3>Apply This Pattern Anywhere</h3>
      <p>
        Any real-time enrichment source can use this architecture:
      </p>
      <ul>
        <li>
          <strong>Social sentiment collector</strong> &rarr; writes sentiment
          scores to SQLite &rarr; decision system reads when available
        </li>
        <li>
          <strong>Webhook event aggregator</strong> &rarr; writes event counts
          and patterns &rarr; monitoring system reads for anomaly detection
        </li>
        <li>
          <strong>User behavior tracker</strong> &rarr; writes engagement
          metrics &rarr; recommendation engine reads for real-time
          personalization
        </li>
        <li>
          <strong>Log pattern detector</strong> &rarr; writes error clusters
          &rarr; alerting system reads for intelligent notification
        </li>
      </ul>
      <p>
        The formula changes. The architecture stays the same: independent
        collector, shared SQLite, timeout-based reads, graceful degradation.
      </p>

      <hr />

      <h2>Key Takeaways</h2>
      <ol>
        <li>
          <strong>Informed actors reveal information through behavior</strong>.
          You don&rsquo;t need to know what they know &mdash; you just need to
          detect when they&rsquo;re acting and in which direction.
        </li>
        <li>
          <strong>Asymmetric response is risk-management-first</strong>. Cut
          more when informed actors disagree than you boost when they agree.
          Missing an opportunity is cheaper than overcommitting to a mistake.
        </li>
        <li>
          <strong>Decouple collection from decision-making</strong>. The
          two-process SQLite pattern lets you add real-time enrichment to any
          system without coupling or risk of blocking.
        </li>
        <li>
          <strong>Graceful degradation over hard dependencies</strong>. If the
          enrichment data is missing, proceed without it. The enrichment is
          additive confidence, not a gate.
        </li>
      </ol>
    </>
  );
}
