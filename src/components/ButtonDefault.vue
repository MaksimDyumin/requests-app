<template>
  <button @click="$emit('click')" class="btn"><slot /></button>
</template>

<script>
export default {
  name: 'ButtonDefault',
}
</script>

<style scoped lang="scss">
$underline-color: #CCCCCC;
$main-color: #50B053;

.btn{
  background-color: $main-color;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 35px;
  font-size: 14px;
  box-shadow: 0px 4px 4px 0px #6AAE5E40;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:hover {
  background-color: darkgreen !important;
}

.btn:active {
  background-color: #3c8b3f;
}
.btn:focus {
  box-shadow: 0 0 5px #154516
}
</style>
