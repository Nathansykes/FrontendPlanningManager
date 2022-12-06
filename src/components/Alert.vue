<template>
  <div :class="type + ' alert alert-dismissible fade show'" role="alert" :id="id">
    {{ msg }}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" :id="('close-' + id)"></button>
  </div>
</template>

<script>
export default {
  name: 'Alert',
  props: {
    msg: String,
    type: String,
    id: String
  },

};
</script>