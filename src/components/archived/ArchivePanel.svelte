<script>
  export let sortedPosts = [];
</script>

<div class="archive-panel-archived">
  <h2>Archive (Archived)</h2>
  <ul>
    {#each sortedPosts as post}
      <li>{post.title}</li>
    {/each}
  </ul>
</div>
