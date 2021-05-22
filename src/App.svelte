<script>
  import {onMount} from "svelte"
  import {formData} from "./store"

  let formQuestions = [
    {id: 0, text: "0 - Tous niveaux"},
    {id: 1, text: "1 - Gold"},
    {id: 2, text: "2 - Platine"},
    {id: 3, text: "3 - Diamant"}
  ]
  let user = {}
  let res = null;

  onMount(async () => {
    const res = await fetch("/auth/me", {
      method: "GET",
      credentials: "include"
    })
    if(res.ok) {
      const data = (await res.json());
      user = data.body
      formData.update(f => ({...f, leader_id: user.id}))
    }
    else window.open("/auth", "_self");
  })

  const handleSubmit = async () => {
    const req = await fetch("/clans", {
      method: "POST",
      body: JSON.stringify($formData),
      headers: {
        'Content-Type': 'application/json'
      },
    })
    const json = await req.json()
    res = json.message;
}

</script>

<svelte:head>
	<title>BrawlFR Clans</title>
	<html lang="fr" />
</svelte:head>

<main>
  {#if user.id}
  <div class="user">
    <p>{user.username}</p>
    <div class="avatar">
      <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} alt="">
    </div>
  </div>
  <div>
    <h1>Conditions</h1>
    <p>Assurez-vous de respected les conditions suivantes si vous souhaitez ajouter votre clan à la liste</p>
    <ul>
      <li>5 membres ou + présents sur le Discord</li>
      <li>Le clan doit être un minimum public c'est-à-dire que les clans entre amis ne seront malheureusement pas acceptés</li>
      <li>Votre clan doit avoir été crée il y a plus de 2 semaines</li>
      <li>Vous devez être le leader de ce clan</li>
    </ul>
  </div>
  <h1>Ajouter un clan</h1>
  <form on:submit|preventDefault={handleSubmit} autocomplete="off" style="display: flex; flex-direction: column; width: 250px;">
    <label for="id">Id Discord</label>
    <input id="id" type="text" disabled bind:value={$formData.leader_id}>

    <label for="name">Nom du clan</label>
    <input id="name" type="text" bind:value={$formData.name} required>

    <label for="alias">Alias</label>
    <input id="alias" type="text" bind:value={$formData.alias}>

    <label for="discord">URL Discord</label>
    <input id="discord" type="text" bind:value={$formData.discord.url} required>
    
    <label>
      <input type=checkbox bind:checked={$formData.discord.private}>
      Mon discord est privé
    </label>
    <label for="level">Niveau requis</label>
    <select id="level" bind:value={$formData.level}>
      {#each formQuestions as question}
      <option value={question.id}>
        {question.text}
      </option>
      {/each}
    </select>

    <input type="submit" />
  </form>
  {#if res}
  <div>
    {res}
  </div>
  {/if}
  {:else}
    <div>Please login first</div>
  {/if}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .user {
    align-items: center;
    display: flex;
    align-self: flex-end;
    padding: 0.5rem;
  }
  .avatar {
    margin-left: 0.5rem;
    height: 40px;
    width: 40px;
    border-radius: 100%;
    overflow: hidden;
  }
  .avatar > img {
    height: 100%;
    widows: auto;
  }
</style>