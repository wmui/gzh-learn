<template>
	<div class="user">
		user
	</div>
</template>
<script>
export default {
	middleware: 'wechat-auth',
	mounted () {
		console.log(this.$store.state.authUser)
	}
}
</script>
