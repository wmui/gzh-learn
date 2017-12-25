<template>
  <transition name="swing">
    <div class="snackbar" v-if='open'>
      <div class="snackbar-content">
        <slot name='body'></slot>
        <slot name='action' @click='$emit("update:open")'></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    open: {
      default: false
    }
  },

  watch: {
    'open': function (newVal, oldVal) {
      if (newVal) {
        var timer = setTimeout(() => {
          this.$emit('update:open', false)
          clearTimeout(timer)
        }, 3 * 1000)
      }
    }
  }
}

</script>

<style lang='sass' src='~/static/sass/snackbar.sass'></style>
