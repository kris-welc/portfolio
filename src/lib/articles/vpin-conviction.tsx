export function VpinConvictionContent() {
  return (
    <>
      <h2>From Academic Theory to Live Trading</h2>
      <p>
        Volume-synchronized Probability of Informed Trading (VPIN) was
        introduced by Easley, L&oacute;pez de Prado, and O&rsquo;Hara in 2012 as a
        market microstructure metric. Their studies were retrospective —
        computed over daily volume buckets, analyzed after the fact. The key
        insight was powerful: order flow toxicity (the presence of informed
        traders) could be estimated from public trade data.
      </p>
      <p>
        We took that insight and turned it into a <strong>real-time conviction
        modifier</strong> running at 1-hour resolution from a live WebSocket
        trade stream. When informed flow confirms your signal, conviction goes
        up. When smart money is on the other side, conviction gets cut.
      </p>
      <blockquote>
        <p>
          Academic VPIN tells you what happened. Real-time VPIN tells you
          what&rsquo;s happening. The difference is the 6-24 hours of edge you
          need in live trading.
        </p>
      </blockquote>

      <hr />

      <h2>The WebSocket Daemon</h2>
      <p>
        A standalone Python process subscribes to Bybit&rsquo;s public trade
        stream via WebSocket. Every trade that executes on the exchange arrives
        in real time with a key field: <code>side</code> — whether the trade
        was buyer-initiated or seller-initiated.
      </p>
      <pre><code>{`# ws_collector.py — standalone daemon
async def on_trade(msg):
    """Process each trade from Bybit WebSocket."""
    side = msg["side"]      # "Buy" or "Sell"
    size = float(msg["v"])  # trade volume
    price = float(msg["p"])

    if side == "Buy":
        bucket.buy_volume += size
    else:
        bucket.sell_volume += size
    bucket.total_volume += size
    bucket.trade_count += 1`}</code></pre>
      <p>
        Trades are aggregated into 1-minute buckets. At the end of each bucket,
        two metrics are computed and written to a shared SQLite database:
      </p>
      <pre><code>{`# Computed per 1-minute bucket:
vpin = abs(buy_vol - sell_vol) / total_vol
# 0 = perfectly balanced flow (no informed trading)
# 1 = completely one-sided (all informed)

cvd = buy_vol - sell_vol
# Positive = net buying pressure
# Negative = net selling pressure`}</code></pre>
      <p>
        The daemon runs as a separate process with its own lifecycle. It writes
        to <code>microstructure.db</code> — a SQLite database in WAL mode for
        concurrent read access. This is the decoupled enrichment pattern: the
        collector knows nothing about the trading strategy, and the strategy
        knows nothing about WebSocket management.
      </p>

      <hr />

      <h2>VPIN as Directional Conviction</h2>
      <p>
        The live trader reads the latest VPIN and CVD values from the database
        and applies them as a <strong>directional conviction modifier</strong>.
        The logic is asymmetric by design — confirming signals get a smaller
        boost than opposing signals get a cut.
      </p>
      <pre><code>{`def _apply_vpin_modifier(self, conviction, direction):
    """Adjust conviction based on informed flow direction.

    direction: +1 for long, -1 for short
    vpin_dir: inferred from buy/sell imbalance"""

    vpin, imbalance = self._read_microstructure()
    vpin_dir = 1 if imbalance > 0.05 else (-1 if imbalance < -0.05 else 0)

    if vpin > 0.20:   # strong informed flow (top ~5%)
        if vpin_dir * direction > 0:     # smart money confirms
            conviction = min(2.0, conviction + 0.15)
        elif vpin_dir * direction < 0:   # smart money opposes
            conviction = max(0.0, conviction - 0.20)

    elif vpin > 0.10:  # moderate informed flow
        if vpin_dir * direction > 0:
            conviction = min(2.0, conviction + 0.05)

    return conviction`}</code></pre>

      <h3>Why the Asymmetry?</h3>
      <p>
        Confirming flow adds <code>+0.15</code> to conviction. Opposing flow
        cuts <code>-0.20</code>. The cut is larger because opposing informed
        flow is a stronger signal — it means the traders with the best
        information are actively betting against your position. False positives
        on the cut side cost you a smaller position. False positives on the
        boost side cost you a larger loss.
      </p>

      <h3>Liquidation Events as Contrarian Signals</h3>
      <p>
        The collector also tracks liquidation events from Bybit&rsquo;s
        liquidation stream. Liquidations are applied with <strong>contrarian
        logic</strong>:
      </p>
      <ul>
        <li>
          <strong>Buy-side liquidations</strong> (shorts being liquidated = price
          rose sharply) → treated as bearish for further longs. The cascade may
          be exhausting.
        </li>
        <li>
          <strong>Sell-side liquidations</strong> (longs being liquidated = price
          dropped sharply) → treated as bullish for longs. Capitulation
          often marks bottoms.
        </li>
      </ul>
      <p>
        This is the cascading liquidation hypothesis applied in real time — when
        you see a cluster of forced liquidations on one side, the move that
        caused them is more likely overextended than continuing.
      </p>

      <hr />

      <h2>The Two-Database Architecture</h2>
      <p>
        The system uses a clean process boundary between data collection and
        trading logic:
      </p>
      <pre><code>{`┌──────────────────┐     ┌─────────────────────┐
│  ws_collector.py │     │  v3_live_trader.py   │
│                  │     │                      │
│  Bybit WebSocket ├────►│  microstructure.db   │
│  Trade Stream    │write│  (SQLite WAL mode)   │read
│                  │     │                      │
│  Liquidation     │     │  _apply_modifiers()  │
│  Stream          │     │  conviction ± VPIN   │
└──────────────────┘     └─────────────────────┘

Process 1: python3 ws_collector.py    (always running)
Process 2: python3 v3_live_trader.py  (trading loop)`}</code></pre>

      <h3>Design Decisions</h3>
      <ul>
        <li>
          <strong>SQLite WAL mode</strong> allows concurrent reads while the
          collector writes. No locking conflicts between processes.
        </li>
        <li>
          <strong>2-second read timeout</strong> in the trader — if the
          microstructure data is stale or the database is locked, the trade
          proceeds without VPIN modification rather than blocking.
        </li>
        <li>
          <strong>1-hour aggregation window</strong> in the trader (reading the
          last 60 one-minute buckets) — long enough to capture informed flow
          patterns, short enough to be actionable.
        </li>
        <li>
          <strong>No shared state</strong> between processes. The collector
          doesn&rsquo;t know if the trader is running. The trader doesn&rsquo;t
          know if the collector is running. Either can restart independently.
        </li>
      </ul>

      <hr />

      <h2>What Makes This Novel</h2>
      <p>
        The academic VPIN literature (Easley et al., 2012; Abad &amp; Yag&uuml;e,
        2012) established VPIN as a retrospective research metric computed over
        volume-synchronized buckets spanning days. The contributions here are:
      </p>
      <ol>
        <li>
          <strong>Temporal resolution</strong>: Running VPIN at 1-minute
          granularity aggregated to 1-hour windows, not daily buckets.
        </li>
        <li>
          <strong>Directional application</strong>: Using the buy/sell imbalance
          to infer the <em>direction</em> of informed flow, not just its
          magnitude.
        </li>
        <li>
          <strong>Asymmetric conviction</strong>: Opposing flow cuts more than
          confirming flow boosts — a risk-management-first design.
        </li>
        <li>
          <strong>Decoupled architecture</strong>: Two independent processes
          sharing a SQLite database — a pattern that can be replicated for any
          real-time enrichment source.
        </li>
        <li>
          <strong>Contrarian liquidation integration</strong>: Using forced
          liquidation events as exhaustion signals within the same framework.
        </li>
      </ol>
      <p>
        The pattern generalizes beyond VPIN. Any real-time data source — social
        sentiment, on-chain whale movements, options flow — can use the same
        two-process architecture: a collector daemon that writes to SQLite, and
        a strategy process that reads with a timeout fallback.
      </p>
    </>
  );
}
