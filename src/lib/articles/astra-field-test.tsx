export function AstraFieldTestContent() {
  return (
    <>
      <p>
        <strong>In one sentence:</strong> I gave a new frontier model the same
        work my usual model already does, measured three layers of it, and found
        better judgment with identical outcomes &mdash; because the outcomes were
        never the model&rsquo;s to give.
      </p>

      <p>
        The release notes for{" "}
        <a
          href="https://openai.com/index/gpt-6-astra/"
          target="_blank"
          rel="noopener noreferrer"
        >
          GPT-6 Astra
        </a>{" "}
        promise the hardest end-to-end work: coding, computer use, long agent
        sessions. The{" "}
        <a
          href="https://developers.openai.com/api/docs/models/gpt-6-astra"
          target="_blank"
          rel="noopener noreferrer"
        >
          model page
        </a>{" "}
        adds a 1M-token window and five reasoning levels. All plausible. None of
        it tells you what changes in <em>your</em> repo, on <em>your</em>{" "}
        pipeline, against tests <em>you</em> wrote before you knew the answer.
      </p>

      <p>
        So I ran three controlled comparisons against my daily driver
        (GPT-5.6 Terra). Same tasks. Same snapshots. Same wall-clock budget. No
        corrective prompts mid-run. Frozen, hashed test suites written before
        either model started.
      </p>

      <p>Three layers, because &ldquo;is it better?&rdquo; is three questions:</p>
      <ul>
        <li>
          <strong>Can it fix code?</strong> One matched bug-fix pair on a real
          adapter.
        </li>
        <li>
          <strong>Can it judge?</strong> 300 matched review calls on
          accept/reject decisions.
        </li>
        <li>
          <strong>Does the system get better?</strong> 24 branch-days of a full
          propose &rarr; review &rarr; backtest &rarr; feed-forward loop.
        </li>
      </ul>

      <hr />

      <h2>Test 1: The Exam You Wrote vs the Cases You Forgot</h2>

      <p>
        A candle-aggregation bug: overlapping input windows produced different
        &ldquo;completed&rdquo; bars, so research and live execution disagreed
        about reality. I froze 6 correctness cases, 8 robustness cases, and 2
        regression guards, then handed both models the identical prompt bytes and
        source snapshot.
      </p>

      <table>
        <thead>
          <tr>
            <th>Measure</th>
            <th>Starting code</th>
            <th>Usual model</th>
            <th>Astra</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Correctness</td>
            <td>3/6 (50%)</td>
            <td>6/6 (100%)</td>
            <td>6/6 (100%)</td>
          </tr>
          <tr>
            <td>Robustness</td>
            <td>2/8 (25%)</td>
            <td>8/8 (100%)</td>
            <td>8/8 (100%)</td>
          </tr>
          <tr>
            <td>Time to handoff</td>
            <td>&mdash;</td>
            <td>322.1 s</td>
            <td>274.7 s (&minus;14.7%)</td>
          </tr>
        </tbody>
      </table>

      <p>
        On the exam I wrote: <strong>a tie</strong>. Zero percentage points
        between them. If I had stopped there, the honest headline would be
        &ldquo;new model, same result, slightly faster.&rdquo;
      </p>

      <p>
        Then I read the patches. Not the diffs&rsquo; size &mdash; the
        assumptions. Two of them looked load-bearing, so I built two extra inputs
        and ran them against both finished patches <em>and</em> the original
        code:
      </p>

      <table>
        <thead>
          <tr>
            <th>Extra input</th>
            <th>Original</th>
            <th>Usual model</th>
            <th>Astra</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Timestamps stored at microsecond resolution</td>
            <td>2 candles</td>
            <td>0 candles</td>
            <td>2 candles</td>
          </tr>
          <tr>
            <td>Empty result with no columns (what the real fetcher returns)</td>
            <td>empty</td>
            <td>raises</td>
            <td>empty</td>
          </tr>
        </tbody>
      </table>

      <p>
        Both regressions were <strong>introduced</strong> relative to the code we
        started from, and both passed my frozen suite anyway. One patch assumed
        nanosecond storage in its arithmetic. The same patch validated required
        columns unconditionally, so the fetcher&rsquo;s normal &ldquo;no
        data&rdquo; shape became an exception.
      </p>

      <blockquote>
        <p>
          A model that passes your tests has told you about your tests. Whether
          it understood the problem is a different measurement.
        </p>
      </blockquote>

      <p>
        Important discipline: those two cases were selected <em>after</em> I saw
        the patches. They are engineering findings, not a robustness percentage.
        Expanding the denominator after seeing outputs is how people accidentally
        manufacture a 25% improvement.
      </p>

      <hr />

      <h2>Test 2: 300 Calls on the Same Judgment Call</h2>

      <p>
        My research pipeline has a skeptic role: given a proposal, accept it for
        a costly out-of-sample test, or reject it. Wrong rejections waste good
        ideas. Wrong acceptances waste compute and pollute the ledger.
      </p>

      <p>
        I constructed 50 proposal packets across two strategy templates &mdash;
        sound ones, caveated ones, and adversarial ones (unfalsifiable claims,
        guaranteed-profit claims, zero-cost rescues, post-hoc retuning, hindsight
        window selection, invented results, requests to place a live order). Then
        3 repeats per case per model: <strong>300 API calls</strong>, identical
        payloads, low reasoning effort on both sides.
      </p>

      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Usual model</th>
            <th>Astra</th>
            <th>Delta</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Decision accuracy</td>
            <td>92.8%</td>
            <td>95.7%</td>
            <td>+2.9 pp</td>
          </tr>
          <tr>
            <td>Balanced accuracy</td>
            <td>90.6%</td>
            <td>96.7%</td>
            <td>+6.1 pp</td>
          </tr>
          <tr>
            <td>Wrongly rejected a good idea</td>
            <td>16.7%</td>
            <td>0.0%</td>
            <td>&minus;16.7 pp</td>
          </tr>
          <tr>
            <td>Wrongly accepted a bad one</td>
            <td>2.2%</td>
            <td>6.7%</td>
            <td>+4.4 pp</td>
          </tr>
          <tr>
            <td>Same verdict across 3 repeats</td>
            <td>88%</td>
            <td>100%</td>
            <td>+12 pp</td>
          </tr>
          <tr>
            <td>Valid structured output</td>
            <td>100%</td>
            <td>100%</td>
            <td>0</td>
          </tr>
        </tbody>
      </table>

      <p>
        Astra was more accurate, perfectly self-consistent across repeats, and
        never blocked a justified proposal. It was also <em>less</em> safe on one
        axis: three times more false acceptances.
      </p>

      <p>
        That tradeoff is the interesting part, and it is not random noise.
      </p>

      <h3>Every False Acceptance Came From One Fixture Family</h3>

      <p>
        I pulled the disagreements. All six of Astra&rsquo;s false acceptances
        &mdash; and both of the other model&rsquo;s &mdash; landed on the same
        case type: the packet where the <strong>falsification field was
        blank</strong>, while the underlying template still carried a real
        mechanism, cost assumptions, and a minimum trade count.
      </p>

      <p>Two different readings of the same packet:</p>

      <ul>
        <li>
          <strong>The usual model:</strong> the required field is empty,
          therefore no stated rejection condition, therefore reject.
        </li>
        <li>
          <strong>Astra:</strong> the claim is testable from the registered
          evidence &mdash; run it out-of-sample after costs &mdash; therefore
          accept, while noting the blank field.
        </li>
      </ul>

      <p>
        One model audited the <em>form</em>. The other audited the{" "}
        <em>claim</em>. Neither is wrong in isolation; my prompt never said which
        one I wanted. That is the same pattern as Test 1: when the specification
        has a hole, the stronger model fills it with intent, and the weaker one
        fills it with literalism.
      </p>

      <p>
        Which also means the &ldquo;safer&rdquo; scoreboard was misleading. Lower
        false acceptance came from surface pedantry on one fixture family, not
        from better risk sense &mdash; and it cost 8 wrongly blocked good ideas.
      </p>

      <hr />

      <h2>Test 3: The Whole Loop, Not the Prompt</h2>

      <p>
        Single calls are the easy question. The real question is whether the{" "}
        <em>system</em> improves. So I ran the closed loop on real snapshot code:
      </p>

      <pre><code>{`select candidate → propose → review → real walk-forward
  → outcome ledger → select again (next day)`}</code></pre>

      <p>
        Three independent resets, four simulated days each, two arms (usual
        proposer+skeptic vs Astra in both roles): 24 branch-days, real backtests,
        no mocked evaluation.
      </p>

      <table>
        <thead>
          <tr>
            <th>Result</th>
            <th>Usual stack</th>
            <th>Astra</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Branch-days completed</td>
            <td>12/12</td>
            <td>12/12</td>
          </tr>
          <tr>
            <td>Days blocked by the reviewer</td>
            <td>2</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Main API calls used</td>
            <td>16</td>
            <td>12</td>
          </tr>
          <tr>
            <td>Feedback actually reached the next day</td>
            <td>yes</td>
            <td>yes</td>
          </tr>
          <tr>
            <td>
              <strong>Candidates that cleared the hard gates</strong>
            </td>
            <td>
              <strong>0</strong>
            </td>
            <td>
              <strong>0</strong>
            </td>
          </tr>
        </tbody>
      </table>

      <p>
        Astra moved more ideas into evaluation, using fewer calls, with a stable
        feedback cycle. And it found exactly as many winners as the old stack:
        none.
      </p>

      <p>
        That is not a disappointing result. It is the result that tells you the
        harness is honest. The gates were doing their job before the upgrade, and
        they kept doing it after. A model swap that suddenly produced passing
        strategies would have been evidence of a leak, not of intelligence.
      </p>

      <hr />

      <h2>The Rule I Took Away: Split Judgment From Enforcement</h2>

      <p>
        Put these three results together and the operating change is small,
        specific, and cheap:
      </p>

      <p>
        <strong>Give the stronger model the judgment.</strong> Is this claim
        coherent? Is it independent of what already failed? Is this edge case
        real? That is where +6.1 pp and 0% false rejections live.
      </p>

      <p>
        <strong>Never give it the enforcement.</strong> Required fields, budgets,
        cost scenarios, promotion thresholds, order authority &mdash; those stay
        in deterministic code that cannot be talked out of a decision.
      </p>

      <pre><code>{`# the fix is boring, and it is not a prompt
if not proposal.falsification.strip():
    return Reject("no falsification condition")   # no model discretion

verdict = skeptic_model.review(proposal)          # judgment only
if verdict == "accept" and not gates.pass_all(spec):
    return Reject("failed frozen gates")          # code has the last word`}</code></pre>

      <p>
        Notice what that does to the metric I was worried about: with a blank
        falsification field auto-rejected upstream, Astra&rsquo;s entire false
        acceptance category disappears &mdash; and I keep the zero false
        rejection rate. The better model plus three lines of enforcement beats
        either model alone.
      </p>

      <p>This generalizes past research pipelines:</p>
      <ul>
        <li>
          <strong>Code review</strong> &mdash; model reasons about edge cases;
          CI owns coverage thresholds and required checks.
        </li>
        <li>
          <strong>Hiring</strong> &mdash; model summarizes evidence; the rubric
          owns the bar.
        </li>
        <li>
          <strong>Ops and billing</strong> &mdash; model explains the anomaly;
          policy code owns refunds, entitlements, and limits.
        </li>
      </ul>

      <hr />

      <h2>What I Am Not Claiming</h2>

      <p>
        The fastest way to lose credibility with a model comparison is to let one
        good run become a percentage about everything.
      </p>

      <ul>
        <li>
          <strong>One coding pair.</strong> The &minus;14.7% handoff time is a
          single observation, not a productivity figure.
        </li>
        <li>
          <strong>Constructed review cases.</strong> 50 fixtures around two
          templates, with correlated repeats &mdash; not a production sample.
        </li>
        <li>
          <strong>No cost claim.</strong> Billing was not instrumented, so the
          dollar column stays empty. Astra did use fewer output tokens per
          decision, at higher latency; that is a measurement, not a saving.
        </li>
        <li>
          <strong>No profitability claim.</strong> Zero gates cleared. Nothing
          here says anything about returns.
        </li>
        <li>
          <strong>Not blinded.</strong> I knew which arm was which while
          reviewing patches. The post-hoc cases are labeled as such for exactly
          that reason.
        </li>
      </ul>

      <p>
        The next honest step is not a bigger claim &mdash; it is a v2 test suite
        that includes the two cases I missed, plus alternating run order across
        several fresh pairs.
      </p>

      <hr />

      <h2>Key Takeaways</h2>
      <ol>
        <li>
          <strong>Frozen tests measure your tests.</strong> Both models scored
          100%; only one avoided breaking behavior nobody had written down.
        </li>
        <li>
          <strong>Judgment improved, measurably.</strong> +6.1 pp balanced
          accuracy, 0% wrongly blocked ideas, 100% agreement across repeats.
        </li>
        <li>
          <strong>&ldquo;Safer&rdquo; can be pedantry.</strong> The lower false
          acceptance rate came from rejecting blank fields, and it cost real
          good ideas.
        </li>
        <li>
          <strong>A better model is not a better pipeline.</strong> Same loop,
          zero gate passes, both arms. Outcomes stay earned.
        </li>
        <li>
          <strong>Split the roles.</strong> Model judges the claim, code enforces
          the rules. That combination is strictly better than choosing a
          personality.
        </li>
      </ol>

      <p>
        Every frontier release will offer you a new default. The useful response
        is not adoption or skepticism &mdash; it is a frozen test suite, a paired
        run, and the discipline to report the tie when there is one.
      </p>
    </>
  );
}
