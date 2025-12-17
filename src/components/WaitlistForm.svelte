<script module>
  let submitted = $state(false);
</script>

<script lang="ts">
  import { ArrowRight, Check, CheckCircle, Loader2 } from "lucide-svelte";

  import { pb } from "../lib/pb";

  let {
    experiment = "magiclink",
    intent = "hero",
    buttonLabel = "Create Your Portal for Free",
    subtext = "No credit card needed. Set up in 2 minutes.",
    placeholder = "Work email",
    accented = false,
  } = $props();

  let email = $state("");
  let isSubmitting = $state(false);
  let errorMessage = $state("");

  async function handleSubmit(e: Event) {
    e.preventDefault();
    errorMessage = "";
    isSubmitting = true;

    try {
      const href = typeof window !== "undefined" ? window.location.href : "";
      const referrer = typeof document !== "undefined" ? document.referrer : "";

      await pb.collection("leads").create({
        contact: email,
        meta: {
          email,
          intent,
          href,
          referrer,
        },
        experiment,
      });

      submitted = true;
    } catch (error) {
      errorMessage = "Something went wrong. Please try again.";
    } finally {
      isSubmitting = false;
    }
  }

  function reset() {
    submitted = false;
    email = "";
    errorMessage = "";
  }
</script>

{#if submitted}
  <div class="glass-panel rounded-2xl p-6 flex items-start gap-4">
    <div class="mt-0.5">
      <CheckCircle class="w-6 h-6 text-success" />
    </div>
    <div class="min-w-0">
      <div class="font-semibold">You're on the list.</div>
      <div class="text-sm text-base-content/70 mt-1">
        We'll reach out when early access is ready.
      </div>
      <button type="button" class="btn btn-soft mt-3" onclick={reset}>
        Add another email
      </button>
    </div>
  </div>
{:else}
  <div class={accented ? "relative" : ""}>
    {#if accented}
      <!-- Accented version with glow effect, кнопка блочно под инпутом -->
      <div
        class="relative glass-panel rounded-2xl p-6 md:p-8 border-2 border-primary/30 shadow-2xl shadow-primary/20"
      >
        <div
          class="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/10 via-transparent to-accent/10 opacity-50"
        ></div>
        <div class="relative">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span
              class="text-xs uppercase tracking-wider text-primary font-semibold"
              >Early Access</span
            >
          </div>

          <form class="w-full" onsubmit={handleSubmit}>
            <div>
              <label
                class="input-lg input w-full bg-base-100/80 border-primary/30 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
              >
                <input
                  type="text"
                  {placeholder}
                  class="w-full bg-transparent"
                  bind:value={email}
                  required
                />
              </label>
            </div>
            <button
              type="submit"
              class="btn btn-glow w-full gap-2 text-lg px-8 py-3 mt-3"
              disabled={isSubmitting}
            >
              {#if isSubmitting}
                <Loader2 class="w-5 h-5 animate-spin" />
                Joining...
              {:else}
                {buttonLabel}
                <ArrowRight class="w-5 h-5" />
              {/if}
            </button>

            <div
              class="mt-3 text-xs text-base-content/60 flex items-center gap-2"
            >
              <Check class="w-4 h-4 text-success" />
              {subtext}
            </div>

            {#if errorMessage}
              <div class="alert alert-error mt-3 text-sm">
                <span>{errorMessage}</span>
              </div>
            {/if}
          </form>
        </div>
      </div>
    {:else}
      <!-- Regular version -->
      <form class="w-full" onsubmit={handleSubmit}>
        <div class="flex flex-col sm:flex-row gap-3">
          <label class="input w-full sm:flex-1">
            <input
              type="text"
              {placeholder}
              class="w-full"
              bind:value={email}
              required
            />
          </label>
          <button
            type="submit"
            class="btn btn-glow w-full sm:w-auto gap-2"
            disabled={isSubmitting}
          >
            {#if isSubmitting}
              <Loader2 class="w-4 h-4 animate-spin" />
              Joining...
            {:else}
              {buttonLabel}
              <ArrowRight class="w-4 h-4" />
            {/if}
          </button>
        </div>

        <div class="mt-2 text-xs text-base-content/60">{subtext}</div>

        {#if errorMessage}
          <div class="alert alert-error mt-3 text-sm">
            <span>{errorMessage}</span>
          </div>
        {/if}
      </form>
    {/if}
  </div>
{/if}
