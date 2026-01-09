<script lang="ts">
  import { Send, CheckCircle, Loader2 } from "lucide-svelte";

  import { pb } from "$lib/pb";

  let isSubmitting = $state(false);
  let formSubmitted = $state(false);
  let errorMessage = $state("");

  let name = $state("");
  let email = $state("");
  let message = $state("");

  async function handleSubmit(e: Event) {
    e.preventDefault();
    isSubmitting = true;
    errorMessage = "";

    try {
      await pb
        .collection("leads")
        .create({ name, email, message, experiment: "agency-contact" });
      formSubmitted = true;
    } catch (error) {
      errorMessage = "Something went wrong. Please try again.";
    } finally {
      isSubmitting = false;
    }
  }

  function resetForm() {
    formSubmitted = false;
    name = "";
    email = "";
    message = "";
  }
</script>

{#if formSubmitted}
  <!-- Success State -->
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <div
      class="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mb-6 animate-pulse"
    >
      <CheckCircle class="w-10 h-10 text-success" />
    </div>
    <h2 class="text-2xl md:text-3xl font-bold mb-3">Message sent!</h2>
    <p class="text-base-content/70 mb-8 max-w-md">
      Thank you for reaching out. We'll get back to you within 24 hours.
    </p>
    <button type="button" class="btn btn-outline btn-sm" onclick={resetForm}>
      Send another message
    </button>
  </div>
{:else}
  <!-- Form -->
  <form class="space-y-5" onsubmit={handleSubmit}>
    <div class="form-control">
      <p class="text-xs text-base-content/70 mb-1">
        EMAIL <span class="text-error">*</span>
      </p>
      <label class="input pb-1 w-full" for="email">
        <!-- <span class="label text-xs uppercase tracking-wider opacity-70"></span> -->
        <input
          id="email"
          type="text"
          placeholder="your@email.com"
          class="bg-base-100/50 border-base-content/10 focus:border-primary focus:bg-base-100 transition-all placeholder:opacity-40"
          bind:value={email}
          required
        />
      </label>
    </div>

    <div class="">
      <div class="form-control">
        <label class="label pb-1" for="name">
          <span class="label-text text-xs uppercase tracking-wider opacity-70"
            >Name</span
          >
        </label>
        <input
          id="name"
          type="text"
          placeholder="Your name"
          class="w-full input bg-base-100/50 border-base-content/10 focus:border-primary focus:bg-base-100 transition-all placeholder:opacity-40"
          bind:value={name}
        />
      </div>
    </div>

    <div class="form-control">
      <label class="label pb-1 block" for="message">
        <span class="label-text text-xs uppercase tracking-wider opacity-70"
          >Message</span
        >
      </label>
      <textarea
        id="message"
        class="w-full textarea bg-base-100/50 border-base-content/10 focus:border-primary focus:bg-base-100 transition-all placeholder:opacity-40 min-h-32 resize-none"
        placeholder="Tell us about your project..."
        bind:value={message}
      ></textarea>
    </div>

    {#if errorMessage}
      <div class="alert alert-error text-sm">
        <span>{errorMessage}</span>
      </div>
    {/if}

    <button
      type="submit"
      class="btn btn-primary w-full gap-2 mt-2"
      disabled={isSubmitting}
    >
      {#if isSubmitting}
        <Loader2 class="w-4 h-4 animate-spin" />
        Sending...
      {:else}
        Send Message
        <Send class="w-4 h-4" />
      {/if}
    </button>
  </form>
{/if}
