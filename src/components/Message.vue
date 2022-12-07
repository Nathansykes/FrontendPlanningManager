<template>
    <div class="row">
        <div class="col-md-12">
            <div class="toast show message-toast" :class="self ? 'float-end' : ''" role="alert" aria-live="assertive" aria-atomic="true" >
                <div class="toast-header">
                  <strong class="me-auto">{{title}}</strong>
                  <small>{{(Math.round((((new Date() - sent) % 86400000) % 3600000) / 60000))}} mins ago</small>
                  <button type="button" class="btn-close ms-2 mb-1" data-bs-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true"></span>
                  </button>
                </div>
                <div class="toast-body">
                  {{msg}}
                </div>
              </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Message',
    props: {
        title: String,
        msg: String,
        sent: Date,
        self: Boolean
    },
}

</script>