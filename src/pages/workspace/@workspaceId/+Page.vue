<script lang="ts" setup>
import * as UserHelper from '../../../helpers/user';

import { clientOnly } from 'vike-vue/clientOnly'
const WorkspaceView = clientOnly(() => import('../WorkspaceView.vue'))

UserHelper.updateUserByPageContext();
</script>

<template>
  <WorkspaceView></WorkspaceView>
</template>
