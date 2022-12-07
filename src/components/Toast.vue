<template>
    <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <strong class="me-auto">{{this.title}}</strong>
          <button type="button" class="btn-close ms-2 mb-1" data-bs-dismiss="toast" aria-label="Close" :id="('close-' + id)">
            <span aria-hidden="true"></span>
          </button>
        </div>
        <div class="toast-body" style="background: rgba(255, 255, 255, 0.85)">
          {{this.msg}}
        </div>
      </div>
</template>

<script>
export default {
    name: 'Toast',
    props: {
        title: String,
        msg: String,
        type: String,
        id: String
    },
}

</script>