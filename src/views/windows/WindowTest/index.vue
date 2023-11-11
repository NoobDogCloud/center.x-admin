<template>
    <div>
        <el-button text @click="outerVisible = true">open the outer Dialog</el-button>
        <el-dialog v-model="outerVisible" title="Outer Dialog">
            <template #default>
                <el-button text @click="dialogFormVisible = true">open a Form nested Dialog</el-button>
                <el-dialog v-model="dialogFormVisible" width="600px" title="Shipping address">
                    <el-form :model="form">
                        <el-form-item label="Promotion name" :label-width="formLabelWidth">
                            <el-input v-model="form.name" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="Zones" :label-width="formLabelWidth">
                            <el-select v-model="form.region" placeholder="Please select a zone">
                                <el-option label="Zone No.1" value="shanghai" />
                                <el-option label="Zone No.2" value="beijing" />
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">Cancel</el-button>
                            <el-button type="primary" @click="dialogFormVisible = false">Confirm</el-button>
                        </span>
                    </template>
                </el-dialog>
            </template>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="outerVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="innerVisible = true">
                        open the inner Dialog
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script name='WindowTest' setup>
const outerVisible = ref(false)
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
const form = reactive({
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: ''
})
</script>
