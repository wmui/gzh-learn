<template>
	<div class="cell">
	  <span>{{title}}</span>
	  <span v-if='content'>{{content}}</span>
	</div>
</template>

<script>
export default {
  props: {
    title: String,
    content: Number
  }
}
</script>
<style scoped lang='sass' src='~/static/sass/cell.sass'></style>
