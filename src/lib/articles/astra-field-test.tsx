import { ThreeLayerScoreboard } from "@/components/diagrams/three-layer-scoreboard";

export function AstraFieldTestContent() {
  return (
    <>
      <p>
        <strong>In one sentence:</strong> I gave GPT-6 Astra the same work
        GPT-5.6 Terra already does for me, measured three layers of it, and found
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
        So I ran three controlled comparisons against my daily driver,{" "}
        <strong>GPT-5.6 Terra</strong>. Every comparison used the same rules:
        byte-identical prompts, the same source snapshot, one attempt per model,
        no corrective prompts mid-run, and test suites frozen and hashed before
        either model saw the task.
      </p>

      <p>
        I ran three, because &ldquo;is it better?&rdquo; is really three separate
        questions.
      </p>

      <ThreeLayerScoreboard />

      <h2>The Five Conclusions, Up Front</h2>

      <ol>
        <li>
          <strong>Frozen tests measure your tests.</strong> GPT-5.6 Terra and
          GPT-6 Astra both passed all 16. Astra kept the original behaviour on
          two edge cases the suite never asked about; Terra introduced
          regressions on both.
        </li>
        <li>
          <strong>Astra judged better, and it is measurable.</strong> +6.1 pp
          balanced accuracy for Astra over Terra across 300 matched calls. Astra
          wrongly blocked 0% of sound proposals (Terra: 16.7%) and gave the same
          verdict on every repeat (Terra: 88%).
        </li>
        <li>
          <strong>&ldquo;Safer&rdquo; can just be pedantry.</strong>{" "}
          Terra&rsquo;s lower false-acceptance rate came from rejecting an empty
          field, not from better risk sense &mdash; and it cost 8 wrongly blocked
          good ideas. Astra accepted those packets by auditing the claim, not
          the blank form field.
        </li>
        <li>
          <strong>A better model is not a better pipeline &mdash; yet.</strong>{" "}
          Astra and Terra both ran 12 hypotheses and both got 0 promotions. That
          is the expected reading for a short research loop, not a failure. It
          also means we need more branch-days before the loop can rank the two
          models on outcomes.
        </li>
        <li>
          <strong>Split judgment from enforcement.</strong> Prefer Astra for
          claim judgment; keep required fields, budgets, and promotion
          thresholds in deterministic code. That beats picking a favourite model
          alone.
        </li>
      </ol>

      <p>The rest of this piece is how each number was produced.</p>

      <hr />

      <h2>Test 1: The Exam You Wrote vs the Cases You Forgot</h2>

      <p>
        <strong>The bug.</strong> A time-bucketing function: it takes a stream of
        timestamped records and groups them into fixed-width intervals, returning
        only the intervals that are already complete. When the input window
        overlapped a previous one, it returned a <em>different</em> set of
        completed intervals for the same underlying records &mdash; so two
        consumers of the same function disagreed about what had already happened.
      </p>

      <p>
        <strong>The setup.</strong> Before either model ran, I wrote and hashed
        16 tests: 6 for correctness, 8 for robustness, 2 as regression guards
        against behaviour that already worked. Both models then received the same
        prompt bytes and the same source snapshot, and each got one attempt.
      </p>

      <table>
        <thead>
          <tr>
            <th>Measure</th>
            <th>Starting code</th>
            <th>GPT-5.6 Terra</th>
            <th>GPT-6 Astra</th>
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
        <strong>The result: a tie.</strong> Zero percentage points between them.
        If I had stopped there, the honest headline would be &ldquo;new model,
        same result, slightly faster.&rdquo;
      </p>

      <p>
        Then I read the patches &mdash; not the size of the diffs, but the
        assumptions inside them. Two assumptions looked load-bearing, so I built
        two extra inputs and ran them against both finished patches{" "}
        <em>and</em> the original code:
      </p>

      <table>
        <thead>
          <tr>
            <th>Extra input</th>
            <th>Original</th>
            <th>GPT-5.6 Terra</th>
            <th>GPT-6 Astra</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Timestamps stored at microsecond resolution</td>
            <td>2 intervals</td>
            <td>0 intervals</td>
            <td>2 intervals</td>
          </tr>
          <tr>
            <td>Empty input with no columns (what the real source returns)</td>
            <td>empty</td>
            <td>raises</td>
            <td>empty</td>
          </tr>
        </tbody>
      </table>

      <p>
        Both failures were <strong>introduced</strong> by the Terra patch
        relative to the code we started from, and both passed the frozen suite
        anyway. The patch hard-coded one timestamp unit in its arithmetic, so
        finer-grained inputs silently produced nothing. It also validated
        required columns unconditionally, so the data source&rsquo;s normal
        &ldquo;no rows yet&rdquo; response became a crash instead of an empty
        result.
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
        <strong>The job.</strong> My research pipeline has a skeptic role: read a
        proposal, then either accept it for an expensive out-of-sample test or
        reject it. A wrong rejection throws away a good idea. A wrong acceptance
        burns compute and puts a bad result into the permanent ledger.
      </p>

      <p>
        <strong>The setup.</strong> I wrote 50 proposal packets by hand: some
        sound, some sound-but-caveated, and some deliberately bad &mdash;
        unfalsifiable claims, guaranteed-profit claims, costs assumed away,
        parameters retuned after seeing the answer, date ranges chosen with
        hindsight, invented results, and requests to skip straight to a live
        order. Each packet went to each model 3 times with identical payloads and
        the same low reasoning effort: <strong>300 API calls</strong> total, with
        the correct verdict for every packet fixed in advance.
      </p>

      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>GPT-5.6 Terra</th>
            <th>GPT-6 Astra</th>
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
        <strong>The result.</strong> Astra was more accurate, gave the same
        verdict every time it saw the same packet, and never blocked a justified
        proposal. It was also <em>less</em> safe on one axis: three times more
        false acceptances. That tradeoff is the interesting part, and it turned
        out not to be noise.
      </p>

      <h3>Every False Acceptance Came From One Kind of Packet</h3>

      <p>
        I read every disagreement. All six of Astra&rsquo;s false acceptances
        &mdash; and both of Terra&rsquo;s &mdash; landed on the same packet type:
        the one where the <strong>&ldquo;how would this be proven
        wrong?&rdquo;</strong> field was left blank, while the rest of the packet
        still described a real mechanism, real costs, and a minimum sample size.
      </p>

      <p>Two defensible readings of that same packet:</p>

      <ul>
        <li>
          <strong>Terra:</strong> a required field is empty, so no rejection
          condition was stated, so reject.
        </li>
        <li>
          <strong>Astra:</strong> the claim is still testable from the evidence
          that <em>is</em> there &mdash; run it out-of-sample after costs &mdash;
          so accept, and flag the blank field.
        </li>
      </ul>

      <p>
        One model audited the <em>form</em>. The other audited the{" "}
        <em>claim</em>. Neither is wrong on its own; my prompt never said which I
        wanted. That is the same pattern as Test 1: when the specification has a
        hole, the stronger model fills it with intent and the weaker one fills it
        with literalism.
      </p>

      <p>
        Which means the &ldquo;safer&rdquo; scoreboard was misleading. Terra&rsquo;s
        lower false-acceptance rate came from rejecting an empty field, not from
        better risk sense &mdash; and it cost 8 wrongly blocked good ideas.
      </p>

      <hr />

      <h2>Test 3: The Whole Loop, Not the Prompt</h2>

      <p>
        A single good answer is the easy question. The real question is whether
        the <em>system</em> gets better over time. So I ran the whole closed loop
        on real snapshot code:
      </p>

      <pre><code>{`pick a candidate → propose a change → review it → run a real backtest
  → write the outcome to a ledger → pick again tomorrow, knowing that`}</code></pre>

      <p>
        <strong>The setup.</strong> Three independent resets, four simulated days
        each, two arms &mdash; Terra as both proposer and skeptic, versus Astra in
        both roles. That is 24 branch-days with real backtests and nothing about
        the evaluation mocked out.
      </p>

      <table>
        <thead>
          <tr>
            <th>Result</th>
            <th>GPT-5.6 Terra</th>
            <th>GPT-6 Astra</th>
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
        Astra moved more ideas into evaluation, used fewer calls to do it, and
        kept the feedback cycle intact. It also promoted exactly as many
        candidates as Terra did: none.
      </p>

      <h3>Zero Is Normal &mdash; and Too Short to Rank the Models</h3>

      <p>
        Every branch-day here is a hypothesis test, not a lottery ticket. A
        candidate is proposed, and the frozen gates &mdash; out-of-sample
        performance after costs, a minimum sample size, stability across the
        window &mdash; decide whether the evidence is strong enough to promote
        it. The base rate for a freshly generated candidate clearing gates like
        those is low; that is exactly why the gates exist.
      </p>

      <p>
        So &ldquo;Astra: 0 of 12; Terra: 0 of 12&rdquo; is the pipeline
        reporting that it worked. The gates were doing their job before the model
        swap and they kept doing it after. A model change that suddenly started
        producing passing candidates on the same data would have been the
        alarming result &mdash; evidence of a leak, not of intelligence.
      </p>

      <p>
        It also means this layer is honest about its own limits. With zero
        promotions in both arms over only 24 branch-days, it cannot yet rank
        Astra against Terra on the quality of their <em>output</em>. What it can
        show &mdash; and does &mdash; is that the loop runs end to end, that
        yesterday&rsquo;s rejection reaches tomorrow&rsquo;s proposal, and that
        the Astra arm reached the same verdict with fewer blocks and fewer API
        calls. Ranking the models on promotions needs a longer run: more
        branch-days, more resets, or a softer gate that still rejects most
        candidates but lets a few through.
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

      <p>
        Every frontier release will offer you a new default. The useful response
        is not adoption or skepticism &mdash; it is a frozen test suite, a paired
        run, a hypothesis you were willing to see rejected, and the discipline to
        report the tie when there is one.
      </p>
    </>
  );
}
