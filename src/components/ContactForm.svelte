<script lang="ts">
  import { Send, CheckCircle, Loader2 } from "lucide-svelte";

  import { pb } from "$lib/pb";

  let isSubmitting = $state(false);
  let formSubmitted = $state(false);
  let errorMessage = $state("");

  let firstName = $state("");
  let lastName = $state("");
  let email = $state("");
  let projectType = $state("custom");
  let message = $state("");

  async function handleSubmit(e: Event) {
    e.preventDefault();
    isSubmitting = true;
    errorMessage = "";

    const formData = {
      firstName,
      lastName,
      email,
      projectType,
      message,
    };

    try {
      await pb
        .collection("leads")
        .create({ contact: email, meta: formData, experiment: "agency" });
      formSubmitted = true;
    } catch (error) {
      errorMessage = "Something went wrong. Please try again.";
    } finally {
      isSubmitting = false;
    }
  }

  function resetForm() {
    formSubmitted = false;
    firstName = "";
    lastName = "";
    email = "";
    projectType = "custom";
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
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div class="form-control">
        <label class="label pb-1" for="firstName">
          <span class="label-text text-xs uppercase tracking-wider opacity-70"
            >First Name</span
          >
        </label>
        <input
          id="firstName"
          type="text"
          placeholder="John"
          class="input bg-base-100/50 border-base-content/10 focus:border-primary focus:bg-base-100 transition-all placeholder:opacity-40"
          bind:value={firstName}
        />
      </div>
      <div class="form-control">
        <label class="label pb-1" for="lastName">
          <span class="label-text text-xs uppercase tracking-wider opacity-70"
            >Last Name</span
          >
        </label>
        <input
          id="lastName"
          type="text"
          placeholder="Doe"
          class="input bg-base-100/50 border-base-content/10 focus:border-primary focus:bg-base-100 transition-all placeholder:opacity-40"
          bind:value={lastName}
        />
      </div>
    </div>

    <div class="form-control">
      <p class="text-xs text-base-content/70 mb-1">
        EMAIL/PHONE <span class="text-error">*</span>
      </p>
      <label class="input pb-1 w-full" for="email">
        <!-- <span class="label text-xs uppercase tracking-wider opacity-70"></span> -->
        <input
          id="email"
          type="text"
          placeholder="john@example.com or +31612345678"
          class="bg-base-100/50 border-base-content/10 focus:border-primary focus:bg-base-100 transition-all placeholder:opacity-40"
          bind:value={email}
          required
        />
      </label>
    </div>

    <div class="form-control">
      <label class="label pb-1 w-full" for="projectType">
        <span class="label-text text-xs uppercase tracking-wider opacity-70"
          >Project Type</span
        >
        <select
          id="projectType"
          class="w-full select bg-base-100/50 border-base-content/10 focus:border-primary focus:bg-base-100 transition-all"
          bind:value={projectType}
          required
        >
          <option value="" disabled>Select a project type</option>
          <option value="mvp">MVP Development</option>
          <option value="custom">Custom Solution</option>
          <option value="partnership">Partnership</option>
          <option value="other">Other</option>
        </select>
      </label>
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
