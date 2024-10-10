<template>
  <Transition v-if="isShow" name="fade" mode="in-out">
    <div  ref="modal_container" class="modal-container">
      <div @click="closeModal()" class="modal-layout"></div>
      <div class="modal-content">
        <slot />
      </div>
    </div>
  </Transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';


export default {
  name: 'ModalWrapper',
  methods: {
    ...mapActions({
      closeModal: 'modal/closeModal'
    })
  },
  computed: {
    ...mapGetters({
      isShow: 'modal/isShow'
    })
  },
}
</script>

<style scoped lang="scss">
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin full-width-height {
  width: 100%;
  height: 100%
}

.modal-container {
  @include flex-center;
  @include full-width-height;
  overflow: hidden;
  position: absolute;
  z-index: 3;
  top: 0;
  left: 0;

  .modal-layout {
    @include full-width-height;
    background-color: #000;
    opacity: 0.7;
    z-index: 4;
    position: absolute;
  }

  .modal-content {
    @include flex-center;
    z-index: 4;
    display: flex;
  }
}
</style>
