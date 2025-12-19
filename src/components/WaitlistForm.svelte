<script module>
  let submitted = $state(false);
</script>

<script lang="ts">
  import { ArrowRight, Check, CheckCircle, Loader2, Mail } from "lucide-svelte";

  import { pb } from "$lib/pb";

  let {
    experiment = "magiclink",
    intent = "hero",
    buttonLabel = "Create Your Portal for Free",
    subtext = "No credit card needed. Set up in 2 minutes.",
    placeholder = "Work email",
    accented = true,
    column = false,
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
  <div
    class="glass-panel rounded-3xl p-6 md:p-8 flex flex-col items-center text-center gap-4 animate-in"
  >
    <div
      class="w-12 h-12 md:w-16 md:h-16 rounded-full bg-success/10 flex items-center justify-center mb-1 md:mb-2"
    >
      <CheckCircle class="w-8 h-8 md:w-10 md:h-10 text-success" />
    </div>
    <div class="min-w-0">
      <h3 class="text-lg md:text-xl font-bold">You're on the list!</h3>
      <p class="text-sm md:text-base text-base-content/70 mt-2 max-w-xs">
        We'll reach out to <strong>{email}</strong> when early access is ready.
      </p>
      <button
        type="button"
        class="btn btn-ghost btn-sm mt-4 md:mt-6 opacity-50 hover:opacity-100 transition-opacity"
        onclick={reset}
      >
        Add another email
      </button>
    </div>
  </div>
{:else}
  <div class={accented ? "relative group" : ""}>
    {#if accented}
      <!-- Accented version with glow effect -->
      <div
        class="relative glass-panel rounded-3xl px-4 py-6 md:p-8 border-2 border-primary/20 shadow-2xl transition-all duration-500 hover:border-primary/40 group-hover:shadow-primary/10"
      >
        <!-- Animated Background Glow -->
        <div
          class="absolute inset-0 rounded-3xl bg-linear-to-br from-primary/10 via-transparent to-accent/5 opacity-50 pointer-events-none"
        ></div>

        <div class="relative">
          <div class="flex items-center gap-2 mb-4 md:mb-6 px-1">
            <div class="relative">
              <div
                class="w-2.5 h-2.5 rounded-full bg-primary animate-ping opacity-75 absolute inset-0"
              ></div>
              <div class="w-2.5 h-2.5 rounded-full bg-primary relative"></div>
            </div>
            <span
              class="text-[10px] uppercase tracking-[0.2em] text-primary font-bold"
              >Limited Early Access</span
            >
          </div>

          <form class="w-full space-y-3 md:space-y-4" onsubmit={handleSubmit}>
            <div class="relative">
              <label
                class="input input-lg w-full bg-base-100/40 border-white/5 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-300 h-14 md:h-16 rounded-2xl flex items-center gap-3 px-4"
              >
                <Mail
                  class="w-4 h-4 md:w-5 md:h-5 opacity-30 group-focus-within:opacity-100 transition-opacity"
                />
                <input
                  type="email"
                  {placeholder}
                  class="grow bg-transparent border-none focus:ring-0 text-sm md:text-lg"
                  bind:value={email}
                  required
                />
              </label>
            </div>

            <button
              type="submit"
              class="btn btn-glow w-full h-14 md:h-16 rounded-2xl gap-3 text-sm md:text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all px-4"
              disabled={isSubmitting}
            >
              {#if isSubmitting}
                <Loader2 class="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                <span>Processing...</span>
              {:else}
                <span class="truncate">{buttonLabel}</span>
                <ArrowRight
                  class="w-5 h-5 md:w-6 md:h-6 shrink-0 group-hover:translate-x-1 transition-transform"
                />
              {/if}
            </button>

            {#if subtext}
              <div
                class="pt-2 text-[11px] text-base-content/50 flex items-center justify-center gap-2 font-medium"
              >
                <Check class="w-3.5 h-3.5 text-success/70" />
                {subtext}
              </div>
            {/if}

            {#if errorMessage}
              <div
                class="alert alert-error mt-4 text-sm rounded-xl py-3 border-none bg-error/10 text-error"
              >
                <span class="font-bold">{errorMessage}</span>
              </div>
            {/if}
          </form>
        </div>
      </div>
    {:else}
      <!-- Regular version - streamlined and tasty -->
      <form class="w-full" onsubmit={handleSubmit}>
        <div
          class={column
            ? "flex flex-col gap-2"
            : "flex flex-col sm:flex-row gap-2"}
        >
          <label
            class="input input-lg bg-base-100/50 border-white/5 flex-1 h-14 rounded-xl flex items-center gap-3 px-4 focus-within:border-primary/30 transition-all"
          >
            <Mail class="w-4 h-4 opacity-30" />
            <input
              type="email"
              {placeholder}
              class="grow bg-transparent border-none focus:ring-0"
              bind:value={email}
              required
            />
          </label>
          <button
            type="submit"
            class="btn btn-glow h-14 rounded-xl gap-2 font-bold px-8 shadow-lg shadow-primary/10"
            disabled={isSubmitting}
          >
            {#if isSubmitting}
              <Loader2 class="w-4 h-4 animate-spin" />
            {:else}
              {buttonLabel}
              <ArrowRight class="w-4 h-4" />
            {/if}
          </button>
        </div>

        {#if subtext}
          <div
            class="mt-3 text-[10px] text-base-content/40 text-center sm:text-left font-bold uppercase tracking-widest px-1"
          >
            {subtext}
          </div>
        {/if}

        {#if errorMessage}
          <div
            class="alert alert-error mt-3 text-xs rounded-lg py-2 bg-error/10 border-none text-error"
          >
            <span>{errorMessage}</span>
          </div>
        {/if}
      </form>
    {/if}
  </div>
{/if}
