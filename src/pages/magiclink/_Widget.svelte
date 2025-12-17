<script lang="ts">
  import {
    Link2,
    Plus,
    Trash2,
    Settings,
    Check,
    FileText,
    Video,
    Trello,
    Globe,
    MessageSquare,
    ExternalLink,
    Eye,
    Pencil,
    Link as LinkIcon,
  } from "lucide-svelte";

  // State
  let isAdmin = $state(true);
  let title = $state("Global Brand Co");
  let subtitle = $state("ACTIVE PORTAL");
  let footerText = $state("ONE HUB • ALL SLICES");

  type LinkType = "trello" | "figma" | "video" | "doc" | "other";

  interface MagicLink {
    id: string;
    title: string;
    url: string;
    type: LinkType;
  }

  let links = $state<MagicLink[]>([
    {
      id: "1",
      title: "Project Roadmap",
      url: "https://trello.com/b/roadmap",
      type: "trello",
    },
    {
      id: "2",
      title: "Brand Guidelines",
      url: "https://figma.com/file/design",
      type: "figma",
    },
    {
      id: "3",
      title: "Weekly Update",
      url: "https://loom.com/share/update",
      type: "video",
    },
    {
      id: "4",
      title: "Q4 Strategy.pdf",
      url: "/docs/strategy.pdf",
      type: "doc",
    },
  ]);

  function addLink() {
    links.push({
      id: crypto.randomUUID(),
      title: "New Resource",
      url: "",
      type: "other",
    });
  }

  function removeLink(id: string) {
    links = links.filter((l) => l.id !== id);
  }

  const iconMap = {
    trello: Trello,
    figma: Globe,
    video: Video,
    doc: FileText,
    other: Link2,
  };

  const colorMap = {
    trello: "text-blue-500 bg-blue-500/10",
    figma: "text-purple-500 bg-purple-500/10",
    video: "text-red-500 bg-red-500/10",
    doc: "text-amber-500 bg-amber-500/10",
    other: "text-gray-500 bg-gray-500/10",
  };
</script>

<div class="relative w-full max-w-md mx-auto">
  <!-- Interactive Demo Header -->
  <div class="flex flex-col items-center mb-8 gap-4">
    <div
      class="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20"
    >
      <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
      <span class="text-[10px] font-bold uppercase tracking-widest text-primary"
        >Demo</span
      >
    </div>

    <!-- UX Friendly Mode Switcher -->
    <div
      class="bg-base-200/80 backdrop-blur-md p-1 rounded-2xl flex border border-white/5 shadow-inner"
    >
      <button
        onclick={() => (isAdmin = true)}
        class="flex items-center gap-2 px-6 py-2 rounded-xl transition-all duration-300 text-xs font-bold uppercase tracking-wider
        {isAdmin
          ? 'bg-white text-black shadow-lg scale-100'
          : 'text-base-content/40 hover:text-base-content/70 scale-95'}"
      >
        <Pencil class="w-3.5 h-3.5" />
        Admin
      </button>
      <button
        onclick={() => (isAdmin = false)}
        class="flex items-center gap-2 px-6 py-2 rounded-xl transition-all duration-300 text-xs font-bold uppercase tracking-wider
        {!isAdmin
          ? 'bg-white text-black shadow-lg scale-100'
          : 'text-base-content/40 hover:text-base-content/70 scale-95'}"
      >
        <Eye class="w-3.5 h-3.5" />
        Client
      </button>
    </div>
  </div>

  <!-- Widget Container -->
  <div
    class="card-float bg-white shadow-2xl border-none overflow-hidden p-0! rounded-[2.5rem]! flex flex-col min-h-[550px] transition-all duration-500 {isAdmin
      ? 'ring-2 ring-primary/20 ring-offset-4 ring-offset-transparent'
      : ''}"
  >
    <!-- Hub Header -->
    <div class="p-8 pb-4">
      <div class="flex items-center gap-4 mb-8">
        <div
          class="w-14 h-14 rounded-full bg-wow flex items-center justify-center text-black font-bold text-xl transition-transform duration-500 {isAdmin
            ? 'rotate-12'
            : ''}"
        >
          {title.substring(0, 2).toUpperCase()}
        </div>
        <div class="flex-1 min-w-0">
          {#if isAdmin}
            <input
              bind:value={title}
              class="bg-transparent border-none focus:ring-0 font-bold text-black text-lg w-full p-0 focus:outline-none placeholder:opacity-20"
              placeholder="Client Name"
            />
            <div class="flex items-center gap-1">
              <div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <input
                bind:value={subtitle}
                class="bg-transparent border-none focus:ring-0 text-[10px] text-green-500 font-bold uppercase tracking-wider w-full p-0 focus:outline-none"
                placeholder="Status"
              />
            </div>
          {:else}
            <h4 class="font-bold text-black text-lg truncate">{title}</h4>
            <p
              class="text-[10px] text-green-500 font-bold flex items-center gap-1 uppercase tracking-wider"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"
              ></span>
              {subtitle}
            </p>
          {/if}
        </div>
        {#if !isAdmin}
          <div class="flex -space-x-2">
            <div
              class="w-8 h-8 rounded-full border-2 border-white bg-gray-200"
            ></div>
            <div
              class="w-8 h-8 rounded-full border-2 border-white bg-primary text-white text-[10px] flex items-center justify-center font-bold"
            >
              +2
            </div>
          </div>
        {/if}
      </div>

      <!-- Links List -->
      <div class="space-y-3">
        {#each links as link (link.id)}
          {#if isAdmin}
            <!-- Admin Resource Item -->
            <div
              class="flex flex-col p-4 rounded-2xl bg-gray-50 border border-black/5 gap-3 group relative transition-all hover:bg-white hover:shadow-md"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 {colorMap[
                    link.type
                  ] || colorMap.other}"
                >
                  {#if link.type === "trello"}<Trello class="w-4 h-4" />
                  {:else if link.type === "figma"}<Globe class="w-4 h-4" />
                  {:else if link.type === "video"}<Video class="w-4 h-4" />
                  {:else if link.type === "doc"}<FileText class="w-4 h-4" />
                  {:else}<Link2 class="w-4 h-4" />{/if}
                </div>
                <div class="flex-1">
                  <input
                    bind:value={link.title}
                    class="bg-transparent border-none focus:ring-0 font-bold text-sm text-black/70 p-0 h-5 w-full focus:outline-none"
                    placeholder="Resource Title"
                  />
                  <select
                    bind:value={link.type}
                    class="bg-transparent border-none focus:ring-0 text-[9px] uppercase font-bold opacity-30 p-0 h-4 focus:outline-none cursor-pointer w-full"
                  >
                    <option value="trello">Trello</option>
                    <option value="figma">Design</option>
                    <option value="video">Update</option>
                    <option value="doc">Document</option>
                    <option value="other">Link</option>
                  </select>
                </div>
                <button
                  onclick={() => removeLink(link.id)}
                  class="btn btn-ghost btn-xs btn-circle text-error opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
              <div class="flex items-center gap-2 pl-11">
                <LinkIcon class="w-3 h-3 opacity-20" />
                <input
                  bind:value={link.url}
                  class="bg-transparent border-none focus:ring-0 text-[10px] text-primary w-full p-0 h-4 focus:outline-none font-mono"
                  placeholder="Paste URL here..."
                />
              </div>
            </div>
          {:else}
            <!-- Client Resource Item -->
            <a
              href={link.url}
              target="_blank"
              class="group relative flex items-center justify-between h-14 w-full rounded-2xl bg-gray-50/50 hover:bg-white hover:shadow-lg transition-all px-4 border border-transparent hover:border-black/5 no-underline"
            >
              <div class="flex items-center gap-4 flex-1 min-w-0">
                <div
                  class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 {colorMap[
                    link.type
                  ] || colorMap.other}"
                >
                  {#if link.type === "trello"}<Trello class="w-4 h-4" />
                  {:else if link.type === "figma"}<Globe class="w-4 h-4" />
                  {:else if link.type === "video"}<Video class="w-4 h-4" />
                  {:else if link.type === "doc"}<FileText class="w-4 h-4" />
                  {:else}<Link2 class="w-4 h-4" />{/if}
                </div>
                <span class="text-sm font-bold text-black/70 truncate"
                  >{link.title}</span
                >
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <div
                  class="w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors"
                ></div>
                <ExternalLink
                  class="w-3.5 h-3.5 text-black/10 group-hover:text-primary transition-colors"
                />
              </div>
            </a>
          {/if}
        {/each}

        {#if isAdmin}
          <button
            onclick={addLink}
            class="cursor-pointer w-full h-14 rounded-2xl border-2 border-dashed border-black/5 hover:border-primary/20 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-sm font-bold opacity-30 hover:opacity-100 mt-4"
          >
            <Plus class="w-4 h-4" />
            Add Resource
          </button>
        {/if}
      </div>
    </div>

    <!-- Hub Footer -->
    <div class="mt-auto p-8 pt-4 border-t border-black/5 text-center">
      {#if isAdmin}
        <input
          bind:value={footerText}
          class="bg-transparent border-none focus:ring-0 text-[10px] font-bold opacity-30 tracking-[0.2em] text-center uppercase w-full p-0 focus:outline-none"
        />
      {:else}
        <div
          class="text-[10px] font-bold opacity-30 tracking-[0.2em] uppercase"
        >
          {footerText}
        </div>
      {/if}
    </div>
  </div>

  <!-- Background Glow -->
  <div
    class="absolute -inset-10 bg-primary/5 blur-3xl -z-10 rounded-full transition-opacity duration-500 {isAdmin
      ? 'opacity-100'
      : 'opacity-0'}"
  ></div>
</div>

<style>
  /* Ensuring background for the logo circle matches the hero theme */
  .bg-wow {
    background: linear-gradient(
      135deg,
      oklch(65% 0.25 280) 0%,
      oklch(70% 0.18 200) 100%
    );
  }

  /* Custom Select styling to remove default arrow in some browsers if needed */
  select {
    appearance: none;
  }
</style>
